from app import db
from app.models.client import Client
from app.models.finance import Finance
from app.models.holiday import Holidays
from app.helpers.seculity_helpers import myhash

# %%%%%%%%% 該当する詳細情報を取得する %%%%%%%%%%%%%%%%%%%%%%%%%

# メールアドレスに該当するユーザー情報を取得
def getClientByEmail(e_mail):

    client = db.session.query(Client).filter_by(e_mail=e_mail).first()
    return client

# 財源に該当するユーザー情報を取得
def getFinanceByName(name):

    finance = db.session.query(Finance).filter_by(name=name).first()
    return finance

def getHolidayByDate(date):

    holiday = db.session.query(Holidays).filter_by(date=date).first()
    return holiday


# %%%%%%%%% 情報を更新する %%%%%%%%%%%%%%%%%%%%%%%%%

# 指定した情報のユーザーを追加
def addClient(userInformation):

    client = Client()
    client.first_name = userInformation["first-name"]
    client.last_name = userInformation["last-name"]
    client.role = userInformation["role"]
    client.belonging = userInformation["belonging"]
    client.finance = userInformation["finance"]
    client.work_code = userInformation["work-code"]
    client.e_mail = userInformation["e-mail"]
    client.password = myhash(userInformation["password"])
    client.reference_list = userInformation["reference-list"]
    client.admin = userInformation["admin"]

    client.first_name_reading = userInformation["first-name-reading"]
    client.last_name_reading = userInformation["last-name-reading"]
    client.gender = userInformation["gender"]
    client.nationality = userInformation["nationality"]
    client.birthday = userInformation["birthday"]
    
    db.session.add(client)
    db.session.commit()

# 指定したユーザーの情報を更新
def updateClient(client, userInformation=None, hashPassword=True):
    
    if userInformation!=None:

        client.first_name = userInformation["first-name"]
        client.last_name = userInformation["last-name"]
        client.role = userInformation["role"]
        client.belonging = userInformation["belonging"]
        client.finance = userInformation["finance"]
        client.work_code = userInformation["work-code"]
        client.e_mail = userInformation["e-mail"]
        client.password = myhash(userInformation["password"]) if hashPassword else userInformation["password"]
        client.reference_list = userInformation["reference-list"]
        client.admin = userInformation["admin"]
        
        client.first_name_reading = userInformation["first-name-reading"]
        client.last_name_reading = userInformation["last-name-reading"]
        client.gender = userInformation["gender"]
        client.nationality = userInformation["nationality"]
        client.birthday = userInformation["birthday"]


    elif hashPassword:
        client.password = myhash(client.password)
        
    db.session.add(client)
    db.session.commit()


def addHolidays(holidayInformation):

    holidays = Holidays()
    holidays.date = holidayInformation["date"]
    holidays.content = holidayInformation["content"]
    
    db.session.add(holidays)
    db.session.commit()

# 指定したアドレスのユーザーを削除
def deleteClient(e_mail):

    client = getClientByEmail(e_mail)
    
    if client!=None:
        db.session.delete(client)
        db.session.commit()
        return 0
    else:
        return 1

# 指定した日の祝日・休日を削除
def deleteHolidays(date):

    holiday = getHolidayByDate(date)
    
    if holiday!=None:
        db.session.delete(holiday)
        db.session.commit()
        return 0
    else:
        return 1

# %%%%%%%%% 全取得 %%%%%%%%%%%%%%%%%%%%%%%%%

# 指定したテーブルの情報をすべて取得する
def getAllFromTable(Table):


    db.session.close()
    all_query = db.session.query(Table).all()

    return all_query

# 指定したテーブルを空にする
def emptyTable(Table):

    db.session.query(Table).delete()
    db.session.commit()

# 指定したデータ群をまとめてテーブルに注ぎ込む
def insertAllData(data_list):

    db.session.add_all(data_list)
    db.session.commit()

# %%%%%%%%% 一覧の取得 %%%%%%%%%%%%%%%%%%%%%%%%%

# メールアドレス一覧を取得
def getAllEmailFromClient():

    clients = getAllFromTable(Client)
    
    return [] if clients == [] else [client.e_mail for client in clients]

# 財源名一覧を取得
def getAllNameFromFinance():

    finances = getAllFromTable(Finance)

    return [] if finances==[] else [finance.name for finance in finances]


# %%%%%%%% 近距離用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%
def wapperClientForTravelExpense(client):

    clientInformation = {
        "first-name": client.first_name,
        "last-name": client.last_name,
        "role": client.role,
        "belonging": client.belonging,
        "finance": client.finance, 
        "work-code": client.work_code,
        "e-mail": client.e_mail,
    }

    return clientInformation

def wapperFinanceForTravelExpense(finance):

    financeInformation = {
        0:{
                "AI": finance.department_name,
                "AP": finance.project_name,
                "AW": finance.budget_name,
                "BD": finance.account_name,
        },

        1:{
                "AI": finance.department_code,
                "AP": finance.project_code,
                "AW": finance.budget_code,
                "BD": finance.account_code,
        },

        "cooperation":finance.cooperation,
    }

    return financeInformation