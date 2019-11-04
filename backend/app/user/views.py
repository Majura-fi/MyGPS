from flask import request, jsonify, make_response, session

from app.extensions import db
from app.extensions import limiter
from app.extensions import basicAuth
from app.user.models import User
from app.exceptions import UserUpdateException

from ..user import user


@user.route('/register', methods=['POST'])
@limiter.limit("1/minute")
def register_user():
    """ Attempts to register a new user. """

    request_content = request.form
    if request.is_json:
        request_content = request.get_json()

    if 'display_name' not in request_content:
        return make_response('The name is missing!'), 400
    if 'email' not in request_content:
        return make_response('The email is missing!'), 400
    if 'password' not in request_content:
        return make_response('The password is missing!'), 400

    display_name = request_content.get('display_name', '')
    ok, error = User.validate_name(display_name)
    if not ok:
        return make_response(error), 400

    password = request_content.get('password')
    ok, error = User.validate_password(password)
    if not ok:
        return make_response(error), 400

    email = request_content.get('email')
    ok, error = User.validate_email(email)
    if not ok:
        return make_response(error), 400

    new_user = User.query.filter_by(email=email).first()
    if new_user:
        return jsonify('User already exists!'), 409

    new_user = User(name=display_name, email=email, password=password)

    #pylint: disable=no-member
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"email": email, "display_name": display_name})


@user.route('/profile', methods=['GET'])
@basicAuth.login_required
def get_profile():
    """ Fetches user's profile. """

    user_id = session['user_id']
    reg_user = User.query.filter_by(id=user_id).first_or_404()
    obj = reg_user.serialize
    obj.pop('password', None)
    #obj.pop('email', None)
    return jsonify(obj)


@user.route('/check_name', methods=['POST'])
def check_name_availability():
    """ Check if the name is free. """

    request_content = request.form
    if request.is_json:
        request_content = request.get_json()

    name = request_content.get('name', '').strip()
    if not name:
        return make_response('Name required!'), 400
    if len(name) < 4:
        return make_response('Name too short!'), 400

    existing_user = User.query.filter_by(display_name=name).first()
    available = not bool(existing_user)
    return jsonify({"available": available})


@user.route('/api_key', methods=['PATCH'])
@basicAuth.login_required
def regenerate_api_key():
    """ Regenerates new api key for the user. """

    user_id = session['user_id']
    reg_user = User.query.filter_by(id=user_id).first_or_404()
    reg_user.regenerate_api_key()

    #pylint: disable=no-member
    db.session.commit()

    return jsonify(reg_user.serialize)


@user.route('/api_key', methods=['DELETE'])
@basicAuth.login_required
def remove_api_key():
    """ Removes api key from user. """

    user_id = session['user_id']
    reg_user = User.query.filter_by(id=user_id).first_or_404()
    reg_user.api_key = None

    #pylint: disable=no-member
    db.session.commit()

    return jsonify(reg_user.serialize)


@user.route('/', methods=['PATCH'])
def patch_user(user_id):
    """ Patch user with new information. """
    reg_user = User.query.filter_by(id=user_id).first_or_404()

    request_content = request.form
    if request.is_json:
        request_content = request.get_json()

    try:
        if 'current_password' in request_content and 'new_password' in request_content:
            reg_user.update_password(
                request_content.get('current_password'),
                request_content.get('new_password'))

        if 'new_display_name' in request_content:
            reg_user.update_display_name(
                request_content.get('new_display_name', '').strip()
            )

        if 'new_email' in request_content:
            new_email = request_content.get('new_email', '').strip()
            reg_user.email = new_email

    except UserUpdateException as e:
        return make_response(str(e)), 400

    #pylint: disable=no-member
    db.session.commit()

    obj = reg_user.serialize
    obj.pop('password', None)
    return jsonify(obj)
