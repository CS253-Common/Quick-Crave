const db = require('../db/index.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    try {
        // console.log("Main aagaya");
        
        if (!password) {
            throw new Error("Password is undefined or empty");
        }

        const fixedSalt = "$2b$10$abcdefghijklmnopqrstuv"; // Ye fix rakh
        return await bcrypt.hash(password, fixedSalt);
    } catch (error) {
        console.error("Hashing error:", error.message);
        throw error;  // Re-throw kar diya taaki caller function bhi error handle kare
    }
}


// ORDER QUEUE PAGE
exports.orderQueue = async (req, res) => {
    // console.log('from canteen_controller')
    //console.log(req);

    const canteen_id = req.canteen_id;
    console.log(canteen_id);
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
JOIN LATERAL jsonb_each(o.dish_map) AS dish_kv(dish_id_str, value) ON TRUE
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
`, [canteen_id]);
        console.log('bkc',orders.rows);
        return res.status(200).json({ message: 'Order Queue Sent', orders: orders.rows });

    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.acceptOrder = async (req, res) => {
    const { order_id } = req.body;
    try {
        await db.query(`UPDATE orders SET status = 2 WHERE order_id = $1;`, [order_id]);
        return res.status(200).json({ message: 'Order Accepted' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.rejectOrder = async (req, res) => {
    const { order_id } = req.body;
    try {
        await db.query(`UPDATE orders SET status = 0 WHERE order_id = $1;`, [order_id]);
        return res.status(200).json({ message: 'Order Rejected' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.readyOrder = async (req, res) => {
    const { order_id } = req.body;
    try {
        await db.query(`UPDATE orders SET status = 4 WHERE order_id = $1;`, [order_id]);
        return res.status(200).json({ message: 'Order Completed' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// RESERVATION QUEUE
exports.reservationQueue = async (req, res) => {
    const canteen_id = req.canteen_id;


    try {
        const reservations = await db.query(`
      SELECT 
    r.reservation_id,
    c.img_url AS customer_image_url,
    c.name AS customer_name,
    r.num_people,
    r.reservation_time AS date_of_reservation,
    r.additional_request,
    r.reservation_amount AS booking_amount,
    r.status,
    r.payment_id
FROM 
    reservations r
JOIN 
    customers c ON r.customer_id = c.customer_id
WHERE 
    r.request_time >= NOW() - INTERVAL '7 days'
    AND r.canteen_id = $1;`
            , [canteen_id]);


        return res.status(200).json({ message: 'Reservation Queue Sent', reservations: reservations.rows });

    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.acceptReservation = async (req, res) => {
    const { reservation_id } = req.body;
    try {
        await db.query(`UPDATE reservations SET status = 2 WHERE reservation_id = $1;`, [reservation_id]);
        return res.status(200).json({ message: 'Reservation Accepted' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.rejectReservation = async (req, res) => {
    const { reservation_id } = req.body;
    try {
        await db.query(`UPDATE reservations SET status = 0 WHERE reservation_id = $1;`, [reservation_id]);
        return res.status(200).json({ message: 'Reservation Rejected' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getMenuItems = async (req, res) => {
    const canteen_id = req.canteen_id;

    try {
        const response = await db.query('SELECT * FROM DISHES WHERE canteen_id = $1;', [canteen_id]);
        return res.status(200).json({ message: 'Menu sent', menu: response.rows });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

};

exports.createCoupon = async (req, res) => {
    const coupon = req.body;
    const canteen_id = req.canteen_id;
    try {
        const response = await db.query(`SELECT * FROM coupons WHERE coupon_code = $1;`, [coupon.code])
        if (response.rows.length === 0) {
            await db.query(`
                INSERT INTO coupons(coupon_code, canteen_id, discount_value, min_order_value, usage_limit, valid_until)
                VALUES
                ($1,$2,$3,$4,$5,$6);
                `, [coupon.code, canteen_id, coupon.value, coupon.min_order_value, coupon.usage_limit, coupon.valid_until])
            return res.status(200).json({ message: 'Coupon Created Successfully' })
        }
        else {
            return res.status(409).json({ message: 'Coupon Code Already Exists' })
        }
    }
    catch (err) {
        // console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.createDiscounts = async (req, res) => {
    const discountData = req.body;
    try {
        db.query(`
            UPDATE dishes
            SET discount =  $1
            WHERE dish_id = ANY($2::int[]);
            `, [discountData.discount_amount, discountData.menu_items]);
        return res.status(200).json({ message: 'Discounts Updated Successfully' })
    }
    catch (err) {
        return rec.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getActiveDiscounts = async (req, res) => {
    const canteen_id = req.canteen_id;

    try {
        const response = await db.query(`SELECT * FROM dishes WHERE canteen_id = $1 AND discount > 0;`, [canteen_id]);
        // console.log(response.rows.length);
        // console.log("sdgsgs")
        // console.log(canteen_id)
        // console.log(req);
        return res.status(200).json({ message: 'Active Discounts Sent', discounts: response.rows});

    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getActiveCoupons = async (req, res) => {
    const canteen_id = req.canteen_id;

    try {
        const response = await db.query(`
            SELECT
            coupon_id AS id,
            coupon_code AS code,
            discount_value AS value,
            min_order_value,
            usage_limit,
            valid_until
            FROM coupons WHERE canteen_id = $1
            AND valid_until > NOW()::DATE 
            AND usage_limit > 0;
            `, [canteen_id]);
        return res.status(200).json({ message: 'Active Coupons Sent', coupons: response.rows });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteCoupon = async (req, res) => {
    const  response  = req.body;
    try {
        await db.query(`UPDATE coupons SET usage_limit = 0 WHERE coupon_id = $1;`, [response.couponId]);
        return res.status(200).json({ message: 'Coupon Deleted' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteDiscount = async (req, res) => {
    const  response  = req.body;
    try {
        await db.query(`
            UPDATE dishes 
            SET discount = 0
            WHERE dish_id = $1;`, [response.dishId]);
        return res.status(200).json({ message: 'Discount Deleted' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getTrendingPicks = async (req, res) => {
    const canteen_id = req.canteen_id;
    try {
        const response = await db.query(`
            SELECT d.dish_name, t.dish_id, t.total_quantity, d.img_url
            FROM (
    SELECT key AS dish_id, SUM(value::int) AS total_quantity
    FROM orders, jsonb_each_text(dishes)
    WHERE canteen_id = $1
      AND time >= NOW() - INTERVAL '7 days'
    GROUP BY key
    ORDER BY total_quantity DESC
    LIMIT 5
) AS t
JOIN dishes d ON d.dish_id = t.dish_id::int;
            `, [canteen_id]);

        return res.status(200).json({ message: 'Trending Picks Sent', trending_picks: response.rows });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getHomeOrderQueue = async (req, res) => {
    const canteen_id = req.canteen_id;
    try {
        const response = await db.query(`
        SELECT
          SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS total_status_1_orders,
          SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS total_status_2_orders,
          SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS total_status_3_orders
        FROM orders
        WHERE canteen_id = $1
          AND time >= NOW() - INTERVAL '24 hours';
      `, [canteen_id]);

        const row = response.rows[0];
        const status1 = Number(row.total_status_1_orders) || 0;
        const status2 = Number(row.total_status_2_orders) || 0;
        const status3 = Number(row.total_status_3_orders) || 0;

        const ordersInQueue = status1 + status2 + status3;

        return res.status(200).json({
            message: 'Order Queue Data Sent',
            orders_in_queue: ordersInQueue,
            pending_orders: status1
        });

    } catch (err) {
        // console.error(err); // log the actual error for debugging
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getHomeReservationQueue = async (req, res) => {
    const canteen_id = req.canteen_id;
    try {
        const response = await db.query(`
        SELECT
          SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS total_status_1_reservations,
          SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS total_status_2_reservations,
          SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS total_status_3_reservations
        FROM reservations
        WHERE canteen_id = $1
          AND request_time >= NOW() - INTERVAL '7 days';
      `, [canteen_id]);

        const row = response.rows[0];
        const status1 = Number(row.total_status_1_reservations) || 0;
        const status2 = Number(row.total_status_2_reservations) || 0;
        const status3 = Number(row.total_status_3_reservations) || 0;

        const PendingReservations = status1 + status2;

        return res.status(200).json({
            message: 'Reservation Queue Data Sent',
            confirmed_reservations: status3,
            pending_reservations: PendingReservations
        });

    } catch (err) {
        // console.error(err); // log the actual error for debugging
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getHomeDiscountNCoupons = async (req, res) => {
    const canteen_id = req.canteen_id;
    try {
        const response_1 = await db.query(`
        SELECT COUNT(*) AS active_coupons
        FROM coupons
        WHERE canteen_id = $1 AND usage_limit >0 AND valid_until > NOW();`, [canteen_id]);

        const response_2 = await db.query(`
        SELECT COUNT(*) AS active_discounts
        FROM dishes
        WHERE canteen_id = $1 AND discount > 0;`, [canteen_id]);

        return res.status(200).json({
            message: 'Active Discount and Coupon Data Sent',
            active_discounts: response_2.rows[0].active_discounts,
            active_coupons: response_1.rows[0].active_coupons
        });

    } catch (err) {
        // console.error(err); // log the actual error for debugging
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



exports.getProfileInfo = async (req, res) => {
    const canteen_id = req.canteen_id;
    try {
        const response = await db.query(`
            SELECT 
            username, 
            name,
            phone_number, 
            img_url, 
            email, 
            date_formed, 
            opening_time, 
            closing_time, 
            auto_accept, 
            rating,
            address,
            opening_status
            FROM canteens
            WHERE canteen_id = $1;`, [canteen_id]);
            const object = response.rows[0];
            object.role = "Canteen Manager";
        return res.status(200).json({ message: 'Profile Information Sent', profile: object });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.editProfileInfo = async (req, res) => {
    const canteen = req.body;
    const canteen_id = req.canteen_id;
    try {
        const response = await db.query(`
            UPDATE 
            canteens
            SET 
            name = $2,
            opening_time = $3,
            closing_time = $4,
            opening_status = $5,
            auto_accept = $6,
            address = $7,
            img_url = $8
            WHERE canteen_id = $1;`, [canteen_id, canteen.name, canteen.opening_time, canteen.closing_time, canteen.opening_status, canteen.auto_accept,canteen.address, canteen.img_url]);

    if(!(canteen.username === undefined || canteen.username.length === 0)){
        const temp = await db.query(`
            SELECT * FROM canteens WHERE username = $1; 
            `, [canteen.username]);

        if (temp.rows.length === 0) {
            const res2 = await db.query(`
                UPDATE canteens
                SET username = $2 WHERE canteen_id = $1;
                `, [canteen_id, canteen.username]);
            return res.status(200).json({ message: 'Profile Information Sent' });
        }
        else {
            return res.status[201].json({ message: 'Username already exists. Other changes updated' });
        }
    }
    return res.status(200).json({ message: 'Profile Information Sent' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.editPassword = async (req, res) => {
    const canteen_id = req.canteen_id;

    try{
        
        const hashed_current_password = await hashPassword(req.body.current_password);
        const hashed_new_password = await hashPassword(req.body.new_password);
        const response_1 = await db.query(`
            SELECT password FROM canteens WHERE canteen_id = $1;
            `,[canteen_id]);

            if(response_1.rows[0].password !== hashed_current_password){
                return res.status(409).json({message:'Old password does not match. Password is not updated'});
            }


        const response_2 = await db.query(`
        UPDATE canteens
        SET 
        password = $2 WHERE canteen_id = $1;`, [canteen_id, hashed_new_password]
        );
        return res.status(200).json({ message: 'Password Edited Successfully' });

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
        
    }
}

exports.editDish = async (req, res) => {
    const temp = req.body;
    try{
        const response = await db.query(`
        UPDATE dishes
        SET 
        price = $1,
        is_veg = $2,
        dish_name = $3,
        dish_tag = $4,
        img_url = $5,
        dish_category = $6
        WHERE dish_id = $7;`,
         [temp.price, temp.is_veg, temp.dish_name, temp.dish_tag, temp.img_url, temp.dish_category, temp.dish_id]
        );
        return res.status(200).json({ message: 'Dish Details Edited Successfully' });

    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
        
    }
}

exports.addDish = async (req, res) => {
    console.log("Dish details received")
    const temp = req.body;
    const canteen_id = req.canteen_id;
    try{
        const response = await db.query(`
        INSERT INTO dishes(
    canteen_id,
    price,
    discount,
    rating,
    order_count,
    is_veg,
    dish_name,
    dish_tag,
    img_url,
    dish_category
    )
    VALUES (
    $1,
    $2,
    $3,
    0,
    0,
    $4,
    $5,
    $6,
    $7,
    $8
    )
    RETURNING dish_id;
`,[canteen_id, temp.price, temp.discount, temp.is_veg, temp.name, temp.dish_tag, temp.img_url, temp.dish_category]);
        
    await db.query(`
        UPDATE canteens
        SET menu = array_append(menu,$2)
        WHERE canteen_id = $1;
        `,[canteen_id,response.rows[0].dish_id]);
        return res.status(200).json({ message: 'Dish Added Successfully' });

    }
    catch (err) {
        // console.log(err);
        console.error("Error in addDish:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
        
    }
}

// delete dish item
exports.deleteDish = async (req, res) => {
    const temp = req.body;
    try{
        const response = await db.query(`
        UPDATE dishes
        SET 
        is_active = false
        WHERE dish_id = $1;`,
         [temp.dish_id]
        );
        return res.status(200).json({ message: 'Dish Deleted Successfully' });

    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getStatistics = async(req,res) => {
    const canteen_id = req.canteen_id;

    try{
        const response_1 = await db.query(`
            SELECT 
            COALESCE(SUM(final_amount), 0) AS total_sales,
            COUNT(*) AS total_orders,
            COALESCE(AVG(final_amount), 0) AS avg_order_value,
            COUNT(DISTINCT customer_id) AS total_customers
            FROM orders
            WHERE time >= NOW() - INTERVAL '30 days'
            AND canteen_id = $1
            AND status = '4';`,[canteen_id]);

        const response_2 = await db.query(`
            SELECT 
            COALESCE(SUM(final_amount), 0) AS total_sales,
            COUNT(*) AS total_orders,
            COALESCE(AVG(final_amount), 0) AS avg_order_value,
            COUNT(DISTINCT customer_id) AS total_customers
            FROM orders
            WHERE time >= NOW() - INTERVAL '60 days'
            AND time < NOW() - INTERVAL '30 days'
            AND canteen_id = $1
            AND status = '4';`,[canteen_id]);

        const row_1 = response_1.rows[0];
        const row_2 = response_2.rows[0];

        const delta = {
            sales : row_1.total_sales -  row_2.total_sales,
            order : row_1.total_orders - row_2.total_orders,
            avg_order_value : row_1.avg_order_value - row_2.avg_order_value,
            customers : row_1.total_customers - row_2.total_customers
        };

        return res.status(200).json({message:'Statistics Sent', curr_month:row_1, delta:delta});

    }
    catch(err){
        return res.status(500).json({ message: 'Internal Server Error' });

    }
}

exports.getGraphs = async(req,res) => {
    const canteen_id = req.canteen_id;
    try{
        const [response_1, response_2] = await Promise.all([
            db.query(`
                WITH day_intervals AS (
                SELECT 
                generate_series(
                NOW() - INTERVAL '29 days', 
                NOW(), 
                INTERVAL '1 day'
                )::DATE AS order_date)
                SELECT 
                di.order_date,
                COALESCE(SUM(o.final_amount), 0) AS total_sales,
                COUNT(o.order_id) AS total_orders,
                COALESCE(AVG(o.final_amount), 0) AS avg_order_value,
                COUNT(DISTINCT o.customer_id) AS total_customers
                FROM day_intervals di
                LEFT JOIN orders o 
                ON DATE(o.time) = di.order_date
                AND o.canteen_id = $1
                AND o.status = '4'
                GROUP BY di.order_date
                ORDER BY di.order_date;`,[canteen_id]),
            db.query(`
                WITH month_intervals AS (
                SELECT 
                generate_series(1, 12) AS month_num, 
                NOW() - INTERVAL '30 days' * generate_series(1, 12) AS start_date, 
                NOW() - INTERVAL '30 days' * (generate_series(1, 12) - 1) AS end_date)
                SELECT 
                mi.month_num,
                COALESCE(SUM(o.final_amount), 0) AS total_sales,
                COUNT(o.order_id) AS total_orders
                FROM month_intervals mi
                LEFT JOIN orders o 
                ON o.time >= mi.start_date 
                AND o.time < mi.end_date
                AND o.canteen_id = $1
                AND o.status = '4'
                GROUP BY mi.month_num
                ORDER BY mi.month_num;`,[canteen_id])]);
                // console.log('back:', response_1.monthly);
    return res.status(200).json({message:'Graph Data Sent',monthly:response_1.rows, yearly:response_2.rows});
    }
    catch(err){
        return res.status(500).json({ message: 'Internal Server Error' });
    }

};