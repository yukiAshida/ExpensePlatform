from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.helpers.travel_expense_helpers import finalCheck

mod_travel_expense_check = Blueprint('travel_expense_check', __name__)

@mod_travel_expense_check.route('/travel_expense_check', methods=["GET","POST"])
@login_required
def travel_expense_check():

    # データの受け取り
    receive_data = request.get_json()

    # 必要なフォーム情報を取得
    formInformation = {
        "data": receive_data["route-display"]["data"],
        "year": receive_data["header-info"]["year"],
        "month": receive_data["header-info"]["month"],
        "day": receive_data["header-info"]["day"],        
    }

    comment = finalCheck(formInformation)

    return jsonify({"comment":comment})