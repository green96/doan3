// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ProfileService } from '../../services/profileService';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [txPending, setTxPending] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        email: '',
        phone: '',
        avatarHash: '',
        github: '',
        linkedin: '',
        website: ''
    });

    // Network và account change listeners
    useEffect(() => {
        if (window.ethereum) {
            const handleChainChanged = () => {
                window.location.reload();
            };
            const handleAccountsChanged = () => {
                window.location.reload();
            };

            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    // Load profile khi component mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Kiểm tra MetaMask
            if (!window.ethereum) {
                throw new Error('Please install MetaMask!');
            }

            // Yêu cầu kết nối
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Tạo provider và signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            setAddress(userAddress);

            // Tạo service và lấy profile
            const profileService = new ProfileService(signer);
            const profileData = await profileService.getProfile(userAddress);
            setProfile(profileData);

            // Cập nhật form data nếu có profile
            if (profileData.exists) {
                setFormData({
                    fullName: profileData.fullName || '',
                    bio: profileData.bio || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    avatarHash: profileData.avatarHash || '',
                    github: profileData.github || '',
                    linkedin: profileData.linkedin || '',
                    website: profileData.website || ''
                });
            }

            console.log('Profile loaded:', profileData);

        } catch (err) {
            console.error('Error loading profile:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setTxPending(true);
            setError(null);

            // Kiểm tra MetaMask
            if (!window.ethereum) {
                throw new Error('Please install MetaMask!');
            }

            // Tạo provider và signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // Tạo service và update profile
            const profileService = new ProfileService(signer);
            const receipt = await profileService.createOrUpdateProfile(formData);
            
            console.log('Transaction confirmed:', receipt);
            
            // Reload profile sau khi update
            await loadProfile();
            setIsEditing(false);
            
            alert('Profile updated successfully!');

        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setTxPending(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data về profile hiện tại
        if (profile?.exists) {
            setFormData({
                fullName: profile.fullName || '',
                bio: profile.bio || '',
                email: profile.email || '',
                phone: profile.phone || '',
                avatarHash: profile.avatarHash || '',
                github: profile.github || '',
                linkedin: profile.linkedin || '',
                website: profile.website || ''
            });
        } else {
            setFormData({
                fullName: '',
                bio: '',
                email: '',
                phone: '',
                avatarHash: '',
                github: '',
                linkedin: '',
                website: ''
            });
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <div className="error-message">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button onClick={loadProfile} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="address-display">
                <strong>Address:</strong> 
                <span className="address-text">{address}</span>
            </div>

          

            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name *</label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+84 123 456 789"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="github">GitHub</label>
                        <input
                            id="github"
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleInputChange}
                            placeholder="https://github.com/username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="linkedin">LinkedIn</label>
                        <input
                            id="linkedin"
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="website">Website</label>
                        <input
                            id="website"
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="save-btn"
                            disabled={txPending}
                        >
                            {txPending ? 'Processing...' : 'Save Profile'}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            className="cancel-btn"
                            disabled={txPending}
                        >
                            Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="form-error">
                            <p>{error}</p>
                        </div>
                    )}
                </form>
            ) : (
                <div className="profile-display">
                    {profile?.exists ? (
                        <>
                            <div className="profile-field">
                                <strong>Full Name:</strong> 
                                <span>{profile.fullName || 'Not provided'}</span>
                            </div>
                            
                            <div className="profile-field">
                                <strong>Bio:</strong> 
                                <span>{profile.bio || 'Not provided'}</span>
                            </div>
                            
                            <div className="profile-field">
                                <strong>Email:</strong> 
                                <span>{profile.email || 'Not provided'}</span>
                            </div>
                            
                            <div className="profile-field">
                                <strong>Phone:</strong> 
                                <span>{profile.phone || 'Not provided'}</span>
                            </div>
                            
                            <div className="profile-field">
                                <strong>GitHub:</strong> 
                                {profile.github ? (
                                    <a 
                                        href={profile.github} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {profile.github}
                                    </a>
                                ) : 'Not provided'}
                            </div>
                            
                            <div className="profile-field">
                                <strong>LinkedIn:</strong> 
                                {profile.linkedin ? (
                                    <a 
                                        href={profile.linkedin} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {profile.linkedin}
                                    </a>
                                ) : 'Not provided'}
                            </div>
                            
                            <div className="profile-field">
                                <strong>Website:</strong> 
                                {profile.website ? (
                                    <a 
                                        href={profile.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {profile.website}
                                    </a>
                                ) : 'Not provided'}
                            </div>
                            
                            <div className="profile-field">
                                <strong>Last Updated:</strong> 
                                <span>
                                    {profile.updatedAt 
                                        ? profile.updatedAt.toLocaleString() 
                                        : 'Never'}
                                </span>
                            </div>

                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="edit-btn"
                            >
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <div className="no-profile">
                            <p>No profile found. Create one!</p>
                            <button onClick={() => setIsEditing(true)} className="create-btn">
                                Create Profile
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;