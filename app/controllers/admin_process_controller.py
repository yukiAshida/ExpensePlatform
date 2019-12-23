from flask import Blueprint, request, jsonify
from app.models.finance import Finance
from app.helpers.database_helpers import deleteClient, updateClient, getClientByEmail, getHolidayByDate, addHolidays
from app.helpers.seculity_helpers import isSuperAdmin
import os, glob
from flask_login import login_required


mod_admin_process = Blueprint('admin_process', __name__)

@mod_admin_process.route('/admin_process', methods=["GET","POST"])
@login_required
def admin_process():

    receive_data = request.get_json()
    
    mode = receive_data["mode"]
    
    # ユーザー情報の消去
    if mode=="client-delete":
        
        result = deleteClient( receive_data["delete_e-mail"] )

        if result==0:
            return jsonify({"comment":"<Client {0}>を削除しました".format(receive_data["delete_e-mail"])})            
        else:
            return jsonify({"comment":"メールアドレス {0} は登録されていません".format(receive_data["delete_e-mail"])})

    # 管理者権限の付与
    elif mode=="admin-present":
        
        client = getClientByEmail( receive_data["admin_e-mail"] )

        if client==None:
            return jsonify({"comment":"メールアドレス {0} は登録されていません".format(receive_data["admin_e-mail"])})                
        elif client.admin == True:
            return jsonify({"comment":"メールアドレス {0} は既に管理者です".format(receive_data["admin_e-mail"])})
        else:
            client.admin = True
            updateClient( client, hashPassword=False )

            return jsonify({"comment":"<Client {0}>に管理者権限を付与しました".format(receive_data["admin_e-mail"])})

    # 管理者権限の付与
    elif mode=="admin-delete":
        
        client = getClientByEmail( receive_data["admin_e-mail"] )

        if client==None:
            return jsonify({"comment":"メールアドレス {0} は登録されていません".format(receive_data["admin_e-mail"])})                
        elif client.admin == False:
            return jsonify({"comment":"メールアドレス {0} は既に管理者ではありません".format(receive_data["admin_e-mail"])})            
        elif isSuperAdmin(receive_data["admin_e-mail"]):
            return jsonify({"comment":"メールアドレス {0} は重要管理者のため、管理者権限を削除できません".format(receive_data["admin_e-mail"])})
        else:
            client.admin = False
            updateClient( client, hashPassword=False )

            return jsonify({"comment":"<Client {0}>の管理者権限を削除しました".format(receive_data["admin_e-mail"])})
    
    # キャッシュファイル（downloadsディレクトリのファイル群）の削除
    elif mode=="cache-delete":
        
        files = glob.glob("app/downloads/*")

        for filepath in files:
            filepath = filepath.replace("\\","/")

            if filepath != "app/downloads/dummy.txt":
                os.remove(filepath)

        return jsonify({"comment":"キャッシュファイルを削除しました"})

    # キャッシュファイル（downloadsディレクトリのファイル群）の削除
    elif mode=="holidays-addition":
        
        date = "{0}/{1}/{2}".format(receive_data["holidays-addition-year"],receive_data["holidays-addition-month"],receive_data["holidays-addition-day"])
        holiday = getHolidayByDate(date)

        if holiday==None:
            addHolidays({"date":date, "content":receive_data["holidays-addition-content"]})
            return jsonify({"comment":"{0}にイベントを登録しました".format(date)})
        else:
            return jsonify({"comment":"既に{0}にはイベントが登録されています".format(date)})
            

