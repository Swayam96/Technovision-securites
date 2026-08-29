# Technovision

ERP workspace for Technovision Securities.

## Run locally

PostgreSQL must be running. One-time setup:

```bash
cd webapp
setup_postgres.bat
```

Enter the password you chose for the `postgres` user when you installed PostgreSQL. Then:

```bash
run.bat
```

Open http://127.0.0.1:8000 — login `admin` / `admin123`.

## Deploy on Render

1. Push this repo to GitHub.
2. New **Web Service** from that repo.
3. **Root Directory:** `webapp`
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add a **PostgreSQL** database on Render and link it to the web service so `DATABASE_URL` is set.
7. Add env var `SESSION_SECRET` (any long random string).

Do not commit `.env`. Render injects `DATABASE_URL`; local `.env` is only for your PC.

## Layout

```
technovision/
├── webapp/                 ← active Python app (FastAPI)
│   ├── core/               ← app logic
│   ├── templates/          ← HTML
│   ├── static/             ← CSS + icons
│   └── main.py             ← entry point
└── archive/
    └── frappe-reference/   ← old Frappe scaffold (reference only)
```


## Layout

```
technovision/
├── webapp/                 ← active Python app (FastAPI)
│   ├── core/               ← app logic
│   ├── templates/          ← HTML
│   ├── static/             ← CSS + icons
│   └── main.py             ← entry point
└── archive/
    └── frappe-reference/   ← old Frappe scaffold (reference only)
```
