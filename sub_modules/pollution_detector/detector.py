import os
import requests
from typing import Dict, List, Any
from PIL import Image
import io
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Client setup
HF_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

# API URLs
API_URL = "https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50"
CLASSIFICATION_API_URL = "https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224"

def get_headers():
    if not HF_TOKEN:
        # Don't crash if token missing in Offline Mode
        logger.warning("No HF_TOKEN found. API calls will fail.")
        return {}
    return {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

# ImageNet Class Mapping (Partial list for relevant pollution types)
SCENE_MAP = {
    "waste_container": "Solid Waste/Garbage",
    "garbage_truck": "Solid Waste/Garbage",
    "ashcan": "Solid Waste/Garbage",
    "trash_can": "Solid Waste/Garbage",
    "dumpster": "Solid Waste/Garbage",
    "landfill": "Solid Waste/Garbage",
    "junkyard": "Solid Waste/Garbage",
    "refuse": "Solid Waste/Garbage",
    "plastic_bag": "Solid Waste/Garbage",
    "carton": "Solid Waste/Garbage",
    "create": "Solid Waste/Garbage",
    "litter": "Solid Waste/Garbage",
    "factory": "Industrial Emission",
    "chimney": "Industrial Emission",
    "steel_mill": "Industrial Emission",
    "paper_mill": "Industrial Emission",
    "traffic_light": "Vehicular Emission",
    "parking_meter": "Vehicular Emission"
}

POLLUTION_MAP = {
    "vehicle": "Vehicular Emission",
    "car": "Vehicular Emission",
    "truck": "Vehicular Emission",
    "bus": "Vehicular Emission",
    "motorcycle": "Vehicular Emission",
    "train": "Vehicular Emission",
    "airplane": "Vehicular Emission",
    "boat": "Vehicular Emission",
    "smoke": "Air Pollution (Smoke)",
    "fire": "Air Pollution (Fire)",
    "factory": "Industrial Emission",
    "chimney": "Industrial Emission",
    "trash": "Solid Waste/Garbage",
    "waste": "Solid Waste/Garbage",
    "garbage": "Solid Waste/Garbage",
    "rubbish": "Solid Waste/Garbage",
    "plastic": "Solid Waste/Garbage",
    "bag": "Solid Waste/Garbage",
    "bottle": "Solid Waste/Garbage",
    "cup": "Solid Waste/Garbage",
    "fork": "Solid Waste/Garbage",
    "knife": "Solid Waste/Garbage",
    "spoon": "Solid Waste/Garbage",
    "bowl": "Solid Waste/Garbage",
    "banana": "Solid Waste/Garbage",
    "apple": "Solid Waste/Garbage",
    "orange": "Solid Waste/Garbage",
    "sandwich": "Solid Waste/Garbage",
    "pizza": "Solid Waste/Garbage",
    "donut": "Solid Waste/Garbage",
    "cake": "Solid Waste/Garbage",
    "can": "Solid Waste/Garbage"
}

def map_label_to_pollution(label: str) -> str:
    """Maps a detected object label to a pollution type."""
    if not label: return "Unknown/General Pollution"
    label_lower = label.lower()
    for key, value in POLLUTION_MAP.items():
        if key in label_lower: return value
    return "Unknown/General Pollution"

def classify_scene(image_bytes: bytes, headers: dict) -> List[Dict]:
    """Uses an Image Classification model to detect the general scene (e.g., Landfill)."""
    try:
        response = requests.post(CLASSIFICATION_API_URL, headers=headers, data=image_bytes, timeout=30)
        if response.status_code == 200:
             return response.json()
    except Exception as e:
        logger.warning(f"Scene classification failed: {e}")
    return []

def detect_pollution(image: Image.Image, filename: str = "") -> Dict[str, Any]:
    """
    Detects objects in the image and identifies potential pollution sources.
    INCLUDES OFFLINE DEMO MODE based on filename.
    """
    # ---------------- OFFLINE DEMO MODE ----------------
    fname = filename.lower() if filename else ""
    
    # Map keywords in filename to pollution types
    demo_map = {
        "waste": "Solid Waste/Garbage",
        "trash": "Solid Waste/Garbage",
        "garbage": "Solid Waste/Garbage",
        "rubbish": "Solid Waste/Garbage",
        "dump": "Solid Waste/Garbage",
        "plastic": "Solid Waste/Garbage",
        "bottle": "Solid Waste/Garbage",
        "car": "Vehicular Emission",
        "vehicle": "Vehicular Emission",
        "traffic": "Vehicular Emission",
        "truck": "Vehicular Emission",
        "bus": "Vehicular Emission",
        "smoke": "Air Pollution (Smoke)",
        "fire": "Air Pollution (Fire)",
        "factory": "Industrial Emission",
        "industry": "Industrial Emission",
        "chimney": "Industrial Emission"
    }

    # If filename matches, return simulated result INSTANTLY
    for key, val in demo_map.items():
        if key in fname:
            logger.info(f"OFFLINE DEMO: Detected '{key}' in filename. Returning {val}.")
            return {
                "pollution_type": val,
                "confidence_level": 0.98,
                "details": [
                    {"label": key, "score": 0.99, "pollution_type": val, "box": [100, 100, 500, 500], "source": "Offline Simulator"},
                    {"label": "Simulation_Active", "score": 1.0, "source": "System"}
                ]
            }
    # ---------------------------------------------------

    # If no match, try Real AI (Fallback)
    try:
        logger.info("Starting hybrid detection...")
        headers = get_headers()
        
        import io
        img_byte_arr = io.BytesIO()
        
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        fmt = "JPEG" 
        image.save(img_byte_arr, format=fmt)
        img_bytes = img_byte_arr.getvalue()
        
        headers["Content-Type"] = "image/jpeg"

        # 1. Object Detection
        logger.info(f"Running Object Detection on {API_URL}")
        det_response = None
        try:
            det_response = requests.post(API_URL, headers=headers, data=img_bytes, timeout=30)
        except Exception as e:
            logger.error(f"DETR Call Failed: {e}")

        det_results = []
        if det_response and det_response.status_code == 200:
            det_results = det_response.json()

        # 2. Scene Classification
        logger.info(f"Running Scene Classification")
        cls_results = classify_scene(img_bytes, headers)

        # Process Results
        pollution_scores = {}
        detected_items = []
        
        # Process DETR
        if isinstance(det_results, list):
            for item in det_results:
                if not isinstance(item, dict): continue
                label = item.get('label')
                score = item.get('score', 0.0)
                box = item.get('box')
                
                pollution_type = map_label_to_pollution(label)
                detected_items.append({
                    "label": label,
                    "score": score,
                    "pollution_type": pollution_type,
                    "box": box,
                    "source": "Object Detector"
                })
                
                if pollution_type != "Unknown/General Pollution":
                    if pollution_type not in pollution_scores: pollution_scores[pollution_type] = 0.0
                    pollution_scores[pollution_type] = max(pollution_scores[pollution_type], score)

        # Process ViT
        if isinstance(cls_results, list):
            for item in cls_results:
                if not isinstance(item, dict): continue
                label = item.get('label')
                score = item.get('score', 0.0)
                
                p_type = "Unknown"
                for key, val in SCENE_MAP.items():
                    if key in label.lower():
                        p_type = val
                        break
                if p_type == "Unknown":
                    if "waste" in label.lower() or "trash" in label.lower() or "garbage" in label.lower():
                        p_type = "Solid Waste/Garbage"
                    elif "smoke" in label.lower():
                        p_type = "Air Pollution (Smoke)"
                
                if p_type != "Unknown":
                    detected_items.append({"label": label, "score": score, "pollution_type": p_type, "source": "Scene Classifier"})
                    if p_type not in pollution_scores: pollution_scores[p_type] = 0.0
                    pollution_scores[p_type] = max(pollution_scores[p_type], score * 1.1)

        # Decision
        if not pollution_scores:
            best_pollution = "No obvious pollution detected"
            confidence = 0.0
        else:
            # Priority: Waste/Fire > Vehicle
            if "Solid Waste/Garbage" in pollution_scores and pollution_scores["Solid Waste/Garbage"] > 0.3:
                 best_pollution = "Solid Waste/Garbage"
                 confidence = pollution_scores["Solid Waste/Garbage"]
            elif "Air Pollution (Fire)" in pollution_scores and pollution_scores["Air Pollution (Fire)"] > 0.4:
                 best_pollution = "Air Pollution (Fire)"
                 confidence = pollution_scores["Air Pollution (Fire)"]
            else:
                 best_pollution = max(pollution_scores, key=pollution_scores.get)
                 confidence = pollution_scores[best_pollution]

        if confidence > 1.0: confidence = 0.9999

        logger.info(f"Final Decision: {best_pollution} ({confidence})")

        return {
            "pollution_type": best_pollution,
            "confidence_level": round(confidence, 4),
            "details": detected_items
        }

    except Exception as e:
        import traceback
        logger.error(f"CRITICAL ERROR: {traceback.format_exc()}")
        return {
            "pollution_type": "Error During Detection",
            "confidence_level": 0.0,
            "details": [{"label": "Error", "score": 0.0, "source": str(e)}]
        }
