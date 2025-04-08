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
    const [refetch, setRefetch] = useState(false);
    
    // Ref for filter dropdown
    const filterDropdownRef = useRef(null);
    
    // Polling interval for auto-refresh
    const [pollingInterval, setPollingInterval] = useState(null);
    
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
        email: sessionStorage.getItem('user_email') || 'manager@quickcrave.com',
        username: sessionStorage.getItem('user_username') || 'canteen_manager'
    });
    
    // Toggle menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // Function to fetch reservations data
    const fetchReservations = async () => {
        try {
            // Only show loading indicator on initial load, not during polling
            if (allReservations.length === 0) {
                setLoading(true);
            }
            
            // Get canteen ID from session storage or use a default
           
            const data = await canteenService.getReservations();
            
            // Format reservation data
            const formattedReservations = data.map(item => {
                // Convert string status to numeric status code
                let statusCode = item.status;
                let statusText = 'pending'; // Default to pending (1)
                if (statusCode === 2) statusText = 'approved';
                else if (statusCode === 0) statusText = 'rejected';
                else if (statusCode === 3) statusText = 'completed';
                
                return {
                    reservation_id: item.reservation_id,
                    customer_name: item.customer_name||'No Name Given',
                    num_people: item.num_people,
                    date_of_reservation: formatDate(item.date_of_reservation),
                    time_of_reservation: formatTime(item.date_of_reservation),
                    additional_request: item.additional_request || 'None',
                    booking_amount: `₹${item.booking_amount}`,
                    status: item.status, // Use numeric status code
                    statusText: statusText,
                    img_url: item.customer_image_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
                };
            });
            
            // Store all reservations
            setAllReservations(formattedReservations);
            
            // Apply current filter without changing the filter value
            applyCurrentFilter(formattedReservations);
            
            // Calculate stats based on all reservations
            updateStats(formattedReservations);
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reservations:', err);
            setError('Failed to load reservations');
            setLoading(false);
        }
    };
    
    // Helper function to update stats
    const updateStats = (reservationsData) => {
        const pendingCount = reservationsData.filter(item => item.status === 1).length;
        const approvedCount = reservationsData.filter(item => item.status === 2).length;
        const rejectedCount = reservationsData.filter(item => item.status === 0).length;
        
        setStats({
            pendingRequests: pendingCount,
            approvedCount: approvedCount,
            rejectedCount: rejectedCount,
            totalTables: 20
        });
    };
    
    // Helper function to apply current filter
    const applyCurrentFilter = (reservationsData) => {
        let filteredResults = [];
        
        switch(filterValue) {
            case 'Pending Only':
                filteredResults = reservationsData.filter(item => item.status === 1);
                break;
            case 'Approved':
                filteredResults = reservationsData.filter(item => item.status === 2);
                break;
            case 'Rejected':
                filteredResults = reservationsData.filter(item => item.status === 0);
                break;
            case 'All Reservations':
                filteredResults = [...reservationsData];
                break;
            default:
                filteredResults = reservationsData.filter(item => item.status === 1);
        }
        
        setReservations(filteredResults);
        
        // Reset to first page when filter changes
        setCurrentPage(1);
    };
    
    // Set up initial fetch and polling
    useEffect(() => {
        // Initial fetch
        fetchReservations();
        
        // Set up polling every 30 seconds
        const interval = setInterval(() => {
            console.log("Polling for reservation updates...");
            fetchReservations();
        }, 30000); // 30 seconds
        
        setPollingInterval(interval);
        
        // Clean up interval on component unmount
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, []);
    
    // Apply filter when filterValue changes
    useEffect(() => {
        if (allReservations.length === 0) return;
        applyCurrentFilter(allReservations);
    }, [filterValue]);
    
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
    const handleAccept = async (reservation_id) => {
        try {
            // Show loading state for this button
            const acceptButton = document.querySelector(`button[data-id="${reservation_id}"].accept`);
            if (acceptButton) {
                acceptButton.disabled = true;
                acceptButton.innerHTML = 'Processing...';
            }
            
            // Make API call to accept reservation
            const result = await canteenService.acceptReservation(reservation_id);
            
            // Show success feedback
            if (acceptButton) {
                acceptButton.innerHTML = 'Accepted';
                acceptButton.classList.add('success');
                // fetchReservations();
            }
            
            // Show toast notification
            showToast('Reservation accepted successfully!');
            
            // Remove from the list since we're only showing pending ones
            setTimeout(() => {
                setReservations(prevReservations => {
                    const updatedReservations = prevReservations.filter(res => res.reservation_id !== reservation_id);
                    
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
                // setStats(prevStats => ({
                //     ...prevStats
                // }));

                fetchReservations();

                
            }, 800); // Short delay for visual feedback
            setRefetch(!refetch);
            
        } catch (error) {
            console.error(`Error accepting reservation ${reservation_id}:`, error);
            
            // Reset button and show error
            const acceptButton = document.querySelector(`button[data-id="${reservation_id}"].accept`);
            if (acceptButton) {
                acceptButton.disabled = false;
                acceptButton.innerHTML = 'Accept';
            }
            
            // Show toast notification for error
            showToast(`Failed to accept reservation: ${error.response?.data?.message || 'Server error'}`, 'error');
        }
    };
    
    // Handle Reject reservation
    const handleReject = async (reservation_id) => {
        try {
            // Show loading state for this button
            const rejectButton = document.querySelector(`button[data-id="${reservation_id}"].reject`);
            if (rejectButton) {
                rejectButton.disabled = true;
                rejectButton.innerHTML = 'Processing...';
            }
            
            // Make API call to reject reservation
            await canteenService.rejectReservation(reservation_id);
            
            // Show success feedback
            if (rejectButton) {
                rejectButton.innerHTML = 'Rejected';
                rejectButton.classList.add('error');
                // fetchReservations();
            }
            
            // Show toast notification
            showToast('Reservation rejected successfully!');
            
            // Remove from the list since we're only showing pending ones
            setTimeout(() => {
                setReservations(prevReservations => {
                    const updatedReservations = prevReservations.filter(res => res.reservation_id !== reservation_id);
                    
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
                // setStats(prevStats => ({
                //     ...prevStats
                // }));
            }, 800); // Short delay for visual feedback
            fetchReservations();
            // setRefetch(!refetch);
            
        } catch (error) {
            console.error(`Error rejecting reservation ${reservation_id}:`, error);
            
            // Reset button and show error
            const rejectButton = document.querySelector(`button[data-id="${reservation_id}"].reject`);
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
        // setRefetch(!refetch);
    };
    
    const selectFilter = (filter) => {
        setFilterValue(filter);
        setIsFilterDropdownOpen(false);
        // setRefetch(!refetch);
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
                            <p className="cm-menu-user-email">{userData.email}</p>
                        </div>
                    </div>
                </div>
                <div className="cm-side-menu-content">
                    <ul className="cm-menu-items">
                        <li className="cm-menu-item">
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
                        <li className="cm-menu-item active">
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

            {/* Header */}
            <header className="reservation-header">
                <button className="menu-btn" onClick={toggleMenu}>
                    <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                </button>
                <div className="logo-container">
                    <Link to="/canteen-manager-home" className="logo-link">
                        <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                        <h1 className="logo-text">
                            <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                        </h1>
                    </Link>
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
                                    <div key={reservation.reservation_id} className="reservation-item">
                                        <div className="reservation-details">
                                            <div className="customer-info">
                                                <img 
                                                    src={reservation.img_url} 
                                                    alt={reservation.customer_name} 
                                                    className="customer-image" 
                                                    onError={(e) => { e.target.src = '/images/user_default.png' }}
                                                />
                                                <div className="customer-details">
                                                    <h3>{reservation.customer_name}</h3>
                                                    <p>{reservation.num_people} People</p>
                                                </div>
                                            </div>
                                            
                                            <div className="reservation-time">
                                                <div className="date-info">
                                                    <FaCalendarAlt className="icon" />
                                                    <span>{reservation.date_of_reservation}</span>
                                                </div>
                                                <div className="time-info">
                                                    <span>{reservation.time_of_reservation}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="additional-info">
                                                <p className="info-label">Additional Request: {reservation.additional_request}</p>
                                                <p className="booking-amount">Booking Amount: {reservation.booking_amount}</p>
                                            </div>
                                            
                                            <div className="action-buttons">
                                                {reservation.status === 1 ? (
                                                    <>
                                                        <button 
                                                            className="action-btn accept" 
                                                            data-id={reservation.reservation_id}
                                                            onClick={() => handleAccept(reservation.reservation_id)}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            className="action-btn reject" 
                                                            data-id={reservation.reservation_id}
                                                            onClick={() => handleReject(reservation.reservation_id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className={`status-badge status-${reservation.status}`}>
                                                        {reservation.status === 0 ? 'Rejected' : 
                                                         reservation.status === 1 ? 'Pending' :
                                                         reservation.status === 2 ? 'Waiting for Payment' : 'Approved'}
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