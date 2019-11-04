import os


class base_config():
    SITE_NAME = os.environ.get('MYGPS_APP_NAME', 'MyGPS')

    SECRET_KEY = os.environ.get('MYGPS_SECRET_KEY', 'secret_key')

    DATABASE_ENGINE = os.environ.get('MYGPS_DB_ENGINE', 'mysql')
    DATABASE_USER = os.environ.get('MYGPS_DB_USER', 'root')
    DATABASE_PASS = os.environ.get('MYGPS_DB_PASS', 'pass')
    DATABASE_HOST = os.environ.get('MYGPS_DB_HOST', 'localhost')
    DATABASE_PORT = os.environ.get('MYGPS_DB_PORT', '3306')
    DATABASE_DB = os.environ.get('MYGPS_DB_DB', 'db')

    SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
        DATABASE_ENGINE,
        DATABASE_USER,
        DATABASE_PASS,
        DATABASE_HOST,
        DATABASE_PORT,
        DATABASE_DB
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SUPPORTED_LOCALES = ['en', 'fi']

    ASSETS_DEBUG = False
    DEBUG = False
    TESTING = False


class dev_config(base_config):
    ASSETS_DEBUG = True
    DEBUG = True


class test_config(base_config):
    TESTING = True
