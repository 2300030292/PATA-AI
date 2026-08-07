import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def parse_indian_address(address: str):

    prompt = f"""
You are an expert AI Indian address resolver.

The address may be written in Telugu, Hindi, Tamil, Kannada or English.

Tasks:
- Detect language
- Translate to English
- Correct address
- Find landmark
- Find locality
- Find city
- Find state
- Find pincode
- Give confidence score

Return ONLY JSON.

{{
"language":"",
"corrected_address":"",
"landmark":"",
"locality":"",
"city":"",
"state":"",
"pincode":"",
"confidence":0
}}

Address:
{address}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    return response.text