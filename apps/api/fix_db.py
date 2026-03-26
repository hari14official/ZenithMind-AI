import sqlite3
import os
db_path = os.path.join(os.path.dirname(__file__), 'stress_app.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Set name to 'Hari' for this email if it isn't already or is generic
cursor.execute("UPDATE users SET name='Hari' WHERE email='hari14official@gmail.com'")
conn.commit()
print("Updated user name to Hari.")

conn.close()
