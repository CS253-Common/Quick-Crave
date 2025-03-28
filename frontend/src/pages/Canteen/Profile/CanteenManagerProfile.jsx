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
    
    // User data state
    const [userData, setUserData] = useState({
        name: 'John Smith',
        email: 'john.smith@quickcrave.com',
        phone: '+1 (555) 123-4567',
        role: 'Canteen Manager',
        profileImage: '/images/business_avatar.png',
        address: '123 Food Court, Building B, Tech Park, City - 12345',
        operatingHours: {
            weekday: {
                start: '8:00 AM',
                end: '6:00 PM'
            },
            saturday: {
                start: '9:00 AM',
                end: '3:00 PM'
            },
            sunday: {
                closed: true
            }
        }
    });

    // Fetch user profile data from API
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to get profile from API
            const response = await canteenService.updateCanteenProfile({ fetchOnly: true });
            
            if (response && response.success) {
                setUserData(response.data);
                
                // Save basic user info to session storage for other components
                sessionStorage.setItem('user_name', response.data.name);
                sessionStorage.setItem('user_email', response.data.email);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile. Using local data instead.');
            
            // Fallback to session storage
            const userName = sessionStorage.getItem('user_name');
            const userEmail = sessionStorage.getItem('user_email');
            
            if (userName && userEmail) {
                setUserData(prevData => ({
                    ...prevData,
                    name: userName,
                    email: userEmail
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect to load user data when component mounts
    useEffect(() => {
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
            
            const response = await canteenService.updateCanteenProfile(updatedData);
            
            if (response && response.success) {
                // Update local state with response data
                setUserData(response.data);
                
                // Update session storage
                sessionStorage.setItem('user_name', response.data.name);
                sessionStorage.setItem('user_email', response.data.email);
                
                setSuccessMessage('Profile updated successfully!');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
            
            // Still update UI with the form data for better UX
            setUserData(updatedData);
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for changing password
    const handleChangePassword = async (currentPassword, newPassword) => {
        try {
            setLoading(true);
            setError(null);
            
            const passwordData = {
                currentPassword,
                newPassword
            };
            
            const response = await canteenService.changeCanteenPassword(passwordData);
            
            if (response && response.success) {
                setSuccessMessage('Password changed successfully!');
            } else {
                throw new Error('Failed to change password');
            }
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for changing profile image
    const handleChangeImage = async (imageFile, imagePreviewUrl) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await canteenService.updateProfileImage(imageFile);
            
            if (response && response.success) {
                // Update user data with the new image URL from the server
                setUserData(prevData => ({
                    ...prevData,
                    profileImage: response.data.imageUrl
                }));
                
                setSuccessMessage('Profile picture updated successfully!');
            } else {
                throw new Error('Failed to update profile image');
            }
        } catch (err) {
            console.error('Error updating profile image:', err);
            setError('Failed to update profile image. Please try again.');
            
            // Still update UI with the preview for better UX
            setUserData(prevData => ({
                ...prevData,
                profileImage: imagePreviewUrl
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="canteen-profile-container" style={{ backgroundImage: `url(/images/pattern.png)` }}>
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
                        <div className="menu-user-avatar">
                            <img src={userData.profileImage} alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                        </div>
                        <div className="menu-user-details">
                            <h3 className="menu-user-name">{userData.name}</h3>
                            <p className="menu-user-email">{userData.email}</p>
                        </div>
                    </div>
                </div>
                <div className="side-menu-content">
                    <ul className="menu-items">
                        <li className="menu-item">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="menu-item active">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="menu-item">
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
                        <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                        <h1 className="logo-text">
                            <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                        </h1>
                    </div>
                    <div className="user-profile">
                        <div className="user-avatar" id="userAvatar">
                            <img src={userData.profileImage} alt="User" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                        </div>
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
                            <p>{userData.role}</p>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3>Personal Information</h3>
                        
                        <div className="profile-field">
                            <div className="field-label">Full Name</div>
                            <div className="field-value">{userData.name}</div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">Email</div>
                            <div className="field-value">{userData.email}</div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">Phone</div>
                            <div className="field-value">{userData.phone}</div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3>Canteen Details</h3>
                        
                        <div className="profile-field">
                            <div className="field-label">Address</div>
                            <div className="field-value">{userData.address}</div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">Operating Hours</div>
                            <div className="field-value operating-hours">
                                <div className="hours-row">
                                    <span className="day-label">Monday - Friday</span>
                                    <span className="hours-value">{userData.operatingHours.weekday.start} - {userData.operatingHours.weekday.end}</span>
                                </div>
                                <div className="hours-row">
                                    <span className="day-label">Saturday</span>
                                    <span className="hours-value">{userData.operatingHours.saturday.start} - {userData.operatingHours.saturday.end}</span>
                                </div>
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
