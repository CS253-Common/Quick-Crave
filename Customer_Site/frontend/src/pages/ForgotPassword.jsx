import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import '../styles/login.css'; // Import the CSS file

const ForgotPassword = () => {
    const [userType, setUserType] = useState('customer'); // Default user type
    const [username, setUsername] = useState('');
    const [email, setemail] = useState('');
    const [message, setMessage] = useState('');

    const handleUserTypeChange = (type) => {
        setUserType(type);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!username || !email) {
            alert('Please enter your username or email');
            return;
        }

        // Check if username exists in localStorage
        const userDataString = localStorage.getItem(`user_${username}`);

        if (!userDataString) {
            setMessage('Username or email not found. Please try again.');
            return;
        }

        // For demo purposes, we'll just show a success message
        setMessage(`Password reset instructions have been sent to the email associated with ${username}.`);

        // Clear the input field
        setUsername('');
    };

    return (
        <div className="container">
            <div className="background-image"></div>
            <div className="signup-container">
            <Link to="/customer-home" className="logo-link">
              <div className="logo-container">
                  <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                  <h1 className="logo-text">
                      <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                  </h1>
              </div>
            </Link>
                <div className="signup-form">
                    <h2>Forgot Password</h2>
                    <form id="forgot-password-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                placeholder={
                                        'Enter your username...'
                                }
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                placeholder={
                                        'Enter your email...'
                                }
                                value={email}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="signup-btn">
                            Reset Password
                        </button>
                    </form>
                    {message && <p className="message">{message}</p>}
                    <div className="form-footer">
                        <p>
                            Remember your password? <Link to="/login" className="form-link">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;