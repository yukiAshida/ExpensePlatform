from app import db

class Base(db.Model):

    __abstract__ = True