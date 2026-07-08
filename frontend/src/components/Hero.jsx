// frontend/src/components/Hero.jsx
import { useWallet } from '../context/WalletContext'
import { FaEthereum, FaRocket, FaShieldAlt, FaChartLine } from 'react-icons/fa'
import './Hero.css'

function Hero() {
  const { isConnected, connect, isConnecting } = useWallet()

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Decentralized Portfolio
        </div>
        
        <h1 className="hero-title">
          Manage Your <span>Crypto Portfolio</span>
          <br />On the Blockchain
        </h1>
        
        <p className="hero-description">
          Track, analyze, and manage all your digital assets in one place.
          Fully decentralized, secure, and transparent.
        </p>

        <div className="hero-actions">
          {!isConnected ? (
            <button 
              className="hero-btn-primary"
              onClick={connect}
              disabled={isConnecting}
            >
              <FaEthereum />
              {isConnecting ? 'Connecting...' : 'Connect Wallet to Start'}
            </button>
          ) : (
            <button className="hero-btn-primary">
              <FaRocket />
              Go to Dashboard
            </button>
          )}
          
          <a href="#features" className="hero-btn-secondary">
            Learn More
            <span>→</span>
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">$2.4B</span>
            <span className="stat-label">Total Value Locked</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">150K+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Supported Chains</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="floating-card card-1">
          <FaChartLine />
          <span>+24.5%</span>
        </div>
        <div className="floating-card card-2">
          <FaShieldAlt />
          <span>Secure</span>
        </div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
    </section>
  )
}

export default Hero