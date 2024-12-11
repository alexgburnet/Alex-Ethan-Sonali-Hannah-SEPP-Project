from dotenv import load_dotenv
import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

db_user = os.getenv('DB_USER', 'default_user')
db_password = os.getenv('DB_PASSWORD', 'default_password')
db_name = os.getenv('DB_NAME', 'default_db')

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@localhost:5432/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route("/")
def hello_world():
    # EXAMPLE of a SELECT query to retrieve data from a table
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

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
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

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
        return {'error': 'Please provide the required details'}, 400
    
    # Get the order ID, product ID, quantity and user ID from the JSON body
    order_id = data.get('order_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    user_id = data.get('user_id')
    if not order_id or not product_id or not quantity or not user_id:
        return {'error': 'Please provide the required details'}, 400
    
    # TODO - Implement the logic to add the product to the basket
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

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
    
    # TODO - Implement the logic to retrieve the information of the product
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

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
    
    # TODO - Implement the logic to search the items based on the query
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

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
        return {'error': 'Please provide the required details'}, 400
    
    # TODO - Implement the logic to confirm the order for the user
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

## CHECK IF ORDER CONFIRMED ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will check if the order is confirmed
## GET request to /check_if_order_confirmed?order_id=1
@app.route("/check_if_order_confirmed")
def check_if_order_confirmed():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    
    # TODO - Implement the logic to check if the order is confirmed
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

## USER IS ORDER HOST ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## - User ID
## This endpoint will check if the user is the host of the order
## GET request to /user_is_host
@app.route("/user_is_host")
def user_is_host():
    # Get the order ID and user ID from the request
    order_id = request.args.get('order_id')
    user_id = request.args.get('user_id')
    if not order_id or not user_id:
        return {'error': 'Please provide the required details'}, 400
    
    # TODO - Implement the logic to check if the user is the host of the order
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

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
    
    # TODO - Implement the logic to retrieve the basket of the user
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}

## GET FULL BASKET ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will return the full basket of the order, seperated by users
## GET request to /get_full_basket?order_id=1
@app.route("/get_full_basket")
def get_full_basket():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    
    # TODO - Implement the logic to retrieve the full basket of the order
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}







if __name__ == "__main__":
    app.run()