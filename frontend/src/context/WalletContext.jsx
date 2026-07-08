// frontend/src/context/WalletContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { connectWallet, disconnectWallet, getBalance } from '../utils/wallet'
import toast from 'react-hot-toast'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if wallet was previously connected
    const savedWallet = localStorage.getItem('walletAddress')
    if (savedWallet) {
      // Auto-connect logic here if needed
      console.log('Previously connected wallet:', savedWallet)
    }

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      disconnect()
      toast.info('Wallet disconnected')
    } else if (accounts[0] !== wallet?.address) {
      // Account changed
      connect()
    }
  }

  const handleChainChanged = () => {
    // Reload page on chain change
    window.location.reload()
  }

  const connect = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const result = await connectWallet()
      if (result) {
        setWallet(result)
        localStorage.setItem('walletAddress', result.address)
        
        // Get balance
        const balanceData = await getBalance(result.provider, result.address)
        setBalance(balanceData)
        
        toast.success('Wallet connected successfully!')
        return result
      }
    } catch (err) {
      console.error('Connection error:', err)
      setError(err.message || 'Failed to connect wallet')
      toast.error(err.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setWallet(null)
    setBalance(null)
    localStorage.removeItem('walletAddress')
    toast.success('Wallet disconnected')
  }

  const value = {
    wallet,
    balance,
    isConnecting,
    error,
    connect,
    disconnect,
    isConnected: !!wallet
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}