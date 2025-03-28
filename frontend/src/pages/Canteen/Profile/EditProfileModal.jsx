import React, { useState, useEffect } from 'react';
import '../../../styles/Canteen/profile_modals.css';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || '',
    weekdayStart: userData.operatingHours?.weekday?.start || '8:00 AM',
    weekdayEnd: userData.operatingHours?.weekday?.end || '6:00 PM',
    saturdayStart: userData.operatingHours?.saturday?.start || '9:00 AM',
    saturdayEnd: userData.operatingHours?.saturday?.end || '3:00 PM',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        weekdayStart: userData.operatingHours?.weekday?.start || '8:00 AM',
        weekdayEnd: userData.operatingHours?.weekday?.end || '6:00 PM',
        saturdayStart: userData.operatingHours?.saturday?.start || '9:00 AM',
        saturdayEnd: userData.operatingHours?.saturday?.end || '3:00 PM',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (error) setError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Simple validation - can be expanded based on requirements
    return phone.length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      // Transform the form data back to the userData structure
      const updatedUserData = {
        ...userData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        operatingHours: {
          weekday: {
            start: formData.weekdayStart,
            end: formData.weekdayEnd
          },
          saturday: {
            start: formData.saturdayStart,
            end: formData.saturdayEnd
          },
          sunday: {
            closed: true
          }
        }
      };
      
      await onSave(updatedUserData);
      onClose();
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
            <h3>Personal Information</h3>
            
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
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
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
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Operating Hours (Monday - Friday)</label>
              <div className="time-inputs">
                <input
                  type="text"
                  name="weekdayStart"
                  value={formData.weekdayStart}
                  onChange={handleChange}
                  placeholder="Start Time"
                  required
                  disabled={loading}
                />
                <span>to</span>
                <input
                  type="text"
                  name="weekdayEnd"
                  value={formData.weekdayEnd}
                  onChange={handleChange}
                  placeholder="End Time"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Operating Hours (Saturday)</label>
              <div className="time-inputs">
                <input
                  type="text"
                  name="saturdayStart"
                  value={formData.saturdayStart}
                  onChange={handleChange}
                  placeholder="Start Time"
                  required
                  disabled={loading}
                />
                <span>to</span>
                <input
                  type="text"
                  name="saturdayEnd"
                  value={formData.saturdayEnd}
                  onChange={handleChange}
                  placeholder="End Time"
                  required
                  disabled={loading}
                />
              </div>
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
