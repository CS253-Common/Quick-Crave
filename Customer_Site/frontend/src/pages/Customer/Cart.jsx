import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/Customer/cart.css';
import '../../styles/Components/customer_sidemenu.css';

axios.defaults.withCredentials = true;

const Cart = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 minutes countdown
    const [cartItems, setCartItems] = useState({ dishes: [], dish_map: {} });
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('/images/user_default.png');
    const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'dineout'
    
    // Get user data from session storage
    const userData = {
        name: sessionStorage.getItem('name') || 'Guest',
        email: sessionStorage.getItem('email') || '',
        phone: sessionStorage.getItem('phone_number') || '', // Note the key matches what's in storage
        address: sessionStorage.getItem('address') || '',
        jwtToken: sessionStorage.getItem('JWT_TOKEN') || '', // You might want this too
        // Add other fields as needed
      };
    
    // Constants
    // const TAX_RATE = 0.10; // 10% tax
    const TAX_RATE = 0; // 10% tax
    // const DELIVERY_FEE = 30.0;
    const DELIVERY_FEE = 0;
    
    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        // Only start countdown when modal is shown
        if (showModal) {
          const timer = setInterval(() => {
            setCountdown(prevCountdown => {
              if (prevCountdown <= 0) {
                clearInterval(timer);
                return 0;
              }
              return prevCountdown - 1;
            });
          }, 1000); // Update every second
      
          // Clean up the interval when component unmounts or modal closes
          return () => clearInterval(timer);
        }
      }, [showModal]); // Run when showModal changes
    
    // Fetch cart items from backend
    const fetchCartItems = async () => {
        try {
            const response = await axios.post('http://localhost:4000/customer/customer-view-cart', {});
            setCartItems(response.data);
            // Set orderType based on is_delivery from the response
            setOrderType(response.data.is_delivery ? 'delivery' : 'dineout');
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItems({ dishes: [], dish_map: {} });
        }
    };

    //update the order type in the backend
    const updateOrderType = async (newOrderType) => {
        try {
            setIsUpdating(true);
            await axios.post('http://localhost:4000/customer/set-order-type', {
                is_delivery: newOrderType === 'delivery'
            });
            // Fetch updated cart to ensure sync
            await fetchCartItems();
            setIsUpdating(false);
        } catch (error) {
            console.error("Error updating order type:", error);
            setIsUpdating(false);
            showNotification('Failed to update order type');
        }
    };

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `cp-notification cp-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    };

    // Remove item from cart
    const removeItemFromCart = async (dishId) => {
        try {
            await axios.post('http://localhost:4000/customer/customer-remove-dish', {
                dish_id: dishId
            });

            // Fetch updated cart from backend
            const cartResponse = await axios.post('http://localhost:4000/customer/customer-view-cart');
            setCartItems(cartResponse.data);
            
            showNotification('Item removed from cart');
        } catch (error) {
            console.error("Error removing from cart:", error);
            showNotification('Failed to remove item');
        }
    };

    // Increase quantity in cart
    const increaseQuantity = async (dishId) => {
        try {
            await axios.post('http://localhost:4000/customer/customer-add-dish', {
                dish_id: dishId
            });

            // Fetch updated cart from backend
            const cartResponse = await axios.post('http://localhost:4000/customer/customer-view-cart');
            setCartItems(cartResponse.data);
        } catch (error) {
            console.error("Error increasing quantity:", error);
            showNotification('Failed to update quantity');
        }
    };

    // Decrease quantity in cart
    const decreaseQuantity = async (dishId) => {
        try {
            await axios.post('http://localhost:4000/customer/customer-remove-dish', {
                dish_id: dishId
            });

            // Fetch updated cart from backend
            const cartResponse = await axios.post('http://localhost:4000/customer/customer-view-cart');
            setCartItems(cartResponse.data);
        } catch (error) {
            console.error("Error decreasing quantity:", error);
            showNotification('Failed to update quantity');
        }
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
    // if (cartItems.dishes.length === 0) {
    //     showNotification('Your cart is empty!');
    //     return;
    // }

    try {
        setShowModal(true); // show loading modal
        // setCountdown(300);  // optional: countdown visual only
        setTimeout(() => {
            setShowModal(false);
            setCountdown(30);
        }, 5*60*1000);

        // const { customer_id } = userData;
        const response = await axios.post(
            'http://localhost:4000/customer/request-order'
        );

        console.log(response);
        

        if (response.status === 200) {
            // Proceed to place order

            console.log("starting");

            await axios.post('http://localhost:4000/customer/place-order', {
            });

            console.log("placed order successfully");

            setShowModal(false);
            showNotification('Order placed successfully!');
            // navigate('/order-confirmation');
        }
        else{
            showNotification(response.message , "error") ;
        }
    } catch (error) {
        setShowModal(false);

        if (error.response) {
            if (error.response.status === 401) {
                showNotification('Order rejected by canteen.', "error");
            } else if (error.response.status === 408) {
                showNotification('No response from canteen. Please try again later.', "error");
            } else {
                showNotification('Something went wrong. Please try again.', "error");
            }
        } else {
            showNotification('Server error. Please try again.');
        }
    }
};

    // Calculate subtotal, tax, and total
    const calculateTotals = () => {
        // Calculate subtotal by multiplying each dish's price by its quantity
        let subtotal = 0;
        if (cartItems.dishes && cartItems.dish_map) {
            subtotal = cartItems.dishes.reduce((sum, item) => {
                const price = parseFloat(item.price) || 0;
                const quantity = cartItems.dish_map[item.dish_id] || 1;
                return sum + (price * quantity);
            }, 0);
        }
        
        // Calculate tax and total
        const tax = subtotal * TAX_RATE;
        const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
        const total = subtotal + tax + deliveryFee - promoDiscount;
        
        return { subtotal, tax, deliveryFee, total };
    };
    
    // Calculate totals
    const { subtotal, tax, deliveryFee, total } = calculateTotals();
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <div className="cart-home-container">
            {/* Side Menu Overlay */}
            {showModal && (
                <div className="cart-modal-overlay">
                    <div className="cart-modal">
                        <h2>Waiting for Canteen to Accept...</h2>
                        <p>Please wait while the canteen confirms your order.</p>
                        <p>Time Remaining: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</p>
                    </div>
                </div>
            )}

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
                            <Link to="/customer-home"><FaHome /> Home </Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/customer-profile"><FaUser /> Profile </Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/customer-history"><FaHistory /> Order History </Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/favourite-foods"><FaHeart /> Favourites </Link>
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
                        <Link to="/customer-profile" className="user-avatar" id="userAvatar">
                            <img src={sessionStorage.getItem('img_url') || profileImage} alt="User" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
                        </Link>
                    </div>
                </div>

                {/* Cart Container */}
                <div className="crt-cart-container">
                    <h1 className="crt-cart-title">Your Cart</h1>
                    
                    {/* Order Type Selection */}
                    <div className="crt-order-type-selection">
                        <h2 className="crt-order-type-title">Order Type</h2>
                        <div className="crt-order-type-options">
                            <label className={`crt-order-type-option ${orderType === 'delivery' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="orderType" 
                                    value="delivery" 
                                    checked={orderType === 'delivery'}
                                    onChange={() => {
                                        setOrderType('delivery');
                                        updateOrderType('delivery');
                                    }}
                                    disabled={isUpdating}
                                />
                                <span>Delivery</span>
                            </label>
                            <label className={`crt-order-type-option ${orderType === 'dineout' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="orderType" 
                                    value="dineout" 
                                    checked={orderType === 'dineout'}
                                    onChange={() => {
                                        setOrderType('dineout');
                                        updateOrderType('dineout');
                                    }}
                                    disabled={isUpdating}
                                />
                                <span>Dine-out</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Cart Items */}
                    <div className="crt-cart-items" id="cartItemsContainer">
                        {cartItems.dishes?.length === 0 ? (
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
                            cartItems.dishes?.map((item, index) => (
                                <div className="crt-cart-item" key={index} data-id={item.dish_id}>
                                    <div className="crt-cart-item-image">
                                        <img src={item.img_url} alt={item.dish_name} />
                                    </div>
                                    <div className="crt-cart-item-details">
                                        <div>
                                            <h3 className="crt-cart-item-name">{item.dish_name}</h3>
                                            <p className="crt-cart-item-description">{item.canteen_name}</p>
                                        </div>
                                        <div className="crt-cart-item-price">₹{item.price}</div>
                                    </div>
                                    <div className="crt-cart-item-actions">
                                        <div className="crt-quantity-control">
                                            <button 
                                                className="crt-quantity-btn decrease-btn" 
                                                onClick={() => decreaseQuantity(item.dish_id)}
                                            >
                                                -
                                            </button>
                                            <span className="crt-quantity-value">
                                                {cartItems.dish_map?.[item.dish_id] || 1}
                                            </span>
                                            <button 
                                                className="crt-quantity-btn increase-btn" 
                                                onClick={() => increaseQuantity(item.dish_id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="crt-remove-item-btn" 
                                            onClick={() => removeItemFromCart(item.dish_id)}
                                        >
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
                            <span className="crt-summary-value" id="deliveryFee">
                                {orderType === 'delivery' ? `₹${DELIVERY_FEE.toFixed(2)}` : 'FREE'}
                            </span>
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
                                Request Order
                            </button>
                        </div>
                    </div>
                </div>

                {isUpdating && (
                    <div className="crt-updating-overlay">
                        <div className="crt-updating-spinner"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;