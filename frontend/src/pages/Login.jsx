import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/login.css'; // Import the CSS file
import axios from 'axios';

axios.defaults.withCredentials = true;

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userType: 'customer',
        username: '',
        password: ''
    });

    const handleUserTypeChange = (type) => {
        setForm(form => ({ ...form, userType: type }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!form.username || !form.password) {
            alert('Please fill in all fields');
            return;
        }
        try{
            const result = await axios.post('http://localhost:4000/auth/login',form);

            // alert('Yahan tk aa gaya 30');
            if(result.status === 200){
                sessionStorage.setItem('name',result.data.name)
                sessionStorage.setItem('phone_number',result.data.phone_number)
                sessionStorage.setItem('email',result.data.email)

                if(form.userType==='customer'){
                    // alert('IF me aaya');
                    sessionStorage.setItem('wallet_balance',result.data.wallet_balance) ; 
                }
                else{
                    sessionStorage.setItem('opening_time',result.data.opening_time)
                    sessionStorage.setItem('closing_time' , result.data.closint_time) 
                    sessionStorage.setItem('opening_status',result.data.opening_status)
                    sessionStorage.setItem('rating',result.data.rating)
                    sessionStorage.setItem('auto_accept',result.data.auto_accept)
                }
            // For demo purposes, we'll just show a success message
            alert(`Login successful as ${form.userType}!`);
    
            // Redirect to the appropriate dashboard based on user type
            if (form.userType === 'customer') {
               navigate('/customer-home');
            } else if (form.userType === 'canteen-manager') {
               navigate('/canteen-manager-home');
            }
            }
            else if(result.status === 401){
    
            }
            else{
    
            }
        }
        catch(err){
            console.log(err.message);
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
                    <h2>Log In to Quick Crave</h2>
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
                    <form id="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                placeholder={form.userType === 'canteen-manager' ? 'Enter business username...' : 'Enter your username...'}
                                value={form.username}
                                onChange={(e) => setForm(form => ({ ...form, username: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                placeholder={form.userType === 'canteen-manager' ? 'Enter business password...' : 'Enter your password...'}
                                value={form.password}
                                onChange={(e) => setForm(form => ({...form, password: e.target.value}))}
                                required
                            />
                        </div>
                        <button type="submit" className="signup-btn">
                            Login
                        </button>
                    </form>
                    <div className="form-footer">
                        <p>
                            Don't have an account? <Link to="/signup" className="form-link">Sign Up</Link>
                        </p>
                        <p>
                            <Link to="/forgot-password" className="form-link">Forgot Password?</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
