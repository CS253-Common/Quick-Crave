import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../styles/Canteen/canteen_manager_profile.css';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeImageModal from './ChangeImageModal';
import canteenService from '../../../services/canteenService';

const CanteenManagerProfile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    
    // State for modals
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
    
    // State for loading and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    // User data state with default values
    const [userData, setUserData] = useState({
        username: sessionStorage.getItem('username'),
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
        img_url: sessionStorage.getItem('img_url')||'/images/business_avatar.png',
        address: sessionStorage.getItem('address')||'Not specified',
        opening_time: sessionStorage.getItem('opening_time')||'08:00',
        closing_time: sessionStorage.getItem('closing_time')||'18:00',
        opening_status: sessionStorage.getItem('opening_status')||true,
        auto_accept: sessionStorage.getItem('auto_accept')|| false,
        delivery_available: sessionStorage.getItem('delivery_available')||true,
        phone_number : sessionStorage.getItem('delivery_available')|| 1234567890
    });

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const profileData = await canteenService.getUserProfile();
                
                // Transform the API response to match our state structure
                const transformedData = {
                    username: profileData.username,
                    name: profileData.name,
                    role: 'Canteen Manager',
                    profileImage: profileData.img_url || '/images/business_avatar.png',
                    img_url: profileData.img_url  || '/images/business_avatar.png',
                    address: profileData.address || 'Not specified',
                    opening_time: profileData.opening_time || '08:00',
                    closing_time: profileData.closing_time || '18:00',
                    opening_status: profileData.opening_status !== undefined ? profileData.opening_status : true,
                    auto_accept: profileData.auto_accept !== undefined ? profileData.auto_accept : false,
                    delivery_available: profileData.delivery_available !== undefined ? profileData.delivery_available : true,
                    phone_number: profileData.phone_number
                };
                
                setUserData(transformedData);
                
                // Save basic user info to session storage
                // sessionStorage.setItem('name', transformedData.name);
                // sessionStorage.setItem('username', transformedData.username);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load profile data. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Display success message for 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // Handler for saving profile changes
    const handleSaveProfile = async (updatedData) => {
        try {
            setLoading(true);
            setError(null);
            
            // Call the API to update profile
            const response = await canteenService.updateCanteenProfile({
                username: updatedData.username,
                name: updatedData.name,
                address: updatedData.address,
                opening_time: updatedData.opening_time,
                closing_time: updatedData.closing_time,
                opening_status: updatedData.opening_status,
                auto_accept: updatedData.auto_accept,
                delivery_available: updatedData.delivery_available,
                img_url: updatedData.img_url
            });
            
            // Update local state with the new data
            setUserData(updatedData);
            setSuccessMessage('Profile updated successfully!');
            
            // Save basic user info to session storage
            sessionStorage.setItem('name', updatedData.name);
            sessionStorage.setItem('username', updatedData.username);
            
            return response;
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for changing password
    const handleChangePassword = async (currentPassword, newPassword) => {
        try {
            setLoading(true);
            setError(null);
            
            // Call the API to change password
            const response = await canteenService.changePassword(currentPassword, newPassword);
            setSuccessMessage('Password changed successfully!');
            return response;
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.message || 'Failed to change password. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for changing profile image
    const handleChangeImage = async (imageFile, imagePreviewUrl) => {
        try {
            setLoading(true);
            setError(null);
            
            // Call the API to update profile image
            const response = await canteenService.updateProfileImage(imageFile);
            
            // Get the image URL from the response, or use the preview URL if not available
            const imageUrl = response.image_url || response.img_url || imagePreviewUrl;
            
            // Update local state with the new image URL from the server
            setUserData(prevData => ({
                ...prevData,
                profileImage: imageUrl,
                img_url: imageUrl
            }));
            
            setSuccessMessage('Profile picture updated successfully!');
            return response;
        } catch (err) {
            console.error('Error updating profile image:', err);
            setError(err.response?.data?.message || 'Failed to update profile image. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cm-canteen-profile-container">
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
                                <img src={userData.profileImage} alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                        <div className="cm-menu-user-details">
                            <h3 className="cm-menu-user-name">{userData.name}</h3>
                            <p className="cm-menu-user-email">{userData.username}</p>
                        </div>
                    </div>
                </div>
                <div className="cm-side-menu-content">
                    <ul className="cm-menu-items">
                        <li className="cm-menu-item">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="cm-menu-item active">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="cm-menu-item">
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
                        <Link to="/canteen-manager-home" className="logo-link">
                            <img src="/images/logo.png" alt="Quick Crave Logo" className="cm-logo-image" />
                            <h1 className="cm-logo-text">
                                <span className="cm-red-text">Quick</span> <span className="cm-yellow-text">Crave</span>
                            </h1>
                        </Link>
                    </div>
                    <div className="cm-user-profile">
                        <Link to="/canteen-manager-profile" className="cm-user-avatar-link">
                            <div className="cm-user-avatar">
                                <img src={userData.profileImage} alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Success and Error Messages */}
                {successMessage && (
                    <div className="success-message">
                        <i className="fas fa-check-circle"></i> {successMessage}
                    </div>
                )}
                
                {error && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                {/* Profile Content */}
                <div className="profile-content">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <img src={userData.profileImage} alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            <div className="edit-avatar-btn" onClick={() => setIsChangeImageModalOpen(true)}>
                                <i className="fas fa-camera"></i>
                            </div>
                        </div>
                        <div className="profile-title">
                            <h2>{userData.name}</h2>
                            <p>
                                <i className="fas fa-user-shield" style={{marginRight: '10px', color: '#ff5252'}}></i>
                                {userData.role}
                            </p>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3>Personal Information</h3>
                        
                        <div className="profile-field">
                            <div className="field-label">
                                <i className="fas fa-user" style={{marginRight: '8px', color: '#ff5252'}}></i>
                                Full Name
                            </div>
                            <div className="field-value">{userData.name}</div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">
                                <i className="fas fa-at" style={{marginRight: '8px', color: '#ff5252'}}></i>
                                Username
                            </div>
                            <div className="field-value">{userData.username}</div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">
                                <i className="fas fa-phone" style={{marginRight: '8px', color: '#ff5252'}}></i>
                                Phone
                            </div>
                            <div className="field-value">{userData.phone_number || 'Not specified'}</div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3>Canteen Details</h3>
                        
                        <div className="profile-field">
                            <div className="field-label">
                                <i className="fas fa-map-marker-alt" style={{marginRight: '8px', color: '#ff5252'}}></i>
                                Address
                            </div>
                            <div className="field-value">{userData.address}</div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">
                                <i className="fas fa-clock" style={{marginRight: '8px', color: '#ff5252'}}></i>
                                Operating Hours
                            </div>
                            <div className="field-value">Monday - Sunday, {userData.opening_time} - {userData.closing_time}</div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">Current Status</div>
                            <div className="status-value">
                                <span className={`status-indicator ${userData.opening_status ? 'status-open' : 'status-closed'}`}></span>
                                {userData.opening_status ? 'Open' : 'Closed'}
                            </div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">Auto-Accept Orders</div>
                            <div className="status-value">
                                <span className={`status-indicator ${userData.auto_accept ? 'status-open' : 'status-closed'}`}></span>
                                {userData.auto_accept ? 'Enabled' : 'Disabled'}
                            </div>
                        </div>

                        <div className="profile-field">
                            <div className="field-label">Delivery Available</div>
                            <div className="status-value">
                                <span className={`status-indicator ${userData.delivery_available ? 'status-open' : 'status-closed'}`}></span>
                                {userData.delivery_available ? 'Enabled' : 'Disabled'}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="edit-profile-btn" onClick={() => setIsEditProfileModalOpen(true)}>
                            <i className="fas fa-edit"></i> Edit Profile
                        </button>
                        <button className="change-password-btn" onClick={() => setIsChangePasswordModalOpen(true)}>
                            <i className="fas fa-lock"></i> Change Password
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            <EditProfileModal 
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                userData={userData}
                onSave={handleSaveProfile}
            />
            
            <ChangePasswordModal 
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
                onSave={handleChangePassword}
            />
            
            <ChangeImageModal 
                isOpen={isChangeImageModalOpen}
                onClose={() => setIsChangeImageModalOpen(false)}
                onSave={handleChangeImage}
            />
        </div>
    );
};

export default CanteenManagerProfile;
