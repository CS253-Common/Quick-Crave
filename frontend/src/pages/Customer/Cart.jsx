import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Customer/cart.css';
import '../../styles/Components/customer_sidemenu.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('/images/user_default.png');
    const [userData, setUserData] = useState({
        name: 'ARIHANT KUMAR',
        email: 'arikrrr@gmail.com',
        phone: '9711XXXXX',
        address: 'HALL 5, IITK - 208016'
    });
    
    // Constants
    const TAX_RATE = 0.10; // 10% tax
    const DELIVERY_FEE = 2.99;
    
    // Get user ID from session storage or default to anonymous user
    const userId = sessionStorage.getItem('userId') || 'anonymous';
    
    useEffect(() => {
        loadCartItems();
    }, []);
    
    // Load cart items from server or localStorage
    const loadCartItems = async () => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        try {
            console.log('Loading cart items for userId:', userId);
            
            let items = [];
            
            if (userId === 'anonymous') {
                // For anonymous users, get cart from localStorage
                items = JSON.parse(localStorage.getItem('cartItems')) || [];
                console.log('Anonymous user cart from localStorage:', items);
            } else {
                // For logged in users, get cart from API
                try {
                    const response = await fetch(`/api/cart/${userId}`);
                    console.log('Cart API response status:', response.status);
                    
                    if (response.ok) {
                        items = await response.json();
                        console.log('Successfully loaded user cart from server:', items);
                        
                        // If cart is empty, check localStorage as fallback
                        if (!items || items.length === 0) {
                            const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
                            console.log('Checking localStorage fallback:', localCart);
                            
                            if (localCart && localCart.length > 0) {
                                console.log('Using localStorage cart as fallback');
                                items = localCart;
                                
                                // Add userId to items if needed
                                items = items.map(item => ({
                                    ...item,
                                    userId: userId
                                }));
                                
                                // Save to server
                                await saveCartToServer(items);
                            }
                        }
                    } else {
                        console.error('Failed to load cart from server, status:', response.status);
                        // Fallback to localStorage
                        items = JSON.parse(localStorage.getItem('cartItems')) || [];
                        console.log('Using localStorage fallback after API error:', items);
                    }
                } catch (error) {
                    console.error('API error when loading cart:', error);
                    // Fallback to localStorage on API error
                    items = JSON.parse(localStorage.getItem('cartItems')) || [];
                    console.log('Using localStorage fallback after exception:', items);
                }
            }
            
            // If cart is still empty, add demo items for testing
            if (!items || items.length === 0) {
                console.log('Cart is empty, checking if we should add demo items');
                const useDemo = localStorage.getItem('useDemoCart') === 'true';
                
                if (useDemo) {
                    console.log('Adding demo items to cart');
                    items = addDemoItemsToCart();
                }
            }
            
            console.log('Final cart items to render:', items);
            
            // Ensure we have valid items
            items = items.filter(item => item && item.name);
            
            setCartItems(items);
            calculateTotals(items);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setTimeout(() => {
                setIsUpdating(false);
            }, 100);
        }
    };
    
    // Function to add demo items to cart for testing
    const addDemoItemsToCart = () => {
        const demoItems = [
            {
                name: "Chicken Biryani",
                price: "180",
                image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                userId: userId
            },
            {
                name: "Paneer Butter Masala",
                price: "220",
                image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                userId: userId
            },
            {
                name: "Veg Hakka Noodles",
                price: "150",
                image: "https://images.unsplash.com/photo-1585032226651-759b368d7271?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                userId: userId
            }
        ];
        
        // Save to appropriate storage
        if (userId === 'anonymous') {
            localStorage.setItem('cartItems', JSON.stringify(demoItems));
        } else {
            saveCartToServer(demoItems);
        }
        
        return demoItems;
    };
    
    // Save cart to server (batch API call)
    const saveCartToServer = async (items) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('No auth token found, cannot save cart to server');
                return;
            }
            
            const response = await fetch('/api/cart/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(items)
            });
            
            if (response.ok) {
                console.log('Cart successfully saved to server');
            } else {
                console.error('Failed to save cart to server, status:', response.status);
            }
        } catch (error) {
            console.error('Error saving cart to server:', error);
        }
    };
    
    // Extract price value from string
    const extractPrice = (priceString) => {
        if (!priceString) return 0;
        const priceMatch = priceString.match(/₹(\d+)/);
        return priceMatch ? parseInt(priceMatch[1]) : 0;
    };
    
    // Helper function to get image URL based on item name
    const getImageForItem = (name) => {
        const itemImagesMap = {
            'Pizza 1': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
            'Pizza 2': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
            'Pizza 3': 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e',
            'Pizza 4': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47',
            'Margherita Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
            'Chicken Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
            'Paneer Butter Masala': 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40',
            'Veg Hakka Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246',
            'Classic Chicken Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
            'Masala Dosa': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc'
        };
        
        return itemImagesMap[name] || 'https://via.placeholder.com/80';
    };
    
    // Helper function to get description based on item name
    const getDescriptionForItem = (name) => {
        const itemDescriptionsMap = {
            'Pizza 1': 'With cheese and olives',
            'Pizza 2': 'With pepperoni and mushrooms',
            'Pizza 3': 'With corn and capsicum',
            'Pizza 4': 'With chicken and onions',
            'Margherita Pizza': 'With cheese and basil',
            'Chicken Biryani': 'With raita and salan',
            'Paneer Butter Masala': 'With naan and rice',
            'Veg Hakka Noodles': 'With vegetables and soy sauce',
            'Classic Chicken Burger': 'With cheese and fries',
            'Masala Dosa': 'With sambar and chutney'
        };
        
        return itemDescriptionsMap[name] || 'Delicious food item';
    };
    
    // Decrease item quantity
    const decreaseItemQuantity = async (itemName) => {
        if (isUpdating) return;
        setIsUpdating(true);
        
        try {
            let updatedItems = [...cartItems];
            
            if (userId === 'anonymous') {
                // For anonymous users, update localStorage
                const itemIndex = updatedItems.findIndex(item => 
                    item && item.name && item.name.trim() === itemName.trim()
                );
                
                if (itemIndex !== -1) {
                    // Remove one instance
                    updatedItems.splice(itemIndex, 1);
                    setCartItems(updatedItems);
                    saveCartToLocalStorage(updatedItems);
                }
            } else {
                // For logged in users, use API
                const itemToRemove = updatedItems.find(item => 
                    item && item.name && item.name.trim() === itemName.trim()
                );
                
                if (itemToRemove && itemToRemove._id) {
                    const response = await fetch(`/api/cart/${itemToRemove._id}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        console.log('Removed item from cart');
                        loadCartItems();
                    } else {
                        console.error('Failed to remove item from cart');
                        showNotification('Failed to update cart. Please try again.');
                    }
                }
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            showNotification('Error updating cart. Please try again.');
        } finally {
            setTimeout(() => {
                setIsUpdating(false);
            }, 100);
        }
    };
    
    // Increase item quantity
    const increaseItemQuantity = async (itemName) => {
        if (isUpdating) return;
        setIsUpdating(true);
        
        try {
            // Find an existing item to get details
            const existingItem = cartItems.find(item => 
                item && item.name && item.name.trim() === itemName.trim()
            );
            
            if (existingItem) {
                if (userId === 'anonymous') {
                    // For anonymous users, add to localStorage
                    const updatedItems = [...cartItems, {...existingItem}];
                    setCartItems(updatedItems);
                    saveCartToLocalStorage(updatedItems);
                } else {
                    // For logged in users, add to API
                    const newItem = {
                        name: existingItem.name,
                        price: existingItem.price,
                        image: existingItem.image,
                        userId: userId
                    };
                    
                    const response = await fetch('/api/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newItem)
                    });
                    
                    if (response.ok) {
                        console.log('Added item to cart');
                        loadCartItems();
                    } else {
                        console.error('Failed to add item to cart');
                        showNotification('Failed to update cart. Please try again.');
                    }
                }
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
            showNotification('Error updating cart. Please try again.');
        } finally {
            setTimeout(() => {
                setIsUpdating(false);
            }, 100);
        }
    };
    
    // Remove item from cart
    const removeItem = async (itemName) => {
        if (isUpdating) return;
        setIsUpdating(true);
        
        try {
            if (userId === 'anonymous') {
                // For anonymous users, remove all instances from localStorage
                const updatedItems = cartItems.filter(item => 
                    !item || !item.name || item.name.trim() !== itemName.trim()
                );
                
                setCartItems(updatedItems);
                saveCartToLocalStorage(updatedItems);
            } else {
                // For logged in users, remove all matching items from API
                const itemsToRemove = cartItems.filter(item => 
                    item && item.name && item.name.trim() === itemName.trim()
                );
                
                // Create a function to perform sequential deletes with Promise.all
                const deleteRequests = itemsToRemove.map(item => 
                    fetch(`/api/cart/${item._id}`, { method: 'DELETE' })
                );
                
                await Promise.all(deleteRequests);
                console.log('Removed all items with name:', itemName);
                loadCartItems();
            }
        } catch (error) {
            console.error('Error removing item:', error);
            showNotification('Error updating cart. Please try again.');
        } finally {
            setTimeout(() => {
                setIsUpdating(false);
            }, 100);
        }
    };
    
    // Save cart to localStorage (for anonymous users)
    const saveCartToLocalStorage = (items) => {
        // Clean up invalid items
        const validItems = items.filter(item => item && item.name);
        
        console.log('Saving cart to localStorage:', validItems);
        
        // Save to localStorage
        if (validItems.length === 0) {
            // Clear completely if empty
            localStorage.removeItem('cartItems');
            console.log('Removed cartItems from localStorage (empty cart)');
        } else {
            localStorage.setItem('cartItems', JSON.stringify(validItems));
            console.log('Saved cart to localStorage with', validItems.length, 'items');
        }
    };
    
    // Calculate subtotal, tax, and total
    const calculateTotals = (items) => {
        // Group items by name
        const itemsByName = {};
        
        items.forEach(item => {
            if (!item || !item.name) return;
            
            const name = item.name.trim();
            if (!itemsByName[name]) {
                itemsByName[name] = {
                    price: extractPrice(item.price),
                    count: 1
                };
            } else {
                itemsByName[name].count++;
            }
        });
        
        // Calculate subtotal
        let subtotal = 0;
        Object.values(itemsByName).forEach(item => {
            subtotal += item.price * item.count;
        });
        
        // Calculate tax and total
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax + DELIVERY_FEE - promoDiscount;
        
        return { subtotal, tax, total };
    };
    
    // Apply promo code
    const applyPromoCode = () => {
        const code = promoCode.trim().toUpperCase();
        
        if (code === 'WELCOME10') {
            setPromoDiscount(10); // ₹10 off
            showNotification('Promo code applied successfully!');
        } else if (code === 'SAVE20') {
            setPromoDiscount(20); // ₹20 off
            showNotification('Promo code applied successfully!');
        } else {
            setPromoDiscount(0);
            showNotification('Invalid promo code. Please try again.');
        }
    };
    
    // Checkout button
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        if (userId === 'anonymous') {
            // For anonymous users, redirect to login first
            showNotification('Please log in to checkout');
            navigate('/login');
        } else {
            // For logged in users, proceed to checkout
            showNotification('Proceeding to checkout...');
            
            try {
                // In a real app, you would make an API call to create an order
                // For now, just clear the cart
                
                const response = await fetch(`/api/cart/user/${userId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showNotification('Order placed successfully!');
                    localStorage.removeItem('cartItems'); // Clear local storage too
                    
                    // Clear cart state
                    setCartItems([]);
                    
                    // In a real app, redirect to order confirmation page
                    navigate('/order-confirmation');
                } else {
                    showNotification('Failed to place order. Please try again.');
                }
            } catch (error) {
                console.error('Error during checkout:', error);
                showNotification('Error during checkout. Please try again.');
            }
        }
    };
    
    // Enable demo cart
    const enableDemoCart = () => {
        localStorage.setItem('useDemoCart', 'true');
        const demoItems = addDemoItemsToCart();
        setCartItems(demoItems);
        showNotification('Demo items added to cart!');
    };
    
    // Utility function to show notification
    const showNotification = (message) => {
        // In a real app, you would use a proper notification system
        alert(message);
    };
    
    // Calculate totals
    const { subtotal, tax, total } = calculateTotals(cartItems);
    
    // Count items by name for display
    const itemsByName = {};
    cartItems.forEach(item => {
        if (!item || !item.name) return;
        
        const name = item.name.trim();
        if (!itemsByName[name]) {
            itemsByName[name] = {
                ...item,
                count: 1
            };
        } else {
            itemsByName[name].count++;
        }
    });
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <div className="cart-home-container">
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
                            <Link to="/customer-order-history"><FaHistory /> Order History </Link>
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

                {/* Cart Container */}
                <div className="crt-cart-container">
                    <h1 className="crt-cart-title">Your Cart</h1>
                    
                    {/* Cart Items */}
                    <div className="crt-cart-items" id="cartItemsContainer">
                        {Object.keys(itemsByName).length === 0 ? (
                            <div className="crt-empty-cart">
                                <div className="crt-empty-cart-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <p className="crt-empty-cart-message">Your cart is empty</p>
                                <Link to="/customer-home" className="crt-continue-shopping-btn">
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            Object.values(itemsByName).map((item, index) => (
                                <div className="crt-cart-item" key={index} data-name={item.name} data-price={extractPrice(item.price)}>
                                    <div className="crt-cart-item-image">
                                        <img src={item.image || getImageForItem(item.name)} alt={item.name} />
                                    </div>
                                    <div className="crt-cart-item-details">
                                        <div>
                                            <h3 className="crt-cart-item-name">{item.name}</h3>
                                            <p className="crt-cart-item-description">{getDescriptionForItem(item.name)}</p>
                                        </div>
                                        <div className="crt-cart-item-price">₹{extractPrice(item.price)}</div>
                                    </div>
                                    <div className="crt-cart-item-actions">
                                        <div className="crt-quantity-control">
                                            <button className="crt-quantity-btn decrease-btn" onClick={() => decreaseItemQuantity(item.name)}>-</button>
                                            <span className="crt-quantity-value">{item.count}</span>
                                            <button className="crt-quantity-btn increase-btn" onClick={() => increaseItemQuantity(item.name)}>+</button>
                                        </div>
                                        <button className="crt-remove-item-btn" onClick={() => removeItem(item.name)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="crt-order-summary">
                        <h2 className="crt-summary-title">Order Summary</h2>
                        
                        <div className="crt-summary-row">
                            <span className="crt-summary-label">Subtotal</span>
                            <span className="crt-summary-value" id="subtotal">₹{subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="crt-summary-row">
                            <span className="crt-summary-label">Delivery Fee</span>
                            <span className="crt-summary-value" id="deliveryFee">₹{DELIVERY_FEE.toFixed(2)}</span>
                        </div>
                        
                        <div className="crt-summary-row">
                            <span className="crt-summary-label">Tax</span>
                            <span className="crt-summary-value" id="tax">₹{tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="crt-summary-row crt-total-row">
                            <span className="crt-summary-label">Total</span>
                            <span className="crt-summary-value crt-total-value" id="total">₹{total.toFixed(2)}</span>
                        </div>
                        
                        <div className="crt-promo-code-container">
                            <input 
                                type="text" 
                                className="crt-promo-code-input" 
                                placeholder="Promo Code" 
                                id="promoCodeInput"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button className="crt-apply-btn" id="applyPromoBtn" onClick={applyPromoCode}>Apply</button>
                        </div>
                        
                        <div className="order-summary-section">
                            <div className="crt-payment-options">
                                <h3>Payment Options</h3>
                                <div className="crt-payment-option">
                                    <input 
                                        type="radio" 
                                        id="wallet" 
                                        name="payment" 
                                        value="wallet" 
                                        checked={paymentMethod === 'wallet'}
                                        onChange={() => setPaymentMethod('wallet')}
                                    />
                                    <label htmlFor="wallet">Wallet</label>
                                </div>
                                <div className="crt-payment-option">
                                    <input 
                                        type="radio" 
                                        id="cash" 
                                        name="payment" 
                                        value="cash" 
                                        checked={paymentMethod === 'cash'}
                                        onChange={() => setPaymentMethod('cash')}
                                    />
                                    <label htmlFor="cash">Cash on Delivery</label>
                                </div>
                            </div>
                            <button id="checkoutBtn" className="crt-checkout-btn" onClick={handleCheckout}>
                                <i className="fas fa-shopping-bag"></i>
                                Proceed to Checkout
                            </button>
                            
                            {/* Debug Button (Only visible in development) */}
                            <div className="debug-section" style={{marginTop: '20px', padding: '10px', borderTop: '1px dashed #ccc'}}>
                                <button 
                                    id="enableDemoCartBtn" 
                                    className="btn" 
                                    style={{
                                        backgroundColor: '#6c757d', 
                                        color: 'white', 
                                        padding: '8px 15px', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer', 
                                        fontSize: '14px'
                                    }}
                                    onClick={enableDemoCart}
                                >
                                    Enable Demo Cart Items
                                </button>
                                <p style={{fontSize: '12px', color: '#6c757d', marginTop: '5px'}}>
                                    This button is for testing purposes only. It will add demo items to your cart.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;