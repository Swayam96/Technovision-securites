from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

load_dotenv(BASE_DIR / ".env")

APP_NAME = "Technovision Security"
APP_VERSION = "0.7.0"
TAGLINE = "Security operations, end to end."
COMPANY_NAME = "Technovision Securities Pvt. Ltd."
COMPANY_URL = "https://technovisionsecurities.in/"
TECSEC_ASSETS = "https://tecsec.technovisionsecurities.in/application/assets"

SESSION_SECRET = os.getenv("SESSION_SECRET", "technovision-erp-dev-secret-change-me")
DEFAULT_NEW_USER_PASSWORD = os.getenv("DEFAULT_NEW_USER_PASSWORD", "12345")
ON_RENDER = bool(os.getenv("RENDER") or os.getenv("RENDER_EXTERNAL_URL"))


def _normalize_database_url(url: str) -> str:
    url = url.strip()
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    local = host in {"localhost", "127.0.0.1", ""}
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    if not local and "sslmode" not in query:
        query["sslmode"] = "require"
        parsed = parsed._replace(query=urlencode(query))
        url = urlunparse(parsed)
    return url


DATABASE_URL = _normalize_database_url(os.getenv("DATABASE_URL", ""))
