import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Canteen/canteen_manager_home.css';

const CanteenManagerHome = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState({
        name: sessionStorage.getItem('user_name') || 'Business Owner',
        email: sessionStorage.getItem('user_email') || 'business@example.com'
    });

    // Use useEffect to load user data when component mounts
    useEffect(() => {
        const userName = sessionStorage.getItem('user_name');
        const userEmail = sessionStorage.getItem('user_email');
        
        if (userName && userEmail) {
            setUserData({
                name: userName,
                email: userEmail
            });
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="canteen-home-container">
            {/* Side Menu Overlay */}
            <div 
                className={`side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
            ></div>

            {/* Side Menu */}
            <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="side-menu-header">
                    <button className="close-menu-btn" onClick={toggleMenu}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="menu-user-info">
                        <Link to="/canteen-manager-profile" className="menu-user-avatar-link">
                            <div className="menu-user-avatar">
                                <img src="/images/business_avatar.png" alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                        <div className="menu-user-details">
                            <h3 className="menu-user-name">{userData.name}</h3>
                            <p className="menu-user-email">{userData.email}</p>
                        </div>
                    </div>
                </div>
                <div className="side-menu-content">
                    <ul className="menu-items">
                        <li className="menu-item active">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-menu-management"><i className="fas fa-utensils"></i> Menu Management</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-orders"><i className="fas fa-clipboard-list"></i> Order Queue</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-discounts"><i className="fas fa-tags"></i> Discounts</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-reservations"><i className="fas fa-calendar-alt"></i> Reservations</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-statistics"><i className="fas fa-chart-line"></i> Statistics</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/login"><i className="fas fa-sign-out-alt"></i> Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Navigation Bar */}
                <div className="top-nav">
                    <button className="menu-btn" onClick={toggleMenu}>
                        <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                    </button>
                    <div className="logo-container">
                        <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                        <h1 className="logo-text">
                            <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                        </h1>
                    </div>
                    <div className="user-profile">
                        <Link to="/canteen-manager-profile" className="user-avatar-link">
                            <div className="user-avatar" id="userAvatar">
                                <img src="/images/business_avatar.png" alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Orders Cards */}
                <div className="dashboard-cards">
                    {/* Order Queues Card */}
                    <Link to="/manage-orders" className="card-link">
                        <div className="dashboard-card">
                            <h3 className="card-title">MANAGE ORDER QUEUES</h3>
                            <div className="card-content">
                                <div className="card-stats">
                                    <p>ORDERS IN QUEUE: 5</p>
                                    <p>PENDING REQUESTS: 2</p>
                                </div>
                                <div className="card-icon" style={{ width: "130px", height: "130px" }}>
                                    <img src="/images/manage_order_queues.png" alt="Order Queue" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = 'https://via.placeholder.com/130x130/f5f5f5/e53935?text=Orders' }} />
                                </div>
                                <div className="card-action-btn">
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Discounts Card */}
                    <Link to="/manage-discounts" className="card-link">
                        <div className="dashboard-card">
                            <h3 className="card-title">DISCOUNTS AND COUPONS</h3>
                            <div className="card-content">
                                <div className="card-stats">
                                    <p>ACTIVE COUPONS: 3</p>
                                    <p>SET DISCOUNTS: 4</p>
                                </div>
                                <div className="card-icon" style={{ width: "130px", height: "130px" }}>
                                    <img src="/images/discounts_and_coupons.png" alt="Discounts" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = 'https://via.placeholder.com/130x130/f5f5f5/fdd835?text=Discounts' }} />
                                </div>
                                <div className="card-action-btn">
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </Link>

                    

                    {/* Reservations Card */}
                    <Link to="/manage-reservations" className="card-link">
                        <div className="dashboard-card">
                            <h3 className="card-title">MANAGE RESERVATIONS</h3>
                            <div className="card-content">
                                <div className="card-stats">
                                    <p>PENDING: 3</p>
                                    <p>CONFIRMED: 8</p>
                                </div>
                                <div className="card-icon" style={{ width: "130px", height: "130px" }}>
                                    <img src="/images/reservations.png" alt="Reservations" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = 'https://via.placeholder.com/130x130/f5f5f5/2196f3?text=Reservations' }} />
                                </div>
                                <div className="card-action-btn">
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </Link>

                </div>

                {/* Trending Picks Section */}
                <div className="trending-section">
                    <h2 className="section-title">Trending Picks</h2>
                    <div className="trending-items">
                        <div className="trending-item">
                            <div className="trending-image">
                                <img src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Tandoori Chicken" onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Food1' }} />
                            </div>
                        </div>
                        <div className="trending-item">
                            <div className="trending-image">
                                <img src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="French Fries" onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Food2' }} />
                            </div>
                        </div>
                        <div className="trending-item">
                            <div className="trending-image">
                                <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Burger" onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Food3' }} />
                            </div>
                        </div>
                        <div className="trending-item">
                            <div className="trending-image">
                                <img src="https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Peanut Butter Sandwich" onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Food4' }} />
                            </div>
                            <div className="trending-label">Orders: 30</div>
                        </div>
                        <div className="trending-item">
                            <div className="trending-image">
                                <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Biryani" onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Food5' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CanteenManagerHome; 