# E-Commerce API (Node + Express + MySQL2)

A simple and modular e-commerce backend built with **Node.js**, **Express**, and **MySQL2**.  
It includes features like user authentication, product & category management, cart handling via session IDs, and Swagger API documentation.

## Tech Stack
- **Node.js** + **Express.js**
- **MySQL2**
- **Swagger (OpenAPI)** for API documentation
- **dotenv**, **cors**, **uuid**, and **nodemon** for development ease

---

## Features
-  User authentication (JWT-based)  
- Product & category management  
-  Cart management with **Session ID** (stored client-side, tracked on server)  
-  Order management  
-  Swagger UI for live API testing  
-  MySQL connection pooling with environment variables

---

##  Project Setup

###  Clone or unzip the project
```bash
git clone <your-repo-url>
cd ecom-api
```

###  Install dependencies
```bash
npm install
```

###  Create a `.env` file in the root folder
Example:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommerce

### Please execute Schema.sql File for Table Creation.
```

###  Start the server
```bash
npm run dev
```
Server runs by default at 👉 **http://localhost:3000**

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login user |
| **GET** | `/api/products` | Get all products |
| **POST** | `/api/products` | Add new product |
| **GET** | `/api/categories` | Get all categories |
| **POST** | `/api/cart` | Add item to cart (uses `x-session-id` header) |
| **GET** | `/api/cart` | Get cart by Session ID |
| **POST** | `/api/orders` | Create an order from cart |



## Folder Structure
```
 ecom-api
 ┣routes
 ┃ ┣ auth.routes.js
 ┃ ┣ product.routes.js
 ┃ ┣ category.routes.js
 ┃ ┣ cart.routes.js
 ┃ ┗ order.routes.js
 ┣ controllers
 ┣ config
 ┃ ┗ db.js
 ┣ utils
 ┣  swagger.js
 ┣  server.js
 ┣  package.json
 ┗  .env (ignored in git)
```

---

##  Session-Based Cart Logic
Frontend sends a `x-session-id` header for every cart request.  
If not provided, backend can generate one using `uuid.v4()` and send it back to FE.  
This allows non-logged-in users to manage carts seamlessly.

---

##  Author
**Karan (Krazy T0M)**  
Feel free to fork, modify, or extend the API!  
>  Suggestions and pull requests are always welcome.



API Testing Collection

https://.postman.co/workspace/My-Workspace~f32509b1-ee52-46cc-8c37-b177805e0b3f/collection/36003331-99a4832d-1441-41f8-80aa-25da9b574088?action=share&creator=36003331