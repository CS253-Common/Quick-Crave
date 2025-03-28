import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartBar, FaUtensils, FaShoppingCart, FaUsers, FaTimes, FaSignOutAlt, FaCog, FaBars } from 'react-icons/fa';
import '../../../styles/Canteen/Statistics/canteen_statistics.css';

const CanteenStatistics = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTimeFrame, setActiveTimeFrame] = useState('monthly');
    
    // User data state for sidebar
    const [userData, setUserData] = useState({
        name: sessionStorage.getItem('user_name') || 'Canteen Manager',
        email: sessionStorage.getItem('user_email') || 'manager@quickcrave.com'
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Sample data for statistics
    const statisticsData = {
        totalSales: '$12,845',
        totalSalesGrowth: '12.5% from last month',
        totalOrders: 486,
        totalOrdersGrowth: '8.2% from last month',
        avgOrderValue: '$26.45',
        avgOrderGrowth: '5.1% from last month',
        totalCustomers: 1284,
        totalCustomersGrowth: '10.5% from last month',
        popularItems: [
            { name: 'Classic Burger', orders: 342, price: '$8.99', image: '/images/food/burger.jpg' },
            { name: 'Margherita Pizza', orders: 275, price: '$12.99', image: '/images/food/pizza.jpg' },
            { name: 'Caesar Salad', orders: 208, price: '$7.99', image: '/images/food/salad.jpg' }
        ],
        recentOrders: [
            { customer: 'Sarah Wilson', items: 2, total: '$24.98', status: 'Completed', image: '/images/users/user1.jpg' },
            { customer: 'Mike Johnson', items: 1, total: '$12.99', status: 'Preparing', image: '/images/users/user2.jpg' },
            { customer: 'Emma Davis', items: 3, total: '$32.50', status: 'New', image: '/images/users/user3.jpg' }
        ]
    };

    return (
        <div className="statistics-container">
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
                        <li className="menu-item">
                            <Link to="/manage-orders"><i className="fas fa-clipboard-list"></i> Order Queue</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-discounts"><i className="fas fa-tags"></i> Discounts</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-reservations"><i className="fas fa-calendar-alt"></i> Reservations</Link>
                        </li>
                        <li className="menu-item active">
                            <Link to="/canteen-statistics"><i className="fas fa-chart-line"></i> Statistics</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/login"><i className="fas fa-sign-out-alt"></i> Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="statistics-main-content">
                {/* Header */}
                <header className="statistics-header">
                    <div className="left-section">
                        <button className="menu-toggle-btn" onClick={toggleMenu}>
                            <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                        </button>
                        <div className="logo-container">
                            <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                            <div className="logo-text">
                                <span className="red-text">Quick</span> 
                                <span className="yellow-text">Crave</span>
                            </div>
                        </div>
                    </div>
                    <div className="user-profile">
                        <Link to="/canteen-manager-profile" className="user-avatar-link">
                            <img 
                                src="/images/business_avatar.png" 
                                alt={userData.name} 
                                className="profile-image"
                                onError={(e) => { e.target.src = '/images/user_default.png' }} 
                            />
                            <span className="user-name">{userData.name}</span>
                        </Link>
                        <div className="notification-bell">
                            <span className="notification-indicator"></span>
                        </div>
                    </div>
                </header>

                {/* Statistics Content */}
                <div className="statistics-content">
                    {/* Stats Cards */}
                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Total Sales</h3>
                                <div className="icon money-icon">$</div>
                            </div>
                            <div className="stat-value">{statisticsData.totalSales}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.totalSalesGrowth}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Total Orders</h3>
                                <div className="icon orders-icon">⊙</div>
                            </div>
                            <div className="stat-value">{statisticsData.totalOrders}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.totalOrdersGrowth}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Avg. Order Value</h3>
                                <div className="icon avg-icon">⌀</div>
                            </div>
                            <div className="stat-value">{statisticsData.avgOrderValue}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.avgOrderGrowth}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Total Customers</h3>
                                <div className="icon customers-icon">☺</div>
                            </div>
                            <div className="stat-value">{statisticsData.totalCustomers}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.totalCustomersGrowth}
                            </div>
                        </div>
                    </div>

                    {/* Sales Analytics */}
                    <div className="analytics-section">
                        <div className="analytics-header">
                            <h2>Sales Analytics</h2>
                            <div className="time-filters">
                                <button 
                                    className={`time-filter ${activeTimeFrame === 'weekly' ? 'active' : ''}`}
                                    onClick={() => setActiveTimeFrame('weekly')}
                                >
                                    Weekly
                                </button>
                                <button 
                                    className={`time-filter ${activeTimeFrame === 'monthly' ? 'active' : ''}`}
                                    onClick={() => setActiveTimeFrame('monthly')}
                                >
                                    Monthly
                                </button>
                                <button 
                                    className={`time-filter ${activeTimeFrame === 'yearly' ? 'active' : ''}`}
                                    onClick={() => setActiveTimeFrame('yearly')}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>
                        <div className="chart-container">
                            {/* This would be replaced with an actual chart component */}
                            <div className="placeholder-chart">
                                {/* The chart will be implemented with a library like Chart.js or Recharts */}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Sections */}
                    <div className="bottom-sections">
                        {/* Popular Items */}
                        <div className="popular-items-section">
                            <h2>Popular Items</h2>
                            <div className="items-list">
                                {statisticsData.popularItems.map((item, index) => (
                                    <div className="item-card" key={index}>
                                        <div className="item-image">
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <p>{item.orders} orders</p>
                                        </div>
                                        <div className="item-price">{item.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="recent-orders-section">
                            <h2>Recent Orders</h2>
                            <div className="orders-list">
                                {statisticsData.recentOrders.map((order, index) => (
                                    <div className="order-card" key={index}>
                                        <div className="order-user">
                                            <img 
                                                src={order.image} 
                                                alt={order.customer}
                                            />
                                            <div className="user-order-details">
                                                <h3>{order.customer}</h3>
                                                <p>{order.items} items • {order.total}</p>
                                            </div>
                                        </div>
                                        <div className={`order-status ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CanteenStatistics;