from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from sqlalchemy import text

load_dotenv()

db_user = os.getenv('DB_USER', 'default_user')
db_password = os.getenv('DB_PASSWORD', 'default_password')
db_name = os.getenv('DB_NAME', 'default_db')

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@postgres:5432/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Test to see if application is accessible
@app.route("/")
def hello_world():
    try:
        with db.engine.connect() as connection:
            result = connection.execute(text("SELECT * FROM item"))
            rows = [dict(row._mapping) for row in result.fetchall()]
        return {'data': rows}
    except Exception as e:
        return {'error': str(e)}, 500

## GET FINAL COST ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will return the final cost of the order
## GET request to /get_final_cost?order_id=1
@app.route("/get_final_cost")
def get_final_cost():
    # Get the order ID and user email from the request
    order_id = request.args.get('order_id')
    user_id = request.args.get('user_id')
    
    if not order_id or not user_id:
        return {'error': 'Please provide both order_id and user_email'}, 400

    try:
        with db.engine.connect() as connection:
            # Fetch all items for the given order and user
            query = text("""
                SELECT i.item_name, i.item_cost, o.item_quantity
                FROM orders o
                JOIN item i ON o.item_id = i.item_id
                WHERE o.order_id = :order_id AND o.user_email = :user_email
            """)
            result = connection.execute(query, {"order_id": order_id, "user_email": user_id}).fetchall()

            # Calculate the user's subtotal
            user_subtotal = sum(float(row.item_cost) * row.item_quantity for row in result)
            
            # Fetch the number of unique users in the order
            user_count_query = text("""
                SELECT COUNT(DISTINCT user_email)
                FROM orders
                WHERE order_id = :order_id
            """)
            user_count = connection.execute(user_count_query, {"order_id": order_id}).scalar()
            
            # Calculate the delivery fee split
            delivery_fee_split = float(6) / user_count if user_count > 0 else 0
            
            # Calculate the final cost
            final_cost = user_subtotal + delivery_fee_split
            
            # Optional: Fetch additional data for response (e.g., item details)
            items = [
                {"item_name": row.item_name, "item_cost": row.item_cost, "item_quantity": row.item_quantity}
                for row in result
            ]

        # Return the response
        return jsonify({
            "final_cost": round(final_cost, 2),
            "user_subtotal": round(user_subtotal, 2),
            "delivery_fee_split": round(delivery_fee_split, 2),
            "items": items
        })
    except Exception as e:
        return {'error': str(e)}, 500

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
    from sqlalchemy import text

    # Get the JSON body from the request
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Please provide the required details'}), 400

    order_id = data.get('order_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    user_id = data.get('user_id')

    # Check if any required field is missing
    if order_id is None or product_id is None or quantity is None or user_id is None:
        return jsonify({'error': 'Please provide all required details'}), 400

    try:
        with db.engine.connect() as connection:
            # Begin a transaction
            trans = connection.begin()
            try:
                # Ensure the user exists in the user table
                check_user_query = text("""
                    SELECT COUNT(*)
                    FROM public.user
                    WHERE user_email = :user_id
                """)
                user_exists = connection.execute(check_user_query, {"user_id": user_id}).scalar()

                if not user_exists:
                    # Insert the user if they don't exist
                    insert_user_query = text("""
                        INSERT INTO public.user (user_email, user_firstname, user_lastname, primary_user, order_confirmed)
                        VALUES (:user_id, 'Unknown', 'Unknown', TRUE, FALSE)
                    """)
                    connection.execute(insert_user_query, {"user_id": user_id})

                # Handle the case where order_id is -1
                if order_id == -1:
                    # Generate a new unique order_id
                    new_order_id_query = text("""
                        SELECT COALESCE(MAX(order_id), 0) + 1 AS new_order_id
                        FROM public.shared_order
                    """)
                    new_order_id = connection.execute(new_order_id_query).scalar()

                    # Insert into shared_order with the user as the host
                    insert_shared_order_query = text("""
                        INSERT INTO public.shared_order (order_id, host_email, order_confirmed)
                        VALUES (:new_order_id, :user_id, FALSE)
                    """)
                    connection.execute(insert_shared_order_query, {"new_order_id": new_order_id, "user_id": user_id})

                    # Add the product to the orders table
                    insert_order_query = text("""
                        INSERT INTO public.orders (order_id, user_email, item_id, item_quantity)
                        VALUES (:new_order_id, :user_id, :product_id, :quantity)
                    """)
                    connection.execute(insert_order_query, {
                        "new_order_id": new_order_id,
                        "user_id": user_id,
                        "product_id": product_id,
                        "quantity": quantity
                    })

                    # Commit the transaction
                    trans.commit()
                    return jsonify({
                        'success': True,
                        'message': 'New order created and item added.',
                        'new_order_id': new_order_id
                    }), 200

                # Handle the case where a valid order_id is provided
                else:
                    # Check if the order exists
                    order_info_query = text("""
                        SELECT host_email
                        FROM public.shared_order
                        WHERE order_id = :order_id
                    """)
                    order_info = connection.execute(order_info_query, {"order_id": order_id}).fetchone()

                    if not order_info:
                        return jsonify({'error': 'Order ID not found'}), 404

                    host_email = order_info.host_email

                    # If the user is not part of the order, add them
                    if not host_email:
                        # If no host exists, make the user the host
                        update_shared_order_query = text("""
                            UPDATE public.shared_order
                            SET host_email = :user_id
                            WHERE order_id = :order_id
                        """)
                        connection.execute(update_shared_order_query, {"user_id": user_id, "order_id": order_id})
                    else:
                        # Add the user as a participant
                        print(f"User {user_id} added to order_id {order_id}")

                    # Add or update the item in the orders table
                    check_existing_item_query = text("""
                        SELECT item_quantity
                        FROM public.orders
                        WHERE order_id = :order_id AND user_email = :user_id AND item_id = :product_id
                    """)
                    existing_item = connection.execute(check_existing_item_query, {
                        "order_id": order_id,
                        "user_id": user_id,
                        "product_id": product_id
                    }).fetchone()

                    if existing_item:
                        # Update the item quantity
                        update_item_query = text("""
                            UPDATE public.orders
                            SET item_quantity = item_quantity + :quantity
                            WHERE order_id = :order_id AND user_email = :user_id AND item_id = :product_id
                        """)
                        connection.execute(update_item_query, {
                            "quantity": quantity,
                            "order_id": order_id,
                            "user_id": user_id,
                            "product_id": product_id
                        })
                        message = "Item quantity updated."
                    else:
                        # Insert the item
                        insert_item_query = text("""
                            INSERT INTO public.orders (order_id, user_email, item_id, item_quantity)
                            VALUES (:order_id, :user_id, :product_id, :quantity)
                        """)
                        connection.execute(insert_item_query, {
                            "order_id": order_id,
                            "user_id": user_id,
                            "product_id": product_id,
                            "quantity": quantity
                        })
                        message = "Item added to basket."

                    # Commit the transaction
                    trans.commit()
                    return jsonify({
                        'success': True,
                        'message': message,
                        'order_id': order_id
                    }), 200

            except Exception as e:
                # Rollback the transaction on error
                trans.rollback()
                print(f"Transaction rolled back due to: {e}")
                raise e

    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

    try:
        with db.engine.connect() as connection:
            # Fetch product information
            product_query = text("""
                SELECT item_name, item_cost, item_photo_url, descriptions
                FROM public.item
                WHERE item_id = :product_id
            """)
            product_info = connection.execute(product_query, {"product_id": product_id}).fetchone()

            if not product_info:
                return {'error': 'Product not found'}, 404

            # Extract product details
            item_name = product_info.item_name
            item_cost = float(product_info.item_cost)
            item_photo_url = product_info.item_photo_url
            description = product_info.descriptions

        return jsonify({
            "title": item_name,
            "price": round(item_cost, 2),
            "photoURL": item_photo_url,
            "description": description
        })

    except Exception as e:
        return {'error': str(e)}, 500

## GET TIME LEFT ENDPOINT
## This endpoint will take in the following parameters:
## - Order ID
## This endpoint will return the time left for the order to be confirmed by all 
## GET request to /get_time_left?order_id=1
from datetime import datetime, timedelta
from flask import request, jsonify

@app.route("/get_time_due")
def get_time_due():
    # Get the order ID from the request
    order_id = request.args.get('order_id')
    if not order_id:
        return jsonify({'error': 'Please provide an order ID'}), 400

    try:
        with db.engine.connect() as connection:
            # Fetch the order's confirmation status and time confirmed
            query = text("""
                SELECT order_confirmed, time_confirmed
                FROM public.shared_order
                WHERE order_id = :order_id
            """)
            order_info = connection.execute(query, {"order_id": order_id}).fetchone()

            if not order_info:
                return jsonify({'error': 'Order not found'}), 404

            order_confirmed = order_info.order_confirmed
            time_confirmed = order_info.time_confirmed

            if order_confirmed:
                # Add 3 days to the time confirmed
                time_due = time_confirmed + timedelta(days=3)
                time_due_iso = time_due.isoformat() + 'Z'  # Add 'Z' to indicate UTC
                return jsonify({'success': True, 'time_due': time_due_iso}), 200
            else:
                return jsonify({'success': False, 'message': 'Order is not confirmed yet.'}), 200

    except Exception as e:
        print(f"Error fetching time due: {e}")
        return jsonify({'success': False, 'message': 'An error occurred while fetching time due.'}), 500


    # TODO - Implement the logic to calculate the time left for the order to be confirmed by all
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #send timestamp

## SEARCH RESULT ENDPOINT
## This endpoint will take in the following parameters:
## - Search Query
## This endpoint will return the search results based on the query (using fuzzy search over item names)
## GET request to /search_result?search_query=apple
@app.route("/search_result")
def search_result():
    from sqlalchemy import text

    # Get the search query from the request
    search_query = request.args.get('search_query')
    if not search_query:
        return {'error': 'Please provide a search query'}, 400

    try:
        with db.engine.connect() as connection:
            # Perform fuzzy search using ILIKE
            search_query = f"%{search_query}%"
            search_query_sql = text("""
                SELECT item_id, item_name, descriptions, item_cost, item_photo_url
                FROM public.item
                WHERE item_name ILIKE :search_query
            """)
            result = connection.execute(search_query_sql, {"search_query": search_query}).fetchall()

            # Format the results into a list of dictionaries
            items = [
                {
                    "imgSource": row.item_photo_url,
                    "itemName": row.item_name,
                    "itemDescription": row.descriptions,
                    "price": float(row.item_cost),
                    "productId": row.item_id
                }
                for row in result
            ]

        # Return the search results
        return jsonify({"items": items}), 200

    except Exception as e:
        print(f"Error in search_result: {e}")
        return jsonify({'error': 'An error occurred while performing the search.'}), 500

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
    from datetime import datetime

    # Get the JSON body from the request
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Please provide the required details'}), 400
    
    # Get the order ID and user ID from the JSON body
    order_id = data.get('order_id')
    user_id = data.get('user_id')
    if (order_id is None or user_id is None) or (not order_id and order_id != 0):
        return jsonify({'success': False, 'message': 'Order ID and User ID are required'}), 400

    try:
        with db.engine.connect() as connection:
            # Begin a transaction
            trans = connection.begin()
            try:
                # Verify the user is the host of the order
                verify_host_query = text("""
                    SELECT host_email
                    FROM public.shared_order
                    WHERE order_id = :order_id
                """)
                result = connection.execute(verify_host_query, {"order_id": order_id}).fetchone()

                if not result:
                    return jsonify({'success': False, 'message': 'Order not found'}), 404

                host_email = result.host_email

                if host_email != user_id:
                    return jsonify({'success': False, 'message': 'Only the host can confirm the order'}), 403

                # Confirm the order and set the timestamp
                current_timestamp = datetime.utcnow()
                update_query = text("""
                    UPDATE public.shared_order
                    SET order_confirmed = TRUE, time_confirmed = :current_timestamp
                    WHERE order_id = :order_id
                """)
                connection.execute(update_query, {
                    "order_id": order_id,
                    "current_timestamp": current_timestamp
                })

                # Commit the transaction
                trans.commit()
                return jsonify({'success': True, 'message': 'Order confirmed successfully'}), 200

            except Exception as e:
                # Rollback the transaction on error
                trans.rollback()
                print(f"Error confirming order: {e}")
                return jsonify({'success': False, 'message': 'An error occurred while confirming the order.'}), 500

    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'success': False, 'message': 'An error occurred while confirming the order.'}), 500

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
        return jsonify({'error': 'Please provide an order ID'}), 400

    try:
        with db.engine.connect() as connection:
            # Query to check if the order is confirmed
            query = text("""
                SELECT order_confirmed
                FROM public.shared_order
                WHERE order_id = :order_id
            """)
            result = connection.execute(query, {"order_id": order_id}).fetchone()

            if not result:
                return jsonify({'error': 'Order not found'}), 404

            # Extract confirmation status
            order_confirmed = result.order_confirmed

        return jsonify({
            "confirmed": order_confirmed
        }), 200

    except Exception as e:
        print(f"Error checking order confirmation: {e}")
        return jsonify({'error': 'An error occurred while checking order confirmation'}), 500

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
        return jsonify({'error': 'Please provide the required details'}), 400

    try:
        with db.engine.connect() as connection:
            # Query to check if the user is the host of the order
            query = text("""
                SELECT host_email
                FROM public.shared_order
                WHERE order_id = :order_id
            """)
            result = connection.execute(query, {"order_id": order_id}).fetchone()

            if not result:
                return jsonify({'error': 'Order not found'}), 404

            is_host = result.host_email == user_id

        return jsonify({
            "isHost": is_host
        }), 200

    except Exception as e:
        print(f"Error checking if user is host: {e}")
        return jsonify({'error': 'An error occurred while checking host status'}), 500

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
    

    print(request.args)

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
    
    print(request.args)

    return jsonify({
        "total": 5.99,
        "individual": 1.99,
        "people": 3 # Number of people in the order
    })
    # TODO - Implement the logic to calculate the delivery cost of the order
    #result = db.engine.execute("SELECT * FROM your_table")
    #rows = [dict(row) for row in result]
    #return {'data': rows}
    #return delivery cost





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)