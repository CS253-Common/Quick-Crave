import React, { useState, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import flatpickr from 'flatpickr';
import axios from 'axios';
import 'flatpickr/dist/flatpickr.min.css';
import '../../styles/Customer/reservation_booking.css';
import '../../styles/Components/customer_sidemenu.css';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaHistory, 
  FaHeart, 
  FaCog, 
  FaSignOutAlt,
  FaStar as solidStar,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaUtensils,
  FaRupeeSign,
  FaClock,
  FaMinus,
  FaPlus,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCheck,
  FaArrowRight,
  FaTimes as faCross
} from 'react-icons/fa';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const ReservationBooking = ({ canteen }) => {
  const navigate = useNavigate();
  
  // State variables
  const [peopleCount, setPeopleCount] = useState(2);
  const [reservationDate, setReservationDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('18:00');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationId, setReservationId] = useState('');
  const [profileImage, setProfileImage] = useState(sessionStorage.getItem('img_url') || '/images/user_default.png');
  const [error, setError] = useState(null);
  const [canteenData, setCanteenData] = useState({
    name: '',
    image: '',
    rating: 0,
    address: ''
  });
  const [cartItems, setCartItems] = useState({ dishes: [], dish_map: {} });
  
  // Get user data from session storage
// Instead of trying to parse a single 'userData' object, access each field individually
const userData = {
  name: sessionStorage.getItem('name') || 'Guest',
  email: sessionStorage.getItem('email') || '',
  phone: sessionStorage.getItem('phone_number') || '', // Note the key matches what's in storage
  address: sessionStorage.getItem('address') || '',
  jwtToken: sessionStorage.getItem('JWT_TOKEN') || '', // You might want this too
  // Add other fields as needed
};

  // Time slots data
  const timeSlots = [
    { id: 'time1', value: '11:00', label: '11:00 AM' },
    { id: 'time2', value: '12:00', label: '12:00 PM' },
    { id: 'time3', value: '13:00', label: '1:00 PM' },
    { id: 'time4', value: '14:00', label: '2:00 PM' },
    { id: 'time5', value: '17:00', label: '5:00 PM' },
    { id: 'time6', value: '18:00', label: '6:00 PM' },
    { id: 'time7', value: '19:00', label: '7:00 PM' },
    { id: 'time8', value: '20:00', label: '8:00 PM' }
  ];

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const response = await axios.post('http://localhost:4000/customer/customer-view-cart', {});
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems({ dishes: [], dish_map: {} });
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Load canteen data from props or session storage
  useEffect(() => {
    const loadCanteenData = () => {
      if (canteen) {
        // If canteen is passed as prop
        setCanteenData({
          name: canteen.name || '',
          image: canteen.image || '',
          rating: canteen.rating || 0,
          address: canteen.address || ''
        });
        // Also save to session storage for persistence
        sessionStorage.setItem('selected_canteen', JSON.stringify(canteen));
      } else {
        // Try to load from session storage
        const selectedCanteenData = sessionStorage.getItem('selected_canteen');
        if (selectedCanteenData) {
          try {
            const storedCanteen = JSON.parse(selectedCanteenData);
            setCanteenData({
              name: storedCanteen.name || '',
              image: storedCanteen.image || '',
              rating: storedCanteen.rating || 0,
              address: storedCanteen.address || ''
            });
          } catch (e) {
            console.error('Error parsing selected canteen data:', e);
          }
        }
      }
    };

    loadCanteenData();
  }, [canteen]);

  // Initialize date picker
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;
    setReservationDate(todayFormatted);

    const datePicker = flatpickr("#reservationDate", {
      minDate: "today",
      maxDate: new Date().fp_incr(30),
      dateFormat: "Y-m-d",
      disable: [
        function(date) {
          return date < new Date().setHours(0,0,0,0);
        }
      ],
      onChange: function(selectedDates, dateStr) {
        setReservationDate(dateStr);
        updateTimeSlots(dateStr);
      }
    });

    // Set default date
    datePicker.setDate(todayFormatted);

    return () => {
      datePicker.destroy();
    };
  }, []);

  // Update available time slots based on selected date
  const updateTimeSlots = (dateStr) => {
    console.log("Date selected:", dateStr);
  };

  // Handle people counter
  const handleIncrement = () => {
    if (peopleCount < 20) {
      setPeopleCount(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (peopleCount > 1) {
      setPeopleCount(prev => prev - 1);
    }
  };

  // Handle time slot selection
  const handleTimeSlotChange = (time) => {
    setSelectedTimeSlot(time);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reservationDate || !selectedTimeSlot) {
      alert('Please select both date and time for your reservation.');
      return;
    }
    
    const bookingId = generateBookingId();
    setReservationId(bookingId);
    
    const bookingData = {
      restaurantName: canteenData.name,
      people: peopleCount,
      date: reservationDate,
      time: selectedTimeSlot,
      specialRequest: specialRequest,
      bookingId: bookingId,
      userId: getCurrentUserId()
    };
    
    saveBooking(bookingData);
    
    // Show confirmation popup instead of alert
    setShowConfirmation(true);
  };

  // Handle "Return to Home" from confirmation popup
  const handleReturnHome = () => {
    setShowConfirmation(false);
    navigate('/customer-home');
  };

  // Helper functions
  const generateBookingId = () => {
    return 'RES' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
  };

  const getCurrentUserId = () => {
    return sessionStorage.getItem('current_user') || 'guest';
  };

  const saveBooking = (bookingData) => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  };

  // Toggle side menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('current_user');
    navigate('/login');
  };

  const totalItems = cartItems.dishes ? cartItems.dishes.length : 0;

  return (
    <div className="booking-page">
      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <div className="confirmation-icon">
              <FontAwesomeIcon icon={FaCheck} />
            </div>
            <h2>Reservation Confirmed!</h2>
            <p>Your reservation request has been successfully submitted.</p>
            
            <div className="confirmation-details">
              <div className="confirmation-row">
                <span className="label">Reservation ID</span>
                <span className="value">#{reservationId}</span>
              </div>
              <div className="confirmation-row">
                <span className="label">Date & Time</span>
                <span className="value">
                  {new Date(reservationDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} • {
                    new Date(`2000-01-01T${selectedTimeSlot}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })
                  }
                </span>
              </div>
            </div>
            
            <button className="return-home-btn" onClick={handleReturnHome}>
              Return to Home
            </button>
          </div>
        </div>
      )}

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
            <li className="cs-menu-item">
              <Link to="/customer-history"><FaHistory /> Order History </Link>
            </li>
            <li className="cs-menu-item">
              <Link to="/customer-favorites"><FaHeart /> Favorites </Link>
            </li>
            <li className="cs-menu-item">
              <Link to="/login"><FaSignOutAlt /> Logout </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="home-container">
        {/* Main Content */}
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
                <img src={profileImage} alt="User" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
              </Link>
            </div>
          </div>

          {/* Booking Container */}
          <div className="booking-container">
            <h2 className="section-title" style={{ color: "#090364" }}>Make New Reservation</h2>
            
            {/* Restaurant Info */}
            <div className="restaurant-info">
              <div className="restaurant-image">
                <img src={canteenData.image} alt={canteenData.name} />
              </div>
              <div className="restaurant-details">
                <h2>{canteenData.name}</h2>
                <div className="restaurant-rating">
                  <span className="stars">
                    {[...Array(4)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={solidStar} />
                    ))}
                    <FontAwesomeIcon icon={regularStar} />
                  </span>
                  <span className="rating-value">{canteenData.rating}</span>
                </div>
                <p className="restaurant-address">
                  <FontAwesomeIcon icon={FaMapMarkerAlt} /> {canteenData.address}
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="booking-form-container">
              <h1>Book Your Reservation</h1>
              <p className="booking-subtitle">Fill in the details below to reserve your table</p>
              
              <form id="bookingForm" className="booking-form" onSubmit={handleSubmit}>
                {/* Number of People Field */}
                <div className="form-group">
                  <label htmlFor="peopleCount">Number of People</label>
                  <div className="counter-input">
                    <button 
                      type="button" 
                      className="counter-btn decrement" 
                      onClick={handleDecrement}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input 
                      type="number" 
                      id="peopleCount" 
                      min="1" 
                      max="20" 
                      value={peopleCount} 
                      readOnly 
                    />
                    <button 
                      type="button" 
                      className="counter-btn increment" 
                      onClick={handleIncrement}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
                
                {/* Date Picker Field */}
                <div className="form-group">
                  <label htmlFor="reservationDate">Select Date</label>
                  <div className="date-input">
                    <input 
                      type="text" 
                      id="reservationDate" 
                      placeholder="Select a date" 
                      readOnly
                    />
                    <FontAwesomeIcon icon={FaCalendarAlt} />
                  </div>
                </div>
                
                {/* Time Slot Field */}
                <div className="form-group">
                  <label>Select Time Slot</label>
                  <div className="time-slots">
                    <div className="time-slot-column">
                      {timeSlots.slice(0, 4).map(slot => (
                        <div 
                          key={slot.id} 
                          className={`time-slot ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
                          data-time={slot.value}
                        >
                          <input 
                            type="radio" 
                            id={slot.id} 
                            name="timeSlot" 
                            value={slot.value}
                            checked={selectedTimeSlot === slot.value}
                            onChange={() => handleTimeSlotChange(slot.value)}
                          />
                          <label htmlFor={slot.id}>{slot.label}</label>
                        </div>
                      ))}
                    </div>
                    <div className="time-slot-column">
                      {timeSlots.slice(4).map(slot => (
                        <div 
                          key={slot.id} 
                          className={`time-slot ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
                          data-time={slot.value}
                        >
                          <input 
                            type="radio" 
                            id={slot.id} 
                            name="timeSlot" 
                            value={slot.value}
                            checked={selectedTimeSlot === slot.value}
                            onChange={() => handleTimeSlotChange(slot.value)}
                          />
                          <label htmlFor={slot.id}>{slot.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Special Request Field */}
                <div className="form-group">
                  <label htmlFor="specialRequest">Special Requests (Optional)</label>
                  <textarea 
                    id="specialRequest" 
                    placeholder="Any special requests or preferences?"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button type="submit" className="reserve-btn">
                  <FontAwesomeIcon icon={FaCalendarCheck} /> Reserve Now
                </button>
              </form>
            </div>
          </div>
          <Link to="/cart" className="cart-button">
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationBooking;
// import React, { useState, useEffect } from 'react';
// import {Link, useNavigate } from 'react-router-dom';
// import flatpickr from 'flatpickr';
// import axios from 'axios';
// import 'flatpickr/dist/flatpickr.min.css';
// import '../../styles/Customer/reservation_booking.css';
// import '../../styles/Components/customer_sidemenu.css';
// import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   FaBars, 
//   FaTimes, 
//   FaHome, 
//   FaUser, 
//   FaHistory, 
//   FaHeart, 
//   FaCog, 
//   FaSignOutAlt,
//   FaStar as solidStar,
//   FaMapMarkerAlt,
//   FaShoppingCart,
//   FaUtensils,
//   FaRupeeSign,
//   FaClock,
//   FaMinus,
//   FaPlus,
//   FaCalendarAlt,
//   FaCalendarCheck,
//   FaCheck,
//   FaArrowRight,
//   FaTimes as faCross
// } from 'react-icons/fa';
// import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

// const ReservationBooking = ({canteen }) => {
//   const navigate = useNavigate();
  
//   // State variables
//   const [peopleCount, setPeopleCount] = useState(2);
//   const [reservationDate, setReservationDate] = useState('');
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState('18:00');
//   const [specialRequest, setSpecialRequest] = useState('');
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [reservationId, setReservationId] = useState('');
//   const [profileImage, setProfileImage] = useState('/images/user_default.png');
//   const [error, setError] = useState(null);
//   // const [canteenData, setCanteenData] = useState(null);
//   // const [canteenData, setCanteenData] = useState({
//   //   name: 'Hall - 2 Canteen',
//   //   image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//   //   rating: '4.0',
//   //   location: 'South Campus, Building 5, Near Library',
//   //   cuisine: 'Indian, Chinese',
//   //   price: '₹100 for two',
//   //   time: '20-30 min'
//   // });
//   const [canteenData, setCanteenData] = useState({
//     name: '',
//     image: '',
//     rating: 0,
//     location: ''
//   });
  
//   // const [userData, setUserData] = useState({
//   //   name: 'ARIHANT KUMAR',
//   //   email: 'arikrrr@gmail.com',
//   //   phone: '9711XXXXX',
//   //   address: 'HALL 5, IITK - 208016'
//   // });
//   const userData = JSON.parse(sessionStorage.getItem('userData')) || {
//     name: 'Guest',
//     email: '',
//     phone: '',
//     address: ''
//   };


//   const fetchCartItems = async () => {
//     try {
//       const response = await axios.post('http://localhost:4000/customer/customer-view-cart', {});
//       setCartItems(response.data);
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//       setCartItems({ dishes: [], dish_map: {} });
//     }
//   };
//   const [cartItems, setCartItems] = useState([]);
//   useEffect(() => {
//     const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     setCartItems(savedCartItems);
//   }, []);
//   // Time slots data
//   const timeSlots = [
//     { id: 'time1', value: '11:00', label: '11:00 AM' },
//     { id: 'time2', value: '12:00', label: '12:00 PM' },
//     { id: 'time3', value: '13:00', label: '1:00 PM' },
//     { id: 'time4', value: '14:00', label: '2:00 PM' },
//     { id: 'time5', value: '17:00', label: '5:00 PM' },
//     { id: 'time6', value: '18:00', label: '6:00 PM' },
//     { id: 'time7', value: '19:00', label: '7:00 PM' },
//     { id: 'time8', value: '20:00', label: '8:00 PM' }
//   ];

//   // Load canteen data from session storage
//     useEffect(() => {
//     if (canteen) {
//       setCanteenData({
//         name: canteen.name || '',
//         image: canteen.image || '',
//         rating: canteen.rating || 0,
//         address: canteen.address || '',
//         // Keep the default values for other fields
//       });
//     } else {
//       const selectedCanteenData = sessionStorage.getItem('selected_canteen');
//       if (selectedCanteenData) {
//         try {
//           const storedCanteen = JSON.parse(selectedCanteenData);
//           setCanteenData({
//             name: storedCanteen.name || '',
//             image: storedCanteen.image || '',
//             rating: storedCanteen.rating || 0,
//             address: storedCanteen.address || '',
//             // Keep the default values for other fields
//           });
//         } catch (e) {
//           console.error('Error parsing selected canteen data:', e);
//         }
//       }
//     }
//     // console.log("hello");
//   }, [canteen]);

//   // useEffect(() => {
//   //   const loadSelectedCanteen = () => {
//   //     const selectedCanteenData = sessionStorage.getItem('selected_canteen');
      
//   //     if (selectedCanteenData) {
//   //       try {
//   //         const canteen = JSON.parse(selectedCanteenData);
//   //         setCanteenData(prev => ({
//   //           ...prev,
//   //           name: canteen.name || prev.name,
//   //           image: canteen.image || prev.image,
//   //           rating: canteen.rating || prev.rating,
//   //           location: canteen.location || prev.location
//   //         }));
//   //       } catch (e) {
//   //         console.error('Error parsing selected canteen data:', e);
//   //       }
//   //     }
//   //   };
    
//   //   loadSelectedCanteen();
//   // }, []);

//   // Initialize date picker
//   useEffect(() => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     const todayFormatted = `${year}-${month}-${day}`;
//     setReservationDate(todayFormatted);

//     const datePicker = flatpickr("#reservationDate", {
//       minDate: "today",
//       maxDate: new Date().fp_incr(30),
//       dateFormat: "Y-m-d",
//       disable: [
//         function(date) {
//           return date < new Date().setHours(0,0,0,0);
//         }
//       ],
//       onChange: function(selectedDates, dateStr) {
//         setReservationDate(dateStr);
//         updateTimeSlots(dateStr);
//       }
//     });

//     // Set default date
//     datePicker.setDate(todayFormatted);

//     return () => {
//       datePicker.destroy();
//     };
//   }, []);

//   // Update available time slots based on selected date
//   const updateTimeSlots = (dateStr) => {
//     console.log("Date selected:", dateStr);
//   };

//   // Handle people counter
//   const handleIncrement = () => {
//     if (peopleCount < 20) {
//       setPeopleCount(prev => prev + 1);
//     }
//   };

//   const handleDecrement = () => {
//     if (peopleCount > 1) {
//       setPeopleCount(prev => prev - 1);
//     }
//   };

//   // Handle time slot selection
//   const handleTimeSlotChange = (time) => {
//     setSelectedTimeSlot(time);
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!reservationDate || !selectedTimeSlot) {
//       alert('Please select both date and time for your reservation.');
//       return;
//     }
    
//     const bookingId = generateBookingId();
//     setReservationId(bookingId);
    
//     const bookingData = {
//       restaurantName: canteenData.name,
//       people: peopleCount,
//       date: reservationDate,
//       time: selectedTimeSlot,
//       specialRequest: specialRequest,
//       bookingId: bookingId,
//       userId: getCurrentUserId()
//     };
    
//     saveBooking(bookingData);
    
//     // Show confirmation popup instead of alert
//     setShowConfirmation(true);
//   };

//   // Handle "Return to Home" from confirmation popup
//   const handleReturnHome = () => {
//     setShowConfirmation(false);
//     navigate('/customer-home');
//   };

//   // Helper functions
//   const generateBookingId = () => {
//     return 'RES' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
//   };

//   const getCurrentUserId = () => {
//     const currentUser = sessionStorage.getItem('current_user');
//     return currentUser || 'guest';
//   };

//   const saveBooking = (bookingData) => {
//     const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
//     bookings.push(bookingData);
//     localStorage.setItem('bookings', JSON.stringify(bookings));
//   };

//   // Toggle side menu
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   // Handle logout
//   const handleLogout = (e) => {
//     e.preventDefault();
//     sessionStorage.removeItem('current_user');
//     navigate('/login');
//   };

//   const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <div class="booking-page">
//       {/* Confirmation Popup */}
//       {showConfirmation && (
//         <div className="confirmation-overlay">
//           <div className="confirmation-popup">
//             <div className="confirmation-icon">
//               <FontAwesomeIcon icon={FaCheck} />
//             </div>
//             <h2>Reservation Confirmed!</h2>
//             <p>Your reservation request has been successfully submitted.</p>
            
//             <div className="confirmation-details">
//               <div className="confirmation-row">
//                 <span className="label">Reservation ID</span>
//                 <span className="value">#{reservationId}</span>
//               </div>
//               <div className="confirmation-row">
//                 <span className="label">Date & Time</span>
//                 <span className="value">
//                   {new Date(reservationDate).toLocaleDateString('en-US', { 
//                     month: 'short', 
//                     day: 'numeric', 
//                     year: 'numeric' 
//                   })} • {
//                     new Date(`2000-01-01T${selectedTimeSlot}`).toLocaleTimeString('en-US', {
//                       hour: 'numeric',
//                       minute: 'numeric',
//                       hour12: true
//                     })
//                   }
//                 </span>
//               </div>
//             </div>
            
//             <button className="return-home-btn" onClick={handleReturnHome}>
//               Return to Home
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Side Menu Overlay */}
//       <div 
//         className={`side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
//         onClick={toggleMenu}
//       ></div>
      
//       {/* Side Menu */}
//       <div className={`cs-side-menu ${isMenuOpen ? 'active' : ''}`}>
//         <div className="cs-side-menu-header">
//           <button className="cs-close-menu-btn" onClick={toggleMenu}>
//             <FaTimes />
//           </button>
//           <div className="cs-menu-user-info">
//             <div className="cs-menu-user-avatar">
//               <img src={profileImage} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
//             </div>
//             <div className="cs-menu-user-details">
//               <h3 className="cs-menu-user-name">{userData.name}</h3>
//               <p className="cs-menu-user-email">{userData.email}</p>
//             </div>
//           </div>
//         </div>
//         <div className="cs-side-menu-content">
//           <ul className="cs-menu-items">
//             <li className="cs-menu-item">
//               <Link to="/customer-home"><FaHome /> Home </Link>
//             </li>
//             <li className="cs-menu-item">
//               <Link to="/customer-profile"><FaUser /> Profile </Link>
//             </li>
//             <li className="cs-menu-item">
//               <Link to="/customer-history"><FaHistory /> Order History </Link>
//             </li>
//             <li className="cs-menu-item">
//               <Link to="/customer-favorites"><FaHeart /> Favorites </Link>
//             </li>
//             <li className="cs-menu-item">
//               <Link to="/login"><FaSignOutAlt /> Logout </Link>
//             </li>
//           </ul>
//         </div>
//       </div>

//       <div className="home-container">
//         {/* Main Content */}
//         <div className="main-content">
//           {/* Top Navigation Bar */}
//           <div className="top-nav">
//             <button className="cs-menu-btn" onClick={toggleMenu}>
//               <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" /> 
//             </button>
//             <Link to="/customer-home" className="logo-link">
//               <div className="logo-container">
//                   <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
//                   <h1 className="logo-text">
//                       <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
//                   </h1>
//               </div>
//             </Link>
//             <div className="user-profile">
//               <Link to="/customer-profile" className="user-avatar" id="userAvatar">
//                 <img src="/images/user_default.png" alt="User" onError={(e) => { e.target.innerHTML = '<i class="fas fa-user"></i>'; e.target.style.display = 'flex'; }} />
//               </Link>
//             </div>
//           </div>

//           {/* Booking Container */}
//           <div className="booking-container">
//             <h2 className="section-title" style={{ color: "#090364" }}>Make New Reservation</h2>
            
//             {/* Restaurant Info */}
//             <div className="restaurant-info">
//               <div className="restaurant-image">
//                 <img src={canteenData.image} alt={canteenData.name} />
//               </div>
//               <div className="restaurant-details">
//                 <h2>{canteenData.name}</h2>
//                 <div className="restaurant-rating">
//                   <span className="stars">
//                     {[...Array(4)].map((_, i) => (
//                       <FontAwesomeIcon key={i} icon={solidStar} />
//                     ))}
//                     <FontAwesomeIcon icon={regularStar} />
//                   </span>
//                   <span className="rating-value">{canteenData.rating}</span>
//                 </div>
//                 <p className="restaurant-address">
//                   <FontAwesomeIcon icon={FaMapMarkerAlt} /> {canteenData.address}
//                 </p>
//               </div>
//             </div>

//             {/* Booking Form */}
//             <div className="booking-form-container">
//               <h1>Book Your Reservation</h1>
//               <p className="booking-subtitle">Fill in the details below to reserve your table</p>
              
//               <form id="bookingForm" className="booking-form" onSubmit={handleSubmit}>
//                 {/* Number of People Field */}
//                 <div className="form-group">
//                   <label htmlFor="peopleCount">Number of People</label>
//                   <div className="counter-input">
//                     <button 
//                       type="button" 
//                       className="counter-btn decrement" 
//                       onClick={handleDecrement}
//                     >
//                       <FontAwesomeIcon icon={faMinus} />
//                     </button>
//                     <input 
//                       type="number" 
//                       id="peopleCount" 
//                       min="1" 
//                       max="20" 
//                       value={peopleCount} 
//                       readOnly 
//                     />
//                     <button 
//                       type="button" 
//                       className="counter-btn increment" 
//                       onClick={handleIncrement}
//                     >
//                       <FontAwesomeIcon icon={faPlus} />
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Date Picker Field */}
//                 <div className="form-group">
//                   <label htmlFor="reservationDate">Select Date</label>
//                   <div className="date-input">
//                     <input 
//                       type="text" 
//                       id="reservationDate" 
//                       placeholder="Select a date" 
//                       readOnly
//                     />
//                     <FontAwesomeIcon icon={FaCalendarAlt} />
//                   </div>
//                 </div>
                
//                 {/* Time Slot Field */}
//                 <div className="form-group">
//                   <label>Select Time Slot</label>
//                   <div className="time-slots">
//                     <div className="time-slot-column">
//                       {timeSlots.slice(0, 4).map(slot => (
//                         <div 
//                           key={slot.id} 
//                           className={`time-slot ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
//                           data-time={slot.value}
//                         >
//                           <input 
//                             type="radio" 
//                             id={slot.id} 
//                             name="timeSlot" 
//                             value={slot.value}
//                             checked={selectedTimeSlot === slot.value}
//                             onChange={() => handleTimeSlotChange(slot.value)}
//                           />
//                           <label htmlFor={slot.id}>{slot.label}</label>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="time-slot-column">
//                       {timeSlots.slice(4).map(slot => (
//                         <div 
//                           key={slot.id} 
//                           className={`time-slot ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
//                           data-time={slot.value}
//                         >
//                           <input 
//                             type="radio" 
//                             id={slot.id} 
//                             name="timeSlot" 
//                             value={slot.value}
//                             checked={selectedTimeSlot === slot.value}
//                             onChange={() => handleTimeSlotChange(slot.value)}
//                           />
//                           <label htmlFor={slot.id}>{slot.label}</label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Special Request Field */}
//                 <div className="form-group">
//                   <label htmlFor="specialRequest">Special Requests (Optional)</label>
//                   <textarea 
//                     id="specialRequest" 
//                     placeholder="Any special requests or preferences?"
//                     value={specialRequest}
//                     onChange={(e) => setSpecialRequest(e.target.value)}
//                   ></textarea>
//                 </div>
                
//                 {/* Submit Button */}
//                 <button type="submit" className="reserve-btn">
//                   <FontAwesomeIcon icon={FaCalendarCheck} /> Reserve Now
//                 </button>
//               </form>
//             </div>
//           </div>
//           <Link to="/cart" className="cart-button">
//             <FaShoppingCart />
//             {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReservationBooking;
// // import React, { useState, useEffect } from 'react';
// // import {Link, useNavigate } from 'react-router-dom';
// // import flatpickr from 'flatpickr';
// // import axios from 'axios';
// // import 'flatpickr/dist/flatpickr.min.css';
// // import '../../styles/Customer/reservation_booking.css';
// // import '../../styles/Components/customer_sidemenu.css';
// // import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { 
// //   FaBars, 
// //   FaTimes, 
// //   FaHome, 
// //   FaUser, 
// //   FaHistory, 
// //   FaHeart, 
// //   FaCog, 
// //   FaSignOutAlt,
// //   FaStar as solidStar,
// //   FaMapMarkerAlt,
// //   FaShoppingCart,
// //   FaUtensils,
// //   FaRupeeSign,
// //   FaClock,
// //   FaMinus,
// //   FaPlus,
// //   FaCalendarAlt,
// //   FaCalendarCheck,
// //   FaCheck,
// //   FaArrowRight,
// //   FaTimes as faCross
// // } from 'react-icons/fa';
// // import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

// // const ReservationBooking = ({ canteen }) => {
// //   const navigate = useNavigate();
  
// //   // State variables
// //   const [peopleCount, setPeopleCount] = useState(2);
// //   const [reservationDate, setReservationDate] = useState('');
// //   const [selectedTimeSlot, setSelectedTimeSlot] = useState('18:00');
// //   const [specialRequest, setSpecialRequest] = useState('');
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const [showConfirmation, setShowConfirmation] = useState(false);
// //   const [reservationId, setReservationId] = useState('');
// //   const [profileImage, setProfileImage] = useState('/images/user_default.png');
// //   const [error, setError] = useState(null);
// //   const [canteenData, setCanteenData] = useState({
// //     name: '',
// //     image: '',
// //     rating: 0,
// //     address: '',
// //     // Default values for other fields shown in the UI
// //   });
  
// //   const userData = JSON.parse(sessionStorage.getItem('userData')) || {
// //     name: 'Guest',
// //     email: '',
// //     phone: '',
// //     address: ''
// //   };

// //   const fetchCartItems = async () => {
// //     try {
// //       const response = await axios.post('http://localhost:4000/customer/customer-view-cart', {});
// //       setCartItems(response.data);
// //     } catch (error) {
// //       console.error("Error fetching cart items:", error);
// //       setCartItems({ dishes: [], dish_map: {} });
// //     }
// //   };
  
// //   const [cartItems, setCartItems] = useState([]);
  
// //   useEffect(() => {
// //     const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
// //     setCartItems(savedCartItems);
// //   }, []);

// //   // Time slots data
// //   const timeSlots = [
// //     { id: 'time1', value: '11:00', label: '11:00 AM' },
// //     { id: 'time2', value: '12:00', label: '12:00 PM' },
// //     { id: 'time3', value: '13:00', label: '1:00 PM' },
// //     { id: 'time4', value: '14:00', label: '2:00 PM' },
// //     { id: 'time5', value: '17:00', label: '5:00 PM' },
// //     { id: 'time6', value: '18:00', label: '6:00 PM' },
// //     { id: 'time7', value: '19:00', label: '7:00 PM' },
// //     { id: 'time8', value: '20:00', label: '8:00 PM' }
// //   ];

// //   // Set canteen data from props or session storage
// //   useEffect(() => {
// //     if (canteen) {
// //       setCanteenData({
// //         name: canteen.name || '',
// //         image: canteen.image || '',
// //         rating: canteen.rating || 0,
// //         address: canteen.address || '',
// //         // Keep the default values for other fields
// //       });
// //     } else {
// //       const selectedCanteenData = sessionStorage.getItem('selected_canteen');
// //       if (selectedCanteenData) {
// //         try {
// //           const storedCanteen = JSON.parse(selectedCanteenData);
// //           setCanteenData({
// //             name: storedCanteen.name || '',
// //             image: storedCanteen.image || '',
// //             rating: storedCanteen.rating || 0,
// //             address: storedCanteen.address || '',
// //             // Keep the default values for other fields
// //           });
// //         } catch (e) {
// //           console.error('Error parsing selected canteen data:', e);
// //         }
// //       }
// //     }
// //     // console.log("hello");
// //   }, [canteen]);

// //   // Rest of your existing code remains the same...
// //   // Initialize date picker
// //   useEffect(() => {
// //     const today = new Date();
// //     const year = today.getFullYear();
// //     const month = String(today.getMonth() + 1).padStart(2, '0');
// //     const day = String(today.getDate()).padStart(2, '0');
// //     const todayFormatted = `${year}-${month}-${day}`;
// //     setReservationDate(todayFormatted);

// //     const datePicker = flatpickr("#reservationDate", {
// //       minDate: "today",
// //       maxDate: new Date().fp_incr(30),
// //       dateFormat: "Y-m-d",
// //       disable: [
// //         function(date) {
// //           return date < new Date().setHours(0,0,0,0);
// //         }
// //       ],
// //       onChange: function(selectedDates, dateStr) {
// //         setReservationDate(dateStr);
// //         updateTimeSlots(dateStr);
// //       }
// //     });

// //     // Set default date
// //     datePicker.setDate(todayFormatted);

// //     return () => {
// //       datePicker.destroy();
// //     };
// //   }, []);

// //   // Update available time slots based on selected date
// //   const updateTimeSlots = (dateStr) => {
// //     console.log("Date selected:", dateStr);
// //   };

// //   // Handle people counter
// //   const handleIncrement = () => {
// //     if (peopleCount < 20) {
// //       setPeopleCount(prev => prev + 1);
// //     }
// //   };

// //   const handleDecrement = () => {
// //     if (peopleCount > 1) {
// //       setPeopleCount(prev => prev - 1);
// //     }
// //   };

// //   // Handle time slot selection
// //   const handleTimeSlotChange = (time) => {
// //     setSelectedTimeSlot(time);
// //   };

// //   // Handle form submission
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
    
// //     if (!reservationDate || !selectedTimeSlot) {
// //       alert('Please select both date and time for your reservation.');
// //       return;
// //     }
    
// //     const bookingId = generateBookingId();
// //     setReservationId(bookingId);
    
// //     const bookingData = {
// //       restaurantName: canteenData.name,
// //       people: peopleCount,
// //       date: reservationDate,
// //       time: selectedTimeSlot,
// //       specialRequest: specialRequest,
// //       bookingId: bookingId,
// //       userId: getCurrentUserId()
// //     };
    
// //     saveBooking(bookingData);
    
// //     // Show confirmation popup instead of alert
// //     setShowConfirmation(true);
// //   };

// //   // Handle "Return to Home" from confirmation popup
// //   const handleReturnHome = () => {
// //     setShowConfirmation(false);
// //     navigate('/customer-home');
// //   };

// //   // Helper functions
// //   const generateBookingId = () => {
// //     return 'RES' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
// //   };

// //   const getCurrentUserId = () => {
// //     const currentUser = sessionStorage.getItem('current_user');
// //     return currentUser || 'guest';
// //   };

// //   const saveBooking = (bookingData) => {
// //     const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
// //     bookings.push(bookingData);
// //     localStorage.setItem('bookings', JSON.stringify(bookings));
// //   };

// //   // Toggle side menu
// //   const toggleMenu = () => {
// //     setIsMenuOpen(!isMenuOpen);
// //   };

// //   // Handle logout
// //   const handleLogout = (e) => {
// //     e.preventDefault();
// //     sessionStorage.removeItem('current_user');
// //     navigate('/login');
// //   };

// //   const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

// //   return (
// //     <div class="booking-page">
// //       {/* Confirmation Popup */}
// //       {showConfirmation && (
// //         <div className="confirmation-overlay">
// //           <div className="confirmation-popup">
// //             <div className="confirmation-icon">
// //               <FontAwesomeIcon icon={FaCheck} />
// //             </div>
// //             <h2>Reservation Confirmed!</h2>
// //             <p>Your reservation request has been successfully submitted.</p>
            
// //             <div className="confirmation-details">
// //               <div className="confirmation-row">
// //                 <span className="label">Reservation ID</span>
// //                 <span className="value">#{reservationId}</span>
// //               </div>
// //               <div className="confirmation-row">
// //                 <span className="label">Date & Time</span>
// //                 <span className="value">
// //                   {new Date(reservationDate).toLocaleDateString('en-US', { 
// //                     month: 'short', 
// //                     day: 'numeric', 
// //                     year: 'numeric' 
// //                   })} • {
// //                     new Date(`2000-01-01T${selectedTimeSlot}`).toLocaleTimeString('en-US', {
// //                       hour: 'numeric',
// //                       minute: 'numeric',
// //                       hour12: true
// //                     })
// //                   }
// //                 </span>
// //               </div>
// //             </div>
            
// //             <button className="return-home-btn" onClick={handleReturnHome}>
// //               Return to Home
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Side Menu Overlay */}
// //       <div 
// //         className={`side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
// //         onClick={toggleMenu}
// //       ></div>
      
// //       {/* Side Menu */}
// //       <div className={`cs-side-menu ${isMenuOpen ? 'active' : ''}`}>
// //         <div className="cs-side-menu-header">
// //           <button className="cs-close-menu-btn" onClick={toggleMenu}>
// //             <FaTimes />
// //           </button>
// //           <div className="cs-menu-user-info">
// //             <div className="cs-menu-user-avatar">
// //               <img src={profileImage} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
// //             </div>
// //             <div className="cs-menu-user-details">
// //               <h3 className="cs-menu-user-name">{userData.name}</h3>
// //               <p className="cs-menu-user-email">{userData.email}</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="cs-side-menu-content">
// //           <ul className="cs-menu-items">
// //             <li className="cs-menu-item">
// //               <Link to="/customer-home"><FaHome /> Home </Link>
// //             </li>
// //             <li className="cs-menu-item">
// //               <Link to="/customer-profile"><FaUser /> Profile </Link>
// //             </li>
// //             <li className="cs-menu-item">
// //               <Link to="/customer-history"><FaHistory /> Order History </Link>
// //             </li>
// //             <li className="cs-menu-item">
// //               <Link to="/customer-favorites"><FaHeart /> Favorites </Link>
// //             </li>
// //             <li className="cs-menu-item">
// //               <Link to="/login"><FaSignOutAlt /> Logout </Link>
// //             </li>
// //           </ul>
// //         </div>
// //       </div>

// //       <div className="home-container">
// //         {/* Main Content */}
// //         <div className="main-content">
// //           {/* Top Navigation Bar */}
// //           <div className="top-nav">
// //             <button className="cs-menu-btn" onClick={toggleMenu}>
// //               <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" /> 
// //             </button>
// //             <Link to="/customer-home" className="logo-link">
// //               <div className="logo-container">
// //                   <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
// //                   <h1 className="logo-text">
// //                       <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
// //                   </h1>
// //               </div>
// //             </Link>
// //             <div className="user-profile">
// //               <Link to="/customer-profile" className="user-avatar" id="userAvatar">
// //                 <img src="/images/user_default.png" alt="User" onError={(e) => { e.target.innerHTML = '<i class="fas fa-user"></i>'; e.target.style.display = 'flex'; }} />
// //               </Link>
// //             </div>
// //           </div>

// //           {/* {/* Booking Container} */}
// //             <div className="booking-container">
// //             <h2 className="section-title" style={{ color: "#090364" }}>Make New Reservation</h2>
            
// //              {/* Restaurant Info */}
// //              <div className="restaurant-image">
// //             <div className="restaurant-info">
// //                  <img src={canteenData.image} alt={canteenData.name} />
// //                </div>
// //                <div className="restaurant-details">
// //                  <h2>{canteenData.name}</h2>
// //                  <div className="restaurant-rating">
// //                    <span className="stars">
// //                      {[...Array(4)].map((_, i) => (
// //                        <FontAwesomeIcon key={i} icon={solidStar} />
// //                      ))}
// //                      <FontAwesomeIcon icon={regularStar} />
// //                    </span>
// //                    <span className="rating-value">{canteenData.rating}</span>
// //                  </div>
// //                  <p className="restaurant-address">
// //                    <FontAwesomeIcon icon={FaMapMarkerAlt} /> {canteenData.location}
// //                  </p>
// //                  <div className="restaurant-features">
// //                    <span className="feature">
// //                      <FontAwesomeIcon icon={FaUtensils} /> {canteenData.cuisine}
// //                    </span>
// //                    <span className="feature">
// //                      <FontAwesomeIcon icon={FaRupeeSign} /> {canteenData.price}
// //                    </span>
// //                   <span className="feature">
// //                      <FontAwesomeIcon icon={FaClock} /> {canteenData.time}
// //                    </span>
// //                  </div>
// //              </div>
// //              </div> 


// //             {/* Booking Form */}
// //             <div className="booking-form-container">
// //               <h1>Book Your Reservation</h1>
// //               <p className="booking-subtitle">Fill in the details below to reserve your table</p>
              
// //               <form id="bookingForm" className="booking-form" onSubmit={handleSubmit}>
// //                 {/* Number of People Field */}
// //                 <div className="form-group">
// //                   <label htmlFor="peopleCount">Number of People</label>
// //                   <div className="counter-input">
// //                     <button 
// //                       type="button" 
// //                       className="counter-btn decrement" 
// //                       onClick={handleDecrement}
// //                     >
// //                       <FontAwesomeIcon icon={faMinus} />
// //                     </button>
// //                     <input 
// //                       type="number" 
// //                       id="peopleCount" 
// //                       min="1" 
// //                       max="20" 
// //                       value={peopleCount} 
// //                       readOnly 
// //                     />
// //                     <button 
// //                       type="button" 
// //                       className="counter-btn increment" 
// //                       onClick={handleIncrement}
// //                     >
// //                       <FontAwesomeIcon icon={faPlus} />
// //                     </button>
// //                   </div>
// //                 </div>
                
// //                 {/* Date Picker Field */}
// //                 <div className="form-group">
// //                   <label htmlFor="reservationDate">Select Date</label>
// //                   <div className="date-input">
// //                     <input 
// //                       type="text" 
// //                       id="reservationDate" 
// //                       placeholder="Select a date" 
// //                       readOnly
// //                     />
// //                     <FontAwesomeIcon icon={FaCalendarAlt} />
// //                   </div>
// //                 </div>
                
// //                 {/* Time Slot Field */}
// //                 <div className="form-group">
// //                   <label>Select Time Slot</label>
// //                   <div className="time-slots">
// //                     <div className="time-slot-column">
// //                       {timeSlots.slice(0, 4).map(slot => (
// //                         <div 
// //                           key={slot.id} 
// //                           className={`time-slot ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
// //                           data-time={slot.value}
// //                         >
// //                           <input 
// //                             type="radio" 
// //                             id={slot.id} 
// //                             name="timeSlot" 
// //                             value={slot.value}
// //                             checked={selectedTimeSlot === slot.value}
// //                             onChange={() => handleTimeSlotChange(slot.value)}
// //                           />
// //                           <label htmlFor={slot.id}>{slot.label}</label>
// //                         </div>
// //                       ))}
// //                     </div>
// //                     <div className="time-slot-column">
// //                       {timeSlots.slice(4).map(slot => (
// //                         <div 
// //                           key={slot.id} 
// //                           className={`time-slot ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
// //                           data-time={slot.value}
// //                         >
// //                           <input 
// //                             type="radio" 
// //                             id={slot.id} 
// //                             name="timeSlot" 
// //                             value={slot.value}
// //                             checked={selectedTimeSlot === slot.value}
// //                             onChange={() => handleTimeSlotChange(slot.value)}
// //                           />
// //                           <label htmlFor={slot.id}>{slot.label}</label>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 {/* Special Request Field */}
// //                 <div className="form-group">
// //                   <label htmlFor="specialRequest">Special Requests (Optional)</label>
// //                   <textarea 
// //                     id="specialRequest" 
// //                     placeholder="Any special requests or preferences?"
// //                     value={specialRequest}
// //                     onChange={(e) => setSpecialRequest(e.target.value)}
// //                   ></textarea>
// //                 </div>
                
// //                 {/* Submit Button */}
// //                 <button type="submit" className="reserve-btn">
// //                   <FontAwesomeIcon icon={FaCalendarCheck} /> Reserve Now
// //                 </button>
// //               </form>
// //             </div>
// //           </div>
// //           <Link to="/cart" className="cart-button">
// //             <FaShoppingCart />
// //             {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ReservationBooking;