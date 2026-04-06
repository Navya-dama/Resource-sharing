from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Create DB
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            contact TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Add item
@app.route('/add', methods=['POST'])
def add_item():
    data = request.json
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO items (name, category, contact) VALUES (?, ?, ?)",
              (data['name'], data['category'], data['contact']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item added"})

# Get items
@app.route('/items', methods=['GET'])
def get_items():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM items")
    rows = c.fetchall()
    conn.close()

    items = []
    for row in rows:
        items.append({
            "id": row[0],
            "name": row[1],
            "category": row[2],
            "contact": row[3]
        })

    return jsonify(items)

# Delete item
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_item(id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("DELETE FROM items WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})

if __name__ == '__main__':
    app.run(debug=True) 