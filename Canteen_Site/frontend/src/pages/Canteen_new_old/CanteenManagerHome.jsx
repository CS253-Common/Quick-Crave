import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Canteen/canteen_manager_home.css';
import canteenService from '../../services/canteenService';

// Add custom style tag to reduce card value sizes
const customStyles = `
  .card .card-value {
    font-size: 1.8rem !important;
    font-weight: 600 !important;
  }
  .card-stats span {
    font-size: 18px !important;
    font-weight: 600 !important;
  }
  .card-stats p {
    font-size: 14px !important;
  }
`;

const CanteenManagerHome = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState({
        name: sessionStorage.getItem('user_name') || 'Business Owner',
        email: sessionStorage.getItem('user_email') || 'business@example.com'
    });
    
    // States for dashboard data
    const [orderQueueData, setOrderQueueData] = useState({
        orders_in_queue: 0,
        pending_orders: 0,
        loading: true,
        error: null
    });
    
    const [trendingData, setTrendingData] = useState({
        items: [],
        loading: true,
        error: null
    });
    
    const [discountData, setDiscountData] = useState({
        active_coupons: 0,
        active_discounts: 0,
        loading: true,
        error: null
    });
    
    const [reservationData, setReservationData] = useState({
        pending: 0,
        confirmed: 0,
        loading: true,
        error: null
    });

    // Use useEffect to load user data and dashboard data when component mounts
    useEffect(() => {
        const userName = sessionStorage.getItem('user_name');
        const userEmail = sessionStorage.getItem('user_email');
        
        if (userName && userEmail) {
            setUserData({
                name: userName,
                email: userEmail
            });
        }
        
        // Make sure canteen_id is set in sessionStorage for API calls
        if (!sessionStorage.getItem('canteen_id')) {
            // For testing purposes, set a default canteen_id 
            sessionStorage.setItem('canteen_id', '1');
        }
        
        // Fetch all dashboard data
        fetchOrderQueueData();
        fetchDiscountData();
        fetchReservationData();
        fetchTrendingPicks();
    }, []);
    
    // Function to fetch order queue data
    const fetchOrderQueueData = async () => {
        try {
            setOrderQueueData(prev => ({ ...prev, loading: true, error: null }));
            const data = await canteenService.getHomeOrderQueue();
            
            setOrderQueueData({
                orders_in_queue: data.orders_in_queue || 0,
                pending_orders: data.pending_orders || 0,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching order queue data:', error);
            setOrderQueueData(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load order queue data'
            }));
        }
    };

    // Function to fetch discount data
    const fetchDiscountData = async () => {
        try {
            setDiscountData(prev => ({ ...prev, loading: true, error: null }));
            const data = await canteenService.getHomeDiscountData();
            
            setDiscountData({
                active_coupons: data.active_coupons || 0,
                active_discounts: data.active_discounts || 0,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching discount data:', error);
            setDiscountData(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load discount data'
            }));
        }
    };

    // Function to fetch reservation data
    const fetchReservationData = async () => {
        try {
            setReservationData(prev => ({ ...prev, loading: true, error: null }));
            const data = await canteenService.getHomeReservationData();
            
            setReservationData({
                pending: data.pending || 0,
                confirmed: data.confirmed || 0,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching reservation data:', error);
            setReservationData(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load reservation data'
            }));
        }
    };
    
    // Function to fetch trending picks data
    const fetchTrendingPicks = async () => {
        try {
            setTrendingData(prev => ({ ...prev, loading: true, error: null }));
            const data = await canteenService.getTrendingPicks();
            
            setTrendingData({
                items: data.items || [],
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching trending picks:', error);
            setTrendingData(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load trending picks'
            }));
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="canteen-home-container">
            {/* Add style tag to document head */}
            <style>{customStyles}</style>

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
                                    {orderQueueData.loading ? (
                                        <div className="text-center">
                                            <p className="loading-text">Loading order queue data...</p>
                                            <div className="loading-spinner"></div>
                                        </div>
                                    ) : orderQueueData.error ? (
                                        <p className="error-text">{orderQueueData.error}</p>
                                    ) : (
                                        <>
                                            <p>ORDERS IN QUEUE: <span style={{ fontSize: "20px", color: "#e53935", fontWeight: "bold" }}>{orderQueueData.orders_in_queue}</span></p>
                                            <p>PENDING REQUESTS: <span style={{ fontSize: "20px", color: "#e53935", fontWeight: "bold" }}>{orderQueueData.pending_orders}</span></p>
                                        </>
                                    )}
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
                                    {discountData.loading ? (
                                        <div className="text-center">
                                            <p className="loading-text">Loading discount data...</p>
                                            <div className="loading-spinner"></div>
                                        </div>
                                    ) : discountData.error ? (
                                        <p className="error-text">{discountData.error}</p>
                                    ) : (
                                        <>
                                            <p>ACTIVE COUPONS: <span style={{ fontSize: "20px", color: "#e53935", fontWeight: "bold" }}>{discountData.active_coupons}</span></p>
                                            <p>SET DISCOUNTS: <span style={{ fontSize: "20px", color: "#e53935", fontWeight: "bold" }}>{discountData.active_discounts}</span></p>
                                        </>
                                    )}
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
                                    {reservationData.loading ? (
                                        <div className="text-center">
                                            <p className="loading-text">Loading reservation data...</p>
                                            <div className="loading-spinner"></div>
                                        </div>
                                    ) : reservationData.error ? (
                                        <p className="error-text">{reservationData.error}</p>
                                    ) : (
                                        <>
                                            <p>PENDING: <span style={{ fontSize: "20px", color: "#e53935", fontWeight: "bold" }}>{reservationData.pending}</span></p>
                                            <p>CONFIRMED: <span style={{ fontSize: "20px", color: "#e53935", fontWeight: "bold" }}>{reservationData.confirmed}</span></p>
                                        </>
                                    )}
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
                    {trendingData.loading ? (
                        <div className="text-center">
                            <p className="loading-text" style={{ color: "#777" }}>Loading trending picks...</p>
                            <div className="loading-spinner"></div>
                        </div>
                    ) : trendingData.error ? (
                        <p className="error-text" style={{ color: "#e53935", textAlign: "center" }}>{trendingData.error}</p>
                    ) : (
                        <div className="trending-items">
                            {trendingData.items.map((item, index) => (
                                <div className="trending-item" key={item.id || index}>
                                    <div className="trending-image">
                                        <img 
                                            src={item.image_url} 
                                            alt={item.name} 
                                            onError={(e) => { 
                                                e.target.src = `https://via.placeholder.com/100x100/f5f5f5/e53935?text=${encodeURIComponent(item.name)}`;
                                            }} 
                                        />
                                    </div>
                                    <div className="trending-label">Orders: {item.orders}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CanteenManagerHome; 