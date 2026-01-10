import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_legal_draft(pollution_type: str, details: list) -> str:
    """
    Generates a deterministic legal draft based on the detected pollution type.
    Now bypasses AI models entirely as per user request.
    """
    date_str = datetime.date.today().strftime("%B %d, %Y")
    ref_no = f"ENV/COMP/{datetime.date.today().strftime('%Y%m%d')}/001"
    
    # Calculate overall confidence (max of individual items)
    confidence_level = 0.0
    if details:
        confidence_level = max(d['score'] for d in details)
    
    # Format details for professional listing
    evidence_list = "\n".join([f"   - {d['label'].title()} (Confidence: {d['score']:.1%})" for d in details])
    
    # Determine specific legal context based on pollution type
    legal_context = ""
    if "Vehicle" in pollution_type:
        legal_context = "This is in direct violation of the Motor Vehicles Act and applicable Air Prevention and Control of Pollution norms regarding vehicular emissions."
    elif "Industrial" in pollution_type:
         legal_context = "This constitutes a violation of the Air (Prevention and Control of Pollution) Act and relevant environmental clearance conditions."
    elif "Waste" in pollution_type:
         legal_context = "This is a violation of the Solid Waste Management Rules, 2016, and local municipal sanitation bylaws."
    else:
         legal_context = "This activity violates the Environment (Protection) Act and public nuisance laws under the Indian Penal Code."

    template = f"""[Legal Notice - Automated Draft]
Ref No: {ref_no}
Date: {date_str}

To,
The Regional Officer / Municipal Commissioner,
Pollution Control Board / Municipal Corporation,
[City Name, State, Zip Code]

SUBJECT: FORMAL COMPLAINT REGARDING {pollution_type.upper()}

1. INCIDENT DETAILS
   - Pollution Type: {pollution_type}
   - Detection Confidence Level: {confidence_level:.2%}
   - Date of Observation: {date_str}
   - Location: [Location/Address]

2. EVIDENCE SUMMARY
The following sources were detected by our automated AI monitoring system:
{evidence_list}

3. LEGAL VIOLATIONS
{legal_context}

4. DEMAND FOR ACTION
I hereby request the competent authority to:
   a) Conduct an immediate site inspection.
   b) Take necessary measures to abate the pollution source.
   c) Initiate appropriate legal action against the violators.

Please treat this as an urgent matter affecting public health.

Sincerely,

[Your User Name]
Concerned Citizen
"""
    return template
