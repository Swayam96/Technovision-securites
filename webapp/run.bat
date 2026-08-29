@echo off
cd /d "%~dp0"
set TEMP=%~dp0tmp
set TMP=%~dp0tmp
if not exist tmp mkdir tmp
if not exist .venv\Scripts\python.exe (
  echo Creating virtual environment...
  python -m venv .venv
)
.venv\Scripts\python.exe -m pip install -q -r requirements.txt
echo Starting Technovision ERP at http://127.0.0.1:8000
if not exist .env (
  echo.
  echo Missing .env — PostgreSQL connection is required.
  echo Run setup_postgres.bat first, or copy .env.example to .env
  echo.
)
.venv\Scripts\uvicorn.exe main:app --host 127.0.0.1 --port 8000
