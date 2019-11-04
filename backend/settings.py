# Please note that MONGO_HOST and MONGO_PORT could very well be left
# out as they already default to a bare bones local 'mongod' instance.
MONGO_HOST = 'localhost'
MONGO_PORT = 27017

# Skip this block if your db has no auth. But it really should.
# MONGO_USERNAME = '<your username>'
# MONGO_PASSWORD = '<your password>'

# Name of the database on which the user can be authenticated,
# needed if --auth mode is enabled.
# MONGO_AUTH_SOURCE = '<dbname>'

MONGO_DBNAME = 'mygps'

# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
# individual items  (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']

DATE_FORMAT = '%Y.%m.%dT%H:%M:%SZ'

# users_schema = {
#     'username': {
#         'type': 'string',
#         'minlength': 3,
#         'maxlength': 15,
#         'unique': True
#     },
#     'password': {
#         'type': 'string'
#     },
#     'devices': {
#         'type': 'list'
#     }
# }

pathmeta_schema = {
    'name': {
        'type': 'string',
        'minlength': 0,
        'maxlength': 50
    },
    'first_point_time': {
        'type': 'datetime',
        'required': True
    },
    'last_point_time': {
        'type': 'datetime',
        'required': True
    }
}

pathmeta = {
    'item_title': 'path_meta',
    'additional_lookup': {
        'url': 'regex("[\\w]+")',
        'field': 'name'
    },
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,
    'schema': pathmeta_schema
}

locations_schema = {
    # Schema definition, based on Cerberus grammar. Check the Cerberus project
    # (https://github.com/pyeve/cerberus) for details.
    'path_id': {
        'type': 'integer',
        'required': True
    },
    'latitude': {
        'type': 'float',
        'required': True
    },
    'longitude': {
        'type': 'float',
        'required': True
    },
    'altitude': {
        'type': 'float'
    },
    'speed': {
        'type': 'float'
    },
    'accuracy': {
        'type': 'float'
    },
    'time_utc': {
        'type': 'datetime',
        'required': True
    }
}

locations = {
    'item_title': 'locations',
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,
    'schema': locations_schema
}

DOMAIN = {
    'locations': locations,
    'pathmeta': pathmeta
}
