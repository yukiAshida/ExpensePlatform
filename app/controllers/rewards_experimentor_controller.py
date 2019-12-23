from flask import Blueprint, request, jsonify
from app.helpers.database_helpers import addRewardCode, getAllCodeFromRewardsCode, getClientByEmail
import random
from flask_login import login_required


mod_rewards_experimentor = Blueprint('rewards_experimentor', __name__)

@mod_rewards_experimentor.route('/rewards_experimentor', methods=["GET","POST"])
@login_required
def rewards_experimentor():

    # データの受け取り
    receive_data = request.get_json()

    # ユーザー情報を取得
    client = getClientByEmail(receive_data["e-mail"])

    # (無いけど)もしもアドレスが登録されていなければ
    if client == None:
        return jsonify({"rewards_experimentor_error":1})

    # 一意なREWAED-CODEを生成
    elements = [str(i) for i in range(10)] + [chr(i) for i in range(65,65+26)] + [chr(i) for i in range(97,97+26)]
    reward_code = "".join(random.choices(elements, k=8))

    # 重複した場合は生成し直し
    all_codes = getAllCodeFromRewardsCode()
    while reward_code in all_codes:
        reward_code = "".join(random.choices(elements, k=8))

    codeInformation = {
        "reward-code": reward_code,
        "last-name": client.last_name,
        "first-name": client.first_name,
        "belonging": client.belonging,
        "work-content": receive_data["work-content"],
        "hours": receive_data["hours"],
        "term-start": "{0}/{1}/{2}".format(receive_data["term-start-year"], receive_data["term-start-month"], receive_data["term-start-day"]),
        "term-end": "{0}/{1}/{2}".format(receive_data["term-end-year"], receive_data["term-end-month"], receive_data["term-end-day"]),
        "location": receive_data["location"],
    }

    # コードをデータベースに登録
    addRewardCode(codeInformation)

    return jsonify({"rewards_experimentor_error":0, "reward-code": reward_code})