const jwt = require('jsonwebtoken');
const db = require('../db'); // Ensure your database connection is correctly imported
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require("crypto");

exports.managePayment = async (req, res) => {
    const secret = "abcdefghijkl"; // Razorpay webhook secret
    const signature = req.headers["x-razorpay-signature"];
  
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");
  
    if (expectedSignature !== signature) {
      //.error("❌ Invalid Razorpay Webhook Signature");
      return res.status(400).json({ error: "Invalid signature" });
    }
  
    //.log("✅ Razorpay Webhook Verified");
  
    try {
      const jsonData = JSON.parse(req.body.toString());
      const event = jsonData.event;
      const payment = jsonData.payload.payment.entity;
      const { email, phone, username } = payment.notes;
      let amount = payment.amount / 100;
  
      //.log("📦 Event:", event);
      //.log("💳 Payment Payload:", payment);
  
      // Check if user exists and details match
      const query = `
        SELECT customer_id, wallet_balance 
        FROM customers 
        WHERE username = $1 AND email = $2 AND phone_number = $3
      `;
      const values = [username, email, phone];
      const result = await db.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found or mismatch in details" });
      }
  
      const { customer_id, wallet_balance } = result.rows[0];
  
      // Update wallet_balance directly
      const updateQuery = `
        UPDATE customers 
        SET wallet_balance = wallet_balance + $1 
        WHERE customer_id = $2
      `;
      await db.query(updateQuery, [amount, customer_id]);
  
      //.log(`💰 ₹${amount} added to ${username}'s wallet`);

    //   await db.query(`
    //   INSERT transactions(order_id,customer_id,time,amount)
    //   VALUES
    //   ($1,$2,NOW(),$3);
    //   `,[0,customer_id,amount]);

    await db.query(`
        INSERT INTO transactions(order_id, customer_id, time, amount)
        VALUES ($1, $2, NOW(), $3);
        `, [0, customer_id, amount]);

  
      return res.status(200).json({ status: "success" });
    } catch (e) {
      //.error("⚠️ Failed to handle Razorpay webhook:", e.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  