from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()



def verify_password(plain_password:str, hashed_password:str):
    return password_hash.verify(plain_password, hashed_password)

def hash_password(plain_password:str):
    '''
    This convert the plaing password to a hashed passwoopenssl rand -hex 32rd
    
    :param plain_password: Plain password for user
    '''
    return password_hash.hash(plain_password)
