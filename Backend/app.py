from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Change the URL here for our databse
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost:5432/your_database'
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
@app.route("/get_final_cost")
def get_final_cost():
    order_id = request.args.get('order_id')
    if not order_id:
        return {'error': 'Please provide an order ID'}, 400
    # EXAMPLE of a SELECT query to retrieve data from a table
    result = db.engine.execute("SELECT * FROM your_table")
    rows = [dict(row) for row in result]
    return {'data': rows}



if __name__ == "__main__":
    app.run()