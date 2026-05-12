from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import pandas as pd
import numpy as np

from data.generator import generate_dataset, transform_dataset, mine_patterns
from models.classifier import (
    calculate_bmi,
    calculate_bai,
    classify_with_thresholds,
    classify_bai,
    get_age_band,
)
from config.constants import (
    STANDARD_THRESHOLDS,
    ASIAN_THRESHOLDS,
    RISK_PROBABILITY,
    BAI_CATEGORIES,
    STANDARD_GLOBAL,
)
from utils.advice import HEALTH_ADVICE, get_dynamic_coach_advice
from utils.chatbot import get_chatbot_response
from utils.auth import (
    verify_password,
    create_access_token,
    decode_token,
    register_user,
    USER_DB
)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

class Token(BaseModel):
    access_token: str
    token_type: str

class SignupResponse(BaseModel):
    access_token: str
    token_type: str
    username: str

class User(BaseModel):
    username: str
    full_name: Optional[str] = None
    is_guest: bool = False

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username: str = payload.get("sub")

    if username == "guest":
        return User(username="guest", full_name="Guest User", is_guest=True)

    if username is None or username not in USER_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_data = USER_DB[username]
    return User(username=user_data["username"], full_name=user_data["full_name"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserSignup(BaseModel):
    username: str
    full_name: str
    password: str

class UserMetrics(BaseModel):
    gender: str
    age: int
    weight: float
    height: float
    hip_cm: float
    active_standard: str

class CalculationResult(BaseModel):
    bmi: float
    bai: float
    bmi_category: str
    bai_category: str
    global_bmi_category: str
    asian_bmi_category: str
    advice: Dict[str, Any]
    coach_advice: str
    risk_data: Dict[str, Any]
    age_band: str

class ChatRequest(BaseModel):
    message: str
    metrics: Dict[str, Any]
    results: Dict[str, Any]

class ChatResponse(BaseModel):
    response: str

@app.post("/api/auth/signup", response_model=SignupResponse)
async def signup(user_data: UserSignup):
    if not register_user(user_data.username, user_data.full_name, user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    access_token = create_access_token(data={"sub": user_data.username})
    return {"access_token": access_token, "token_type": "bearer", "username": user_data.username}

@app.post("/api/auth/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = USER_DB.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/guest", response_model=Token)
async def guest_access():
    access_token = create_access_token(data={"sub": "guest"})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/data")
async def get_population_data(current_user: User = Depends(get_current_user)):
    raw_df = generate_dataset(50)
    df = transform_dataset(raw_df)
    patterns = mine_patterns(df)

    patterns_serializable = {
        "avg_bmi_by_age": patterns["avg_bmi_by_age"].to_dict(),
        "category_counts": patterns["category_counts"].to_dict(),
        "most_common_cat": patterns["most_common_cat"],
        "overall_avg_bmi": float(patterns["overall_avg_bmi"]),
        "overall_avg_bai": float(patterns["overall_avg_bai"]),
        "bmi_std": float(patterns["bmi_std"]),
        "total_users": int(patterns["total_users"]),
        "disparity_count": int(patterns["disparity_count"]),
        "agreement_count": int(patterns["agreement_count"]),
        "disparity_by_race": patterns["disparity_by_race"].to_dict(orient="records")
    }

    sample_data = df.head(15).to_dict(orient="records")
    chart_data = df[["Age", "BMI", "BAI", "Risk_Category", "Gender", "Race"]].to_dict(orient="records")

    return {
        "patterns": patterns_serializable,
        "sample": sample_data,
        "chart_data": chart_data
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_coach(chat_req: ChatRequest, current_user: User = Depends(get_current_user)):
    response_text = get_chatbot_response(chat_req.message, chat_req.metrics, chat_req.results)
    return ChatResponse(response=response_text)

@app.post("/api/calculate", response_model=CalculationResult)
async def calculate_metrics(metrics: UserMetrics, current_user: User = Depends(get_current_user)):
    height_m = metrics.height / 100
    active_thresholds = (
        STANDARD_THRESHOLDS if metrics.active_standard == STANDARD_GLOBAL else ASIAN_THRESHOLDS
    )

    bmi = calculate_bmi(metrics.weight, height_m)
    bai = calculate_bai(metrics.hip_cm, height_m)
    bmi_cat = classify_with_thresholds(bmi, active_thresholds)
    bai_cat = classify_bai(bai, metrics.gender, metrics.age)

    global_bmi_cat = classify_with_thresholds(bmi, STANDARD_THRESHOLDS)
    asian_bmi_cat = classify_with_thresholds(bmi, ASIAN_THRESHOLDS)

    age_band = get_age_band(metrics.age)
    risk_key = (age_band, bmi_cat)
    default_risk = {"prob": 0.10, "level": "Low", "color": "#639922"}

    risk_data = next((v for k, v in RISK_PROBABILITY.items() if k == risk_key), default_risk)

    coach_advice = get_dynamic_coach_advice(
        metrics.gender, metrics.age, bmi, bai, bmi_cat, bai_cat, metrics.active_standard
    )

    return CalculationResult(
        bmi=bmi,
        bai=bai,
        bmi_category=bmi_cat,
        bai_category=bai_cat,
        global_bmi_category=global_bmi_cat,
        asian_bmi_category=asian_bmi_cat,
        advice=HEALTH_ADVICE[bmi_cat],
        coach_advice=coach_advice,
        risk_data=risk_data,
        age_band=age_band
    )
@app.get("/api/debug/users")
async def list_users():
    return {username: {"username": data["username"], "full_name": data["full_name"]} for username, data in USER_DB.items()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)