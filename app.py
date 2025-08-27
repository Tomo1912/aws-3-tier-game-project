from flask import Flask, request, jsonify
import mysql.connector
import os

app = Flask(__name__)

# Učitavamo konfiguraciju iz environment varijabli - ovo je best practice!
# Ne zapisujemo lozinke direktno u kod.
db_host = os.environ.get('DB_HOST')
db_user = os.environ.get('DB_USER', 'admin')
db_password = os.environ.get('DB_PASSWORD')
db_name = "igrabaza" # Bazu cemo kreirati rucno

def get_db_connection():
    connection = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name
    )
    return connection

# Ruta za inicijalizaciju baze i tablice
@app.route('/init', methods=['GET'])
def init_db():
    try:
        # Spoji se bez specificne baze za prvu inicijalizaciju
        conn_init = mysql.connector.connect(host=db_host, user=db_user, password=db_password)
        cursor = conn_init.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        conn_init.commit()
        cursor.close()
        conn_init.close()

        # Sada se spoji na novu bazu i kreiraj tablicu
        conn_db = get_db_connection()
        cursor = conn_db.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                score INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn_db.commit()
        cursor.close()
        conn_db.close()
        return jsonify({'status': 'database and table initialized'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Ruta za dodavanje novog scora
@app.route('/score', methods=['POST'])
def add_score():
    data = request.get_json()
    if not data or 'name' not in data or 'score' not in data:
        return jsonify({'status': 'error', 'message': 'Missing name or score'}), 400
    
    name = data['name']
    score = data['score']

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO scores (name, score) VALUES (%s, %s)", (name, score))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'status': 'success', 'name': name, 'score': score}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Ruta za dohvacanje top 10 scoreova
@app.route('/scores', methods=['GET'])
def get_scores():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT name, score FROM scores ORDER BY score DESC LIMIT 10")
        scores = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(scores), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    # Pokrecemo aplikaciju na portu 8080 da je moze pokrenuti obican korisnik
    app.run(host='0.0.0.0', port=8080, debug=True)
