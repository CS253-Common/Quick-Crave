// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaCalendarAlt, FaChevronDown, FaChevronLeft, FaChevronRight, FaFilter, FaTable, FaCheck, FaTimes, FaBars } from 'react-icons/fa';
// import '../../styles/Canteen/reservation_management.css';

// const ReservationManagement = () => {
//     // Sidebar state
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
    
//     // Filter state
//     const [filterValue, setFilterValue] = useState('All Requests');
//     const [currentPage, setCurrentPage] = useState(1);
    
//     // Toggle menu
//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };
    
//     // Sample reservation data
//     const reservations = [
//         {
//             id: 1,
//             name: 'Sarah Johnson',
//             people: 4,
//             table: '#8',
//             date: 'March 15, 2025',
//             time: '7:00 PM - 8:00 PM',
//             additionalRequest: 'Window seat preferred, celebrating anniversary',
//             bookingAmount: '$50',
//             image: 'https://randomuser.me/api/portraits/women/44.jpg'
//         },
//         {
//             id: 2,
//             name: 'Michael Chen',
//             people: 2,
//             table: '#4',
//             date: 'March 15, 2025',
//             time: '6:30 PM - 7:30 PM',
//             additionalRequest: 'None',
//             bookingAmount: '$30',
//             image: 'https://randomuser.me/api/portraits/men/32.jpg'
//         }
//     ];
    
//     // Handle Accept reservation
//     const handleAccept = (id) => {
//         console.log(`Accepting reservation ${id}`);
//     };
    
//     // Handle Reject reservation
//     const handleReject = (id) => {
//         console.log(`Rejecting reservation ${id}`);
//     };
    
//     // Handle filter change
//     const handleFilterChange = () => {
//         // This would be implemented to toggle a dropdown
//         console.log('Filter dropdown toggled');
//     };
    
//     // Pagination handlers
//     const goToPage = (page) => {
//         setCurrentPage(page);
//     };
    
//     const goToPreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };
    
//     const goToNextPage = () => {
//         // Assuming we have more pages
//         setCurrentPage(currentPage + 1);
//     };

//     return (
//         <div className="reservation-management-container">
//             {/* Side Menu Overlay */}
//             <div 
//                 className={`side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
//                 onClick={toggleMenu}
//             ></div>

//             {/* Side Menu */}
//             <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
//                 <div className="side-menu-header">
//                     <button className="close-menu-btn" onClick={toggleMenu}>
//                         <i className="fas fa-times"></i>
//                     </button>
//                     <div className="menu-user-info">
//                         <div className="menu-user-avatar">
//                             <img 
//                                 src="https://randomuser.me/api/portraits/men/41.jpg" 
//                                 alt="User Avatar" 
//                                 onError={(e) => { e.target.src = '/images/user_default.png' }} 
//                             />
//                         </div>
//                         <div className="menu-user-details">
//                             <h3 className="menu-user-name">John Manager</h3>
//                             <p className="menu-user-email">manager@quickcrave.com</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="side-menu-content">
//                     <ul className="menu-items">
//                         <li className="menu-item">
//                             <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
//                         </li>
//                         <li className="menu-item">
//                             <Link to="/manage-orders"><i className="fas fa-utensils"></i> Order Queue</Link>
//                         </li>
//                         <li className="menu-item">
//                             <Link to="/manage-discounts"><i className="fas fa-tags"></i> Discounts & Coupons</Link>
//                         </li>
//                         <li className="menu-item active">
//                             <Link to="/manage-reservations"><i className="fas fa-calendar"></i> Reservations</Link>
//                         </li>
//                         <li className="menu-item">
//                             <Link to="/canteen-analytics"><i className="fas fa-chart-line"></i> Analytics</Link>
//                         </li>
//                         <li className="menu-item">
//                             <Link to="/canteen-settings"><i className="fas fa-cog"></i> Settings</Link>
//                         </li>
//                         <li className="menu-item">
//                             <Link to="/login"><i className="fas fa-sign-out-alt"></i> Logout</Link>
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             {/* Header */}
//             <header className="reservation-header">
//                 <button className="menu-btn" onClick={toggleMenu}>
//                     <FaBars />
//                 </button>
//                 <div className="logo-container">
//                     <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
//                     <h1 className="logo-text">
//                         <span className="red-text">Quick</span> <span className="crave-text">Crave</span>
//                     </h1>
//                 </div>
//                 <div className="user-info">
//                     <div className="notification-icon">
//                         <span className="notification-count">2</span>
//                     </div>
//                     <div className="user-profile">
//                         <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Profile" className="profile-image" />
//                     </div>
//                 </div>
//             </header>

//             {/* Main content */}
//             <div className="reservation-content">
//                 {/* Reservation stats */}
//                 <div className="stats-container">
//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <h3>Pending Requests</h3>
//                             <span className="stat-value">24</span>
//                         </div>
//                         <div className="stat-icon pending-icon">
//                             <FaCalendarAlt />
//                         </div>
//                     </div>
                    
//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <h3>Approved Today</h3>
//                             <span className="stat-value">12</span>
//                         </div>
//                         <div className="stat-icon approved-icon">
//                             <FaCheck />
//                         </div>
//                     </div>
                    
//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <h3>Rejected Today</h3>
//                             <span className="stat-value">3</span>
//                         </div>
//                         <div className="stat-icon rejected-icon">
//                             <FaTimes />
//                         </div>
//                     </div>
                    
//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <h3>Total Tables</h3>
//                             <span className="stat-value">20</span>
//                         </div>
//                         <div className="stat-icon tables-icon">
//                             <FaTable />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Reservations list */}
//                 <div className="reservations-list-container">
//                     <div className="list-header">
//                         <h2>Reservation Requests</h2>
//                         <div className="list-controls">
//                             <div className="filter-dropdown">
//                                 <button className="filter-button" onClick={handleFilterChange}>
//                                     <span>All Requests</span>
//                                     <FaChevronDown />
//                                 </button>
//                             </div>
//                             <button className="filter-button red">
//                                 <FaFilter />
//                                 <span>Filter</span>
//                             </button>
//                         </div>
//                     </div>
                    
//                     <div className="reservations-list">
//                         {reservations.map(reservation => (
//                             <div key={reservation.id} className="reservation-item">
//                                 <div className="reservation-details">
//                                     <div className="customer-info">
//                                         <img 
//                                             src={reservation.image} 
//                                             alt={reservation.name} 
//                                             className="customer-image" 
//                                         />
//                                         <div className="customer-details">
//                                             <h3>{reservation.name}</h3>
//                                             <p>{reservation.people} People • Table {reservation.table}</p>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="reservation-time">
//                                         <div className="date-info">
//                                             <FaCalendarAlt className="icon" />
//                                             <span>{reservation.date}</span>
//                                         </div>
//                                         <div className="time-info">
//                                             <span>{reservation.time}</span>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="additional-info">
//                                         <p className="info-label">Additional Request: {reservation.additionalRequest}</p>
//                                         <p className="booking-amount">Booking Amount: {reservation.bookingAmount}</p>
//                                     </div>
                                    
//                                     <div className="action-buttons">
//                                         <button 
//                                             className="action-btn accept" 
//                                             onClick={() => handleAccept(reservation.id)}
//                                         >
//                                             Accept
//                                         </button>
//                                         <button 
//                                             className="action-btn reject" 
//                                             onClick={() => handleReject(reservation.id)}
//                                         >
//                                             Reject
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
                    
//                     {/* Pagination */}
//                     <div className="pagination">
//                         <button 
//                             className="pagination-btn prev" 
//                             onClick={goToPreviousPage}
//                             disabled={currentPage === 1}
//                         >
//                             <FaChevronLeft />
//                         </button>
                        
//                         <button 
//                             className={`pagination-btn page ${currentPage === 1 ? 'active' : ''}`}
//                             onClick={() => goToPage(1)}
//                         >
//                             1
//                         </button>
                        
//                         <button 
//                             className={`pagination-btn page ${currentPage === 2 ? 'active' : ''}`}
//                             onClick={() => goToPage(2)}
//                         >
//                             2
//                         </button>
                        
//                         <button 
//                             className={`pagination-btn page ${currentPage === 3 ? 'active' : ''}`}
//                             onClick={() => goToPage(3)}
//                         >
//                             3
//                         </button>
                        
//                         <button 
//                             className="pagination-btn next" 
//                             onClick={goToNextPage}
//                         >
//                             <FaChevronRight />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReservationManagement; 