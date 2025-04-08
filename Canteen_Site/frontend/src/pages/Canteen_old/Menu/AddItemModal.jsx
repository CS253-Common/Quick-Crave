import React, { useState, useRef } from 'react';
import '../../../styles/Canteen/menu_modals.css';

const AddItemModal = ({ isOpen, onClose, onSave, categories }) => {
    const initialFormData = {
        name: '',
        description: '',
        price: '',
        categories: [],
        status: 'Available'
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? (value === '' ? '' : parseFloat(value)) : value
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

    const handleCategoryChange = (e) => {
        const { options } = e.target;
        const selectedCategories = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedCategories.push(options[i].value);
            }
        }
        
        setFormData({
            ...formData,
            categories: selectedCategories
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Item name is required';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }
        
        if (formData.categories.length === 0) {
            newErrors.categories = 'At least one category is required';
        }
        
        // Image is now optional
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Create a new menu item object
            const newItem = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                categories: formData.categories,
                status: formData.status,
                imageFile: selectedImage // Pass the actual File object if selected
            };
            
            // In case no image is selected, we'll use a default image path
            if (!selectedImage && previewUrl) {
                newItem.image = previewUrl;
            }
            
            onSave(newItem);
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
                    <h2>Add New Menu Item</h2>
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
                                <label htmlFor="description">Description*</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className={errors.description ? 'error' : ''}
                                ></textarea>
                                {errors.description && <div className="error-message">{errors.description}</div>}
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
                                <label htmlFor="categories">Categories*</label>
                                <select
                                    id="categories"
                                    name="categories"
                                    value={formData.categories}
                                    onChange={handleCategoryChange}
                                    multiple
                                    className={errors.categories ? 'error' : ''}
                                >
                                    {categories.filter(cat => cat !== 'All Items').map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <small className="select-help">Hold Ctrl (or Cmd on Mac) to select multiple categories</small>
                                {errors.categories && <div className="error-message">{errors.categories}</div>}
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
                                        <i className="fas fa-upload"></i> Select Image
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
                        <button type="submit" className="save-btn">Add Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
