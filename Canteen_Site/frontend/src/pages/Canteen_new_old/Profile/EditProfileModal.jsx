import React, { useState, useEffect } from 'react';
import '../../../styles/Canteen/profile_modals.css';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    username: userData.username || '',
    name: userData.name || '',
    address: userData.address || '',
    opening_time: userData.opening_time || '08:00',
    closing_time: userData.closing_time || '18:00',
    opening_status: userData.opening_status || true,
    auto_accept: userData.auto_accept || false,
    delivery_available: userData.delivery_available || true
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Available time options for dropdowns
  const timeOptions = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        name: userData.name || '',
        address: userData.address || '',
        opening_time: userData.opening_time || '08:00',
        closing_time: userData.closing_time || '18:00',
        opening_status: userData.opening_status !== undefined ? userData.opening_status : true,
        auto_accept: userData.auto_accept !== undefined ? userData.auto_accept : false,
        delivery_available: userData.delivery_available !== undefined ? userData.delivery_available : true
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    // Validate opening and closing times
    if (formData.opening_time >= formData.closing_time) {
      setError('Closing time must be later than opening time');
      return;
    }
    
    setLoading(true);
    
    try {
      // Transform the form data to match the API structure
      const updatedUserData = {
        ...userData,
        username: formData.username,
        name: formData.name,
        address: formData.address,
        opening_time: formData.opening_time,
        closing_time: formData.closing_time,
        opening_status: formData.opening_status,
        auto_accept: formData.auto_accept,
        delivery_available: formData.delivery_available,
        img_url: userData.img_url || userData.profileImage // Preserve the existing image URL
      };
      
      // Call the onSave function (which will send data to backend)
      const response = await onSave(updatedUserData);
      
      // If we got here, the save was successful
      if (response && response.success === false) {
        setError(response.message || 'Failed to save profile. Please try again.');
      } else {
        // Close modal after successful update
        onClose();
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-modal-btn" onClick={onClose} disabled={loading}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Account Information</h3>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Canteen Details</h3>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter canteen address"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Operating Settings</h3>
            
            <div className="form-group">
              <label>Operating Hours</label>
              <div className="time-inputs">
                <select
                  name="opening_time"
                  value={formData.opening_time}
                  onChange={handleChange}
                  disabled={loading}
                  className="time-select"
                >
                  {timeOptions.map(time => (
                    <option key={`open-${time}`} value={time}>{time}</option>
                  ))}
                </select>
                <span>to</span>
                <select
                  name="closing_time"
                  value={formData.closing_time}
                  onChange={handleChange}
                  disabled={loading}
                  className="time-select"
                >
                  {timeOptions.map(time => (
                    <option key={`close-${time}`} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="opening_status"
                  name="opening_status"
                  checked={formData.opening_status}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="opening_status">Currently Open</label>
              </div>
              <small className="form-hint">
                Toggle to set your canteen as currently open or closed
              </small>
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="auto_accept"
                  name="auto_accept"
                  checked={formData.auto_accept}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="auto_accept">Auto-Accept Orders</label>
              </div>
              <small className="form-hint">
                When enabled, new orders will be automatically accepted
              </small>
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="delivery_available"
                  name="delivery_available"
                  checked={formData.delivery_available}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="delivery_available">Delivery Available</label>
              </div>
              <small className="form-hint">
                Toggle to set your canteen as delivery available or not
              </small>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : null} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
