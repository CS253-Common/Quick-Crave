import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaCog, FaSignOutAlt, FaStar, FaMinus, FaPlus, FaSearch,FaShoppingCart, FaUserCircle, FaCamera, FaEdit, FaLock, FaClipboardList, FaUtensils, FaHamburger, FaCalendarCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// Avatar to be changed
import '../../styles/Customer/food_canteen_listing.css'
import '../../styles/Components/customer_sidemenu.css';

const FoodCanteenListing = ({ setSelectedCanteen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('images/imagesfile/user-avatar.jpg');
    const [userData, setUserData] = useState({
        name: 'ARIHANT KUMAR',
        email: 'arikrrr@gmail.com',
        phone: '9711XXXXX',
        address: 'HALL 5, IITK - 208016'
    })
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

      const demoCanteens = [
        {
          id: 1,
          name: 'Italian Kitchen',
          rating: 4.6,
          location: 'Pizza, Pasta, Lasagna',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 2,
          name: 'Spice Garden',
          rating: 4.8,
          location: 'Biryani, Curries, Kebabs',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 3,
          name: 'Punjab Dhaba',
          rating: 4.5,
          location: 'Paneer, Naan, Dal Makhani',
          image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 4,
          name: 'China Town',
          rating: 4.2,
          location: 'Noodles, Fried Rice, Manchurian',
          image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      ];


  const [activeTab, setActiveTab] = useState('food');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [canteens, setCanteens] = useState(demoCanteens);

  // Sample food data
  const foodItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      source: 'Italian Kitchen',
      price: '₹299',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'veg'
    },
    {
      id: 2,
      name: 'Chicken Biryani',
      source: 'Spice Garden',
      price: '₹180',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'non-veg'
    },
    {
      id: 3,
      name: 'Paneer Butter Masala',
      source: 'Punjab Dhaba',
      price: '₹220',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'veg'
    },
    {
      id: 4,
      name: 'Veg Hakka Noodles',
      source: 'China Town',
      price: '₹150',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'veg'
    },
    {
      id: 5,
      name: 'Classic Chicken Burger',
      source: 'Burger Station',
      price: '₹180',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'non-veg'
    },
    {
      id: 6,
      name: 'Idli Chutney',
      source: 'South Indian Cafe',
      price: '₹120',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'veg'
    },
    {
      id: 7,
      name: 'Idli Chutney',
      source: 'South Indian Cafe',
      price: '₹120',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'veg'
    }
  ];

  // Sample canteen data
  const fetchCanteens = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/canteens"); // Replace with actual API URL
      setCanteens(response.data); // Update canteens state
    } catch (error) {
      setCanteens(demoCanteens);
      console.error("Error fetching canteens:", error);
    }
  };

    useEffect(() => {
        fetchCanteens();
    }, []);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);
  }, []);

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const addToCart = (foodItem) => {
    const existingItem = cartItems.find(item => item.id === foodItem.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === foodItem.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...foodItem, quantity: 1 }]);
    }
    
    showNotificationMessage(`${foodItem.name} added to cart`);
  };

  const increaseQuantity = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    
    if (item.quantity > 1) {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      removeFromCart(itemId);
    }
  };

  const removeFromCart = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    setCartItems(cartItems.filter(item => item.id !== itemId));
    showNotificationMessage(`${item.name} removed from cart`);
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const getItemQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm) || 
    item.source.toLowerCase().includes(searchTerm)
  );

  const filteredCanteens = canteens.filter(canteen => 
    canteen.name.toLowerCase().includes(searchTerm) || 
    canteen.location.toLowerCase().includes(searchTerm)
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    
    <div className = "dineout">
    <div 
    className={`cs-side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
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
                    <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                </h1>
            </div>
            <div className="user-profile">
                <Link to="/customer-profile" className="user-avatar">
                    <img src={profileImage} alt="User" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
                </Link>
            </div>
        </div>

      {/* Search Bar */}
      <div className="search-container">
        <FaSearch />
        <input 
          type="text" 
          className="search-input" 
          placeholder={activeTab === 'food' ? 'Search food or canteen...' : 'Select canteen from below'} 
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Category Tabs */}
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'canteen' ? 'active' : ''}`} 
          onClick={() => handleTabChange('canteen')}
        >
          Canteen
        </button>
        <button 
          className={`tab ${activeTab === 'food' ? 'active' : ''}`} 
          onClick={() => handleTabChange('food')}
        >
          Food
        </button>
      </div>

      {/* Food Items Grid */}
      {activeTab === 'food' && (
        <div className="food-grid">
          {filteredFoodItems.map(food => (
            <div className="food-card" key={food.id}>
              <div className="food-image">
                <img src={food.image} alt={food.name} />
              </div>
              <div className={`${food.type === 'veg' ? 'veg' : 'non-veg'}-indicator`}></div>
              <h3 className="food-name">{food.name}</h3>
              <p className="food-source">{food.source}</p>
              <p className="food-price">{food.price}</p>
              <div className="rating-badge">
                <span>{food.rating}</span>
                <FaStar />
              </div>
              
              {getItemQuantity(food.id) > 0 ? (
                <div className="quantity-selector">
                  <button className="quantity-btn minus-btn" onClick={() => decreaseQuantity(food.id)}>
                    <FaMinus />
                  </button>
                  <span className="quantity-value">{getItemQuantity(food.id)}</span>
                  <button className="quantity-btn plus-btn" onClick={() => increaseQuantity(food.id)}>
                    <FaPlus />
                  </button>
                </div>
              ) : (
                <button className="add-button" onClick={() => addToCart(food)}>
                  <FaPlus />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Canteen Grid */}
      {activeTab === 'canteen' && (
        <div className="canteen-grid">
          {filteredCanteens.map(canteen => (
            <Link to="/canteen-details" className="canteen-card-link" key={canteen.id} onClick={() => setSelectedCanteen(canteen)}>
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
                  <p className="canteen-location">{canteen.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

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

export default FoodCanteenListing;