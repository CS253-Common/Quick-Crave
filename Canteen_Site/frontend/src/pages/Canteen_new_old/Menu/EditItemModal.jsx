import React, { useState, useRef, useEffect } from 'react';
import '../../../styles/Canteen/menu_modals.css';

const EditItemModal = ({ isOpen, onClose, onSave, item }) => {
    const initialFormData = {
        name: '',
        dish_tag: '',
        price: '',
        discount: 0,
        rating: 0,
        category_tag: 'Main Course',
        is_veg: true,
        status: 'Available'
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    
    const fileInputRef = useRef(null);

    // Initialize form data when the modal opens with the item data
    useEffect(() => {
        if (item && isOpen) {
            setFormData({
                name: item.name || '',
                dish_tag: item.dish_tag || '',
                price: item.price || '',
                discount: item.discount || 0,
                rating: item.rating || 0,
                category_tag: item.category_tag || 'Main Course',
                is_veg: item.is_veg !== undefined ? item.is_veg : true,
                status: item.status || 'Available'
            });
            
            // Set the preview URL for the existing image
            if (item.image) {
                setPreviewUrl(item.image);
            }
        }
    }, [item, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'rating' || name === 'discount' 
                ? (value === '' ? '' : parseFloat(value)) 
                : value
        });
        
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            
            // Clear error
            if (errors.image) {
                setErrors({
                    ...errors,
                    image: null
                });
            }
        }
    };

    const handleSelectImage = () => {
        fileInputRef.current.click();
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Item name is required';
        }
        
        if (!formData.dish_tag.trim()) {
            newErrors.dish_tag = 'Dish tag is required';
        }
        
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (formData.discount < 0 || formData.discount > 100) {
            newErrors.discount = 'Discount must be between 0 and 100';
        }

        if (formData.rating < 0 || formData.rating > 5) {
            newErrors.rating = 'Rating must be between 0 and 5';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Create an updated menu item object
            const updatedItem = {
                id: item.id, // Keep the original ID
                name: formData.name,
                dish_tag: formData.dish_tag,
                price: formData.price,
                discount: formData.discount,
                rating: formData.rating,
                category_tag: formData.category_tag,
                is_veg: formData.is_veg,
                status: formData.status,
                imageFile: selectedImage // Pass the actual File object if a new image was selected
            };
            
            // If no new image was selected but we have a preview URL
            // (which could be the original image), use that URL
            if (!selectedImage && previewUrl) {
                updatedItem.image = previewUrl;
            }
            
            onSave(updatedItem);
            // We don't reset the form here as it will be done after receiving API response
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setSelectedImage(null);
        setPreviewUrl(null);
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container menu-modal">
                <div className="modal-header">
                    <h2>Edit Menu Item</h2>
                    <button className="close-modal-btn" onClick={handleClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="menu-form">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="name">Item Name*</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <div className="error-message">{errors.name}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="dish_tag">Dish Tag*</label>
                                <input
                                    type="text"
                                    id="dish_tag"
                                    name="dish_tag"
                                    value={formData.dish_tag}
                                    onChange={handleChange}
                                    placeholder="e.g. North Indian, Chinese, Italian"
                                    className={errors.dish_tag ? 'error' : ''}
                                />
                                {errors.dish_tag && <div className="error-message">{errors.dish_tag}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="price">Price (₹)*</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={errors.price ? 'error' : ''}
                                />
                                {errors.price && <div className="error-message">{errors.price}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="discount">Discount (%)</label>
                                <input
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    step="1"
                                    min="0"
                                    max="100"
                                    className={errors.discount ? 'error' : ''}
                                />
                                {errors.discount && <div className="error-message">{errors.discount}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="rating">Rating (0-5)</label>
                                <div className="rating-input-container">
                                    <input
                                        type="number"
                                        id="rating"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        className={errors.rating ? 'error' : ''}
                                    />
                                    <div className="rating-stars-preview">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i 
                                                key={star}
                                                className={
                                                    formData.rating >= star 
                                                        ? 'fas fa-star' 
                                                        : formData.rating >= star - 0.5 
                                                            ? 'fas fa-star-half-alt' 
                                                            : 'far fa-star'
                                                }
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                                {errors.rating && <div className="error-message">{errors.rating}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="category_tag">Category*</label>
                                <select
                                    id="category_tag"
                                    name="category_tag"
                                    value={formData.category_tag}
                                    onChange={handleChange}
                                    className={errors.category_tag ? 'error' : ''}
                                >
                                    <option value="Starter">Starter</option>
                                    <option value="Main Course">Main Course</option>
                                    <option value="Dessert">Dessert</option>
                                    <option value="Beverages">Beverages</option>
                                </select>
                                {errors.category_tag && <div className="error-message">{errors.category_tag}</div>}
                            </div>

                            <div className="form-group">
                                <label>Vegetarian</label>
                                <div className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        id="is_veg"
                                        name="is_veg"
                                        checked={formData.is_veg}
                                        onChange={(e) => setFormData({...formData, is_veg: e.target.checked})}
                                    />
                                    <label htmlFor="is_veg" className="toggle-label">
                                        <span className="toggle-inner"></span>
                                        <span className="toggle-switch"></span>
                                    </label>
                                </div>
                                <div className="veg-status-indicator">
                                    <span className={`veg-indicator ${formData.is_veg ? 'veg' : 'non-veg'}`}>
                                        <span className="dot"></span>
                                    </span>
                                    <span>{formData.is_veg ? 'Vegetarian' : 'Non-vegetarian'}</span>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Sold Out">Sold Out</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-column">
                            <div className="form-group">
                                <label>Item Image (Optional)</label>
                                <div className="image-upload-container">
                                    <div className={`image-preview ${errors.image ? 'error-border' : ''}`}>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" />
                                        ) : (
                                            <div className="no-image">
                                                <i className="fas fa-utensils"></i>
                                                <p>No image selected</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    
                                    <button 
                                        type="button" 
                                        className="select-image-btn"
                                        onClick={handleSelectImage}
                                    >
                                        <i className="fas fa-upload"></i> {previewUrl ? 'Change Image' : 'Select Image'}
                                    </button>
                                    
                                    {selectedImage && (
                                        <p className="selected-file-name">{selectedImage.name}</p>
                                    )}
                                    
                                    {errors.image && <div className="error-message">{errors.image}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="save-btn">Update Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItemModal; 