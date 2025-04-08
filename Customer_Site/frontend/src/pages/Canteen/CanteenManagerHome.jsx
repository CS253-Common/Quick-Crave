// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../../styles/Canteen/canteen_manager_home.css';
// import { FaSignOutAlt, FaHome, FaHistory, FaChartLine, FaCog , FaUser} from 'react-icons/fa';
// import { MdManageAccounts } from "react-icons/md";

// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

// const CanteenManagerHome = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [userData, setUserData] = useState({
//         name: sessionStorage.getItem('user_name') || 'Business Owner',
//         email: sessionStorage.getItem('user_email') || 'business@example.com'
//     });

//     // Use useEffect to load user data when component mounts
//     useEffect(() => {
//         const userName = sessionStorage.getItem('user_name');
//         const userEmail = sessionStorage.getItem('user_email');
        
//         if (userName && userEmail) {
//             setUserData({
//                 name: userName,
//                 email: userEmail
//             });
//         }
//     }, []);

//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     return (
//         <div className="home-container home-page">
//             {/* Side Menu Overlay */}
//             <div 
//                 className={`side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
//                 onClick={toggleMenu}
//             ></div>

//             {/* Side Menu */}
//             <div className={`cs-side-menu ${isMenuOpen ? 'active' : ''}`}>
//                 <div className="cs-side-menu-header">
//                     <button className="cs-close-menu-btn" onClick={toggleMenu}>
//                         <i className="fas fa-times"></i>
//                     </button>
//                     <div className="cs-menu-user-info">
//                         <div className="cs-menu-user-avatar">
//                             <img src="/images/business_avatar.png" alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
//                         </div>
//                         <div className="cs-menu-user-details">
//                             <h3 className="cs-menu-user-name">{userData.name}</h3>
//                             <p className="cs-menu-user-email">{userData.email}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="cs-side-menu-content">
//                     <ul className="cs-menu-items">
//                         <li className="cs-menu-item active">
//                             <Link to="/canteen-manager-home"><FaHome /> Dashboard</Link>
//                         </li>
//                         <li className="cs-menu-item">
//                             {/* <a href="/profile"><FaUser /> Profile</a> */}
//                             <Link to="/canteen-manager-profile"><FaUser /> Profile </Link>
//                         </li>
//                         <li className="cs-menu-item">
//                             <Link to="/canteen-menu-management"><MdManageAccounts /> Menu Management</Link>
//                         </li>
//                         <li className="cs-menu-item">
//                             <Link to="/canteen-order-history"><FaHistory /> Order History</Link>
//                         </li>
//                         <li className="cs-menu-item">
//                             <Link to="/canteen-statistics"><FaChartLine /> Statistics</Link>
//                         </li>
//                         <li className="cs-menu-item">
//                             <Link to="/login"><FaSignOutAlt /> Logout</Link>
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="main-content">
//                 {/* Top Navigation Bar */}
//                 <div className="top-nav">
//                     <button className="cs-menu-btn" onClick={toggleMenu}>
//                             <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" /> {/* Add your logo here */}
//                     </button>
//                     <div className="logo-container">
//                         <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
//                         <h1 className="logo-text">
//                             <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
//                         </h1>
//                     </div>
//                     <div className="user-profile">
//                         <div className="user-avatar" id="userAvatar">
//                             <img src="/images/user_default.png" alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Dashboard Cards */}
//                 <div className="dashboard-cards">
//                     {/* Order Queues Card */}
//                     <Link to="/canteen-order-queue" className="dashboard-card">
//                         <h3 className="card-title">MANAGE ORDER QUEUES</h3>
//                         <div className="card-content">
//                             <div className="card-stats">
//                                 <p>ORDERS IN QUEUE: 5</p>
//                                 <p>PENDING REQUESTS: 2</p>
//                             </div>
//                             <div className="card-icon" style={{ width: "150px", height: "150px", borderRadius: "12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <img 
//                                     src="/images/order_queue.png" 
//                                     alt="Order Queue" 
//                                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} 
//                                     onError={(e) => { 
//                                         e.target.src = 'https://via.placeholder.com/150x150/f5f5f5/e53935?text=Orders' 
//                                     }} 
//                                 />
//                             </div>
//                         </div>
//                     </Link>

//                     {/* Discounts Card */}
//                     <Link to="/canteen-discount-management" className="dashboard-card">
//                         <h3 className="card-title">DISCOUNTS AND COUPONS</h3>
//                         <div className="card-content">
//                             <div className="card-stats">
//                                 <p>ACTIVE COUPONS: 3</p>
//                                 <p>SET DISCOUNTS: 4</p>
//                             </div>
//                             <div className="card-icon" style={{ width: "150px", height: "150px", borderRadius: "12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <img 
//                                     src="/images/discount_coupon.jpeg" 
//                                     alt="Discount Coupon" 
//                                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} 
//                                     onError={(e) => { 
//                                         e.target.src = 'https://via.placeholder.com/150x150/f5f5f5/e53935?text=Orders' 
//                                     }} 
//                                 />
//                             </div>
//                         </div>
//                     </Link>

//                     {/* Reservation Management Card */}
//                     <Link to="/canteen-reservation-management" className="dashboard-card">
//                         <h3 className="card-title">RESERVATIONS MANAGEMENT</h3>
//                         <div className="card-content">
//                             <div className="card-stats">
//                                 <p>PENDING REQUESTS: 24</p>
//                                 <p>APPROVED TODAY: 12</p>
//                             </div>
//                             <div className="card-icon" style={{ width: "150px", height: "150px", borderRadius: "12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <img 
//                                     src="/images/reservation_table.jpeg" 
//                                     alt="Reservation Management" 
//                                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} 
//                                     onError={(e) => { 
//                                         e.target.src = 'https://via.placeholder.com/150x150/f5f5f5/e53935?text=Orders' 
//                                     }} 
//                                 />
//                             </div>
//                         </div>
//                     </Link>

//                 </div>

//                 {/* Trending Picks Section */}
//                 <div className="trending-section">
//                     <h2 className="section-title">Trending Picks</h2>
//                     <div className="trending-items">
//                         {[
//                             {
//                                 image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//                                 alt: "Tandoori Chicken",
//                                 orders: 10,
//                                 rating: 4.5,
//                                 isVeg: false
//                             },
//                             {
//                                 image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//                                 alt: "French Fries",
//                                 orders: null,
//                                 rating: 3.8,
//                                 isVeg: true
//                             },
//                             {
//                                 image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//                                 alt: "Burger",
//                                 orders: null,
//                                 rating: 4.2,
//                                 isVeg: false
//                             },
//                             {
//                                 image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//                                 alt: "Peanut Butter Sandwich",
//                                 orders: 30,
//                                 rating: 4.0,
//                                 isVeg: true
//                             },
//                             {
//                                 image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//                                 alt: "Biryani",
//                                 orders: null,
//                                 rating: 4.7,
//                                 isVeg: false
//                             },
//                             {
//                                 image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//                                 alt: "Biryani",
//                                 orders: 90,
//                                 rating: 4.9,
//                                 isVeg: false
//                             }
//                         ].map((item, index) => (
//                             <div key={index} className="trending-item">
                                
//                                 <div className="trending-image">
//                                     <img 
//                                         src={item.image} 
//                                         alt={item.alt} 
//                                         onError={(e) => { e.target.src = `https://via.placeholder.com/100x100?text=Food${index+1}` }} 
//                                     />
//                                     {/* Veg/Non-Veg Indicator - Left Side */}
//                                     <div className="veg-indicator trending-tag">
//                                         <img 
//                                             // src={item.isVeg ? "/images/veg_ico.png" : "/images/non_veg_ico.png"} 
//                                             src={item.isVeg ? "/images/veg_icon.png" : "/images/non_veg_icon.png"} 
//                                             alt={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
//                                             className="dietary-icon"
//                                             style={{
//                                                 width: '18px',
//                                                 height: '18px',
//                                                 objectFit: 'contain',
//                                                 backgroundColor: 'white'
//                                             }}
//                                         />
//                                         {/* <span>{item.isVeg ? 'Veg' : 'Non-Veg'}</span> */}
//                                     </div>
//                                     {/* Rating Indicator - Right Side */}
//                                     <div className="rating-indicator trending-tag">
//                                         <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
//                                         </svg>
//                                         {item.rating}
//                                     </div>
//                                 </div>
                                
//                                 {item.orders && <div className="trending-label">
//                                     Orders: {item.orders}
//                                     <br/>
//                                     {item.alt}
//                                 </div>}

//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CanteenManagerHome; 