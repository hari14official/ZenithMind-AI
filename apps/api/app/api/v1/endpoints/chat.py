from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

try:
    import google.generativeai as genai
except ImportError:
    genai = None

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

class ChatRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(request: ChatRequest):
    if not genai:
        return {"answer": "Gemini AI module is not installed on the server (google-generativeai module missing)."}
    
    api_key = os.getenv("GEMINI_API_KEY", "AIzaSyB_wlF8QKuL7r2iMv6R3pIm4s7UpuuQQnY")
    if not api_key:
        return {"answer": "I'm sorry, artificial intelligence answers are currently disabled because the server is missing the Google Gemini API Key. Please configure GEMINI_API_KEY to use real-time AI answers."}
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("models/gemini-flash-latest")
        prompt = f"You are a helpful support chatbot for ZenithMind.AI, a workplace stress relief and monitoring application. Please answer this user question concisely and politely: {request.question}"
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        return {"answer": f"Error communicating with AI: {str(e)}"}
