from flask import Blueprint, request, jsonify
from app.models.finance import Finance
from app.helpers.database_helpers import getAllFromTable, emptyTable, insertAllData
from flask_login import login_required


mod_admin_finance = Blueprint('admin_finance', __name__)

@mod_admin_finance.route('/admin_finance', methods=["GET","POST"])
@login_required
def admin_finance():

    # 現在のデータ
    current_data = {}
    finance_list = getAllFromTable(Finance)
    
    for finance in finance_list:

        current_data[finance.name] =  [
            {
                "AI": finance.department_name,
                "AP": finance.project_name,
                "AW": finance.budget_name,
                "BD": finance.account_name,
            },
            {
                "AI": finance.department_code,
                "AP": finance.project_code,
                "AW": finance.budget_code,
                "BD": finance.account_code,
            }
        ]

    # コメント
    change_comment = []
    
    # 現在のデータと更新データの比較
    update_data = request.get_json()["uploaded_finance"]

    # 魔法のコネクトコード
    connect_code = [ ("部署名称",0,"AI"),("部署コード",1,"AI"),("プロジェクトコード",1,"AP"),("プロジェクト名称",0,"AP"),("予算科目名称",0,"AW"),("予算科目コード",1,"AW"),("勘定科目名称",0,"BD"),("勘定科目コード",1,"BD") ]
    
    # currentにあるのにupdateに含まれないものは削除・currentにないのにupdateにあるものは追加
    change_comment += [ "{0}を財源リストから削除しました".format(finance_name) for finance_name in current_data if not finance_name in update_data ]
    change_comment += [ "{0}を財源リストに追加しました".format(finance_name) for finance_name in update_data if not finance_name in current_data ]

    common_list = set(list(update_data.keys()))&set(list(current_data.keys()))

    for key in common_list:
        change_comment += [ "{0}の{1}を {2} から {3} に変更します".format(key, connect_code[i][0], current_data[key][connect_code[i][1]][connect_code[i][2]], update_data[key][i] ) for i in range(8) if current_data[key][connect_code[i][1]][connect_code[i][2]] != update_data[key][i] ]

    # テーブルを空にする
    emptyTable(Finance)

    # データをまとめる
    update_data_list = []
    for i, key in enumerate(update_data):
        
        finance = Finance()
        finance.name = key
        finance.department_name = update_data[key][0]
        finance.project_name = update_data[key][3]
        finance.budget_name = update_data[key][4]
        finance.account_name = update_data[key][6]
        finance.department_code = update_data[key][1]
        finance.project_code = update_data[key][2]
        finance.budget_code = update_data[key][5]
        finance.account_code = update_data[key][7]
        update_data_list.append(finance)
    
    # テーブルにデータをまとめて突っ込む
    insertAllData(update_data_list)

    comment = "\n".join(change_comment) if len(change_comment)>0 else "変更はありませんでした"
    return jsonify({"comment":comment})
