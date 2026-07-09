// frontend/src/context/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ProfileABI from '.././contracts/ProfileABI.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xYourContractAddressHere';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kiểm tra kết nối khi component mount
  useEffect(() => {
    checkConnection();
    
    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            ProfileABI.abi,
            signer
          );

          setProvider(provider);
          setSigner(signer);
          setContract(contract);
          setAccount(address);
          setIsConnected(true);
          
          // Lắng nghe sự kiện
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);
        }
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        setLoading(true);
        setError('');
        
        // Yêu cầu kết nối
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ProfileABI.abi,
          signer
        );

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(address);
        setIsConnected(true);

        console.log('✅ Connected to MetaMask');
        return address;
      } else {
        setError('❌ Please install MetaMask!');
        return null;
      }
    } catch (err) {
      console.error('Connection error:', err);
      if (err.code === 4001) {
        setError('❌ User rejected the connection request');
      } else {
        setError('❌ Failed to connect wallet: ' + err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setIsConnected(false);
      setAccount('');
      setProvider(null);
      setSigner(null);
      setContract(null);
    } else {
      // Account changed
      setAccount(accounts[0]);
      updateContract(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload page when chain changes
    window.location.reload();
  };

  const updateContract = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ProfileABI.abi,
        signer
      );
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    } catch (err) {
      console.error('Failed to update contract:', err);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount('');
    setProvider(null);
    setSigner(null);
    setContract(null);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        isConnected,
        loading,
        error,
        setLoading,
        setError,
        connectWallet,
        disconnectWallet,
        CONTRACT_ADDRESS
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};