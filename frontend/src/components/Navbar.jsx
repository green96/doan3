// frontend/src/components/Navbar.jsx
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatAddress } from '../utils/wallet';
import {
    FaWallet,
    FaUser,
    FaSignOutAlt,
    FaHome,
    FaUserCircle,
    FaInfoCircle,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const { wallet, isConnected, connect, disconnect, isConnecting } = useWallet();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const handleAboutPage = (e) => {
        e.preventDefault();
        if (!isConnected) {
            alert('Please connect your wallet first!');
            return;
        }
        closeMenu();
        navigate('/aboutpage');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo */}
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <img src="/logo.svg" alt="Logo" />
                    <span>Web3 Portfolio</span>
                </Link>

                {/* Nav links */}
                <div className={`nav-links${menuOpen ? ' open' : ''}`}>
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                        onClick={closeMenu}
                    >
                        <FaHome /> Home
                    </Link>

                    {/* About — dùng <a> thường để tránh lỗi Link thiếu prop "to" */}
                    <a
                        href="/aboutpage"
                        onClick={handleAboutPage}
                        className={location.pathname === '/aboutpage' ? 'active' : ''}
                    >
                        <FaInfoCircle /> About
                    </a>

                    {isConnected && (
                        <>
                            <Link
                                to="/profile"
                                className={location.pathname === '/profile' ? 'active' : ''}
                                onClick={closeMenu}
                            >
                                <FaUserCircle /> My Profile
                            </Link>
                            <Link
                                to="/sendcv"
                                className={location.pathname === '/sendcv' ? 'active' : ''}
                                onClick={closeMenu}
                            >
                                <FaUserCircle /> Send CV
                            </Link>
                        </>
                    )}

                    <a href="#features" onClick={closeMenu}>Features</a>
                </div>

                {/* Wallet + Hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="nav-wallet">
                        {!isConnected ? (
                            <button
                                className="connect-btn"
                                onClick={connect}
                                disabled={isConnecting}
                            >
                                <FaWallet />
                                <span className="btn-text">
                                    {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                                </span>
                            </button>
                        ) : (
                            <div className="wallet-info">
                                <div className="wallet-address">
                                    <FaUser />
                                    <span>{formatAddress(wallet?.address)}</span>
                                </div>
                                <button
                                    className="disconnect-btn"
                                    onClick={disconnect}
                                    title="Disconnect Wallet"
                                >
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger — chỉ hiện trên mobile */}
                    <button
                        className={`nav-hamburger${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
