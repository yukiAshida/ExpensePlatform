from flask import Blueprint, request, jsonify, send_from_directory
from flask_login import login_required
from app import XLSM_MIMETYPE, DOWNLOAD_DIR_PATH
from app.helpers.travel_expense_helpers import makeExcelData
from app.helpers.database_helpers import getClientByEmail, getFinanceByName, wapperClientForTravelExpense, wapperFinanceForTravelExpense

mod_travel_expense = Blueprint('travel_expense', __name__)

@mod_travel_expense.route('/travel_expense', methods=["GET","POST"])
@login_required
def travel_expense():

    # データの受け取り
    receive_data = request.get_json()
    
    # データベースから個人の情報を取得
    e_mail = receive_data["user-info"]["e-mail"]
    clientInformation = wapperClientForTravelExpense( getClientByEmail(e_mail) )

    # その中の指定財源から、詳細財源情報を取得
    finance = receive_data["header-info"]["finance"]
    financeInformation = wapperFinanceForTravelExpense( getFinanceByName(finance) )
    
    # 必要なフォーム情報を取得
    formInformation = {
        "data": receive_data["route-display"]["data"],
        "year": receive_data["header-info"]["year"],
        "month": receive_data["header-info"]["month"],
        "finance": receive_data["header-info"]["finance"]
    }

    # 詳細財源情報とフォーム情報からExcelデータを作成
    filename = makeExcelData(formInformation, clientInformation, financeInformation)

    downloadFileName = filename
    downloadFile = filename

    return send_from_directory(DOWNLOAD_DIR_PATH, downloadFile+".xlsm", \
        as_attachment = True, attachment_filename = downloadFileName+".xlsm", \
        mimetype = XLSM_MIMETYPE)
    