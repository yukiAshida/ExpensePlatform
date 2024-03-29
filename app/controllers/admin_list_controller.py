from flask import Blueprint, request, jsonify
from app.models.finance import Finance
from app.models.holiday import Holidays
from app.helpers.database_helpers import deleteClient, updateClient, getClientByEmail, getHolidayByDate, addHolidays, deleteHolidays, getAllFromTable
import os, glob
from flask_login import login_required

mod_admin_list = Blueprint('admin_list', __name__)

@mod_admin_list.route('/admin_list', methods=["GET","POST"])
@login_required
def admin_list():

    receive_data = request.get_json()

    if receive_data["label"]=="holidays-table":
        
        if receive_data["type"]=="show":

            all_holidays = getAllFromTable(Holidays)
            table = [{"date":holiday.date, "content":holiday.content} for holiday in all_holidays if holiday.date[:4]==receive_data["holidays-table-year"]]

            return jsonify({ "table": table })

        if receive_data["type"]=="delete":

            date = receive_data["delete-target"]
            result = deleteHolidays(date)

            if result==0:
                return jsonify({ "comment": "イベントを削除しました"})
            else:
                return jsonify({ "comment": "イベントが登録されていません"})