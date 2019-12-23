from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.helpers.database_helpers import getAllEmailFromClient, getClientByEmail, updateClient

mod_update = Blueprint('update', __name__)

@mod_update.route('/update', methods=["GET","POST"])
@login_required
def update():

    # データの受け取り
    receive_data = request.get_json()

    # メールアドレスを変更して、かつ既存のアドレスと被る
    if receive_data["original-e-mail"]!=receive_data["e-mail"] and receive_data["e-mail"] in getAllEmailFromClient():
        return jsonify({"update_error":1})

    # 元々の登録情報（管理者軽減とパスワードの引継ぎ）
    originalClient = getClientByEmail(receive_data["original-e-mail"])

    # 更新情報
    userInformation = {
        'last-name': receive_data["last-name"], 
        'first-name': receive_data["first-name"],
        'role': receive_data["role"], 
        'belonging': receive_data["belonging"], 
        'work-code': receive_data["work-code"], 
        'finance': "%:%".join(receive_data["finances"]), 
        'e-mail': receive_data["e-mail"], 
        'password': originalClient.password,
        "reference-list": "%:::%".join([ key+"%::%"+value for key, value in receive_data["reference_list"].items() ]),
        'admin': originalClient.admin,

        "first-name-reading": receive_data["first-name-reading"],
        "last-name-reading": receive_data["last-name-reading"],
        "gender": receive_data["gender"],
        "nationality": receive_data["nationality"],
        "birthday": "{0}/{1}/{2}".format(receive_data["birthday-year"],receive_data["birthday-month"],receive_data["birthday-day"]) 
    }

    updateClient(originalClient, userInformation, hashPassword=False)
    
    return jsonify({"update_error":0})