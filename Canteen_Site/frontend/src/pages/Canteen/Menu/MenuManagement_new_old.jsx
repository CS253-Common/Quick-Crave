import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Canteen/menu_management.css';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import canteenService from '../../../services/canteenService';

const MenuManagement = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeCategories, setActiveCategories] = useState(['All Items']);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [canteenId, setCanteenId] = useState(sessionStorage.getItem('canteen_id') || '1'); // Default to 1 if not found
    
    // Menu items state
    const [menuItems, setMenuItems] = useState([]);

    // Menu categories
    const categories = ['Starter', 'Main Course', 'Dessert', 'Beverages'];

    // Add this at component level
    const [imagesLoaded, setImagesLoaded] = useState({});

    // Handle image load event
    const handleImageLoad = (itemId) => {
        setImagesLoaded(prev => ({...prev, [itemId]: true}));
    };

        // Default images by food category (used as fallbacks)
    const getDefaultFoodImage = (itemName, category) => {
        const categoryImages = {
            'Starter': 'https://images.unsplash.com/photo-1626200925750-bed296831aab?w=400&auto=format&fit=crop',
            'Main Course': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop',
            'Dessert': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
            'Beverages': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop',
            'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop'
        };
        return categoryImages[category] || categoryImages['default'];
    };

    // Fetch menu items when component mounts
    useEffect(() => {
        fetchMenuItems();
    }, [refetch]);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const items = await canteenService.getMenuItems();
            if(!items || items.length ===0){
                console.log('No menu items found or empty response');
                setError('No menu items found. Add some items to get started');
                setMenuItems([]);
                setLoading(false);
                return;
            }
            console.log('Fetched Menu Items:', items);
            //Map backend fieldnames to frontend
            const processedItems = items.map(item => ({
                id: item.dish_id,
                name: item.dish_name,
                dish_name: item.dish_name,
                price: item.price,
                discount: item.discount || 0,
                rating: item.rating || 0,
                dish_category: item.dish_category,
                dish_tag: item.dish_tag,
                is_veg: item.is_veg,
                img_url: item.img_url
            }));
            // console.log('ffh', processedItems);
            if(processedItems != menuItems){
                console.log('they are diff');
                setMenuItems(processedItems);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError('Failed to load menu items. Please try again.');
            setMenuItems([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        // Preload images
        console.log('bkc',menuItems);
        menuItems.forEach(item => {
            const imageUrl = item.img_url;
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                setImagesLoaded(prev => ({...prev, [item.id]: true}));
            };
            img.onerror = () => {
                setImagesLoaded(prev => ({...prev, [item.id]: false}));
            };
        });
    }, [menuItems]);

    const handleCategoryChange = (category) => {
        if (category === 'All Items') {
            setActiveCategories(['All Items']);
            return;
        }
        
        // If already in active categories, remove it (toggle behavior)
        if (activeCategories.includes(category)) {
            const newCategories = activeCategories.filter(cat => cat !== category);
            
            // If removing the last category, set back to 'All Items'
            if (newCategories.length === 0 || (newCategories.length === 1 && newCategories[0] === 'All Items')) {
                setActiveCategories(['All Items']);
            } else {
                // Remove 'All Items' if it's there and we're adding specific categories
                setActiveCategories(newCategories.filter(cat => cat !== 'All Items'));
            }
        } else {
            // Add the new category and remove 'All Items' if it's there
            setActiveCategories(activeCategories.includes('All Items') 
                ? [category] 
                : [...activeCategories.filter(cat => cat !== 'All Items'), category]);
        }
    };

    const handleEditItem = (itemId) => {
        const itemToEdit = menuItems.find(item => item.id === itemId);
        if (itemToEdit) {
            setCurrentItem(itemToEdit);
            setIsEditModalOpen(true);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                setLoading(true);
                await canteenService.deleteMenuItem(itemId);
                
                // Remove the deleted item from state
                setMenuItems(menuItems.filter(item => item.id !== itemId));
                
                alert('Item deleted successfully!');
            } catch (err) {
                console.error('Error deleting item:', err);
                alert('Failed to delete item. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentItem(null);
    };

    const handleAddItem = async (newItemData) => {
        try {
            setIsSubmitting(true);
            
            // Ensure dish_category is set
            if (!newItemData.dish_category) {
                newItemData.dish_category = 'Main Course'; // Default
            }
            
            // Send to backend API
            const result = await canteenService.addMenuItem(newItemData);
            
            // Add the new item (with server-assigned ID) to state
            setMenuItems([...menuItems, result]);
            
            // Success message
            alert('Item added successfully!');
            
            // Close modal and reset form
            setIsAddModalOpen(false);
            setRefetch(!refetch);
            
            return true; // Return success status
        } catch (err) {
            console.error('Error adding item:', err);
            alert(`Failed to add item: ${err.response?.data?.message || 'Unknown error occurred'}`);
            return false; // Return failure status
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateItem = async (updatedItemData) => {
        try {
            setIsSubmitting(true);
            
            // Send to backend API
            const result = await canteenService.updateMenuItem(updatedItemData.id, updatedItemData);
            
            // Update the item in state
            setMenuItems(menuItems.map(item => 
                item.id === result.id ? result : item
            ));
            
            // Success message
            alert('Item updated successfully!');
            
            // Close modal
            setIsEditModalOpen(false);
            setCurrentItem(null);
            
            return true; // Return success status
        } catch (err) {
            console.error('Error updating item:', err);
            alert(`Failed to update item: ${err.response?.data?.message || 'Unknown error occurred'}`);
            return false; // Return failure status
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter menu items based on active categories
    const filteredItems = activeCategories.includes('All Items')
        ? menuItems
        : menuItems.filter(item => activeCategories.includes(item.dish_category));

    // Toggle category selection
    const toggleCategory = (category) => {
        if (category === 'All Items') {
            // If 'All Items' is clicked
            if (activeCategories.includes('All Items')) {
                // If already selected, do nothing
                return;
            } else {
                // If not selected, clear other selections and select only 'All Items'
                setActiveCategories(['All Items']);
            }
        } else {
            // If another category is clicked
            if (activeCategories.includes('All Items')) {
                // If 'All Items' was selected, remove it and select the clicked category
                setActiveCategories([category]);
            } else if (activeCategories.includes(category)) {
                // If category was already selected
                if (activeCategories.length === 1) {
                    // If it's the only one selected, switch to 'All Items'
                    setActiveCategories(['All Items']);
                } else {
                    // Otherwise just remove it from selection
                    setActiveCategories(activeCategories.filter(c => c !== category));
                }
            } else {
                // If category wasn't selected, add it to the selection
                setActiveCategories([...activeCategories, category]);
            }
        }
    };

    // Helper function to render stars for ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<i key={i} className="fas fa-star"></i>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
            } else {
                stars.push(<i key={i} className="far fa-star"></i>);
            }
        }
        
        return stars;
    };

    return (
        <div className="menu-management-container" style={{minHeight: '100vh', position: 'relative', backgroundColor: 'transparent'}}>
            {/* Side Menu Overlay */}
            <div 
                className={`cm-side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
            ></div>

            {/* Side Menu */}
            <div className={`cm-side-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="cm-side-menu-header">
                    <button className="cm-close-menu-btn" onClick={toggleMenu}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="cm-menu-user-info">
                        <Link to="/canteen-manager-profile" className="cm-menu-user-avatar-link">
                            <div className="cm-menu-user-avatar">
                                <img src="/images/business_avatar.png" alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                        <div className="cm-menu-user-details">
                            <h3 className="cm-menu-user-name">John Manager</h3>
                            <p className="cm-menu-user-email">john.manager@quickcrave.com</p>
                        </div>
                    </div>
                </div>
                <div className="cm-side-menu-content">
                    <ul className="cm-menu-items">
                        <li className="cm-menu-item">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="cm-menu-item active">
                            <Link to="/canteen-menu-management"><i className="fas fa-utensils"></i> Menu Management</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-orders"><i className="fas fa-clipboard-list"></i> Order Queue</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-discounts"><i className="fas fa-tags"></i> Discounts</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-reservations"><i className="fas fa-calendar-alt"></i> Reservations</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/canteen-statistics"><i className="fas fa-chart-line"></i> Statistics</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/login"><i className="fas fa-sign-out-alt"></i> Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="cm-main-content">
                {/* Top Navigation Bar */}
                <div className="cm-top-nav">
                    <button className="cm-menu-btn" onClick={toggleMenu}>
                        <img src="/images/side_menu.png" alt="Menu Logo" className="cm-menu-logo" />
                    </button>
                    <div className="cm-logo-container">
                        <Link to="/canteen-manager-home" className="cm-logo-link">
                            <img src="/images/logo.png" alt="Quick Crave Logo" className="cm-logo-image" />
                            <h1 className="cm-logo-text">
                                <span className="cm-red-text">Quick</span> <span className="cm-yellow-text">Crave</span>
                            </h1>
                        </Link>
                    </div>
                    <div className="cm-user-actions">
                        {/* <div className="cm-notification-icon">
                            <i className="fas fa-bell"></i>
                            <span className="cm-notification-badge">2</span>
                        </div> */}
                        <div className="cm-user-profile">
                            <Link to="/canteen-manager-profile" className="cm-user-avatar-link">
                                <div className="cm-user-avatar">
                                    <img src="/images/business_avatar.png" alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                                </div>
                                <span className="cm-user-name">John Manager</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Menu Management Content */}
                <div className="cm-menu-content" style={{marginBottom: '50px'}}>
                    <h1 className="cm-menu-title">Menu Management</h1>
                    
                    {/* {loading ? (
                        <div className="cm-loading-container">
                            <div className="cm-loading-spinner"></div>
                            <p>Loading menu items...</p>
                        </div>
                    ) : error ? (
                        <div className="cm-error-container">
                            <i className="fas fa-exclamation-circle"></i>
                            <p>{error}</p>
                            <button className="cm-retry-btn" onClick={fetchMenuItems}>
                                <i className="fas fa-sync-alt"></i> Retry
                            </button>
                        </div>
                    ) : menuItems.length === 0 ? (
                        <div className="cm-empty-state">
                            <div className="cm-empty-icon">
                                <i className="fas fa-utensils"></i>
                            </div>
                            <h3>No Menu Items Found</h3>
                            <p>Start by adding some delicious items to your menu!</p>
                            <button className="cm-add-item-btn" onClick={openAddModal}>
                                <i className="fas fa-plus"></i> Add First Item
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cm-menu-header">
                                <h2>Menu Items ({filteredItems.length})</h2>
                                <button className="cm-add-item-btn" onClick={openAddModal} disabled={isSubmitting}>
                                    <i className="fas fa-plus"></i> Add New Item
                                </button>
                            </div>
                            
                            <div className="cm-category-tabs"> */}
                    {/* Menu Items Section */}
                    <div className="cm-menu-items-section">
                        <div className="cm-section-header">
                            <h2>Menu Items</h2>
                            <button className="cm-add-item-btn" onClick={openAddModal}>
                                <i className="fas fa-plus"></i> Add Item
                            </button>
                        </div>

                        {/* Error message display */}
                        {error && (
                            <div className="cm-error-message">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}

                        {/* Loading indicator */}
                        {loading && (
                            <div className="cm-loading">
                                <div className="cm-loading-spinner"></div>
                                <p>Loading menu items...</p>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !error && menuItems.length === 0 && (
                            <div className="cm-empty-state">
                                <div className="cm-empty-icon">
                                    <i className="fas fa-utensils"></i>
                                </div>
                                <h3>No Menu Items Yet</h3>
                                <p>Start by adding your first menu item using the 'Add Item' button above.</p>
                            </div>
                        )}

                        {/* Menu categories filter */}
                        {!loading && menuItems.length > 0 && (
                            <div className="cm-menu-categories">        
                                {['All Items', ...categories].map(category => (
                                    <button
                                        key={category}
                                        className={`cm-category-tab ${activeCategories.includes(category) ? 'active' : ''}`}
                                        onClick={() => toggleCategory(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}    

                        {/*Menu Items grid */}
                        {!loading && menuItems.length > 0 && (
                            <div className="cm-menu-items-grid">        
                                {filteredItems.map(item => (
                                    <div key={item.id} className="cm-menu-item-card">
                                        <div className="cm-item-image">
                                            {/* {imagesLoaded[item.id] === undefined && (
                                                <div className="cm-loading-placeholder"></div>
                                            )}
                                            <img 
                                                onLoad={() => handleImageLoad(item.id)}
                                                src={imagesLoaded[item.id] === false ? '/images/default_food.jpg' : getFoodImageByName(item.name, item.id)} 
                                                alt={item.name}
                                                style={{display: imagesLoaded[item.id] ? 'block' : 'none'}}
                                                onError={(e) => { e.target.src = '/images/default_food.jpg' }} 
                                            /> */}
                                            <div className="cm-menu-item-image-container">
                                                <div className="cm-menu-item-image">
                                                    {!imagesLoaded[item.id] && <div className="loading-animation"></div>}
                                                    <img 
                                                        onLoad={() => handleImageLoad(item.id)}
                                                        src={item.img_url || getDefaultFoodImage(item.name, item.dish_category)} 
                                                        alt={item.name}
                                                        style={{display: imagesLoaded[item.id] ? 'block' : 'none'}}
                                                        onError={(e) => { e.target.src = '/images/default_food.jpg' }}
                                                    />
                                                </div>
                                            </div>
                                            {item.discount > 0 && (
                                                <div className="cm-discount-badge">-{item.discount}%</div>
                                            )}
                                        </div>
                                        <div className="cm-item-actions">
                                            <button 
                                                className="cm-edit-item-btn" 
                                                onClick={() => handleEditItem(item.id)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="cm-delete-item-btn" 
                                                onClick={() => handleDeleteItem(item.id)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="cm-item-details">
                                            <h3 className="cm-item-name">{item.name || item.dish_name}</h3>
                                            <div className="cm-item-type-tags">
                                                <span className={`cm-veg-indicator ${item.is_veg ? 'veg' : 'non-veg'}`}>
                                                    <span className="cm-dot"></span>
                                                </span>
                                                <span className="cm-dish-tag">{item.dish_tag}</span>
                                                <span className={`cm-category-tag cm-category-${(item.dish_category || '').toLowerCase().replace(/\s+/g, '-')}`}>{item.dish_category || 'Uncategorized'}</span>
                                            </div>
                                            <div className="cm-item-rating">
                                                <div className="cm-stars">{renderStars(item.rating)}</div>
                                                <span className="cm-rating-value">{(item.rating || 0).toFixed(1)}</span>
                                            </div>
                                            <div className="cm-item-footer">
                                                <span className="cm-item-price">
                                                    {item.discount > 0 && (
                                                        <span className="cm-original-price">₹{item.price.toFixed(0)}</span>
                                                    )}
                                                    <span className="cm-current-price">
                                                        ₹{(item.price * (1 - item.discount/100)).toFixed(0)}
                                                    </span>
                                                </span>
                                                <span className={`cm-item-status ${item.status === 'Available' ? 'available' : 'sold-out'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            <AddItemModal 
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSave={handleAddItem}
                categories={categories}
            />

            {/* Edit Item Modal */}
            <EditItemModal 
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleUpdateItem}
                categories={categories}
                item={currentItem}
            />
        </div>
    );
};

export default MenuManagement;
