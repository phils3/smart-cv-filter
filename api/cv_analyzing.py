import json
from http.server import BaseHTTPRequestHandler
import cgi

from pypdf import PdfReader

from backend.cv_analyzing import (
    extract_skills,
    match_skills,
    calculate_score,
    category_router,
    hr_summary,
)


class handler(BaseHTTPRequestHandler):
    """
    Vercel Python Serverless Function:
    - Elérési út: /api/cv_analyzing
    - Expect: multipart/form-data két fájllal:
        - cv_file: PDF CV
        - skills_file: JSON requirements
    """

    def do_POST(self):
        try:
            # Multipart form-data feldolgozása
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": self.headers.get("Content-Type"),
                },
            )

            if "cv_file" not in form or "skills_file" not in form:
                self._send_json(
                    400,
                    {"detail": "Hiányzó fájl(ok): cv_file és skills_file kötelező."},
                )
                return

            cv_field = form["cv_file"]
            skills_field = form["skills_file"]

            # 1) PDF feldolgozás
            reader = PdfReader(cv_field.file)
            cv_text = "".join(page.extract_text() or "" for page in reader.pages)

            # 2) JSON feldolgozás
            skills_data = json.load(skills_field.file)

            required_skills_list = [
                s["name"] for s in skills_data.get("required", [])
            ]
            optional_skills_list = [
                s["name"] for s in skills_data.get("optional", [])
            ]

            # 3) Logika (ugyanaz, mint FastAPI-ban)
            extracted_skills = extract_skills(cv_text)

            required_done = match_skills(
                extracted_skills,
                required_skills_list,
                mode="required",
            )

            optional_done = match_skills(
                extracted_skills,
                optional_skills_list,
                mode="optional",
            )

            score = calculate_score(
                required_done,
                optional_done,
                required_skills_list,
                optional_skills_list,
            )

            category = category_router(score)

            summary = hr_summary(
                score,
                required_done,
                optional_done,
                category,
                required_skills_list,
            )

            response = {
                "extracted_skills": extracted_skills,
                "required_done": required_done,
                "optional_done": optional_done,
                "score": score,
                "category": category,
                "hr_summary": summary,
            }

            self._send_json(200, response)

        except Exception as e:
            self._send_json(500, {"detail": str(e)})

    def _send_json(self, status_code: int, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


