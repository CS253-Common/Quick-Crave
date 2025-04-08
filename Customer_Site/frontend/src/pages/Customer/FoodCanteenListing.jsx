import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaCog, FaSignOutAlt, FaStar, FaMinus, FaPlus, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Customer/food_canteen_listing.css';
import '../../styles/Components/customer_sidemenu.css';

const FoodCanteenListing = ({ setSelectedCanteen }) => {

      // State management
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [activeTab, setActiveTab] = useState('canteen');
      const [searchTerm, setSearchTerm] = useState('');
      const [cartItems, setCartItems] = useState([]);
      const [showNotification, setShowNotification] = useState(false);
      const [notificationMessage, setNotificationMessage] = useState('');
      const [notificationType, setNotificationType] = useState('success');
      const [foodItems, setFoodItems] = useState([]);
      const [canteens, setCanteens] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [favouriteFoods, setFavouriteFoods] = useState([]);

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

  // Fetch data on component mount and tab change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'food') {
          const foodResponse = await axios.post('http://localhost:4000/customer/customer-fetch-dishes',{});
          const favouritesResponse = await axios.post('http://localhost:4000/customer/customer-view-favourites',{});
          console.log(foodResponse.data);
          setFoodItems(foodResponse.data.map(item => ({
            id: item.dish_id,
            name: item.dish_name,
            source: item.canteen_name,
            price: `₹${item.price}`,
            rating: item.rating,
            image: item.img_url,
            type: item.is_veg ? 'veg' : 'non-veg'
          })));
          console.log(favouritesResponse);
          setFavouriteFoods(favouritesResponse.data.data.map(item => item.dish_id));
        } else {
          const canteenResponse = await axios.post('http://localhost:4000/customer/customer-fetch-canteens',{});
          console.log(canteenResponse.data) ; 
          setCanteens(canteenResponse.data.map(item => ({
            canteen_id: item.canteen_id,
            name: item.name,
            rating: item.rating,
            address: item.address,
            image: item.img_url
          })));
        }
        setIsLoading(false);
      } catch (error) {
        // console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const addToCart = async (foodItem) => {
    try {
        const response = await axios.post('http://localhost:4000/customer/customer-add-dish', {
            dish_id: foodItem.id
        });

        // Fetch updated cart from backend
        const cartResponse = await axios.post('http://localhost:4000/customer/customer-view-cart');
        updateCartInSession(cartResponse.data);
        
        showNotificationMessage(`${foodItem.name} added to cart`);
    } catch (error) {
        console.log(error.response?.data?.message);
        showNotificationMessage(error.response?.data?.message || 'Error adding to cart', 'error');
    }
};

  const increaseQuantity = async (itemId) => {
    try {
        const response = await axios.post('http://localhost:4000/customer/customer-add-dish', {
            dish_id: itemId
        });

        // Fetch updated cart from backend
        const cartResponse = await axios.post('http://localhost:4000/customer/customer-view-cart');
        updateCartInSession(cartResponse.data);
    } catch (error) {
        showNotificationMessage('Failed to update quantity', 'error');
        console.error("Error updating quantity:", error);
    }
  };  

  const decreaseQuantity = async (itemId) => {
    try {
        const response = await axios.post('http://localhost:4000/customer/customer-remove-dish', {
            dish_id: itemId
        });

        // Fetch updated cart from backend
        const cartResponse = await axios.post('http://localhost:4000/customer/customer-view-cart');
        updateCartInSession(cartResponse.data);
    } catch (error) {
        showNotificationMessage('Failed to update quantity', 'error');
        console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
        const response = await axios.post('http://localhost:4000/customer/customer-remove-dish', {
            dish_id: itemId
        });

        // Fetch updated cart from backend
        const cartResponse = await axios.post('http://localhost:4000/customer/customer-view-cart');
        updateCartInSession(cartResponse.data);
        
        const item = cartItems.dishes.find(dish => dish.dish_id === itemId);
        if (item) {
            showNotificationMessage(`${item.dish_name} removed from cart`);
        }
    } catch (error) {
        showNotificationMessage('Failed to remove item', 'error');
        console.error("Error removing item:", error);
    }
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
    return cartItems.dish_map?.[itemId] || 0;
  };

  //new
  const toggleFavorite = async (dishId) => {
    try {
      if (favouriteFoods.includes(dishId)) {
        // Remove from favorites
        const response = await axios.post(
          'http://localhost:4000/customer/customer-remove-favourite',
          { dish_id: dishId },
          {
            headers: {
              'Authorization': `Bearer ${userData.jwtToken}`
            }
          }
        );
        
        if (response.data.success) {
          setFavouriteFoods(favouriteFoods.filter(id => id !== dishId));
          showNotificationMessage('Removed from favorites');
        }
      } else {
        // Add to favorites
        const response = await axios.post(
          'http://localhost:4000/customer/customer-add-favourite',
          { dish_id: dishId },
          {
            headers: {
              'Authorization': `Bearer ${userData.jwtToken}`
            }
          }
        );
        
        if (response.data.success) {
          setFavouriteFoods([...favouriteFoods, dishId]);
          showNotificationMessage('Added to favorites!');
        }
      }
    } catch (error) {
      showNotificationMessage('Error updating favorites', 'error');
    }
  };
  //new

  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm) || 
    item.source.toLowerCase().includes(searchTerm)
  );

  const filteredCanteens = canteens.filter(canteen => 
    canteen.name.toLowerCase().includes(searchTerm) || 
    canteen.address.toLowerCase().includes(searchTerm)
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const addToFavorites = async (dishId) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/customer/customer-add-favourite',
        { dish_id: dishId },
        {
          headers: {
            'Authorization': `Bearer ${userData.jwtToken}`
          }
        }
      );
  
      if (response.data.success) {
        showNotificationMessage('Added to favorites!');
      } else {
        showNotificationMessage(response.data.message || 'Failed to add to favorites', 'error');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      showNotificationMessage('Error adding to favorites', 'error');
    }
  };

  const totalItems = cartItems.dishes ? cartItems.dishes.length : 0;

  return (
    <div className = "dineout">
    <div className={`cs-side-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}
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
              
              {/* Move the favorite button here, near the add/quantity controls */}
              <div className="food-card-actions">
                {/* <button 
                  className="favorite-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToFavorites(food.id);
                  }}
                  aria-label={`Add ${food.name} to favorites`}
                >
                  <FaHeart />
                </button> */}
                
                <button 
                  className={`favorite-button ${favouriteFoods.includes(food.id) ? 'active' : ''}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(food.id);
                  }}
                  aria-label={`${favouriteFoods.includes(food.id) ? 'Remove from' : 'Add to'} favorites`}
                >
                  <FaHeart />
                </button>

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
                  <p className="canteen-location">{canteen.address}</p>
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