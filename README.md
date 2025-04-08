---
title: "\U0001F37D️ Canteen Management WebApp"

---

##  Add to Wallet Button Integration

This section guides you through setting up the **Add to Wallet** button using Razorpay and preparing your local server for testing with `ngrok`.

###  Razorpay Setup

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click on the **Sign Up** option at the top-right corner and create a new account.
3. Complete only the **basic setup steps** necessary to access the dashboard.
4. Once you're in the dashboard, ensure that you are using the Test mode which can be toggled using an option next to `What's New` . Go to the **left sidebar** and select **Payment Button** under the **Payment Products** section.
5. Click on **Create Payment Button**.
6. Choose **Custom Button** from the options.
7. Fill out the fields as follows:
   - **Title**: `Payment button`
   - **Button Type**: `Custom button`
   - **Button Label**: `Add to wallet`
   - **Button Theme**: `Razorpay Outline`
8. Click **Next**.
9. Click **Add Amount Field**, then select `Customers Decide Amount` from the dropdown.
10. Set the **Field Label** as: `Enter the amount`, and click **Save**. Then click **Next**.
11. Click **Add Another Input Field**, set the **Field Label** as: `Username`, then click **Next**.
12. Click on **Create Button**.
13. Once the button is created, click **Copy Code** to copy the generated HTML snippet.
14. Paste this code snippet into the relevant HTML file of your project.

---

### Installing ngrok on Ubuntu
Follow these steps to install ngrok on a new Ubuntu system:
1. Open a terminal window.
2. Download the ngrok ZIP archive:
    ```bash
    wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip
    ```
3. Unzip the downloaded file:
    ```bash
    unzip ngrok-stable-linux-amd64.zip
    ```
4. Move the `ngrok` binary to a directory in your system `PATH`:
    ```bash
    sudo mv ngrok /usr/local/bin
    ```
5. Verify installation:
    ```bash
    ngrok version
    ```
6. Authenticate your ngrok installation:
    - Go to [https://dashboard.ngrok.com/get-started/setup](https://dashboard.ngrok.com/get-started/setup)
    - Sign up or log in to get your auth token
    - Run the following command with your token:
    ```bash
    ngrok config add-authtoken <YOUR_AUTH_TOKEN>
    ```
7. Start ngrok using the following command:
    ```bash
    ngrok http <BACKEND_PORT>
    ```
8. You will get a public url which exposes your backend to the public url. Copy the url and go back to the Razorpay dashboard.
9. Click on Developers section at the end of the left sidebar. Click on Webhooks section. Click on `Add New Webhook` button at the top right.
10. The details are as follows
    - Enter the following URL in the Webhook URL field
    ```
    <public-url>/razorpay-webhook
    ```
    - Paste `abcdefghijkl` in the Secret field.
    - Select `payment.captured` from Active Events.
    - Click on Create Webhook.
 The setup for the `Add to wallet` button is now complete.


















## ⚙️ Customer Side – Local Installation Guide (Node.js Based)

Follow these steps to run the **customer portal** of the Canteen Management App locally using **Node.js**.

---

### 🧩 Prerequisites

Ensure you have the following installed on your system:

- ✅ [Node.js](https://nodejs.org/) (v16+ recommended)
- ✅ npm (comes with Node.js)

---

### 📦 Folder Structure

```
Customer_Site/
├── frontend/     # Frontend (likely React or Vanilla)
├── backend/      # Backend (Express APIs)
└── README.md
```

---

### 🚀 Installation Steps

#### 🔹 Step 1: Clone the Repo

If you're using Git:

```bash
git clone <your-repo-url>
cd Customer_Site
```

Or just unzip the project and move into the folder:

```bash
cd Customer_Site
```

---

#### 🔹 Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

> This installs all required packages for the backend server.

---

#### 🔹 Step 3: Start the Backend Server

```bash
node server.js
```

> By default, this starts your backend server at `http://localhost:4000/`.  
> Make sure `.env` file is configured correctly (e.g., DB URI, Razorpay keys, etc.).

---

#### 🔹 Step 4: Install Frontend Dependencies

Open a **new terminal tab/window**, then:

```bash
cd frontend
npm install
```

> This installs all frontend dependencies (React or Vanilla JS-based UI).

---

#### 🔹 Step 5: Start the Frontend

```bash
npm run build
npm start
```

> This should launch the frontend in your default browser at `http://localhost:3000/`.

---

### 🧪 Final Test

- Make sure both servers (frontend + backend) are running.
- Visit [http://localhost:3000](http://localhost:3000) to use the Customer Portal.

---

### 🔧 Troubleshooting

| Issue                       | Solution                                                        |
|----------------------------|-----------------------------------------------------------------|
| `npm: command not found`   | Install Node.js and npm properly from [nodejs.org](https://nodejs.org/) |
| Port already in use        | Change the port in `backend/index.js` or `frontend/.env`        |
| API not connecting         | Check proxy setup or CORS config between frontend and backend   |

---

## ⚙️ Customer Side – Database Setup Guide

This guide explains how to create the required database tables and sequences for the Food Ordering & Reservation System.

---

## Prerequisites

- PostgreSQL installed (Recommended version 13+)
- Access to `psql` terminal or any PostgreSQL client (like DBeaver or pgAdmin)

---

## Steps to Setup Database

### 1. Making the Database
```bash
initdb -D <directory_name>
```

NOTE: After running this command, you will be promted with a log specifying the username of the owner of all the files of the database. Use this username while logging in via psql.

### 2. Starting the Database
```bash
pg_ctl -D <directory_name> start
```

### 3. Logging into Database
```bash
psql -U <user_name> -d postgres
```

### 4. Creating Tables
<!-- Set default values for all attributes -->

```sql
CREATE TABLE canteens (
  canteen_id SERIAL PRIMARY KEY,
  username VARCHAR(20),
  name VARCHAR(30),
  password VARCHAR(60),
  opening_time TIME,
  closing_time TIME,
  opening_status BOOLEAN,
  menu INTEGER[],
  auto_accept BOOLEAN,
  order_queue INTEGER[],
  reservation_queue INTEGER[],
  tables INTEGER[],
  rating REAL,
  active BOOLEAN,
  date_formed DATE,
  email VARCHAR(100),
  phone_number VARCHAR(10),
  img_url VARCHAR(500),
  favourites_list INTEGER[],
  address VARCHAR(100),
  earnings INTEGER
);

CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  username VARCHAR(20),
  password VARCHAR(60),
  name VARCHAR(30),
  phone_number VARCHAR(10),
  email VARCHAR(100),
  wallet_balance INTEGER,
  cart_id INTEGER,
  favourites INTEGER[],
  img_url VARCHAR(500),
  address VARCHAR(200)
);

CREATE TABLE dishes (
  dish_id SERIAL PRIMARY KEY,
  canteen_id INTEGER,
  price REAL,
  discount INTEGER,
  rating REAL,
  order_count INTEGER,
  dish_name VARCHAR(60),
  dish_tag VARCHAR(30),
  is_veg BOOLEAN,
  img_url VARCHAR(500),
  dish_category VARCHAR(20)
);

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  canteen_id INTEGER,
  status INTEGER,
  payment_id VARCHAR(100),
  coupon_id INTEGER,
  bill_amount REAL,
  discount_amount REAL,
  final_amount REAL,
  time TIMESTAMP,
  is_delivery BOOLEAN,
  dish_map JSONB,
  delivery_address VARCHAR(50),
  is_active BOOLEAN,
  dish_category VARCHAR(20)
);

CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  canteen_id INTEGER,
  request_time TIMESTAMP,
  reservation_time TIMESTAMP,
  num_people INTEGER,
  status INTEGER,
  reservation_amount REAL,
  additional_requests VARCHAR(50)
);

CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  order_id INTEGER,
  customer_id INTEGER,
  time TIMESTAMP,
  amount REAL
);

CREATE TABLE coupons (
  coupon_id SERIAL PRIMARY KEY,
  coupon_code VARCHAR(8),
  canteen_id INTEGER,
  discount_value REAL,
  min_order_value REAL,
  usage_limit INTEGER,
  valid_until DATE
);

CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  dish_id INTEGER,
  comment VARCHAR(300)
);
```
### 3. Verifying Tables

```
    \dt
```

NOTE : note the username that was used for logging into psql. Then go to the index.js file in the backend directory of both Customer_Side and Canteen_Side, and then change the line number 9 to look like the following:

```javascript
user : '<username_stored>' || process.env.DB_USER
```

