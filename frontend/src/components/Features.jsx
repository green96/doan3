// frontend/src/components/Features.jsx
import { FaWallet, FaChartPie, FaShieldAlt, FaRocket } from 'react-icons/fa'
import './Features.css'

function Features() {
  const features = [
    {
      icon: <FaWallet />,
      title: 'Multi-Wallet Support',
      description: 'Connect and manage multiple wallets across different blockchains'
    },
    {
      icon: <FaChartPie />,
      title: 'Portfolio Analytics',
      description: 'Real-time tracking of your assets with detailed analytics and charts'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure & Decentralized',
      description: 'Your data is stored on the blockchain. Full ownership and control'
    },
    {
      icon: <FaRocket />,
      title: 'Cross-Chain Support',
      description: 'Support for Ethereum, Polygon, BSC, and more networks'
    }
  ]

  return (
    <section id="features" className="features">
      <div className="features-header">
        <h2>Why Choose DeFi Portfolio?</h2>
        <p>Everything you need to manage your digital assets</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features