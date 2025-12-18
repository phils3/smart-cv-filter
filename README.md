# Smart CV Filter AI

Ez a projekt egy **AI-alapú CV szűrő rendszer**, ami egy feltöltött **CV PDF**-et hasonlít össze egy **Requirements JSON** fájlban megadott kötelező és opcionális készségkövetelményekkel.  
Az eredmény egy **pontszám**, **alkalmassági kategória** és egy rövid, HR-barát **magyarázat**.

[smart cv filter ai](https://smart-cv-filter-ai.vercel.app/)
---

## 🗂 Fájlstruktúra (röviden)
```
smart_CV_filter_Ai/
├── api/
│   └── cv_analyzing.py        
├── backend/
│   ├── api.py                
│   ├── cv_analyzing.py
│   ├── __init__.py
│   ├── .gitignore              
│   └── .env
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── components/
│       └── index.css
├── requirements.txt           
└── .gitignore---
```
## ⚙️ Függőségek

### Python (serverless / lokális backend)

`requirements.txt`:

- `pypdf`
- `python-dotenv`
- `langchain`
- `langchain-openai`

### Node (frontend)

- `react`
- `vite`
- `react-pdf` stb. (lásd `frontend/package.json`)

---

## 🚀 Lokális futtatás (fejlesztéshez)

### 1. Backend (FastAPI – opcionális, de hasznos debughoz)

1. Lépj be a `backend` mappába:
```
cd backend
```
2. Virtuális környezet létrehozása és aktiválása:

**Windows:**
```
python -m venv .venv
.\.venv\Scripts\activate**Linux/Mac:**
```
```
python3 -m venv .venv
source .venv/bin/activate3. 
```
3. Python csomagok telepítése:
```
pip install -r ../requirements.txt
```
4. OpenAI API kulcs beállítása (NE tedd be verziókövetésbe, inkább env változóként add meg):

**Windows PowerShell:**
hell
```
$env:OPENAI_API_KEY="SAJAT_API_KEYED"**Linux/Mac:**

export OPENAI_API_KEY="SAJAT_API_KEYED"
```
5. FastAPI backend indítása (lokális teszthez):
```
uvicorn api:app --reload --port 8000
```
Elérhető: `http://127.0.0.1:8000/api/cv_analyzing` (útvonal a kódban át van írva erre).

> Megjegyzés: éles deploynál a Vercel a `api/cv_analyzing.py` serverless függvényt hívja, nem ezt a FastAPI-t.

---

### 2. Frontend (React + Vite)

1. Lépj be a `frontend` mappába:
```
cd frontend
```
2. Csomagok telepítése:
```
npm install
```
3. Fejlesztői szerver indítása:
```
npm run dev
```
Alapértelmezett URL: `http://localhost:5173`

> A frontend a kódban `fetch('/api/cv_analyzing', ...)`-t használ.  
> Lokális fejlesztésnél vagy:
> - proxy-zod a Vite dev szervert a FastAPI felé, **vagy**
> - Vercel `vercel dev`-et használsz, ami a `api/cv_analyzing.py`-t indítja.

---

## 🧠 Működés – hogyan elemzi az AI a CV-t?

### 1. CV feldolgozása (PDF → szöveg)

- A serverless / backend oldalon:
  - `pypdf.PdfReader` beolvassa a feltöltött `cv_file` PDF-et.
  - Az összes oldal szövegét egyetlen stringgé fűzi (`cv_text`).

### 2. Skill-ek kinyerése a CV-ből

`backend/cv_analyzing.py`:

- `extract_skills(cv_text: str) -> List[str]`
  - Egy OpenAI LLM prompttal **kizárólag explicit módon leírt** készségeket, technológiákat szedi ki.
  - Nem találgat, nem egészít ki, csak a CV-ben konkrétan szereplő elemeket adja vissza.
  - Visszatérés: vesszővel elválasztott listából készített Python lista (pl. `["Python", "React", "Docker"]`).

### 3. Követelmények illesztése (required / optional)

- A JSON requirements fájlból két lista készül:
  - `required_skills_list`
  - `optional_skills_list`

- A `match_skills(extracted_skills, target_skills, mode)` függvény:
  - összeveti a CV-ből kinyert skilleket a megadott target listával,
  - engedi a kis/nagybetű különbséget, egyszerű szinonimákat, nyelvi (hu/en) megfeleltetést,
  - de **nem következtet**, nem használ külső tudást.

### 4. Pontszámítás

- `calculate_score(required_done, optional_done, all_required, all_optional)`:
  - Kötelezők: max **70%** a pontból.
  - Opcionálisak: max **30%**.
  - A végeredmény 0–100 közötti egész szám.

### 5. Kategória és HR összefoglaló

- `category_router(score)`:
  - `< 50`: `nem alkalmas`
  - `50–79`: `talán`
  - `>= 80`: `alkalmas`

- `hr_summary(score, required_done, optional_done, category, all_required)`:
  - Dinamikusan kiszámítja a hiányzó kötelező skilleket.
  - LLM-mel rövid, HR-barát összefoglalót ír:
    - miért ez a pontszám,
    - mely kötelezők teljesültek / hiányoznak,
    - milyen opcionális erősségei vannak a jelöltnek.

---

## 📄 Requirements JSON formátum

A rendszer azt várja, hogy a requirements JSON két fő listát tartalmazzon:

- `required`: kötelező készségek listája
- `optional`: opcionális (nice-to-have) készségek listája

Mindkettő **objektumok listája**, legalább egy `name` mezővel.

### Példa JSON:

```json
{
  "required": [
    { "name": "Python" },
    { "name": "Django" },
    { "name": "REST API" }
  ],
  "optional": [
    { "name": "React" },
    { "name": "Docker" },
    { "name": "AWS" }
  ]
}
```

- A backend ezeket a `name` mezőket használja:
  - `required_skills_list = ["Python", "Django", "REST API"]`
  - `optional_skills_list = ["React", "Docker", "AWS"]`
- A matching után:
  - `required_done` és `optional_done` listákba kerülnek a megtalált skillek.
  - Ezek alapján számolja a **score**-t és a **kategóriát**.

---

## 🖥 Mit lát a felhasználó a frontenden?

1. Feltölt:
   - 1 × CV (PDF)
   - 1 × Requirements (JSON, a fenti formátumban)
2. A UI jelzi, ha valamelyik hiányzik.
3. Amikor mindkettő megvan, elindul az analízis:
   - betöltés animáció (progress),
   - majd megjelenik:
     - **Score** (0–100),
     - **Category** (`nem alkalmas` / `talán` / `alkalmas`),
     - **Completed requirements** (összegyűjtve a required + optional találatokat),
     - **Explanation** (HR-barát összefoglaló).
4. A nézetben válthatsz **PDF** és **JSON** megjelenítés között.



---

## ✅ Összefoglalás

- **CV-ből pypdf + LLM** segítségével explicit skilleket gyűjtünk ki.
- Ezeket hasonlítjuk egy **JSON-ben megadott required/optional** készséglistához.
- A rendszer pontoz, kategorizál, és HR-nyelven magyaráz.
- Lokálisan FastAPI-val, élesben Vercel serverless functionnel használható.
