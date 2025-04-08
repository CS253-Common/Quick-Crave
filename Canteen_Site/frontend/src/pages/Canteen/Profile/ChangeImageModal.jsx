import React, { useState, useRef } from 'react';
import '../../../styles/Canteen/profile_modals.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ChangeImageModal = ({ isOpen, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');

  const validateImage = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'Image size must be less than 5MB';
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return 'Only JPG, JPEG, PNG, and GIF images are allowed';
    }

    return null; // No error
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Clear previous error
      setError('');
      
      // Validate image
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        // Reset file input
        e.target.value = '';
        return;
      }
      
      setSelectedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the onSave function with both the file and preview URL
      const response = await onSave(selectedImage, previewUrl);
      
      // Check for API error response
      if (response && response.success === false) {
        setError(response.message || 'Failed to update profile image. Please try again.');
      } else {
        // Reset state on success
        setSelectedImage(null);
        setPreviewUrl(null);
        setSuccessMessage('Profile image updated successfully!');
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating profile image:', err);
      setError(err.message || 'Failed to update profile image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setSelectedImage(null);
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Change Profile Picture</h2>
          <button className="close-modal-btn" onClick={handleClose} disabled={loading}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
        {successMessage && <div className="success-message"><i className="fas fa-check-circle"></i> {successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="image-upload-container">
            <div className="image-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <div className="no-image">
                  <i className="fas fa-user"></i>
                  <p>No image selected</p>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif"
              style={{ display: 'none' }}
              disabled={loading}
            />
            
            <div className="image-upload-info">
              <p className="upload-instructions">Upload a profile picture (max 5MB)</p>
              <p className="upload-formats">Supported formats: JPG, PNG, GIF</p>
            </div>
            
            <button 
              type="button" 
              className="select-image-btn"
              onClick={handleSelectImage}
              disabled={loading}
            >
              <i className="fas fa-upload"></i> Select Image
            </button>
            
            {selectedImage && (
              <p className="selected-file-name">
                {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose} disabled={loading}>Cancel</button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={!selectedImage || loading}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : null} Save Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeImageModal;
