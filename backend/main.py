"""Backend API for the AI Answer Evaluation System.

Run from this folder with:  python main.py
The API starts at: http://127.0.0.1:8000
"""

from __future__ import annotations

import json
import re
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import unquote, urlparse


FACULTY = {
    "TS-0445": {
        "name": "Mrs. Priya Sharma",
        "password": "password123",
        "subjects": [
            {"name": "Mathematics", "code": "MATH101", "evaluated": 12, "pending": 4, "inProgress": 3, "lastEvaluated": "2026-07-20"},
            {"name": "Physics", "code": "PHY103", "evaluated": 8, "pending": 2, "inProgress": 1, "lastEvaluated": "2026-07-19"},
        ],
    },
    "TS-0678": {
        "name": "Mr. Rahul Verma",
        "password": "secure456",
        "subjects": [
            {"name": "Computer Science", "code": "CS105", "evaluated": 15, "pending": 5, "inProgress": 2, "lastEvaluated": "2026-07-22"},
            {"name": "Data Structures", "code": "CS110", "evaluated": 10, "pending": 7, "inProgress": 4, "lastEvaluated": "2026-07-21"},
        ],
    },
}
RESULTS: dict[str, dict[str, Any]] = {}


def tokenise(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", text.lower()))


def score_answer(answer_key: str, student_answer: str) -> tuple[int, int, str]:
    key_words = tokenise(answer_key)
    answer_words = tokenise(student_answer)
    similarity = round((len(key_words & answer_words) / len(key_words)) * 100) if key_words else 0
    if similarity >= 80:
        feedback = "Excellent answer. It covers most concepts in the answer key."
    elif similarity >= 50:
        feedback = "Partially correct. Include more concepts from the answer key."
    else:
        feedback = "Needs improvement. Review the key concepts and answer in more detail."
    return similarity, similarity, feedback


class ApiHandler(BaseHTTPRequestHandler):
    def send_json(self, status: HTTPStatus, content: Any) -> None:
        body = json.dumps(content).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def request_body(self) -> dict[str, Any]:
        try:
            length = int(self.headers.get("Content-Length", "0"))
            data = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError) as error:
            raise ValueError("Request body must be valid JSON.") from error
        if not isinstance(data, dict):
            raise ValueError("Request body must be a JSON object.")
        return data

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path == "/health":
            self.send_json(HTTPStatus.OK, {"status": "ok"})
            return
        if path.startswith("/faculty/") and path.endswith("/dashboard"):
            faculty_id = unquote(path.removeprefix("/faculty/").removesuffix("/dashboard")).strip("/").upper()
            faculty = FACULTY.get(faculty_id)
            if faculty is None:
                self.send_json(HTTPStatus.NOT_FOUND, {"detail": "Faculty ID not found."})
                return
            self.send_json(HTTPStatus.OK, {"facultyId": faculty_id, "name": faculty["name"], "subjects": faculty["subjects"]})
            return
        if path.startswith("/results/"):
            result = RESULTS.get(unquote(path.removeprefix("/results/")))
            if result is None:
                self.send_json(HTTPStatus.NOT_FOUND, {"detail": "Result not found."})
            else:
                self.send_json(HTTPStatus.OK, result)
            return
        self.send_json(HTTPStatus.NOT_FOUND, {"detail": "Endpoint not found."})

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        try:
            payload = self.request_body()
            if path == "/faculty/login":
                faculty_id = str(payload.get("faculty_id", "")).strip().upper()
                faculty = FACULTY.get(faculty_id)
                if faculty is None or faculty["password"] != str(payload.get("password", "")):
                    self.send_json(HTTPStatus.UNAUTHORIZED, {"detail": "Invalid faculty ID or password."})
                    return
                self.send_json(HTTPStatus.OK, {"facultyId": faculty_id, "name": faculty["name"]})
                return
            if path == "/evaluate":
                answer_key = str(payload.get("answer_key", "")).strip()
                answer = str(payload.get("student_answer", payload.get("answer", ""))).strip()
                if not answer_key or not answer:
                    raise ValueError("answer_key and student_answer are required.")
                marks, similarity, feedback = score_answer(answer_key, answer)
                result = {"marks": f"{marks}/100", "similarity": f"{similarity}%", "feedback": feedback}
                student_id = str(payload.get("student_id", ""))
                if student_id:
                    RESULTS[student_id] = result
                self.send_json(HTTPStatus.OK, result)
                return
            self.send_json(HTTPStatus.NOT_FOUND, {"detail": "Endpoint not found."})
        except ValueError as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"detail": str(error)})

    def log_message(self, format: str, *args: Any) -> None:
        print(f"{self.address_string()} - {format % args}")


if __name__ == "__main__":
    print("Backend running at http://127.0.0.1:8000")
    ThreadingHTTPServer(("127.0.0.1", 8000), ApiHandler).serve_forever()
