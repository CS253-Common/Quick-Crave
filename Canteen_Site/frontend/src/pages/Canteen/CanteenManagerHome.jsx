import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Canteen/canteen_manager_home.css';
import canteenService from '../../services/canteenService';

// Add custom style tag to reduce card value sizes
const customStyles = `
  .cm-card .cm-card-value {
    font-size: 1.8rem !important;
    font-weight: 600 !important;
  }
  .cm-card-stats span {
    font-size: 18px !important;
    font-weight: 600 !important;
  }
  .cm-card-stats p {
    font-size: 14px !important;
  }
`;

const CanteenManagerHome = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState({
        username: sessionStorage.getItem('username') || 'Business Owner',
        name: sessionStorage.getItem('name') || 'Business Owner'
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
        const username = sessionStorage.getItem('username');
        const name = sessionStorage.getItem('name');
        
        if (username && name) {
            setUserData({
                name: name,
                username: username
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

        const interval = setInterval(() => {
            fetchOrderQueueData();
            fetchDiscountData();
            fetchReservationData();
            fetchTrendingPicks();
        }, 30000);

        return () => clearInterval(interval);
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
            console.log('tmkc',data);
            setReservationData({
                pending: data.pending_reservations || 0,
                confirmed: data.confirmed_reservations || 0,
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
        <div className="cm-canteen-home-container">
            {/* Add style tag to document head */}
            <style>{customStyles}</style>

            {/* Side Menu Overlay */}
            <div 
                className={`cm-side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
            ></div>

            {/* Side Menu */}
            <div className={`cm-side-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="cm-side-menu-header">
                    <button className="cm-close-menu-btn" onClick={toggleMenu}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="cm-menu-user-info">
                        <Link to="/canteen-manager-profile" className="cm-menu-user-avatar-link">
                            <div className="cm-menu-user-avatar">
                                <img src="/images/business_avatar.png" alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                        <div className="cm-menu-user-details">
                            <h3 className="cm-menu-user-name">{userData.name}</h3>
                            <p className="cm-menu-user-email">{userData.username}</p>
                        </div>
                    </div>
                </div>
                <div className="cm-side-menu-content">
                    <ul className="cm-menu-items">
                        <li className="cm-menu-item active">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/canteen-menu-management"><i className="fas fa-utensils"></i> Menu Management</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-orders"><i className="fas fa-clipboard-list"></i> Order Queue</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-discounts"><i className="fas fa-tags"></i> Discounts</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-reservations"><i className="fas fa-calendar-alt"></i> Reservations</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/canteen-statistics"><i className="fas fa-chart-line"></i> Statistics</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/login"><i className="fas fa-sign-out-alt"></i> Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="cm-main-content">
                {/* Top Navigation Bar */}
                <div className="cm-top-nav">
                    <button className="cm-menu-btn" onClick={toggleMenu}>
                        <img src="/images/side_menu.png" alt="Menu Logo" className="cm-menu-logo" />
                    </button>
                    <div className="cm-logo-container">
                        <Link to="/canteen-manager-home" className="logo-link" style={{display: 'flex', alignItems: 'center'}}>
                            <img src="/images/logo.png" alt="Quick Crave Logo" className="cm-logo-image" />
                            <h1 className="cm-logo-text">
                                <span className="cm-red-text">Quick</span> <span className="cm-yellow-text">Crave</span>
                            </h1>
                        </Link>
                    </div>
                    <div className="cm-user-profile">
                        <Link to="/canteen-manager-profile" className="cm-user-avatar-link">
                            <div className="cm-user-avatar" id="userAvatar">
                                <img src="/images/business_avatar.png" alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="cm-dashboard-cards">
                    <Link to="/manage-orders" className="cm-card-link">
                        <div className="cm-dashboard-card">
                            <h3 className="cm-card-title">Order Queue</h3>
                            <div className="cm-card-content">
                                <div className="cm-card-stats">
                                    {orderQueueData.loading ? (
                                        <div className="cm-loading-text"><div className="cm-loading-spinner"></div> Loading...</div>
                                    ) : orderQueueData.error ? (
                                        <div className="cm-error-text">{orderQueueData.error}</div>
                                    ) : (
                                        <>
                                            <p>Orders in queue <span>{orderQueueData.orders_in_queue}</span></p>
                                            <p>Pending acceptance <span>{orderQueueData.pending_orders}</span></p>
                                        </>
                                    )}
                                </div>
                                <div className="cm-card-icon">
                                    <img src="/images/manage_order_queues.png" alt="Order Queue" 
                                         onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/130x130/f5f5f5/e53935?text=Orders' }} />
                                </div>
                            </div>
                            <div className="cm-text-center">
                                <span className="cm-card-action-btn">&#10142;</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/manage-reservations" className="cm-card-link">
                        <div className="cm-dashboard-card">
                            <h3 className="cm-card-title">Reservations</h3>
                            <div className="cm-card-content">
                                <div className="cm-card-stats">
                                    {reservationData.loading ? (
                                        <div className="cm-loading-text"><div className="cm-loading-spinner"></div> Loading...</div>
                                    ) : reservationData.error ? (
                                        <div className="cm-error-text">{reservationData.error}</div>
                                    ) : (
                                        <>
                                            <p>Pending requests <span>{reservationData.pending}</span></p>
                                            <p>Confirmed today <span>{reservationData.confirmed}</span></p>
                                        </>
                                    )}
                                </div>
                                <div className="cm-card-icon">
                                    <img src="/images/reservations.png" alt="Reservations" 
                                         onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/130x130/f5f5f5/2196f3?text=Reservations' }} />
                                </div>
                            </div>
                            <div className="cm-text-center">
                                <span className="cm-card-action-btn">&#10142;</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/manage-discounts" className="cm-card-link">
                        <div className="cm-dashboard-card">
                            <h3 className="cm-card-title">Discounts & Coupons</h3>
                            <div className="cm-card-content">
                                <div className="cm-card-stats">
                                    {discountData.loading ? (
                                        <div className="cm-loading-text"><div className="cm-loading-spinner"></div> Loading...</div>
                                    ) : discountData.error ? (
                                        <div className="cm-error-text">{discountData.error}</div>
                                    ) : (
                                        <>
                                            <p>Active discounts <span>{discountData.active_discounts}</span></p>
                                            <p>Active coupons <span>{discountData.active_coupons}</span></p>
                                        </>
                                    )}
                                </div>
                                <div className="cm-card-icon">
                                    <img src="/images/discounts_and_coupons.png" alt="Discounts" 
                                         onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/130x130/f5f5f5/fdd835?text=Discounts' }} />
                                </div>
                            </div>
                            <div className="cm-text-center">
                                <span className="cm-card-action-btn">&#10142;</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Trending Items Section */}
                <div className="cm-trending-section">
                    <h3 className="cm-section-title">Trending Picks</h3>
                    
                    {trendingData.loading ? (
                        <div className="cm-loading-text"><div className="cm-loading-spinner"></div> Loading trending items...</div>
                    ) : trendingData.error ? (
                        <div className="cm-error-text">{trendingData.error}</div>
                    ) : trendingData.items.length === 0 ? (
                        <p className="cm-text-center">No trending items to display.</p>
                    ) : (
                        <div className="cm-trending-items">
                            {trendingData.items.map((item, index) => (
                                <Link to="/canteen-menu-management" key={index} className="cm-trending-item">
                                    <div className="cm-trending-image">
                                        <img src={item.img_url || "https://via.placeholder.com/200x120/f5f5f5/e53935?text=Food"} alt={item.dish_name} 
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200x120/f5f5f5/e53935?text=Food' }} />
                                    </div>
                                    <div className="cm-trending-label">{item.dish_name}</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CanteenManagerHome; 