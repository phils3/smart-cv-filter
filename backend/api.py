from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
import json
from cv_analyzing import (
    cv_parser_node,
    cv_user_required_skills_node,
    cv_user_optional_skills_node,
    calculate_score,
    category_router,
    required_progress_node,
    optional_progress_node,
    explanation_node,
    CVState
)

import inspect

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/analyze-cv")
async def analyze_cv(
    cv_file: UploadFile = File(...),
    skills_file: UploadFile = File(...)
):
    # --- PDF → text
    reader = PdfReader(cv_file.file)
    text = "".join([page.extract_text() or "" for page in reader.pages])

    # --- JSON → skill listák
    skills_data = json.load(skills_file.file)
    required_skills_list = [s["name"] for s in skills_data.get("required", [])]
    optional_skills_list = [s["name"] for s in skills_data.get("optional", [])]

    # --- CV feldolgozás
    state: CVState = {"cv_text": text}
    state.update(await cv_parser_node(state))

    required_done = (await cv_user_required_skills_node(state, required_skills_list)).get("user_required_skills", [])
    optional_done = (await cv_user_optional_skills_node(state, optional_skills_list,required_skills_list)).get("user_optional_skills", [])

    # --- Score + kategória
    score = calculate_score(required_done, optional_done, required_skills_list, optional_skills_list)
    category = category_router(score)

    # --- Progress stringek
    required_progress = required_progress_node(required_done, required_skills_list)
    optional_progress = optional_progress_node(optional_done, optional_skills_list)

    # --- GPT indoklás
    explanation = await explanation_node(
        state.get("extracted_skills", []),
        required_progress,
        optional_progress,
        score,
        category
    )
     # --- Konzol kiírás
    print_cv_analysis(
        extracted_skills=state.get("extracted_skills", []),
        required_done=required_done,
        optional_done=optional_done,
        score=score,
        category=category,
        required_skills_list=required_skills_list,
        optional_skills_list=optional_skills_list
    )
    
    return {
        "extracted_skills": state.get("extracted_skills", []),
        "required_done": required_done,
        "optional_done": optional_done,
        "required_progress": required_progress,
        "optional_progress": optional_progress,
        "score": score,
        "category": category,
        "explanation": explanation
    }
    
def print_cv_analysis(
    extracted_skills: list[str],
    required_done: list[str],
    optional_done: list[str],
    score: int,
    category: str,
    required_skills_list: list[str],
    optional_skills_list: list[str]
):
    required_progress = f"{len(required_done)}/{len(required_skills_list)}"
    optional_progress = f"{len(optional_done)}/{len(optional_skills_list)}"
    
    print("\n=== CV ANALYSIS ===")
    print(f"CV-ben talált készségek: {', '.join(extracted_skills) if extracted_skills else 'Nincsenek kinyert skillek'}")
    print(f"Kötelező követelmények (teljesített): {', '.join(required_done) if required_done else 'Nincs'}")
    print(f"Opcionális követelmények (teljesített): {', '.join(optional_done) if optional_done else 'Nincs'}")
    print(f"Pontszám: {score}")
    print(f"Megfelelt-e: {category}")
    print(f"Kötelező követelmények teljesítése: {required_progress}")
    print(f"Opcionális követelmények teljesítése: {optional_progress}")
    print("==================\n")
