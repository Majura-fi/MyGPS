import random
import string

from sqlalchemy import Column, Integer, String, func
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash


from app.extensions import db
from app.exceptions import UserUpdateException


class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255))
    password = Column(String(255))
    display_name = Column(String(255))
    api_key = Column(String(255), nullable=True)
    #registered_on = Column(DateTime, nullable=False)
    #verified = Column(Integer, default=0)

    path_metas = relationship(
        "PathMeta",
        back_populates='owner',
        cascade="all, delete, delete-orphan"
    )

    def __init__(self, name, email, password):
        self.email = email
        self.display_name = name
        self.set_password(password)

    def update_display_name(self, new_display_name):
        """ 
        Attempts to update user's display name. 
        Will fail if the name is:
            1) Not unique.
            2) Not 4 or more characters.
            3) Empty
        """

        new_display_name = new_display_name or ''
        new_display_name = new_display_name.strip().lower()

        # Don't do anything if the new name matches the current name.
        if self.display_name.lower() == new_display_name:
            return True

        # Validate name.
        ok, error = User.validate_name(new_display_name)
        if not ok:
            return False, error

        self.display_name = new_display_name
        return True, None

    @staticmethod
    def validate_name(name):
        if not name:
            return False, 'The name cannot be empty!'
        if len(name) < 4:
            return False, 'The name must have 4 or more characters!'
        if not User.is_unique_name(name):
            return False, 'The name must be unique!'
        return True, None

    @staticmethod
    def validate_password(password):
        if not password:
            return False, 'The password cannot be empty!'
        if len(password) < 6:
            return False, 'The password must have 6 or more characters!'
        return True, None

    @staticmethod
    def validate_email(email):
        if not email:
            return False, 'The email cannot be empty!'
        if '@' not in email:
            return False, 'The email is not valid!'
        return True, None

    @staticmethod
    def is_unique_api_key(key):
        return not User.query.\
            filter_by(api_key=key).\
            first()

    @staticmethod
    def is_unique_name(name):
        """ Checks if user name is unique. """
        return not User.query.\
            filter(func.lower(User.display_name) == func.lower(name)).\
            first()

    def regenerate_api_key(self):
        def randString(length):
            letters = string.ascii_letters + string.digits
            return ''.join(random.choice(letters) for i in range(length))

        new_api_key = '{}-{}'.format(randString(4), randString(4))
        while not User.is_unique_api_key(new_api_key):
            new_api_key = '{}-{}'.format(randString(4), randString(4))

        self.api_key = new_api_key
        return new_api_key

    def update_password(self, current_password, new_password):
        if not self.check_password(current_password):
            raise UserUpdateException("The current password was wrong!")
        self.set_password(new_password)

    def set_password(self, password):
        ok, error = User.validate_password(password)
        if not ok:
            raise UserUpdateException(error)

        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "display_name": self.display_name,
            "password": self.password,
            "api_key": self.api_key
        }

    def __repr__(self):
        return "<User(id={}, email={}, display_name={})>".\
            format(self.id, self.email, self.display_name)
