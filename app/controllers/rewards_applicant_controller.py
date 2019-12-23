from flask import Blueprint, request, jsonify, send_from_directory
from app.helpers.database_helpers import getRewardCodeByCode, getClientByEmail
from app.helpers.reward_helpers import makeExcelData
from app import XLSX_MIMETYPE, DOWNLOAD_DIR_PATH
from flask_login import login_required


mod_rewards_applicant = Blueprint('rewards_applicant', __name__)

@mod_rewards_applicant.route('/rewards_applicant', methods=["GET","POST"])
@login_required
def rewards_applicant():

    # データの受け取り
    receive_data = request.get_json()
    reward_code = receive_data["reward-code"]
    rewardCodeData = getRewardCodeByCode(reward_code)

    if rewardCodeData == None:
        return "0".encode()

    # メールアドレスからユーザー情報を取得
    e_mail = receive_data["e-mail"]
    clientData = getClientByEmail(e_mail)


    clientInformation = {
        "e-mail": e_mail,
        "last-name": clientData.last_name,
        "first-name": clientData.first_name,
        "last-name-reading": clientData.last_name_reading,
        "first-name-reading": clientData.first_name_reading,
        "gender": clientData.gender,
        "nationality": clientData.nationality,
        "birthday": clientData.birthday,
        "work-code": clientData.work_code,
        "belonging": clientData.belonging,
        "role": clientData.role,
    }

    formInformation = {
        "postal-code": receive_data["postal-code"],
        "address": receive_data["address"]
    }

    experimentorInformation = {
        "last-name": rewardCodeData.last_name,
        "first-name": rewardCodeData.first_name,
        "belonging": rewardCodeData.belonging,
        "work-content": rewardCodeData.work_content,
        "hours": rewardCodeData.hours,
        "term-start": rewardCodeData.term_start,
        "term-end": rewardCodeData.term_end,
        "location": rewardCodeData.location,
        # "project-name": "スーパーセンシングプロジェクト",
        # "work-kind": ""
    }
    
    # # ユーザー情報をデータベースに登録
    filename = makeExcelData(formInformation, clientInformation, experimentorInformation)

    downloadFileName = filename
    downloadFile = filename

    return send_from_directory(DOWNLOAD_DIR_PATH, downloadFile+".xlsx", \
        as_attachment = True, attachment_filename = downloadFileName+".xlsx", \
        mimetype = XLSX_MIMETYPE)