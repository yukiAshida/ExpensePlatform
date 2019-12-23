import random

# パスワードをハッシュ化する
def myhash(password):

    hashedPassword = password

    for _ in range(303):
        hashedPassword = [ (ord(p)-48) for p in hashedPassword]
        hashedPassword = irreversibleTransformation(hashedPassword)

    return hashedPassword

# 不可逆変換する（list(int) to str）
def irreversibleTransformation(pw,c=0,v=1):
    
    if c>101:
        return "".join([ (chr(p%75+48)) for p in pw ])
    
    L = len(pw)
    nex = [ (len(pw)+pw[i])*pw[i-1]%99991 for i in range(L) ]
    
    v = 1 if L<7 else (-1 if L>13 else (1 if nex[sum(nex)%L]%2 else -1)) 
    
    if v==1:
        nex += [nex[sum(nex)%L]]
    elif v==-1:
        nex.pop(sum(nex)%L)

    return irreversibleTransformation( nex ,c+1, v)

def nameToId(name):

    return int("".join([str(ord(c)-97) for c in [random.choice(name) for _ in range(5)]]) + str(random.randint(0,32767)))

