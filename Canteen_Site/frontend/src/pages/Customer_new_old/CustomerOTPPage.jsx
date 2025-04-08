import React, { use, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/login.css'; // Using the same CSS file
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { FaHorseHead } from 'react-icons/fa';

axios.defaults.withCredentials = true;

// const bcrypt = require('bcrypt');
const OtpPage = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [attempts, setAttempts] = useState(0); // Track failed attempts

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate OTP
        if (!otp || otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        console.log("OTP verification pressed");

        const storedHashedOTP = sessionStorage.getItem('otp');


        if (!storedHashedOTP) {
            alert("No OTP found. Please enter a new OTP.");
            return;
        }

        // Compare entered OTP with stored hash
        const isMatch = await bcrypt.compare(otp, storedHashedOTP);

        if (!isMatch) {

            if (attempts >= 2) { // 3 attempts limit
                alert("Too many incorrect attempts. Redirecting to Signup...");
                sessionStorage.removeItem('otp'); // Clear OTP
                sessionStorage.clear();
                navigate('/signup');
            } 
            else {
                setAttempts(attempts + 1);
                alert(`Incorrect OTP. Attempts left: ${2 - attempts}`);
            }

            navigate('/signup') ; 
        }else{
            // If OTP is correct, proceed
            alert("OTP Verified Successfully!");

            const userData = {
                name: sessionStorage.getItem("name"),
                username: sessionStorage.getItem("username"),
                phone: sessionStorage.getItem("phone"),
                email: sessionStorage.getItem("email"),
                password: sessionStorage.getItem("password"),
                address: sessionStorage.getItem("address")
            };

            console.log(userData) ; 
    
            try {
                const response = await axios.post('http://localhost:4000/auth/add-user',userData);
                console.log(response);
                if (response.status === 200) {
                    alert("Account Created Successfully!");
                    sessionStorage.clear(); // Clear all stored data after signup
                    navigate('/login');
                } else {
                    alert("Failed to create account. Please try again.");
                }
            } catch (error) {
                console.error("Error adding user:", error);
                alert("Server error. Please try again later.");
            }
            alert('Signed Up succesfully. Navigating to login page');

            sessionStorage.removeItem('otp');
            navigate('/login');
        }

        

        

        // add user 
         // Clear OTP after verification
        // navigate('/customer-home');=====\\\\\\\
    };

    return (
        <div className="container">
            <div className="background-image"></div>
            <div className="signup-container">
                <div className="logo-container">
                    <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                    <h1 className="logo-text">
                        <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                    </h1>
                </div>
                <div className="signup-form">
                    <h3>Verify Your Account</h3>
                    <form id="otp-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="otp"
                                placeholder="Enter 6-digit OTP..."
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                required
                            />
                        </div>
                        <button type="submit" className="signup-btn">
                            Verify OTP
                        </button>
                    </form>
                    <div className="form-footer">
                        <p>
                            Didn't receive OTP? <Link to="/resend-otp" className="form-link"> Resend OTP</Link>
                        </p>
                        <p>
                            <Link to="/login" className="form-link">Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;
