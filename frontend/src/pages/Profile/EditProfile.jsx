// frontend/src/pages/Profile/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { ProfileService } from '../../services/ProfileService';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { account, contract, isConnected, loading, setLoading, error, setError } = useWallet();
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
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    } else if (contract) {
      loadExistingProfile();
    }
  }, [isConnected, contract]);

  const loadExistingProfile = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const profileService = new ProfileService(contract);
      const profileData = await profileService.getProfile(account);
      
      if (profileData) {
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
        setIsEditMode(true);
      }
    } catch (err) {
      setError('Failed to load profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contract) return;

    try {
      setLoading(true);
      const profileService = new ProfileService(contract);
      
      // Thêm address vào data
      const dataWithAddress = {
        ...formData,
        address: account
      };
      
      await profileService.createOrUpdateProfile(dataWithAddress);
      
      alert(isEditMode ? '✅ Profile updated successfully!' : '✅ Profile created successfully!');
      navigate('/profile');
    } catch (err) {
      setError('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <button onClick={() => navigate('/profile')} className="back-btn">
        ← Back to Profile
      </button>

      <div className="edit-profile-card">
        <h2>{isEditMode ? '✏️ Edit Profile' : '✨ Create Profile'}</h2>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+84 123 456 789"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Avatar Hash (IPFS)</label>
            <input
              type="text"
              name="avatarHash"
              value={formData.avatarHash}
              onChange={handleChange}
              placeholder="Qm... (IPFS hash)"
            />
            <small>Upload image to IPFS and paste the hash here</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub Username</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="username"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn Username</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '⏳ Saving...' : isEditMode ? '💾 Update Profile' : '🚀 Create Profile'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/profile')} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;