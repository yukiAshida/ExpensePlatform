from app import db
from app.models.base import Base

class Finance(Base):

    name = db.Column(db.String(32), unique=True, primary_key=True)
    department_name = db.Column(db.String(64), unique=False)
    project_name = db.Column(db.String(64), unique=False)
    budget_name = db.Column(db.String(64), unique=False)
    account_name = db.Column(db.String(64), unique=False)
    department_code = db.Column(db.String(32), unique=False)
    project_code = db.Column(db.String(32), unique=False)
    budget_code = db.Column(db.String(32), unique=False)
    account_code = db.Column(db.String(32), unique=False)
    cooperation = db.Column(db.Boolean, unique=False)
    

    def __init__(self, user_data={"name":"","department_name":"","project_name":"","budget_name":"","account_name":"","department_code":"","project_code":"","budget_code":"","account_code":"","cooperation":""}):

        self.name = user_data["name"]
        self.department_name = user_data["department_name"]
        self.project_name = user_data["project_name"]
        self.budget_name = user_data["budget_name"]
        self.account_name = user_data["account_name"]
        self.department_code = user_data["department_code"]
        self.project_code = user_data["project_code"]
        self.budget_code = user_data["budget_code"]
        self.account_code = user_data["account_code"]
        self.cooperation = user_data["cooperation"]

    def __repr__(self):
        return '<Finance {0}>'.format(self.name)