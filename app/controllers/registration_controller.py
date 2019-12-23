from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.helpers.database_helpers import getClientByEmail, updateClient 
import os

mod_registration = Blueprint('registration', __name__)

@mod_registration.route('/registration', methods=["GET","POST"])
@login_required
def registration():

    # データの受け取り
    receive_data = request.get_json()

    e_mail = receive_data["user-info"]["e-mail"]
    route_list = receive_data["route"]["route_list"]
    trans_list = receive_data["route"]["trans_list"]
    fare = receive_data["route"]["fare"]
    alias = receive_data["route"]["alias"]

    # 登録経路を追加
    client = getClientByEmail(e_mail)
    route_trans = "".join([ r+"%"+t+"%" for r,t in zip(route_list, trans_list) ]+[route_list[-1]]).replace("%t%","%=%").replace("%b%","%-%")
    new_reference = alias + "%::%" + route_trans + "%:%" + fare
    new_reference_added = client.reference_list + "%:::%" + new_reference

    # 登録経路長の限度制限
    if len(new_reference_added)>1079:
        return jsonify({"registration_error":1})

    # 登録経路を更新
    client.reference_list = new_reference_added    
    updateClient(client, hashPassword=False)

    return jsonify({"registration_error":0, "alias":alias, "route_trans":route_trans ,"fare":fare})