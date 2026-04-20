import psycopg2
from psycopg2 import sql

def check_db():
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="1234",
            host="localhost",
            port="5432"
        )
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'skillnova'")
        exists = cur.fetchone()
        if not exists:
            print("Database 'skillnova' does not exist. Creating it...")
            cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier('skillnova')))
            print("Database 'skillnova' created.")
        else:
            print("Database 'skillnova' already exists.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
