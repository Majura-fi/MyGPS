from flask import Blueprint

auth = Blueprint('auth', __name__)

# pylint: disable=wrong-import-position
from . import views
