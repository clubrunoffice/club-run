const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

class ReportingAgent {
  constructor() {
    // Initialize Google Sheets API only if configured
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
      this.sheets = google.sheets({
        version: 'v4',
        auth: new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        }),
      });
      this.sheetsEnabled = true;
    } else {
      console.log('⚠️  Google Sheets not configured - skipping spreadsheet logging');
      this.sheetsEnabled = false;
    }

    // Initialize Supabase client only if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
      this.supabaseEnabled = true;
    } else {
      console.log('⚠️  Supabase not configured - skipping database logging');
      this.supabaseEnabled = false;
    }

    this.spreadsheetId = process.env.REPORTING_SHEET_ID;
  }

  /**
   * Log mission data to both Google Sheets and Supabase
   * @param {Object} missionData - Mission data to log
   * @returns {Promise<Object>} Logging results
   */
  async logMissionToSpreadsheetAndSupabase(missionData) {
    const results = {
      spreadsheet: { success: false, error: null },
      supabase: { success: false, error: null },
      timestamp: new Date().toISOString()
    };

    // Prepare data for logging
    const logEntry = this.prepareLogEntry(missionData);

    // Log to Google Sheets if enabled
    if (this.sheetsEnabled) {
      try {
        await this.logToSpreadsheet(logEntry);
        results.spreadsheet.success = true;
      } catch (error) {
        console.error('Spreadsheet logging error:', error);
        results.spreadsheet.error = error.message;
      }
    } else {
      results.spreadsheet.error = 'Google Sheets not configured';
    }

    // Log to Supabase if enabled
    if (this.supabaseEnabled) {
      try {
        await this.logToSupabase(logEntry);
        results.supabase.success = true;
      } catch (error) {
        console.error('Supabase logging error:', error);
        results.supabase.error = error.message;
      }
    } else {
      results.supabase.error = 'Supabase not configured';
    }

    return results;
  }

  /**
   * Prepare log entry with standardized format
   * @param {Object} missionData - Raw mission data
   * @returns {Object} Formatted log entry
   */
  prepareLogEntry(missionData) {
    return {
      timestamp: new Date().toISOString(),
      mission_id: missionData.mission_id || missionData.id,
      runner_id: missionData.runner_id,
      client_id: missionData.client_id,
      status: missionData.status,
      address: missionData.address,
      budget: missionData.budget,
      dj_service_pack: missionData.dj_service_pack || 'none',
      enriched_venue_data: missionData.enriched_venue_data ? 'yes' : 'no',
      action_type: missionData.action_type || 'status_change',
      action_details: missionData.action_details || '',
      week_number: this.getWeekNumber(new Date()),
      year: new Date().getFullYear(),
      created_at: new Date().toISOString()
    };
  }

  /**
   * Log entry to Google Sheets
   * @param {Object} logEntry - Formatted log entry
   */
  async logToSpreadsheet(logEntry) {
    if (!this.spreadsheetId) {
      throw new Error('REPORTING_SHEET_ID not configured');
    }

    const values = [
      [
        logEntry.timestamp,
        logEntry.mission_id,
        logEntry.runner_id,
        logEntry.client_id,
        logEntry.status,
        logEntry.address,
        logEntry.budget,
        logEntry.dj_service_pack,
        logEntry.enriched_venue_data,
        logEntry.action_type,
        logEntry.action_details,
        logEntry.week_number,
        logEntry.year
      ]
    ];

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Missions!A1',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });
  }

  /**
   * Log entry to Supabase
   * @param {Object} logEntry - Formatted log entry
   */
  async logToSupabase(logEntry) {
    const { error } = await this.supabase
      .from('missions_log')
      .insert([logEntry]);

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }
  }

  /**
   * Log mission status change
   * @param {Object} missionData - Mission data with status change
   */
  async logMissionStatusChange(missionData) {
    const logData = {
      ...missionData,
      action_type: 'status_change',
      action_details: `Status changed to: ${missionData.status}`
    };

    return await this.logMissionToSpreadsheetAndSupabase(logData);
  }

  /**
   * Log runner check-in
   * @param {Object} checkInData - Check-in data
   */
  async logRunnerCheckIn(checkInData) {
    const logData = {
      ...checkInData,
      action_type: 'check_in',
      action_details: `Runner checked in at: ${checkInData.location || 'venue'}`
    };

    return await this.logMissionToSpreadsheetAndSupabase(logData);
  }

  /**
   * Log expense entry
   * @param {Object} expenseData - Expense data
   */
  async logExpense(expenseData) {
    const logData = {
      ...expenseData,
      action_type: 'expense',
      action_details: `Expense: ${expenseData.description} - $${expenseData.amount}`
    };

    return await this.logMissionToSpreadsheetAndSupabase(logData);
  }

  /**
   * Log mission completion
   * @param {Object} completionData - Completion data
   */
  async logMissionCompletion(completionData) {
    const logData = {
      ...completionData,
      action_type: 'completion',
      action_details: 'Mission completed successfully'
    };

    return await this.logMissionToSpreadsheetAndSupabase(logData);
  }

  /**
   * Get current week number
   * @param {Date} date - Date to get week number for
   * @returns {number} Week number
   */
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  /**
   * Verify data consistency between spreadsheet and Supabase
   * @param {string} missionId - Mission ID to verify
   * @returns {Promise<Object>} Consistency check results
   */
  async verifyDataConsistency(missionId) {
    try {
      // Get data from spreadsheet
      const sheetResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Missions!A:M',
      });

      const sheetData = sheetResponse.data.values || [];
      const sheetMission = sheetData.find(row => row[1] === missionId);

      // Get data from Supabase
      const { data: supabaseData, error } = await this.supabase
        .from('missions_log')
        .select('*')
        .eq('mission_id', missionId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) {
        throw new Error(`Supabase query error: ${error.message}`);
      }

      const supabaseMission = supabaseData[0];

      return {
        consistent: sheetMission && supabaseMission && 
                   sheetMission[1] === supabaseMission.mission_id,
        sheet_data: sheetMission,
        supabase_data: supabaseMission,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Data consistency check error:', error);
      return {
        consistent: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = ReportingAgent; 