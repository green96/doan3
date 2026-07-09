// frontend/src/services/ProfileService.js
export class ProfileService {
  constructor(contract) {
    this.contract = contract;
  }

  // Lấy profile từ blockchain
  async getProfile(address) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      // Kiểm tra profile tồn tại
      const exists = await this.contract.profileExists(address);
      
      if (!exists) {
        return null;
      }

      // Lấy dữ liệu profile
      const profileData = await this.contract.getProfile(address);
      
      return {
        fullName: profileData[0],
        bio: profileData[1],
        email: profileData[2],
        phone: profileData[3],
        avatarHash: profileData[4],
        github: profileData[5],
        linkedin: profileData[6],
        website: profileData[7],
        updatedAt: new Date(Number(profileData[8]) * 1000).toLocaleString('vi-VN'),
        exists: profileData[9],
        address: address
      };
    } catch (error) {
      console.error('Error fetching profile from blockchain:', error);
      throw error;
    }
  }

  // Tạo hoặc cập nhật profile
  async createOrUpdateProfile(profileData) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      // Validate dữ liệu
      if (!profileData.fullName || profileData.fullName.trim() === '') {
        throw new Error('Full name is required');
      }

      console.log('Sending transaction to blockchain...');
      
      // Gửi transaction lên blockchain
      const tx = await this.contract.createOrUpdateProfile(
        profileData.fullName.trim(),
        profileData.bio || '',
        profileData.email || '',
        profileData.phone || '',
        profileData.avatarHash || '',
        profileData.github || '',
        profileData.linkedin || '',
        profileData.website || ''
      );
      
      console.log('Transaction sent, waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed! Hash:', receipt.hash);
      
      return receipt;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Cập nhật avatar
  async updateAvatar(avatarHash) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      if (!avatarHash || avatarHash.trim() === '') {
        throw new Error('Avatar hash is required');
      }

      const tx = await this.contract.updateAvatar(avatarHash.trim());
      const receipt = await tx.wait();
      
      console.log('Avatar updated! Hash:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  // Kiểm tra profile tồn tại
  async profileExists(address) {
    try {
      if (!this.contract) {
        return false;
      }
      return await this.contract.profileExists(address);
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
  }

  // Lấy tất cả profiles (không có API nên trả về mảng rỗng)
  async getAllProfiles() {
    return [];
  }

  // Format địa chỉ
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Kiểm tra xem có phải là địa chỉ hợp lệ không
  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}