from app import db
from app.models.base import Base

class Rewardcode(Base):

    reward_code = db.Column(db.String(10), unique=True, primary_key=True)
    last_name = db.Column(db.String(32), unique=False)
    first_name = db.Column(db.String(32), unique=False)
    belonging = db.Column(db.String(32), unique=False)
    work_content = db.Column(db.String(128), unique=False)
    hours = db.Column(db.String(4), unique=False)
    term_start = db.Column(db.String(12), unique=False)
    term_end = db.Column(db.String(12), unique=False)
    location = db.Column(db.String(64), unique=False)

    def __init__(self, data={"reward-code":"", "last-name":"", "first-name":"", "belonging":"", "work-content":"", "hours":"", "term-start":"", "term-end":"", "location":""}):

        self.reward_code = data["reward-code"]
        self.last_name = data["last-name"]
        self.first_name = data["first-name"]
        self.belonging = data["belonging"]
        self.work_content = data["work-content"]
        self.hours = data["hours"]
        self.term_start = data["term-start"]
        self.term_end = data["term-end"]
        self.location = data["location"]

    def __repr__(self):
        return '<RewardCode {0}>'.format(self.reward_code)