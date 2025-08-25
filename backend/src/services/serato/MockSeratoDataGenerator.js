const fs = require('fs-extra');
const path = require('path');
const os = require('os');

class MockSeratoDataGenerator {
  constructor() {
    this.mockDataPath = path.join(os.tmpdir(), 'mock-serato-data');
  }

  /**
   * Generate mock Serato database files for testing
   */
  async generateMockSeratoData(skillLevel = 'ADVANCED') {
    try {
      // Create mock Serato directory
      await fs.ensureDir(this.mockDataPath);

      // Generate different data based on skill level
      const data = this.getMockDataForSkillLevel(skillLevel);

      // Create mock database V2 file
      await this.createMockLibraryFile(data.library);
      
      // Create mock history file
      await this.createMockHistoryFile(data.history);
      
      // Create mock crates directory
      await this.createMockCratesDirectory(data.crates);
      
      // Create mock analysis directory
      await this.createMockAnalysisDirectory(data.analysis);

      console.log(`✅ Mock Serato data generated for ${skillLevel} skill level`);
      console.log(`📁 Location: ${this.mockDataPath}`);
      
      return {
        success: true,
        path: this.mockDataPath,
        skillLevel,
        data
      };

    } catch (error) {
      console.error('Error generating mock Serato data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate mock Serato data for 100% score (EXPERT level)
   */
  async generatePerfectSeratoData() {
    try {
      // Create mock Serato directory
      await fs.ensureDir(this.mockDataPath);

      // Perfect data configuration for 100% score
      const perfectData = {
        library: { 
          tracks: 2500, // 2500 tracks = 25 points (max)
          size: 102400000 
        },
        history: { 
          sessions: 250, // 250 sessions = 25 points (max)
          totalTime: 30000 
        },
        crates: { 
          count: 100, // 100 crates = 20 points (max)
          names: [
            'House', 'Pop', 'Top 40', 'Hip Hop', 'EDM', 'Chill', 'Workout', 'Party', 
            'Wedding', 'Corporate', 'Latin', 'Reggae', 'Rock', 'Jazz', 'Classical',
            'Techno', 'Trance', 'Dubstep', 'Drum & Bass', 'Funk', 'Soul', 'R&B',
            'Country', 'Blues', 'Electronic', 'Progressive House', 'Deep House',
            'Tech House', 'Future House', 'Tropical House', 'Bass House',
            'Melodic Techno', 'Progressive Trance', 'Uplifting Trance', 'Hardstyle',
            'Trap', 'Future Bass', 'Lo-Fi', 'Ambient', 'Downtempo', 'Acid House',
            'Breakbeat', 'Garage', 'Jungle', 'Drumstep', 'Moombahton', 'Trapstep',
            'Glitch Hop', 'Neurofunk', 'Liquid DnB', 'Jump Up', 'Crossbreed',
            'Industrial', 'EBM', 'Synthwave', 'Retrowave', 'Vaporwave', 'Future Funk',
            'City Pop', 'J-Funk', 'K-Funk', 'UK Garage', 'Speed Garage', '2-Step',
            'Grime', 'Dubstep', 'Brostep', 'Post-Dubstep', 'Future Garage',
            'Bassline', 'UK Funky', 'Afrobeat', 'Amapiano', 'Gqom', 'Kwaito',
            'Kuduro', 'Tarraxinha', 'Kizomba', 'Semba', 'Soca', 'Calypso',
            'Reggaeton', 'Dembow', 'Trap Latino', 'Latin Pop', 'Bachata',
            'Merengue', 'Cumbia', 'Vallenato', 'Salsa', 'Bolero', 'Ranchera',
            'Mariachi', 'Norteño', 'Banda', 'Corrido', 'Narcocorrido',
            'Duranguense', 'Quebradita', 'Cumbia Sonidera', 'Cumbia Villera',
            'Cumbia Digital', 'Cumbia Electronica', 'Cumbia Bass', 'Cumbia Trap',
            'Cumbia Reggaeton', 'Cumbia Hip Hop', 'Cumbia Rock', 'Cumbia Punk'
          ]
        },
        analysis: { 
          analyzedTracks: 750 // 750 tracks = 15 points (max)
        }
      };

      // Create mock database V2 file
      await this.createMockLibraryFile(perfectData.library);
      
      // Create mock history file
      await this.createMockHistoryFile(perfectData.history);
      
      // Create mock crates directory
      await this.createMockCratesDirectory(perfectData.crates);
      
      // Create mock analysis directory
      await this.createMockAnalysisDirectory(perfectData.analysis);

      console.log(`✅ Perfect Serato data generated for 100% score`);
      console.log(`📁 Location: ${this.mockDataPath}`);
      
      return {
        success: true,
        path: this.mockDataPath,
        skillLevel: 'EXPERT',
        data: perfectData
      };

    } catch (error) {
      console.error('Error generating perfect Serato data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get mock data configuration for different skill levels
   */
  getMockDataForSkillLevel(skillLevel) {
    const configs = {
      BEGINNER: {
        library: { tracks: 150, size: 1024000 },
        history: { sessions: 5, totalTime: 600 },
        crates: { count: 3, names: ['House', 'Pop', 'Top 40'] },
        analysis: { analyzedTracks: 50 }
      },
      NOVICE: {
        library: { tracks: 500, size: 5120000 },
        history: { sessions: 25, totalTime: 3000 },
        crates: { count: 8, names: ['House', 'Pop', 'Top 40', 'Hip Hop', 'EDM', 'Chill', 'Workout', 'Party'] },
        analysis: { analyzedTracks: 200 }
      },
      INTERMEDIATE: {
        library: { tracks: 1200, size: 15360000 },
        history: { sessions: 75, totalTime: 9000 },
        crates: { count: 15, names: ['House', 'Pop', 'Top 40', 'Hip Hop', 'EDM', 'Chill', 'Workout', 'Party', 'Wedding', 'Corporate', 'Latin', 'Reggae', 'Rock', 'Jazz', 'Classical'] },
        analysis: { analyzedTracks: 600 }
      },
      ADVANCED: {
        library: { tracks: 3000, size: 40960000 },
        history: { sessions: 200, totalTime: 24000 },
        crates: { count: 25, names: ['House', 'Pop', 'Top 40', 'Hip Hop', 'EDM', 'Chill', 'Workout', 'Party', 'Wedding', 'Corporate', 'Latin', 'Reggae', 'Rock', 'Jazz', 'Classical', 'Techno', 'Trance', 'Dubstep', 'Drum & Bass', 'Funk', 'Soul', 'R&B', 'Country', 'Blues', 'Electronic'] },
        analysis: { analyzedTracks: 1500 }
      },
      EXPERT: {
        library: { tracks: 8000, size: 102400000 },
        history: { sessions: 500, totalTime: 60000 },
        crates: { count: 40, names: ['House', 'Pop', 'Top 40', 'Hip Hop', 'EDM', 'Chill', 'Workout', 'Party', 'Wedding', 'Corporate', 'Latin', 'Reggae', 'Rock', 'Jazz', 'Classical', 'Techno', 'Trance', 'Dubstep', 'Drum & Bass', 'Funk', 'Soul', 'R&B', 'Country', 'Blues', 'Electronic', 'Progressive House', 'Deep House', 'Tech House', 'Future House', 'Tropical House', 'Bass House', 'Melodic Techno', 'Progressive Trance', 'Uplifting Trance', 'Hardstyle', 'Trap', 'Future Bass', 'Lo-Fi', 'Ambient', 'Downtempo'] },
        analysis: { analyzedTracks: 4000 }
      }
    };

    return configs[skillLevel] || configs.ADVANCED;
  }

  /**
   * Create mock library file
   */
  async createMockLibraryFile(libraryData) {
    const libraryPath = path.join(this.mockDataPath, 'database V2');
    
    // Create mock library content with track references
    let content = 'Serato Library Database V2\n';
    content += `Created: ${new Date().toISOString()}\n`;
    content += `Total Tracks: ${libraryData.tracks}\n\n`;
    
    // Add mock track entries - create actual track entries to match the count
    for (let i = 1; i <= libraryData.tracks; i++) {
      content += `track ${i}: Mock Track ${i} - Mock Artist ${i}\n`;
    }
    
    await fs.writeFile(libraryPath, content);
  }

  /**
   * Create mock history file
   */
  async createMockHistoryFile(historyData) {
    const historyPath = path.join(this.mockDataPath, 'history');
    
    let content = 'Serato Session History\n';
    content += `Total Sessions: ${historyData.sessions}\n`;
    content += `Total Time: ${historyData.totalTime} minutes\n\n`;
    
    // Add mock session entries - create actual session entries to match the count
    for (let i = 1; i <= historyData.sessions; i++) {
      const sessionDate = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
      content += `session ${i}: ${sessionDate.toISOString()} - Mock Session ${i}\n`;
    }
    
    await fs.writeFile(historyPath, content);
  }

  /**
   * Create mock crates directory
   */
  async createMockCratesDirectory(cratesData) {
    const cratesPath = path.join(this.mockDataPath, 'crates');
    await fs.ensureDir(cratesPath);
    
    // Create mock crate files
    for (let i = 0; i < cratesData.count; i++) {
      const crateName = cratesData.names[i] || `Crate ${i + 1}`;
      const cratePath = path.join(cratesPath, `${crateName}.crate`);
      
      const crateContent = `Serato Crate: ${crateName}\n`;
      await fs.writeFile(cratePath, crateContent);
    }
  }

  /**
   * Create mock analysis directory
   */
  async createMockAnalysisDirectory(analysisData) {
    const analysisPath = path.join(this.mockDataPath, 'analysis');
    await fs.ensureDir(analysisPath);
    
    // Create mock analysis files
    for (let i = 1; i <= analysisData.analyzedTracks; i++) {
      const analysisFile = path.join(analysisPath, `analysis_${i}.dat`);
      const content = `Analysis data for track ${i}\n`;
      await fs.writeFile(analysisFile, content);
    }
  }

  /**
   * Clean up mock data
   */
  async cleanupMockData() {
    try {
      await fs.remove(this.mockDataPath);
      console.log('✅ Mock Serato data cleaned up');
      return { success: true };
    } catch (error) {
      console.error('Error cleaning up mock data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get mock data path for testing
   */
  getMockDataPath() {
    return this.mockDataPath;
  }
}

module.exports = new MockSeratoDataGenerator();
