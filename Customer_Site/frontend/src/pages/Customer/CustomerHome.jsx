import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaCog, FaSignOutAlt, FaShoppingCart, FaUserCircle, FaCamera, FaEdit, FaLock, FaClipboardList, FaUtensils, FaHamburger, FaCalendarCheck } from 'react-icons/fa';
import '../../styles/Customer/customer_home.css'; // Ensure the CSS file is imported
import '../../styles/Components/customer_sidemenu.css';
import '../../styles/Canteen/canteen_manager_home.css';
import '../../styles/Canteen/canteen_statistics.css';
import '../../styles/Canteen/discount_management.css';
import '../../styles/Canteen/order_queue.css';
import '../../styles/Canteen/reservation_management.css';

axios.defaults.withCredentials = true;

const CustomerHome = ({setSelectedCanteen}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('images/imagesfile/user-avatar.jpg');
    const [topDishes, setTopDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    
    const handleSearchClick = () => {
        navigate('/food-canteen-listing'); // Replace with your desired route
    };

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('favorites');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Handle logout
    const handleLogout = () => {
        // Clear user session
        // sessionStorage.removeItem('current_user');
        navigate('/login');
    };

    const FetchTop5 = async () => {
        try {
            setIsLoading(true);
            console.log("Loading top dishes..."); 
            const response = await axios.post('http://localhost:4000/customer/customer-fetch-top5');
            if (response.data && response.data.success) {
                setTopDishes(response.data.data);
                console.log("Top dishes loaded:", response.data.data);
            }
        } catch (error) {
            console.error("Error fetching top dishes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCart = async() => {
        try {
            const cartItems = await axios.post('http://localhost:4000/customer/customer-view-cart'); 
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems.data));
            console.log("CART : ", cartItems.data);
    
            // Set total items as the length of dishes array
            const lengthhai = cartItems.data.dishes ? cartItems.data.dishes.length : 0;
            setTotalItems(lengthhai);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }

    useEffect(() => {
        FetchTop5();
    }, []);

    useEffect(()=>{
        fetchCart() ; 
    }, [])


    //update the order type in the backend
    const updateOrderType = async (newOrderType) => {
        try {
            setIsUpdating(true);
            await axios.post('http://localhost:4000/customer/set-order-type', {
                is_delivery: newOrderType === 'delivery'
            });
            setIsUpdating(false);
        } catch (error) {
            console.error("Error updating order type:", error);
            setIsUpdating(false);
        }
    }

    //ERROR OVER
    return (
        <div className="home-container home-page"> {/* Removed onLoad attribute */}
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
                            <h3 className="cs-menu-user-name">{sessionStorage.getItem('name')}</h3>
                            <p className="cs-menu-user-email">{sessionStorage.getItem('email')}</p>
                        </div>
                    </div>
                </div>
                <div className="cs-side-menu-content">
                    <ul className="cs-menu-items">
                        <li className="cs-menu-item active">
                            {/* <a href="/customer-home"><FaHome /> Home</a> */}
                            <Link to="/customer-home"><FaHome /> Home </Link>
                        </li>
                        <li className="cs-menu-item">
                            {/* <a href="/profile"><FaUser /> Profile</a> */}
                            <Link to="/customer-profile"><FaUser /> Profile </Link>
                        </li>
                        <li className="cs-menu-item">
                            {/* <a href="/order-history"><FaHistory /> Order History</a> */}
                            <Link to="/customer-history"><FaHistory /> Order History </Link>
                        </li>
                        <li className="cs-menu-item">
                            {/* <a href="/favorites"><FaHeart /> Favorites</a> */}
                            <Link to="/favourite-foods"><FaHeart /> Favourites </Link>
                        </li>
                        <li className="cs-menu-item">
                            {/* <a href="#" onClick={handleLogout}><FaSignOutAlt /> Logout</a> */}
                            <Link to="/login"><FaSignOutAlt /> Logout </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Navigation Bar */}
                <div className="top-nav">
                <button className="cs-menu-btn" onClick={toggleMenu}>
                        <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" /> {/* Add your logo here */}
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

                {/* Search Bar */}
                <div className="search-container" onClick={handleSearchClick}>
                    <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#777" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input type="text" className="search-bar" placeholder="Order something to eat !!" />
                </div>

                {/* Service Cards */}
                <div className="service-cards">
                    <Link to="/food-canteen-listing" className="service-card" onClick={() => updateOrderType('delivery')}>
                        <h3 className="service-title">Food Delivery</h3>
                        <p className="service-subtitle">From Canteens</p>
                        <div className="service-image">
                            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Food Delivery" onError={(e) => { e.target.src = 'https://via.placeholder.com/140x140?text=Food' }} />
                        </div>
                    </Link>

                    <Link to="/food-canteen-listing" className="service-card" onClick={() => updateOrderType('dineout')}>
                        <h3 className="service-title">Dineout</h3>
                        <p className="service-subtitle">Eat out and save more</p>
                        <div className="service-image">
                            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Dineout" onError={(e) => { e.target.src = 'https://via.placeholder.com/120x120?text=Dineout' }} />
                        </div>
                    </Link>

                    <Link to="/canteen-listing" className="service-card">
                        <h3 className="service-title">Reservations</h3>
                        <p className="service-subtitle">Book a table</p>
                        <div className="service-image">
                            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Reservations" onError={(e) => { e.target.src = 'https://via.placeholder.com/120x120?text=Table' }} />
                        </div>
                    </Link>
                </div>

                
                <Link to="/cart" className="cart-button">
                    <FaShoppingCart />
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </Link> 
                
                <h2 className="section-title">Recommended</h2>

                {/* Trending Items */}
                <div className="favourite-items">
                    {
                        topDishes.map((item, index) => (
                            <Link 
                            to="/canteen-details" 
                            key={item.canteen_name} 
                            className="favourite-item" 
                            onClick={async (e) => {
                              e.preventDefault(); // Prevent immediate navigation
                              
                              try {
                                // Fetch canteen details from backend
                                const response = await axios.post('http://localhost:4000/customer/customer-search-canteen/', {
                                    canteen_name : item.canteen_name
                                });
                                console.log("response :") ;
                                console.log(response) ; 
                                // if (!response.ok) {
                                //   throw new Error('Failed to fetch canteen details');
                                // }

                                // console.log("YAhan par se hona chahiye");
                                // console.log(response.data.data[0]);
                                // console.log("ARIHANT CHUTIYA") ; 
                                const canteenData = response.data.data[0];
                                canteenData.name = canteenData.canteen_name;
                                
                                console.log("debudding");
                                console.log(canteenData);
                                // Set the selected canteen with the fetched data
                                setSelectedCanteen(canteenData);
                                
                                // Now navigate to the canteen details page
                                navigate('/canteen-details');
                              } catch (error) {
                                console.error('BIDI Error fetching canteen details:', error);
                                // Handle error (e.g., show error message to user)
                              }
                            }}
                            >
                            <div className="favourite-image">
                                <img 
                                src={item.img_url} 
                                alt={item.dish_name} />
                                {/* Veg/Non-Veg Indicator - Left Side */}
                                    <div className="veg-indicator trending-tag">
                                    <img 
                                        // src={item.isVeg ? "/images/veg_ico.png" : "/images/non_veg_ico.png"} 
                                        src={item.is_veg ? "/images/veg_icon.png" : "/images/non_veg_icon.png"} 
                                        alt={item.is_veg ? "Vegetarian" : "Non-Vegetarian"}
                                        className="dietary-icon"
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            objectFit: 'contain',
                                            backgroundColor: 'white'
                                        }}
                                    />
                                </div>
                                {/* Rating Indicator - Right Side */}
                                <div className="rating-indicator trending-tag">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                                    </svg>
                                    {item.rating}
                                </div>    
                            
                            </div>
                            <div className="favourite-label">
                                {item.dish_name}
                                <br/>
                                {item.canteen_name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    );
};
export default CustomerHome;