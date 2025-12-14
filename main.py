import json
from pypdf import PdfReader
from typing import TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, END
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
    category: str
    explanation: str

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
def calculate_score_node(state: CVState) -> CVState:
    required_done = state["user_required_skills"]
    optional_done = state["user_optional_skills"]
    req_score = len(required_done) / len(required_skills_list) * 70 if required_skills_list else 0
    opt_score = len(optional_done) / len(optional_skills_list) * 30 if optional_skills_list else 0
    return {"match_score": round(req_score + opt_score)}

# -------------------------------
# Router
# -------------------------------

# Itt megvalósul a feladatban megadott routing, ezek esetleg kategóriák alapján másfajta indoklásokat adhatnának? (egyelőre placeholder)
def passed_node(state: CVState):
    return {"explanation": "alkalmas"}

def maybe_passed_node(state: CVState):
    return {"explanation": "talán"}

def not_passed_node(state: CVState):
    return {"explanation": "nem alkalmas"}

# Simán a pontszám alapján besorolja a kategóriákat
def score_router_node(state: CVState):
    score = state["match_score"]

    if score >= 80:
        return {"category": "alkalmas"}
    elif 79 >= score >= 50:
        return {"category": "talán"}
    elif 49 >= score:
        return {"category": "nem alkalmas"}

def score_router_decision_condition(state: CVState):
    return state["category"]

# -------------------------------
# Fő pipeline
# -------------------------------
workflow = StateGraph(CVState)

# Node-ok hozzáadása
workflow.add_node("cv_parser_node", cv_parser_node)
workflow.add_node("cv_user_required_skills_node", cv_user_required_skills_node)
workflow.add_node("cv_user_optional_skills_node", cv_user_optional_skills_node)
workflow.add_node("calculate_score_node", calculate_score_node)
workflow.add_node("score_router_node", score_router_node)
workflow.add_node("passed_node", passed_node)
workflow.add_node("maybe_passed_node", maybe_passed_node)
workflow.add_node("not_passed_node", not_passed_node)

# Node struktúra felépítése
workflow.set_entry_point("cv_parser_node")
workflow.add_edge("cv_parser_node", "cv_user_required_skills_node")
workflow.add_edge("cv_user_required_skills_node", "cv_user_optional_skills_node")
workflow.add_edge("cv_user_optional_skills_node", "calculate_score_node")
workflow.add_edge("calculate_score_node", "score_router_node")

# Kategória alapján beroute-ol a megfelelő node-ba
workflow.add_conditional_edges(
    "score_router_node",
    score_router_decision_condition,
    {
        "alkalmas": "passed_node",
        "talán": "maybe_passed_node",
        "nem alkalmas": "not_passed_node",
    },
)

workflow.add_edge("passed_node", END)
workflow.add_edge("maybe_passed_node", END)
workflow.add_edge("not_passed_node", END)


built_graph = workflow.compile()

# -------------------------------
# Eredmények kiírása
# -------------------------------
initial_state = {
    "cv_text": text  # a PDF-ből kiolvasott CV szöveg
}

print("Workflow indítása...")
final_state = built_graph.invoke(initial_state)

print("CV-ből kinyert skill-ek:", final_state.get("extracted_skills"))
print("Teljesített kötelező skill-ek:", final_state.get("user_required_skills"))
print("Teljesített opcionális skill-ek:", final_state.get("user_optional_skills"))
print("Match score:", final_state.get("match_score"))
print("Besorolás:", final_state.get("category"))
print("Indoklás:", final_state.get("explanation"))
