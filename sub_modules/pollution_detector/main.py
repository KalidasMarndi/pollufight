from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from PIL import Image
import io
import requests

from detector import detect_pollution
from drafter import generate_legal_draft

app = FastAPI(title="Pollution Detector Backend")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files
app.mount("/static", StaticFiles(directory="static"), name="static")

class AnalysisResponse(BaseModel):
    pollution_type: str
    confidence_level: float
    legal_draft: str
    details: list

@app.get("/")
def read_root():
    return FileResponse('static/index.html')

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None)
):
    try:
        # Load image from file or URL
        if file:
            image_data = await file.read()
            image = Image.open(io.BytesIO(image_data))
        elif image_url:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
            response = requests.get(image_url, headers=headers)
            response.raise_for_status()
            image = Image.open(io.BytesIO(response.content))
        else:
            raise HTTPException(status_code=400, detail="Either file or image_url must be provided")

        # 1. Detect Pollution
        filename = file.filename if file else "unknown.jpg"
        detection_result = detect_pollution(image, filename)
        
        pollution_type = detection_result["pollution_type"]
        confidence = detection_result["confidence_level"]
        details = detection_result["details"]

        # 2. Generate Draft if pollution is detected
        # If no pollution detected, we can verify if we still want a draft or a generic message.
        # For this requirement, we will try to generate a draft if we have a type,
        # otherwise we might return a "No Action" status.
        
        if pollution_type == "No obvious pollution detected":
             legal_draft = "No significant pollution detected warranting a legal notice."
        else:
             legal_draft = generate_legal_draft(pollution_type, details)

        return {
            "pollution_type": pollution_type,
            "confidence_level": confidence,
            "legal_draft": legal_draft,
            "details": details
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
