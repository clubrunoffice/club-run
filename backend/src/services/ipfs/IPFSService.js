const { create } = require('ipfs-http-client');
const FormData = require('form-data');
const fetch = require('node-fetch');

class IPFSService {
  constructor() {
    // Initialize IPFS client with Infura or Pinata
    this.client = create({
      host: process.env.IPFS_HOST || 'ipfs.infura.io',
      port: process.env.IPFS_PORT || 5001,
      protocol: process.env.IPFS_PROTOCOL || 'https',
      headers: process.env.INFURA_PROJECT_ID ? {
        authorization: `Basic ${Buffer.from(
          `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_SECRET}`
        ).toString('base64')}`
      } : undefined
    });

    // Pinata configuration for backup
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretKey = process.env.PINATA_SECRET_KEY;
  }

  /**
   * Upload mission details to IPFS
   */
  async uploadMissionDetails(missionData) {
    try {
      const missionManifest = {
        title: missionData.title,
        description: missionData.description,
        venueAddress: missionData.venueAddress,
        eventType: missionData.eventType,
        requirements: missionData.requirements || [],
        budget: missionData.budget,
        deadline: missionData.deadline,
        paymentMethod: missionData.paymentMethod,
        curator: missionData.curator,
        created: new Date().toISOString(),
        version: '1.0'
      };

      const result = await this.client.add(JSON.stringify(missionManifest));
      
      // Also pin to Pinata for redundancy
      if (this.pinataApiKey) {
        await this.pinToPinata(result.path, missionManifest);
      }

      return result.path; // Returns IPFS hash
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload mission details to IPFS');
    }
  }

  /**
   * Upload proof of completion to IPFS
   */
  async uploadProof(proofData) {
    try {
      const uploadedFiles = [];
      
      // Upload photos
      if (proofData.photos && proofData.photos.length > 0) {
        for (const photo of proofData.photos) {
          const result = await this.client.add(photo.buffer, {
            pin: true
          });
          uploadedFiles.push({
            type: 'photo',
            hash: result.path,
            filename: photo.originalname
          });
        }
      }

      // Upload audio if provided
      let audioHash = null;
      if (proofData.audio) {
        const audioResult = await this.client.add(proofData.audio.buffer, {
          pin: true
        });
        audioHash = audioResult.path;
      }

      // Create proof manifest
      const proofManifest = {
        photos: uploadedFiles,
        audio: audioHash,
        notes: proofData.notes,
        timestamp: proofData.timestamp || Date.now(),
        location: proofData.location,
        runner: proofData.runner,
        missionId: proofData.missionId,
        verified: true,
        version: '1.0'
      };

      const result = await this.client.add(JSON.stringify(proofManifest));
      
      // Pin to Pinata for redundancy
      if (this.pinataApiKey) {
        await this.pinToPinata(result.path, proofManifest);
      }

      return result.path;
    } catch (error) {
      console.error('IPFS proof upload error:', error);
      throw new Error('Failed to upload proof to IPFS');
    }
  }

  /**
   * Upload venue details to IPFS
   */
  async uploadVenueDetails(venueData) {
    try {
      const venueManifest = {
        name: venueData.name,
        address: venueData.address,
        city: venueData.city,
        state: venueData.state,
        zipCode: venueData.zipCode,
        coordinates: {
          latitude: venueData.latitude,
          longitude: venueData.longitude
        },
        type: venueData.type,
        hours: venueData.hours,
        phoneNumber: venueData.phoneNumber,
        website: venueData.website,
        checkInReward: venueData.checkInReward,
        crowdLevel: venueData.crowdLevel,
        safetyRating: venueData.safetyRating,
        avgCost: venueData.avgCost,
        amenities: venueData.amenities,
        created: new Date().toISOString(),
        version: '1.0'
      };

      const result = await this.client.add(JSON.stringify(venueManifest));
      
      if (this.pinataApiKey) {
        await this.pinToPinata(result.path, venueManifest);
      }

      return result.path;
    } catch (error) {
      console.error('IPFS venue upload error:', error);
      throw new Error('Failed to upload venue details to IPFS');
    }
  }

  /**
   * Fetch data from IPFS
   */
  async fetchFromIPFS(hash) {
    try {
      const stream = this.client.cat(hash);
      let data = '';
      
      for await (const chunk of stream) {
        data += new TextDecoder().decode(chunk);
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('IPFS fetch error:', error);
      
      // Try fetching from Pinata as fallback
      if (this.pinataApiKey) {
        try {
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
          if (response.ok) {
            return await response.json();
          }
        } catch (pinataError) {
          console.error('Pinata fallback error:', pinataError);
        }
      }
      
      throw new Error('Failed to fetch data from IPFS');
    }
  }

  /**
   * Pin data to Pinata for redundancy
   */
  async pinToPinata(hash, data) {
    try {
      const formData = new FormData();
      formData.append('hashToPin', hash);
      formData.append('pinataMetadata', JSON.stringify({
        name: `ClubRun-${Date.now()}`,
        keyvalues: {
          type: 'clubrun-data',
          timestamp: Date.now()
        }
      }));

      const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Pinata pin failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Pinata pin error:', error);
      // Don't throw error as this is just for redundancy
    }
  }

  /**
   * Get IPFS gateway URL
   */
  getGatewayUrl(hash) {
    const gateways = [
      `https://ipfs.io/ipfs/${hash}`,
      `https://gateway.pinata.cloud/ipfs/${hash}`,
      `https://cloudflare-ipfs.com/ipfs/${hash}`,
      `https://dweb.link/ipfs/${hash}`
    ];
    
    return gateways[0]; // Return primary gateway
  }

  /**
   * Validate IPFS hash format
   */
  isValidHash(hash) {
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || 
           /^bafy[a-z2-7]{55}$/.test(hash);
  }

  /**
   * Upload file buffer to IPFS
   */
  async uploadFile(buffer, filename) {
    try {
      const result = await this.client.add(buffer, {
        pin: true,
        filename: filename
      });
      
      return result.path;
    } catch (error) {
      console.error('IPFS file upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Get file from IPFS as buffer
   */
  async getFile(hash) {
    try {
      const stream = this.client.cat(hash);
      const chunks = [];
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('IPFS file fetch error:', error);
      throw new Error('Failed to fetch file from IPFS');
    }
  }
}

module.exports = new IPFSService();
