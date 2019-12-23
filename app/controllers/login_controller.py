from flask import Blueprint, request, jsonify
from flask_login import login_user
from app import login_manager
from app.models.auth import Auth
from app.helpers.auth_helpers import isSuccessPass
from app.helpers.database_helpers import getAllEmailFromClient, getClientByEmail
from config import ADMINISTRATOR_AUTHORITY
from app.helpers.seculity_helpers import isSignupPass

mod_login = Blueprint('login', __name__)

@login_manager.user_loader
def load_user(user_id):
    return Auth()

@mod_login.route('/login', methods=["GET","POST"])
def login():

    # データの受け取り
    receive_data = request.get_json()
    e_mail = receive_data["e-mail"]
    password = receive_data["password"]
    next_page = receive_data["next-page"]

    # 登録ページの場合
    if next_page == "signup":

        if isSignupPass(receive_data["e-mail"], receive_data["password"]):
            return jsonify( {"login_error":0, "user-information":{}} )
        else:
            return jsonify( {"login_error":4} )

    # アドレスが登録されていないエラー
    if not e_mail in getAllEmailFromClient():
        return jsonify( {"login_error":1} )
    
    # パスワードが誤っているエラー
    if not isSuccessPass(e_mail, password):
        return jsonify( {"login_error":2} )

    # ユーザー情報を取得
    clientInformation = getClientByEmail(e_mail)

    # 管理者権限がありません
    if next_page in ADMINISTRATOR_AUTHORITY.split("/") and clientInformation.admin==False:
        return jsonify( {"login_error":3} )

    # ログイン
    login_user(Auth())
    
    # # ユーザー情報を成形（ほぼそのまま）
    clientInformationToReact = {
        "last-name":clientInformation.last_name,
        "first-name":clientInformation.first_name,
        "role":clientInformation.role,
        "belonging":clientInformation.belonging,
        "work-code":clientInformation.work_code,
        "finances":clientInformation.finance,
        "e-mail":clientInformation.e_mail,
        "reference_list":clientInformation.reference_list,
        
        "first-name-reading":clientInformation.first_name_reading,
        "last-name-reading":clientInformation.last_name_reading,
        "gender":clientInformation.gender,
        "nationality":clientInformation.nationality,
        "birthday":clientInformation.birthday,
    }

    return jsonify( {"login_error":0, "user_information":clientInformationToReact} )