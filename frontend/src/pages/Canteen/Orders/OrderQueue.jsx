import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Canteen/Orders/order_queue.css';
import canteenService from '../../../services/canteenService';

// Icons import
import { FaSearch, FaChevronDown, FaEye, FaCheck, FaListAlt, FaSpinner, FaTruck, FaCalendarAlt, FaTimes } from 'react-icons/fa';
const API_BASE_URL = 'http://localhost:4000';

const OrderQueue = () => {
    // Menu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Sample user data
    const userData = {
        name: sessionStorage.getItem('user_name') || 'John Manager',
        email: sessionStorage.getItem('user_email') || 'john@example.com'
    };

    // Filter state
    const [filterValue, setFilterValue] = useState('All Orders');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    
    // Available filter options
    const filterOptions = ['All Orders', 'Waiting for Approval', 'Waiting for Payment', 'Cooking', 'Ready for Pickup/Delivery', 'Rejected/Failed'];
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    
    // Orders state
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Stats for order counts
    const [orderStats, setOrderStats] = useState({
        new: 0,
        inProgress: 0,
        cooking: 0,
        ready: 0,
        rejected: 0,
        total: 0
    });
    
    // Function to map order status from database to component's expected format
    const mapOrderStatus = (status) => {
        const numStatus = parseInt(status);
        console.log(`Mapping status code ${status} (${numStatus}) to label`);
        
        switch (numStatus) {
            case 0:
                return 'Rejected/Failed';
            case 1:
                return 'Waiting for Approval';
            case 2:
                return 'Waiting for Payment';
            case 3:
                return 'Cooking';
            case 4:
                return 'Ready for Pickup/Delivery';
            default:
                return 'Unknown';
        }
    };
    
    // Function to fetch orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Call the backend using the service
            const data = await canteenService.getOrderQueue();
            
            // Map the data to match our component's expected format if needed
            const formattedOrders = data.map(order => {
                console.log(`Original order status: ${order.status}`);
                const statusString = mapOrderStatus(order.status);
                console.log(`Mapped status: ${statusString}`);
                
                return {
                    order_id: order.order_id || '',
                    customer_name: order.customer_name || `Customer #${order.customer_id || 'Unknown'}`,
                    customer_id: order.customer_id || 0,
                    dishes: Array.isArray(order.dishes) ? order.dishes : [],
                    status: statusString,
                    raw_status: order.status,
                    bill_amount: order.bill_amount || 0,
                    discount_amount: order.discount_amount || 0,
                    final_amount: order.final_amount || 0,
                    is_delivery: order.is_delivery || false,
                    created_at: order.created_at || new Date().toISOString(),
                    payment_id: order.payment_id || '',
                    coupon_id: order.coupon_id || '',
                    customer_address: order.customer_address || 'No address provided'
                };
            });
            
            // Sort orders by status (new orders first)
            const sortedOrders = formattedOrders.sort((a, b) => {
                if (a.status === 'Waiting for Approval' && b.status !== 'Waiting for Approval') return -1;
                if (a.status !== 'Waiting for Approval' && b.status === 'Waiting for Approval') return 1;
                if (a.status === 'Waiting for Payment' && b.status !== 'Waiting for Payment') return -1;
                if (a.status !== 'Waiting for Payment' && b.status === 'Waiting for Payment') return 1;
                if (a.status === 'Cooking' && b.status !== 'Cooking') return -1;
                if (a.status !== 'Cooking' && b.status === 'Cooking') return 1;
                if (a.status === 'Ready for Pickup/Delivery' && b.status !== 'Ready for Pickup/Delivery') return -1;
                if (a.status !== 'Ready for Pickup/Delivery' && b.status === 'Ready for Pickup/Delivery') return 1;
                return 0;
            });
            
            setOrders(sortedOrders);
            
            // Update order stats
            const stats = {
                new: formattedOrders.filter(order => order.status === 'Waiting for Approval').length,
                inProgress: formattedOrders.filter(order => order.status === 'Waiting for Payment').length,
                cooking: formattedOrders.filter(order => order.status === 'Cooking').length,
                ready: formattedOrders.filter(order => order.status === 'Ready for Pickup/Delivery').length,
                rejected: formattedOrders.filter(order => order.status === 'Rejected/Failed').length,
                total: formattedOrders.length
            };
            
            setOrderStats(stats);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle accepting a new order
    const handleAcceptOrder = async (order_id) => {
        try {
            setLoading(true);
            const result = await canteenService.acceptOrder(order_id);
            
            if (result.success) {
                // Success notification
                alert(result.message);
                // Refresh orders after update
                fetchOrders();
            }
        } catch (err) {
            console.error('Error accepting order:', err);
            alert(err.message || 'Failed to accept the order. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle marking an order as ready
    const handleMarkOrderReady = async (order_id) => {
        try {
            setLoading(true);
            const result = await canteenService.markOrderReady(order_id);
            
            if (result.success) {
                // Success notification
                alert(result.message);
                // Refresh orders after update
                fetchOrders();
            }
        } catch (err) {
            console.error('Error marking order as ready:', err);
            alert(err.message || 'Failed to mark the order as ready. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle completing an order
    const handleCompleteOrder = async (order_id) => {
        try {
            setLoading(true);
            const result = await canteenService.markOrderReady(order_id);
            
            if (result.success) {
                // Success notification
                alert(result.message);
                // Refresh orders after update
                fetchOrders();
            }
        } catch (err) {
            console.error('Error completing order:', err);
            alert(err.message || 'Failed to complete the order. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle rejecting an order
    const handleRejectOrder = async (order_id) => {
        if (window.confirm('Are you sure you want to reject this order?')) {
            try {
                setLoading(true);
                const result = await canteenService.rejectOrder(order_id);
                
                if (result.success) {
                    // Success notification
                    alert(result.message);
                    // Refresh orders after update
                    fetchOrders();
                }
            } catch (err) {
                console.error('Error rejecting order:', err);
                alert(err.message || 'Failed to reject the order. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };
    
    // Filter orders based on search query and selected status
    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' || 
            order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.dishes.some(dish => dish.dish_name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = filterValue === 'All Orders' || order.status === filterValue;
        return matchesSearch && matchesStatus;
    });

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    
    // Handle filter selection
    const handleFilterSelect = (filter) => {
        setFilterValue(filter);
        setShowFilterDropdown(false);
    };

    // Toggle menu function
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Fetch orders on component mount and set interval
    useEffect(() => {
        // Initial fetch
        fetchOrders();
        
        // Debug existing orders
        console.log("Current orders status mapping:");
        orders.forEach(order => {
            console.log(`Order ${order.order_id}: Raw status = ${order.raw_status}, Mapped status = ${order.status}`);
        });
        
        // Set interval to fetch every 30 seconds
        const intervalId = setInterval(fetchOrders, 30000);
        
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [orders.length]);

    return (
        <div className="order-queue-container">
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
                        <li className="menu-item">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-menu-management"><i className="fas fa-utensils"></i> Menu Management</Link>
                        </li>
                        <li className="menu-item active">
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
            
            {/* Header/Navigation */}
            <header className="order-header">
                <button className="menu-btn" onClick={toggleMenu}>
                    <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                </button>
                <div className="logo-container">
                    <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-img" />
                    <h1 className="logo-text">
                        <span className="red-text">Quick</span>
                        <span className="yellow-text">Crave</span>
                    </h1>
                </div>

                <div className="header-actions">
                    {/* <div className="notification-bell">
                        <FaListAlt />
                        <span className="notification-badge">2</span>
                    </div> */}
                    <div className="user-profile">
                        <Link to="/canteen-manager-profile" className="user-avatar-link">
                            <img 
                                src="/images/user_default.png" 
                                alt={userData.name} 
                                className="user-avatar"
                                onError={(e) => { e.target.src = '/images/user_default.png' }} 
                            />
                            <span className="user-name">{userData.name}</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="order-content">
                {/* Top Section - Title and Search */}
                <div className="content-header">
                    <h2 className="page-title">Order Queue</h2>
                    <div className="filter-section">
                        <div className="search-bar">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by Customer Name, Order ID, Address, or dish name..."
                            />
                            <FaSearch className="search-icon" />
                        </div>
                        <div className="filter-dropdown" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                            <span>{filterValue}</span>
                            <FaChevronDown className="dropdown-icon" />
                            
                            {showFilterDropdown && (
                                <div className="dropdown-menu">
                                    {filterOptions.map(option => (
                                        <div 
                                            key={option} 
                                            className={`dropdown-item ${option === filterValue ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFilterSelect(option);
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Status Cards */}
                <div className="status-cards">
                    <div className="status-card new-orders">
                        <div className="card-info">
                            <span className="card-label">Waiting for Approval</span>
                            <span className="card-value">{orders.filter(order => order.status === 'Waiting for Approval').length}</span>
                        </div>
                        <div className="card-icon document-icon">
                            <FaListAlt />
                        </div>
                    </div>

                    <div className="status-card payment-pending">
                        <div className="card-info">
                            <span className="card-label">Waiting for Payment</span>
                            <span className="card-value">{orders.filter(order => order.status === 'Waiting for Payment').length}</span>
                        </div>
                        <div className="card-icon progress-icon">
                            <FaSpinner />
                        </div>
                    </div>

                    <div className="status-card cooking">
                        <div className="card-info">
                            <span className="card-label">Cooking</span>
                            <span className="card-value">{orders.filter(order => order.status === 'Cooking').length}</span>
                        </div>
                        <div className="card-icon ready-icon">
                            <FaSpinner />
                        </div>
                    </div>

                    <div className="status-card ready">
                        <div className="card-info">
                            <span className="card-label">Ready for Pickup/Delivery</span>
                            <span className="card-value">{orders.filter(order => order.status === 'Ready for Pickup/Delivery').length}</span>
                        </div>
                        <div className="card-icon complete-icon">
                            <FaCheck />
                        </div>
                    </div>

                    <div className="status-card total-today">
                        <div className="card-info">
                            <span className="card-label">Total Today</span>
                            <span className="card-value">{orderStats.total}</span>
                        </div>
                        <div className="card-icon total-icon">
                            <FaCalendarAlt />
                        </div>
                    </div>
                </div>

                {/* Active Orders */}
                <div className="active-orders-section">
                    <h3 className="section-title">Active Orders</h3>
                    
                    {loading ? (
                        <div className="loading-container">
                            <FaSpinner className="loading-spinner" />
                            <p>Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p>{error}</p>
                            <button onClick={fetchOrders} className="retry-btn">Retry</button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="no-orders-container">
                            {searchQuery ? (
                                <p>No orders found matching "{searchQuery}".</p>
                            ) : (
                                <p>No orders available at the moment.</p>
                            )}
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map(order => {
                                console.log(`Order ${order.order_id}: Status code ${order.status}`);
                                return (
                                    <div className="order-item" key={order.order_id}>
                                        <div className="order-details">
                                            <div className="order-header">
                                                <div className="order-id-container">
                                                    <span className="order-id">#{order.order_id}</span>
                                                    <span className={`order-status ${order.status.toLowerCase().replace(/[/ ]/g, '-')}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <span className="order-price">₹{order.final_amount.toFixed(2)}</span>
                                            </div>
                                            <div className="order-description">
                                                <span>
                                                    {console.log(`Order ${order.order_id} dishes:`, order.dishes)}
                                                    {Array.isArray(order.dishes) && order.dishes.length > 0 
                                                        ? order.dishes.map(dish => 
                                                            `${dish.quantity} x ${dish.dish_name}`
                                                          ).join(', ')
                                                        : "No items"
                                                    }                                                
                                                </span>
                                            </div>
                                            <div className="order-footer">
                                                <div className="customer-info">
                                                    <img 
                                                        src="/images/user_default.png" 
                                                        alt="Customer" 
                                                        className="customer-avatar"
                                                    />
                                                    <span className="customer-name">{order.customer_name}</span>
                                                </div>
                                                <span className="order-address">{order.customer_address}</span>
                                            </div>
                                        </div>
                                        <div className="order-actions">
                                            {order.status === 'Waiting for Approval' && (
                                                <>
                                                    <button 
                                                        className="action-btn accept-btn"
                                                        onClick={() => handleAcceptOrder(order.order_id)}
                                                    >
                                                        <FaCheck />
                                                        <span>Accept Order</span>
                                                    </button>
                                                    
                                                    <button 
                                                        className="action-btn reject-btn"
                                                        onClick={() => handleRejectOrder(order.order_id)}
                                                    >
                                                        <FaTimes />
                                                        <span>Reject Order</span>
                                                    </button>
                                                </>
                                            )}
                                            
                                            {order.status === 'Waiting for Payment' && (
                                                <button 
                                                    className="action-btn payment-btn"
                                                    disabled
                                                >
                                                    <FaSpinner />
                                                    <span>Waiting for Payment</span>
                                                </button>
                                            )}
                                            
                                            {order.status === 'Cooking' && (
                                                <button 
                                                    className="action-btn complete-btn"
                                                    onClick={() => handleCompleteOrder(order.order_id)}
                                                >
                                                    <FaTruck />
                                                    <span>Mark as Ready</span>
                                                </button>
                                            )}

                                            {order.status === 'Ready for Pickup/Delivery' && (
                                                <button 
                                                    className="action-btn ready-btn"
                                                    disabled
                                                >
                                                    <FaCheck />
                                                    <span>Ready for Pickup/Delivery</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderQueue;