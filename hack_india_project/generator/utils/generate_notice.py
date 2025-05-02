import os
import requests
from docx import Document
from datetime import datetime
from num2words import num2words  # pip install num2words

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "docx_template.docx")

def generate_notice(data):
    """Generate legal notice document"""
    try:
        # Try Llama2 first
        notice_text = get_llama_response(data)
    except Exception as e:
        print(f"Llama2 Error: {str(e)} - Using fallback template")
        notice_text = create_fallback_notice(data)
    
    # Create document
    doc = Document(TEMPLATE_PATH)
    
    # Add generated content
    for paragraph in notice_text.split('\n'):
        if paragraph.strip():
            doc.add_paragraph(paragraph)
    
    # Save document
    filename = f"notice_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
    output_path = os.path.join("generated", filename)
    doc.save(output_path)
    
    return output_path

def get_llama_response(data):
    """Get response from local Llama2"""
    prompt = f"""Generate a formal Indian legal notice for unpaid rent with:
    - Landlord: {data['landlord_name']}
    - Tenant: {data['tenant_name']}
    - Property: {data['rental_address']}
    - Unpaid: {data['months_unpaid']} months
    - Rent: ₹{data['monthly_rent']}/month
    - Format: Proper legal structure"""
    
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama2",
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.7}
        },
        timeout=300
    )
    response.raise_for_status()
    return response.json()['response']

def create_fallback_notice(data):
    """Professional Indian legal notice template"""
    return f"""
    LEGAL NOTICE
    
    UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882
    
    From:
    {data['landlord_name']}
    {data['landlord_address']}
    
    To:
    {data['tenant_name']}
    {data['rental_address']}
    
    Date: {datetime.now().strftime('%d/%m/%Y')}
    
    Subject: Legal Notice for Non-Payment of Rent and Vacation of Premises
    
    Dear Sir/Madam,
    
    1. This legal notice is served upon you under Section 106 of the Transfer of Property Act, 1882, read with the relevant provisions of the Indian Contract Act, 1872.
    
    2. Whereas you are occupying the premises situated at {data['rental_address']} as a tenant under a rental agreement dated {data['agreement_date']};
    
    3. And whereas you have failed to pay the monthly rent of ₹{data['monthly_rent']}/- (Rupees {num2words(int(data['monthly_rent'])).title()} Only) for the period of {data['months_unpaid']} months;
    
    4. And whereas the total arrears now amount to ₹{int(data['monthly_rent']) * len(data['months_unpaid'].split(','))}/- (Rupees {num2words(int(data['monthly_rent']) * len(data['months_unpaid'].split(','))).title()} Only);
    
    5. Now therefore, you are hereby called upon to:
       (a) Clear the entire outstanding amount of ₹{int(data['monthly_rent']) * len(data['months_unpaid'].split(','))}/- within {data['payment_days']} days from receipt of this notice;
       (b) Peacefully vacate the said premises within {data['vacate_days']} days from receipt of this notice;
    
    6. Take notice that failure to comply with this demand shall compel me to initiate appropriate legal proceedings against you under:
       - The Transfer of Property Act, 1882
       - The Rent Control Act of the respective state
       - Other applicable laws
    
    7. Please note that all costs, charges and expenses incurred in such legal proceedings shall be borne by you.
    
    8. This notice is without prejudice to any other rights and remedies available to me under law.
    
    Yours faithfully,
    
    {data['landlord_name']}
    (Landlord)
    
    Encl: Copy of rental agreement (if available)
    """