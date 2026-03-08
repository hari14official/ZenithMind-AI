from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.database import Base, engine
from app.api.v1.endpoints import auth, stress, reports, chat
from app.services.inference_service import inference_service
import os
import sys
import logging
from dotenv import load_dotenv

# Load environment variables
current_file = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_file))))
env_path = os.path.join(project_root, 'apps', 'web', '.env.local')
if os.path.exists(env_path):
    load_dotenv(env_path)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Stress Detection API",
    description="Real-time stress monitoring through facial expression analysis during gameplay",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router)
app.include_router(stress.router)
app.include_router(reports.router)
app.include_router(chat.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": inference_service.use_model}

@app.websocket("/ws/analysis")
async def websocket_analysis(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            face_data = {
                'blink_rate': data.get('blink_rate', 0.0),
                'eye_openness': data.get('eye_openness', 1.0),
                'jaw_clench': data.get('jaw_clench', 0.0),
                'brow_tension': data.get('brow_tension', 0.0),
                'jitter': data.get('jitter', 0.0),
                'game_score': data.get('game_score', 0.5)
            }
            result = inference_service.predict(face_data)
            await websocket.send_json({
                'stress_score': result['stress_score'],
                'stress_level': result['stress_level'],
                'confidence': result['confidence'],
                'timestamp': data.get('timestamp', '')
            })
    except Exception:
        pass

# Static files configuration
current_file = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_file))))
static_dir = os.path.join(project_root, 'apps', 'web', 'out')

if os.path.exists(static_dir):
    logger.info(f"ZENITH: Serving frontend from {static_dir}")
    # Mounting at / will serve index.html for root and other files as needed.
    # We mount it last so it doesn't intercept the API/WebSocket routes.
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    logger.error(f"ZENITH: Static frontend NOT found at {static_dir}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
