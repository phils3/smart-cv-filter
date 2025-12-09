import json
from pypdf import PdfReader
from typing import TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from dotenv import load_dotenv

load_dotenv()  # beolvassa a .env fájl tartalmát

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# a main.py helye
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# content mappa elérési útja
CONTENT_DIR = os.path.join(BASE_DIR, "content")

# required_skills.json
required_skills_path = os.path.join(CONTENT_DIR, "required_skills.json")

# cv.pdf
cv_path = os.path.join(CONTENT_DIR, "cv.pdf")

# -------------------------------
# Skill listák beolvasása
# -------------------------------
with open(required_skills_path, "r", encoding="utf-8") as f:
    skill_data = json.load(f)

required_skills_list = [skill['name'] for skill in skill_data['required']]
optional_skills_list = [skill['name'] for skill in skill_data['optional']]

# -------------------------------
# PDF importálás és szöveggé alakítás
# -------------------------------
path_to_cv = cv_path
with open(path_to_cv, "rb") as f:
    reader = PdfReader(f)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

# -------------------------------
# State struktúra
# -------------------------------
class CVState(TypedDict, total=False):
    cv_text: str
    extracted_skills: list[str]
    user_required_skills: list[str]
    user_optional_skills: list[str]
    match_score: int

# -------------------------------
# LLM konfiguráció
# -------------------------------
llm = ChatOpenAI(
    api_key=OPENAI_API_KEY,
    model="gpt-4o-mini",
    temperature=0
)

# -------------------------------
# CV skill parser
# -------------------------------
cv_parser_prompt = ChatPromptTemplate.from_messages([
    ("system", """
Te egy CV-parszer vagy. Az alábbi önéletrajz alapján gyűjtsd ki a jelölt főbb készségeit és tapasztalatait.
Sorold fel őket vesszővel elválasztva egyetlen stringben.
Csak a készségeket és tapasztalatokat add meg, semmi mást.
"""),
    ("user", "{cv_text}")
])
cv_parser_chain = cv_parser_prompt | llm | StrOutputParser()

def cv_parser_node(state: CVState) -> CVState:
    cv_text = state["cv_text"]
    response_str = cv_parser_chain.invoke({"cv_text": cv_text})
    extracted_skills_list = [skill.strip() for skill in response_str.split(',') if skill.strip()]
    return {"extracted_skills": extracted_skills_list}

# -------------------------------
# Kötelező skill összehasonlítás prompt
# -------------------------------
cv_required_prompt = ChatPromptTemplate.from_messages([
    ("system", """
Hasonlítsd össze a {cv_text} listát a {required_skills_list} listával.
Sorold fel vesszővel elválasztva azokat az elemeket,
amik szerinted megegyeznek a {cv_text} lista elemei a {required_skills_list} lista elemeivel.
Csak a készségeket és tapasztalatokat add meg, semmi mást.
"""),
    ("user", "{cv_text}")
])
cv_required_chain = cv_required_prompt | llm | StrOutputParser()

def cv_user_required_skills_node(state: CVState) -> CVState:
    cv_text = state["cv_text"]
    response_str = cv_required_chain.invoke({
        "cv_text": cv_text,
        "required_skills_list": required_skills_list
    })
    user_required_skill_list = [skill.strip() for skill in response_str.split(',') if skill.strip()]
    return {"user_required_skills": user_required_skill_list}

# -------------------------------
# Opcionális skill összehasonlítás prompt
# -------------------------------
cv_optional_prompt = ChatPromptTemplate.from_messages([
    ("system", """
Hasonlítsd össze a {cv_text} listát a {optional_skills_list} listával.
Sorold fel vesszővel elválasztva azokat az elemeket,
amik szerinted megegyeznek a {cv_text} lista elemei a {optional_skills_list} lista elemeivel.
Csak a készségeket és tapasztalatokat add meg, semmi mást.
"""),
    ("user", "{cv_text}")
])
cv_optional_chain = cv_optional_prompt | llm | StrOutputParser()

def cv_user_optional_skills_node(state: CVState) -> CVState:
    cv_text = state["cv_text"]
    response_str = cv_optional_chain.invoke({
        "cv_text": cv_text,
        "optional_skills_list": optional_skills_list
    })
    user_optional_skill_list = [skill.strip() for skill in response_str.split(',') if skill.strip()]
    return {"user_optional_skills": user_optional_skill_list}

# -------------------------------
# Score számítás
# -------------------------------
def calculate_score(required_done, optional_done):
    req_score = len(required_done) / len(required_skills_list) * 70 if required_skills_list else 0
    opt_score = len(optional_done) / len(optional_skills_list) * 30 if optional_skills_list else 0
    return round(req_score + opt_score)

# -------------------------------
# Fő pipeline
# -------------------------------
state: CVState = {"cv_text": text}

# 1. Kinyerjük a CV skill-eket
parsed = cv_parser_node(state)
state.update(parsed)
extracted_skills = parsed.get("extracted_skills", [])

# 2. Kötelező és opcionális skill-ek teljesítése
required_done = cv_user_required_skills_node(state).get("user_required_skills", [])
optional_done = cv_user_optional_skills_node(state).get("user_optional_skills", [])

# 3. Match score
score = calculate_score(required_done, optional_done)

# -------------------------------
# Eredmények kiírása
# -------------------------------
print("CV-ből kinyert skill-ek:", extracted_skills)
print("Teljesített kötelező skill-ek:", required_done)
print("Teljesített opcionális skill-ek:", optional_done)
print("Match score:", score)
