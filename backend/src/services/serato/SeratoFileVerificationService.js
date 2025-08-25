const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

class SeratoFileVerificationService {
  constructor() {
    this.seratoPaths = this.getSeratoPaths();
    this.requiredFiles = [
      'database V2',
      'history',
      'crates',
      'analysis'
    ];
  }

  /**
   * Get Serato installation paths for different operating systems
   */
  getSeratoPaths() {
    const platform = os.platform();
    const homeDir = os.homedir();

    if (platform === 'darwin') {
      // macOS
      return [
        path.join(homeDir, 'Music', 'Serato'),
        path.join(homeDir, 'Documents', 'Serato'),
        '/Applications/Serato DJ Pro.app/Contents/Resources'
      ];
    } else if (platform === 'win32') {
      // Windows
      return [
        path.join(homeDir, 'Documents', 'Serato'),
        path.join(homeDir, 'Music', 'Serato'),
        'C:\\Program Files\\Serato\\Serato DJ Pro'
      ];
    } else {
      // Linux (if supported)
      return [
        path.join(homeDir, '.serato'),
        path.join(homeDir, 'Music', 'Serato')
      ];
    }
  }

  /**
   * Detect if Serato is installed and find the database location
   */
  async detectSeratoInstallation() {
    for (const seratoPath of this.seratoPaths) {
      try {
        const exists = await fs.pathExists(seratoPath);
        if (exists) {
          const files = await fs.readdir(seratoPath);
          const hasRequiredFiles = this.requiredFiles.some(file => 
            files.some(f => f.includes(file))
          );
          
          if (hasRequiredFiles) {
            return {
              found: true,
              path: seratoPath,
              files: files.filter(f => this.requiredFiles.some(req => f.includes(req)))
            };
          }
        }
      } catch (error) {
        console.log(`Error checking path ${seratoPath}:`, error.message);
      }
    }

    return { found: false, path: null, files: [] };
  }

  /**
   * Read and parse Serato database files
   */
  async readSeratoDatabase(seratoPath) {
    const database = {
      library: { tracks: 0, size: 0 },
      history: { sessions: 0, totalTime: 0 },
      crates: { count: 0, names: [] },
      analysis: { analyzedTracks: 0 },
      lastActivity: null,
      installationDate: null
    };

    try {
      // Read library database
      const libraryPath = path.join(seratoPath, 'database V2');
      if (await fs.pathExists(libraryPath)) {
        const libraryData = await this.parseLibraryFile(libraryPath);
        database.library = libraryData;
      }

      // Read history file
      const historyPath = path.join(seratoPath, 'history');
      if (await fs.pathExists(historyPath)) {
        const historyData = await this.parseHistoryFile(historyPath);
        database.history = historyData;
      }

      // Read crates
      const cratesPath = path.join(seratoPath, 'crates');
      if (await fs.pathExists(cratesPath)) {
        const cratesData = await this.parseCratesDirectory(cratesPath);
        database.crates = cratesData;
      }

      // Read analysis data
      const analysisPath = path.join(seratoPath, 'analysis');
      if (await fs.pathExists(analysisPath)) {
        const analysisData = await this.parseAnalysisDirectory(analysisPath);
        database.analysis = analysisData;
      }

      // Calculate installation date (earliest file modification)
      database.installationDate = await this.getInstallationDate(seratoPath);
      
      // Get last activity date
      database.lastActivity = await this.getLastActivityDate(seratoPath);

    } catch (error) {
      console.error('Error reading Serato database:', error);
      throw new Error('Failed to read Serato database files');
    }

    return database;
  }

  /**
   * Parse Serato library file
   */
  async parseLibraryFile(libraryPath) {
    try {
      const stats = await fs.stat(libraryPath);
      const content = await fs.readFile(libraryPath, 'utf8');
      
      // Count tracks (basic parsing)
      const trackMatches = content.match(/track/g) || [];
      const tracks = trackMatches.length;
      
      return {
        tracks: Math.max(tracks, 0),
        size: stats.size,
        lastModified: stats.mtime
      };
    } catch (error) {
      console.error('Error parsing library file:', error);
      return { tracks: 0, size: 0, lastModified: null };
    }
  }

  /**
   * Parse Serato history file
   */
  async parseHistoryFile(historyPath) {
    try {
      const stats = await fs.stat(historyPath);
      const content = await fs.readFile(historyPath, 'utf8');
      
      // Count sessions (basic parsing)
      const sessionMatches = content.match(/session/g) || [];
      const sessions = sessionMatches.length;
      
      // Estimate total time (rough calculation)
      const totalTime = sessions * 120; // Assume average 2 hours per session
      
      return {
        sessions: Math.max(sessions, 0),
        totalTime: totalTime,
        lastModified: stats.mtime
      };
    } catch (error) {
      console.error('Error parsing history file:', error);
      return { sessions: 0, totalTime: 0, lastModified: null };
    }
  }

  /**
   * Parse Serato crates directory
   */
  async parseCratesDirectory(cratesPath) {
    try {
      const files = await fs.readdir(cratesPath);
      const crateFiles = files.filter(f => f.endsWith('.crate'));
      
      const crates = [];
      for (const crateFile of crateFiles) {
        try {
          const cratePath = path.join(cratesPath, crateFile);
          const stats = await fs.stat(cratePath);
          crates.push({
            name: crateFile.replace('.crate', ''),
            size: stats.size,
            lastModified: stats.mtime
          });
        } catch (error) {
          console.log(`Error reading crate ${crateFile}:`, error.message);
        }
      }
      
      return {
        count: crates.length,
        names: crates.map(c => c.name),
        details: crates
      };
    } catch (error) {
      console.error('Error parsing crates directory:', error);
      return { count: 0, names: [], details: [] };
    }
  }

  /**
   * Parse Serato analysis directory
   */
  async parseAnalysisDirectory(analysisPath) {
    try {
      const files = await fs.readdir(analysisPath);
      const analysisFiles = files.filter(f => f.includes('analysis'));
      
      return {
        analyzedTracks: analysisFiles.length,
        lastModified: await this.getLastModifiedDate(analysisPath)
      };
    } catch (error) {
      console.error('Error parsing analysis directory:', error);
      return { analyzedTracks: 0, lastModified: null };
    }
  }

  /**
   * Get installation date (earliest file modification)
   */
  async getInstallationDate(seratoPath) {
    try {
      const files = await fs.readdir(seratoPath);
      let earliestDate = new Date();
      
      for (const file of files) {
        try {
          const filePath = path.join(seratoPath, file);
          const stats = await fs.stat(filePath);
          if (stats.mtime < earliestDate) {
            earliestDate = stats.mtime;
          }
        } catch (error) {
          // Skip files we can't read
        }
      }
      
      return earliestDate;
    } catch (error) {
      return new Date();
    }
  }

  /**
   * Get last activity date (most recent file modification)
   */
  async getLastActivityDate(seratoPath) {
    try {
      const files = await fs.readdir(seratoPath);
      let latestDate = new Date(0);
      
      for (const file of files) {
        try {
          const filePath = path.join(seratoPath, file);
          const stats = await fs.stat(filePath);
          if (stats.mtime > latestDate) {
            latestDate = stats.mtime;
          }
        } catch (error) {
          // Skip files we can't read
        }
      }
      
      return latestDate;
    } catch (error) {
      return new Date();
    }
  }

  /**
   * Get last modified date for a directory
   */
  async getLastModifiedDate(dirPath) {
    try {
      const stats = await fs.stat(dirPath);
      return stats.mtime;
    } catch (error) {
      return new Date();
    }
  }

  /**
   * Calculate DJ skill level based on Serato data
   */
  calculateSkillLevel(database) {
    let score = 0;
    const factors = [];

    // Library size (0-25 points)
    const libraryScore = Math.min(database.library.tracks / 100, 25);
    score += libraryScore;
    factors.push(`Library: ${database.library.tracks} tracks (+${libraryScore.toFixed(1)} points)`);

    // Session count (0-25 points)
    const sessionScore = Math.min(database.history.sessions / 10, 25);
    score += sessionScore;
    factors.push(`Sessions: ${database.history.sessions} sessions (+${sessionScore.toFixed(1)} points)`);

    // Crate organization (0-20 points)
    const crateScore = Math.min(database.crates.count / 5, 20);
    score += crateScore;
    factors.push(`Crates: ${database.crates.count} crates (+${crateScore.toFixed(1)} points)`);

    // Analysis completion (0-15 points)
    const analysisScore = Math.min(database.analysis.analyzedTracks / 50, 15);
    score += analysisScore;
    factors.push(`Analysis: ${database.analysis.analyzedTracks} tracks analyzed (+${analysisScore.toFixed(1)} points)`);

    // Activity recency (0-15 points)
    const daysSinceActivity = (new Date() - database.lastActivity) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 15 - (daysSinceActivity / 7));
    score += recencyScore;
    factors.push(`Recency: ${Math.round(daysSinceActivity)} days ago (+${recencyScore.toFixed(1)} points)`);

    // Determine skill level
    let skillLevel = 'BEGINNER';
    if (score >= 80) skillLevel = 'EXPERT';
    else if (score >= 60) skillLevel = 'ADVANCED';
    else if (score >= 40) skillLevel = 'INTERMEDIATE';
    else if (score >= 20) skillLevel = 'NOVICE';

    return {
      score: Math.round(score),
      skillLevel,
      factors,
      database
    };
  }

  /**
   * Generate verification hash for security
   */
  generateVerificationHash(database) {
    const dataString = JSON.stringify({
      tracks: database.library.tracks,
      sessions: database.history.sessions,
      crates: database.crates.count,
      analyzed: database.analysis.analyzedTracks,
      lastActivity: database.lastActivity
    });
    
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Main verification method
   */
  async verifySeratoSkills() {
    try {
      // Step 1: Detect Serato installation
      const installation = await this.detectSeratoInstallation();
      
      if (!installation.found) {
        return {
          success: false,
          error: 'Serato installation not found',
          message: 'Please install Serato DJ Pro to verify your skills'
        };
      }

      // Step 2: Read database files
      const database = await this.readSeratoDatabase(installation.path);
      
      // Step 3: Calculate skill level
      const skillAnalysis = this.calculateSkillLevel(database);
      
      // Step 4: Generate verification hash
      const verificationHash = this.generateVerificationHash(database);
      
      // Step 5: Return comprehensive results
      return {
        success: true,
        verified: true,
        skillLevel: skillAnalysis.skillLevel,
        score: skillAnalysis.score,
        factors: skillAnalysis.factors,
        database: {
          library: {
            tracks: database.library.tracks,
            size: database.library.size
          },
          history: {
            sessions: database.history.sessions,
            totalTime: database.history.totalTime
          },
          crates: {
            count: database.crates.count,
            names: database.crates.names.slice(0, 10) // Limit to first 10
          },
          analysis: {
            analyzedTracks: database.analysis.analyzedTracks
          },
          lastActivity: database.lastActivity,
          installationDate: database.installationDate
        },
        verificationHash,
        message: `Verified as ${skillAnalysis.skillLevel} DJ with ${skillAnalysis.score}/100 score`
      };

    } catch (error) {
      console.error('Serato verification error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to verify Serato skills'
      };
    }
  }
}

module.exports = new SeratoFileVerificationService();
