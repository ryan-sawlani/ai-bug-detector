import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

PROMPT_TEMPLATE = """You are an expert code reviewer and static analysis engine.

Analyze the following {language} code and return ONLY a raw JSON object — no markdown, no explanation, no code fences.

Response schema:
{{
  "language": "detected language name",
  "summary": "One-line code quality verdict",
  "score": <integer 0-100>,
  "bugs": [
    {{
      "id": <integer>,
      "severity": "critical|high|medium|low",
      "category": "e.g. Security, Logic Error, Memory Leak, Null Dereference, etc.",
      "line": <integer or null>,
      "title": "Short bug title",
      "description": "Clear explanation of why this is a bug and what it can cause",
      "fix": "Corrected code snippet or actionable fix description"
    }}
  ],
  "stats": {{ "critical": 0, "high": 0, "medium": 0, "low": 0 }},
  "complexity": {{
    "level": "low|moderate|high|very high",
    "reason": "Brief explanation"
  }},
  "suggestions": ["Improvement tip 1", "Improvement tip 2"]
}}

Scoring rules:
- 90-100: clean code, no bugs
- 70-89: minor issues only
- 50-69: moderate issues
- Below 50: serious bugs or security issues

Important:
- Be specific with line numbers
- Focus on real bugs not style nitpicks
- Return ONLY the JSON object, nothing else

Code to analyze:
````{language}
{code}
```"""


def analyze_code(code: str, language: str) -> tuple[dict, int]:
    try:
        prompt = PROMPT_TEMPLATE.format(
            language=language if language != "auto" else "unknown",
            code=code
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:].strip()
            elif raw.startswith("\n"):
                raw = raw[1:].strip()

        result = json.loads(raw)

        result.setdefault("language", language)
        result.setdefault("summary", "Analysis complete.")
        result.setdefault("score", 50)
        result.setdefault("bugs", [])
        result.setdefault("stats", {"critical": 0, "high": 0, "medium": 0, "low": 0})
        result.setdefault("complexity", {"level": "moderate", "reason": "Unable to determine."})
        result.setdefault("suggestions", [])

        return result, 200

    except json.JSONDecodeError as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to parse Gemini response: {str(e)}"}, 500
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"GEMINI ERROR: {e}")
        return {"error": f"Gemini API error: {str(e)}"}, 500