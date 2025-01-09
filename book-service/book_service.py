from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# Connect to local MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['bookstore_db']
books_collection = db['books']

@app.route('/books', methods=['GET'])
def get_books():
    books = list(books_collection.find())
    for book in books:
        book['_id'] = str(book['_id'])  # Convert ObjectId to string
    return jsonify(books), 200

@app.route('/books', methods=['POST'])
def add_book():
    new_book = request.json
    result = books_collection.insert_one(new_book)
    new_book['_id'] = str(result.inserted_id)  # Convert ObjectId to string
    return jsonify(new_book), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
