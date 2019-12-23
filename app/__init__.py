from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import LOCAL_DEBUG
import sys, os


# Flaskアプリ生成
app = Flask(__name__, template_folder='./views/templates',static_folder='./views/statics')

# ログインマネージャー
login_manager = LoginManager()
login_manager.init_app(app)
app.config["SECRET_KEY"] = 'ysxhsdfkawefuhaiweufjaksbdfuaiwefhaksgdfaksdf'

# ★DB
if LOCAL_DEBUG:
    POSTGRES_URL="127.0.0.1:5432"
    POSTGRES_USER="postgres"
    POSTGRES_PW=sys.argv[1]
    POSTGRES_DB="expense_for_work"
    DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)
else:
    DB_URL = os.environ.get("DATABASE_URL")

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
db = SQLAlchemy(app)

# ★ダウンロード設定
XLSX_MIMETYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
XLSM_MIMETYPE = 'application/vnd.ms-excel.sheet.macroEnabled.12'
DOWNLOAD_DIR_PATH = 'downloads'

# BlueプリントRouting
from app.controllers.index_controller import mod_index
from app.controllers.index_init_controller import mod_index_init
from app.controllers.signup_controller import mod_signup
from app.controllers.update_controller import mod_update
from app.controllers.login_controller import mod_login
from app.controllers.password_controller import mod_password
from app.controllers.registration_controller import mod_registration
from app.controllers.admin_finance_controller import mod_admin_finance
from app.controllers.admin_process_controller import mod_admin_process
from app.controllers.admin_list_controller import mod_admin_list
from app.controllers.travel_expense_controller import mod_travel_expense
from app.controllers.travel_expense_check_controller import mod_travel_expense_check

app.register_blueprint(mod_index)
app.register_blueprint(mod_index_init)
app.register_blueprint(mod_signup)
app.register_blueprint(mod_update)
app.register_blueprint(mod_login)
app.register_blueprint(mod_password)
app.register_blueprint(mod_registration)
app.register_blueprint(mod_admin_finance)
app.register_blueprint(mod_admin_process)
app.register_blueprint(mod_admin_list)
app.register_blueprint(mod_travel_expense)
app.register_blueprint(mod_travel_expense_check)

print("__init＿")
