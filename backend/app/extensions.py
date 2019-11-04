#from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


#lm = LoginManager()
db = SQLAlchemy()
basicAuth = HTTPBasicAuth()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["10 per second"]
)
