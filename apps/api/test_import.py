import sys
import traceback

with open("import_error.txt", "w") as f:
    f.write(f"sys.executable: {sys.executable}\n")
    f.write(f"sys.path: {sys.path}\n")
    try:
        import psycopg2
        f.write("SUCCESS\n")
    except Exception as e:
        f.write(f"ERROR: {type(e).__name__}: {str(e)}\n")
        f.write(traceback.format_exc())
