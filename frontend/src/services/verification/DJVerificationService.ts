// DJ Verification Service
// Handles the process of upgrading DJs to VERIFIED_DJ status

export interface VerificationRequest {
  id: string;
  userId: string;
  userEmail: string;
  currentRole: string;
  requestedRole: 'VERIFIED_DJ';
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  submissionDate: Date;
  reviewDate?: Date;
  reviewerId?: string;
  notes?: string;
  requirements: VerificationRequirements;
}

export interface VerificationRequirements {
  musicSubmissions: number;
  playlistCreations: number;
  communityRating: number;
  seratoIntegration: boolean;
  profileCompleteness: number;
  accountAge: number; // in days
}

export interface VerificationCriteria {
  minMusicSubmissions: number;
  minPlaylistCreations: number;
  minCommunityRating: number;
  requireSeratoIntegration: boolean;
  minProfileCompleteness: number;
  minAccountAge: number; // in days
}

export class DJVerificationService {
  private static instance: DJVerificationService;
  private verificationRequests: Map<string, VerificationRequest> = new Map();
  private verificationCriteria: VerificationCriteria = {
    minMusicSubmissions: 10,
    minPlaylistCreations: 5,
    minCommunityRating: 4.0,
    requireSeratoIntegration: true,
    minProfileCompleteness: 85,
    minAccountAge: 30
  };

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): DJVerificationService {
    if (!DJVerificationService.instance) {
      DJVerificationService.instance = new DJVerificationService();
    }
    return DJVerificationService.instance;
  }

  private initializeService(): void {
    console.log('🎵 DJ Verification Service initialized');
  }

  // Check if user is eligible for VERIFIED_DJ upgrade
  public async checkEligibility(userId: string, userRole: string): Promise<{
    eligible: boolean;
    requirements: VerificationRequirements;
    criteria: VerificationCriteria;
    missingRequirements: string[];
  }> {
    if (userRole !== 'DJ') {
      return {
        eligible: false,
        requirements: this.getDefaultRequirements(),
        criteria: this.verificationCriteria,
        missingRequirements: ['Must be a DJ to become VERIFIED_DJ']
      };
    }

    // Simulate user data retrieval
    const userRequirements = await this.getUserRequirements(userId);
    const missingRequirements: string[] = [];

    // Check each requirement
    if (userRequirements.musicSubmissions < this.verificationCriteria.minMusicSubmissions) {
      missingRequirements.push(`Need ${this.verificationCriteria.minMusicSubmissions - userRequirements.musicSubmissions} more music submissions`);
    }

    if (userRequirements.playlistCreations < this.verificationCriteria.minPlaylistCreations) {
      missingRequirements.push(`Need ${this.verificationCriteria.minPlaylistCreations - userRequirements.playlistCreations} more playlist creations`);
    }

    if (userRequirements.communityRating < this.verificationCriteria.minCommunityRating) {
      missingRequirements.push(`Need ${this.verificationCriteria.minCommunityRating - userRequirements.communityRating} higher community rating`);
    }

    if (this.verificationCriteria.requireSeratoIntegration && !userRequirements.seratoIntegration) {
      missingRequirements.push('Serato integration required');
    }

    if (userRequirements.profileCompleteness < this.verificationCriteria.minProfileCompleteness) {
      missingRequirements.push(`Profile completeness must be at least ${this.verificationCriteria.minProfileCompleteness}%`);
    }

    if (userRequirements.accountAge < this.verificationCriteria.minAccountAge) {
      missingRequirements.push(`Account must be at least ${this.verificationCriteria.minAccountAge} days old`);
    }

    const eligible = missingRequirements.length === 0;

    return {
      eligible,
      requirements: userRequirements,
      criteria: this.verificationCriteria,
      missingRequirements
    };
  }

  // Submit verification request
  public async submitVerificationRequest(
    userId: string,
    userEmail: string,
    currentRole: string
  ): Promise<VerificationRequest> {
    const eligibility = await this.checkEligibility(userId, currentRole);

    if (!eligibility.eligible) {
      throw new Error(`Not eligible for verification: ${eligibility.missingRequirements.join(', ')}`);
    }

    const request: VerificationRequest = {
      id: `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userEmail,
      currentRole,
      requestedRole: 'VERIFIED_DJ',
      status: 'pending',
      submissionDate: new Date(),
      requirements: eligibility.requirements
    };

    this.verificationRequests.set(request.id, request);

    console.log(`🎵 Verification request submitted: ${request.id}`);
    return request;
  }

  // Get verification request status
  public async getVerificationStatus(userId: string): Promise<VerificationRequest | null> {
    const requests = Array.from(this.verificationRequests.values());
    return requests.find(request => request.userId === userId) || null;
  }

  // Simulate automatic approval (in real system, this would be manual review)
  public async autoApproveVerification(requestId: string): Promise<VerificationRequest> {
    const request = this.verificationRequests.get(requestId);
    if (!request) {
      throw new Error('Verification request not found');
    }

    request.status = 'approved';
    request.reviewDate = new Date();
    request.reviewerId = 'system_auto_approval';
    request.notes = 'Automatically approved based on eligibility criteria';

    this.verificationRequests.set(requestId, request);

    console.log(`✅ Verification request approved: ${requestId}`);
    return request;
  }

  // Get all verification requests (for admin/operations use)
  public async getAllVerificationRequests(): Promise<VerificationRequest[]> {
    return Array.from(this.verificationRequests.values());
  }

  // Get verification statistics
  public getVerificationStats(): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    inReview: number;
  } {
    const requests = Array.from(this.verificationRequests.values());
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      inReview: requests.filter(r => r.status === 'in_review').length
    };
  }

  // Private helper methods
  private getDefaultRequirements(): VerificationRequirements {
    return {
      musicSubmissions: 0,
      playlistCreations: 0,
      communityRating: 0,
      seratoIntegration: false,
      profileCompleteness: 0,
      accountAge: 0
    };
  }

  private async getUserRequirements(userId: string): Promise<VerificationRequirements> {
    // Simulate user data retrieval - in real system, this would query your database
    const userData = await this.simulateUserData(userId);
    
    return {
      musicSubmissions: userData.musicSubmissions || 0,
      playlistCreations: userData.playlistCreations || 0,
      communityRating: userData.communityRating || 0,
      seratoIntegration: userData.seratoIntegration || false,
      profileCompleteness: userData.profileCompleteness || 0,
      accountAge: userData.accountAge || 0
    };
  }

  private async simulateUserData(userId: string): Promise<any> {
    // Simulate different user scenarios
    const scenarios = {
      'eligible_dj': {
        musicSubmissions: 15,
        playlistCreations: 8,
        communityRating: 4.5,
        seratoIntegration: true,
        profileCompleteness: 95,
        accountAge: 45
      },
      'almost_eligible_dj': {
        musicSubmissions: 8,
        playlistCreations: 3,
        communityRating: 3.8,
        seratoIntegration: false,
        profileCompleteness: 70,
        accountAge: 25
      },
      'new_dj': {
        musicSubmissions: 2,
        playlistCreations: 1,
        communityRating: 3.2,
        seratoIntegration: false,
        profileCompleteness: 60,
        accountAge: 10
      }
    };

    // Use userId to determine scenario (in real system, this would be actual user data)
    const scenarioKey = userId.includes('eligible') ? 'eligible_dj' : 
                       userId.includes('almost') ? 'almost_eligible_dj' : 'new_dj';
    
    return scenarios[scenarioKey] || scenarios['new_dj'];
  }

  // Update verification criteria (for admin use)
  public updateVerificationCriteria(criteria: Partial<VerificationCriteria>): void {
    this.verificationCriteria = { ...this.verificationCriteria, ...criteria };
    console.log('🎵 Verification criteria updated:', this.verificationCriteria);
  }

  // Get current verification criteria
  public getVerificationCriteria(): VerificationCriteria {
    return { ...this.verificationCriteria };
  }
}

// Export singleton instance
export const djVerificationService = DJVerificationService.getInstance();
