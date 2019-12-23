from app import db
from app.models.base import Base

class Client(Base):

    last_name = db.Column(db.String(32), unique=False)
    first_name = db.Column(db.String(32), unique=False)
    role = db.Column(db.String(32), unique=False)
    belonging = db.Column(db.String(32), unique=False)
    finance = db.Column(db.String(120), unique=False)
    work_code = db.Column(db.String(16), unique=True)
    e_mail = db.Column(db.String(64), primary_key=True)
    password = db.Column(db.String(32), unique=False)
    reference_list = db.Column(db.String(1080), unique=False)
    admin = db.Column(db.Boolean, default=False, unique=False)

    # 追加
    last_name_reading = db.Column(db.String(32), unique=False)
    first_name_reading = db.Column(db.String(32), unique=False)
    gender = db.Column(db.String(4), unique=False)
    nationality = db.Column(db.String(16), unique=False)
    birthday = db.Column(db.String(16), unique=False)

    def __init__(self, userInformation={"first-name":"", "last-name":"", "role":"", "belonging":"", "finance":"", "work-code":"", "e-mail":"", "password":"", "reference-list":"", "admin":"", "last-name-reading":"", "first-name-reading":"", "gender":"", "birthday":"", "nationality":""}):

        self.first_name = userInformation["first-name"]
        self.last_name = userInformation["last-name"]
        self.role = userInformation["role"]
        self.belonging = userInformation["belonging"]
        self.finance = userInformation["finance"]
        self.work_code = userInformation["work-code"]
        self.e_mail = userInformation["e-mail"]
        self.password = userInformation["password"]
        self.reference_list = userInformation["reference-list"]
        self.admin = userInformation["admin"]

        # 追加
        self.first_name_reading = userInformation["first-name-reading"]
        self.last_name_reading = userInformation["last-name-reading"]
        self.gender = userInformation["gender"]
        self.nationality = userInformation["nationality"]
        self.birthday = userInformation["birthday"]

    def __repr__(self):
        return '<Client {0}>'.format("{0} {1}{2}".format(self.e_mail, self.last_name, self.first_name))