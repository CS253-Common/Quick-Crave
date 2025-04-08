import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/canteen_verification.css'; // Import the CSS file for styling

const CanteenVerification = () => {
    const [file, setFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
            } else {
                alert('Please upload a valid PDF file.');
                fileInputRef.current.value = null;
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please upload a PDF file for verification.');
            return;
        }

        // Simulate file upload with progress
        setIsUploading(true);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setIsSubmitted(true);
                    setTimeout(() => {
                        alert('Verification request sent successfully!');
                        navigate('/login'); // Redirect to login page after submission
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div className="container">
            <div className="background-image"></div>
            <div className="verification-container">
            <Link to="/customer-home" className="logo-link">
              <div className="logo-container">
                  <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                  <h1 className="logo-text">
                      <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                  </h1>
              </div>
            </Link>
                
                <div className="verification-content">
                    <h2>Canteen Verification</h2>
                    <p className="verification-description">
                        To ensure the quality and legitimacy of your canteen business, please upload your business license or any official documentation for verification.
                    </p>
                    
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group file-upload-container">
                                <label htmlFor="verification-file" className="file-upload-label">
                                    <div className="upload-icon">
                                        <i className="fa fa-cloud-upload"></i>
                                    </div>
                                    <div className="upload-text">
                                        <span className="primary-text">Upload Verification Document</span>
                                        <span className="secondary-text">PDF format only, maximum 5MB</span>
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="verification-file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="file-input"
                                    required
                                />
                            </div>
                            
                            {file && (
                                <div className="selected-file">
                                    <div className="file-info">
                                        <div className="file-icon">📄</div>
                                        <div className="file-details">
                                            <p className="file-name">{file.name}</p>
                                            <p className="file-size">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {isUploading && (
                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{uploadProgress}% Uploaded</span>
                                </div>
                            )}
                            
                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={isUploading || !file}
                                >
                                    {isUploading ? 'Uploading...' : 'Request Verification'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => navigate('/signup')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="success-message-container">
                            <div className="success-icon">✓</div>
                            <p className="success-message">Verification request sent successfully!</p>
                            <p className="success-description">
                                Your verification documents have been submitted for review. 
                                We'll notify you once your account is verified.
                            </p>
                            <div className="redirect-message">Redirecting to login...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CanteenVerification;