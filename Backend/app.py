from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

load_dotenv()

db_user = os.getenv('DB_USER', 'default_user')
db_password = os.getenv('DB_PASSWORD', 'default_password')
db_name = os.getenv('DB_NAME', 'default_db')

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@localhost:5432/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Test to see if application is accessible
@app.route("/")
def hello_world():
    return "Hello World!"

## GET FINAL COST ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will return the final cost of the order
## GET request to /get_final_cost?order_id=1
@app.route("/get_final_cost")
def get_final_cost():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    
    # TODO - Implement the logic to calculate the final cost of the order
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #recieve order_id and user_id and return a float
    #just do percent-off promotions

## GET COST BEFORE PROMOTIONS
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will return the cost of the order before applying any promotions
## GET request to /get_cost_before_promotions?order_id=1
@app.route("/get_cost_before_promotions")
def get_cost_before_promotions():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    
    # TODO - Implement the logic to calculate the cost of the order before applying any promotions
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}
    #same as above dont apply promotions

## ADD TO BASKET ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## - Product ID
## - Quantity
## - User ID
## This endpoint will add the product to the basket
## POST request to /add_to_basket with the following JSON body
## {
##     "order_id": 1,
##    "product_id": 1,
##    "quantity": 2,
##    "user_id": "example@student.bham.ac.uk"
## }
@app.route("/add_to_basket", methods=['POST'])
def add_to_basket():
    # Get the JSON body from the request
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Please provide the required details'}), 400

    order_id = data.get('order_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    user_id = data.get('user_id')

    # Check if any required field is missing
    if not order_id or not product_id or not quantity or not user_id:
        return jsonify({'error': 'Please provide the required details'}), 400

    # Check if the order_id is -1
    if order_id == '-1':
        # Generate a new order_id since -1 was received
        new_order_id = 5  # Generate a new unique order ID
        # Return JSON with the new order_id
        return jsonify({
            'success': True,
            'message': 'Order ID not found. New order ID generated.',
            'new_order_id': new_order_id,
        }), 200

    # If order_id is not -1, use the provided order_id and return a different response
    return jsonify({
        'success': True,
        'message': 'Order ID received and processed.'
    }), 200
    
    # TODO - Implement the logic to add the product to the basket
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #check database is not empty - if it is, call a subprogram to create an order
    #needs to check that verification is set to false
    #add information to orders table

## GET PRODUCT INFO ENDPOINT
## This endpoint will take in the following parameters:
## - Product ID
## This endpoint will return the information of the product
## GET request to /get_product_info?product_id=1
@app.route("/get_product_info")
def get_product_info():
    # Get the product ID from the request
    product_id = request.args.get('product_id')
    if not product_id:
        return {'error': 'Please provide a product ID'}, 400
    
    return jsonify({
        "description": "This is a more in depth description of the product.",
    })
    # TODO - Implement the logic to retrieve the information of the product
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #return everything in the item table

## GET TIME LEFT ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will return the time left for the order to be confirmed by all 
## GET request to /get_time_left?order_id=1
@app.route("/get_time_left")
def get_time_left():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    
    # TODO - Implement the logic to calculate the time left for the order to be confirmed by all
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}
    #send timestamp

## SEARCH RESULT ENDPOINT
## This endpoint will take in the following parameters:
## - Search Query
## This endpoint will return the search results based on the query (using fuzzy search over item names)
## GET request to /search_result?search_query=apple
@app.route("/search_result")
def search_result():
    # Get the search query from the request
    search_query = request.args.get('search_query')
    if not search_query:
        return {'error': 'Please provide a search query'}, 400
    
    items = [
        {
            "imgSource": "https://via.placeholder.com/150",
            "itemName": "Item 1",
            "itemDescription": "Description for Item 1. This is a great product.",
            "price": 19.99,
            "productId": 1
        },
        {
            "imgSource": "https://via.placeholder.com/150",
            "itemName": "Item 2",
            "itemDescription": "Description for Item 2. Another fantastic item.",
            "price": 29.99,
            "productId": 2
        },
        {
            "imgSource": "https://via.placeholder.com/150",
            "itemName": "Item 3",
            "itemDescription": "Description for Item 3. You won't regret buying this.",
            "price": 49.99,
            "productId": 3
        },
        {
            "imgSource": "https://via.placeholder.com/150",
            "itemName": "Item 4",
            "itemDescription": "Description for Item 4. Best value for your money.",
            "price": 9.99,
            "productId": 4
        },
        {
            "imgSource": "https://via.placeholder.com/150",
            "itemName": "Item 5",
            "itemDescription": "Description for Item 5. Top quality product.",
            "price": 39.99,
            "productId": 5
        }
    ]

    return {'items': items}
    
    # TODO - Implement the logic to search the items based on the query
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #use soundex to search
    #return all from item table 

## CONFIRM ORDER ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## - User ID
## This endpoint will confirm the order for the user
## POST request to /confirm_order with the following JSON body
## {
##     "order_id": 1,
##     "user_id": "example@student.bham.ac.uk"
## }
@app.route("/confirm_order", methods=['POST'])
def confirm_order():
    # Get the JSON body from the request
    data = request.get_json()
    if not data:
        return {'error': 'Please provide the required details'}, 400
    
    # Get the order ID and user ID from the JSON body
    order_id = data.get('order_id')
    user_id = data.get('user_id')
    if not order_id or not user_id:
        return jsonify({'success': False, 'message': 'Order ID and User ID are required'}), 400
    
    return jsonify({'success': True, 'message': 'Order confirmed successfully'}), 200
    # if not successful
    return jsonify({'success': False, 'message': 'An error occurred while confirming the order.'}), 500
    # TODO - Implement the logic to confirm the order for the user
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #set status to confirm
    #check timestamp for order id
        #if true copy the timestamp
        #if false create one: get the current time

## CHECK IF ORDER CONFIRMED ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will check if the order is confirmed
## GET request to /check_if_order_confirmed?order_id=1
@app.route("/check_if_order_confirmed", methods=['GET'])
def check_if_order_confirmed():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    
    return jsonify({
        "confirmed": False
    }), 200
    # TODO - Implement the logic to check if the order is confirmed
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #check order id is true for everything return true or false ('data' : true) etc.

## USER IS ORDER HOST ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## - User ID
## This endpoint will check if the user is the host of the order
## GET request to /user_is_host
@app.route("/user_is_host", methods=['GET'])
def user_is_host():
    # Get the order ID and user ID from the request
    order_id = request.args.get('order_id')
    user_id = request.args.get('user_id')
    if not order_id or not user_id:
        return {'error': 'Please provide the required details'}, 400
    
    return jsonify({
        "isHost": True
    }), 200
    # TODO - Implement the logic to check if the user is the host of the order
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #return true or false 

## GET USER BASKET ENDPOINT
## This endpoint will take in the following parameters:
## - User ID
## - Order ID
## This endpoint will return the basket of the user
## GET request to /get_user_basket
@app.route("/get_user_basket")
def get_user_basket():
    # Get the user ID and order ID from the request
    user_id = request.args.get('user_id')
    order_id = request.args.get('order_id')
    if not user_id or not order_id:
        return {'error': 'Please provide the required details'}, 400
    
    userCarts = [
        {
            "userName": "Your Name",  # Current user's name
            "userPFP": "https://via.placeholder.com/150",
            "purchases": [
                { "item": "Wireless Mouse", "price": 25.99, "quantity": 2 },
                { "item": "Keyboard", "price": 45.50, "quantity": 1 },
                { "item": "USB-C Cable", "price": 10.00, "quantity": 3 },
            ]
        },
        {
            "userName": "Alice Johnson",
            "userPFP": "https://via.placeholder.com/150",
            "purchases": [
                { "item": "Monitor", "price": 150.00, "quantity": 1 },
                { "item": "HDMI Cable", "price": 12.99, "quantity": 2 },
            ]
        },
        {
            "userName": "Bob Smith",
            "userPFP": "https://via.placeholder.com/150",
            "purchases": [
                { "item": "Laptop Stand", "price": 30.00, "quantity": 1 },
                { "item": "Webcam", "price": 60.00, "quantity": 1 },
                { "item": "Desk Lamp", "price": 20.00, "quantity": 2 },
            ]
        },
        # Add more user carts as needed
    ]
    
    # In a real application, filter or retrieve userCarts based on user_id and order_id
    return jsonify({"userCarts": userCarts}), 200
    
    # TODO - Implement the logic to retrieve the basket of the user
    # result = db.engine.execute("SELECT * FROM your_table")
    # rows = [dict(row) for row in result]
    # return {'data': rows}
    #return orders table as relevant and join it to item table
    #item name, quantity, price, promotion type, url, id

@app.route("/get_delivery_cost", methods=['GET'])
def get_delivery_cost():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    
    return jsonify({
        "total": 5.99,
        "individual": 1.99
    })
    # TODO - Implement the logic to calculate the delivery cost of the order
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #return delivery cost





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)