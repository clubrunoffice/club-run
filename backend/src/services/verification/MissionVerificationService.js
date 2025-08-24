const seratoService = require('../serato/SeratoIntegrationService');
const ipfsService = require('../ipfs/IPFSService');
const hybridPaymentService = require('../payments/HybridPaymentService');

class MissionVerificationService {
  constructor() {
    this.verificationQueue = [];
    this.isProcessing = false;
  }

  /**
   * Add a mission to the verification queue
   */
  async queueMissionForVerification(missionId, runnerId, verificationWindow) {
    const verificationTask = {
      missionId,
      runnerId,
      verificationWindow,
      createdAt: new Date(),
      attempts: 0,
      maxAttempts: 3
    };

    this.verificationQueue.push(verificationTask);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processVerificationQueue();
    }

    return verificationTask;
  }

  /**
   * Process the verification queue
   */
  async processVerificationQueue() {
    if (this.isProcessing || this.verificationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.verificationQueue.length > 0) {
      const task = this.verificationQueue.shift();
      
      try {
        await this.verifyMission(task);
      } catch (error) {
        console.error(`Verification failed for mission ${task.missionId}:`, error);
        
        // Retry if attempts remaining
        if (task.attempts < task.maxAttempts) {
          task.attempts++;
          task.retryAt = new Date(Date.now() + (task.attempts * 5 * 60 * 1000)); // 5, 10, 15 min delays
          this.verificationQueue.push(task);
        } else {
          // Mark as failed after max attempts
          await this.markMissionAsFailed(task.missionId, task.runnerId, error.message);
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Verify a specific mission
   */
  async verifyMission(task) {
    const { missionId, runnerId, verificationWindow } = task;

    // Get mission details
    const mission = await this.getMissionDetails(missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }

    // Get runner's Serato connection
    const runner = await this.getRunnerWithSeratoConnection(runnerId);
    if (!runner || !runner.seratoAccessToken) {
      throw new Error('Runner not connected to Serato');
    }

    // Check if access token needs refresh
    let accessToken = runner.seratoAccessToken;
    if (this.isTokenExpired(runner.seratoTokenExpiresAt)) {
      const tokenData = await seratoService.refreshAccessToken(runner.seratoRefreshToken);
      accessToken = tokenData.accessToken;
      
      // Update runner's token
      await this.updateRunnerSeratoToken(runnerId, tokenData);
    }

    // Get track requirements from mission
    const trackRequirements = this.extractTrackRequirements(mission);
    if (!trackRequirements) {
      throw new Error('No track requirements found in mission');
    }

    // Verify track play
    const verificationResult = await seratoService.verifyTrackPlay(
      accessToken,
      trackRequirements,
      verificationWindow.startTime,
      verificationWindow.endTime
    );

    // Check if verification was successful
    if (verificationResult.trackFound && verificationResult.confidence >= 70) {
      await this.completeMission(missionId, runnerId, verificationResult);
    } else {
      // Check if we should retry later (mission might not be completed yet)
      const now = new Date();
      if (verificationWindow.endTime > now) {
        // Mission window hasn't ended, retry later
        task.retryAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
        this.verificationQueue.push(task);
      } else {
        // Mission window has ended, mark as failed
        await this.markMissionAsFailed(missionId, runnerId, 'Track not found in play history');
      }
    }
  }

  /**
   * Complete a mission with verification proof
   */
  async completeMission(missionId, runnerId, verificationResult) {
    try {
      // Create proof document
      const proofDocument = {
        missionId,
        runnerId,
        verificationTime: new Date().toISOString(),
        trackPlayed: verificationResult.details,
        playTime: verificationResult.playTime,
        duration: verificationResult.duration,
        venue: verificationResult.venue,
        confidence: verificationResult.confidence,
        verificationMethod: 'serato_automated',
        proofHash: null
      };

      // Upload proof to IPFS
      const proofHash = await ipfsService.uploadMissionProof(proofDocument);

      // Update mission status
      await this.updateMissionStatus(missionId, 'COMPLETED', {
        runnerId,
        completedAt: new Date(),
        proofHash,
        verificationDetails: verificationResult
      });

      // Process payment
      await this.processMissionPayment(missionId, runnerId);

      // Notify curator
      await this.notifyCuratorOfCompletion(missionId, runnerId, proofDocument);

      console.log(`Mission ${missionId} completed successfully by runner ${runnerId}`);
    } catch (error) {
      console.error('Error completing mission:', error);
      throw error;
    }
  }

  /**
   * Mark mission as failed
   */
  async markMissionAsFailed(missionId, runnerId, reason) {
    try {
      await this.updateMissionStatus(missionId, 'FAILED', {
        runnerId,
        failedAt: new Date(),
        failureReason: reason
      });

      // Notify runner of failure
      await this.notifyRunnerOfFailure(missionId, runnerId, reason);

      console.log(`Mission ${missionId} marked as failed: ${reason}`);
    } catch (error) {
      console.error('Error marking mission as failed:', error);
    }
  }

  /**
   * Extract track requirements from mission
   */
  extractTrackRequirements(mission) {
    try {
      const requirements = JSON.parse(mission.requirements);
      
      // Look for track-specific requirements
      if (requirements.track) {
        return requirements.track;
      }
      
      // Check if requirements contain track info directly
      if (requirements.title || requirements.artist) {
        return requirements;
      }

      return null;
    } catch (error) {
      console.error('Error parsing mission requirements:', error);
      return null;
    }
  }

  /**
   * Check if Serato token is expired
   */
  isTokenExpired(expiresAt) {
    if (!expiresAt) return true;
    
    const now = new Date();
    const expiryTime = new Date(expiresAt);
    
    // Consider token expired if it expires within the next 5 minutes
    return now.getTime() > (expiryTime.getTime() - 5 * 60 * 1000);
  }

  /**
   * Get mission details from database
   */
  async getMissionDetails(missionId) {
    // This would be implemented with your database client
    // For now, returning a mock structure
    return {
      id: missionId,
      requirements: JSON.stringify({
        track: {
          title: "Example Track",
          artist: "Example Artist",
          duration: 180,
          bpm: 128
        }
      })
    };
  }

  /**
   * Get runner with Serato connection details
   */
  async getRunnerWithSeratoConnection(runnerId) {
    // This would be implemented with your database client
    // For now, returning a mock structure
    return {
      id: runnerId,
      seratoAccessToken: "mock_access_token",
      seratoRefreshToken: "mock_refresh_token",
      seratoTokenExpiresAt: new Date(Date.now() + 3600000) // 1 hour from now
    };
  }

  /**
   * Update runner's Serato token
   */
  async updateRunnerSeratoToken(runnerId, tokenData) {
    // This would be implemented with your database client
    console.log(`Updating Serato token for runner ${runnerId}`);
  }

  /**
   * Update mission status
   */
  async updateMissionStatus(missionId, status, details) {
    // This would be implemented with your database client
    console.log(`Updating mission ${missionId} status to ${status}`, details);
  }

  /**
   * Process mission payment
   */
  async processMissionPayment(missionId, runnerId) {
    try {
      // Get mission details for payment amount
      const mission = await this.getMissionDetails(missionId);
      
      // Process payment using hybrid payment service
      const paymentResult = await hybridPaymentService.processMissionPayment({
        missionId,
        runnerId,
        amount: mission.budget,
        paymentMethod: mission.paymentMethod
      });

      console.log(`Payment processed for mission ${missionId}:`, paymentResult);
      return paymentResult;
    } catch (error) {
      console.error('Error processing mission payment:', error);
      throw error;
    }
  }

  /**
   * Notify curator of mission completion
   */
  async notifyCuratorOfCompletion(missionId, runnerId, proofDocument) {
    // This would send notification to curator
    console.log(`Notifying curator of mission ${missionId} completion`);
  }

  /**
   * Notify runner of mission failure
   */
  async notifyRunnerOfFailure(missionId, runnerId, reason) {
    // This would send notification to runner
    console.log(`Notifying runner ${runnerId} of mission ${missionId} failure: ${reason}`);
  }

  /**
   * Schedule verification for a mission
   */
  async scheduleMissionVerification(missionId, runnerId, startTime, endTime) {
    const verificationWindow = {
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    };

    // Schedule initial verification at end time
    const initialVerification = new Date(endTime);
    
    // Add to queue with delay
    setTimeout(() => {
      this.queueMissionForVerification(missionId, runnerId, verificationWindow);
    }, initialVerification.getTime() - Date.now());

    console.log(`Scheduled verification for mission ${missionId} at ${initialVerification}`);
  }

  /**
   * Get verification status for a mission
   */
  async getVerificationStatus(missionId) {
    // This would check the current verification status
    return {
      missionId,
      status: 'pending',
      lastChecked: new Date(),
      attempts: 0
    };
  }
}

module.exports = new MissionVerificationService();
