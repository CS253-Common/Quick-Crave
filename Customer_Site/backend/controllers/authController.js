const jwt = require('jsonwebtoken');
const db = require('../db'); // Ensure your database connection is correctly imported
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
// const db = require('../db'); // Ensure correct database import

require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET || '123456';
const JWT_EXPIRES_IN = '1h'; // 5 minutes for testing

async function hashPassword(password) {
    try {
        // //.log("Main aagaya");
        
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


const generateOTP = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    // console.log(otp) ; 
    return { otp, hashedOTP }; // Return both for verification later
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'quickcrave253@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'vwts zuyo mvac ekeu', // Use environment variables in production
    },
});

async function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'quickcrave253@gmail.com',
        to: email,
        subject: 'QuickCrave Signup OTP',
        text: `Your OTP for QuickCrave signup is: ${otp}`,
        html: `<p>Your OTP for QuickCrave signup is: <strong>${otp}</strong></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
}

exports.login = async (req, res) => {
    let { userType, username, password } = req.body;

    // console.log(userType,username,password) ; 

    if (!userType || !username || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    password = await hashPassword(password) ;
    // console.log("login me hai") ; 
    // console.log(password) ; 


    // console.log(password) ; 

    const generateTokenAndSetCookie = (user_id , userType, res) => {
        const token = jwt.sign({ user_id, userType }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000 
        }); 
        return token ; 
    };

  try {
      if (userType === 'customer') {
          const customerQuery = `SELECT customer_id, password, name, email, phone_number, wallet_balance, img_url, address FROM customers WHERE username = $1`;
          const customer = await db.query(customerQuery, [username]);
          
          if (customer.rows.length === 0) {
              return res.status(401).json({ message: 'Invalid credentials' });
          }

          const isMatch = password === customer.rows[0].password; // Replace with bcrypt comparison if passwords are hashed
        //   console.log("asli password") ; 
        //   console.log(customer.rows[0].password) ; 
        //   console.log(isMatch) ; 
          if (!isMatch) {
              return res.status(401).json({ message: 'Invalid password!' });
          }
          const jwt_token = generateTokenAndSetCookie(customer.rows[0].customer_id, 'customer', res);

          return res.status(200).json({
              message: 'Login Successful',
              // user_id: customer.rows[0].customer_id,
              name: customer.rows[0].name,
              email: customer.rows[0].email,
              phone_number: customer.rows[0].phone_number,
              wallet_balance: customer.rows[0].wallet_balance,
              img_url: customer.rows[0].img_url,
              address: customer.rows[0].address,
              // top_5_dishes: topDishes.rows,
              token: jwt_token 
          });
      } else if (userType === 'canteen-manager') {

          const canteenQuery = `SELECT canteen_id, password, name, opening_time, closing_time, opening_status, rating, phone_number, email, auto_accept FROM canteens WHERE username = $1`;
          const canteen = await db.query(canteenQuery, [username]);

          if (canteen.rows.length === 0) {
              return res.status(401).json({ message: 'Invalid credentials' });
          }

          const isMatch = password === canteen.rows[0].password; // Replace with bcrypt comparison if passwords are hashed
          if (!isMatch) {
              return res.status(401).json({ message: 'Incorrect password!' });
          }

          const jwt_token = generateTokenAndSetCookie(canteen.rows[0].canteen_id, 'canteen-manager', res);

          return res.status(200).json({
              message: 'Login Successful',
              // user_id: canteen.rows[0].canteen_id,
              name: canteen.rows[0].name,
              opening_time: canteen.rows[0].opening_time,
              closing_time: canteen.rows[0].closing_time,
              opening_status: canteen.rows[0].opening_status,
              rating: canteen.rows[0].rating,
              // phone_number: canteen.rows[0].phone_number,
              // email: canteen.rows[0].email,
              auto_accept: canteen.rows[0].auto_accept,
              token: jwt_token
          });
      } else {
          return res.status(400).json({ message: 'Invalid user type' });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

exports.addUser = async (req,res) => {
    // const userData = {
    //     name: sessionStorage.getItem("name"),
    //     username: sessionStorage.getItem("username"),
    //     phone: sessionStorage.getItem("phone"),
    //     email: sessionStorage.getItem("email"),
    //     password: sessionStorage.getItem("password"),
    // };

    // console.log('Ye addUSer me hai');
    const { userType, name, username, phone, email, password, address } = req.body;

    // console.log(req.body) ;
    
    const checkCustomer = await db.query(`SELECT customer_id FROM customers WHERE username = $1`, [username]);
    if (checkCustomer.rows.length !== 0) {
        return res.status(401).json({ message: 'Username already taken' });
    }

    const checkPhone = await db.query(`SELECT customer_id FROM customers WHERE phone_number = $1`, [phone]);
    if (checkPhone.rows.length !== 0) {
        return res.status(401).json({ message: 'Phone number already taken' });
    }

    const checkEmail = await db.query(`SELECT customer_id FROM customers WHERE email = $1`, [email]);
    if (checkEmail.rows.length !== 0) {
        return res.status(401).json({ message: 'Email already taken' });
    }

    const enterUser = await db.query(`INSERT INTO customers (username, password, name, phone_number, email, wallet_balance, cart_id,address) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING customer_id`, [username, password, name, phone, email, 0, 0,address]);
    console.log('added to database');
    return res.status(200).json({});
}

exports.signup = async (req, res) => {
    let { userType, name, username, phone, email, password, confirmPassword } = req.body;

    // console.log("Password:", password);
    // console.log("Confirm Password:", confirmPassword);

    password = await hashPassword(password) ; 
    confirmPassword = await hashPassword(confirmPassword) ; 

    // console.log("Password:", password);
    // console.log("Confirm Password:", confirmPassword);

    if (!userType || !name || !username || !phone || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        if (userType === 'customer') {
            const checkCustomer = await db.query(`SELECT customer_id FROM customers WHERE username = $1`, [username]);
            if (checkCustomer.rows.length !== 0) {
                return res.status(401).json({ message: 'Username already taken' });
            }

            const checkPhone = await db.query(`SELECT customer_id FROM customers WHERE phone_number = $1`, [phone]);
            if (checkPhone.rows.length !== 0) {
                return res.status(401).json({ message: 'Phone number already taken' });
            }

            const checkEmail = await db.query(`SELECT customer_id FROM customers WHERE email = $1`, [email]);
            if (checkEmail.rows.length !== 0) {
                return res.status(401).json({ message: 'Email already taken' });
            }

            // const {otp , hashed_otp} =generateOTP();
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const saltRounds = 10;
            const hashed_otp = await bcrypt.hash(otp, saltRounds);
            // console.log(otp) ;
            // console.log(hashed_otp) ; 
            //function to send the amil with the otp here
            const emailSent = await sendOTPEmail(email,otp);
            //function end

            if(!emailSent){
                return res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
            }else{
                // console.log(password) ; 
                return res.status(200).json({ message: 'OTP sent. Proceed to OTP verification.', otp : hashed_otp, hashed_pwd :password });
            }
            
        } else if (userType === 'canteen-manager') {
            const checkCanteen = await db.query(`SELECT canteen_id FROM canteens WHERE username = $1`, [username]);
            if (checkCanteen.rows.length !== 0) {
                return res.status(401).json({ message: 'Username already taken' });
            }

            const checkEmail = await db.query(`SELECT canteen_id FROM canteens WHERE email = $1`, [email]);
            if (checkEmail.rows.length !== 0) {
                return res.status(401).json({ message: 'Email already taken' });
            }

            const checkPhone = await db.query(`SELECT canteen_id FROM canteens WHERE phone_number = $1`, [phone]);
            if (checkPhone.rows.length !== 0) {
                return res.status(401).json({ message: 'Phone number already taken' });
            }
            
            return res.status(200).json({ message: 'User added successfully', otp: generateOTP() });
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

