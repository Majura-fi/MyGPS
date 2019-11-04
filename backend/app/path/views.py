from datetime import datetime, timedelta
from flask import (
    request,
    jsonify,
    make_response
)
from dateutil.parser import parse as parse_date
from dateutil.relativedelta import relativedelta

from app.extensions import db
from app.path.models import PathMeta, RecordedLocation
from app.extensions import limiter

from ..path import path
from ..user.models import User


@path.route('/list', methods=['GET'])
def get_paths():
    """Fetches all meta objects for all paths."""
    YEAR_OLD = datetime.utcnow() - relativedelta(months=+12)
    res = PathMeta.query.filter(
        PathMeta.first_point_time > YEAR_OLD).all()
    res = list(map(lambda r: r.serialize, res))
    return jsonify(res)


@path.route('/<meta_id>', methods=['GET'])
def get_path(meta_id):
    """Fetches a path meta and a list of recorded locations for a specific path.

    If "last_location_id" is defined in query params, only
    results with id greater than that are returned."""

    meta = PathMeta.query.filter_by(id=meta_id).first()
    if not meta:
        return make_response('No such meta.', 404)

    owner = User.query.filter_by(id=meta.owner_id).first()

    if 'last_location_id' in request.args:
        last_location_id = request.args.get('last_location_id')
        recorded_locations = RecordedLocation.query.\
            filter_by(pathmeta_id=meta_id).\
            filter(RecordedLocation.guid > last_location_id).\
            order_by(RecordedLocation.time_gmt).all()
    else:
        recorded_locations = RecordedLocation.query.\
            filter_by(pathmeta_id=meta_id).\
            order_by(RecordedLocation.time_gmt).all()

    recorded_locations = list(
        map(lambda r: r.serialize, recorded_locations or []))

    data = {
        'meta': meta.serialize,
        'path': recorded_locations
    }
    data['meta']['owner'] = owner.serialize

    return jsonify(data)


@path.route('/<meta_id>', methods=['DELETE'])
# @auth.login_required
def delete_path(meta_id):
    """Removes path and its all recorded locations"""
    path_meta = PathMeta.query.filter_by(id=meta_id).first_or_404()
    path_meta.delete()
    return make_response('', 204)


@path.route('/<meta_id>', methods=['PATCH'])
# @auth.login_required
def patch_path(meta_id):
    """Patches path"""
    path_meta = PathMeta.query.filter_by(id=meta_id).first_or_404()
    path_meta.name = request.form.get('name', path_meta.name)
    path_meta.update()
    return jsonify(path_meta.serialize)


@path.route('/meta/<meta_id>', methods=['GET'])
def get_path_meta(meta_id):
    path_meta = PathMeta.query.filter_by(id=meta_id).first_or_404()
    user = User.query.filter_by(id=path_meta.owner_id).first()
    obj = path_meta.serialize
    obj['owner_name'] = user.display_name
    return jsonify(obj)


@path.route('/location', methods=['POST'])
@limiter.limit('6/minute')
def post_location():
    """Adds a point to a route."""

    api_key = request.form.get('api_key', None)
    if not api_key:
        return make_response('Api key is missing or empty!', 400)

    user = User.query.filter_by(api_key=api_key).first()
    if not user:
        return make_response('Unknown api key!'), 400

    if 'latitude' not in request.form:
        return make_response('Latitude is missing!', 400)
    if 'longitude' not in request.form:
        return make_response('Longitude is missing!', 400)

    one_hour_ago = datetime.utcnow() - timedelta(hours=1)

    timestamp = request.form.get('time_gmt')
    if not timestamp:
        # Timestamp missing, use current gmt time.
        timestamp = datetime.utcnow().ctime()
    timestamp = parse_date(timestamp)

    # Get the latest path meta.
    path_meta = PathMeta.query.filter_by(owner_id=user.id).\
        order_by(PathMeta.last_point_time.desc()).first()

    if not path_meta or path_meta.last_point_time < one_hour_ago:
        # Create a new path if this is the first path for the user
        # or the last path is more than one hour old.
        path_meta = PathMeta(
            owner_id=user.id,
            first_point_time=timestamp,
            last_point_time=timestamp)
        #pylint: disable=no-member
        db.session.add(path_meta)
        db.session.commit()

    location = RecordedLocation(
        # Required.
        pathmeta_id=path_meta.id,
        latitude=request.form['latitude'],
        longitude=request.form['longitude'],
        time_gmt=timestamp,
        # Optional
        accuracy=request.form.get('accuracy', 0),
        altitude=request.form.get('altitude', 0),
        speed=request.form.get('speed', 0))

    #pylint: disable=no-member
    db.session.add(location)

    # Update meta information.
    path_meta.last_point_time = location.time_gmt
    path_meta.point_count += 1
    deltaTime = path_meta.last_point_time - path_meta.first_point_time
    path_meta.duration_seconds = deltaTime.total_seconds()

    db.session.commit()

    return make_response(''), 204


@path.route('/live', methods=['GET'])
@limiter.limit('6/minute')
def get_live_paths():
    """ Returns all paths that have the last point newer than 30 seconds. """

    thirty_seconds_ago = datetime.utcnow() - timedelta(seconds=30)

    paths = PathMeta.query.\
        filter(PathMeta.last_point_time > thirty_seconds_ago).all()
    paths = list(map(lambda r: r.serialize, paths))
    return jsonify(paths)
