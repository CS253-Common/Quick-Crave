import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaUser, FaHome, FaHistory, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { FaHeart } from "react-icons/fa";
import '../../styles/Customer/favourite_foods.css';

const FavouriteFoods = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [removingFoodId, setRemovingFoodId] = useState(null);
    const [favouriteFoods, setFavouriteFoods] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [profileImage, setProfileImage] = useState('images/imagesfile/user-avatar.jpg');
    const [userData, setUserData] = useState({
        name: 'ARIHANT KUMAR',
        email: 'arikrrr@gmail.com',
        phone: '9711XXXXX',
        address: 'HALL 5, IITK - 208016'
    });

    // Load favourite foods from localStorage
    useEffect(() => {
        const storedFavourites = JSON.parse(localStorage.getItem('favouriteFoods')) || [];
        
        // If no stored favourites, use some default data
        if (storedFavourites.length === 0) {
            const defaultFavourites = [
                {
                    id: 1,
                    name: 'Butter Chicken',
                    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                    price: 180,
                    canteen: 'Central Dining Hall',
                    rating: 4.8,
                    isVeg: false,
                    isFavourite: true
                },
                {
                    id: 2,
                    name: 'Paneer Tikka',
                    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                    price: 160,
                    canteen: 'Student Café Hub',
                    rating: 4.5,
                    isVeg: true,
                    isFavourite: true
                },
                {
                    id: 3,
                    name: 'Masala Dosa',
                    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                    price: 120,
                    canteen: 'Engineering Block Café',
                    rating: 4.6,
                    isVeg: true,
                    isFavourite: true
                },
                {
                    id: 4,
                    name: 'Chicken Biryani',
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                    price: 200,
                    canteen: 'Health Hub',
                    rating: 4.7,
                    isVeg: false,
                    isFavourite: true
                },
                {
                    id: 5,
                    name: 'Chocolate Shake',
                    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                    price: 120,
                    canteen: 'Student Café Hub',
                    rating: 4.4,
                    isVeg: true,
                    isFavourite: true
                },
                {
                    id: 6,
                    name: 'Veg Thali',
                    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                    price: 150,
                    canteen: 'Central Dining Hall',
                    rating: 4.3,
                    isVeg: true,
                    isFavourite: true
                }
            ];
            
            setFavouriteFoods(defaultFavourites);
            // Save default favourites to localStorage
            localStorage.setItem('favouriteFoods', JSON.stringify(defaultFavourites));
        } else {
            setFavouriteFoods(storedFavourites);
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleRemoveClick = (id) => {
        setSelectedFoodId(id);
        setShowRemoveConfirm(true);
    };

    const confirmRemove = () => {
        if (selectedFoodId) {
            // Set the id of the food being removed for animation
            setRemovingFoodId(selectedFoodId);
            
            // Wait for animation to finish before removing from state
            setTimeout(() => {
                const updatedFavourites = favouriteFoods.filter(food => food.id !== selectedFoodId);
                setFavouriteFoods(updatedFavourites);
                setRemovingFoodId(null);
                
                // Save updated favourites to localStorage
                localStorage.setItem('favouriteFoods', JSON.stringify(updatedFavourites));
                
                // Close confirmation dialog
                setShowRemoveConfirm(false);
                setSelectedFoodId(null);
                
                // In a real app, this would also call an API to update the user's favourites
                console.log(`Removed food ${selectedFoodId} from favourites`);
            }, 300); // Match this with the animation duration in CSS
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
                        <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" /> {/* Add your logo here */}
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

                {/* Favourite Foods Content */}
                <div className="ff-content">
                    <div className="ff-header">
                        <h1>My Favourite Foods</h1>
                        <p className="ff-subtitle">Quickly order your favourite meals</p>
                    </div>

                    {favouriteFoods.length > 0 ? (
                        <div className="ff-foods-grid">
                            {favouriteFoods.map(food => (
                                <div 
                                    key={food.id} 
                                    className={`ff-food-card ${removingFoodId === food.id ? 'ff-removing' : ''}`}
                                >
                                    <div className="ff-food-image">
                                        <img src={food.image} alt={food.name} />
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
                    
                    {/* <div className="ff-footer">
                        <p>© 2025 Quick Crave. All rights reserved.</p>
                    </div> */}

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