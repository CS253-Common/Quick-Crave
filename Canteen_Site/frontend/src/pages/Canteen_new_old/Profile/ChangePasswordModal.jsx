import React, { useState } from 'react';
import '../../../styles/Canteen/profile_modals.css';

const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (error) setError('');
  };

  const validatePassword = (password) => {
    // Check if password is at least 6 characters
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    // Check if password has at least one number
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    
    // Check if password has at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    return null; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing errors
    setError('');
    
    // Validate password requirements
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the onSave function which will call the API
      const response = await onSave(formData.currentPassword, formData.newPassword);
      
      // If we got here, the save was successful
      if (response && response.success === false) {
        setError(response.message || 'Failed to change password. Please try again.');
      } else {
        // Show success message and clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Close modal after 1.5 seconds to show success message
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Change Password</h2>
          <button className="close-modal-btn" onClick={onClose} disabled={loading}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
          
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <small className="form-hint">
              Password must be at least 6 characters with a number and an uppercase letter
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : null} Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
