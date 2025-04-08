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
   const [profileImage, setProfileImage] =
useState('/images/user_default.png');
   const [userData, setUserData] = useState({
     name: 'ARIHANT KUMAR',
     email: 'arikrrr@gmail.com',
     phone: '9711XXXXX',
     address: 'HALL 5, IITK - 208016'
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // Get user ID from session storage or default to anonymous user
   const userId = sessionStorage.getItem('userId') || 'anonymous';

   // State for food items and categories
   const [foodItems, setFoodItems] = useState([]);
   const [categories, setCategories] = useState([]);
   // Effect to load canteen data and food items
   useEffect(() => {
     if (!canteen) {
       // If no canteen is passed, try to get from session storage
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
       // If canteen is passed as prop, fetch its food items
       fetchFoodItems(canteen.id);
     }
   }, [canteen, navigate]);
   // Function to fetch food items for the canteen
   const fetchFoodItems = async (canteenId) => {
     setLoading(true);
     try {
       // Simulated API call - replace with actual API endpoint
       // const response = await
axios.get(`http://localhost:5000/api/canteens/${canteenId}/food-items`);
       // setFoodItems(response.data);

       // Simulated food items data based on canteen
       const simulatedFoodItems = [
         { id: 1, name: "Margherita Pizza", price: "₹300", image:
"https://images.unsplash.com/photo-1552539618-7eec9b753d95?ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80",
rating: 4.2, isVeg: true, category: "Pizza" },
         { id: 2, name: "Pepperoni Pizza", price: "₹350", image:
"https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1025&q=80",
rating: 4.4, isVeg: false, category: "Pizza" },
         { id: 3, name: "Butter Chicken", price: "₹320", image:
"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
rating: 4.6, isVeg: false, category: "Main Course" },
         { id: 4, name: "Paneer Tikka", price: "₹280", image:
"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
rating: 4.4, isVeg: true, category: "Main Course" },
         { id: 5, name: "Masala Dosa", price: "₹150", image:
"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
rating: 4.5, isVeg: true, category: "South Indian" },
         { id: 6, name: "Chicken Biryani", price: "₹220", image:
"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
rating: 4.7, isVeg: false, category: "Main Course" },
         { id: 7, name: "Samosa", price: "₹40", image:
"https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
rating: 4.1, isVeg: true, category: "Snacks" },
         { id: 8, name: "Masala Chai", price: "₹30", image:
"https://images.unsplash.com/photo-1571006281613-f7677a4eb241?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
rating: 4.2, isVeg: true, category: "Beverages" }
       ];

       setFoodItems(simulatedFoodItems);

       // Extract unique categories
       const uniqueCategories = [...new Set(simulatedFoodItems.map(item =>
item.category))];
       setCategories(['all', ...uniqueCategories]);

       setLoading(false);
     } catch (error) {
       console.error('Error fetching food items:', error);
       setError('Failed to load food items');
       setLoading(false);
     }
   };
   // Load cart from local storage
   const loadCartFromServer = async () => {
     if (isUpdating) return;

     try {
       setIsUpdating(true);

       let loadedCartItems = [];

       if (userId === 'anonymous') {
         // For anonymous users, get cart from localStorage
         const localCart = localStorage.getItem('cartItems');
         loadedCartItems = localCart ? JSON.parse(localCart) : [];
       } else {
         // For logged in users, get cart from API (simulated here)
         try {
           // Simulating API response
           loadedCartItems =
JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
         } catch (error) {
           console.error('Failed to load cart from server');
           loadedCartItems = [];
         }
       }

       setCartItems(loadedCartItems);
     } catch (error) {
       console.error('Error loading cart from server:', error);
     } finally {
       setIsUpdating(false);
     }
   };
   // Load cart when component mounts
   useEffect(() => {
     loadCartFromServer();
   }, []);
   // Check for item to add to cart from session storage
   useEffect(() => {
     const addToCartItem = sessionStorage.getItem('add_to_cart_item');

     if (addToCartItem) {
       try {
         const itemToAdd = JSON.parse(addToCartItem);
         // Add item to cart
         addItemToCart(itemToAdd);
         // Clear from session storage to prevent adding again on refresh
         sessionStorage.removeItem('add_to_cart_item');
       } catch (error) {
         console.error('Error adding recommended item to cart:', error);
       }
     }
   }, []);
   // Save cart to local storage
   const saveCartToLocalStorage = (items) => {
     // Clean invalid items
     const validItems = items.filter(item => item && item.name);

     if (userId === 'anonymous') {
       localStorage.setItem('cartItems', JSON.stringify(validItems));
     } else {
       localStorage.setItem(`cart_${userId}`, JSON.stringify(validItems));
     }
   };
   // Count items in cart by name
   const countItemsInCart = () => {
     const counts = {};

     cartItems.forEach(item => {
       if (!item || !item.name) return;

       const name = item.name.trim();
       counts[name] = (counts[name] || 0) + 1;
     });

     return counts;
   };
   // Extract price from text
   const extractPrice = (priceText) => {
     const priceMatch = priceText.match(/₹(\d+)/);
     return priceMatch ? parseInt(priceMatch[1]) : 0;
   };
   // Add item to cart
   const addItemToCart = async (foodItem) => {
     if (isUpdating) return;

     try {
       setIsUpdating(true);

       // Create new item
       const newItem = {
         name: foodItem.name,
         price: foodItem.price || `₹150`,
         image: foodItem.image
       };

       if (userId === 'anonymous') {
         // For anonymous users, add to localStorage
         const updatedCart = [...cartItems, newItem];
         setCartItems(updatedCart);
         saveCartToLocalStorage(updatedCart);
         displayNotification(`${foodItem.name} added to cart!`);
       } else {
         // For logged in users, add to server (simulated)
         try {
           // Simulating API response
           const updatedCart = [...cartItems, newItem];
           setCartItems(updatedCart);
           saveCartToLocalStorage(updatedCart);
           displayNotification(`${foodItem.name} added to cart!`);
         } catch (error) {
           console.error('Failed to add item to cart:', error);
           displayNotification('Failed to add item to cart. Please try again.');

           // Fallback to local storage
           const updatedCart = [...cartItems, newItem];
           setCartItems(updatedCart);
           saveCartToLocalStorage(updatedCart);
         }
       }
     } catch (error) {
       console.error('Unexpected error adding item to cart:', error);
       displayNotification('An unexpected error occurred. Please try again.');
     } finally {
       setIsUpdating(false);
     }
   };
   // Remove item from cart
   const removeItemFromCart = async (foodName) => {
     if (isUpdating) return;

     try {
       setIsUpdating(true);

       if (userId === 'anonymous') {
         // For anonymous users, update localStorage
         const itemIndex = cartItems.findIndex(item =>
           item && item.name && item.name.trim() === foodName.trim()
         );

         if (itemIndex !== -1) {
           const updatedCart = [...cartItems];
           updatedCart.splice(itemIndex, 1);
           setCartItems(updatedCart);
           saveCartToLocalStorage(updatedCart);
         }
       } else {
         // For logged in users, use API (simulated)
         try {
           // Find an item with this name
           const itemToRemove = cartItems.find(item =>
             item && item.name && item.name.trim() === foodName.trim()
           );

           if (itemToRemove) {
             // Simulating API response
             const updatedCart = cartItems.filter((item, index) => {
               if (index === cartItems.findIndex(i => i.name.trim() ===
foodName.trim())) {
                 return false;
               }
               return true;
             });
             setCartItems(updatedCart);
             saveCartToLocalStorage(updatedCart);
           }
         } catch (error) {
           console.error('Failed to remove item from cart');
           displayNotification('Failed to update cart. Please try again.');
         }
       }
     } catch (error) {
       console.error('Error removing item from cart:', error);
       displayNotification('Error updating cart. Please try again.');
     } finally {
       setIsUpdating(false);
     }
   };
   // Handle cart button click
   const handleCartClick = (e) => {
     if (cartItems.length === 0) {
       e.preventDefault();
       displayNotification('Your cart is empty!');
     } else {
       navigate('/cart');
     }
   };
   // Filter food items based on search term and active category
   const filteredFoodItems = foodItems.filter(item =>
     item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
     (activeCategory === 'all' || item.category === activeCategory)
   );
   // Get count of each item in cart
   const itemCounts = countItemsInCart();

   // Debug functions
   const syncCart = () => {
     saveCartToLocalStorage(cartItems);
     displayNotification('Cart synchronized!');
   };
   const clearCart = () => {
     setCartItems([]);
     saveCartToLocalStorage([]);
     displayNotification('Cart cleared!');
   };
   // Show notification
   const displayNotification = (message) => {
     setNotificationMessage(message);
     setShowNotification(true);
     setTimeout(() => {
       setShowNotification(false);
     }, 2000);
   };
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
           <button className="cs-close-menu-btn" onClick={() =>
setIsMenuOpen(false)}>
             <FaTimes />
           </button>
           <div className="cs-menu-user-info">
             <div className="cs-menu-user-avatar">
               <img src={profileImage} alt="User Avatar" onError={(e) => {
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
               <Link to="/customer-history"><FaHistory /> Order History
</Link>
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
           <button className="cs-menu-btn" onClick={() =>
setIsMenuOpen(true)}>
             <img src="/images/side_menu.png" alt="Menu Logo"
className="menu-logo" />
           </button>
           <div className="logo-container">
             <img src="/images/logo.png" alt="Quick Crave Logo"
className="logo-image" />
             <h1 className="logo-text">
               <span className="red-text">Quick</span> <span
className="yellow-text">Crave</span>
             </h1>
           </div>
           <div className="user-profile">
             <Link to="/customer-profile" className="user-avatar"
id="userAvatar">
               <img src={profileImage} alt="User" onError={(e) => {
e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
             </Link>
           </div>
         </div>
         {/* Canteen Name Title */}
         <div className="canteen-title">
           <h2>{canteen ? canteen.name : 'Loading...'}</h2>
           {canteen && (
             <div className="canteen-info">
               <div className="rating">
                 <FaStar /> {canteen.rating}
               </div>
               <div className="location">{canteen.location}</div>
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
                 className={`category-pill ${activeCategory === category ?
'active' : ''}`}
                 onClick={() => setActiveCategory(category)}
               >
                 {category.charAt(0).toUpperCase() + category.slice(1)}
               </button>
             ))}
           </div>
         </div>
         {/* Food Items Grid */}
         {!loading && !error && (
           <div className="food-grid">
             {filteredFoodItems.map(item => {
               const count = cartItems.filter(cartItem => cartItem.name ===
item.name).length;

               return (
                 <div className="food-card" key={item.id}>
                   <div className="food-image">
                     <img src={item.image} alt={item.name} />
                     <div className={item.isVeg ? 'veg-indicator' :
'non-veg-indicator'} />
                   </div>
                   <div className="food-details">
                     <div className="food-name">{item.name}</div>
                     <div className="food-price">{item.price}</div>
                   </div>
                   <div className="card-actions">
                     <div className="rating-badge">
                       {item.rating} <FaStar />
                     </div>
                     {count > 0 ? (
                       <div className="quantity-selector">
                         <button className="quantity-btn" onClick={() =>
removeItemFromCart(item.name)}>
                           <FaMinus />
                         </button>
                         <span className="quantity-value">{count}</span>
                         <button className="quantity-btn" onClick={() =>
addItemToCart(item)}>
                           <FaPlus />
                         </button>
                       </div>
                     ) : (
                       <button className="add-button" onClick={() =>
addItemToCart(item)}>
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
           {cartItems.length > 0 && (
             <span className="cart-badge">{cartItems.length}</span>
           )}
         </Link>
         {/* Notification */}
         {showNotification && (
           <div className="notification show">
             {notificationMessage}
           </div>
         )}
         {/* Debugging tool for testing cart functionality */}
         {debugMode && (
           <div className="cart-debug-panel" id="cartDebugPanel">
             <p><strong>Cart Debug Panel</strong></p>
             <button
               id="syncCartBtn"
               onClick={syncCart}
             >
               Sync Cart
             </button>
             <button
               id="clearCartBtn"
               onClick={clearCart}
             >
               Clear Cart
             </button>
             <div id="cartItemsCount">Items: {cartItems.length}</div>
           </div>
         )}
       </div>
     </div>
     </div>
   );
};
export default CanteenDetails;