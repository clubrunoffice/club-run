const { createClient } = require('@supabase/supabase-js');

class MissionAssignmentAgent {
  constructor() {
    // Only initialize Supabase if environment variables are available
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
      this.supabaseEnabled = true;
    } else {
      console.log('⚠️  Supabase not configured - using mock data for mission assignment');
      this.supabaseEnabled = false;
    }
  }

  /**
   * Assign the best runner to a mission
   * @param {Object} mission - Mission data
   * @returns {Promise<Object>} Assignment result
   */
  async assignBestRunner(mission) {
    try {
      // If Supabase is not configured, return mock data
      if (!this.supabaseEnabled) {
        return this.getMockAssignment(mission);
      }

      // Get available runners
      const availableRunners = await this.getAvailableRunners(mission);
      
      if (availableRunners.length === 0) {
        return {
          success: false,
          error: 'No available runners found',
          mission_id: mission.id
        };
      }

      // Score each runner
      const scoredRunners = await this.scoreRunners(availableRunners, mission);
      
      // Select the best runner
      const bestRunner = scoredRunners[0]; // Already sorted by score
      
      // Assign the mission
      const assignmentResult = await this.assignMissionToRunner(mission, bestRunner);
      
      return {
        success: true,
        mission_id: mission.id,
        assigned_runner: bestRunner,
        assignment_score: bestRunner.score,
        assignment_reason: bestRunner.assignment_reason,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Mission assignment error:', error);
      return {
        success: false,
        error: error.message,
        mission_id: mission.id
      };
    }
  }

  /**
   * Get mock assignment data when Supabase is not configured
   * @param {Object} mission - Mission data
   * @returns {Object} Mock assignment result
   */
  getMockAssignment(mission) {
    const mockRunners = [
      {
        id: "runner-001",
        name: "Alex Johnson",
        performance_rating: 4.8,
        completed_missions_count: 47,
        total_earnings: 2840,
        specialties: ["venue research", "client relations"],
        availability: "flexible"
      },
      {
        id: "runner-002", 
        name: "Sam Rivera",
        performance_rating: 4.6,
        completed_missions_count: 32,
        total_earnings: 1920,
        specialties: ["logistics", "safety assessment"],
        availability: "evenings"
      },
      {
        id: "runner-003",
        name: "Jordan Chen",
        performance_rating: 4.9,
        completed_missions_count: 58,
        total_earnings: 3480,
        specialties: ["reporting", "expense tracking"],
        availability: "weekends"
      }
    ];

    // Simple scoring algorithm
    const scoredRunners = mockRunners.map(runner => {
      const locationScore = Math.random() * 30 + 70; // 70-100
      const performanceScore = runner.performance_rating * 20; // 0-100
      const experienceScore = Math.min(runner.completed_missions_count * 1.5, 100);
      const earningsScore = Math.max(0, 100 - runner.total_earnings / 100);
      
      const totalScore = (locationScore * 0.3) + (performanceScore * 0.25) + (experienceScore * 0.15) + (earningsScore * 0.1);
      
      return {
        ...runner,
        score: Math.round(totalScore),
        assignment_reason: `High performance (${runner.performance_rating}/5), ${runner.completed_missions_count} missions completed`
      };
    }).sort((a, b) => b.score - a.score);

    const bestRunner = scoredRunners[0];

    return {
      success: true,
      mission_id: mission.id || `mission-${Date.now()}`,
      assigned_runner: bestRunner,
      assignment_score: bestRunner.score,
      assignment_reason: bestRunner.assignment_reason,
      timestamp: new Date().toISOString(),
      note: "Using mock data - configure Supabase for production"
    };
  }

  /**
   * Get available runners for a mission
   * @param {Object} mission - Mission data
   * @returns {Promise<Array>} Available runners
   */
  async getAvailableRunners(mission) {
    if (!this.supabaseEnabled) {
      console.warn('Supabase not configured, returning mock runners.');
      return this.getMockRunners();
    }

    const { data: runners, error } = await this.supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        location,
        availability_status,
        performance_rating,
        completed_missions_count,
        total_earnings,
        last_active,
        preferences
      `)
      .eq('role', 'runner')
      .eq('availability_status', 'available')
      .not('last_active', 'lt', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Active in last 24 hours

    if (error) throw new Error(`Failed to fetch runners: ${error.message}`);
    
    return runners || [];
  }

  /**
   * Get mock runners for when Supabase is not configured
   * @returns {Array} Mock runners
   */
  getMockRunners() {
    console.log('Returning mock runners as Supabase is not configured.');
    return [
      {
        id: "mock-runner-1",
        name: "Mock Runner 1",
        performance_rating: 4.5,
        completed_missions_count: 10,
        total_earnings: 500,
        last_active: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Active recently
        availability_status: "available",
        location: "123 Mock Ave, Mock City, MO 65432",
        preferences: ["venue research", "client relations"]
      },
      {
        id: "mock-runner-2",
        name: "Mock Runner 2",
        performance_rating: 4.8,
        completed_missions_count: 50,
        total_earnings: 2500,
        last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Active 2 days ago
        availability_status: "available",
        location: "456 Mock St, Mock Town, CA 98765",
        preferences: ["logistics", "safety assessment"]
      },
      {
        id: "mock-runner-3",
        name: "Mock Runner 3",
        performance_rating: 4.9,
        completed_missions_count: 70,
        total_earnings: 3500,
        last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Active 1 day ago
        availability_status: "available",
        location: "789 Mock Lane, Mock Village, TX 12345",
        preferences: ["reporting", "expense tracking"]
      }
    ];
  }

  /**
   * Score runners based on various factors
   * @param {Array} runners - Available runners
   * @param {Object} mission - Mission data
   * @returns {Promise<Array>} Scored runners sorted by score
   */
  async scoreRunners(runners, mission) {
    const scoredRunners = [];

    for (const runner of runners) {
      const score = await this.calculateRunnerScore(runner, mission);
      scoredRunners.push({
        ...runner,
        score,
        assignment_reason: this.generateAssignmentReason(runner, score)
      });
    }

    // Sort by score (highest first)
    return scoredRunners.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate score for a runner based on mission requirements
   * @param {Object} runner - Runner data
   * @param {Object} mission - Mission data
   * @returns {Promise<number>} Runner score
   */
  async calculateRunnerScore(runner, mission) {
    let score = 0;
    const weights = {
      location: 0.3,
      performance: 0.25,
      availability: 0.2,
      experience: 0.15,
      earnings: 0.1
    };

    // Location proximity (0-100)
    const locationScore = await this.calculateLocationScore(runner, mission);
    score += locationScore * weights.location;

    // Performance rating (0-100)
    const performanceScore = (runner.performance_rating || 0) * 20; // Convert 0-5 to 0-100
    score += performanceScore * weights.performance;

    // Availability (0-100)
    const availabilityScore = this.calculateAvailabilityScore(runner);
    score += availabilityScore * weights.availability;

    // Experience (0-100)
    const experienceScore = Math.min((runner.completed_missions_count || 0) * 2, 100);
    score += experienceScore * weights.experience;

    // Earnings incentive (0-100) - Prefer runners with lower earnings for fairness
    const earningsScore = Math.max(0, 100 - (runner.total_earnings || 0) / 100);
    score += earningsScore * weights.earnings;

    return Math.round(score);
  }

  /**
   * Calculate location proximity score
   * @param {Object} runner - Runner data
   * @param {Object} mission - Mission data
   * @returns {Promise<number>} Location score
   */
  async calculateLocationScore(runner, mission) {
    // This would integrate with a geocoding service
    // For now, use a simple distance calculation or return a base score
    try {
      // If we have coordinates, calculate actual distance
      if (runner.location && mission.address) {
        // This would use a geocoding service to get coordinates
        // and calculate distance between runner and mission
        const distance = await this.calculateDistance(runner.location, mission.address);
        
        // Score based on distance (closer = higher score)
        if (distance < 5) return 100; // Within 5 miles
        if (distance < 10) return 80; // Within 10 miles
        if (distance < 20) return 60; // Within 20 miles
        if (distance < 50) return 40; // Within 50 miles
        return 20; // Beyond 50 miles
      }
      
      // Fallback: assume good location match
      return 70;
    } catch (error) {
      console.error('Location score calculation error:', error);
      return 50; // Default score
    }
  }

  /**
   * Calculate distance between two locations
   * @param {string} location1 - First location
   * @param {string} location2 - Second location
   * @returns {Promise<number>} Distance in miles
   */
  async calculateDistance(location1, location2) {
    // This would integrate with Google Maps API or similar
    // For now, return a placeholder distance
    return Math.random() * 30 + 5; // Random distance between 5-35 miles
  }

  /**
   * Calculate availability score
   * @param {Object} runner - Runner data
   * @returns {number} Availability score
   */
  calculateAvailabilityScore(runner) {
    const lastActive = new Date(runner.last_active);
    const now = new Date();
    const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);

    if (hoursSinceActive < 1) return 100; // Active within last hour
    if (hoursSinceActive < 6) return 90; // Active within last 6 hours
    if (hoursSinceActive < 12) return 80; // Active within last 12 hours
    if (hoursSinceActive < 24) return 70; // Active within last 24 hours
    return 50; // Active but not recently
  }

  /**
   * Generate assignment reason
   * @param {Object} runner - Runner data
   * @param {number} score - Assignment score
   * @returns {string} Assignment reason
   */
  generateAssignmentReason(runner, score) {
    const reasons = [];
    
    if (score > 80) reasons.push('Excellent match');
    if (runner.performance_rating >= 4.5) reasons.push('High performance rating');
    if (runner.completed_missions_count > 50) reasons.push('Experienced runner');
    if (score > 70) reasons.push('Good location proximity');
    
    return reasons.length > 0 ? reasons.join(', ') : 'Best available runner';
  }

  /**
   * Assign mission to runner
   * @param {Object} mission - Mission data
   * @param {Object} runner - Runner data
   * @returns {Promise<Object>} Assignment result
   */
  async assignMissionToRunner(mission, runner) {
    if (!this.supabaseEnabled) {
      console.warn('Supabase not configured, skipping assignment to runner.');
      return {
        success: true,
        mission_id: mission.id,
        runner_id: runner.id,
        assigned_at: new Date().toISOString(),
        note: "Supabase not configured, skipping assignment to runner."
      };
    }

    try {
      // Update mission with runner assignment
      const { error: missionError } = await this.supabase
        .from('missions')
        .update({
          runner_id: runner.id,
          status: 'assigned',
          assigned_at: new Date().toISOString(),
          assignment_score: runner.score
        })
        .eq('id', mission.id);

      if (missionError) throw new Error(`Mission update error: ${missionError.message}`);

      // Create assignment record
      const { error: assignmentError } = await this.supabase
        .from('mission_assignments')
        .insert([{
          mission_id: mission.id,
          runner_id: runner.id,
          assigned_at: new Date().toISOString(),
          assignment_score: runner.score,
          assignment_reason: runner.assignment_reason
        }]);

      if (assignmentError) throw new Error(`Assignment record error: ${assignmentError.message}`);

      // Update runner availability
      const { error: runnerError } = await this.supabase
        .from('users')
        .update({
          availability_status: 'on_mission',
          current_mission_id: mission.id
        })
        .eq('id', runner.id);

      if (runnerError) throw new Error(`Runner update error: ${runnerError.message}`);

      return {
        success: true,
        mission_id: mission.id,
        runner_id: runner.id,
        assigned_at: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Assignment failed: ${error.message}`);
    }
  }

  /**
   * Get runner's current mission
   * @param {string} runnerId - Runner ID
   * @returns {Promise<Object|null>} Current mission
   */
  async getRunnerCurrentMission(runnerId) {
    if (!this.supabaseEnabled) {
      console.warn('Supabase not configured, returning null for runner mission.');
      return null;
    }

    const { data, error } = await this.supabase
      .from('missions')
      .select('*')
      .eq('runner_id', runnerId)
      .in('status', ['assigned', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw new Error(`Failed to get runner mission: ${error.message}`);
    return data[0] || null;
  }

  /**
   * Release runner from current mission
   * @param {string} runnerId - Runner ID
   * @returns {Promise<Object>} Release result
   */
  async releaseRunnerFromMission(runnerId) {
    if (!this.supabaseEnabled) {
      console.warn('Supabase not configured, skipping runner release.');
      return {
        success: true,
        runner_id: runnerId,
        released_at: new Date().toISOString(),
        note: "Supabase not configured, skipping runner release."
      };
    }

    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          availability_status: 'available',
          current_mission_id: null
        })
        .eq('id', runnerId);

      if (error) throw new Error(`Failed to release runner: ${error.message}`);

      return {
        success: true,
        runner_id: runnerId,
        released_at: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Release failed: ${error.message}`);
    }
  }
}

module.exports = MissionAssignmentAgent; 