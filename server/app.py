from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS 
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv() 
app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

# ---------------------------- Client Routes ---------------------------- #

@app.route('/clients', methods=['GET'])
def get_clients():
    search_query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    offset = (page - 1) * 10 
    conn = mysql.connection
    cursor = conn.cursor()

    if search_query:
        query = """
            SELECT id, name, email, phone, address FROM clients
            WHERE name LIKE %s OR email LIKE %s
            LIMIT 10 OFFSET %s
        """
        cursor.execute(query, (f'%{search_query}%', f'%{search_query}%', offset))
    else:
        query = """
            SELECT id, name, email, phone, address FROM clients
            LIMIT 10 OFFSET %s
        """
        cursor.execute(query, (offset,))
    
    rows = cursor.fetchall()
    cursor.close()

    clients = [{'id': row[0], 'name': row[1], 'email': row[2], 'phone': row[3], 'address': row[4]} for row in rows]

    return jsonify(clients)

# Add a new client
@app.route('/clients', methods=['POST'])
def add_client():
    data = request.get_json()
    name = data['name']
    email = data['email']
    phone = data['phone']
    address = data['address']

    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("INSERT INTO clients (name, email, phone, address) VALUES (%s, %s, %s, %s)", 
                   (name, email, phone, address))
    conn.commit()
    cursor.close()

    return jsonify({"message": "Client added successfully"}), 201

# Edit an existing client
@app.route('/clients/<int:id>', methods=['PUT'])
def edit_client(id):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')

    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE clients 
        SET name = %s, email = %s, phone = %s, address = %s
        WHERE id = %s
    """, (name, email, phone, address, id))
    conn.commit()
    cursor.close()

    return jsonify({"message": "Client updated successfully"})

# Delete a client
@app.route('/clients/<int:id>', methods=['DELETE'])
def delete_client(id):
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clients WHERE id = %s", [id])
    conn.commit()
    cursor.close()

    return jsonify({"message": "Client deleted successfully"})

# Count total number of clients (for pagination)
@app.route('/clients/count', methods=['GET'])
def count_clients():
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM clients")
    count = cursor.fetchone()[0]
    cursor.close()

    return jsonify({"count": count})

# ---------------------------- Lead Routes ---------------------------- #

@app.route('/leads', methods=['GET'])
def get_leads():
    search_query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    offset = (page - 1) * 10  # Assuming 10 leads per page

    conn = mysql.connection
    cursor = conn.cursor()

    if search_query:
        query = """
            SELECT id, name, email, phone, source, status FROM leads
            WHERE name LIKE %s OR email LIKE %s
            LIMIT 10 OFFSET %s
        """
        cursor.execute(query, (f'%{search_query}%', f'%{search_query}%', offset))
    else:
        query = """
            SELECT id, name, email, phone, source, status FROM leads
            LIMIT 10 OFFSET %s
        """
        cursor.execute(query, (offset,))

    rows = cursor.fetchall()
    cursor.close()

    leads = [{'id': row[0], 'name': row[1], 'email': row[2], 'phone': row[3], 'source': row[4], 'status': row[5]} for row in rows]

    return jsonify(leads)

@app.route('/leads', methods=['POST'])
def add_lead():
    data = request.get_json()
    name = data['name']
    email = data['email']
    phone = data.get('phone', '')
    source = data.get('source', '')
    status = data.get('status', 'New')
    
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO leads (name, email, phone, source, status) VALUES (%s, %s, %s, %s, %s)",
                   (name, email, phone, source, status))
    mysql.connection.commit()
    return jsonify({"message": "Lead added successfully"}), 201

@app.route('/leads/<int:id>', methods=['PUT'])
def update_lead(id):
    data = request.get_json()
    name = data.get('name', '')
    email = data.get('email', '')
    phone = data.get('phone', '')
    status = data.get('status', 'New')
    
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE leads SET name=%s, email=%s, phone=%s, status=%s WHERE id=%s",
                   (name, email, phone, status, id))
    mysql.connection.commit()
    return jsonify({"message": "Lead updated successfully"}), 200

@app.route('/leads/<int:id>', methods=['DELETE'])
def delete_lead(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM leads WHERE id=%s", (id,))
    mysql.connection.commit()
    return jsonify({"message": "Lead deleted successfully"}), 200




# ---------------------------- Task Routes ---------------------------- #

@app.route('/tasks', methods=['GET'])
def get_tasks():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, title, description, due_date, status FROM tasks")
    rows = cursor.fetchall()
    cursor.close()

    tasks = [{'id': row[0], 'title': row[1], 'description': row[2], 'due_date': row[3], 'status': row[4]} for row in rows]
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    title = data['title']
    description = data['description']
    due_date = data['due_date']
    status = data.get('status', 'Pending')

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO tasks (title, description, due_date, status) VALUES (%s, %s, %s, %s)",
                   (title, description, due_date, status))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Task added successfully"}), 201


@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    try:
        data = request.get_json()
        print("Raw data received for update:", data)

        title = data.get('title')
        description = data.get('description')
        raw_due_date = data.get('due_date')
        status = data.get('status')

        due_date = None
        if raw_due_date and raw_due_date != 'Invalid Date':
            try:
               
                due_date = datetime.strptime(raw_due_date, '%Y-%m-%d').strftime('%Y-%m-%d')
            except ValueError:
                try:
                    
                    due_date = datetime.strptime(raw_due_date, '%a, %d %b %Y %H:%M:%S %Z').strftime('%Y-%m-%d')
                except Exception as e:
                    print("Date parsing error:", e)
                    return jsonify({"error": "Invalid date format"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute("""
            UPDATE tasks 
            SET title=%s, description=%s, due_date=%s, status=%s 
            WHERE id=%s
        """, (title, description, due_date, status, id))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Task updated successfully"}), 200

    except Exception as e:
        print("Task update error:", e)
        return jsonify({"error": "Failed to update task"}), 500





@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("DELETE FROM tasks WHERE id=%s", (id,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        print("Delete error:", e)
        return jsonify({"error": "Failed to delete task"}), 500


if __name__ == '__main__':
    app.run(debug=True)

# ---------------------------- Notes Routes ---------------------------- #

# # Fetch notes for a client, lead, or opportunity
# @app.route('/notes', methods=['GET'])
# def get_notes():
#     client_id = request.args.get('client_id')
#     lead_id = request.args.get('lead_id')
#     opportunity_id = request.args.get('opportunity_id')

#     query = "SELECT id, content, client_id, lead_id, opportunity_id, created_at FROM notes WHERE 1=1"
    
#     if client_id:
#         query += " AND client_id = %s"
#     if lead_id:
#         query += " AND lead_id = %s"
#     if opportunity_id:
#         query += " AND opportunity_id = %s"

#     conn = mysql.connection
#     cursor = conn.cursor()

#     cursor.execute(query, (client_id, lead_id, opportunity_id))
#     notes = cursor.fetchall()
#     cursor.close()

#     return jsonify([{
#         'id': note[0],
#         'content': note[1],
#         'client_id': note[2],
#         'lead_id': note[3],
#         'opportunity_id': note[4],
#         'created_at': note[5]
#     } for note in notes])

# # Add a new note
# @app.route('/notes', methods=['POST'])
# def add_note():
#     data = request.get_json()
#     content = data['content']
#     client_id = data.get('client_id')
#     lead_id = data.get('lead_id')
#     opportunity_id = data.get('opportunity_id')

#     conn = mysql.connection
#     cursor = conn.cursor()
#     cursor.execute("""
#         INSERT INTO notes (content, client_id, lead_id, opportunity_id)
#         VALUES (%s, %s, %s, %s)
#     """, (content, client_id, lead_id, opportunity_id))
#     conn.commit()
#     cursor.close()

#     return jsonify({"message": "Note added successfully"}), 201

# # Delete a note
# @app.route('/notes/<int:id>', methods=['DELETE'])
# def delete_note(id):
#     conn = mysql.connection
#     cursor = conn.cursor()
#     cursor.execute("DELETE FROM notes WHERE id = %s", [id])
#     conn.commit()
#     cursor.close()

#     return jsonify({"message": "Note deleted successfully"})



# ------------------------ Opportunity Routes ------------------------- #

# @app.route('/opportunities', methods=['GET'])
# def get_opportunities():
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT id, name, value, stage, close_date FROM opportunities")
#     rows = cursor.fetchall()
#     cursor.close()

#     opportunities = [{'id': row[0], 'name': row[1], 'value': row[2], 'stage': row[3], 'close_date': row[4]} for row in rows]
#     return jsonify(opportunities)

# @app.route('/opportunities', methods=['POST'])
# def add_opportunity():
#     data = request.get_json()
#     name = data['name']
#     value = data['value']
#     stage = data['stage']
#     close_date = data['close_date']

#     cursor = mysql.connection.cursor()
#     cursor.execute("INSERT INTO opportunities (name, value, stage, close_date) VALUES (%s, %s, %s, %s)",
#                    (name, value, stage, close_date))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({"message": "Opportunity added successfully"}), 201


# @app.route('/opportunities', methods=['GET'])
# def get_opportunities_list():
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT id, name, value, stage, close_date FROM opportunities")
#     rows = cursor.fetchall()
#     cursor.close()

#     opportunities = [{'id': row[0], 'name': row[1], 'value': row[2], 'stage': row[3], 'close_date': row[4]} for row in rows]
#     return jsonify(opportunities)