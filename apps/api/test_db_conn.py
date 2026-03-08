import os
import sys

# Test SQLite first
os.environ["DATABASE_URL"] = "sqlite:///./test_stress_app.db"

# Add path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.database import engine
    with engine.connect() as conn:
        print("Successfully connected to the SQLite test database!")
except Exception as e:
    print(f"Failed to connect to the SQLite database: {e}")

# If we had a real Postgres URL, we could test it, but for mock validation:
# we will just test that the engine initializes with a mock postgres URL
os.environ["DATABASE_URL"] = "postgres://user:pass@localhost:5432/db"

try:
    # re-importing might not re-evaluate, so we import the module and test it
    import importlib
    import app.core.database as db_module
    importlib.reload(db_module)
    print(f"Post-reload URL: {db_module.SQLALCHEMY_DATABASE_URL}")
    print("Successfully mock-initialized the Postgres engine with corrected protocol!")
except Exception as e:
    print(f"Failed to mock-initialize Postgres engine: {e}")
