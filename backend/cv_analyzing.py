import json
from pypdf import PdfReader
from typing import TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File 
from fastapi.middleware.cors import CORSMiddleware 
import inspect
import os

# ======================================================
# LLM CONFIG
# ======================================================
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(
    api_key=OPENAI_API_KEY,
    model="gpt-4o-mini",
    temperature=0
)

# ======================================================
# State
# ======================================================

class CVState(TypedDict, total=False):
    cv_text: str
    extracted_skills: list[str]
    user_required_skills: list[str]
    user_optional_skills: list[str]
    match_score: int

# ======================================================
# 1️ CV PARSER
# ======================================================

cv_parser_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "Te egy CV-parszer vagy. Az alábbi önéletrajz alapján gyűjtsd ki "
        "a jelölt főbb készségeit és tapasztalatait. "
        "Sorold fel őket vesszővel elválasztva egyetlen stringben. "
        "Csak a készségeket és tapasztalatokat add meg."
    ),
    ("user", "{cv_text}")
])

cv_parser_chain = cv_parser_prompt | llm | StrOutputParser()

async def cv_parser_node(state: CVState) -> CVState:
    maybe = cv_parser_chain.invoke({"cv_text": state["cv_text"]})
    response_str = await maybe if inspect.isawaitable(maybe) else maybe
    extracted = [s.strip() for s in response_str.split(",") if s.strip()]
    return {"extracted_skills": extracted}

# ======================================================
# 2️ REQUIRED / OPTIONAL MATCH NODE-OK
# ======================================================

async def cv_user_required_skills_node(state: CVState, required_skills_list) -> CVState:
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Hasonlítsd össze a {cv_text} listát a {required_skills_list} listával. "
                   "Sorold fel vesszővel elválasztva az egyező vagy hasonló elemeket egyetlen stringben. "
                   "Csak a készségeket és tapasztalatokat add meg vagy bármely más szakmai tapasztalatot, soft skill-t."
                   "Ne írj semmilyen magyarázó szöveget, példát, vagy kiegészítést."),
        ("user", "{cv_text}")
    ])
    chain = prompt | llm | StrOutputParser()
    maybe = chain.invoke({
        "cv_text": state["cv_text"],
        "required_skills_list": required_skills_list
    })
    response = await maybe if inspect.isawaitable(maybe) else maybe
    return {"user_required_skills": [s.strip() for s in response.split(",") if s.strip()]}

async def cv_user_optional_skills_node(state: CVState, optional_skills_list, required_skills_list) -> CVState:
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Hasonlítsd össze a {cv_text} listát a {optional_skills_list} listával. "
                   "Sorold fel vesszővel elválasztva az egyező vagy hasonló elemeket egyetlen stringben. "
                   "Csak a készségeket és tapasztalatokat add meg vagy bármely más szakmai tapasztalatot, soft skill-t."
                   "Ne írj semmilyen magyarázó szöveget, példát, vagy kiegészítést."),
        ("user", "{cv_text}")
    ])
    chain = prompt | llm | StrOutputParser()
    maybe = chain.invoke({
        "cv_text": state["cv_text"],
        "optional_skills_list": optional_skills_list
    })
    response = await maybe if inspect.isawaitable(maybe) else maybe

    # lowercase és whitespace normalizálás, duplikációk kiszűrése
    required_set = set(s.lower().strip() for s in required_skills_list)
    optional_seen = set()
    cleaned_optional = []

    for s in response.split(","):
        skill = s.strip()
        skill_lower = skill.lower()
        if skill and skill_lower not in required_set and skill_lower not in optional_seen:
            cleaned_optional.append(skill)
            optional_seen.add(skill_lower)

    return {"user_optional_skills": cleaned_optional}


# ======================================================
# 3️ SCORE + CATEGORY
# ======================================================

def calculate_score(required_done, optional_done, required_skills_list, optional_skills_list):
    req = len(required_done) / len(required_skills_list) * 70 if required_skills_list else 0
    opt = len(optional_done) / len(optional_skills_list) * 30 if optional_skills_list else 0
    return round(req + opt)

def category_router(score: int) -> str:
    if score < 50:
        return "nem alkalmas"
    if score < 80:
        return "talán"
    return "alkalmas"

# ======================================================
# 4️ PROGRESS NODE-OK (10/5 formátum)
# ======================================================

def required_progress_node(required_done, required_skills_list) -> str:
    return f"{len(required_skills_list)}/{len(required_done)}"

def optional_progress_node(optional_done, optional_skills_list) -> str:
    return f"{len(optional_skills_list)}/{len(optional_done)}"

# ======================================================
# 5️ EXPLANATION NODE (HR indoklás)
# ======================================================

explanation_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "Te egy HR-szakmai indoklást készítesz önéletrajz értékeléshez. "
        "Írj 2–4 mondatos, tömör, szakmai indoklást arról, "
        "miért ennyi lett a pontszám és a besorolás."
    ),
    (
        "user",
        """
CV-ben talált készségek: {cv_skills}
Kötelező követelmények teljesítése: {required_progress}
Opcionális követelmények teljesítése: {optional_progress}
Pontszám: {score}
Besorolás: {category}
"""
    )
])

explanation_chain = explanation_prompt | llm | StrOutputParser()

async def explanation_node(
    cv_skills: list[str],
    required_progress: str,
    optional_progress: str,
    score: int,
    category: str
) -> str:
    maybe = explanation_chain.invoke({
        "cv_skills": ", ".join(cv_skills),
        "required_progress": required_progress,
        "optional_progress": optional_progress,
        "score": score,
        "category": category
    })
    return await maybe if inspect.isawaitable(maybe) else maybe


