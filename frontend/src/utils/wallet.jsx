// frontend/src/utils/wallet.jsx
import { ethers } from "ethers";

export async function connectWallet() {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask");
        return null;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        return {
            provider,
            signer,
            address,
            network: network.name,
            chainId: Number(network.chainId)
        };
    } catch (error) {
        console.error("Error connecting wallet:", error);
        throw new Error(error.message || "Failed to connect wallet");
    }
}

// Thêm hàm disconnectWallet
export function disconnectWallet() {
    // MetaMask không có hàm disconnect chính thức
    // Chúng ta chỉ cần xóa state và localStorage
    localStorage.removeItem('walletAddress');
    // Có thể thêm logic khác nếu cần
}

// Thêm hàm getBalance
export async function getBalance(provider, address) {
    try {
        const balance = await provider.getBalance(address);
        const formatted = ethers.formatEther(balance);
        return {
            raw: balance,
            formatted: parseFloat(formatted).toFixed(4),
            unit: 'ETH'
        };
    } catch (error) {
        console.error("Error getting balance:", error);
        return null;
    }
}

// Thêm hàm formatAddress
export function formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}