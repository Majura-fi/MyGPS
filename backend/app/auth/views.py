#from datetime import datetime, timedelta
#from functools import wraps
#
#from jwt import JWT
#from jwt.exceptions import JWTEncodeError, JWTDecodeError
#
from flask import current_app, session, make_response, request, jsonify

from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature
from itsdangerous import SignatureExpired

from app.extensions import basicAuth
from app.user.models import User

from ..auth import auth

ONE_DAY = 24 * 60 * 60
ONE_MONTH = 30 * ONE_DAY
ONE_YEAR = 12 * ONE_MONTH


@auth.route('/login', methods=['POST'])
def login():
    """ Generates logged-in token """

    content = request.form
    if request.is_json:
        content = request.get_json()

    email = content.get('email')
    password = content.get('password')

    if not email or not password:
        return make_response('Email or password missing!'), 400

    reg_user = User.query.filter_by(email=email).first()
    if not reg_user or not reg_user.check_password(password):
        return make_response('Wrong email or password!'), 400

    token = generate_auth_token(reg_user.id, expiration=ONE_YEAR)

    obj = reg_user.serialize
    obj.pop('password', None)
    obj['token'] = token.decode('ascii')
    return jsonify(obj)


@basicAuth.verify_password
def verify_password(email_or_token, password):
    print("Got payload1: " + str(email_or_token))
    print("Got payload2: " + str(password))

    # Try auth by token.
    ok, user_id = verify_by_token(email_or_token)
    if ok:
        session['user_id'] = user_id
        print("Saved user id to session: " + str(user_id))
        return True

    # Try auth by username and password.
    ok, user_id = verify_by_password(email_or_token, password)
    if ok:
        session['user_id'] = user_id
        print("Saved user id to session: " + str(user_id))
        return True

    session['user_id'] = None
    return False


def verify_by_password(email, password):
    user = User.query.filter_by(email=email).first()
    if not user:
        return False, None

    ok = user.check_password(password)
    return ok, user.id


def verify_by_token(token):
    s = Serializer(current_app.secret_key)
    try:
        data = s.loads(token)
    except SignatureExpired:
        return False, None
    except BadSignature:
        return False, None
    return True, data['user_id']


def generate_auth_token(user_id, expiration=600):
    s = Serializer(current_app.secret_key, expires_in=expiration)
    return s.dumps({'user_id': user_id})


def verify_auth_token(token):
    s = Serializer(current_app.secret_key)
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None
    except BadSignature:
        return None
    return User.query.get(data['id'])
