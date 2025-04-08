const db = require('../db/index.js');
const jwt = require('jsonwebtoken') ;
const bcrypt = require('bcryptjs');
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

async function hashPassword(password) {
    try {
        // //.log("Main aagaya");
        
        if (!password) {
            throw new Error("Password is undefined or empty");
        }

        const fixedSalt = "$2b$10$abcdefghijklmnopqrstuv"; // Ye fix rakh
        return await bcrypt.hash(password, fixedSalt);
    } catch (error) {
        //.error("Hashing error:", error.message);
        throw error;  // Re-throw kar diya taaki caller function bhi error handle kare
    }
}

exports.searchCanteen = async (req, res) => {
    try {
        let  canteenNameToSearch  = req.body.canteen_name ;
        //.log("SEARCH") ;
        //.log(req.body.canteen_name) ;
        //.log(canteenNameToSearch) ; 

        // const canteenNameToSearch = canteen_name ; 

        // Validate input
        if (!canteenNameToSearch || typeof canteenNameToSearch !== "string") {
            return res.status(400).json({ error: "Invalid canteen name." });
        }

        canteenNameToSearch = canteenNameToSearch.trim(); // Remove extra spaces

        // PostgreSQL query with case-insensitive search
        // canteen_id,name,rating , img_url, address ye sab chahiye jaha canteen_name = canteenNameToSearch
        const query = `
            SELECT 
                c.canteen_id,
                c.name AS canteen_name,
                c.img_url as img_url,
                c.address as address,
                c.rating as rating
            FROM canteens c
            WHERE c.name = $1;
        `;

        // const query = `
        //     SELECT 
        //         c.canteen_id,
        //         c.name AS canteen_name,
        //         c.opening_time,
        //         c.closing_time,
        //         levenshtein(lower(c.name), lower($1)) AS edit_distance
        //     FROM canteens c
        //     WHERE c.name % $1  -- Trigram filtering for fuzzy matches
        //     ORDER BY edit_distance ASC  -- Prioritize closest matches
        //     LIMIT 5;
        // `;

        const values = [canteenNameToSearch]; // Allow partial matches

        const { rows } = await db.query(query, values);

        // Check if results exist
        if (rows.length === 0) {
            return res.status(404).json({ error: "No matching canteen found." });
        }

        return res.status(200).json({ ok: true, data: rows });
    } 
    catch (error) {
        //.error("Error searching canteen:", error);
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
        //.error("Error searching dish:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.fetchReservations = async (req, res) => {
    try {
        // const { customer_id } = req.body;
        const customer_id = req.customer_id ; 
        
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
        // //.log(rows) ; 
        return res.status(200).json({ reservations: rows });
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        });
    }
};

exports.viewCart = async (req, res) => {
    try {
        const customer_id = req.customer_id ;
        // //.log("MY CART") ; 
        // const { userType } = req.body;

        // //.log(customer_id) ; 

        // if (userType !== "customer") {
        //     return res.status(200).json({
        //         canteen_id: null,
        //         is_delivery: false,
        //         bill_amount: 0,
        //         discount_amount: 0,
        //         final_amount: 0,
        //         dishes: []
        //     });
        // }

        // Get cart_id for the customer
        const query1 = `SELECT cart_id FROM customers WHERE customer_id = $1;`;
        const cartResult = await db.query(query1, [customer_id]);
        // //.log("CART ID " ,cartResult, "CUSTOMER " , customer_id) ; 
        // //.log("MY CART") ;  
        if (cartResult.rowCount === 0 || !cartResult.rows[0].cart_id) {
            return res.status(200).json({
                canteen_id: null,
                is_delivery: false,
                bill_amount: 0,
                discount_amount: 0,
                final_amount: 0,
                dishes: []
            });
        }
        // //.log("MY CART") ; 
        const cart_id = cartResult.rows[0].cart_id;

        // Fetch cart details
        // //.log("MY CART") ; 
        const query2 = `
            SELECT canteen_id, is_delivery, bill_amount, discount_amount, final_amount, dish_map
            FROM orders
            WHERE order_id = $1;
        `;
        const orderResult = await db.query(query2, [cart_id]);

        if (orderResult.rowCount === 0) {
            return res.status(200).json({
                canteen_id: null,
                is_delivery: false,
                bill_amount: 0,
                discount_amount: 0,
                final_amount: 0,
                dishes: []
            });
        }
        // //.log("MY CART") ; 
        const { canteen_id, is_delivery, bill_amount, discount_amount, final_amount, dish_map } = orderResult.rows[0];

        if (!dish_map || Object.keys(dish_map).length === 0) {
            return res.status(200).json({
                canteen_id: null,
                is_delivery: false,
                bill_amount: 0,
                discount_amount: 0,
                final_amount: 0,
                dishes: [],
                dish_map: orderResult.rows[0]?.dish_map || {}
            });
        }

        // Fetch dish details
        const query3 = `
            SELECT dish_name, img_url, rating, price, is_veg, dish_id, dish_tag
            FROM dishes
            WHERE dish_id = ANY($1);
        `;
        const dishResult = await db.query(query3, [Object.keys(dish_map)]);

        // //.log("MY CART") ; 
        // //.log(canteen_id,
        //     is_delivery,
        //     bill_amount,
        //     discount_amount,
        //     final_amount,
        //     dishResult.rows) ;

        return res.status(200).json({
            canteen_id,
            is_delivery,
            bill_amount,
            discount_amount,
            final_amount,
            dishes: dishResult.rows,
            dish_map: orderResult.rows[0]?.dish_map || {}
        });

    } catch (error) {
        return res.status(500).json({
            canteen_id: null,
            is_delivery: false,
            bill_amount: 0,
            discount_amount: 0,
            final_amount: 0,
            dishes: [],
            dish_map: orderResult.rows[0]?.dish_map || {}
        });
    }
};

exports.addDishToCart = async (req, res) => {

    try {
        const customer_id = req.customer_id ;
        const{ dish_id }= req.body ;

        // Fetch existing cart_id
        const cart_id_query = `SELECT cart_id FROM customers WHERE customer_id = $1;`;
        const cart_id_result = await db.query(cart_id_query, [customer_id]);
        console.log("cart_id_result",cart_id_result.rows.length,cart_id_result.rows);
        // Fetch dish details (canteen_id & price)
        const canteen_id_query = `SELECT canteen_id, price FROM dishes WHERE dish_id = $1;`;
        const dish_result = await db.query(canteen_id_query, [dish_id]);
        console.log("dishresult",dish_result.rows.length,dish_result.rows);

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
            console.log("new_cart_result",new_cart_result.rows.length,new_cart_result.rows);
            const add_cart_id_query = `UPDATE customers SET cart_id = $2 WHERE customer_id = $1;`;

            await db.query(add_cart_id_query, [customer_id, new_cart_result.rows[0].order_id]);

            return res.status(201).json({ 
                message: "New cart created", 
                // order_id: new_cart_result.rows[0].order_id, 
                cart: new_cart_result.rows[0] ,
                success:true
            });
        } 
        else{
            // Existing cart -> Update dish_map
            const cart_id = cart_id_result.rows[0].cart_id;

            const cur_canteen_query = `SELECT canteen_id FROM orders WHERE order_id = $1;`;
            // //.log(cur_canteen_query) ; 
            const result = await db.query(cur_canteen_query, [cart_id]);
            // //.log(result) ; 
            console.log("ONS->",result.rows.length);
            console.log("JSR->",result.rows[0].canteen_id);
            if(canteen_id !== result.rows[0].canteen_id){
                return res.status(401).json({
                    message:'The current canteen of the customer is different from the canteen of the dish selected.',
                    success:false
                })
            }

            const update_dish_map_query = `
                UPDATE orders 
                SET dish_map = dish_map || jsonb_build_object($2::text, (COALESCE(dish_map->>$2, '0')::int + 1)), 
                    final_amount = final_amount + $3,
                    bill_amount = bill_amount + $3
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
        //.error("Error adding dish to cart:", error);
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false});
    }
};

exports.removeDishFromCart = async (req, res) => {
    try {
        const customer_id = req.customer_id;
        const {dish_id} = req.body ;

        // Fetch existing cart_id
        const cart_id_query = `SELECT cart_id FROM customers WHERE customer_id = $1;`;
        const cart_id_result = await db.query(cart_id_query, [customer_id]);

        if (cart_id_result.rows.length === 0 || cart_id_result.rows[0].cart_id === 0) {
            return res.status(404).json({ message: "No active cart found", success: false });
        }

        const cart_id = cart_id_result.rows[0].cart_id;

        // Fetch current dish_map and price of the dish
        const dish_map_query = `SELECT dish_map, final_amount, bill_amount FROM orders WHERE order_id = $1;`;
        const dish_map_result = await db.query(dish_map_query, [cart_id]);

        if (dish_map_result.rows.length === 0) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        const { dish_map, final_amount, bill_amount } = dish_map_result.rows[0];
        const parsedDishMap = dish_map || {};

        if (!parsedDishMap[dish_id]) {
            return res.status(404).json({ message: "Dish not found in cart", success: false });
        }

        const dish_quantity = parsedDishMap[dish_id];
        const dish_price_query = `SELECT price FROM dishes WHERE dish_id = $1;`;
        const dish_price_result = await db.query(dish_price_query, [dish_id]);

        if (dish_price_result.rows.length === 0) {
            return res.status(404).json({ message: "Dish price not found", success: false });
        }

        const dish_price = dish_price_result.rows[0].price;
        
        if (dish_quantity === 1) {
            // Remove dish from dish_map if quantity is 1
            delete parsedDishMap[dish_id];
        } else {
            // Reduce the quantity by 1
            parsedDishMap[dish_id] -= 1;
        }

        const updatedDishMap = JSON.stringify(parsedDishMap);
        const newFinalAmount = final_amount - dish_price;
        const newBillAmount = bill_amount - dish_price;

        // Update the cart
        const update_dish_map_query = `
            UPDATE orders 
            SET dish_map = $2::jsonb, 
                final_amount = $3, 
                bill_amount = $4
            WHERE order_id = $1
            RETURNING dish_map, final_amount;
        `;
        const updated_cart = await db.query(update_dish_map_query, [cart_id, updatedDishMap, newFinalAmount, newBillAmount]);

        // If cart becomes empty, reset cart_id
        if (Object.keys(parsedDishMap).length === 0) {
            const reset_cart_query = `UPDATE customers SET cart_id = 0 WHERE customer_id = $1;`;
            await db.query(reset_cart_query, [customer_id]);
        }

        return res.status(200).json({ 
            message: "Dish removed from cart", 
            cart: updated_cart.rows[0],
            success: true
        });
    } catch (error) {
        //.error("Error removing dish from cart:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.viewOrderHistory = async (req, res) => {
    try {
        const { type } = req.body;
        const customer_id = req.customer_id;
        // //.log(customer_id);

        // const { customer_id ,type} = req.body ;

        const isDelivery = type === "delivery";

        const ordersQuery = `
            SELECT 
                o.order_id,
                o.time,
                o.dish_map,
                o.is_delivery,
                o.status,
                o.final_amount,
                c.name AS canteen_name,
                c.img_url AS canteen_img_url,
                c.rating AS canteen_rating
            FROM orders o
            JOIN canteens c ON o.canteen_id = c.canteen_id
            WHERE o.customer_id = $1 
            AND o.is_delivery = $2
            AND o.final_amount > 0
            ORDER BY o.time ASC;
        `;

        const ordersResult = await db.query(ordersQuery, [customer_id , isDelivery ]);
        const orders = ordersResult.rows;

        const dishIdSet = new Set();
        const ordersWithParsedDishes = orders.map(order => {
            const dishMap = order.dish_map;
            const parsedDishes = [];

            for (const dishId in dishMap) {
                dishIdSet.add(parseInt(dishId));
                parsedDishes.push({
                    dish_id: parseInt(dishId),
                    quantity: dishMap[dishId]
                });
            }

            return {
                ...order,
                dishes: parsedDishes
            };
        });

        const dishIds = Array.from(dishIdSet);
        let dishDetailsMap = {};
        if (dishIds.length > 0) {
            const dishQuery = `
                SELECT dish_id, dish_name, price 
                FROM dishes 
                WHERE dish_id = ANY($1);
            `;
            const dishResult = await db.query(dishQuery, [dishIds]);
            dishDetailsMap = dishResult.rows.reduce((acc, dish) => {
                acc[dish.dish_id] = dish;
                return acc;
            }, {});
        }

        const finalOrders = ordersWithParsedDishes.map(order => {
            const enrichedItems = order.dishes.map(d => ({
                name: dishDetailsMap[d.dish_id]?.dish_name || "Unknown",
                quantity: d.quantity,
                price: dishDetailsMap[d.dish_id]?.price || 0
            }));

            const subtotal = enrichedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
            const tax = parseFloat((0.1 * subtotal).toFixed(2));
            const deliveryFee = order.is_delivery ? 30 : 0;
            const discount = 0;
            const total = subtotal + tax + deliveryFee - discount;

            let statusString = "processing";
            if (order.status === 0) statusString = "failed";
            else if (order.status === 4) statusString = "completed";

            return {
                id: `ORD${order.order_id.toString().padStart(3, '0')}`,
                type: order.is_delivery ? "delivery" : "dine-out",
                date: order.time,
                status: statusString,
                restaurant: {
                    name: order.canteen_name,
                    logo: order.canteen_img_url,
                    rating: order.canteen_rating
                },
                items: enrichedItems,
                total: subtotal,
                payment: {
                    subtotal,
                    tax,
                    delivery: deliveryFee,
                    discount,
                    total
                }
            };
        });

        return res.status(200).json({
            message: "Order history retrieved successfully.",
            data: finalOrders,
            success: true,
        });

    } catch (error) {
        //.error("Error in viewOrderHistory:", error);
        return res.status(500).json({
            message: "Error detected",
            success: false,
        });
    }
};



exports.addFavourites = async (req, res) => {
    try {
        const {dish_id } = req.body;
        const customer_id = req.customer_id ;

        const dish_check_query = `SELECT dish_name FROM dishes WHERE dish_id = $1;`;

        const doesDishExist = await db.query(dish_check_query,[dish_id]);

        if(!doesDishExist.rows[0]){
            return res.status(400).json({error: "Dish does not exist"});
        }

        // //.log(doesDishExist.rows[0]);

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
        //.error("Error adding favorite dish:", error);
        return res.status(500).json({ error: "Internal Server Error" ,success: false});
    }
};


exports.viewFavourites = async (req, res) => {
    try {
        // const { customer_id } = req.body;
        const customer_id = req.customer_id ;

        //.log(customer_id) ; 

        if (!customer_id) {
            return res.status(400).json({ error: "Customer ID is required" ,success:false});
        }

        // const query = `
        //     SELECT d.dish_name, d.rating, d.is_veg, d.img_url, d.price
        //     FROM dishes d
        //     INNER JOIN favourites f ON d.dish_id = f.dish_id
        //     WHERE f.customer_id = $1;
        // `;

        const query = `
            SELECT d.dish_id ,d.dish_name, d.rating, d.is_veg, d.img_url, d.price
            FROM dishes d
            WHERE d.dish_id = ANY (
                SELECT unnest(favourites)
                FROM customers
                WHERE customer_id = $1
            );
        `;

        const { rows } = await db.query(query, [customer_id]);

        return res.status(200).json({data: rows,success:true});
    } catch (error) {
        //.error("Error fetching customer favorites:", error);
        return res.status(500).json({ error: "Internal Server Error" ,success:false});
    }
};

exports.removeFavourites = async (req, res) => {
    try {
        const customer_id = req.customer_id;
        const { dish_id } = req.body;

        if (!dish_id) {
            return res.status(400).json({ error: "dish_id is required", success: false });
        }

        // Update favourites array by removing the given dish_id
        const query = `
            UPDATE customers
            SET favourites = array_remove(favourites, $1)
            WHERE customer_id = $2
            RETURNING favourites;
        `;

        const result = await db.query(query, [dish_id, customer_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Customer not found", success: false });
        }

        return res.status(200).json({
            message: "Dish removed from favourites successfully",
            favourites: result.rows[0].favourites,
            success: true
        });

    } catch (error) {
        //.error("Error removing customer favourite:", error);
        return res.status(500).json({ error: "Internal Server Error", success: false });
    }
};

// Customer Wallet
exports.viewWallet = async(req,res) => {
    try {
        // const { customer_id } = req.body;
        const customer_id = req.customer_id ;

        //.log("Customer ID" , customer_id) ; 

        const balance_query = `SELECT wallet_balance FROM customers WHERE customer_id = $1;`;
        const wallet_balance = await db.query(balance_query,[customer_id]);

        const transactions_query = `SELECT * FROM transactions WHERE customer_id = $1 ORDER BY time DESC;`;
        const data = await db.query(transactions_query,[customer_id]);
        
        //.log(data);

        if(!data){
            return res.status(401).json({message:'Data is corrupted',success:false});
        }
        if(!data.rows || data.rows.length === 0){
            return res.status(200).json({message:'User has no transaction till now',success:true, walletBalance:wallet_balance.rows[0].wallet_balance});
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
        const { moneyToAdd } = req.body;
        const customer_id = req.customer_id ;

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
        const transaction = await db.query(transactionQuery, [customer_id, dummyOrderId,  moneyToAdd]);

        return res.status(200).json({
            message: "Wallet updated successfully!",
            success: true,
            wallet_balance: updatedWallet.rows[0].wallet_balance,
            transaction: transaction.rows[0]
        });

    } catch (error) {
        //.error(error);
        return res.status(500).json({
            message: "Failed to add money to the wallet!",
            success: false
        });
    }
};

exports.addReservations = async (req,res) => {
    try {
        const {canteen_id, num_people, reservation_time } = req.body;
        const customer_id = req.customer_id ;
        //.log(req.body) ; 
        //.log(customer_id, canteen_id, num_people, reservation_time );
        // const tmep =   ;
        
        if(!customer_id || !canteen_id || !num_people || !reservation_time || parseInt(num_people) <= 0 ){
            return res.status(401).json({
                message:'Data got corrupted in between',
                success:false
            });
        }
        
        //.log('Before query 1');

        const balance_query = `select wallet_balance from customers where customer_id = $1`;
        const wallet_balance = await db.query(balance_query,[customer_id]);

        const wallet_balance_value = wallet_balance.rows[0]?.wallet_balance || 0;
        if (wallet_balance_value < 10 * num_people) {
            return res.status(401).json({ message: "Insufficient balance", success: false });
        }

        //.log('Before query 2');

        const reservation_query = `INSERT INTO reservations (customer_id, canteen_id, request_time, reservation_time, num_people, status) 
        VALUES ($1, $2, NOW(), $3, $4, $5) returning reservation_id;`;
        

        //.log("Before query 2.5") ; 
        //.log(reservation_time);

        const reservation_result = await db.query(reservation_query,[customer_id,canteen_id,reservation_time,num_people,1]) ; 

        //.log("Before query 2.75") ; 
        
        const reservation_id = reservation_result.rows[0].reservation_id;

        //.log(reservation_result) ; 
        
        if(!reservation_id){
            res.status(401).json({
                message:'Some error occurred',
                success:false
            });
        }

        //.log('Before query 3');

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
            success:false,
            galti: error
        });
    }
}

// Reservations
exports.showReservations = async (req, res) => {
    try {
        // const { customer_id } = req.body;
        const customer_id = req.customer_id ;

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
        //.error(error);
        return res.status(500).json({
            message: "Failed to fetch reservations!",
            success: false
        });
    }
};

exports.viewProfile = async (req, res) => {
    try {
        // const {customer_id}  = req.body; // Assuming customer_id is passed in the request body
        const customer_id = req.customer_id ;
        // //.log(customer_id) ; 
        // //.log(req) ; 
        if (!customer_id) {
            return res.status(400).json({ message: "Customer ID is required", success: false });
        }

        // Fetch customer details
        const customerQuery = `
            SELECT name, username, email, phone_number, wallet_balance, img_url, address
            FROM customers WHERE customer_id = $1;
        `;
        const customerResult = await db.query(customerQuery, [customer_id]);

        // //.log(customerResult) ; 

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

        // //.log(orderStats) ; 

        // Fetch reservation count (assuming a reservations table exists)
        const reservationQuery = `SELECT COUNT(*) AS total_reservations FROM reservations WHERE customer_id = $1;`;
        const reservationResult = await db.query(reservationQuery, [customer_id]);
        const totalReservations = reservationResult.rows[0].total_reservations || 0;

        return res.status(200).json({
            message: "Profile fetched successfully",
            success: true,
            profile: {
                name: customer.name,
                username: customer.username,
                email: customer.email,
                phone_number: customer.phone_number,
                wallet_balance: customer.wallet_balance,
                img_url: customer.img_url,
                address: customer.address,
                total_orders: parseInt(orderStats.total_orders, 10),
                food_delivery: parseInt(orderStats.food_delivery, 10),
                dineout: parseInt(orderStats.dineout, 10),
                total_reservations: parseInt(totalReservations, 10)
            }
        });

    } catch (error) {
        //.log(error) ; 
        //.error("Error fetching profile:", error);
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
            d.order_count
        FROM dishes d
        JOIN canteens c ON d.canteen_id = c.canteen_id
        ORDER BY d.order_count DESC
        LIMIT 5;
           ` ;

        // //.log("TOP 5+++++++++++++") ; 
        
        const topDishes = await db.query(topDishesQuery);
        
        // //.log(topDishes) ; 
        if(!topDishes || topDishes.rows.length == 0){
            return res.status(401).json({
                message:"Error ho gya",
                success: false
            });
        }
        //.log(topDishes.rows) ; 
        // //.log('HI');
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

exports.resetPassword = async (req, res) => {
    //.log(req.body) ; 
    let { userType, username, new_password } = req.body;

    // const userIdField = `${userType}_id`;
    // const table = `${userType}s`;

    userType = userType ;


    try {
        if(userType === "customers") {await db.query(`UPDATE customers SET password = $1 WHERE username = $2 ;`, [new_password, username]);}
        else {await db.query(`UPDATE canteens SET password = $1 WHERE username = $2 ;`, [new_password, username]);}
        return res.status(200).json({ message: 'Password Updated' });
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

exports.updateProfilePhoto = async (req, res) => {
    //.log("IN PROFILE PHOTO") ;
    try {
        
        const { img_url } = req.body;
        const customer_id = req.customer_id ;
        // const customer_id = req.customer_id; // Middleware se aayega

        //.log(customer_id) ;
        //.log(img_url) ;

        if (!img_url) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const result = await db.query(
            `UPDATE customers SET img_url = $1 WHERE customer_id = $2 RETURNING img_url;`,
            [img_url, customer_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        return res.status(200).json({ message: "Profile photo updated successfully", img_url: result.rows[0].img_url });
    } catch (error) {
        //.error("Error updating profile photo:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone_number, address } = req.body;
        const customer_id = req.customer_id ;
        // const customer_id = req.customer_id; // Extract customer_id from the request

        // Fetch existing customer data
        const customerQuery = await db.query(
            `SELECT username, password, name, phone_number, address FROM customers WHERE customer_id = $1;`,
            [customer_id]
        );

        if (customerQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const existingCustomer = customerQuery.rows[0];

        // Check if phone number is being changed and if it's already taken
        if (phone_number !== existingCustomer.phone_number) {
            const phoneCheck = await db.query(
                `SELECT customer_id FROM customers WHERE phone_number = $1;`,
                [phone_number]
            );
            if (phoneCheck.rows.length !== 0) {
                return res.status(401).json({ message: 'Phone number already taken' });
            }
        }

        // Construct dynamic update query only with changed fields
        let updateFields = [];
        let updateValues = [];
        let paramIndex = 1;

        if (name && name !== existingCustomer.name) {
            updateFields.push(`name = $${paramIndex}`);
            updateValues.push(name);
            paramIndex++;
        }
        if (phone_number && phone_number !== existingCustomer.phone_number) {
            updateFields.push(`phone_number = $${paramIndex}`);
            updateValues.push(phone_number);
            paramIndex++;
        }
        if (address && address !== existingCustomer.address) {
            updateFields.push(`address = $${paramIndex}`);
            updateValues.push(address);
            paramIndex++;
        }

        if (updateFields.length === 0) {
            return res.status(200).json({ message: 'No changes detected' });
        }

        // Append customer_id for the WHERE clause
        updateValues.push(customer_id);
        const updateQuery = `UPDATE customers SET ${updateFields.join(', ')} WHERE customer_id = $${paramIndex};`;

        await db.query(updateQuery, updateValues);

        return res.status(200).json({ message: 'Profile updated successfully' , success:true});
    } catch (error) {
        //.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        let { currentPassword, newPassword} = req.body;
        const customer_id = req.customer_id; // Assuming authentication middleware sets req.customer_id

        //.log(currentPassword,newPassword,customer_id) ; 

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new passwords are required' });
        }

        // Fetch current password from the database
        const user = await db.query(
            `SELECT password FROM customers WHERE customer_id = $1;`, 
            [customer_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = user.rows[0].password;
        newPassword = await hashPassword(newPassword) ; 
        currentPassword = await hashPassword(currentPassword) ;


        // Compare currentPassword with the stored hashed password
        const isMatch = currentPassword === hashedPassword;
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        // const saltRounds = 10;
        // const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password in the database
        await db.query(
            `UPDATE customers SET password = $1 WHERE customer_id = $2;`, 
            [newPassword, customer_id]
        );

        // Logout by clearing the token (if stored in cookies)
        res.clearCookie('token');

        return res.status(200).json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        //.error('Error changing password:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.fetchDishes = async (req, res) => {
    try {
        const query = `
            SELECT d.dish_name, d.img_url, c.name AS canteen_name, d.price, d.is_veg, d.rating, d.dish_id
            FROM dishes d
            JOIN canteens c ON d.canteen_id = c.canteen_id;
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        //.error("Error fetching dishes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.fetchCanteens = async (req, res) => {
    //.log("mianaagayag") ; 
    try {
        const query = `
            SELECT name, canteen_id, rating, img_url, address
            FROM canteens;
        `;
        const result = await db.query(query);
        res.json(result.rows);
        //.log(result.rows) ; 
    } catch (error) {
        //.error("Error fetching canteens:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.fetchMenu = async (req, res) => {
    try {
        const { canteen_id } = req.body;

        if (!canteen_id) {
            return res.status(400).json({ error: "canteen_id is required" });
        }
        const query = `
            SELECT d.dish_name, d.img_url, d.rating, d.price, d.is_veg, d.dish_id, d.dish_tag
            FROM dishes d
            JOIN canteens c ON c.canteen_id = $1
            WHERE d.dish_id = ANY(c.menu);
        `;

        const { rows } = await db.query(query, [canteen_id]);

        res.status(200).json(rows);
    } catch (error) {
        //.error("Error fetching menu:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Customer Stats
// Payment waala
// Pament : Virtual money 

exports.requestOrder = async (req, res) => {
    console.log("Isme aa gaya") ; 
    const customer_id = req.customer_id;
    console.log(customer_id)  ;

    try {
        // Step 1: Get the current cart_id from the customer
        const customerResult = await db.query(
            `SELECT cart_id FROM customers WHERE customer_id = $1;`,
            [customer_id]
        );

        if (customerResult.rows.length === 0 || !customerResult.rows[0].cart_id) {
            return res.status(404).json({ message: 'No active cart found for this customer' });
        }

        const cart_id = customerResult.rows[0].cart_id;

        // Step 2: Get canteen_id from order
        const orderResult = await db.query(
            `SELECT canteen_id FROM orders WHERE order_id = $1;`,
            [cart_id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const canteen_id = orderResult.rows[0].canteen_id;

        // Step 3: Check if canteen has auto_accept enabled
        const canteenResult = await db.query(
            `SELECT auto_accept FROM canteens WHERE canteen_id = $1;`,
            [canteen_id]
        );

        if (canteenResult.rows.length === 0) {
            return res.status(404).json({ message: 'Canteen not found' });
        }

        const autoAccept = canteenResult.rows[0].auto_accept;

        if (autoAccept) {
            // Immediately accept the order
            await db.query(
                `UPDATE orders SET status = 2 WHERE order_id = $1;`,
                [cart_id]
            );
            return res.status(200).json({ message: 'Order auto-accepted by canteen' });
        }

        // Step 4: Set status = 1 (requested/pending)
        await db.query(
            `UPDATE orders SET status = 1 WHERE order_id = $1;`,
            [cart_id]
        );

        const pollInterval = 30 * 1000; // 30 seconds
        const maxWaitTime = 5 * 60 * 1000; // 5 minutes
        const startTime = Date.now();

        const checkStatus = async () => {
            const statusResult = await db.query(
                `SELECT status FROM orders WHERE order_id = $1;`,
                [cart_id]
            );

            if (statusResult.rows.length === 0) {
                return res.status(404).json({ message: 'Order not found during polling' });
            }

            const status = statusResult.rows[0].status;

            if (status === 2) {
                return res.status(200).json({ message: 'Order accepted' });
            } else if (status === 0) {
                return res.status(401).json({ message: 'Order rejected' });
            } else if (Date.now() - startTime >= maxWaitTime) {
                await db.query(`UPDATE orders SET status = 0 where order_id = $1;` , [cart_id]) ; 
                return res.status(408).json({ message: 'No response from canteen owner. Try again later.' });
            } else {
                setTimeout(checkStatus, pollInterval);
            }
        };

        // Start polling
        setTimeout(checkStatus, pollInterval);

        // let intervalId = setInterval(async () => {
        //     try {
        //         const statusResult = await db.query(
        //             `SELECT status FROM orders WHERE order_id = $1;`,
        //             [cart_id]
        //         );
        
        //         if (statusResult.rows.length === 0) {
        //             clearInterval(intervalId);
        //             return res.status(404).json({ message: 'Order not found during polling' });
        //         }
        
        //         const status = statusResult.rows[0].status;
        
        //         if (status === 2) {
        //             clearInterval(intervalId);
        //             return res.status(200).json({ message: 'Order accepted' });
        //         } else if (status === 0) {
        //             clearInterval(intervalId);
        //             return res.status(401).json({ message: 'Order rejected' });
        //         } else if (Date.now() - startTime >= maxWaitTime) {
        //             clearInterval(intervalId);
        //             await db.query(`UPDATE orders SET status = 0 WHERE order_id = $1;`, [cart_id]);
        //             return res.status(408).json({ message: 'No response from canteen owner. Try again later.' });
        //         }
        //     } catch (err) {
        //         clearInterval(intervalId);
        //         return res.status(500).json({ message: 'Error during polling' });
        //     }
        // }, pollInterval);
        

    }catch (err) {
        //.error('Error in requestOrder:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.placeOrder = async (req, res) => {
    const customer_id = req.customer_id;

    //.log("place order me hu") ;

    console.log("PLACE ORDER ME AA GAYA") ;
    console.log(customer_id);

    try {
        console.log(customer_id);
        // Step 1: Get customer's cart_id and wallet_balance
        const customerQuery = await db.query(
            `SELECT cart_id, wallet_balance FROM customers WHERE customer_id = $1;`,
            [customer_id]
        );
        console.log("bakchodi") ;

        console.log(customerQuery) ; 

        if (customerQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        console.log("bakchodi") ;
        // console.log("y") ;
        const { cart_id, wallet_balance } = customerQuery.rows[0];

        if (!cart_id) {
            return res.status(400).json({ message: 'No cart associated with this customer' });
        }
        console.log("bakchodi") ;
        // Step 2: Get final_amount and canteen_id from the order
        const orderQuery = await db.query(
            `SELECT final_amount, canteen_id FROM orders WHERE order_id = $1;`,
            [cart_id]
        );
        console.log("bakchodi") ;
        if (orderQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Order/cart not found' });
        }

        const { final_amount, canteen_id } = orderQuery.rows[0];

        // console.log(final_amount, canteen_id) ; 
        console.log("bakchodi") ;
        // Step 3: Check wallet balance
        if (final_amount > wallet_balance) {
            // console.log
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        // Step 4: Transaction - Deduct and Add balance
        // await db.query('BEGIN');
        console.log("HI5") ; 

        // Deduct from customer
        await db.query(
            `UPDATE customers SET wallet_balance = wallet_balance - $1, cart_id = 0 WHERE customer_id = $2;`,
            [final_amount, customer_id]
        );
        console.log("HI5") ; 

        // Add to canteen
        await db.query(
            `UPDATE canteens SET earnings = earnings + $1 WHERE canteen_id = $2;`,
            [final_amount, canteen_id]
        );
        console.log("HI5") ; 

        await db.query(
            `UPDATE orders SET status = 3 WHERE order_id = $1;`,
            [cart_id]
        );
        console.log("HI5") ; 

        await db.query(`
            INSERT INTO transactions(order_id, customer_id, time, amount)
            VALUES ($1, $2, NOW(), $3);
        `, [cart_id, customer_id, -final_amount]);

        // await db.query('COMMIT');

        console.log("HI5") ; 

        return res.status(200).json({ message: 'Order placed successfully' });

    } catch (error) {
        // await db.query('ROLLBACK');
        //.error('Error placing order:', error);
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.fetchTransactions = async (req, res) => {

    //.log("FETCH TRANSACTIONS IS HIT") ; 

    const customer_id = req.customer_id;
    // const { customer_id} = req.body ; 

    try {
        const result = await db.query(
            `SELECT transaction_id, order_id, customer_id, time, amount 
             FROM transactions 
             WHERE customer_id = $1 
             ORDER BY time DESC`,
            [customer_id]
        );

        // //.log("why" , result.rows) ; 

        return res.status(200).json({
            status: "success",
            transactions: result.rows
        });

    } catch (err) {
        //.error("❌ Error fetching transactions:", err.message);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

exports.setOrderType = async (req, res) => {
    const customer_id = req.customer_id;
    const { is_delivery } = req.body; // expecting true/false

    try {
        const customerQuery = await db.query(
            'SELECT cart_id FROM customers WHERE customer_id = $1',
            [customer_id]
        );

        if (customerQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const { cart_id } = customerQuery.rows[0];

        if (!cart_id || cart_id === 0) {
            return res.status(400).json({ message: 'No cart associated with this customer' });
        }

        await db.query(
            'UPDATE orders SET is_delivery = $1 WHERE order_id = $2',
            [is_delivery, cart_id]
        );

        return res.status(200).json({ message: 'Order type (is_delivery) updated successfully' });

    } catch (error) {
        //.error('Error setting is_delivery:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// const handleCheckout = async () => {
//     // if (cartItems.dishes.length === 0) {
//     //     showNotification('Your cart is empty!');
//     //     return;
//     // }

//     try {
//         setShowModal(true); // show loading modal
//         setCountdown(300);  // optional: countdown visual only

//         // const { customer_id } = userData;

//         const response = await axios.post('http://localhost:4000/customer/request-order', {
//         });
        

//         if (response.status === 200) {
//             // Proceed to place order
//             await axios.post('http://localhost:4000/customer/place-order', {
//             });

//             setShowModal(false);
//             showNotification('Order placed successfully!');
//             navigate('/order-confirmation');
//         }
//     } catch (error) {
//         setShowModal(false);

//         if (error.response) {
//             if (error.response.status === 401) {
//                 showNotification('Order rejected by canteen.');
//             } else if (error.response.status === 408) {
//                 showNotification('No response from canteen. Please try again later.');
//             } else {
//                 showNotification('Something went wrong. Please try again.');
//             }
//         } else {
//             showNotification('Server error. Please try again.');
//         }
//     }
// };
