# Smart CV Filter AI

Ez a projekt egy **AI-alapú CV szűrő rendszer**, ami segít kiválogatni a jelölteket a megadott készségkövetelmények alapján. A projekt **Python backend** és **React frontend** kombinációjával készült.

---

## 🗂 Fájlstruktúra

```
smart_CV_filter_Ai/
├── backend/
│   ├── api.py
│   ├── cv_analyzing.py
│   ├── requirements.txt
│   └── .gitignore
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── components/
│       └── index.css
├── README.md
└── .gitignore
```

---

## ⚡ Backend telepítése és futtatása

1. **Lépj be a backend mappába:**

```bash
cd backend
```

2. **Hozz létre virtuális környezetet és aktiváld:**

Windows:

```bash
python -m venv .venv
.\.venv\Scripts\activate
```

Linux/Mac:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. **Telepítsd a szükséges csomagokat:**

```bash
pip install -r requirements.txt
```

4. **Add meg a környezeti változót az OpenAI API kulcsodhoz:**

Windows PowerShell:

```powershell
setx OPENAI_API_KEY "YOUR_API_KEY_HERE"
```

Linux/Mac:

```bash
export OPENAI_API_KEY="YOUR_API_KEY_HERE"
```

5. **Futtasd a backend szervert FastAPI-vel:**

```bash
uvicorn api:app --reload
```

A szerver alapértelmezett portja: `http://127.0.0.1:8000`

---

## 🌐 Frontend telepítése és futtatása

1. **Lépj be a frontend mappába:**

```bash
cd frontend
```

2. **Telepítsd a csomagokat:**

```bash
npm install
```

3. **Futtasd a frontendet:**

```bash
npm run dev
```

Alapértelmezett URL: `http://localhost:5173`

> A frontend automatikusan kommunikál a backenddel, ha mindkettő fut.

---

## 🧩 Használat

1. Nyisd meg a frontendet a böngésződben.

2. Tölts fel egy **CV PDF fájlt**.

3. Tölts fel egy **Requirements JSON fájlt**.

4. Az AI automatikusan elemzi a CV-t és visszaadja a következőket:

   * Talált készségek
   * Kötelező és opcionális követelmények teljesítése
   * Pontszám és besorolás
   * Rövid HR indoklás

5. Az eredményeket a felület megjeleníti **score**, **category**, **completed requirements** és **explanation** formában.

---

## 🛠 Fontos megjegyzések

* Az OpenAI API kulcsod **sajátod kell legyen**, különben az AI modul nem fog működni.
* Backend és frontend **külön terminálban futtatható**.
* Frissítheted a követelmény JSON-t a projekthez új készségek hozzáadásához.

---



Ez a README célja, hogy segítsen a felhasználónak a projekt gyors beállításában és futtatásában.
