import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "genai_studio.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS generations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mode TEXT NOT NULL,
            title TEXT NOT NULL,
            input_data TEXT NOT NULL,
            output_content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_generation(mode: str, title: str, input_data: dict, output_content: str) -> dict:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    input_json = json.dumps(input_data)
    cursor.execute(
        """
        INSERT INTO generations (mode, title, input_data, output_content)
        VALUES (?, ?, ?, ?)
        """,
        (mode, title, input_json, output_content)
    )
    conn.commit()
    item_id = cursor.lastrowid
    
    cursor.execute("SELECT * FROM generations WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    conn.close()
    
    return {
        "id": row["id"],
        "mode": row["mode"],
        "title": row["title"],
        "input_data": json.loads(row["input_data"]),
        "output_content": row["output_content"],
        "created_at": row["created_at"]
    }

def get_all_generations(limit: int = 50) -> List[Dict[str, Any]]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM generations ORDER BY created_at DESC LIMIT ?", 
        (limit,)
    )
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        results.append({
            "id": row["id"],
            "mode": row["mode"],
            "title": row["title"],
            "input_data": json.loads(row["input_data"]) if row["input_data"] else {},
            "output_content": row["output_content"],
            "created_at": row["created_at"]
        })
    return results

def get_generation_by_id(item_id: int) -> Optional[Dict[str, Any]]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM generations WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
        
    return {
        "id": row["id"],
        "mode": row["mode"],
        "title": row["title"],
        "input_data": json.loads(row["input_data"]) if row["input_data"] else {},
        "output_content": row["output_content"],
        "created_at": row["created_at"]
    }

def delete_generation(item_id: int) -> bool:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM generations WHERE id = ?", (item_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted

def clear_all_generations() -> bool:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM generations")
    conn.commit()
    conn.close()
    return True
