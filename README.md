# AI Bug Detector

> Intelligent static code analysis tool that detects bugs, security vulnerabilities, and code quality issues in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-green.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.1-lightgrey.svg)

---

## Overview

AI Bug Detector is a full-stack web application that performs automated static code analysis. Paste your code, select a language, and get instant severity-ranked bug reports with fix suggestions — completely offline, no API key needed.

---

## Features

- 18+ detection rules across Security, Logic, Performance, and Code Quality
- Severity ranking — Critical, High, Medium, Low
- Animated code quality score (0-100)
- Expandable bug cards with fix suggestions
- Code complexity analysis
- Language mismatch detection
- Auto language detection for 12+ languages
- Fully offline — no external API or internet required
- Dark themed responsive UI

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Axios |
| Backend | Flask 3.1, Python 3.10 |
| Analysis Engine | Custom rule-based engine (Python re module) |
| Fonts | JetBrains Mono, Syne, Inter |
| Package Manager | npm, pip |

---



## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- npm

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/ryan-sawlani/ai-bug-detector.git
cd ai-bug-detector
```

**2. Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

**3. Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Project

Open two terminals:

**Terminal 1 — Backend**
```bash
cd backend
python app.py
```
Server starts at http://localhost:5000

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
```
App opens at http://localhost:3000

---

## How It Works

1. User pastes code in the editor and clicks Analyze
2. React sends POST request to Flask backend
3. Analysis engine scans code line by line against 18+ regex rules
4. Results returned as JSON with bugs, score, complexity, suggestions
5. Frontend renders severity-ranked bug cards with fix suggestions

---

## Detection Rules

| Category | Rules |
|----------|-------|
| Security | eval(), SQL Injection, XSS, Hardcoded credentials, Command Injection |
| Logic Error | Off-by-one, Division by zero, Array out of bounds |
| Infinite Loop | while(true), for(;;) |
| Error Handling | Bare except, Empty catch block |
| Concurrency | Thread without join |
| Code Quality | var keyword, Wildcard imports, Debug prints, TODO/FIXME |
| Performance | Blocking sleep |
| Data Safety | Irreversible delete operations |

---

## Scoring System

| Severity | Penalty | Score Range |
|----------|---------|-------------|
| Critical | -25 pts | 0-49 |
| High | -12 pts | 50-69 |
| Medium | -6 pts | 70-84 |
| Low | -2 pts | 85-100 |



---