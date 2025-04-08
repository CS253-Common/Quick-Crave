    import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

// axios.defaults.withCredentials = true;

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


const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userType: 'customer',
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUserTypeChange = (type) => {
        setForm(form => ({ ...form, userType: type }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error messages

        // Validate form
        if (!form.username || !form.password) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        try {
            // alert('Login call ho rha hai');
            const result = await axios.post('http://localhost:4000/auth/login', form, {
                withCredentials: true 
            });
            // alert('Mai aa gaya');
            if(result.status === 200){
                // console.log(result);
                sessionStorage.setItem('name',result.data.name)
                sessionStorage.setItem('phone_number',result.data.phone_number)
                sessionStorage.setItem('email',result.data.email)
                sessionStorage.setItem('JWT_TOKEN' , result.data.token);
                sessionStorage.setItem('img_url',result.data.img_url);
                sessionStorage.setItem('address',result.data.address);
                sessionStorage.setItem('wallet_balance',result.data.wallet_balance);

                showNotification(`Login successful as ${form.userType}!`, "success");
                navigate('/customer-home');
            }
        }
        catch(err) {
            // alert(err.message);
            // console.log(err);
            if (err.response && err.response.status === 401) {
                showNotification('Wrong username or password', "error");
                // showNotification
            } else {
                showNotification('An error occurred during login. Please try again.', "error");
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
                    <h2>Log In to Quick Crave</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <form id="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                placeholder='Enter your username...'
                                value={form.username}
                                onChange={(e) => setForm(form => ({ ...form, username: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder='Enter your password...'
                                value={form.password}
                                onChange={(e) => setForm(form => ({...form, password: e.target.value}))}
                                required
                            />
                            <span 
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
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