import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from typing import List

# Importáljuk a logikát a másik fájlból
from cv_analyzing import (
    extract_skills, 
    match_skills, 
    calculate_score, 
    category_router, 
    hr_summary
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/analyze-cv")
async def analyze_cv_endpoint(
    cv_file: UploadFile = File(...),
    skills_file: UploadFile = File(...)
):
    try:
        # 1. PDF FELDOLGOZÁS (Memóriából)
        # A file.file objektumot közvetlenül átadjuk a PdfReadernek
        reader = PdfReader(cv_file.file)
        cv_text = "".join(page.extract_text() or "" for page in reader.pages)

        # 2. JSON FELDOLGOZÁS (Memóriából)
        skills_data = json.load(skills_file.file)
        
        # Listák kinyerése a JSON-ból
        required_skills_list = [s["name"] for s in skills_data.get("required", [])]
        optional_skills_list = [s["name"] for s in skills_data.get("optional", [])]

        # 3. LOGIKA FUTTATÁSA (cv_analyzing.py funkciók)
        
        # A) Skillek kinyerése a CV szövegéből
        extracted_skills = extract_skills(cv_text)

        # B) Összehasonlítás (Matching)
        required_done = match_skills(
            extracted_skills,
            required_skills_list,
            mode="required"
        )

        optional_done = match_skills(
            extracted_skills,
            optional_skills_list,
            mode="optional"
        )

        # C) Pontszámítás
        score = calculate_score(
            required_done, 
            optional_done, 
            required_skills_list, 
            optional_skills_list
        )

        # D) Kategória meghatározás
        category = category_router(score)

        # E) HR Összefoglaló generálása
        summary = hr_summary(
            score, 
            required_done, 
            optional_done, 
            category, 
            required_skills_list
        )

        # 4. VÁLASZ VISSZAKÜLDÉSE
        return {
            "extracted_skills": extracted_skills,
            "required_done": required_done,
            "optional_done": optional_done,
            "score": score,
            "category": category,
            "hr_summary": summary
        }

    except Exception as e:
        # Hiba esetén 500-as választ küldünk a hibaüzenettel
        return HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)