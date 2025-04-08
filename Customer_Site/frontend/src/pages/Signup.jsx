import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/login.css'; // Import the CSS file
import bcrypt from 'bcryptjs';
import axios from 'axios';

const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `cp-notification cp-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
};

const Signup = () => {
    const navigate = useNavigate(); // Initialize navigate

    const [form,setForm] = useState({userType:'customer',name:'',username:'',phone:'',email:'',password:'',confirmPassword:'', address:''});

    const handleUserTypeChange = (type) => {
        // setUserType(type);
        setForm(prevForm => ({...prevForm,userType:type}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate form
        if (!form.name || !form.username || !form.phone || !form.email || !form.password || !form.confirmPassword || !form.address) {
            alert('Please fill in all fields');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
        showNotification('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character', 'error');
        return;
    }
    
        // Check if passwords match
        if (form.password !== form.confirmPassword) {
            showNotification('Passwords do not match', "error");
            return;
        }

        // Check if the phone number is of 10 digits 
        if(form.phone.length !== 10 ){
            showNotification("Phone number should be off 10 characters!", "error");
            return ; 
        }
        
        //sending request to backend
        try {    
            const result = await axios.post('http://localhost:4000/auth/signup',form);
            // alert(result.status);
            // console.log("Kya dikkat hai") ;
            // console.log(result) ;
            if(result.status===200){
                if(form.userType==='customer'){
                    sessionStorage.setItem("otp",result.data.otp); // this otp is hashed
                    sessionStorage.setItem("userType",form.userType);
                    sessionStorage.setItem("name",form.name);
                    sessionStorage.setItem("username",form.username);
                    sessionStorage.setItem("phone",form.phone);
                    sessionStorage.setItem("email",form.email);
                    sessionStorage.setItem("password",result.data.hashed_pwd);
                    sessionStorage.setItem("address",form.address);

                    // alert('You are being redirected to otp verification page.');
                    showNotification("You are being redirected to otp verification page.", "success") ; 
                    navigate('/otp');
                }
                else{
                    showNotification('Wrong user type.', "error");
                }
            }else{
                showNotification(result.error, "error");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // alert(error.response.data.message);
                showNotification(error.response.data.message, "error") ; 
            } else {
                showNotification("An unexpected error occurred. Please try again.", "error");
            }
        }

    };

    return (
        <div className="container">
            <div className="background-image"></div>
            <div className="signup-container">
                    <div className="logo-container">
                        <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                        <h1 className="logo-text">
                            <p1 className="red-text">Quick</p1> <p1 className="yellow-text">Crave</p1>
                        </h1>
                    </div>
                <div className="signup-form">
                    <h2>Welcome to Quick Crave</h2>
                    {/* <div className="user-type-selector">
                        <button
                            className={`user-type-btn ${form.userType === 'customer' ? 'active' : ''}`}
                            onClick={() => handleUserTypeChange('customer')}
                        >
                            Customer
                        </button>
                        <button
                            className={`user-type-btn ${form.userType === 'canteen-manager' ? 'active' : ''}`}
                            onClick={() => handleUserTypeChange('canteen-manager')}
                        >
                            Canteen Manager
                        </button>
                    </div> */}
                    <form id="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="name"
                                placeholder = 'Enter your name...'
                                value={form.name}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                placeholder= "Choose a username..."
                                value={form.username}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, username: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                id="phone"
                                placeholder="Enter your phone number..."
                                value={form.phone}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, phone: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="address"
                                placeholder= "Enter your address..."
                                value={form.address}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, address: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email address..."
                                value={form.email}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, email: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                placeholder="Create a password..."
                                value={form.password}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, password: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="confirm-password"
                                placeholder="Confirm your password..."
                                value={form.confirmPassword}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, confirmPassword: e.target.value }))}
                                required
                            />
                        </div>
                        <button type="submit" className="signup-btn">
                            Sign Up
                        </button>
                    </form>
                    <div className="form-footer">
                        <p>
                            Already have an account? <Link to="/login" className="form-link">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;