// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import '../../styles/Canteen/order_queue.css';

// // Icons import
// import { FaSearch, FaChevronDown, FaEye, FaCheck, FaListAlt, FaSpinner, FaTruck, FaCalendarAlt } from 'react-icons/fa';

// const OrderQueue = () => {
//     // Sample user data
//     const userData = {
//         name: sessionStorage.getItem('user_name') || 'John Manager',
//         email: sessionStorage.getItem('user_email') || 'john@example.com'
//     };

//     // Filter state
//     const [filterValue, setFilterValue] = useState('All Orders');

//     return (
//         <div className="order-queue-container">
//             {/* Header/Navigation */}
//             <header className="order-header">
//                 <div className="logo-container">
//                     <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-img" />
//                     <h1 className="logo-text">
//                         <span className="red-text">Quick</span>
//                         <span className="yellow-text">Crave</span>
//                     </h1>
//                 </div>

//                 <div className="header-actions">
//                     <div className="notification-bell">
//                         <FaListAlt />
//                         <span className="notification-badge">2</span>
//                     </div>
//                     <div className="user-profile">
//                         <img 
//                             src="/images/user_default.png" 
//                             alt={userData.name} 
//                             className="user-avatar"
//                             onError={(e) => { e.target.src = '/images/user_default.png' }} 
//                         />
//                         <span className="user-name">{userData.name}</span>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="order-content">
//                 {/* Top Section - Title and Search */}
//                 <div className="content-header">
//                     <h2 className="page-title">Order Queue</h2>
//                     <div className="filter-section">
//                         <div className="search-bar">
//                             <FaSearch className="search-icon" />
//                             <input type="text" placeholder="     Search orders..." />
//                         </div>
//                         <div className="filter-dropdown">
//                             <span>{filterValue}</span>
//                             <FaChevronDown className="dropdown-icon" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Order Status Cards */}
//                 <div className="status-cards">
//                     <div className="status-card new-orders">
//                         <div className="card-info">
//                             <span className="card-label">New Orders</span>
//                             <span className="card-value">12</span>
//                         </div>
//                         <div className="card-icon document-icon">
//                             <FaListAlt />
//                         </div>
//                     </div>

//                     <div className="status-card in-progress">
//                         <div className="card-info">
//                             <span className="card-label">In Progress</span>
//                             <span className="card-value">8</span>
//                         </div>
//                         <div className="card-icon progress-icon">
//                             <FaSpinner />
//                         </div>
//                     </div>

//                     <div className="status-card ready">
//                         <div className="card-info">
//                             <span className="card-label">Ready</span>
//                             <span className="card-value">5</span>
//                         </div>
//                         <div className="card-icon ready-icon">
//                             <FaCheck />
//                         </div>
//                     </div>

//                     <div className="status-card total-today">
//                         <div className="card-info">
//                             <span className="card-label">Total Today</span>
//                             <span className="card-value">45</span>
//                         </div>
//                         <div className="card-icon total-icon">
//                             <FaCalendarAlt />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Active Orders */}
//                 <div className="active-orders-section">
//                     <h3 className="section-title">Active Orders</h3>

//                     <div className="orders-list">
//                         {/* Order Item - New */}
//                         <div className="order-item">
//                             <div className="order-details">
//                                 <div className="order-header">
//                                     <div className="order-id-container">
//                                         <span className="order-id">#ORD-2025</span>
//                                         <span className="order-status new">New</span>
//                                     </div>
//                                     <span className="order-price">$24.99</span>
//                                 </div>
//                                 <div className="order-description">
//                                     <span>2 x Chicken Burger, 1 x French Fries</span>
//                                 </div>
//                                 <div className="order-footer">
//                                     <div className="customer-info">
//                                         <img 
//                                             src="https://randomuser.me/api/portraits/women/44.jpg" 
//                                             alt="Customer" 
//                                             className="customer-avatar"
//                                             onError={(e) => { e.target.src = '/images/user_default.png' }}
//                                         />
//                                         <span className="customer-name">Sarah Johnson</span>
//                                     </div>
//                                     <span className="order-time">10:30 AM</span>
//                                 </div>
//                             </div>
//                             <div className="order-actions">
//                                 <button className="action-btn view-btn">
//                                     <FaEye />
//                                     <span>View Details</span>
//                                 </button>
//                                 <button className="action-btn accept-btn">
//                                     <FaCheck />
//                                     <span>Accept Order</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Order Item - In Progress */}
//                         <div className="order-item">
//                             <div className="order-details">
//                                 <div className="order-header">
//                                     <div className="order-id-container">
//                                         <span className="order-id">#ORD-2024</span>
//                                         <span className="order-status in-progress">In Progress</span>
//                                     </div>
//                                     <span className="order-price">$18.50</span>
//                                 </div>
//                                 <div className="order-description">
//                                     <span>1 x Vegetarian Pizza, 2 x Cake</span>
//                                 </div>
//                                 <div className="order-footer">
//                                     <div className="customer-info">
//                                         <img 
//                                             src="https://randomuser.me/api/portraits/men/32.jpg" 
//                                             alt="Customer" 
//                                             className="customer-avatar"
//                                             onError={(e) => { e.target.src = '/images/user_default.png' }}
//                                         />
//                                         <span className="customer-name">Mike Chen</span>
//                                     </div>
//                                     <span className="order-time">10:25 AM</span>
//                                 </div>
//                             </div>
//                             <div className="order-actions">
//                                 <button className="action-btn view-btn">
//                                     <FaEye />
//                                     <span>View Details</span>
//                                 </button>
//                                 <button className="action-btn ready-btn">
//                                     <FaCheck />
//                                     <span>Mark as Ready</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Order Item - Ready */}
//                         <div className="order-item">
//                             <div className="order-details">
//                                 <div className="order-header">
//                                     <div className="order-id-container">
//                                         <span className="order-id">#ORD-2023</span>
//                                         <span className="order-status ready">Ready</span>
//                                     </div>
//                                     <span className="order-price">$32.99</span>
//                                 </div>
//                                 <div className="order-description">
//                                     <span>3 x Chicken Wings, 1 x Salad</span>
//                                 </div>
//                                 <div className="order-footer">
//                                     <div className="customer-info">
//                                         <img 
//                                             src="https://randomuser.me/api/portraits/men/67.jpg" 
//                                             alt="Customer" 
//                                             className="customer-avatar"
//                                             onError={(e) => { e.target.src = '/images/user_default.png' }}
//                                         />
//                                         <span className="customer-name">David Wilson</span>
//                                     </div>
//                                     <span className="order-time">10:15 AM</span>
//                                 </div>
//                             </div>
//                             <div className="order-actions">
//                                 <button className="action-btn view-btn">
//                                     <FaEye />
//                                     <span>View Details</span>
//                                 </button>
//                                 <button className="action-btn complete-btn">
//                                     <FaTruck />
//                                     <span>Complete Order</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default OrderQueue; 