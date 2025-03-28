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
    const [canteenId, setCanteenId] = useState(sessionStorage.getItem('canteen_id') || '1'); // Default to 1 if not found
    
    // Menu items state
    const [menuItems, setMenuItems] = useState([]);

    // Categories for filtering
    const categories = ['All Items', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

    // Add this at component level
    const [imagesLoaded, setImagesLoaded] = useState({});

    // Fetch menu items when component mounts
    useEffect(() => {
        fetchMenuItems();
    }, [canteenId]);

    useEffect(() => {
        // Preload images
        menuItems.forEach(item => {
            if (item.image) {
                const img = new Image();
                img.src = item.image;
                img.onload = () => {
                    setImagesLoaded(prev => ({...prev, [item.id]: true}));
                };
                img.onerror = () => {
                    setImagesLoaded(prev => ({...prev, [item.id]: false}));
                };
            }
        });
    }, [menuItems]);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await canteenService.getMenuItems(canteenId);
            setMenuItems(data);
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError('Failed to load menu items. Please try again later.');
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
            
            // Send to backend API
            const result = await canteenService.addMenuItem(newItemData);
            
            // Add the new item (with server-assigned ID) to state
            setMenuItems([...menuItems, result]);
            
            // Success message
            alert('Item added successfully!');
            
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
        : menuItems.filter(item => {
            // Check if any of the item's categories match any of the active categories
            return (item.categories || []).some(category => activeCategories.includes(category));
        });

    return (
        <div className="menu-management-container" style={{ backgroundImage: `url(/images/pattern.png)` }}>
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
                            <h3 className="menu-user-name">John Manager</h3>
                            <p className="menu-user-email">john.manager@quickcrave.com</p>
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
                        <li className="menu-item active">
                            <Link to="/canteen-menu-management"><i className="fas fa-utensils"></i> Menu Management</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/manage-orders"><i className="fas fa-clipboard-list"></i> Order Queue</Link>
                        </li>
                        <li className="menu-item">
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

            {/* Main Content */}
            <div className="main-content">
                {/* Top Navigation Bar */}
                <div className="top-nav">
                    <button className="menu-btn" onClick={toggleMenu}>
                        <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                    </button>
                    <div className="logo-container">
                        <Link to="/canteen-manager-home" className="logo-link">
                            <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                            <h1 className="logo-text">
                                <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                            </h1>
                        </Link>
                    </div>
                    <div className="user-actions">
                        {/* <div className="notification-icon">
                            <i className="fas fa-bell"></i>
                            <span className="notification-badge">2</span>
                        </div> */}
                        <div className="user-profile">
                            <Link to="/canteen-manager-profile" className="user-avatar-link">
                                <div className="user-avatar">
                                    <img src="/images/business_avatar.png" alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                                </div>
                                <span className="user-name">John Manager</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Menu Management Content */}
                <div className="menu-content">
                    <div className="menu-header">
                        <h2>Menu Management</h2>
                        <button className="add-item-btn" onClick={openAddModal} disabled={loading || isSubmitting}>
                            <i className="fas fa-plus"></i> Add New Item
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="category-tabs">
                        {categories.map(category => (
                            <button 
                                key={category}
                                className={`category-tab ${activeCategories.includes(category) ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Loading and Error States */}
                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading menu items...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <p>{error}</p>
                            <button onClick={fetchMenuItems} className="retry-btn">Retry</button>
                        </div>
                    )}

                    {/* Menu Items Grid */}
                    {!loading && !error && (
                        filteredItems.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-utensils empty-icon"></i>
                                <p>No menu items found. Add your first item!</p>
                            </div>
                        ) : (
                            <div className="menu-items-grid">
                                {filteredItems.map(item => (
                                    <div key={item.id} className="menu-item-card">
                                        <div className="item-image">
                                            {!imagesLoaded[item.id] && <div className="image-loading-placeholder"></div>}
                                            <img 
                                                key={`img-${item.id}`}
                                                src={imagesLoaded[item.id] === false ? '/images/default_food.jpg' : item.image} 
                                                alt={item.name}
                                                style={{display: imagesLoaded[item.id] ? 'block' : 'none'}}
                                                onError={(e) => { e.target.src = '/images/default_food.jpg' }} 
                                            />
                                        </div>
                                        <div className="item-actions">
                                            <button 
                                                className="edit-item-btn" 
                                                onClick={() => handleEditItem(item.id)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="delete-item-btn" 
                                                onClick={() => handleDeleteItem(item.id)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="item-details">
                                            <h3 className="item-name">{item.name}</h3>
                                            <p className="item-description">{item.description}</p>
                                            <div className="item-categories">
                                                {(item.categories || []).map(cat => (
                                                    <span key={`${item.id}-${cat}`} className="item-category">{cat}</span>
                                                ))}
                                            </div>
                                            <div className="item-footer">
                                                <span className="item-price">₹{item.price.toFixed(2)}</span>
                                                <span className={`item-status ${item.status === 'Available' ? 'available' : 'sold-out'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
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
