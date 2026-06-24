import re
from typing import Any

RULES = [
    {
        "pattern": r"\beval\s*\(",
        "severity": "critical",
        "category": "Security",
        "title": "Dangerous use of eval()",
        "description": "eval() executes arbitrary strings as code. This opens the door to code injection attacks - an attacker can run any command on your server or browser.",
        "fix": "Remove eval(). Use JSON.parse() for JSON data, or refactor to avoid dynamic code execution entirely.",
    },
    {
        "pattern": r"(password|passwd|secret|api_key|token)\s*=\s*[\"'].{3,}[\"']",
        "severity": "critical",
        "category": "Security",
        "title": "Hardcoded credentials",
        "description": "Hardcoding passwords or API keys in source code exposes them to anyone who reads the code, including version control history.",
        "fix": "Use environment variables.\nExample: password = os.environ.get('DB_PASSWORD')",
    },
    {
        "pattern": r"(execute|query|cursor\.execute)\s*\(.*\+",
        "severity": "critical",
        "category": "Security",
        "title": "SQL Injection vulnerability",
        "description": "Concatenating user input into SQL queries lets attackers manipulate your database - they can read, modify, or delete any data.",
        "fix": "Always use parameterized queries.\nExample: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))",
    },
    {
        "pattern": r"(innerHTML|outerHTML)\s*=\s*(?![\"'][\"'])",
        "severity": "critical",
        "category": "Security",
        "title": "XSS via innerHTML",
        "description": "Directly assigning user-controlled data to innerHTML allows Cross-Site Scripting (XSS) attacks. Attackers can inject malicious scripts.",
        "fix": "Use textContent instead of innerHTML, or sanitize input with DOMPurify before assigning.",
    },
    {
        "pattern": r"subprocess\.(call|run|Popen)\s*\(.*\+",
        "severity": "critical",
        "category": "Security",
        "title": "Command Injection risk",
        "description": "Building shell commands with string concatenation allows attackers to inject arbitrary OS commands.",
        "fix": "Pass arguments as a list, never as a string.\nExample: subprocess.run(['ls', '-la'], shell=False)",
    },
    {
        "pattern": r"i\s*<=\s*\w+\.(length|size\(\)|count\b|length\(\))",
        "severity": "high",
        "category": "Logic Error",
        "title": "Off-by-one error in loop",
        "description": "Using <= with array length goes one index past the end. Arrays are 0-indexed, so the last valid index is length-1.",
        "fix": "Change <= to <.\nExample: for (int i = 0; i < arr.length; i++)",
    },
    {
        "pattern": r"while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)",
        "severity": "high",
        "category": "Infinite Loop",
        "title": "Potential infinite loop",
        "description": "This loop runs forever unless a break or return is guaranteed. If the exit condition is never met, the program hangs and consumes 100% CPU.",
        "fix": "Ensure there is a guaranteed exit condition (break/return) inside the loop.",
    },
    {
        "pattern": r"except\s*:\s*$|except\s+Exception\s*:\s*$",
        "severity": "high",
        "category": "Error Handling",
        "title": "Bare except catches everything",
        "description": "Catching all exceptions silently hides bugs and makes debugging extremely hard.",
        "fix": "Catch specific exceptions and always log them.\nExample: except ValueError as e: logger.error(f'Error: {e}')",
    },
    {
        "pattern": r"(\.remove\(|\.delete\(|os\.remove|shutil\.rmtree)",
        "severity": "high",
        "category": "Data Safety",
        "title": "Irreversible delete operation",
        "description": "Delete/remove operations are permanent. If called with wrong arguments, data loss is unrecoverable.",
        "fix": "Add a confirmation check before performing destructive operations.",
    },
    {
        "pattern": r"threading\.Thread|asyncio\.create_task",
        "severity": "high",
        "category": "Concurrency",
        "title": "Thread created without error handling",
        "description": "Spawning threads without tracking them can cause race conditions and resource leaks.",
        "fix": "Always join threads or use a thread pool.\nExample: use concurrent.futures.ThreadPoolExecutor",
    },
    {
        "pattern": r"[^=!<>]==[^=]",
        "severity": "medium",
        "category": "Type Error",
        "title": "Loose equality == instead of ===",
        "description": "In JavaScript, == performs type coercion which causes subtle bugs. 0 == '' is true, null == undefined is true.",
        "fix": "Always use strict equality ===.\nExample: if (value === null) instead of if (value == null)",
    },
    {
        "pattern": r"\bvar\b",
        "severity": "medium",
        "category": "Code Quality",
        "title": "Use of outdated var keyword",
        "description": "var has function scope and gets hoisted, which leads to unexpected behavior.",
        "fix": "Use const for values that do not change, let for values that do.\nExample: const name = 'value'; let count = 0;",
    },
    {
        "pattern": r"import \*",
        "severity": "medium",
        "category": "Code Quality",
        "title": "Wildcard import",
        "description": "Wildcard imports pollute the namespace and can cause silent naming conflicts.",
        "fix": "Import only what you need.\nExample: from math import sqrt, pi",
    },
    {
        "pattern": r"time\.sleep\s*\(\s*[5-9]\d*|time\.sleep\s*\(\s*\d{2,}",
        "severity": "medium",
        "category": "Performance",
        "title": "Long blocking sleep",
        "description": "Sleeping for long durations blocks the thread completely and can cause timeouts.",
        "fix": "Use async/await with asyncio.sleep() or event-driven patterns instead.",
    },
    {
        "pattern": r"console\.log\s*\(|System\.out\.print|print\s*\(",
        "severity": "low",
        "category": "Code Quality",
        "title": "Debug print statement in code",
        "description": "print/console.log statements left in code expose internal data and clutter logs.",
        "fix": "Remove debug prints or replace with a proper logger.",
    },
    {
        "pattern": r"TODO|FIXME|HACK|XXX",
        "severity": "low",
        "category": "Code Quality",
        "title": "Unresolved TODO or FIXME",
        "description": "TODO and FIXME comments indicate incomplete code that should be resolved before shipping.",
        "fix": "Resolve the TODO/FIXME or create a proper ticket to track it.",
    },
    {
        "pattern": r"def\s+\w+\s*\([^)]*\)\s*(?!.*->)\s*:",
        "severity": "low",
        "category": "Code Quality",
        "title": "Function missing return type hint",
        "description": "Functions without type hints are harder to understand and maintain.",
        "fix": "Add type hints.\nExample: def add(a: int, b: int) -> int:",
    },
    {
        "pattern": r"new\s+\w+\s*[\(\[](?!.*delete)",
        "severity": "high",
        "category": "Memory Leak",
        "title": "Memory allocated with new but never deleted",
        "description": "In C++, memory allocated with new must be manually freed with delete. Forgetting to delete causes memory leaks.",
        "fix": "Always pair new with delete.\nExample: int* p = new int(5); delete p;",
    },
    {
        "pattern": r"if\s*\(\s*\w+\s*=\s*[^=]",
        "severity": "high",
        "category": "Logic Error",
        "title": "Assignment inside if condition",
        "description": "Using = instead of == inside an if condition assigns a value instead of comparing. This is almost always a bug.",
        "fix": "Use == for comparison.\nExample: if (isAdmin == 1) instead of if (isAdmin = 1)",
    },
    {
        "pattern": r"catch\s*\(\s*\.\.\.\s*\)\s*\{?\s*\}?",
        "severity": "medium",
        "category": "Error Handling",
        "title": "Empty catch(...) block",
        "description": "Catching all exceptions with ... and doing nothing silently swallows all errors making debugging impossible.",
        "fix": "Always handle or log the exception inside catch block.",
    },
    {
        "pattern": r"\*\s*\w+\s*(?![\w\s]*=)",
        "severity": "high",
        "category": "Memory Safety",
        "title": "Pointer dereference — possible null or dangling pointer",
        "description": "Dereferencing a pointer without null check can cause segmentation fault if pointer is null or uninitialized.",
        "fix": "Always check pointer before dereferencing.\nExample: if (data != nullptr) { cout << *data; }",
    },
    {
        "pattern": r"\w+\s*\[\s*\d+\s*\]",
        "severity": "high",
        "category": "Logic Error",
        "title": "Possible array index out of bounds",
        "description": "Accessing array with hardcoded index may exceed array size and cause undefined behavior or segfault.",
        "fix": "Always verify index is within bounds before accessing.\nExample: if (index < size) { arr[index]; }",
    },
]


def _detect_language(code: str) -> str:
    scores: dict[str, int] = {
        "python": 0, "javascript": 0, "typescript": 0,
        "java": 0, "c++": 0, "go": 0, "rust": 0, "php": 0,
    }
    if "def " in code and ("import " in code or "print(" in code): scores["python"] += 3
    if "self." in code:                                             scores["python"] += 2
    if "console." in code or "const " in code or "let " in code:   scores["javascript"] += 3
    if ": string" in code or ": number" in code:                   scores["typescript"] += 3
    if "public class" in code or "System.out" in code:             scores["java"] += 3
    if "#include" in code or "std::" in code:                      scores["c++"] += 3
    if "fmt." in code and "func " in code:                         scores["go"] += 3
    if "fn " in code and "let mut" in code:                        scores["rust"] += 3
    if "<?php" in code or "echo " in code:                         scores["php"] += 3
    best = max(scores, key=lambda k: scores[k])
    return best if scores[best] > 0 else "unknown"


def _complexity(lines: list[str]) -> dict[str, str]:
    loc        = sum(1 for l in lines if l.strip() and not l.strip().startswith(("#", "//")))
    branches   = sum(1 for l in lines if re.search(r'\b(if|elif|else|for|while|case|catch|except)\b', l))
    max_indent = max((len(l) - len(l.lstrip()) for l in lines if l.strip()), default=0) // 4
    if loc < 25  and branches < 4  and max_indent < 3:
        return {"level": "low",       "reason": "Short, flat code with minimal branching."}
    if loc < 75  and branches < 10 and max_indent < 5:
        return {"level": "moderate",  "reason": "Medium length with manageable complexity."}
    if loc < 200 and branches < 20:
        return {"level": "high",      "reason": "Long code with significant branching. Consider splitting into smaller functions."}
    return     {"level": "very high", "reason": f"{loc} lines with {branches} branches. Urgent refactoring needed."}


def analyze_code(code: str, language: str) -> tuple[dict[str, Any], int]:
    lines         = code.split("\n")
    bugs          = []
    seen:           set[tuple[int, str]] = set()
    bug_id        = 1
    detected_lang = language if language != "auto" else _detect_language(code)

    # Wrong language check
    if language != "auto":
        auto_detected = _detect_language(code)
        if auto_detected != "unknown" and auto_detected != language:
            return {
                "language": language,
                "summary": f"Wrong language detected! You selected '{language}' but the code looks like '{auto_detected}'. Please select the correct language or use Auto-detect.",
                "score": 0,
                "bugs": [{
                    "id": 1,
                    "severity": "critical",
                    "category": "Wrong Language",
                    "line": None,
                    "title": f"Code language mismatch",
                    "description": f"You selected '{language}' but this code appears to be '{auto_detected}'. The analysis may be inaccurate.",
                    "fix": f"Either select '{auto_detected}' from the language dropdown, or use 'Auto-detect'."
                }],
                "stats": {"critical": 1, "high": 0, "medium": 0, "low": 0},
                "complexity": {"level": "unknown", "reason": "Cannot analyze — wrong language selected."},
                "suggestions": [f"Switch language to '{auto_detected}' or use Auto-detect."]
            }, 200

    js_only = {"Loose equality == instead of ===", "Use of outdated var keyword"}
    py_only = {"Function missing return type hint", "Bare except catches everything"}

    lang_skip = {
        "python":     js_only,
        "javascript": py_only,
        "typescript": py_only,
        "java":       js_only | py_only,
        "c++":        js_only | py_only,
        "c":          js_only | py_only,
        "go":         js_only | py_only,
        "rust":       js_only | py_only,
        "php":        py_only,
        "ruby":       js_only,
        "kotlin":     js_only | py_only,
    }

    for rule in RULES:
        skip_rules = lang_skip.get(detected_lang, set())
        if rule["title"] in skip_rules:
            continue
        pattern = re.compile(rule["pattern"], re.IGNORECASE)
        for i, line in enumerate(lines, 1):
            if pattern.search(line):
                key = (i, rule["category"])
                if key in seen:
                    continue
                seen.add(key)
                bugs.append({
                    "id":          bug_id,
                    "severity":    rule["severity"],
                    "category":    rule["category"],
                    "line":        i,
                    "title":       rule["title"],
                    "description": rule["description"],
                    "fix":         rule["fix"],
                })
                bug_id += 1

    stats = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    for b in bugs:
        stats[b["severity"]] += 1

    score = max(0, min(100,
        100 - stats["critical"] * 25 - stats["high"] * 12 - stats["medium"] * 6 - stats["low"] * 2
    ))

    total = len(bugs)
    if total == 0:
        summary = "Excellent! No issues detected. Code looks production-ready."
    elif stats["critical"] > 0:
        summary = f"{stats['critical']} critical issue(s) detected. Fix immediately before use."
    elif stats["high"] > 0:
        summary = f"{total} issue(s) found including {stats['high']} high severity bug(s)."
    elif stats["medium"] > 0:
        summary = f"{total} issue(s) found. No critical bugs but code quality can be improved."
    else:
        summary = f"{total} minor issue(s). Overall code is safe."

    suggestions: list[str] = []
    if detected_lang == "python":
        suggestions.append("Run pylint or flake8 to catch issues automatically.")
        suggestions.append("Add type hints to all functions for better IDE support.")
    if detected_lang in ("javascript", "typescript"):
        suggestions.append("Set up ESLint and Prettier for automatic code quality checks.")
        suggestions.append("Consider switching to TypeScript for better type safety.")
    if stats["critical"] > 0:
        suggestions.append("Fix all critical issues before pushing to production.")
    if stats["high"] > 0:
        suggestions.append("Review high severity issues - they can cause runtime crashes.")
    if len(lines) > 100:
        suggestions.append("File is getting long. Break large functions into smaller ones.")
    suggestions.append("Write unit tests to catch regressions early.")
    suggestions.append("Use meaningful variable names. Avoid single letters like x, y, z.")

    return {
        "language":    detected_lang,
        "summary":     summary,
        "score":       score,
        "bugs":        bugs,
        "stats":       stats,
        "complexity":  _complexity(lines),
        "suggestions": suggestions[:4],
    }, 200
