import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaChevronDown, FaChevronLeft, FaChevronRight, FaFilter, FaTable, FaCheck, FaTimes, FaBars, FaExclamationCircle } from 'react-icons/fa';
import '../../../styles/Canteen/Reservations/reservation_management.css';
import canteenService from '../../../services/canteenService';

const ReservationManagement = () => {
    // Sidebar state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Filter state
    const [filterValue, setFilterValue] = useState('Pending Only');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [filterOptions] = useState(['Pending Only', 'All Reservations', 'Approved', 'Rejected']);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    
    // Ref for filter dropdown
    const filterDropdownRef = useRef(null);
    
    // Reservation data and loading state
    const [reservations, setReservations] = useState([]);
    const [allReservations, setAllReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Reservation stats
    const [stats, setStats] = useState({
        pendingRequests: 0,
        approvedCount: 0,
        rejectedCount: 0,
        totalTables: 20 // This could be fetched from a different API if available
    });
    
    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    // User data state for sidebar
    const [userData, setUserData] = useState({
        name: sessionStorage.getItem('user_name') || 'Canteen Manager',
        email: sessionStorage.getItem('user_email') || 'manager@quickcrave.com'
    });
    
    // Toggle menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // Fetch reservations
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                // Get canteen ID from session storage or use a default
                const canteenId = sessionStorage.getItem('canteen_id') || '1';
                const data = await canteenService.getReservations(canteenId);
                
                // Format reservation data
                const formattedReservations = data.map(item => ({
                    id: item.id,
                    name: item.customer_name,
                    people: item.people_count,
                    table: `#${item.table_number}`,
                    date: formatDate(item.reservation_date),
                    time: `${formatTime(item.reservation_time)} - ${formatTime(item.end_time)}`,
                    additionalRequest: item.additional_request || 'None',
                    bookingAmount: `₹${item.booking_amount}`,
                    status: item.status,
                    image: item.customer_image || 'https://randomuser.me/api/portraits/lego/1.jpg'
                }));
                
                // Store all reservations
                setAllReservations(formattedReservations);
                
                // Default filter to show only pending reservations
                const pendingReservations = formattedReservations.filter(item => item.status === 'pending');
                setReservations(pendingReservations);
                
                // Calculate stats based on all reservations
                const pendingCount = data.filter(item => item.status === 'pending').length;
                const approvedCount = data.filter(item => item.status === 'approved').length;
                const rejectedCount = data.filter(item => item.status === 'rejected').length;
                
                setStats({
                    pendingRequests: pendingCount,
                    approvedCount: approvedCount,
                    rejectedCount: rejectedCount,
                    totalTables: 20
                });
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching reservations:', err);
                setError('Failed to load reservations');
                setLoading(false);
            }
        };
        
        fetchReservations();
    }, []);
    
    // Apply filter when filterValue changes
    useEffect(() => {
        if (allReservations.length === 0) return;
        
        let filteredResults = [];
        
        switch(filterValue) {
            case 'Pending Only':
                filteredResults = allReservations.filter(item => item.status === 'pending');
                break;
            case 'Approved':
                filteredResults = allReservations.filter(item => item.status === 'approved');
                break;
            case 'Rejected':
                filteredResults = allReservations.filter(item => item.status === 'rejected');
                break;
            case 'All Reservations':
                filteredResults = [...allReservations];
                break;
            default:
                filteredResults = allReservations.filter(item => item.status === 'pending');
        }
        
        setReservations(filteredResults);
        
        // Update stats based on all reservations
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const pendingCount = allReservations.filter(item => item.status === 'pending').length;
        const approvedCount = allReservations.filter(item => item.status === 'approved').length;
        const rejectedCount = allReservations.filter(item => item.status === 'rejected').length;
        
        setStats({
            pendingRequests: pendingCount,
            approvedCount: approvedCount,
            rejectedCount: rejectedCount,
            totalTables: 20
        });
        
        // Reset to first page when filter changes
        setCurrentPage(1);
    }, [filterValue, allReservations]);
    
    // Format date from YYYY-MM-DD to Month DD, YYYY
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    // Format time from HH:MM:SS to H:MM AM/PM
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };
    
    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };
    
    // Handle Accept reservation
    const handleAccept = async (id) => {
        try {
            // Show loading state for this button
            const acceptButton = document.querySelector(`button[data-id="${id}"].accept`);
            if (acceptButton) {
                acceptButton.disabled = true;
                acceptButton.innerHTML = 'Processing...';
            }
            
            // Make API call to update reservation status
            await canteenService.updateReservationStatus(id, 'approved');
            
            // Show success feedback
            if (acceptButton) {
                acceptButton.innerHTML = 'Accepted';
                acceptButton.classList.add('success');
            }
            
            // Show toast notification
            showToast('Reservation accepted successfully!');
            
            // Remove from the list since we're only showing pending ones
            setTimeout(() => {
                setReservations(prevReservations => {
                    const updatedReservations = prevReservations.filter(res => res.id !== id);
                    
                    // If we removed the last item on the current page, go to the previous page
                    // unless we're on the first page
                    if (
                        currentItems.length === 1 && 
                        currentPage > 1 && 
                        currentPage === Math.ceil(prevReservations.length / itemsPerPage)
                    ) {
                        setCurrentPage(currentPage - 1);
                    }
                    
                    return updatedReservations;
                });
                
                // Update stats
                setStats(prevStats => ({
                    ...prevStats,
                    pendingRequests: prevStats.pendingRequests - 1,
                    approvedCount: prevStats.approvedCount + 1
                }));
            }, 800); // Short delay for visual feedback
            
        } catch (error) {
            console.error(`Error accepting reservation ${id}:`, error);
            
            // Reset button and show error
            const acceptButton = document.querySelector(`button[data-id="${id}"].accept`);
            if (acceptButton) {
                acceptButton.disabled = false;
                acceptButton.innerHTML = 'Accept';
            }
            
            // Show toast notification for error
            showToast(`Failed to accept reservation: ${error.response?.data?.message || 'Server error'}`, 'error');
        }
    };
    
    // Handle Reject reservation
    const handleReject = async (id) => {
        try {
            // Show loading state for this button
            const rejectButton = document.querySelector(`button[data-id="${id}"].reject`);
            if (rejectButton) {
                rejectButton.disabled = true;
                rejectButton.innerHTML = 'Processing...';
            }
            
            // Make API call to update reservation status
            await canteenService.updateReservationStatus(id, 'rejected');
            
            // Show success feedback
            if (rejectButton) {
                rejectButton.innerHTML = 'Rejected';
                rejectButton.classList.add('error');
            }
            
            // Show toast notification
            showToast('Reservation rejected successfully!');
            
            // Remove from the list since we're only showing pending ones
            setTimeout(() => {
                setReservations(prevReservations => {
                    const updatedReservations = prevReservations.filter(res => res.id !== id);
                    
                    // If we removed the last item on the current page, go to the previous page
                    // unless we're on the first page
                    if (
                        currentItems.length === 1 && 
                        currentPage > 1 && 
                        currentPage === Math.ceil(prevReservations.length / itemsPerPage)
                    ) {
                        setCurrentPage(currentPage - 1);
                    }
                    
                    return updatedReservations;
                });
                
                // Update stats
                setStats(prevStats => ({
                    ...prevStats,
                    pendingRequests: prevStats.pendingRequests - 1,
                    rejectedCount: prevStats.rejectedCount + 1
                }));
            }, 800); // Short delay for visual feedback
            
        } catch (error) {
            console.error(`Error rejecting reservation ${id}:`, error);
            
            // Reset button and show error
            const rejectButton = document.querySelector(`button[data-id="${id}"].reject`);
            if (rejectButton) {
                rejectButton.disabled = false;
                rejectButton.innerHTML = 'Reject';
            }
            
            // Show toast notification for error
            showToast(`Failed to reject reservation: ${error.response?.data?.message || 'Server error'}`, 'error');
        }
    };
    
    // Handle filter change
    const handleFilterChange = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };
    
    const selectFilter = (filter) => {
        setFilterValue(filter);
        setIsFilterDropdownOpen(false);
    };
    
    // Calculate pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(reservations.length / itemsPerPage);
    
    // Pagination handlers
    const goToPage = (page) => {
        setCurrentPage(page);
    };
    
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="reservation-management-container">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'error' ? <FaExclamationCircle /> : <FaCheck />}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                </div>
            )}
            
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
                        <li className="menu-item active">
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

            {/* Header */}
            <header className="reservation-header">
                <button className="menu-btn" onClick={toggleMenu}>
                    <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                </button>
                <div className="logo-container">
                    <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                    <h1 className="logo-text">
                        <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                    </h1>
                </div>
                <div className="user-info">
                    <div className="user-profile">
                        <Link to="/canteen-manager-profile" className="user-avatar-link">
                            <img src="/images/business_avatar.png" alt="Profile" className="profile-image" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="reservation-content">
                {/* Reservation stats */}
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Pending Requests</h3>
                            <span className="stat-value">{stats.pendingRequests}</span>
                        </div>
                        <div className="stat-icon pending-icon">
                            <FaCalendarAlt />
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Approved</h3>
                            <span className="stat-value">{stats.approvedCount}</span>
                        </div>
                        <div className="stat-icon approved-icon">
                            <FaCheck />
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Rejected</h3>
                            <span className="stat-value">{stats.rejectedCount}</span>
                        </div>
                        <div className="stat-icon rejected-icon">
                            <FaTimes />
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Total Tables</h3>
                            <span className="stat-value">{stats.totalTables}</span>
                        </div>
                        <div className="stat-icon tables-icon">
                            <FaTable />
                        </div>
                    </div>
                </div>

                {/* Reservations list */}
                <div className="reservations-list-container">
                    <div className="list-header">
                        <h2>
                            {filterValue === 'All Reservations' 
                                ? 'All Reservation Requests' 
                                : `${filterValue} Reservation Requests`}
                        </h2>
                        <div className="list-controls">
                            <div className="filter-dropdown" ref={filterDropdownRef}>
                                <button className="filter-button" onClick={handleFilterChange}>
                                    <span>{filterValue}</span>
                                    <FaChevronDown />
                                </button>
                                {isFilterDropdownOpen && (
                                    <div className="filter-dropdown-menu">
                                        {filterOptions.map(option => (
                                            <div 
                                                key={option} 
                                                className={`filter-option ${option === filterValue ? 'active' : ''}`}
                                                onClick={() => selectFilter(option)}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="filter-button red" onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}>
                                <FaFilter />
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Loading reservations...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            <button className="retry-button" onClick={() => window.location.reload()}>
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="reservations-list">
                            {reservations.length === 0 ? (
                                <div className="no-reservations">
                                    <p>
                                        {filterValue === 'All Reservations' 
                                            ? 'No reservation requests found' 
                                            : `No ${filterValue.toLowerCase()} reservation requests found`}
                                    </p>
                                </div>
                            ) : (
                                currentItems.map(reservation => (
                                    <div key={reservation.id} className="reservation-item">
                                        <div className="reservation-details">
                                            <div className="customer-info">
                                                <img 
                                                    src={reservation.image} 
                                                    alt={reservation.name} 
                                                    className="customer-image" 
                                                    onError={(e) => { e.target.src = '/images/user_default.png' }}
                                                />
                                                <div className="customer-details">
                                                    <h3>{reservation.name}</h3>
                                                    <p>{reservation.people} People • Table {reservation.table}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="reservation-time">
                                                <div className="date-info">
                                                    <FaCalendarAlt className="icon" />
                                                    <span>{reservation.date}</span>
                                                </div>
                                                <div className="time-info">
                                                    <span>{reservation.time}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="additional-info">
                                                <p className="info-label">Additional Request: {reservation.additionalRequest}</p>
                                                <p className="booking-amount">Booking Amount: {reservation.bookingAmount}</p>
                                            </div>
                                            
                                            <div className="action-buttons">
                                                {reservation.status === 'pending' ? (
                                                    <>
                                                        <button 
                                                            className="action-btn accept" 
                                                            data-id={reservation.id}
                                                            onClick={() => handleAccept(reservation.id)}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            className="action-btn reject" 
                                                            data-id={reservation.id}
                                                            onClick={() => handleReject(reservation.id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className={`status-badge ${reservation.status}`}>
                                                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {!loading && !error && reservations.length > 0 && (
                        <div className="pagination">
                            <button 
                                className="pagination-btn prev" 
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => (
                                <button 
                                    key={index + 1}
                                    className={`pagination-btn page ${currentPage === index + 1 ? 'active' : ''}`}
                                    onClick={() => goToPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            
                            <button 
                                className="pagination-btn next" 
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationManagement; 