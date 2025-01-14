from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Connect to local MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['bookstore_db']
users_collection = db['users']

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = users_collection.find_one({'username': username})

    if user and user['password'] == password:
        return jsonify({"message": "Login successful!"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    existing_user = users_collection.find_one({'username': username})
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    new_user = {"username": username, "password": password}
    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully!"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
