const crypto = require('crypto');

class IPFSService {
  constructor() {
    // Simplified IPFS service for development
    this.storage = new Map();
    this.gatewayUrl = 'https://ipfs.io/ipfs/';
  }

  // Generate a mock IPFS hash
  generateMockHash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data));
    return 'Qm' + hash.digest('hex').substring(0, 44);
  }

  // Upload mission details to IPFS (mock implementation)
  async uploadMissionDetails(missionData) {
    try {
      const hash = this.generateMockHash(missionData);
      this.storage.set(hash, missionData);
      
      console.log('📤 Mission details uploaded to IPFS:', hash);
      
      return {
        hash,
        url: `${this.gatewayUrl}${hash}`,
        success: true
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload to IPFS');
    }
  }

  // Upload proof to IPFS (mock implementation)
  async uploadProof(proofData) {
    try {
      const hash = this.generateMockHash(proofData);
      this.storage.set(hash, proofData);
      
      console.log('📤 Proof uploaded to IPFS:', hash);
      
      return {
        hash,
        url: `${this.gatewayUrl}${hash}`,
        success: true
      };
    } catch (error) {
      console.error('IPFS proof upload error:', error);
      throw new Error('Failed to upload proof to IPFS');
    }
  }

  // Upload venue details to IPFS (mock implementation)
  async uploadVenueDetails(venueData) {
    try {
      const hash = this.generateMockHash(venueData);
      this.storage.set(hash, venueData);
      
      console.log('📤 Venue details uploaded to IPFS:', hash);
      
      return {
        hash,
        url: `${this.gatewayUrl}${hash}`,
        success: true
      };
    } catch (error) {
      console.error('IPFS venue upload error:', error);
      throw new Error('Failed to upload venue to IPFS');
    }
  }

  // Fetch data from IPFS (mock implementation)
  async fetchFromIPFS(hash) {
    try {
      const data = this.storage.get(hash);
      if (!data) {
        throw new Error('Data not found in IPFS');
      }
      
      console.log('📥 Data fetched from IPFS:', hash);
      return data;
    } catch (error) {
      console.error('IPFS fetch error:', error);
      throw new Error('Failed to fetch from IPFS');
    }
  }

  // Pin content to Pinata (mock implementation)
  async pinToPinata(hash, data) {
    try {
      console.log('📌 Content pinned to Pinata:', hash);
      return { success: true, hash };
    } catch (error) {
      console.error('Pinata pin error:', error);
      // Don't throw error for pinning failures
      return { success: false, error: error.message };
    }
  }

  // Get public gateway URL
  getGatewayUrl(hash) {
    return `${this.gatewayUrl}${hash}`;
  }

  // Validate IPFS hash format
  isValidHash(hash) {
    return hash && hash.startsWith('Qm') && hash.length === 46;
  }

  // Upload file (mock implementation)
  async uploadFile(buffer, filename) {
    try {
      const data = {
        content: buffer.toString('base64'),
        filename,
        timestamp: new Date().toISOString()
      };
      
      const hash = this.generateMockHash(data);
      this.storage.set(hash, data);
      
      console.log('📤 File uploaded to IPFS:', filename, hash);
      
      return {
        hash,
        url: `${this.gatewayUrl}${hash}`,
        success: true
      };
    } catch (error) {
      console.error('IPFS file upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  // Get file as buffer (mock implementation)
  async getFile(hash) {
    try {
      const data = this.storage.get(hash);
      if (!data) {
        throw new Error('File not found in IPFS');
      }
      
      if (data.content) {
        return Buffer.from(data.content, 'base64');
      }
      
      return Buffer.from(JSON.stringify(data));
    } catch (error) {
      console.error('IPFS get file error:', error);
      throw new Error('Failed to get file from IPFS');
    }
  }
}

module.exports = new IPFSService();
