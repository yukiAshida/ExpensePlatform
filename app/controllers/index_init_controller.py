from flask import Blueprint, request, jsonify
from app.helpers.database_helpers import getAllNameFromFinance

mod_index_init = Blueprint('index_init', __name__)

@mod_index_init.route('/index_init', methods=["GET","POST"])
def index_init():

    finance_list = getAllNameFromFinance()
    
    return jsonify({"finance_list":finance_list})