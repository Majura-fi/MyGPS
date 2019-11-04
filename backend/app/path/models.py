from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.extensions import db


class PathMeta(db.Model):
    __tablename__ = 'path_meta'
    id = Column(Integer, primary_key=True, autoincrement=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String(255), nullable=True)
    first_point_time = Column(DateTime)
    last_point_time = Column(DateTime)
    point_count = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)

    """
    lowest_elevation = Column(Float, default=0)
    highest_elevation = Column(Float, default=0)
    length_meters = Column(Float, default=0)
    """

    owner = relationship("User", back_populates="path_metas")
    recorded_locations = relationship(
        "RecordedLocation",
        back_populates='path_meta',
        cascade="all, delete, delete-orphan")

    @property
    def serialize(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'first_point_time': self.first_point_time,
            'last_point_time': self.last_point_time,
            'point_count': self.point_count,
            'duration_seconds': self.duration_seconds
        }

    def __repr__(self):
        return (
            "<PathMeta(" +
            "id={}, " +
            "owner_id={}, " +
            "name={}, " +
            "first_point_time={}, " +
            "last_point_time={}, " +
            "point_count={}, " +
            "duration_seconds={}" +
            ")>"
        ).format(
            self.id,
            self.owner_id,
            self.name,
            self.first_point_time,
            self.last_point_time,
            self.point_count,
            self.duration_seconds
        )


class RecordedLocation(db.Model):
    __tablename__ = "locations"
    guid = Column(Integer, primary_key=True, autoincrement=True)
    pathmeta_id = Column(Integer, ForeignKey('path_meta.id'))
    latitude = Column(Float)
    longitude = Column(Float)
    altitude = Column(Float, nullable=True)
    speed = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    time_gmt = Column(DateTime)

    path_meta = relationship(
        "PathMeta",
        back_populates="recorded_locations")

    @property
    def serialize(self):
        return {
            'guid': self.guid,
            'pathmeta_id': self.pathmeta_id,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'altitude': self.altitude,
            'speed': self.speed,
            'accuracy': self.accuracy,
            'time_gmt': self.time_gmt,
        }

    def __repr__(self):
        return (
            "<RecordedLocation(" +
            "guid={}, " +
            "pathmeta_id={}, " +
            "latitude={}, " +
            "longitude={}, " +
            "altitude={}, " +
            "speed={}, " +
            "accuracy={}, " +
            "time_gmt={}, " +
            ")>"
        ).format(
            self.guid,
            self.pathmeta_id,
            self.latitude,
            self.longitude,
            self.altitude,
            self.speed,
            self.accuracy,
            self.time_gmt
        )
