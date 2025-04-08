import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaSignOutAlt, FaStar, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Customer/food_canteen_listing.css';
import '../../styles/Components/customer_sidemenu.css';

const CanteenListing = ({ setSelectedCanteen }) => {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [canteens, setCanteens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userData = {
    name: sessionStorage.getItem('name') || 'Guest',
    email: sessionStorage.getItem('email') || '',
    phone: sessionStorage.getItem('phone_number') || '', // Note the key matches what's in storage
    address: sessionStorage.getItem('address') || '',
    jwtToken: sessionStorage.getItem('JWT_TOKEN') || '', // You might want this too
    // Add other fields as needed
  };

  useEffect(() => {
    // Apply styles when the component mounts
    document.body.style.backgroundColor = "rgb(227, 227, 227)";
    document.body.style.backgroundImage = "url('/images/extended_pattern.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    // Cleanup: Reset styles when the component unmounts
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundAttachment = "";
    };
  }, []);

  // Fetch canteen data on component mount
  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const canteenResponse = await axios.post('http://localhost:4000/customer/customer-fetch-canteens', {});
        console.log(canteenResponse.data);
        setCanteens(canteenResponse.data.map(item => ({
          id: item.canteen_id,
          name: item.name,
          rating: item.rating,
          address: item.address,
          image: item.img_url
        })));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching canteens:", error);
        setIsLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  useEffect(() => {
    const savedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || { dishes: [], dish_map: {} };
    setCartItems(savedCartItems);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateCartInSession = (updatedCart) => {
    setCartItems(updatedCart);
    sessionStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const filteredCanteens = canteens.filter(canteen => 
    canteen.name.toLowerCase().includes(searchTerm) || 
    canteen.address.toLowerCase().includes(searchTerm)
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const totalItems = cartItems.dishes ? cartItems.dishes.length : 0;

  return (
    <div className="dineout">
      <div className={`cs-side-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      
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
            <li className="cs-menu-item">
              <Link to="/customer-history"><FaHistory /> Order History </Link>
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
            <Link to="/customer-profile" className="user-avatar">
              <img src={sessionStorage.getItem('img_url')} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search canteens..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Canteen Grid */}
        <div className="canteen-grid">
          {filteredCanteens.map(canteen => (
            <Link to="/reservation-booking" className="canteen-card-link" key={canteen.id} onClick={() => setSelectedCanteen(canteen)}>
              <div className="canteen-card">
                <div className="canteen-image">
                  <img src={canteen.image} alt={canteen.name} />
                </div>
                <div className="canteen-info">
                  <h3 className="canteen-name">{canteen.name}</h3>
                  <div className="canteen-rating">
                    <span className="rating-value">{canteen.rating}</span>
                    <FaStar />
                  </div>
                  <p className="canteen-location">{canteen.address}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Cart Button */}
        <Link to="/cart" className="cart-button">
          <FaShoppingCart />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>

        {/* Notification */}
        {showNotification && (
          <div className={`notification ${notificationType}`}>
            {notificationMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanteenListing;