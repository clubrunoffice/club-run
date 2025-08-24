const axios = require('axios');
const crypto = require('crypto');

class SeratoIntegrationService {
  constructor() {
    this.clientId = process.env.SERATO_CLIENT_ID;
    this.clientSecret = process.env.SERATO_CLIENT_SECRET;
    this.redirectUri = process.env.SERATO_REDIRECT_URI;
    this.apiBaseUrl = 'https://api.serato.com/v1';
  }

  /**
   * Generate OAuth authorization URL for Serato connection
   */
  generateAuthUrl(userId, state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'play_history read_profile',
      state: state || crypto.randomBytes(32).toString('hex')
    });

    return `https://oauth.serato.com/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post('https://oauth.serato.com/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type
      };
    } catch (error) {
      console.error('Serato token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post('https://oauth.serato.com/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type
      };
    } catch (error) {
      console.error('Serato token refresh error:', error.response?.data || error.message);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get user's play history from Serato
   */
  async getPlayHistory(accessToken, startDate, endDate) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/play-history`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          include_track_details: true,
          include_venue_info: true
        }
      });

      return response.data.tracks || [];
    } catch (error) {
      console.error('Serato play history error:', error.response?.data || error.message);
      throw new Error('Failed to retrieve play history from Serato');
    }
  }

  /**
   * Get user's profile information
   */
  async getUserProfile(accessToken) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Serato profile error:', error.response?.data || error.message);
      throw new Error('Failed to retrieve user profile from Serato');
    }
  }

  /**
   * Verify if a specific track was played within a time window
   */
  async verifyTrackPlay(accessToken, trackRequirements, startTime, endTime) {
    try {
      const playHistory = await this.getPlayHistory(accessToken, startTime, endTime);
      
      const verificationResults = {
        trackFound: false,
        playTime: null,
        duration: 0,
        venue: null,
        confidence: 0,
        details: null
      };

      for (const track of playHistory) {
        // Check if track matches requirements
        const isMatch = this.trackMatchesRequirements(track, trackRequirements);
        
        if (isMatch) {
          verificationResults.trackFound = true;
          verificationResults.playTime = new Date(track.played_at);
          verificationResults.duration = track.duration || 0;
          verificationResults.venue = track.venue || null;
          verificationResults.confidence = this.calculateConfidence(track, trackRequirements);
          verificationResults.details = track;
          break;
        }
      }

      return verificationResults;
    } catch (error) {
      console.error('Track verification error:', error);
      throw new Error('Failed to verify track play');
    }
  }

  /**
   * Check if a track matches the mission requirements
   */
  trackMatchesRequirements(track, requirements) {
    const {
      title,
      artist,
      album,
      isrc,
      duration,
      bpm,
      key
    } = requirements;

    // Exact title match (case insensitive)
    if (title && !track.title.toLowerCase().includes(title.toLowerCase())) {
      return false;
    }

    // Artist match (case insensitive)
    if (artist && !track.artist.toLowerCase().includes(artist.toLowerCase())) {
      return false;
    }

    // Album match (if specified)
    if (album && track.album && !track.album.toLowerCase().includes(album.toLowerCase())) {
      return false;
    }

    // ISRC match (exact)
    if (isrc && track.isrc && track.isrc !== isrc) {
      return false;
    }

    // Duration tolerance (±10 seconds)
    if (duration && track.duration) {
      const durationDiff = Math.abs(track.duration - duration);
      if (durationDiff > 10) {
        return false;
      }
    }

    // BPM tolerance (±2 BPM)
    if (bpm && track.bpm) {
      const bpmDiff = Math.abs(track.bpm - bpm);
      if (bpmDiff > 2) {
        return false;
      }
    }

    // Key match (if specified)
    if (key && track.key && track.key !== key) {
      return false;
    }

    return true;
  }

  /**
   * Calculate confidence score for track match
   */
  calculateConfidence(track, requirements) {
    let confidence = 0;
    let totalChecks = 0;

    // Title match (40% weight)
    if (requirements.title) {
      totalChecks++;
      if (track.title.toLowerCase() === requirements.title.toLowerCase()) {
        confidence += 40;
      } else if (track.title.toLowerCase().includes(requirements.title.toLowerCase())) {
        confidence += 30;
      }
    }

    // Artist match (30% weight)
    if (requirements.artist) {
      totalChecks++;
      if (track.artist.toLowerCase() === requirements.artist.toLowerCase()) {
        confidence += 30;
      } else if (track.artist.toLowerCase().includes(requirements.artist.toLowerCase())) {
        confidence += 20;
      }
    }

    // ISRC match (20% weight)
    if (requirements.isrc && track.isrc) {
      totalChecks++;
      if (track.isrc === requirements.isrc) {
        confidence += 20;
      }
    }

    // Duration match (10% weight)
    if (requirements.duration && track.duration) {
      totalChecks++;
      const durationDiff = Math.abs(track.duration - requirements.duration);
      if (durationDiff <= 2) {
        confidence += 10;
      } else if (durationDiff <= 5) {
        confidence += 5;
      }
    }

    return totalChecks > 0 ? confidence / totalChecks : 0;
  }

  /**
   * Check if play history indicates professional gig patterns
   */
  isProfessionalGig(playHistory, startTime, endTime) {
    if (!playHistory || playHistory.length === 0) {
      return false;
    }

    const gigTracks = playHistory.filter(track => {
      const playTime = new Date(track.played_at);
      return playTime >= startTime && playTime <= endTime;
    });

    // Professional gig indicators:
    // 1. Multiple tracks played (at least 10)
    // 2. Consistent timing between tracks
    // 3. Reasonable track durations
    // 4. Venue information present

    if (gigTracks.length < 10) {
      return false;
    }

    // Check for consistent timing (tracks should be played sequentially)
    let consistentTiming = true;
    for (let i = 1; i < gigTracks.length; i++) {
      const prevTime = new Date(gigTracks[i - 1].played_at);
      const currTime = new Date(gigTracks[i].played_at);
      const timeDiff = (currTime - prevTime) / 1000; // seconds

      // Tracks should be played within reasonable time gaps
      if (timeDiff < 0 || timeDiff > 300) { // 5 minutes max gap
        consistentTiming = false;
        break;
      }
    }

    // Check track durations (should be reasonable for DJ tracks)
    const reasonableDurations = gigTracks.every(track => {
      const duration = track.duration || 0;
      return duration >= 60 && duration <= 600; // 1-10 minutes
    });

    // Check venue information
    const hasVenueInfo = gigTracks.some(track => track.venue);

    return consistentTiming && reasonableDurations && hasVenueInfo;
  }
}

module.exports = new SeratoIntegrationService();
