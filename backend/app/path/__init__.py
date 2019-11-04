from flask import Blueprint

path = Blueprint('path', __name__)

from . import views
