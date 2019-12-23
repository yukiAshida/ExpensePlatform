from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.helpers.database_helpers import getClientByEmail, updateClient 
import os

mod_password = Blueprint('password', __name__)

@mod_password.route('/password', methods=["GET","POST"])
@login_required
def password():

    # データの受け取り
    receive_data = request.get_json()
    
    # アドレスとパスワードを取得
    e_mail = receive_data["e-mail"]
    password = receive_data["password"]

    # パスワードを変更
    client = getClientByEmail(e_mail)
    client.password = password
    updateClient(client, hashPassword=True)
    
    return jsonify({"password_error":0})