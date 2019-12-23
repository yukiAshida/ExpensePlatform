import random
from flask_login import UserMixin

class Auth(UserMixin):

    def get_id(self):

        base_code = "0123456789abcdef"
        bit = 32
        Id = "".join( [ random.choice(base_code) for _ in range(bit) ] )
        return Id