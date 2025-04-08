const db = require('../db/index.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// ORDER QUEUE PAGE
exports.orderQueue = async (req, res) => {
    const { canteen_id } = req.body;


    try {
        const orders = await db.query(`
  SELECT 
  o.order_id,
  o.canteen_id,
  o.status,
  o.payment_id,
  o.coupon_id,
  o.bill_amount,
  o.discount_amount,
  o.final_amount,
  o.time,
  o.is_delivery,
  c.name AS customer_name,
  c.address AS customer_address,
  c.img_url AS customer_image,

  json_agg(
    json_build_object(
      'dish_name', d.dish_name,
      'quantity', (dish_kv.value)::int
    )
  ) AS dishes
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN LATERAL jsonb_each(o.dishes) AS dish_kv(dish_id_str, value) ON TRUE
JOIN dishes d ON dish_kv.dish_id_str::int = d.dish_id
WHERE o.canteen_id = $1
  AND o.time >= NOW() - INTERVAL '24 hours'
GROUP BY 
  o.order_id,
  o.canteen_id,
  o.status,
  o.payment_id,
  o.coupon_id,
  o.bill_amount,
  o.discount_amount,
  o.final_amount,
  o.time,
  o.is_delivery,
  c.name,
  c.address,
  c.img_url;
`,
 [canteen_id]);

        res.status(200).json({ message: 'Order Queue Sent', orders: orders.rows });

    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.acceptOrder = async (req, res) => {
    const { order_id } = req.body;
    try {
        await db.query(`UPDATE orders SET status = 2 WHERE order_id = $1`, [order_id]);
        res.status(200).json({ message: 'Order Accepted' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.rejectOrder = async (req, res) => {
    const { order_id } = req.body;
    try {
        await db.query(`UPDATE orders SET status = 0 WHERE order_id = $1`, [order_id]);
        res.status(200).json({ message: 'Order Rejected' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.readyOrder = async (req, res) => {
    const { order_id } = req.body;
    try {
        await db.query(`UPDATE orders SET status = 4 WHERE order_id = $1`, [order_id]);
        res.status(200).json({ message: 'Order Completed' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// RESERVATION QUEUE
exports.reservationQueue = async (req, res) => {
    const { canteen_id } = req.body;


    try{
        const reservations = await db.query(`
      SELECT r.reservation_id, r.canteen_id, r.status, r.payment_id, r.reservation_amount, r.request_time, r.reservation_time, r.num_people, c.name AS customer_name, c.image_url AS image_url
      FROM reservations r
      JOIN customers c ON r.customer_id = c.customer_id
      WHERE r.canteen_id = $1
      AND r.time >= NOW() - INTERVAL '7 days';`
    ,[canteen_id]);


        res.status(200).json({ message: 'Reservation Queue Sent', reservations: reservations.rows });

    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.acceptReservation = async (req, res) => {
    const { reservation_id } = req.body;
    try {
        await db.query(`UPDATE reservations SET status = 2 WHERE reservation_id = $1`, [reservation_id]);
        res.status(200).json({ message: 'Reservation Accepted' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.rejectReservation = async (req, res) => {
    const { reservation_id } = req.body;
    try {
        await db.query(`UPDATE reservations SET status = 0 WHERE reservation_id = $1`, [reservation_id]);
        res.status(200).json({ message: 'Reservation Rejected' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

