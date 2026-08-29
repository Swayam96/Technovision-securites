@echo off
cd /d "%~dp0"
set PSQL=D:\postgtress\bin\psql.exe
if not exist "%PSQL%" (
  echo Could not find psql at %PSQL%
  exit /b 1
)
set /p PGPASSWORD=Enter the postgres user password from your PostgreSQL install: 
set PGUSER=postgres
set PGHOST=127.0.0.1
"%PSQL%" -d postgres -v ON_ERROR_STOP=1 -c "SELECT 1;"
if errorlevel 1 (
  echo Password failed.
  exit /b 1
)
"%PSQL%" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='technovision'" | findstr /C:"1" >nul
if errorlevel 1 (
  echo Creating database technovision...
  "%PSQL%" -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE technovision;"
  if errorlevel 1 exit /b 1
) else (
  echo Database technovision already exists.
)
echo Writing webapp\.env
(
  echo DATABASE_URL=postgresql://postgres:%PGPASSWORD%@127.0.0.1:5432/technovision
  echo SESSION_SECRET=technovision-local-dev-secret
  echo DEFAULT_NEW_USER_PASSWORD=12345
) > "%~dp0.env"
echo Done. Start the app with run.bat
