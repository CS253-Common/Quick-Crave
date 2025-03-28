import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/login.css'; // Import the CSS file
// import bcrypt from 'bcrypt';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate(); // Initialize navigate

    const [form,setForm] = useState({userType:'customer',name:'',username:'',phone:'',email:'',password:'',confirmPassword:''});

    const handleUserTypeChange = (type) => {
        // setUserType(type);
        setForm(prevForm => ({...prevForm,userType:type}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate form
        if (!form.name || !form.username || !form.phone || !form.email || !form.password || !form.confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
    
        // Check if passwords match
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Check if the phone number is of 10 digits 
        if(form.phone.length !== 10 ){
            alert("Phone number should be off 10 characters!");
        }
        
        //remember to hash the password before sending for authentication
        
        // // Check if username already exists
        // if (localStorage.getItem(`user_${username}`)) {
        //     alert('Username already exists. Please choose a different username.');
        //     return;
        // }
        
        //sending request to backend
        try {
            const result = await axios.post('http://localhost:4000/auth/signup',form);
            if(result.status === 200){
                // For demo purposes, we'll just show a success message
                alert(`Signup successful as ${form.userType}!`);
            
                // Redirect based on user type - using React Router's navigate
                if (form.userType === 'canteen-manager') {
                    navigate('/canteen-verification'); // Use navigate instead of window.location
                } else {
                    navigate('/login'); // Use navigate instead of window.location
                }
            }
            // else if(result.status === 401){
            //     alert("Sasti Raand!") ;
            // }
            
        } catch (error) {
            alert("Username already exists!") ;
            console.log(error.message);
        }

        // Save user data to localStorage
        // const userData = {
        //     userType: form.userType,
        //     name: form.name,
        //     username: form.username,
        //     phone: form.phone,
        //     email: form.email,
        //     password: form.password
        // };
        
    
        // localStorage.setItem(`user_${form.username}`, JSON.stringify(form.userData));
    
        // For demo purposes, we'll just show a success message
        // alert(`Signup successful as ${form.userType}!`);
    
        // // Redirect based on user type - using React Router's navigate
        // if (form.userType === 'canteen-manager') {
        //     navigate('/canteen-verification'); // Use navigate instead of window.location
        // } else {
        //     navigate('/login'); // Use navigate instead of window.location
        // }
    };

    return (
        <div className="container">
            <div className="background-image"></div>
            <div className="signup-container">
                    <div className="logo">
                        <img src="/images/logo.jpg" alt="Quick Crave Logo" className="logo-image" />
                        <h1 className="logo-text">
                            <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                        </h1>
                    </div>
                <div className="signup-form">
                    <h2>Welcome to Quick Crave</h2>
                    <div className="user-type-selector">
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
                    </div>
                    <form id="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="name"
                                placeholder = {form.userType === 'customer' ? 'Enter your name... ' : 'Enter your name...'}
                                value={form.name}
                                onChange={(e) => setForm(prevForm => ({ ...prevForm, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                placeholder= { form.userType === 'customer' ? "Choose a username..." : "Enter canteen name..."}
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