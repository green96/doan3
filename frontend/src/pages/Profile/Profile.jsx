// frontend/src/pages/Profile/Profile.jsx
import { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { ProfileService } from "../../services/profileService";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { wallet, isConnected, connect } = useWallet();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");

  // Load profile khi wallet thay đổi
  useEffect(() => {
    if (isConnected && wallet?.address) {
      loadProfile();
    } else {
      setLoading(false);
      setProfile(null);
      setAddress("");
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

      const userAddress = wallet.address;
      setAddress(userAddress);

      const profileService = new ProfileService(wallet.signer);
      const profileData = await profileService.getProfile(userAddress);
      setProfile(profileData);

      console.log("Profile loaded:", profileData);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Never";
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return "Never";
    }
  };

  // Kiểm tra trạng thái kết nối
  if (!isConnected) {
    return (
      <div className="profile-container">
        <div className="connect-prompt">
          <h3>🔗 Connect Your Wallet</h3>
          <p>Please connect your wallet to view and manage your profile.</p>
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
          <h3>⚠️ Error</h3>
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
      <div className="profile-header">
        <h2>👤 Profile</h2>
        <button 
          onClick={loadProfile} 
          className="refresh-btn"
          disabled={loading}
          title="Refresh profile"
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>
      
      <div className="address-display">
        <strong>Wallet Address:</strong>
        <span className="address-text">{address}</span>
      </div>

      <div className="profile-display">
        {profile?.exists ? (
          <>
            <div className="profile-field">
              <strong>Full Name:</strong>
              <span>{profile.fullName || "Not provided"}</span>
            </div>

            <div className="profile-field">
              <strong>Bio:</strong>
              <span>{profile.bio || "Not provided"}</span>
            </div>

            <div className="profile-field">
              <strong>Email:</strong>
              <span>{profile.email || "Not provided"}</span>
            </div>

            <div className="profile-field">
              <strong>Phone:</strong>
              <span>{profile.phone || "Not provided"}</span>
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
              ) : (
                "Not provided"
              )}
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
              ) : (
                "Not provided"
              )}
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
              ) : (
                "Not provided"
              )}
            </div>

            <div className="profile-field">
              <strong>Last Updated:</strong>
              <span>{formatDate(profile.updatedAt)}</span>
            </div>

            <Link to="/editprofile" className="edit-btn">
              ✏️ Edit Profile
            </Link>
          </>
        ) : (
          <div className="no-profile">
            <p>📝 No profile found. Create one!</p>
            <Link to="/editprofile" className="create-btn">
              Create Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;