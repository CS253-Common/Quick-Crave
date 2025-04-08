import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaUser, FaHome, FaHistory, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { FaHeart } from "react-icons/fa";
import axios from 'axios';
import '../../styles/Customer/favourite_foods.css';

axios.defaults.withCredentials=true;

const FavouriteFoods = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [removingFoodId, setRemovingFoodId] = useState(null);
    const [favouriteFoods, setFavouriteFoods] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [profileImage, setProfileImage] = useState('/images/user_default.png');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: sessionStorage.getItem('name') || 'Guest',
        email: sessionStorage.getItem('email') || '',
        phone: sessionStorage.getItem('phone_number') || '',
        address: sessionStorage.getItem('address') || '',
        jwtToken: sessionStorage.getItem('JWT_TOKEN') || '',
        customerId: sessionStorage.getItem('customer_id') || ''
    });

    // Fetch favourite foods from API
    useEffect(() => {
        const fetchFavouriteFoods = async () => {
            try {
                setLoading(true);
                
                const response = await axios.post(
                    'http://localhost:4000/customer/customer-view-favourites',
                    {}
                );

                // console.log(response);

                if (response.data.success) {
                    // Transform API data to match our expected format
                    const transformedData = response.data.data.map((food, index) => ({
                        id: index + 1, // Using index as ID since API doesn't provide one
                        name: food.dish_name,
                        image: food.img_url,
                        price: food.price,
                        canteen: 'Canteen', // You might want to get this from API if available
                        rating: food.rating,
                        isVeg: food.is_veg,
                        isFavourite: true,
                        dish_id : food.dish_id  
                    }));
                    
                    setFavouriteFoods(transformedData);
                } else {
                    console.error('Error in response:', response.data.message);
                    setFavouriteFoods([]);
                }
            } catch (error) {
                console.error('Error fetching favourite foods:', error);
                setFavouriteFoods([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavouriteFoods();
    }, [userData.jwtToken]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleRemoveClick = (id) => {
        setSelectedFoodId(id);
        setShowRemoveConfirm(true);
    };

    const confirmRemove = async () => {
        if (selectedFoodId) {
            try {
                // Find the food item to get its dish_id
                const foodToRemove = favouriteFoods.find(food => food.id === selectedFoodId);
                
                if (foodToRemove) {
                    // Call API to remove from favorites using dish_id
                    const response = await axios.post(
                        'http://localhost:4000/customer/customer-remove-favourite',
                        {
                            dish_id: foodToRemove.dish_id // Make sure this property exists in your data
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${userData.jwtToken}`
                            }
                        }
                    );
    
                    if (response.data.success) {
                        // Set the id of the food being removed for animation
                        setRemovingFoodId(selectedFoodId);
                        
                        // Wait for animation to finish before removing from state
                        setTimeout(() => {
                            const updatedFavourites = favouriteFoods.filter(food => food.id !== selectedFoodId);
                            setFavouriteFoods(updatedFavourites);
                            setRemovingFoodId(null);
                            
                            // Close confirmation dialog
                            setShowRemoveConfirm(false);
                            setSelectedFoodId(null);
                        }, 300);
                    } else {
                        console.error('Failed to remove favorite:', response.data.message);
                        // Show error message to user if needed
                    }
                }
            } catch (error) {
                console.error('Error removing favorite:', error);
                // Show error message to user if needed
            }
        }
    };
    
    const cancelRemove = () => {
        setShowRemoveConfirm(false);
        setSelectedFoodId(null);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="ff-container">
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
                            <Link to="/customer-home"><FaHome /> Home</Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/customer-profile"><FaUser /> Profile</Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/customer-history"><FaHistory /> Order History</Link>
                        </li>
                        <li className="cs-menu-item active">
                            <Link to="/favourite-foods"><FaHeart /> Favourites</Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/login"><FaSignOutAlt /> Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="cf-main-content">
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
                            <img src="/images/user_default.png" alt="User" onError={(e) => { e.target.innerHTML = '<i class="fas fa-user"></i>'; e.target.style.display = 'flex'; }} />
                        </Link>
                    </div>
                </div>

                {/* Favourite Foods Content */}
                <div className="ff-content">
                    <div className="ff-header">
                        <h1>My Favourite Foods</h1>
                        <p className="ff-subtitle">Quickly order your favourite meals</p>
                    </div>

                    {loading ? (
                        <div className="ff-loading">
                            <p>Loading your favorite foods...</p>
                        </div>
                    ) : favouriteFoods.length > 0 ? (
                        <div className="ff-foods-grid">
                            {favouriteFoods.map(food => (
                                <div 
                                    key={food.id} 
                                    className={`ff-food-card ${removingFoodId === food.id ? 'ff-removing' : ''}`}
                                >
                                    <div className="ff-food-image">
                                        <img src={food.image} alt={food.name} onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = '/images/food_default.png';
                                        }} />
                                        <button 
                                            className="ff-favourite-btn ff-active"
                                            onClick={() => handleRemoveClick(food.id)}
                                            aria-label={`Remove ${food.name} from favourites`}
                                        >
                                            <FaHeart style={{ fontSize: '20px', color: 'red' }} /> 
                                        </button>
                                        
                                        {/* Veg/Non-Veg Indicator */}
                                        <div className="ff-veg-indicator">
                                            <img 
                                                src={food.isVeg ? "/images/veg_icon.png" : "/images/non_veg_icon.png"} 
                                                alt={food.isVeg ? "Vegetarian" : "Non-Vegetarian"} 
                                                className="ff-dietary-icon"
                                            />
                                        </div>
                                        
                                        {/* Rating Indicator */}
                                        <div className="ff-rating-indicator">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                                            </svg>
                                            <span className="ff-rating-value">{food.rating}</span>
                                        </div>
                                    </div>
                                    <div className="ff-food-info">
                                        <h3>{food.name}</h3>
                                        <p className="ff-food-canteen">{food.canteen}</p>
                                        <div className="ff-food-price">₹{food.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ff-no-favourites">
                            <div className="ff-no-favourites-icon">
                                <i className="fas fa-utensils"></i>
                            </div>
                            <h3>No favourite foods</h3>
                            <p>You haven't added any foods to your favourites yet.</p>
                            <Link to="/food-canteen-listing" className="ff-browse-foods-btn">
                                Browse Foods
                            </Link>
                        </div>
                    )}
                    
                    {/* Cart Button */}
                    <Link to="/cart" className="cart-button">
                        <FaShoppingCart />
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>
                </div>
            </div>
            
            {/* Remove Confirmation Modal */}
            {showRemoveConfirm && (
                <div className="ff-remove-confirm-overlay">
                    <div className="ff-remove-confirm-modal">
                        <h3>Remove from Favourites</h3>
                        <p>Are you sure you want to remove this item from your favourites?</p>
                        <div className="ff-confirm-actions">
                            <button className="ff-cancel-btn" onClick={cancelRemove}>No, Keep it</button>
                            <button className="ff-confirm-btn" onClick={confirmRemove}>Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavouriteFoods;