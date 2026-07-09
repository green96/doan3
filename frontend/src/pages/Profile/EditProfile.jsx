// frontend/src/pages/Profile/EditProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { ProfileService } from "../../services/profileService";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const { wallet, isConnected, connect } = useWallet();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    email: "",
    phone: "",
    avatarHash: "",
    github: "",
    linkedin: "",
    website: "",
  });

  // Load profile khi component mount
  useEffect(() => {
    if (isConnected && wallet?.address) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [wallet?.address, isConnected]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isConnected || !wallet?.address) {
        await connect();
        return;
      }

      if (!wallet.signer) {
        throw new Error("No signer available");
      }

      const profileService = new ProfileService(wallet.signer);
      const profileData = await profileService.getProfile(wallet.address);
      setProfile(profileData);

      // Cập nhật form data nếu có profile
      if (profileData.exists) {
        setFormData({
          fullName: profileData.fullName || "",
          bio: profileData.bio || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          avatarHash: profileData.avatarHash || "",
          github: profileData.github || "",
          linkedin: profileData.linkedin || "",
          website: profileData.website || "",
        });
      }

      console.log("Profile loaded for editing:", profileData);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      if (!isConnected || !wallet?.signer) {
        await connect();
        return;
      }

      // Validate required fields
      if (!formData.fullName.trim()) {
        throw new Error("Full name is required");
      }

      const profileService = new ProfileService(wallet.signer);
      const receipt = await profileService.createOrUpdateProfile(formData);

      console.log("Transaction confirmed:", receipt);

      // Chuyển về profile page sau khi save thành công
      alert("Profile saved successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  // Kiểm tra trạng thái kết nối
  if (!isConnected) {
    return (
      <div className="edit-profile-container">
        <div className="connect-prompt">
          <h3>🔗 Connect Your Wallet</h3>
          <p>Please connect your wallet to edit your profile.</p>
          <button 
            onClick={connect} 
            className="connect-btn"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="edit-profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h2>{profile?.exists ? "✏️ Edit Profile" : "📝 Create Profile"}</h2>
        <button onClick={handleCancel} className="cancel-btn" disabled={saving}>
          Cancel
        </button>
      </div>

      <div className="address-display">
        <strong>Wallet Address:</strong>
        <span className="address-text">{wallet?.address}</span>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn" 
            disabled={saving}
          >
            {saving ? "⏳ Saving..." : "💾 Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;