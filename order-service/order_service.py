from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# Connect to local MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['bookstore_db']
orders_collection = db['orders']

@app.route('/orders', methods=['POST'])
def create_order():
    order = request.json
    result = orders_collection.insert_one(order)
    order['_id'] = str(result.inserted_id)  # Convert ObjectId to string
    return jsonify(order), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
