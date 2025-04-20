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
    // const [canteenId, setCanteenId] = useState(sessionStorage.getItem('canteen_id') || '1'); // Default to 1 if not found
    const userData = {
        name: sessionStorage.getItem('name') || 'John Manager',
        username: sessionStorage.getItem('username') || 'john_manager'
    };
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

    // Add this function to generate food images based on item name
    // const getFoodImageByName = (itemName, itemId) => {
    //     const name = itemName.toLowerCase();
        
    //     // Mapping food categories to appropriate images
    //     const foodImageMap = {
    //         // Pizza related
    //         pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop',
    //         margherita: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=400&auto=format&fit=crop',
            
    //         // Rice dishes
    //         biryani: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop',
    //         rice: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop',
    //         fried: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop',
            
    //         // Pasta and Italian
    //         pasta: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&auto=format&fit=crop',
    //         spaghetti: 'https://images.unsplash.com/photo-1548234979-f5a75960623b?w=400&auto=format&fit=crop',
    //         lasagna: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400&auto=format&fit=crop',
            
    //         // Indian food
    //         curry: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop',
    //         paneer: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop',
    //         butter: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop',
    //         naan: 'https://images.unsplash.com/photo-1596797038530-2c107aa7ad2c?w=400&auto=format&fit=crop',
            
    //         // Chinese food
    //         noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop',
    //         manchurian: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&auto=format&fit=crop',
            
    //         // Starters/Appetizers
    //         soup: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop',
    //         salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop',
    //         sandwich: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=400&auto=format&fit=crop',
    //         appetizer: 'https://images.unsplash.com/photo-1626200925750-bed296831aab?w=400&auto=format&fit=crop',
    //         tikka: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop',
            
    //         // Desserts
    //         cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop',
    //         'ice cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&auto=format&fit=crop',
    //         icecream: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&auto=format&fit=crop',
    //         pastry: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=400&auto=format&fit=crop',
    //         sweet: 'https://images.unsplash.com/photo-1516747773515-18a267c17834?w=400&auto=format&fit=crop',
    //         gulab: 'https://images.unsplash.com/photo-1601303516333-9a4cc7ba78be?w=400&auto=format&fit=crop',
            
    //         // Beverages
    //         juice: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop',
    //         tea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop',
    //         coffee: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&auto=format&fit=crop',
    //         smoothie: 'https://images.unsplash.com/photo-1553530666-ba11a90a0819?w=400&auto=format&fit=crop',
    //         drink: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop',
    //         shake: 'https://images.unsplash.com/photo-1568901839119-631418a3910d?w=400&auto=format&fit=crop',
            
    //         // Burgers and Sandwiches
    //         burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop',
    //         sandwich: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&auto=format&fit=crop'
    //     };

    //     // Default images by food category (used as fallbacks)
    //     const categoryImages = {
    //         'Starter': 'https://images.unsplash.com/photo-1626200925750-bed296831aab?w=400&auto=format&fit=crop',
    //         'Main Course': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop',
    //         'Dessert': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
    //         'Beverages': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop',
    //         'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop'
    //     };
        
    //     // Check each key in the food map and return the image if the name contains that key
    //     for (const [key, imageUrl] of Object.entries(foodImageMap)) {
    //         if (name.includes(key)) {
    //             return imageUrl;
    //         }
    //     }
        
    //     // Get dish category
    //     const item = menuItems.find(item => item.id === itemId);
    //     const category = item?.dish_category || assignCategoryByName(itemName);
        
    //     // Return the category default image or the global default if category not found
    //     return categoryImages[category] || categoryImages['default'];
    // };

    // Assign categories based on item names
    // const assignCategoryByName = (itemName) => {
    //     const name = itemName.toLowerCase();
        
    //     // Main Course items
    //     if (name.includes('pizza') || 
    //         name.includes('biryani') || 
    //         name.includes('pasta') || 
    //         name.includes('butter') || 
    //         name.includes('curry') || 
    //         name.includes('rice')) {
    //         return 'Main Course';
    //     }
        
    //     // Starter items
    //     if (name.includes('soup') || 
    //         name.includes('salad') || 
    //         name.includes('roll') || 
    //         name.includes('appetizer') || 
    //         name.includes('tikka')) {
    //         return 'Starter';
    //     }
        
    //     // Dessert items
    //     if (name.includes('cake') || 
    //         name.includes('ice cream') || 
    //         name.includes('gulab') || 
    //         name.includes('sweet') || 
    //         name.includes('pastry')) {
    //         return 'Dessert';
    //     }
        
    //     // Beverage items
    //     if (name.includes('juice') || 
    //         name.includes('tea') || 
    //         name.includes('coffee') || 
    //         name.includes('shake') || 
    //         name.includes('drink') || 
    //         name.includes('soda')) {
    //         return 'Beverages';
    //     }
        
    //     // Default to Main Course
    //     return 'Main Course';
    // };

    // Fetch menu items when component mounts
    useEffect(() => {
        fetchMenuItems();
    }, []);

    // useEffect(() => {
    //     // Preload images
    //     menuItems.forEach(item => {
    //         const imageByName = getFoodImageByName(item.name, item.id);
    //         const img = new Image();
    //         img.src = imageByName;
    //         img.onload = () => {
    //             setImagesLoaded(prev => ({...prev, [item.id]: true}));
    //         };
    //         img.onerror = () => {
    //             setImagesLoaded(prev => ({...prev, [item.id]: false}));
    //         };
    //     });
    // }, [menuItems]);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const items = await canteenService.getMenuItems();
            
            // Assign dish_category to items if missing (based on name and dish_tag)
            const processedItems = items.map(item => {
                // If dish_category is missing or invalid
                if (!item.dish_category) {
                    // First try to determine from name
                    item.dish_category = 'Uncategorized';
                }
                // if(items.is_available)
                return item;
            });
            
            setMenuItems(processedItems);
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
        const itemToEdit = menuItems.find(item => item.dish_id === itemId);
        if (itemToEdit) {
            setCurrentItem(itemToEdit);
            setIsEditModalOpen(true);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                setLoading(true);
                const result = await canteenService.deleteMenuItem(itemId);
                
                // Remove the deleted item from state
                setMenuItems(menuItems.filter(item => item.dish_id !== itemId));
                
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
            console.log("pehla");
            // Send to backend API
            const result = await canteenService.addMenuItem(newItemData);
            console.log("kjhdk")
            // Add the new item (with server-assigned ID) to state
            setMenuItems([...menuItems, result]);
            console.log("dusra");
            
            // Success message
            alert('Item added successfully!');
            
            fetchMenuItems();
            // Close modal and reset form
            setIsAddModalOpen(false);
            
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
            const result = await canteenService.updateMenuItem(updatedItemData.dish_id, updatedItemData);
            
            // Update the item in state
            setMenuItems(menuItems.map(item => 
                item.dish_id === result.dish_id ? result : item
            ));
            
            // Success message
            alert('Item updated successfully!');
            
            // Close modal
            setIsEditModalOpen(false);
            setCurrentItem(null);
            fetchMenuItems(); // reloads all items from backend
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
        console.log(fullStars, 'star');
        
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
                            <h3 className="cm-menu-user-name">{userData.name}</h3>
                            <h5 className='cm-menu-user-username'>{userData.username}</h5>
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
                                <span className="cm-user-name">{userData.name}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Menu Management Content */}
                <div className="cm-menu-content" style={{marginBottom: '50px'}}>
                    <h1 className="cm-menu-title">Menu Management</h1>
                    
                    {loading ? (
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
                            
                            <div className="cm-category-tabs">
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

                            {/* Menu Items Grid */}
                            <div className="cm-menu-items-grid" style={{backgroundColor: 'transparent', position: 'relative', zIndex: 1, marginBottom: '60px'}}>
                                {filteredItems.map(item => (
                                    <div key={item.dish_id} className="cm-menu-item-card">
                                        <div className="cm-item-image">
                                            {imagesLoaded[item.dish_id] === undefined && (
                                                <div className="cm-loading-placeholder"></div>
                                            )}
                                            <img 
                                                onLoad={() => handleImageLoad(item.dish_id)}
                                                // src={imagesLoaded[item.id] === false ? '/images/default_food.jpg' : getFoodImageByName(item.name, item.id)} 
                                                alt={item.dish_name}
                                                style={{display: imagesLoaded[item.dish_id] ? 'block' : 'none'}}
                                                onError={(e) => { e.target.src = '/images/default_food.jpg' }} 
                                            />
                                            {item.discount > 0 && (
                                                <div className="cm-discount-badge">-{item.discount}%</div>
                                            )}
                                        </div>
                                        <div className="cm-item-actions">
                                            <button 
                                                className="cm-edit-item-btn" 
                                                onClick={() => handleEditItem(item.dish_id)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="cm-delete-item-btn" 
                                                onClick={() => handleDeleteItem(item.dish_id)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="cm-item-details">
                                            <h3 className="cm-item-name">{item.dish_name}</h3>
                                            <div className="cm-item-type-tags">
                                                <span className={`cm-veg-indicator ${item.is_veg ? 'veg' : 'non-veg'}`}>
                                                    <span className="cm-dot"></span>
                                                </span>
                                                <span className="cm-dish-tag">{item.dish_tag}</span>
                                                <span className={`cm-category-tag cm-category-${(item.dish_category || '').toLowerCase().replace(/\s+/g, '-')}`}>{item.dish_category || 'Uncategorized'}</span>
                                            </div>
                                            <div className="cm-item-rating">
                                                <div className="cm-stars">{renderStars(item.rating)}</div>
                                                <span className="cm-rating-value">{item.rating.toFixed(1)}</span>
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
                            {/* Extra space at the bottom */}
                            <div style={{height: '60px'}}></div>
                        </>
                    )}
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
