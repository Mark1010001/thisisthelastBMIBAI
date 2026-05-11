import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
from jose import jwt
from passlib.context import CryptContext

# Configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-for-health-analytics-dashboard")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = decoded_token.get("exp")
        if exp is None:
            return None
        return decoded_token if exp >= datetime.now(timezone.utc).timestamp() else None
    except:
        return None

def register_user(username: str, full_name: str, password: str) -> bool:
    if username in USER_DB:
        return False
    USER_DB[username] = {
        "username": username,
        "full_name": full_name,
        "hashed_password": get_password_hash(password),
    }
    return True

# Simple User Database (In-memory for this example)
# Default user: admin / admin123
USER_DB = {
    "admin": {
        "username": "admin",
        "full_name": "Health Analytics Admin",
        "hashed_password": get_password_hash("admin123"),
    }
}