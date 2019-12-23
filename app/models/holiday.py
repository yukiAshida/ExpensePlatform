from app import db
from app.models.base import Base

class Holidays(Base):

    date = db.Column(db.String(16), unique=True, primary_key=True)
    content = db.Column(db.String(32), unique=False)

    def __init__(self, user_data={"date":"","content":""}):

        self.date = user_data["date"]
        self.content = user_data["content"]

    def __repr__(self):
        return '<Holidays {0} {1}>'.format(self.date, self.content)