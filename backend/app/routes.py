import logging
import os
import traceback
from pathlib import Path

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

bp = Blueprint("main", __name__)
log = logging.getLogger(__name__)

USE_MOCK = os.environ.get("USE_MOCK", "0") == "1"
ALLOWED_EXTENSIONS = {".pdf", ".docx"}


@bp.get("/")
def index():
    return "AI Resume Evaluator: setup OK"


@bp.get("/health")
def health():
    return jsonify(status="ok")


@bp.post("/api/evaluate")
def api_evaluate():
    file = request.files.get("resume")
    job_description = request.form.get("job_description", "").strip()

    if not file or file.filename == "":
        return jsonify(error="Please select a resume file."), 400

    filename = secure_filename(file.filename)
    if Path(filename).suffix.lower() not in ALLOWED_EXTENSIONS:
        return jsonify(error="Only PDF and DOCX files are supported."), 400

    if USE_MOCK:
        return jsonify({
            "overall_score": 72,
            "summary": "Solid technical foundation with room to quantify impact.",
            "strengths": ["Clear project descriptions", "Relevant tech stack"],
            "weaknesses": ["Few measurable results", "No summary section"],
            "missing_keywords": ["Docker", "CI/CD"],
            "suggestions": ["Add metrics to each bullet", "Add a 2-line profile summary"],
            "ats_compatibility_notes": "Simple layout, ATS-friendly.",
        })

    from .services.parser import extract_text, ResumeParseError
    from .services.evaluator import evaluate_resume

    try:
        resume_text = extract_text(file.stream, filename)
        result = evaluate_resume(resume_text, job_description)
    except ResumeParseError as e:
        return jsonify(error=str(e)), 422
    except Exception as e:
        # Print the FULL error, unmissably, to the terminal
        print("=" * 60)
        print("EVALUATION FAILED:", type(e).__name__, "-", str(e))
        print("=" * 60)
        traceback.print_exc()
        log.exception("Evaluation failed")
        return jsonify(error=f"Evaluation failed: {type(e).__name__}: {str(e)}"), 500

    return jsonify(result.model_dump())