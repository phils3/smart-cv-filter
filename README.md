# CV HR Screener Agent

Ez a projekt egy **automatizált CV szűrő agent**, amely OpenAI LLM segítségével elemzi az önéletrajzokat, és pontozza a jelölteket a szükséges és opcionális készségek alapján.

---

## 📂 Mappastruktúra

```
ai_kurzus_hazi/
│
├─ main.py
├─ .env
├─ .gitignore
├─ content/
│   ├─ required_skills.json
│   └─ cv.pdf
└─ ... (egyéb fájlok)
```

---

## ⚙️ Telepítés

1. Klónozd a repót:

```bash
git clone <repository-url>
cd ai_kurzus_hazi
```

2. Hozz létre virtuális környezetet:

```bash
python -m venv .venv
```

3. Aktiváld a virtuális környezetet:

* Windows PowerShell:

```powershell
.\.venv\Scripts\activate
```

4. Telepítsd a szükséges csomagokat:

```bash
python -m pip install --upgrade pip
python -m pip install langchain langchain-core langchain-openai langgraph pypdf python-dotenv
```

---

## 🌟 `.env` fájl

A `.env` fájlban tárold az OpenAI API kulcsot:

```
OPENAI_API_KEY=sk-xxxxx
```

**Ne tedd fel a GitHub-ra!**

---

## 📄 Content mappa

A `content` mappába kell helyezni:

1. `required_skills.json` – JSON formátumban tartalmazza a kötelező és opcionális skill-eket:

```json
{
    "required": [
        {"name": "Python"},
        {"name": "SQL"}
    ],
    "optional": [
        {"name": "Django"},
        {"name": "Docker"}
    ]
}
```

2. `cv.pdf` – A vizsgálandó jelölt önéletrajza PDF formátumban.

---

## 🚀 Futtatás

```bash
python main.py
```

A script a következőket fogja kiírni a konzolra:

* CV-ből kinyert skill-ek
* Teljesített kötelező skill-ek
* Teljesített opcionális skill-ek
* Match score (0–100)

---

## 🧠 Működés

1. A CV PDF-ből szöveget nyerünk ki a `pypdf` segítségével.
2. Az LLM (ChatOpenAI) kinyeri a jelölt készségeit és tapasztalatait.
3. A kinyert skill-eket összevetjük a **kötelező** és **opcionális** skill listával.
4. A **match score** a következő súlyozással készül:

* 70% a kötelező skill-ek teljesítéséből
* 30% az opcionális skill-ek teljesítéséből

5. Az eredmények alapján a HR csapat gyorsan láthatja, hogy a jelölt **alkalmas**, **talán** vagy **nem alkalmas**.

---

## ⚠️ Megjegyzés

* A `.env`-ben tárolt kulcsot **soha ne tedd fel publikus repóba**.
* Győződj meg róla, hogy a PDF olvasható és nem jelszóval védett.
