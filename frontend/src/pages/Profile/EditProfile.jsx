// frontend/src/pages/Profile/EditProfile.jsx
import { useState, useRef } from 'react';
import { uploadImageToIPFS, uploadToIPFS } from '../../services/ipfs';
import { ProfileService } from '../../services/profileService';
import { FaUser, FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './EditProfile.css';

function EditProfile({ profile, onSave, onCancel, wallet }) {
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        bio: profile?.bio || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        avatarHash: profile?.avatarHash || '',
        github: profile?.github || '',
        linkedin: profile?.linkedin || '',
        website: profile?.website || ''
    });
    
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        profile?.avatarHash ? `https://ipfs.io/ipfs/${profile.avatarHash}` : null
    );
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let avatarHash = formData.avatarHash;

            // Upload avatar to IPFS if changed
            if (avatarFile) {
                const result = await uploadImageToIPFS(avatarFile);
                avatarHash = result.hash;
            }

            // Upload profile data to IPFS
            const profileData = {
                ...formData,
                avatarHash,
                walletAddress: wallet.address,
                updatedAt: new Date().toISOString()
            };

            const ipfsResult = await uploadToIPFS(profileData);
            
            // Save to blockchain
            const profileService = new ProfileService(wallet.signer);
            await profileService.createOrUpdateProfile({
                ...formData,
                avatarHash
            });

            toast.success('Profile saved to blockchain and IPFS!');
            onSave();

        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-card">
                <h2>Edit Profile</h2>
                <p className="edit-subtitle">Your data will be stored on IPFS and blockchain</p>

                <form onSubmit={handleSubmit} className="edit-form">
                    {/* Avatar Upload */}
                    <div className="form-group avatar-upload">
                        <div className="avatar-preview" onClick={() => fileInputRef.current.click()}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <FaUser />
                                    <span>Upload Avatar</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <p className="avatar-hint">Click to upload avatar (PNG, JPG, GIF)</p>
                    </div>

                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name *</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div className="form-group">
                        <label htmlFor="bio">Bio / About</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                            rows={4}
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                        />
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label htmlFor="phone">
                            <FaPhone /> Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+84 123 456 789"
                        />
                    </div>

                    {/* GitHub */}
                    <div className="form-group">
                        <label htmlFor="github">
                            <FaGithub /> GitHub
                        </label>
                        <input
                            type="url"
                            id="github"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            placeholder="https://github.com/username"
                        />
                    </div>

                    {/* LinkedIn */}
                    <div className="form-group">
                        <label htmlFor="linkedin">
                            <FaLinkedin /> LinkedIn
                        </label>
                        <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>

                    {/* Website */}
                    <div className="form-group">
                        <label htmlFor="website">
                            <FaGlobe /> Website
                        </label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                            {!loading && <span>→</span>}
                        </button>
                    </div>
                </form>

                <div className="storage-info">
                    <div className="info-item">
                        <span className="info-label">🔗 Blockchain</span>
                        <span className="info-desc">Profile data stored on-chain</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">📦 IPFS</span>
                        <span className="info-desc">Images & large data stored decentralized</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;