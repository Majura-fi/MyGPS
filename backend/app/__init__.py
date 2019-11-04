from flask_cors import CORS
from flask import Flask, jsonify
from app import config
#from app.extensions import lm

from app.auth import auth
from app.user import user
from app.path import path
from app.extensions import db
from app.extensions import limiter


def create_app(app_config=config.base_config):
    app = Flask(__name__)
    app.config.from_object(app_config)
    CORS(app)

    register_extensions(app)
    register_blueprints(app)
    # register_errorhandlers(app)
    # register_commands(app)

    return app


def register_extensions(app):
    # lm.init_app(app)
    db.init_app(app)
    limiter.init_app(app)


def register_blueprints(app):
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(user, url_prefix='/users')
    app.register_blueprint(path, url_prefix='/paths')
