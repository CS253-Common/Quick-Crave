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
    orderType: 'delivery'
  });
  const [profileImage, setProfileImage] = useState('/images/user_default.png');
  const [userData, setUserData] = useState({
    name: 'ARIHANT KUMAR',
    email: 'arikrrr@gmail.com',
    phone: '9711XXXXX',
    address: 'HALL 5, IITK - 208016'
  });

  // Sample delivery order data
  const sampleDeliveryOrders = [
    {
      id: 'ORD001',
      type: 'delivery',
      date: '2023-06-25T19:45:00',
      status: 'completed',
      restaurant: {
        name: 'Spice Garden',
        logo: 'images/imagesfile/restaurant1.jpg',
        rating: 4.5
      },
      items: [
        { name: 'Paneer Butter Masala', quantity: 1, price: 180 },
        { name: 'Butter Naan', quantity: 2, price: 70 }
      ],
      total: 250,
      payment: {
        method: 'Credit Card',
        subtotal: 250,
        tax: 20,
        delivery: 30,
        discount: 0,
        total: 300
      },
      delivery: {
        address: '123 Main St, Apt 4B, New York, NY 10001',
        instructions: 'Please leave at the door',
        contact: '(555) 123-4567',
        time: '30-45 minutes'
      }
    },
    {
      id: 'ORD002',
      type: 'delivery',
      date: '2023-06-22T13:30:00',
      status: 'completed',
      restaurant: {
        name: 'Burger Palace',
        logo: 'images/imagesfile/restaurant2.jpg',
        rating: 4.0
      },
      items: [
        { name: 'Cheese Burger', quantity: 1, price: 120 },
        { name: 'French Fries', quantity: 1, price: 80 },
        { name: 'Coke', quantity: 1, price: 40 }
      ],
      total: 240,
      payment: {
        method: 'PayPal',
        subtotal: 240,
        tax: 19.2,
        delivery: 20,
        discount: 0,
        total: 279.2
      },
      delivery: {
        address: '123 Main St, Apt 4B, New York, NY 10001',
        instructions: 'Call when you arrive',
        contact: '(555) 123-4567',
        time: '45-60 minutes'
      }
    }
  ];

  // Sample dineout order data
  const sampleDineoutOrders = [
    {
      id: 'DIN001',
      type: 'dineout',
      date: '2023-06-24T18:30:00',
      status: 'completed',
      restaurant: {
        name: 'Taj Mahal Restaurant',
        logo: 'images/imagesfile/restaurant3.jpg',
        rating: 4.8
      },
      items: [
        { name: 'Butter Chicken', quantity: 1, price: 220 },
        { name: 'Garlic Naan', quantity: 2, price: 80 },
        { name: 'Gulab Jamun', quantity: 2, price: 60 }
      ],
      total: 360,
      payment: {
        method: 'Credit Card',
        subtotal: 360,
        tax: 28.8,
        serviceCharge: 36,
        discount: 0,
        total: 424.8
      },
      dineout: {
        tableNumber: '12',
        people: 2,
        time: '7:30 PM - 9:30 PM'
      }
    },
    {
      id: 'DIN002',
      type: 'dineout',
      date: '2023-06-18T12:30:00',
      status: 'completed',
      restaurant: {
        name: 'Italian Bistro',
        logo: 'images/imagesfile/restaurant4.jpg',
        rating: 4.2
      },
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 180 },
        { name: 'Pasta Carbonara', quantity: 1, price: 160 },
        { name: 'Tiramisu', quantity: 1, price: 90 },
        { name: 'Sparkling Water', quantity: 2, price: 60 }
      ],
      total: 490,
      payment: {
        method: 'Debit Card',
        subtotal: 490,
        tax: 39.2,
        serviceCharge: 49,
        discount: 0,
        total: 578.2
      },
      dineout: {
        tableNumber: '8',
        people: 2,
        time: '12:30 PM - 2:00 PM'
      }
    }
  ];

  // Sample reservation data
  const sampleReservationOrders = [
    {
      id: 'RES001',
      type: 'reservation',
      date: '2023-07-15T19:00:00',
      status: 'confirmed',
      restaurant: {
        name: 'Royal Garden',
        logo: 'images/imagesfile/restaurant5.jpg',
        rating: 4.7
      },
      reservation: {
        people: 4,
        date: '2023-07-15',
        timeSlot: '7:00 PM - 9:00 PM',
        tableType: 'Premium',
        specialRequests: 'Birthday celebration'
      },
      payment: {
        reservationFee: 200,
        refundable: true,
        total: 200
      }
    },
    {
      id: 'RES002',
      type: 'reservation',
      date: '2023-07-10T13:30:00',
      status: 'pending',
      restaurant: {
        name: 'Sea Breeze',
        logo: 'images/imagesfile/restaurant6.jpg',
        rating: 4.3
      },
      reservation: {
        people: 2,
        date: '2023-07-10',
        timeSlot: '1:30 PM - 3:30 PM',
        tableType: 'Window Side',
        specialRequests: 'No special requests'
      },
      payment: {
        reservationFee: 100,
        refundable: true,
        total: 100
      }
    },
    {
      id: 'RES003',
      type: 'reservation',
      date: '2023-06-30T20:00:00',
      status: 'rejected',
      restaurant: {
        name: 'Mountain View',
        logo: 'images/imagesfile/restaurant7.jpg',
        rating: 4.6
      },
      reservation: {
        people: 6,
        date: '2023-06-30',
        timeSlot: '8:00 PM - 10:00 PM',
        tableType: 'Large Group',
        specialRequests: 'Need high chairs for kids'
      },
      payment: {
        reservationFee: 300,
        refundable: true,
        total: 300
      }
    }
  ];

  // Combine all order types
  const sampleOrders = [
    ...sampleDeliveryOrders,
    ...sampleDineoutOrders,
    ...sampleReservationOrders
  ];

  const [filteredOrders, setFilteredOrders] = useState(sampleDeliveryOrders);

  // useEffect(() => {
  //   // Check if user is logged in
  //   const currentUser = sessionStorage.getItem('current_user');
  //   if (!currentUser) {
  //     navigate('/login');
  //   } else {
  //     // Get user data from localStorage
  //     const userKey = `user_${currentUser}`;
  //     const userData = JSON.parse(localStorage.getItem(userKey));
      
  //     if (userData && userData.userType !== 'customer') {
  //       alert('You are not authorized to access this page');
  //       navigate('/login');
  //     }
  //   }

  //   // Set default filter dates (last 30 days)
  //   const today = new Date();
  //   const thirtyDaysAgo = new Date();
  //   thirtyDaysAgo.setDate(today.getDate() - 30);
    
  //   setFilters(prev => ({
  //     ...prev,
  //     dateTo: formatDateForInput(today),
  //     dateFrom: formatDateForInput(thirtyDaysAgo)
  //   }));
  // }, [navigate]);

  useEffect(() => {
    filterOrders();
  }, [filters]);

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterOrders = () => {
    const { dateFrom, dateTo, status, orderType } = filters;
    
    const dateFromObj = dateFrom ? new Date(dateFrom) : new Date(0);
    const dateToObj = dateTo ? new Date(dateTo) : new Date(9999, 11, 31);
    if (dateToObj) dateToObj.setHours(23, 59, 59); // Set to end of day
    
    // Filter by date, status, and order type
    let filtered = sampleOrders.filter(order => {
      const orderDate = new Date(order.date);
      const dateMatch = orderDate >= dateFromObj && orderDate <= dateToObj;
      const statusMatch = status === 'all' || order.status === status;
      const typeMatch = order.type === orderType;
      
      return dateMatch && statusMatch && typeMatch;
    });
    
    // Sort orders
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
    const order = sampleOrders.find(order => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setModalOpen(true);
    }
  };

  const reorderItems = (orderId) => {
    const order = sampleOrders.find(order => order.id === orderId);
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
              <img src={profileImage} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
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
          <div className="logo-container">
            <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
            <h1 className="logo-text">
              <p1 className="red-text">Quick</p1> <p1 className="yellow-text">Crave</p1>
            </h1>
          </div>
          <div className="user-profile">
            <Link to="/customer-profile" className="user-avatar" id="userAvatar">
              <img src="/images/user_default.png" alt="User" onError={(e) => { e.target.innerHTML = '<i class="fas fa-user"></i>'; e.target.style.display = 'flex'; }} />
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
            {filteredOrders.length === 0 ? (
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
                          
                          <span className="chs-item-price">₹{item.price}</span>
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

        {/* Contact Options */}
        
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
                      <div>Table Type</div>
                      <div>{selectedOrder.reservation.tableType}</div>
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
                          <div className="chs-details-item-price">₹{item.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="chs-order-details-section">
                    <h5>Payment Details</h5>
                    <div className="chs-payment-details">
                      <div className="chs-payment-row">
                        <div>Payment Method</div>
                        <div>{selectedOrder.payment.method}</div>
                      </div>
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
                  
                  {selectedOrder.type === 'delivery' ? (
                    <div className="chs-order-details-section">
                      <h5>Delivery Information</h5>
                      <div className="chs-delivery-details">
                        <div className="chs-delivery-row">
                          <div>Delivery Address</div>
                          <div>{selectedOrder.delivery.address}</div>
                        </div>
                        <div className="chs-delivery-row">
                          <div>Instructions</div>
                          <div>{selectedOrder.delivery.instructions}</div>
                        </div>
                        <div className="chs-delivery-row">
                          <div>Contact</div>
                          <div>{selectedOrder.delivery.contact}</div>
                        </div>
                        <div className="chs-delivery-row">
                          <div>Estimated Time</div>
                          <div>{selectedOrder.delivery.time}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="chs-order-details-section">
                      <h5>Dine-Out Information</h5>
                      <div className="chs-delivery-details">
                        <div className="chs-delivery-row">
                          <div>Table Number</div>
                          <div>{selectedOrder.dineout.tableNumber}</div>
                        </div>
                        <div className="chs-delivery-row">
                          <div>Number of People</div>
                          <div>{selectedOrder.dineout.people}</div>
                        </div>
                        <div className="chs-delivery-row">
                          <div>Time</div>
                          <div>{selectedOrder.dineout.time}</div>
                        </div>
                      </div>
                    </div>
                  )}
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