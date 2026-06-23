from flask import Blueprint, request, jsonify
from services.services import analyze_code

analyze_bp = Blueprint("analyze", __name__, url_prefix="/api")

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    code = (data or {}).get("code", "").strip()
    language = (data or {}).get("language", "auto")
    if not code:
        return jsonify({"error": "No code provided"}), 400
    result, status = analyze_code(code, language)
    return jsonify(result), status
