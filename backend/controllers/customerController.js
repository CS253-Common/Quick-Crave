const db = require('../db/index.js');
const jwt = require('jsonwebtoken') ;
// const db = require('../db'); 

// exports.searchDish() = async (req,res) => {
//     // implement it 

//     const dishNameToSearch = req.body ; 
    
//     const dish = await db.query(`SELECT * FROM customers WHERE username % $1 ORDER BY similarity(username,$1) LIMIT 5;`,[dishNameToSearch])
    
//     if(dish.rows[0].length === 0){
//         return res.status(401).json({message: "No results found!"}) ; 
//     }
//     else{
        
//     }
// }

exports.searchCanteen = async (req, res) => {
    try {
        let { canteenNameToSearch } = req.body;

        // Validate input
        if (!canteenNameToSearch || typeof canteenNameToSearch !== "string") {
            return res.status(400).json({ error: "Invalid canteen name." });
        }

        canteenNameToSearch = canteenNameToSearch.trim(); // Remove extra spaces

        // PostgreSQL query with case-insensitive search
        const query = `
            SELECT 
                c.canteen_id,
                c.name AS canteen_name,
                c.opening_time,
                c.closing_time,
                levenshtein(lower(c.name), lower($1)) AS edit_distance
            FROM canteens c
            WHERE c.name % $1  -- Trigram filtering for fuzzy matches
            ORDER BY edit_distance ASC  -- Prioritize closest matches
            LIMIT 5;
        `;

        const values = [`%${canteenNameToSearch}%`]; // Allow partial matches

        const { rows } = await db.query(query, values);

        // Check if results exist
        if (rows.length === 0) {
            return res.status(404).json({ error: "No matching canteen found." });
        }

        return res.status(200).json({ success: true, data: rows });
    } 
    catch (error) {
        console.error("Error searching canteen:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


exports.searchDish = async (req, res) => {
    try {
        let { dishNameToSearch } = req.body;

        // Validate input
        if (!dishNameToSearch || typeof dishNameToSearch !== "string") {
            return res.status(400).json({ error: "Invalid dish name." });
        }

        dishNameToSearch = dishNameToSearch.trim(); // Remove extra spaces

        // Query using Levenshtein distance for best matching results
        const query = `
            SELECT 
                d.dish_name, 
                d.img_url, 
                d.rating, 
                d.is_veg, 
                d.price, 
                c.name AS canteen_name,
                levenshtein(lower(d.dish_name), lower($1)) AS edit_distance
            FROM dishes d
            JOIN canteens c ON d.canteen_id = c.canteen_id
            WHERE d.dish_name % $1 -- Trigram filtering for speed
            ORDER BY edit_distance ASC  -- Closest match first
            LIMIT 5;
        `;

        const values = [dishNameToSearch];

        const { rows } = await db.query(query, values);

        return res.status(200).json({ success: true, data: rows });
    } 
    catch (error) {
        console.error("Error searching dish:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.fetchReservations = async (req, res) => {
    try {
        const { customer_id } = req.body;

        if (!customer_id) {
            return res.status(400).json({ message: "Customer ID is required" });
        }

        // Query to fetch reservations for the customer
        const query = `
            SELECT r.reservation_id, r.status, c.name, r.reservation_time AS time, r.num_people
            FROM reservations r
            JOIN canteens c ON r.canteen_id = c.canteen_id
            WHERE r.customer_id = $1;
        `;

        const { rows } = await db.query(query, [customer_id]);

        return res.status(200).json({ reservations: rows });
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        });
    }
};

exports.viewCart = async(req,res) => {
    try {
        const userData = extractUserData(req);
        const customer_id = userData.data.customer_id;
        const userType = userData.data.userType;

        if (userType !== "customer") {
            return res.status(401).json({
                message: "Access denied!"
            });
        }

        

        // Query to fetch reservations for the customer

        const query1=`
            SELECT cart_id FROM customers WHERE customer_id = $1;
        `
        const cart_id = await db.query(query1,[customer_id]);


        const query = `
            SELECT r.reservation_id, r.status, c.canteen_name, r.reservation_time AS time, r.num_people
            FROM reservations r
            JOIN canteens c ON r.canteen_id = c.canteen_id
            WHERE r.customer_id = $1;
        `

        const { rows } = await db.query(query, [customer_id]);

        return res.status(200).json({ reservations: rows });
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        });
    }
}

exports.addDishToCart = async (req, res) => {
    try {
        const customer_id = req.body.customer_id;
        const dish_id = req.body.dish_id;

        // Fetch existing cart_id
        const cart_id_query = `SELECT cart_id FROM customers WHERE customer_id = $1;`;
        const cart_id_result = await db.query(cart_id_query, [customer_id]);

        // Fetch dish details (canteen_id & price)
        const canteen_id_query = `SELECT canteen_id, price FROM dishes WHERE dish_id = $1;`;
        const dish_result = await db.query(canteen_id_query, [dish_id]);

        if (dish_result.rows.length === 0) {
            return res.status(404).json({ message: "Dish not found" });
        }

        const { canteen_id, price } = dish_result.rows[0];

        
        if (cart_id_result.rows.length === 0 || cart_id_result.rows[0].cart_id === 0) {
            // No existing cart -> Create a new order
            const dish_map = JSON.stringify({ [dish_id]: 1 }); // New dish map with quantity 1
            const new_cart_query = `
            INSERT INTO orders (customer_id, canteen_id, status, payment_id, coupon_id, bill_amount, discount_amount, final_amount, time, is_delivery, dish_map)
            VALUES ($1, $2, 0, '', NULL, $3, 0, $3, NOW(), false, $4::jsonb)
            RETURNING order_id, dish_map, final_amount;
            `;
            const new_cart_result = await db.query(new_cart_query, [customer_id, canteen_id, price, dish_map]);
            
            const add_cart_id_query = `UPDATE customers SET cart_id = $2 WHERE customer_id = $1;`;

            await db.query(add_cart_id_query, [customer_id, new_cart_result.rows[0].order_id]);

            return res.status(201).json({ 
                message: "New cart created", 
                // order_id: new_cart_result.rows[0].order_id, 
                cart: new_cart_result.rows[0] ,
                success:true
            });
        } else {
            // Existing cart -> Update dish_map
            const cart_id = cart_id_result.rows[0].cart_id;

            const cur_canteen_query = `SELECT canteen_id FROM orders WHERE order_id = $1;`;
            // console.log(cur_canteen_query) ; 
            const result = await db.query(cur_canteen_query, [cart_id]);
            // console.log(result) ; 
            
            if(canteen_id !== result.rows[0].canteen_id){
                return res.status(401).json({
                    message:'The current canteen of the customer is different from the canteen of the dish selected.',
                    success:false
                })
            }

            const update_dish_map_query = `
                UPDATE orders 
                SET dish_map = dish_map || jsonb_build_object($2::text, (COALESCE(dish_map->>$2, '0')::int + 1)), 
                    final_amount = final_amount + $3
                WHERE order_id = $1
                RETURNING dish_map, final_amount;
            `;
            const updated_cart = await db.query(update_dish_map_query, [cart_id, dish_id, price]);

            return res.status(200).json({ 
                message: "Dish added to existing cart", 
                cart: updated_cart.rows[0],
                success:true
            });
        }
    } catch (error) {
        console.error("Error adding dish to cart:", error);
        return res.status(500).json({ message: "Internal server error", success: false});
    }
};

exports.viewOrderHistory = async(req,res) => {
    try {
        const { customer_id } = req.body;
        
        const orders_query = `SELECT * FROM orders WHERE customer_id = $1 ORDER BY time ASC;`;
        const result = await db.query(orders_query, [customer_id]);

        return res.status(200).json({
            message: "Got the results.",
            data: result.rows,
            success: true,
        })
    } catch (error) {

        return res.status(401).json({
            message:"Error detected",
            success:false,
        })
    }
}

exports.addFavourites = async (req, res) => {
    try {
        const { customer_id, dish_id } = req.body;

        const dish_check_query = `SELECT dish_name FROM dishes WHERE dish_id = $1;`;

        const doesDishExist = await db.query(dish_check_query,[dish_id]);

        if(!doesDishExist.rows[0]){
            return res.status(400).json({error: "Dish does not exist"});
        }

        // console.log(doesDishExist.rows[0]);

        if (!customer_id || !dish_id) {
            return res.status(400).json({ error: "Customer ID and Dish ID are required" ,success: false});
        }

        const query = `
            UPDATE customers
            SET favourites = array_append(favourites, $2)
            WHERE customer_id = $1;
        `;

        await db.query(query, [customer_id, dish_id]);

        return res.json({ message: "Dish added to favorites successfully" ,success: true});
    } catch (error) {
        console.error("Error adding favorite dish:", error);
        return res.status(500).json({ error: "Internal Server Error" ,success: false});
    }
};


exports.viewFavourites = async (req, res) => {
    try {
        const { customer_id } = req.body;

        if (!customer_id) {
            return res.status(400).json({ error: "Customer ID is required" ,success:false});
        }

        const query = `
            SELECT d.dish_name, d.rating, d.is_veg, d.img_url, d.price
            FROM dishes d
            INNER JOIN favorites f ON d.dish_id = f.dish_id
            WHERE f.customer_id = $1;
        `;

        const { rows } = await db.query(query, [customer_id]);

        return res.status(200).json({rows,success:true});
    } catch (error) {
        console.error("Error fetching customer favorites:", error);
        return res.status(500).json({ error: "Internal Server Error" ,success:false});
    }
};

// Customer Wallet
exports.viewWallet = async(req,res) => {
    try {
        const { customer_id } = req.body;
        const balance_query = `SELECT wallet_balance FROM customers WHERE customer_id = $1;`;
        const wallet_balance = await db.query(balance_query,[customer_id]);

        const transactions_query = `SELECT * FROM transactions WHERE customer_id = $1 ORDER BY time DESC;`;
        const data = await db.query(transactions_query,[customer_id]);
        
        // console.log(data);
        if(!data){
            return res.status(401).json({message:'Data is corrupted',success:false});
        }
        if(!data.rows || data.rows.length === 0){
            return res.status(200).json({message:'User has no transaction till now',success:true});
        }

        return res.status(200).json({
            message:'Data Acquired',
            data:data.rows,
            balance: wallet_balance,
            success:true
        });
    } catch (error) {
        return res.status(401).json({message:'Some error occured',success:false});
    }
}

// updateWallet
exports.updateWallet = async (req, res) => {
    try {
        const { customer_id, moneyToAdd } = req.body;

        // Check if customer exists
        const query = `SELECT * FROM customers WHERE customer_id = $1;`;
        const customer_query = await db.query(query, [customer_id]);

        if (!customer_query || customer_query.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found!",
                success: false
            });
        }

        // Update wallet balance
        const updateWalletQuery = `UPDATE customers SET wallet_balance = wallet_balance + $1 WHERE customer_id = $2 RETURNING wallet_balance;`;
        const updatedWallet = await db.query(updateWalletQuery, [moneyToAdd, customer_id]);

        // Insert a dummy order with order_id = 0
        const dummyOrderId = 0;

        // Insert into transactions table
        const transactionQuery = `
            INSERT INTO transactions (customer_id, order_id, time, amount)
            VALUES ($1, $2, NOW(), $3) RETURNING *;
        `;
        const transaction = await db.query(transactionQuery, [customer_id, dummyOrderId, moneyToAdd]);

        return res.status(200).json({
            message: "Wallet updated successfully!",
            success: true,
            wallet_balance: updatedWallet.rows[0].wallet_balance,
            transaction: transaction.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to add money to the wallet!",
            success: false
        });
    }
};

exports.addReservations = async (req,res) => {
    try {
        const {customer_id, canteen_id, num_people, reservation_time } = req.body;
        console.log(req.body) ; 
        console.log(customer_id, canteen_id, num_people, reservation_time );
        // const tmep =   ;
        
        if(!customer_id || !canteen_id || !num_people || !reservation_time || parseInt(num_people) <= 0 ){
            return res.status(401).json({
                message:'Data got corrupted in between',
                success:false
            });
        }
        
        console.log('Before query 1');

        const balance_query = `select wallet_balance from customers where customer_id = $1`;
        const wallet_balance = await db.query(balance_query,[customer_id]);

        const wallet_balance_value = wallet_balance.rows[0]?.wallet_balance || 0;
        if (wallet_balance_value < 10 * num_people) {
            return res.status(401).json({ message: "Insufficient balance", success: false });
        }

        console.log('Before query 2');

        const reservation_query = `INSERT INTO reservations (customer_id,canteen_id,request_time,reservation_time,num_people,status) VALUES ($1,$2, NOW(),$3,$4,1) returning reservation_id;`;
        const reservation_result = await db.query(reservation_query,[customer_id,canteen_id,reservation_time,num_people]) ; 
        
        const reservation_id = reservation_result.rows[0].reservation_id;
        
        if(!reservation_id){
            res.status(401).json({
                message:'Some error occurred',
                success:false
            });
        }

        console.log('Before query 3');

        // const deduct_from_wallet = await this.updateWallet({"customer_id" : customer_id, "moneyToAdd" : -10*num_people});
        const updateWalletQuery = `UPDATE customers SET wallet_balance = wallet_balance + $1 WHERE customer_id = $2 RETURNING wallet_balance;`;
        const updatedWallet = await db.query(updateWalletQuery, [-10*parseInt(num_people), customer_id]);

        const transaction_query = `INSERT INTO transactions (order_id , customer_id, time, amount) VALUES ($1,$2,NOW(),$3) returning transaction_id;`;
        const transaction_result = await db.query(transaction_query, [0,customer_id,10*num_people]);

        return res.status(200).json({
            message:'Everything done',
            transaction_id : transaction_result.rows[0].transaction_id,
            reservation_id: reservation_id,
            success:true
        });
    } catch (error) {
        return res.status(401).json({
            message:'Some error occured in paymet',
            success:false
        });
    }
}

// Reservations
exports.showReservations = async (req, res) => {
    try {
        const { customer_id } = req.body;

        // Validate customer_id
        if (!customer_id) {
            return res.status(400).json({
                message: "Customer ID is required!",
                success: false
            });
        }

        // Query to get all reservations for the customer
        const query = `SELECT * FROM reservations WHERE customer_id = $1 ORDER BY reservation_time DESC;`;
        const reservations = await db.query(query, [customer_id]);

        // Check if reservations exist
        if (reservations.rows.length === 0) {
            return res.status(404).json({
                message: "No reservations found for this customer.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Reservations retrieved successfully!",
            success: true,
            reservations: reservations.rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch reservations!",
            success: false
        });
    }
};

exports.viewProfile = async (req, res) => {
    try {
        const { customer_id } = req.body; // Assuming customer_id is passed in the request body

        if (!customer_id) {
            return res.status(400).json({ message: "Customer ID is required", success: false });
        }

        // Fetch customer details
        const customerQuery = `
            SELECT name, username, email, phone_number, wallet_balance
            FROM customers WHERE customer_id = $1;
        `;
        const customerResult = await db.query(customerQuery, [customer_id]);

        if (customerResult.rows.length === 0) {
            return res.status(404).json({ message: "Customer not found", success: false });
        }
        
        const customer = customerResult.rows[0];

        // Fetch order statistics
        const orderStatsQuery = `
            SELECT 
                COUNT(*) AS total_orders,
                COUNT(*) FILTER (WHERE is_delivery = TRUE) AS food_delivery,
                COUNT(*) FILTER (WHERE is_delivery = FALSE) AS dineout
            FROM orders WHERE customer_id = $1;
        `;
        const orderStatsResult = await db.query(orderStatsQuery, [customer_id]);
        const orderStats = orderStatsResult.rows[0] || { total_orders: 0, food_delivery: 0, dineout: 0 };

        // Fetch reservation count (assuming a reservations table exists)
        const reservationQuery = `SELECT COUNT(*) AS total_reservations FROM reservations WHERE customer_id = $1;`;
        const reservationResult = await db.query(reservationQuery, [customer_id]);
        const totalReservations = reservationResult.rows[0]?.total_reservations || 0;

        return res.status(200).json({
            message: "Profile fetched successfully",
            success: true,
            profile: {
                name: customer.name,
                username: customer.username,
                email: customer.email,
                phone_number: customer.phone_number,
                wallet_balance: customer.wallet_balance,
                total_orders: parseInt(orderStats.total_orders, 10),
                food_delivery: parseInt(orderStats.food_delivery, 10),
                dineout: parseInt(orderStats.dineout, 10),
                total_reservations: parseInt(totalReservations, 10)
            }
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Failed to fetch profile", success: false });
    }
};


exports.fetchTop5 =  async(req,res) => {
     // Query to get top 5 most ordered dishes overall
    try {
        const topDishesQuery = `
               SELECT 
               d.dish_name, 
               c.name AS canteen_name,
               d.rating,
               d.is_veg, 
               d.img_url, 
               SUM((dish_map->>d.dish_id::TEXT)::INTEGER) AS order_count
           FROM orders o
           JOIN dishes d ON (dish_map ? d.dish_id::TEXT)  -- Check if dish_id exists in dish_map
           JOIN canteens c ON d.canteen_id = c.canteen_id
           GROUP BY d.dish_id, d.dish_name, c.name, d.img_url
           ORDER BY order_count DESC
           LIMIT 5;
           ` ;
   
       const topDishes = await db.query(topDishesQuery);

       if(!topDishes || topDishes.rows.length == 0){
            return res.status(401).json({
                message:"Error ho gya",
                success: false
            });
       }
        console.log(topDishes.rows) ; 
        // console.log('HI');
       return res.status(200).json({
            message:"Data fetched",
            success:true,
            data:topDishes.rows
       });
    } catch (error) {
        return res.status(200).json({
            message:"Some error occurred.",
            success:false
        });
    }



}


// Customer Stats

// Payment waala
// Pament : Virtual money