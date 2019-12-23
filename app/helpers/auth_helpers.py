from app.helpers.seculity_helpers import myhash
from app.helpers.database_helpers import getClientByEmail

def isSuccessPass(e_mail, password):

    hashedPassword = myhash(password)
    clientInformation = getClientByEmail(e_mail)
    
    if clientInformation!=None:
        return hashedPassword == clientInformation.password

    return False