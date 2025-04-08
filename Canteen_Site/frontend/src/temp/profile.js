document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    const logoutBtn = document.getElementById('logoutBtn');
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    const profilePhoto = document.querySelector('.profile-photo img');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const changePasswordBtn = document.querySelector('.change-password-btn');

    // Create a hidden file input for image upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Side Menu Toggle
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            sideMenu.classList.add('active');
            sideMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', closeMenu);
    }

    function closeMenu() {
        sideMenu.classList.remove('active');
        sideMenuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Photo Change Functionality
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }

    // Handle file selection
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }

            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Please select an image smaller than 5MB');
                return;
            }

            // Read and display the selected image
            const reader = new FileReader();
            reader.onload = function(e) {
                // Update profile image in the UI
                profilePhoto.src = e.target.result;
                
                // Also update in the side menu and top nav if they exist
                const menuUserAvatar = document.querySelector('.menu-user-avatar img');
                const topNavAvatar = document.querySelector('.user-avatar img');
                
                if (menuUserAvatar) {
                    menuUserAvatar.src = e.target.result;
                }
                
                if (topNavAvatar) {
                    topNavAvatar.src = e.target.result;
                }

                // Save the image to localStorage
                saveProfileImage(e.target.result);
                
                // Show success message
                showNotification('Profile photo updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    });

    // Save profile image to localStorage
    function saveProfileImage(imageData) {
        const currentUser = sessionStorage.getItem('current_user');
        if (currentUser) {
            const userKey = `user_${currentUser}`;
            let userData = JSON.parse(localStorage.getItem(userKey));
            
            if (userData) {
                userData.profilePicture = imageData;
                localStorage.setItem(userKey, JSON.stringify(userData));
            }
        }
    }

    // Show notification message
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
        }
        
        document.body.appendChild(notification);
        
        // Auto dismiss after 3 seconds
        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Edit Profile Button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // For now, just showing a message
            showNotification('Edit profile functionality will be implemented soon!', 'info');
        });
    }

    // Change Password Button
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            // For now, just showing a message
            showNotification('Change password functionality will be implemented soon!', 'info');
        });
    }
    
    // Logout Functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear user data from sessionStorage
            sessionStorage.removeItem('current_user');
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Load user data
    function loadUserData() {
        const currentUser = sessionStorage.getItem('current_user');
        if (currentUser) {
            const userKey = `user_${currentUser}`;
            const userData = JSON.parse(localStorage.getItem(userKey));
            
            if (userData) {
                // Update profile fields
                document.querySelectorAll('.profile-field-value').forEach((field, index) => {
                    if (index === 0) field.textContent = userData.username || userData.name || currentUser;
                    if (index === 1 && userData.email) field.textContent = userData.email;
                    if (index === 2 && userData.phone) field.textContent = userData.phone;
                    if (index === 3 && userData.address) field.textContent = userData.address;
                });
                
                // Update profile photo if available
                if (userData.profilePicture && profilePhoto) {
                    profilePhoto.src = userData.profilePicture;
                    
                    // Also update in the side menu and top nav if they exist
                    const menuUserAvatar = document.querySelector('.menu-user-avatar img');
                    const topNavAvatar = document.querySelector('.user-avatar img');
                    
                    if (menuUserAvatar) {
                        menuUserAvatar.src = userData.profilePicture;
                    }
                    
                    if (topNavAvatar) {
                        topNavAvatar.src = userData.profilePicture;
                    }
                }
            }
        }
    }

    // Load user data on page load
    loadUserData();
});