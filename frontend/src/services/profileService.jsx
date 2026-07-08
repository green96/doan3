// frontend/src/services/profileService.js
import { ethers } from 'ethers';
import ProfileABI from '../contracts/ProfileABI.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x...';

export class ProfileService {
    constructor(signer) {
        this.signer = signer;
        this.provider = signer.provider;
        
        // ✅ Không gọi async trong constructor
        // Lưu địa chỉ gốc để xử lý sau
        this.rawAddress = CONTRACT_ADDRESS;
        this.contractAddress = null;
        this.initialized = false;
        
        // Tạo Interface từ ABI
        this.interface = new ethers.Interface(ProfileABI.abi);
        
        // Khởi tạo địa chỉ contract một cách synchronous
        this._initAddressSync();
        
        console.log('Raw Contract Address:', this.rawAddress);
        console.log('Contract Address:', this.contractAddress);
        console.log('Interface created successfully');
    }

    // ✅ Khởi tạo địa chỉ synchronous
    _initAddressSync() {
        try {
            // Nếu là ENS name (chứa '.'), giữ nguyên để resolve sau
            if (this.rawAddress.includes('.')) {
                this.contractAddress = this.rawAddress;
                this.initialized = true;
                return;
            }

            // Nếu là địa chỉ hex, thử checksum nhưng bỏ qua lỗi
            try {
                this.contractAddress = ethers.getAddress(this.rawAddress);
                this.initialized = true;
            } catch (error) {
                console.warn('Invalid address format, using raw address:', error);
                this.contractAddress = this.rawAddress;
                this.initialized = true;
            }
        } catch (error) {
            console.error('Error initializing address:', error);
            this.contractAddress = this.rawAddress;
            this.initialized = true;
        }
    }

    // ✅ Resolve ENS nếu cần (gọi khi cần thiết)
    async _resolveEnsIfNeeded() {
        // Nếu đã có địa chỉ checksum và không phải ENS, không cần resolve
        if (this.contractAddress && !this.contractAddress.includes('.')) {
            return this.contractAddress;
        }

        // Nếu là ENS name, resolve
        if (this.contractAddress && this.contractAddress.includes('.')) {
            try {
                const resolved = await this.provider.resolveName(this.contractAddress);
                if (resolved) {
                    this.contractAddress = resolved;
                    console.log('ENS resolved to:', this.contractAddress);
                    return this.contractAddress;
                }
            } catch (error) {
                console.warn('ENS resolution failed, using raw address:', error);
                // Không throw error, tiếp tục với địa chỉ raw
            }
        }

        // Fallback: sử dụng địa chỉ raw
        return this.rawAddress;
    }

    // Helper để gọi view/pure functions
    async _call(methodName, args = []) {
        try {
            // Resolve ENS nếu cần
            const contractAddress = await this._resolveEnsIfNeeded();
            
            const data = this.interface.encodeFunctionData(methodName, args);
            
            const result = await this.provider.call({
                to: contractAddress,
                data: data
            });
            
            const decoded = this.interface.decodeFunctionResult(methodName, result);
            return decoded.length === 1 ? decoded[0] : decoded;
        } catch (error) {
            console.error(`Error calling ${methodName}:`, error);
            throw error;
        }
    }

    // Helper để gửi transaction
    async _send(methodName, args = []) {
        try {
            // Resolve ENS nếu cần
            const contractAddress = await this._resolveEnsIfNeeded();
            
            const data = this.interface.encodeFunctionData(methodName, args);
            
            const tx = await this.signer.sendTransaction({
                to: contractAddress,
                data: data
            });
            
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error(`Error sending ${methodName}:`, error);
            throw error;
        }
    }

    // Tạo hoặc cập nhật profile
    async createOrUpdateProfile(profileData) {
        return this._send('createOrUpdateProfile', [
            profileData.fullName || '',
            profileData.bio || '',
            profileData.email || '',
            profileData.phone || '',
            profileData.avatarHash || '',
            profileData.github || '',
            profileData.linkedin || '',
            profileData.website || ''
        ]);
    }

    // Lấy profile
    async getProfile(address) {
        try {
            const result = await this._call('getProfile', [address]);
            
            // result là array với 10 phần tử
            return {
                fullName: result[0] || '',
                bio: result[1] || '',
                email: result[2] || '',
                phone: result[3] || '',
                avatarHash: result[4] || '',
                github: result[5] || '',
                linkedin: result[6] || '',
                website: result[7] || '',
                updatedAt: result[8] ? new Date(Number(result[8]) * 1000) : null,
                exists: result[9] || false
            };
        } catch (error) {
            console.error('Error getting profile:', error);
            // Trả về profile rỗng nếu chưa có
            return {
                fullName: '',
                bio: '',
                email: '',
                phone: '',
                avatarHash: '',
                github: '',
                linkedin: '',
                website: '',
                updatedAt: null,
                exists: false
            };
        }
    }

    // Cập nhật avatar
    async updateAvatar(avatarHash) {
        return this._send('updateAvatar', [avatarHash]);
    }

    // Kiểm tra profile tồn tại
    async profileExists(address) {
        try {
            return await this._call('profileExists', [address]);
        } catch (error) {
            console.error('Error checking profile existence:', error);
            return false;
        }
    }
}