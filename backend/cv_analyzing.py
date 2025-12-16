import os
from typing import List
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# SETUP

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(
    api_key=OPENAI_API_KEY,
    model="gpt-4o-mini",
    temperature=0
)

# 1. SKILL EXTRACTION (STRICT - CODE 1 LOGIC)

cv_parser_prompt = ChatPromptTemplate.from_messages([
    ("system", """
Te egy CV-parszer vagy.

Feladatod:
- A szövegben EXPLICIT módon szereplő készségeket és tapasztalatokat gyűjtsd ki
- Csak azt add vissza, ami konkrétan le van írva
- Ne következtess
- Ne egészítsd ki

Formátum:
- vesszővel elválasztott lista
- csak skill / tapasztalat
"""),
    ("user", "{cv_text}")
])

cv_parser_chain = cv_parser_prompt | llm | StrOutputParser()

def extract_skills(cv_text: str) -> List[str]:
    response = cv_parser_chain.invoke({"cv_text": cv_text})
    return [s.strip() for s in response.split(",") if s.strip()]

# 2. MATCH SKILLS (NO HALLUCINATION - CODE 1 LOGIC)

def match_skills(
    extracted_skills: List[str],
    target_skills: List[str],
    mode: str
) -> List[str]:
    """
    mode: 'required' | 'optional'
    """
    # Ha üres a target lista, nincs mit vizsgálni
    if not target_skills:
        return []

    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""
Te egy ATS (Applicant Tracking System) vagy.

Szabályok:
- CSAK az input listában szereplő skillekkel dolgozhatsz
- NEM következtethetsz
- NEM feltételezhetsz
- NEM használhatsz külső tudást

Megengedett:
- kis/nagybetű eltérés (git == GIT)
- közismert szinonima (git == version control)
- magyar / angol megfelelő

TILOS:
- szakmai háttérből való levezetés
- "általában együtt jár" logika

Csak azokat add vissza, amelyek EGYÉRTELMŰEN megfeleltethetők.

Ha nincs egyezés, adj vissza üres választ.
"""),
        ("user", f"""
Jelölt skillek:
{", ".join(extracted_skills)}

{mode.capitalize()} követelmények:
{", ".join(target_skills)}
""")
    ])

    chain = prompt | llm | StrOutputParser()
    response = chain.invoke({})

    return [s.strip() for s in response.split(",") if s.strip()]

# 3. SCORING (CODE 1 LOGIC)

def calculate_score(required_done: List[str], optional_done: List[str], all_required: List[str], all_optional: List[str]) -> int:
    # Itt paraméterként kapja meg az összes szükséges skill listáját a számításhoz
    req_len = len(all_required)
    opt_len = len(all_optional)

    req_score = (len(required_done) / req_len) * 70 if req_len > 0 else 0
    opt_score = (len(optional_done) / opt_len) * 30 if opt_len > 0 else 0
    
    score = round(req_score + opt_score)
    
    if score >= 100:
        return 100
    return score

def category_router(score: int) -> str:
    if score < 50:
        return "nem alkalmas"
    if score < 80:
        return "talán"
    return "alkalmas"

# 4. HR SUMMARY (CODE 1 LOGIC)


def hr_summary(score: int, required_done: List[str], optional_done: List[str], category: str, all_required: List[str]) -> str:
    # Kiszámoljuk a hiányzókat itt, dinamikusan
    required_missing = [s for s in all_required if s not in required_done]

    prompt = ChatPromptTemplate.from_messages([
        ("system", """
Te egy HR-barát szakmai összegző vagy, aki elmagyarázza a HR-nek miért ennyi a pontszáma a cv-nek, és a besorolása.
Ne technikai részletezz, hanem érthetően fogalmazz, röviden tömören.
"""),
        ("user", f"""
Pontszám: {score}
Kategória: {category}

Teljesült kötelező skillek:
{", ".join(required_done) or "nincs"}

Hiányzó kötelező skillek:
{", ".join(required_missing)}

Teljesült opcionális skillek:
{", ".join(optional_done) or "nincs"}
""")
    ])

    chain = prompt | llm | StrOutputParser()
    return chain.invoke({})