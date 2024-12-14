# Software Engineering and Professional Practice Group Project



## Live Demo

**Frontend**: [Demo](http://172.167.146.215:3000/)

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Endpoints](#api-documentation)

---

## Features

### User Features:
- **Search for Products**: Perform a fuzzy search for products or view random suggestions.
- **View Product Details**: View a detailed page for each product with pricing and descriptions.
- **Collaborative Shopping**:
  - Create or join shared orders.
  - Add items to shared baskets.
  - View baskets separated by user.
- **Order Confirmation**:
  - Hosts can confirm shared orders.
  - Split delivery costs among participants.
- **Checkout Timer**: Ensure timely checkout for confirmed orders.

### Admin/Developer Features:
- **Database-Driven Backend**: Utilizes PostgreSQL for robust data handling.
- **RESTful API**:
  - Search, add to baskets, confirm orders, and fetch product/order details.
  - Dynamic responses based on user and order contexts.
- **Extensive Dummy Data**:
  - Ready-to-use items, orders, and users for development and testing.

---

## Technologies Used

### Backend
- **Flask**: Handles the server-side logic and API endpoints.
- **SQLAlchemy**: ORM for database interactions.
- **PostgreSQL**: Database for storing product, user, and order information.

### Frontend
- **React.js**: Provides a dynamic and responsive user interface.

### Deployment
- **Docker**: Containerization for backend and database.
- **Github Actions**: to deploy to Azure
- **Axios**: For frontend API communication.

---

## Getting Started

### Prerequisites

#### For Running the Application (No Local Development)
- **Docker**: Required to build and run the application containers.

#### For Development
- **Node.js**: For React.js frontend development.
- **Python 3.10+**: For Flask backend development.

# Steps to Get the Project Running

## Running the Application (Production Mode)

### Prerequisites
- **Docker** and **Docker Compose** installed.

### Steps
1. **Clone the Repository**:
```bash
git clone https://github.com/your-repo-name.git
cd your-repo-name
```
2.	**Start the Application**:

```bash
docker-compose up --build
```

3.	Access the Application:
	•	Frontend: http://localhost:3000
	•	Backend API (optional): http://localhost:5001

## Running the Application (Development Mode)

### Prerequisites

•	Install the following:
•	Node.js (for the frontend).
•	Python 3.10+ and pip (for the backend).
•	PostgreSQL (optional if not using Docker for the database).

#### Backend Development

1.	Navigate to the backend folder:
```bash
cd backend
```

2.	Create a Virtual Environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3.	Install Dependencies:
```bash
pip install -r requirements.txt
```

4.	Run the Backend Server:
```bash
flask run --host=0.0.0.0 --port=5001
```
#### Frontend Development

1.	Navigate to the frontend folder:
```bash
cd frontend
```

2.	Install Dependencies:
```bash
npm install
```

3.	Run the Frontend Development Server:
```bash
npm run dev
```

#### Resetting the Project

1.	Stop all containers:
```bash
docker-compose down -v
```

2.	Rebuild and start the application:
```bash
docker compose up --build -V
```

I'll add a linked table of contents for the endpoints.

# API Documentation

## Base URL
The API is hosted at the root endpoint `/`. All endpoints described below should be appended to the base URL.

## Endpoints
- [Check Application Status](#check-application-status)
- [Get Final Cost](#get-final-cost)
- [Add to Basket](#add-to-basket)
- [Get Product Information](#get-product-information)
- [Get Time Due](#get-time-due)
- [Search Results](#search-results)
- [Confirm Order](#confirm-order)
- [Check Order Confirmation](#check-order-confirmation)
- [Check Host Status](#check-host-status)
- [Get User Basket](#get-user-basket)
- [Get Delivery Cost](#get-delivery-cost)

## Authentication
This API currently does not implement authentication mechanisms. All endpoints are publicly accessible.

## Documentation

### Check Application Status
```http
GET /
```
Tests if the application is accessible and returns all items from the database.

**Response**
- Success: `200 OK` with array of items
- Error: `500 Internal Server Error` with error message

### Get Final Cost
```http
GET /get_final_cost
```
Retrieves the final cost for a specific order.

**Query Parameters**
- `order_id` (required): The ID of the order
- `user_id` (required): The email of the user

**Response**
```json
{
    "user_subtotal": 25.50,
    "items": [
        {
            "item_name": "Product Name",
            "item_cost": 12.75,
            "item_quantity": 2
        }
    ]
}
```

### Add to Basket
```http
POST /add_to_basket
```
Adds a product to the user's basket or creates a new order if none exists.

**Request Body**
```json
{
    "order_id": 1,
    "product_id": 1,
    "quantity": 2,
    "user_id": "example@student.bham.ac.uk"
}
```
Note: Use `order_id: -1` to create a new order.

**Response**
- Success (New Order):
```json
{
    "success": true,
    "message": "New order created and item added.",
    "new_order_id": 123
}
```
- Success (Existing Order):
```json
{
    "success": true,
    "message": "Item added to basket.",
    "order_id": 123
}
```

### Get Product Information
```http
GET /get_product_info
```
Retrieves detailed information about a specific product.

**Query Parameters**
- `product_id` (required): The ID of the product

**Response**
```json
{
    "title": "Product Name",
    "price": 19.99,
    "photoURL": "http://example.com/photo.jpg",
    "description": "Product description"
}
```

### Get Time Due
```http
GET /get_time_due
```
Returns the due time for an order (3 days after confirmation).

**Query Parameters**
- `order_id` (required): The ID of the order

**Response**
```json
{
    "success": true,
    "time_due": "2024-12-17T14:30:00Z"
}
```

### Search Results
```http
GET /search_result
```
Searches for products using fuzzy matching on product names.

**Query Parameters**
- `search_query` (optional): The search term. If omitted, returns 20 random items.

**Response**
```json
{
    "items": [
        {
            "imgSource": "http://example.com/photo.jpg",
            "itemName": "Product Name",
            "itemDescription": "Description",
            "price": 19.99,
            "productId": 1
        }
    ]
}
```

### Confirm Order
```http
POST /confirm_order
```
Confirms an order (host only).

**Request Body**
```json
{
    "order_id": 1,
    "user_id": "example@student.bham.ac.uk"
}
```

**Response**
```json
{
    "success": true,
    "message": "Order confirmed successfully"
}
```

### Check Order Confirmation
```http
GET /check_if_order_confirmed
```
Checks if an order has been confirmed.

**Query Parameters**
- `order_id` (required): The ID of the order

**Response**
```json
{
    "confirmed": true
}
```

### Check Host Status
```http
GET /user_is_host
```
Checks if a user is the host of an order.

**Query Parameters**
- `order_id` (required): The ID of the order
- `user_id` (required): The email of the user

**Response**
```json
{
    "isHost": true
}
```

### Get User Basket
```http
GET /get_user_basket
```
Retrieves the basket contents for all users in an order.

**Query Parameters**
- `user_id` (required): The email of the user
- `order_id` (required): The ID of the order

**Response**
```json
{
    "userCarts": [
        {
            "userName": "user@example.com",
            "userPFP": "user@example.com",
            "purchases": [
                {
                    "item": "Product Name",
                    "price": 19.99,
                    "quantity": 2
                }
            ]
        }
    ]
}
```

### Get Delivery Cost
```http
GET /get_delivery_cost
```
Calculates the delivery cost split among order participants.

**Query Parameters**
- `order_id` (required): The ID of the order

**Response**
```json
{
    "total": 6.00,
    "individual": 2.00,
    "people": 3
}
```

## Error Responses
All endpoints may return the following error responses:
- `400 Bad Request`: Missing or invalid parameters
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server-side error

Each error response includes a JSON object with an `error` field containing a description of the error.
