import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaSignOutAlt,
FaShoppingCart, FaSearch, FaMinus, FaPlus, FaStar } from 'react-icons/fa';
import '../../styles/Customer/canteen_details.css';
import '../../styles/Components/customer_sidemenu.css';

const CanteenDetails = ({ canteen }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('/images/user_default.png');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user data from session storage
  const userData = JSON.parse(sessionStorage.getItem('userData')) || {
    name: 'Guest',
    email: '',
    phone: '',
    address: ''
  };

  // State for food items and categories
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // Effect to load canteen data and food items
  useEffect(() => {
    if (!canteen) {
      const storedCanteen = sessionStorage.getItem('selected_canteen');
      if (storedCanteen) {
        try {
          const canteenData = JSON.parse(storedCanteen);
          fetchFoodItems(canteenData.id);
        } catch (error) {
          console.error('Error parsing canteen data:', error);
          setError('Failed to load canteen data');
        }
      } else {
        setError('No canteen selected');
        navigate('/food-canteen-listing');
      }
    } else {
      fetchFoodItems(canteen.id);
    }
    
    // Load cart from local storage
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);
  }, [canteen, navigate]);

  // Fetch food items from backend
  const fetchFoodItems = async (canteenId) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/customer/customer-fetch-menu', {
        canteen_id: canteenId
      });

      const fetchedFoodItems = response.data.map(item => ({
        id: item.dish_id,
        name: item.dish_name,
        price: `₹${item.price}`,
        image: item.img_url,
        rating: item.rating,
        isVeg: item.is_veg,
        category: item.dish_tag || 'Main Course'
      }));

      setFoodItems(fetchedFoodItems);

      // Extract unique categories
      const uniqueCategories = [...new Set(fetchedFoodItems.map(item => item.category))];
      setCategories(['all', ...uniqueCategories]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching food items:', error);
      setError('Failed to load food items');
      setLoading(false);
    }
  };

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addItemToCart = async (foodItem) => {
    try {
      await axios.post('http://localhost:4000/customer/customer-add-dish', {
        dish_id: foodItem.id
      });

      const existingItem = cartItems.find(item => item.id === foodItem.id);
      
      if (existingItem) {
        setCartItems(cartItems.map(item => 
          item.id === foodItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCartItems([...cartItems, { 
          ...foodItem,
          quantity: 1 
        }]);
      }
      
      displayNotification(`${foodItem.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      displayNotification(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  // Increase quantity in cart
  const increaseQuantity = async (foodItem) => {
    try {
      await axios.post('http://localhost:4000/customer/customer-add-dish', {
        dish_id: foodItem.id
      });

      setCartItems(cartItems.map(item => 
        item.id === foodItem.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } catch (error) {
      console.error("Error increasing quantity:", error);
      displayNotification('Failed to update quantity');
    }
  };

  // Decrease quantity in cart
  const decreaseQuantity = async (foodItem) => {
    const item = cartItems.find(item => item.id === foodItem.id);
    
    try {
      if (item.quantity > 1) {
        await axios.post('http://localhost:4000/customer/customer-remove-dish', {
          dish_id: foodItem.id
        });

        setCartItems(cartItems.map(item => 
          item.id === foodItem.id ? { ...item, quantity: item.quantity - 1 } : item
        ));
      } else {
        await removeItemFromCart(foodItem);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      displayNotification('Failed to update quantity');
    }
  };

  // Remove item from cart
  const removeItemFromCart = async (foodItem) => {
    try {
      await axios.post('http://localhost:4000/customer/customer-remove-dish', {
        dish_id: foodItem.id
      });

      setCartItems(cartItems.filter(item => item.id !== foodItem.id));
      displayNotification(`${foodItem.name} removed from cart`);
    } catch (error) {
      console.error("Error removing from cart:", error);
      displayNotification('Failed to remove item');
    }
  };

  // Get count of specific item in cart
  const getItemQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Display notification
  const displayNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  // Filter food items based on search term and active category
  const filteredFoodItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeCategory === 'all' || item.category === activeCategory)
  );

  // Handle cart button click
  const handleCartClick = (e) => {
    if (cartItems.length === 0) {
      e.preventDefault();
      displayNotification('Your cart is empty!');
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <div className="background">
      <div className="dineout">
        {/* Side Menu Overlay */}
        <div
          className={`cs-side-menu-overlay ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Side Menu */}
        <div className={`cs-side-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="cs-side-menu-header">
            <button className="cs-close-menu-btn" onClick={() => setIsMenuOpen(false)}>
              <FaTimes />
            </button>
            <div className="cs-menu-user-info">
              <div className="cs-menu-user-avatar">
                <img src={sessionStorage.getItem('img_url') || profileImage} alt="User Avatar" onError={(e) => {
                  e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
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
                <Link to="/customer-history"><FaHistory /> Order History</Link>
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
            <button className="cs-menu-btn" onClick={() => setIsMenuOpen(true)}>
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
                <img src={sessionStorage.getItem('img_url') || profileImage} alt="User" onError={(e) => {
                  e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
              </Link>
            </div>
          </div>

          {/* Canteen Name Title */}
          <div className="canteen-title">
            <h2>{canteen ? canteen.name : 'Loading...'}</h2>
            {canteen && (
              <div className="canteen-infoi">
                <div className="rating">
                  <FaStar /> {canteen.rating}
                </div>
                <div className="location">{canteen.address}</div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && <div className="loading">Loading food items...</div>}

          {/* Error State */}
          {error && <div className="error">{error}</div>}

          {/* Search Bar */}
          <div className="search-container">
            <FaSearch />
            <input
              type="text"
              className="search-input"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="category-scroll">
            <div className="category-wrapper">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          {!loading && !error && (
            <div className="food-gridi">
              {filteredFoodItems.map(item => {
                const quantity = getItemQuantity(item.id);

                return (
                  <div className="food-card" key={item.id}>
                    <div className="food-image">
                      <img src={item.image} alt={item.name} />
                      <div className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'} />
                    </div>
                    <div className="food-details">
                      <div className="food-name">{item.name}</div>
                      <div className="food-price">{item.price}</div>
                    </div>
                    <div className="card-actions">
                      <div className="rating-badge">
                        {item.rating} <FaStar />
                      </div>
                      {quantity > 0 ? (
                        <div className="quantity-selector">
                          <button className="quantity-btn" onClick={() => decreaseQuantity(item)}>
                            <FaMinus />
                          </button>
                          <span className="quantity-value">{quantity}</span>
                          <button className="quantity-btn" onClick={() => increaseQuantity(item)}>
                            <FaPlus />
                          </button>
                        </div>
                      ) : (
                        <button className="add-button" onClick={() => addItemToCart(item)}>
                          <FaPlus />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cart Button */}
          <Link to="/cart" className="cart-button" onClick={handleCartClick}>
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {/* Notification */}
          {showNotification && (
            <div className="notification show">
              {notificationMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanteenDetails;