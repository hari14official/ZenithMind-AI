from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app import models, schemas

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user with detailed profile"""
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        # If it's a placeholder from the OTP flow, allow updating it
        if db_user.password_hash == "pending_reset":
            db_user.name = user.name
            db_user.password_hash = get_password_hash(user.password)
            db_user.work_type = user.work_type
            db_user.working_hours = user.working_hours
            db_user.mobile_usage = user.mobile_usage
            db_user.health_info = user.health_info
            db.commit()
            db.refresh(db_user)
            
            access_token = create_access_token(data={"sub": user.email, "user_id": db_user.id})
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": db_user
            }
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        name=user.name,
        work_type=user.work_type,
        working_hours=user.working_hours,
        mobile_usage=user.mobile_usage,
        health_info=user.health_info
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email, "user_id": db_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email, "user_id": db_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user(token: str, db: Session = Depends(get_db)):
    """Get current user profile"""
    from app.core.security import decode_access_token
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("user_id")
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user

# --- OTP FORGOT PASSWORD LOGIC ---
import random
import smtplib
import time
import os
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Temporary in-memory stores
otp_store = {} # {email: {"code": str, "expires": float}}
rate_limit_store = {} # {email: last_request_time}

def send_otp_email(email: str, code: str):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")
    
    if not sender_email or not sender_password:
        print(f"DEBUG: No email credentials. Code for {email} is {code}")
        return True # Simulate success for dev
        
    msg = MIMEMultipart()
    msg['From'] = f"ZenithMind AI <{sender_email}>"
    msg['To'] = email
    msg['Subject'] = "Your ZenithMind.AI Verification Code"
    
    html = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; padding: 40px; border-radius: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
        <h2 style="color: #6366f1; margin-bottom: 20px; font-weight: 800; text-align: center;">ZenithMind.AI</h2>
        <p style="font-size: 16px; color: #475569; text-align: center;">Use the code below to verify your account and reset your password.</p>
        <div style="background: white; border: 2px dashed #6366f1; color: #6366f1; font-size: 42px; font-weight: 900; text-align: center; padding: 30px; border-radius: 15px; margin: 30px 0; letter-spacing: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            {code}
        </div>
        <p style="font-size: 14px; color: #94a3b8; text-align: center;">Valid for 5 minutes. If you didn't request this, ignore this email.</p>
    </div>
    """
    msg.attach(MIMEText(html, 'html'))
    
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        return True
    except Exception as e:
        import traceback
        print(f"SMTP Error ({type(e).__name__}): {str(e)}")
        traceback.print_exc()
        return False

@router.post("/request-otp")
async def request_otp(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = req.email.lower()
    
    # Check if user exists
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Create a placeholder user to allow OTP flow to proceed
        user = models.User(
            id=f"user_{int(datetime.now().timestamp())}",
            email=email,
            name=email.split('@')[0],
            password_hash="pending_reset"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Rate limit: 1 request per 60s
    now = time.time()
    if email in rate_limit_store and now - rate_limit_store[email] < 60:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait 60 seconds.")
    
    code = f"{random.randint(100000, 999999)}"
    otp_store[email] = {"code": code, "expires": now + 300} # 5 mins
    rate_limit_store[email] = now
    
    success = send_otp_email(email, code)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email. Check SMTP settings.")
        
    return {"message": "OTP sent successfully to your email."}

@router.post("/verify-otp")
async def verify_otp(req: schemas.VerifyOTPRequest):
    email = req.email.lower()
    if email not in otp_store:
        raise HTTPException(status_code=401, detail="Invalid request. Request a new OTP.")
        
    entry = otp_store[email]
    if time.time() > entry["expires"]:
        del otp_store[email]
        raise HTTPException(status_code=401, detail="OTP has expired. Please try again.")
        
    if entry["code"] != req.code:
        raise HTTPException(status_code=401, detail="Incorrect OTP code.")
        
    # Generate a temporary token for the next step
    token = base64.b64encode(f"{email}:{time.time() + 600}".encode()).decode()
    del otp_store[email]
    
    return {"message": "OTP Verified", "resetToken": token}

@router.post("/reset-password")
async def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    email = req.email.lower()
    
    # Verify token (simple decode and check)
    try:
        decoded = base64.b64decode(req.resetToken).decode()
        token_email, expires = decoded.split(":")
        if token_email.lower() != email or time.time() > float(expires):
            raise ValueError("Token invalid or expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired reset session.")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User mapping lost. Please restart.")
        
    # Update password
    user.password_hash = get_password_hash(req.password)
    db.commit()
    
    return {"message": "Password reset successfully!"}

def send_login_alert_email(email: str, name: str):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")
    
    if not sender_email or not sender_password:
        return False
        
    msg = MIMEMultipart()
    msg['From'] = f"ZenithMind AI <{sender_email}>"
    msg['To'] = email
    msg['Subject'] = "New Login to ZenithMind.AI"
    
    html = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; padding: 40px; border-radius: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
        <h2 style="color: #6366f1; margin-bottom: 20px; font-weight: 800; text-align: center;">ZenithMind.AI</h2>
        <p style="font-size: 16px; color: #475569; text-align: center;">Hello {name},</p>
        <p style="font-size: 16px; color: #475569; text-align: center;">You have successfully signed in to ZenithMind.AI.</p>
        <p style="font-size: 14px; color: #94a3b8; text-align: center;">If this was not you, please secure your account immediately.</p>
    </div>
    """
    msg.attach(MIMEText(html, 'html'))
    
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        return True
    except Exception as e:
        import traceback
        print(f"SMTP Error in login alert: {str(e)}")
        return False

@router.post("/login-alert")
async def login_alert(req: schemas.LoginAlertRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_login_alert_email, req.email, req.name)
    return {"message": "Alert triggered"}
