from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# Connect to local MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['bookstore_db']
inventory_collection = db['inventory']

@app.route('/inventory', methods=['GET'])
def get_inventory():
    inventory = list(inventory_collection.find())
    for item in inventory:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string
    return jsonify(inventory), 200

@app.route('/inventory/<int:book_id>', methods=['PATCH'])
def update_inventory(book_id):
    quantity = request.json.get('quantity')
    item = inventory_collection.find_one({'book_id': book_id})
    
    if item:
        inventory_collection.update_one({'book_id': book_id}, {'$inc': {'stock': -quantity}})
        return jsonify({"message": "Inventory updated"}), 200

    return jsonify({"message": "Book not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
