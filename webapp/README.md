# Technovision Webapp

FastAPI + SQLite ERP workspace, styled to match [tecsec.technovisionsecurities.in](https://tecsec.technovisionsecurities.in/).

## Frontend (aligned with TecSec)

| Layer | TecSec site | This ERP |
|-------|-------------|----------|
| Layout | AdminLTE 3 | AdminLTE 3 (CDN) |
| CSS | Bootstrap 4 | Bootstrap 4 |
| JS | jQuery + DataTables | jQuery + DataTables |
| Brand | #03A9F4 blue, Technovision logo | Same colors + logo |
| Backend | PHP (CodeIgniter) | Python (FastAPI) |

## Run

```bash
cd webapp
run.bat
```

Open http://127.0.0.1:8000 — you will be sent to **Login**.

### Demo accounts (password `tv123` except admin)

| Username | Password | Role | Sees |
|----------|----------|------|------|
| `admin` | `admin123` | Administrator | All modules |
| `presales` | `tv123` | Presales & BOQ | Presales, products, CRM |
| `purchase` | `tv123` | Purchase | Purchase, logistics, products |
| `logistics` | `tv123` | Logistics | Stock, purchase, products |
| `install` | `tv123` | Installation | Projects, stock, products |
| `support` | `tv123` | Service & AMC | Support, projects |
| `sales` | `tv123` | CRM & Sales | CRM, presales |
| `finance` | `tv123` | Finance | Finance |
| `mis` | `tv123` | MIS | All modules |

New staff can use **Sign Up** and pick a department.

### Job pipeline

Presales → Purchase → Logistics → Installation → Support  

Use the green **share** button on a record to send it to the next team.

## Architecture

```
webapp/
├── main.py              # Uvicorn entry (imports app)
├── core/
│   ├── app.py           # FastAPI factory + lifespan
│   ├── config.py        # paths and constants
│   ├── modules.py       # module definitions
│   ├── seed.py          # demo data
│   ├── db.py            # SQLite access
│   ├── services.py      # validation + record actions
│   └── routes.py        # HTTP routes
├── templates/
├── static/
└── data/                # SQLite DB (created at runtime)
```

| Layer | Responsibility |
|-------|----------------|
| `routes.py` | HTTP only — parse request, call service, render template |
| `services.py` | Business rules and validation |
| `db.py` | SQL queries and persistence |
| `modules.py` | Static module catalog |
