from flask import Blueprint, request, jsonify
from app.helpers.database_helpers import addClient, getAllEmailFromClient
import os

mod_signup = Blueprint('signup', __name__)

@mod_signup.route('/signup', methods=["GET","POST"])
def signup():

    # データの受け取り
    receive_data = request.get_json()

    # 管理者権限の確認
    if receive_data["e-mail"][:7] == "admin::":
        receive_data["e-mail"] = receive_data["e-mail"][7:]
        admin = True
    else:
        admin = False

    # メールアドレスが既に登録されていないか確認
    if receive_data["e-mail"] in getAllEmailFromClient():
        return jsonify({"signup_error":1})

    # ユーザー情報を成形
    userInformation = {
        'last-name': receive_data["last-name"], 
        'first-name': receive_data["first-name"],
        'role': receive_data["role"], 
        'belonging': receive_data["belonging"], 
        'work-code': receive_data["work-code"], 
        'finance': "%:%".join(receive_data["finances"]), 
        'e-mail': receive_data["e-mail"], 
        'password': receive_data["password"],
        "reference-list":"",
        'admin': admin,
        "first-name-reading": receive_data["first-name-reading"],
        "last-name-reading": receive_data["last-name-reading"],
        "gender": receive_data["gender"],
        "nationality": receive_data["nationality"],
        "birthday": "{0}/{1}/{2}".format(receive_data["birthday-year"],receive_data["birthday-month"],receive_data["birthday-day"])        
    }
    
    # ユーザー情報をデータベースに登録
    addClient(userInformation)

    return jsonify({"signup_error":0})