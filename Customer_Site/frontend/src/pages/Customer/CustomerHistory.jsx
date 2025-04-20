import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, faTimes, faHome, faUser, faWallet, faHistory, 
  faChartBar, faCalendarCheck, faEnvelope, faSignOutAlt,
  faSearch, faStar, faStarHalfAlt, faChevronLeft, 
  faChevronRight, faCommentDots, faPhone, faTruck, faUtensils, faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import '../../styles/Customer/customer_history.css';
import '../../styles/Components/customer_sidemenu.css';
import { FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

axios.defaults.withCredentials = true;
const CustomerHistory = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    sort: 'newest',
    orderType: 'dineout'
  });
  const [profileImage, setProfileImage] = useState('/images/user_default.png');
  const [userData, setUserData] = useState({
    name: sessionStorage.getItem('name') || 'Guest',
    email: sessionStorage.getItem('email') || '',
    phone: sessionStorage.getItem('phone_number') || '',
    address: sessionStorage.getItem('address') || '',
    jwtToken: sessionStorage.getItem('JWT_TOKEN') || '',
    customerId: sessionStorage.getItem('customer_id') || ''
  });
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format date for input fields
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    // Add 5:30 hours for IST
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time for display (for reservations)
  const formatTimeForDisplay = (dateString) => {
    const date = new Date(dateString);
    // Add 5:30 hours for IST
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        'http://localhost:4000/customer/customer-view-order-history', 
        {
          type: filters.orderType === 'delivery' ? 'delivery' : 'dine-out'
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.jwtToken}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
        
        // Set default filter dates (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        setFilters(prev => ({
          ...prev,
          dateTo: formatDateForInput(today),
          dateFrom: formatDateForInput(thirtyDaysAgo)
        }));
      } else {
        console.error('Error in response:', response.data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reservations from backend
  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        'http://localhost:4000/customer/customer-fetch-reservations',
        {
          // headers: {
          //   'Authorization': `Bearer ${userData.jwtToken}`
          // }
        }
      );
      console.log(response) ; 
      if (response.data.reservations) {
        // Process reservations to match our format
        const processedReservations = response.data.reservations.map(reservation => ({
          id: reservation.reservation_id,
          type: 'reservation',
          date: reservation.time,
          status: reservation.status === 1 ? 'completed' : reservation.status === 0 ? 'cancelled' : 'processing',
          restaurant: {
            name: reservation.name,
            logo: reservation.img_url || '/images/user_default.png',
            rating: reservation.rating || 4.5,
            address: reservation.address || 'Location unavailable'
          },          
          reservation: {
            people: reservation.num_people,
            date: reservation.time,
            timeSlot: formatTimeForDisplay(reservation.time),
            specialRequests: 'No special requests' // Default since API doesn't provide
          },
          payment: {
            reservationFee: 0, // Default since API doesn't provide
            refundable: true, // Default since API doesn't provide
            total: 0 // Default since API doesn't provide
          }
        }));
        
        setReservations(processedReservations);
        
        // Set default filter dates (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        setFilters(prev => ({
          ...prev,
          dateTo: formatDateForInput(today),
          dateFrom: formatDateForInput(thirtyDaysAgo)
        }));
      } else {
        console.error('Error in response:', response.data.message);
        setReservations([]);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.orderType === 'reservation') {
      fetchReservations();
    } else {
      fetchOrders();
    }
  }, [filters.orderType, userData.jwtToken, userData.customerId]);

  // Filter orders when filters change
  useEffect(() => {
    filterOrders();
  }, [filters, orders, reservations]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterOrders = () => {
    const { dateFrom, dateTo, status } = filters;
    
    const dateFromObj = dateFrom ? new Date(dateFrom) : new Date(0);
    const dateToObj = dateTo ? new Date(dateTo) : new Date(9999, 11, 31);
    if (dateToObj) dateToObj.setHours(23, 59, 59); // Set to end of day
    
    // Get the correct data source based on order type
    const dataSource = filters.orderType === 'reservation' ? reservations : orders;
    
    // Filter by date and status
    let filtered = dataSource.filter(item => {
      const itemDate = new Date(item.date);
      const dateMatch = itemDate >= dateFromObj && itemDate <= dateToObj;
      const statusMatch = status === 'all' || item.status === status;
      
      return dateMatch && statusMatch;
    });
    
    // Sort items
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (filters.sort === 'newest') {
        return dateB - dateA;
      } else if (filters.sort === 'oldest') {
        return dateA - dateB;
      } else if (filters.sort === 'highest') {
        return b.total - a.total;
      } else if (filters.sort === 'lowest') {
        return a.total - b.total;
      }
      
      return 0;
    });
    
    setFilteredOrders(filtered);
  };

  const showOrderDetails = (orderId) => {
    const dataSource = filters.orderType === 'reservation' ? reservations : orders;
    const order = dataSource.find(item => item.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setModalOpen(true);
    }
  };

  const reorderItems = (orderId) => {
    const dataSource = filters.orderType === 'reservation' ? reservations : orders;
    const order = dataSource.find(item => item.id === orderId);
    if (order) {
      if (order.type === 'reservation') {
        alert(`Reservation details for ${orderId} have been copied to a new reservation!`);
      } else {
        alert(`Items from order #${orderId} have been added to your cart!`);
      }
      setModalOpen(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('current_user');
    navigate('/login');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={farStar} />);
      }
    }
    
    return stars;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="history-home-container">
      {/* Side Menu Overlay */}
      <div 
        className={`side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      ></div>

      {/* Side Menu */}
      <div className={`cs-side-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="cs-side-menu-header">
          <button className="cs-close-menu-btn" onClick={toggleMenu}>
            <FaTimes />
          </button>
          <div className="cs-menu-user-info">
            <div className="cs-menu-user-avatar">
              <img src={sessionStorage.getItem('img_url')} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
            </div>
            <div className="cs-menu-user-details">
              <h3 className="cs-menu-user-name">{userData.name}</h3>
              <p className="cs-menu-user-email">{userData.email}</p>
            </div>
          </div>
        </div>
        <div className="cs-side-menu-content">
          <ul className="cs-menu-items">
            <li className="cs-menu-item">
              <Link to="/customer-home"><FaHome /> Home </Link>
            </li>
            <li className="cs-menu-item">
              <Link to="/customer-profile"><FaUser /> Profile </Link>
            </li>
            <li className="cs-menu-item active">
              <Link to="/customer-order-history"><FaHistory /> Order History </Link>
            </li>
            <li className="cs-menu-item">
              <Link to="/favourite-foods"><FaHeart /> Favorites </Link>
            </li>
            <li className="cs-menu-item">
              <Link to="/login"><FaSignOutAlt /> Logout </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="main-content">
        {/* Top Navigation Bar */}
        <div className="top-nav">
          <button className="cs-menu-btn" onClick={toggleMenu}>
            <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" /> 
          </button>
          <Link to="/customer-home" className="logo-link">
              <div className="logo-container">
                  <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                  <h1 className="logo-text">
                      <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                  </h1>
              </div>
            </Link>
          <div className="user-profile">
            <Link to="/customer-profile" className="user-avatar" id="userAvatar">
              <img src={sessionStorage.getItem('img_url')} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
            </Link>
          </div>
        </div>

        {/* History content */}
        <div className="chs-history-content">
          <h1 className="chs-section-title">Order History</h1>
          
          {/* Order Type Tabs */}
          <div className="chs-order-type-tabs">
            <button 
              className={`chs-tab ${filters.orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, orderType: 'delivery' }))}
            >
              <FontAwesomeIcon icon={faTruck} /> Delivery
            </button>
            <button 
              className={`chs-tab ${filters.orderType === 'dineout' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, orderType: 'dineout' }))}
            >
              <FontAwesomeIcon icon={faUtensils} /> Dine-Out
            </button>
            <button 
              className={`chs-tab ${filters.orderType === 'reservation' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, orderType: 'reservation' }))}
            >
              <FontAwesomeIcon icon={faCalendar} /> Reservations
            </button>
          </div>
          
          {/* Filter Section */}
          <div className="chs-filter-section">
            <form 
              onSubmit={(e) => { e.preventDefault(); filterOrders(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' , gap: '100px'}}
            >
              <div className="chs-filter-group" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="dateFrom">From:</label>
                <input 
                  type="date" 
                  id="dateFrom" 
                  name="dateFrom"
                  className="chs-filter-select" 
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="chs-filter-group" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="dateTo">To:</label>
                <input 
                  type="date" 
                  id="dateTo" 
                  name="dateTo"
                  className="chs-filter-select" 
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="chs-filter-group" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="status">Status:</label>
                <select 
                  id="status" 
                  name="status"
                  className="chs-filter-select"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="chs-filter-group" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="sort">Sort By:</label>
                <select 
                  id="sort" 
                  name="sort"
                  className="chs-filter-select"
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  <option value="newest">Date (Newest First)</option>
                  <option value="oldest">Date (Oldest First)</option>
                  <option value="highest">Amount (High to Low)</option>
                  <option value="lowest">Amount (Low to High)</option>
                </select>
              </div>
              <button type="submit" className="chs-filter-btn">Apply Filters</button>
            </form>
          </div>
          
          {/* Orders List */}
          <div className="chs-orders-list">
            {loading ? (
              <div className="chs-no-orders">
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="chs-no-orders">
                <p>No orders found for the selected filters.</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div className="chs-order-card" key={order.id}>
                  <div className="chs-order-header">
                    <div className="chs-order-info">
                      <h3>{order.type === 'reservation' ? 'Reservation' : 'Order'} #{order.id}</h3>
                      <p className="chs-order-date">{formatDateForDisplay(order.date)}</p>
                    </div>
                    <div className={`chs-order-status ${order.status}`}>
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                  </div>
                  <div className="chs-order-restaurant">
                    <div className="chs-restaurant-logo">
                      <img 
                        src={order.restaurant.logo} 
                        alt={order.restaurant.name} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/50?text=Restaurant'
                        }}
                      />
                    </div>
                    <div className="chs-restaurant-info">
                      <h4>{order.restaurant.name}</h4>
                      <div className="chs-rating">
                        {renderStars(order.restaurant.rating)}
                        <span>{order.restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {order.type === 'reservation' ? (
                    // Reservation specific information
                    <div className="chs-reservation-details">
                      <div className="chs-reservation-item">
                        <span className="chs-item-label"><FontAwesomeIcon icon={faUser} /> People:</span>
                        <span className="chs-item-value">{order.reservation.people}</span>
                      </div>
                      <div className="chs-reservation-item">
                        <span className="chs-item-label"><FontAwesomeIcon icon={faCalendarCheck} /> Date:</span>
                        <span className="chs-item-value">{new Date(order.reservation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="chs-reservation-item">
                        <span className="chs-item-label"><FontAwesomeIcon icon={faHistory} /> Time:</span>
                        <span className="chs-item-value">{order.reservation.timeSlot}</span>
                      </div>
                    </div>
                  ) : (
                    // Regular order items (delivery or dineout)
                    <div className="chs-order-items">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div className="chs-item" key={index}>
                          <span className="chs-item-name">{item.name}
                          <span className="chs-item-quantity">x{item.quantity}</span>
                          </span>
                          
                          <span className="chs-item-price">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="chs-item chs-more-items">
                          <span className="chs-item-name">+ {order.items.length - 2} more items</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="chs-order-footer">
                    <div className="chs-order-total">
                      <span>Total:</span>
                      <span className="chs-total-amount">₹{
                        order.type === 'reservation' 
                          ? order.payment.total 
                          : order.total
                      }</span>
                    </div>
                    <div className="chs-order-actions">
                      <button 
                        className="chs-action-btn chs-reorder-btn" 
                        onClick={() => reorderItems(order.id)}
                      >
                        {order.type === 'reservation' ? 'Book Again' : 'Reorder'}
                      </button>
                      <button 
                        className="chs-action-btn chs-view-details-btn" 
                        onClick={() => showOrderDetails(order.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          <div className="chs-pagination">
            <button className="chs-pagination-btn prev" disabled>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="chs-pagination-btn page active">1</button>
            <button className="chs-pagination-btn page">2</button>
            <button className="chs-pagination-btn page">3</button>
            <button className="chs-pagination-btn next">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div className="chs-modal active" id="orderDetailsModal">
          <div className="chs-modal-content">
            <div className="chs-modal-header">
              <h3>{selectedOrder.type === 'reservation' ? 'Reservation' : 'Order'} Details</h3>
              <button className="chs-close-modal" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="chs-modal-body">
              <div className="chs-order-details-header">
                <div className="chs-order-details-info">
                  <h4>{selectedOrder.type === 'reservation' ? 'Reservation' : 'Order'} #{selectedOrder.id}</h4>
                  <div className="chs-order-details-date">{formatDateForDisplay(selectedOrder.date)}</div>
                </div>
                <div className={`chs-order-details-status ${selectedOrder.status}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </div>
              </div>
              <div className="chs-order-details-restaurant">
                <div className="chs-restaurant-logo">
                  <img 
                    src={selectedOrder.restaurant.logo} 
                    alt={selectedOrder.restaurant.name}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/50?text=Restaurant'
                    }}
                  />
                </div>
                <div className="chs-restaurant-info">
                  <h4>{selectedOrder.restaurant.name}</h4>
                  <div className="chs-rating">
                    {renderStars(selectedOrder.restaurant.rating)}
                    <span>{selectedOrder.restaurant.rating}</span>
                  </div>
                </div>
              </div>
              
              {selectedOrder.type === 'reservation' ? (
                // Reservation Details
                <div className="chs-order-details-section">
                  <h5>Reservation Details</h5>
                  <div className="chs-reservation-details-info">
                    <div className="chs-payment-row">
                      <div>Number of People</div>
                      <div>{selectedOrder.reservation.people}</div>
                    </div>
                    <div className="chs-payment-row">
                      <div>Date</div>
                      <div>{new Date(selectedOrder.reservation.date).toLocaleDateString()}</div>
                    </div>
                    <div className="chs-payment-row">
                      <div>Time Slot</div>
                      <div>{selectedOrder.reservation.timeSlot}</div>
                    </div>
                    <div className="chs-payment-row">
                      <div>Special Requests</div>
                      <div>{selectedOrder.reservation.specialRequests}</div>
                    </div>
                  </div>
                  
                  <h5>Payment Details</h5>
                  <div className="chs-payment-details">
                    <div className="chs-payment-row">
                      <div>Reservation Fee</div>
                      <div>₹{selectedOrder.payment.reservationFee}</div>
                    </div>
                    <div className="chs-payment-row">
                      <div>Refundable</div>
                      <div>{selectedOrder.payment.refundable ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="chs-payment-row chs-total">
                      <div>Total</div>
                      <div>₹{selectedOrder.payment.total}</div>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular Order Details (Delivery or Dineout)
                <>
                  <div className="chs-order-details-section">
                    <h5>Order Items</h5>
                    <div className="chs-order-details-items">
                      {selectedOrder.items.map((item, index) => (
                        <div className="chs-details-item" key={index}>
                          <div className="chs-details-item-name">
                            {item.name}
                            <div className="chs-details-item-quantity">x{item.quantity}</div>
                          </div>
                          <div className="chs-details-item-price">₹{item.price * item.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="chs-order-details-section">
                    <h5>Payment Details</h5>
                    <div className="chs-payment-details">
                      <div className="chs-payment-row">
                        <div>Subtotal</div>
                        <div>₹{selectedOrder.payment.subtotal}</div>
                      </div>
                      <div className="chs-payment-row">
                        <div>Tax</div>
                        <div>₹{selectedOrder.payment.tax}</div>
                      </div>
                      
                      {selectedOrder.type === 'delivery' ? (
                        <div className="chs-payment-row">
                          <div>Delivery Fee</div>
                          <div>₹{selectedOrder.payment.delivery}</div>
                        </div>
                      ) : (
                        <div className="chs-payment-row">
                          <div>Service Charge</div>
                          <div>₹{selectedOrder.payment.serviceCharge}</div>
                        </div>
                      )}
                      
                      {selectedOrder.payment.discount > 0 && (
                        <div className="chs-payment-row chs-discount">
                          <div>Discount</div>
                          <div>-₹{selectedOrder.payment.discount}</div>
                        </div>
                      )}
                      <div className="chs-payment-row chs-total">
                        <div>Total</div>
                        <div>₹{selectedOrder.payment.total}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="chs-order-details-actions">
                <button className="chs-action-btn chs-reorder-btn" onClick={() => reorderItems(selectedOrder.id)}>
                  {selectedOrder.type === 'reservation' ? 'Book Again' : 'Reorder'}
                </button>
                <button className="chs-action-btn chs-help-btn">
                  Get Help
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHistory;