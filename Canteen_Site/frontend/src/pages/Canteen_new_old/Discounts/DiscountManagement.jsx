import React, { useState, useEffect, useRef } from 'react';
import { FaTrash, FaPercent, FaTicketAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../../styles/Canteen/Discounts/discount_management.css';
import canteenService from '../../../services/canteenService';

const DiscountManagement = () => {
    // Menu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // User data state
    const [userData, setUserData] = useState({
        name: 'Canteen Manager',
        email: 'manager@quickcrave.com'
    });
    
    // State variables for form inputs
    const [menuItems, setMenuItems] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    
    // Coupon form states
    const [couponCode, setCouponCode] = useState('');
    const [couponValue, setCouponValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [couponValidUntil, setCouponValidUntil] = useState('');
    
    // Active items states
    const [activeDiscounts, setActiveDiscounts] = useState([]);
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Stats state
    const [stats, setStats] = useState({
        activeDiscounts: 0,
        activeCoupons: 0
    });
    
    // Menu items selection states
    const [availableMenuItems, setAvailableMenuItems] = useState([]);
    const [filteredMenuItems, setFilteredMenuItems] = useState([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState([]);
    const [menuItemFilter, setMenuItemFilter] = useState('all');
    const [menuItemSearchQuery, setMenuItemSearchQuery] = useState('');
    const [showMenuItemDropdown, setShowMenuItemDropdown] = useState(false);
    
    // Current canteen ID (would typically come from auth context or props)
    const canteenId = 1; // Replace with actual canteen ID from context
    
    // Load user data from session storage
    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
        if (userInfo && Object.keys(userInfo).length > 0) {
            setUserData({
                name: userInfo.name || 'Canteen Manager',
                email: userInfo.email || 'manager@quickcrave.com'
            });
        }
    }, []);
    
    // Toggle menu function
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // Function to fetch data (moved to a separate function to be reusable)
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch active discounts
            const discounts = await canteenService.getActiveDiscounts();
            console.log('Raw discounts data:', discounts);
            // console.log('Discount data structure:', discounts.length > 0 ? Object.keys(discounts[0]) : 'No discounts');
            setActiveDiscounts(discounts);
            
            // Fetch active coupons
            const coupons = await canteenService.getActiveCoupons(canteenId);
            console.log('Raw coupons data:', coupons);
            setActiveCoupons(coupons);
            
            // Update stats
            setStats({
                activeDiscounts: discounts.length,
                activeCoupons: coupons.length
            });
            
            setError(null);
        } catch (err) {
            console.error('Error details:', err);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch active discounts and coupons
    useEffect(() => {
        fetchData();
    }, []);
    
    // Fetch menu items for the current canteen
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const items = await canteenService.getMenuItems(canteenId);
                setAvailableMenuItems(items);
                setFilteredMenuItems(items);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };
        
        fetchMenuItems();
    }, [canteenId]);
    
    // Filter menu items based on search query and type filter
    useEffect(() => {
        if (availableMenuItems.length > 0) {
            let filtered = [...availableMenuItems];
            
            // Apply type filter
            if (menuItemFilter !== 'all') {
                filtered = filtered.filter(item => item.type === menuItemFilter);
            }
            
            // Apply search query
            if (menuItemSearchQuery) {
                const query = menuItemSearchQuery.toLowerCase();
                filtered = filtered.filter(item => 
                    item.name.toLowerCase().includes(query) || 
                    item.category.toLowerCase().includes(query)
                );
            }
            
            setFilteredMenuItems(filtered);
        }
    }, [availableMenuItems, menuItemFilter, menuItemSearchQuery]);
    
    // Handle menu item selection
    const handleMenuItemSelect = (item) => {
        // Check if item is already selected
        const isSelected = selectedMenuItems.some(selected => selected.id === item.id);
        
        if (isSelected) {
            // Remove item if already selected
            setSelectedMenuItems(prev => prev.filter(selected => selected.id !== item.id));
        } else {
            // Add item if not selected
            setSelectedMenuItems(prev => [...prev, item]);
        }
    };
    
    // Close dropdown when clicking outside
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenuItemDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Format date to readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Handler for deleting a discount
    const handleDeleteDiscount = async (discountId) => {
        if (window.confirm('Are you sure you want to delete this discount?')) {
            try {
                setLoading(true);
                const result = await canteenService.deleteDiscount(discountId);
                
                if (result.success) {
                    // Update the state to remove the deleted discount
                    setActiveDiscounts(prevDiscounts => 
                        prevDiscounts.filter(discount => discount.dish_id !== discountId)
                    );
                    
                    // Update stats
                    setStats(prevStats => ({
                        ...prevStats,
                        activeDiscounts: prevStats.activeDiscounts - 1
                    }));
                    
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error deleting discount:', error);
                alert(error.message || 'Failed to delete discount. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };
    
    // Handler for deleting a coupon
    const handleDeleteCoupon = async (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                setLoading(true);
                const result = await canteenService.deleteCoupon(couponId);
                
                if (result.success) {
                    // Update the state to remove the deleted coupon
                    setActiveCoupons(prevCoupons => 
                        prevCoupons.filter(coupon => coupon.id !== couponId)
                    );
                    
                    // Update stats
                    setStats(prevStats => ({
                        ...prevStats,
                        activeCoupons: prevStats.activeCoupons - 1
                    }));
                    
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error deleting coupon:', error);
                alert(error.message || 'Failed to delete coupon. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };
    
    // Handler for creating discount
    const handleCreateDiscount = async (e) => {
        e.preventDefault();
        
        if (!selectedMenuItems.length) {
            alert('Please select at least one menu item');
            return;
        }

        const discountAmount = parseFloat(discountValue);
        if (!discountValue || isNaN(discountAmount) || discountAmount <= 0) {
            alert('Please enter a valid discount amount');
            return;
        }

        try {
            setLoading(true);
            const discountData = {
                discount_amount: discountAmount,
                menu_items: selectedMenuItems.map(item => item.dish_id)
            };

            const result = await canteenService.createDiscount(discountData);
            
            if (result.success) {
                alert(result.message);
                // Reset form
                setDiscountValue('');
                setSelectedMenuItems([]);
                // Refresh the discounts list
                fetchData();
            }
        } catch (error) {
            alert(error.message || 'Failed to create discount');
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for creating coupon
    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        
        // Validate form inputs
        if (!couponCode || !couponValue || !minOrderValue || !usageLimit || !couponValidUntil) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate coupon code length
        if (couponCode.length > 12) {
            alert('Coupon code must be 12 characters or less');
            return;
        }

        // Validate usage limit is an integer
        const usageLimitInt = parseInt(usageLimit);
        if (!Number.isInteger(usageLimitInt) || usageLimitInt <= 0) {
            alert('Usage limit must be a positive integer');
            return;
        }

        // Validate minimum order value is an integer
        const minOrderInt = parseInt(minOrderValue);
        if (!Number.isInteger(minOrderInt) || minOrderInt <= 0) {
            alert('Minimum order value must be a positive integer');
            return;
        }

        // Validate coupon value is a positive number
        const couponAmount = parseFloat(couponValue);
        if (isNaN(couponAmount) || couponAmount <= 0) {
            alert('Coupon value must be a positive number');
            return;
        }
        
        try {
            setLoading(true);
            // Prepare coupon data
            const couponData = {
                code: couponCode.toUpperCase(),
                canteen_id: canteenId,
                value: couponAmount,
                min_order_value: minOrderInt,
                usage_limit: usageLimitInt,
                valid_until: couponValidUntil
            };
            
            // Send data to backend
            const result = await canteenService.createCoupon(couponData);
            
            if (result.success) {
                alert(result.message);
                
                // Reset form fields
                setCouponCode('');
                setCouponValue('');
                setMinOrderValue('');
                setUsageLimit('');
                setCouponValidUntil('');
                
                // Refresh the coupons list
                fetchData();
            }
        } catch (error) {
            alert(error.message || 'Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for generating random coupon code
    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCouponCode(code);
    };

    return (
        <div className="discount-management-container">
            {/* Side Menu Overlay */}
            <div 
                className={`side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
            ></div>

            {/* Side Menu */}
            <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="side-menu-header">
                    <button className="close-menu-btn" onClick={toggleMenu}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="menu-user-info">
                        <Link to="/canteen-manager-profile" className="menu-user-avatar-link">
                            <div className="menu-user-avatar">
                                <img src="/images/business_avatar.png" alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                        <div className="menu-user-details">
                            <h3 className="menu-user-name">{userData.name}</h3>
                            <p className="menu-user-email">{userData.email}</p>
                        </div>
                    </div>
                </div>
                <div className="side-menu-content">
                    <ul className="menu-items">
                        <li className="menu-item">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-menu-management"><i className="fas fa-utensils"></i> Menu Management</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-orders"><i className="fas fa-clipboard-list"></i> Order Queue</Link>
                        </li>
                        <li className="menu-item active">
                            <Link to="/manage-discounts"><i className="fas fa-tags"></i> Discounts</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-reservations"><i className="fas fa-calendar-alt"></i> Reservations</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/canteen-statistics"><i className="fas fa-chart-line"></i> Statistics</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/login"><i className="fas fa-sign-out-alt"></i> Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* Top Navigation Bar */}
            <div className="top-nav">
                <button className="menu-btn" onClick={toggleMenu}>
                    <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                </button>
                <div className="logo-container">
                    <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                    <h1 className="logo-text">
                        <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                    </h1>
                </div>
                <div className="user-profile">
                    <Link to="/canteen-manager-profile" className="user-avatar-link">
                        <div className="user-avatar">
                            <img src="/images/business_avatar.png" alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Page Title */}
            <div className="page-title">
                <h2>Discount & Coupon Management</h2>
                <p className="subtitle">Create and manage discounts and coupons for your menu items</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon discount-icon">
                        <FaPercent style={{ fontSize: '36px' }} />
                    </div>
                    <div className="stat-info">
                        <h3>Active Discounts</h3>
                        <span className="stat-value">{stats.activeDiscounts}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon coupon-icon">
                        <FaTicketAlt style={{ fontSize: '36px' }} />
                    </div>
                    <div className="stat-info">
                        <h3>Active Coupons</h3>
                        <span className="stat-value">{stats.activeCoupons}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="discount-content">
                {/* Create New Discount Section */}
                <div className="form-section">
                    <h3>Create New Discount</h3>
                    <form onSubmit={handleCreateDiscount}>
                        <div className="form-group">
                            <label>Select Items</label>
                            <div className="menu-select-container" ref={dropdownRef}>
                                <div 
                                    className="menu-select-input"
                                    onClick={() => setShowMenuItemDropdown(!showMenuItemDropdown)}
                                >
                                    {selectedMenuItems.length > 0 ? (
                                        <div className="selected-items">
                                            {selectedMenuItems.map(item => (
                                                <span key={item.id} className="selected-item">
                                                    {item.name}
                                                    <button 
                                                        type="button"
                                                        className="remove-item"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuItemSelect(item);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="placeholder">Select menu items</span>
                                    )}
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                
                                {showMenuItemDropdown && (
                                    <div className="menu-items-dropdown">
                                        <div className="dropdown-header">
                                            <input
                                                type="text"
                                                placeholder="Search items..."
                                                value={menuItemSearchQuery}
                                                onChange={(e) => setMenuItemSearchQuery(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="filter-options">
                                                <button
                                                    type="button"
                                                    className={`filter-btn ${menuItemFilter === 'all' ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuItemFilter('all');
                                                    }}
                                                >
                                                    All
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`filter-btn ${menuItemFilter === 'veg' ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuItemFilter('veg');
                                                    }}
                                                >
                                                    Veg
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`filter-btn ${menuItemFilter === 'non-veg' ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuItemFilter('non-veg');
                                                    }}
                                                >
                                                    Non-Veg
                                                </button>
                                            </div>
                                        </div>
                                        <div className="menu-items-list">
                                            {filteredMenuItems.length > 0 ? (
                                                filteredMenuItems.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className={`menu-item ${selectedMenuItems.some(selected => selected.id === item.id) ? 'selected' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuItemSelect(item);
                                                        }}
                                                    >
                                                        <div className="item-details">
                                                            <span className="item-name">{item.name}</span>
                                                            <span className="item-price">₹{item.price}</span>
                                                        </div>
                                                        <div className="item-type">
                                                            <span className={`type-indicator ${item.type}`}></span>
                                                            {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-items">No items found</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Discount Type</label>
                            <div className="fixed-discount-type">
                                <span>Percentage</span>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Discount Value</label>
                            <input 
                                type="text" 
                                placeholder="Enter percentage" 
                                value={discountValue} 
                                onChange={(e) => setDiscountValue(e.target.value)} 
                            />
                        </div>
                        
                        <button type="submit" className="btn-create-discount">Create Discount</button>
                    </form>
                </div>

                {/* Create New Coupon Section */}
                <div className="form-section">
                    <h3>Create New Coupon</h3>
                    <form onSubmit={handleCreateCoupon}>
                        <div className="form-group">
                            <label>Coupon Code</label>
                            <div className="code-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Enter code" 
                                    value={couponCode} 
                                    onChange={(e) => setCouponCode(e.target.value)} 
                                />
                                <button 
                                    type="button" 
                                    className="btn-generate" 
                                    onClick={generateRandomCode}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Discount Value (₹)</label>
                            <input 
                                type="text" 
                                placeholder="Enter amount" 
                                value={couponValue} 
                                onChange={(e) => setCouponValue(e.target.value)} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Minimum Order Value</label>
                            <input 
                                type="text" 
                                placeholder="Enter minimum value" 
                                value={minOrderValue} 
                                onChange={(e) => setMinOrderValue(e.target.value)} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Usage Limit</label>
                            <input 
                                type="text" 
                                placeholder="Enter limit" 
                                value={usageLimit} 
                                onChange={(e) => setUsageLimit(e.target.value)} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Valid until</label>
                            <input 
                                type="date" 
                                value={couponValidUntil} 
                                onChange={(e) => setCouponValidUntil(e.target.value)} 
                            />
                        </div>
                        
                        <button type="submit" className="btn-create-coupon">Create Coupon</button>
                    </form>
                </div>
            </div>

            {/* Active Discounts and Coupons Sections */}
            <div className="active-items-container">
                {/* Active Discounts */}
                <div className="active-section">
                    <h3>Active Discounts</h3>
                    {loading ? (
                        <div className="loading-message">Loading discounts...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : activeDiscounts.length === 0 ? (
                        <div className="empty-message">No active discounts found.</div>
                    ) : (
                        <div className="active-items">
                            {activeDiscounts.map(discount => {
                                console.log('Rendering discount:', discount);
                                return (
                                    <div className="active-item" key={discount.dish_id}>
                                        <div className="item-image">
                                            <img 
                                                src={discount.image_url} 
                                                alt={discount.dish_name}
                                                onError={(e) => {
                                                    e.target.src = '/images/default_dish.png';
                                                }}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <h4>{discount.dish_name}</h4>
                                            <p>Original Price: ₹{discount.price}</p>
                                            <p className="discount-type">Discount: {discount.discount}%</p>
                                            <p className="menu-items">
                                                Category: {discount.dish_tag} | {discount.is_veg ? 'Veg' : 'Non-Veg'}
                                            </p>
                                        </div>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDeleteDiscount(discount.dish_id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Active Coupons */}
                <div className="active-section">
                    <h3>Active Coupons</h3>
                    {loading ? (
                        <div className="loading-message">Loading coupons...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : activeCoupons.length === 0 ? (
                        <div className="empty-message">No active coupons found.</div>
                    ) : (
                        <div className="active-items">
                            {activeCoupons.map(coupon => (
                                <div className="active-item" key={coupon.id}>
                                    <div className="item-details">
                                        <h4>{coupon.code}</h4>
                                        <p>₹{coupon.value} off</p>
                                        <p>Min. Order: ₹{coupon.min_order_value}</p>
                                        <p>Usage Limit: {coupon.usage_limit}</p>
                                        <p className="valid-date">Valid till {formatDate(coupon.valid_until)}</p>
                                    </div>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDeleteCoupon(coupon.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscountManagement;