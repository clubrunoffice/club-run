const { createClient } = require('@supabase/supabase-js');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class WeeklyReportGenerator {
  constructor() {
    // Initialize Supabase client only if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
      this.supabaseEnabled = true;
    } else {
      console.log('⚠️  Supabase not configured - using mock data for weekly reports');
      this.supabaseEnabled = false;
    }
    
    this.reportsDir = path.join(__dirname, '../../reports');
    this.ensureReportsDirectory();
  }

  /**
   * Ensure reports directory exists
   */
  async ensureReportsDirectory() {
    try {
      await fs.access(this.reportsDir);
    } catch {
      await fs.mkdir(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Generate weekly ledger for a specific user and role
   * @param {string} userId - User ID
   * @param {string} role - User role (runner, client, admin)
   * @param {Date} weekStart - Start of the week
   * @returns {Promise<Object>} Report URLs and metadata
   */
  async generateWeeklyLedger(userId, role, weekStart = null) {
    try {
      // If Supabase is not configured, return mock data
      if (!this.supabaseEnabled) {
        return this.getMockWeeklyReport(userId, role, weekStart);
      }

      // Calculate week boundaries
      const week = this.calculateWeekBoundaries(weekStart);
      
      // Fetch relevant data based on role
      const data = await this.fetchWeeklyData(userId, role, week);
      
      // Generate reports
      const csvUrl = await this.generateCSVReport(data, userId, role, week);
      const pdfUrl = await this.generatePDFReport(data, userId, role, week);
      const excelUrl = await this.generateExcelReport(data, userId, role, week);
      
      // Store report metadata in Supabase
      const reportMetadata = {
        user_id: userId,
        role: role,
        week_start: week.start.toISOString(),
        week_end: week.end.toISOString(),
        csv_url: csvUrl,
        pdf_url: pdfUrl,
        excel_url: excelUrl,
        generated_at: new Date().toISOString(),
        mission_count: data.missions.length,
        expense_count: data.expenses.length,
        total_budget: data.totalBudget,
        total_expenses: data.totalExpenses
      };

      await this.storeReportMetadata(reportMetadata);
      
      return {
        success: true,
        reports: {
          csv: csvUrl,
          pdf: pdfUrl,
          excel: excelUrl
        },
        metadata: reportMetadata
      };
    } catch (error) {
      console.error('Weekly report generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get mock weekly report when Supabase is not configured
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Date} weekStart - Start of the week
   * @returns {Object} Mock report data
   */
  getMockWeeklyReport(userId, role, weekStart = null) {
    const week = this.calculateWeekBoundaries(weekStart);
    const reportId = `report-${Date.now()}`;

    return {
      success: true,
      report: {
        id: reportId,
        type: 'weekly',
        user_id: userId,
        role: role,
        week_start: week.start.toISOString(),
        week_end: week.end.toISOString(),
        summary: {
          total_missions: 12,
          completed_missions: 11,
          total_revenue: 8400,
          total_expenses: 1200,
          net_profit: 7200,
          average_mission_rating: 4.7
        },
        generated_at: new Date().toISOString()
      },
      download_urls: {
        csv_url: `https://demo.example.com/reports/${reportId}.csv`,
        pdf_url: `https://demo.example.com/reports/${reportId}.pdf`,
        excel_url: `https://demo.example.com/reports/${reportId}.xlsx`
      },
      timestamp: new Date().toISOString(),
      note: "Using mock data - configure Supabase for production reports"
    };
  }

  /**
   * Calculate week boundaries
   * @param {Date} weekStart - Start of the week
   * @returns {Object} Week start and end dates
   */
  calculateWeekBoundaries(weekStart = null) {
    const now = new Date();
    const start = weekStart || new Date(now);
    
    // Set to start of week (Monday)
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    // End of week (Sunday)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { start: monday, end: sunday };
  }

  /**
   * Fetch weekly data from Supabase
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Object} week - Week boundaries
   * @returns {Promise<Object>} Weekly data
   */
  async fetchWeeklyData(userId, role, week) {
    if (!this.supabaseEnabled) {
      console.warn('Supabase not configured, returning mock weekly data.');
      return this.getMockWeeklyData(userId, role, week);
    }

    let missionsQuery = this.supabase
      .from('missions_log')
      .select('*')
      .gte('timestamp', week.start.toISOString())
      .lt('timestamp', week.end.toISOString());

    let expensesQuery = this.supabase
      .from('expenses')
      .select('*')
      .gte('created_at', week.start.toISOString())
      .lt('created_at', week.end.toISOString());

    // Filter by role
    if (role === 'runner') {
      missionsQuery = missionsQuery.eq('runner_id', userId);
      expensesQuery = expensesQuery.eq('runner_id', userId);
    } else if (role === 'client') {
      missionsQuery = missionsQuery.eq('client_id', userId);
    }
    // Admin gets all data

    const [missionsResult, expensesResult] = await Promise.all([
      missionsQuery,
      expensesQuery
    ]);

    if (missionsResult.error) throw new Error(missionsResult.error.message);
    if (expensesResult.error) throw new Error(expensesResult.error.message);

    const missions = missionsResult.data || [];
    const expenses = expensesResult.data || [];

    // Calculate totals
    const totalBudget = missions.reduce((sum, mission) => sum + (mission.budget || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return {
      missions,
      expenses,
      totalBudget,
      totalExpenses,
      week
    };
  }

  /**
   * Get mock weekly data when Supabase is not configured
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Object} week - Week boundaries
   * @returns {Object} Mock weekly data
   */
  getMockWeeklyData(userId, role, week) {
    const mockMissions = [
      {
        id: 'mission-1',
        address: '123 Main St, New York, NY',
        budget: 500,
        status: 'completed',
        runner_id: 'runner-001',
        client_id: 'client-001',
        timestamp: new Date(week.start.getTime() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mission-2',
        address: '456 Broadway, New York, NY',
        budget: 750,
        status: 'completed',
        runner_id: 'runner-002',
        client_id: 'client-002',
        timestamp: new Date(week.start.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockExpenses = [
      {
        id: 'expense-1',
        mission_id: 'mission-1',
        amount: 50,
        category: 'transportation',
        description: 'Subway fare',
        created_at: new Date(week.start.getTime() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'expense-2',
        mission_id: 'mission-2',
        amount: 75,
        category: 'equipment',
        description: 'Equipment rental',
        created_at: new Date(week.start.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const totalBudget = mockMissions.reduce((sum, mission) => sum + (mission.budget || 0), 0);
    const totalExpenses = mockExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return {
      missions: mockMissions,
      expenses: mockExpenses,
      totalBudget,
      totalExpenses,
      week
    };
  }

  /**
   * Generate CSV report
   * @param {Object} data - Weekly data
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Object} week - Week boundaries
   * @returns {Promise<string>} CSV file URL
   */
  async generateCSVReport(data, userId, role, week) {
    const filename = `weekly_report_${role}_${userId}_${week.start.toISOString().split('T')[0]}.csv`;
    const filepath = path.join(this.reportsDir, filename);
    
    let csvContent = 'Timestamp,Mission ID,Runner ID,Client ID,Status,Address,Budget,DJ Service Pack,Action Type,Action Details,Week,Year\n';
    
    // Add mission data
    data.missions.forEach(mission => {
      csvContent += `${mission.timestamp},${mission.mission_id},${mission.runner_id},${mission.client_id},${mission.status},${mission.address},${mission.budget},${mission.dj_service_pack},${mission.action_type},${mission.action_details},${mission.week_number},${mission.year}\n`;
    });
    
    // Add expenses if any
    if (data.expenses.length > 0) {
      csvContent += '\nExpenses\n';
      csvContent += 'Date,Description,Amount,Category,Runner ID\n';
      data.expenses.forEach(expense => {
        csvContent += `${expense.created_at},${expense.description},${expense.amount},${expense.category},${expense.runner_id}\n`;
      });
    }
    
    // Add summary
    csvContent += `\nSummary\n`;
    csvContent += `Total Budget,${data.totalBudget}\n`;
    csvContent += `Total Expenses,${data.totalExpenses}\n`;
    csvContent += `Net,${data.totalBudget - data.totalExpenses}\n`;
    
    await fs.writeFile(filepath, csvContent);
    
    // Upload to Supabase Storage
    const { data: uploadData, error } = await this.supabase.storage
      .from('weekly-reports')
      .upload(filename, await fs.readFile(filepath), {
        contentType: 'text/csv'
      });
    
    if (error) throw new Error(`Storage upload error: ${error.message}`);
    
    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('weekly-reports')
      .getPublicUrl(filename);
    
    return urlData.publicUrl;
  }

  /**
   * Generate PDF report
   * @param {Object} data - Weekly data
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Object} week - Week boundaries
   * @returns {Promise<string>} PDF file URL
   */
  async generatePDFReport(data, userId, role, week) {
    const filename = `weekly_report_${role}_${userId}_${week.start.toISOString().split('T')[0]}.pdf`;
    const filepath = path.join(this.reportsDir, filename);
    
    // Generate HTML content
    const htmlContent = this.generateHTMLReport(data, userId, role, week);
    
    // Convert to PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({
      path: filepath,
      format: 'A4',
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' }
    });
    await browser.close();
    
    // Upload to Supabase Storage
    const { data: uploadData, error } = await this.supabase.storage
      .from('weekly-reports')
      .upload(filename, await fs.readFile(filepath), {
        contentType: 'application/pdf'
      });
    
    if (error) throw new Error(`Storage upload error: ${error.message}`);
    
    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('weekly-reports')
      .getPublicUrl(filename);
    
    return urlData.publicUrl;
  }

  /**
   * Generate Excel report
   * @param {Object} data - Weekly data
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Object} week - Week boundaries
   * @returns {Promise<string>} Excel file URL
   */
  async generateExcelReport(data, userId, role, week) {
    const filename = `weekly_report_${role}_${userId}_${week.start.toISOString().split('T')[0]}.xlsx`;
    const filepath = path.join(this.reportsDir, filename);
    
    const workbook = new ExcelJS.Workbook();
    
    // Missions sheet
    const missionsSheet = workbook.addWorksheet('Missions');
    missionsSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 20 },
      { header: 'Mission ID', key: 'mission_id', width: 15 },
      { header: 'Runner ID', key: 'runner_id', width: 15 },
      { header: 'Client ID', key: 'client_id', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Budget', key: 'budget', width: 15 },
      { header: 'DJ Service Pack', key: 'dj_service_pack', width: 20 },
      { header: 'Action Type', key: 'action_type', width: 20 },
      { header: 'Action Details', key: 'action_details', width: 30 }
    ];
    
    data.missions.forEach(mission => {
      missionsSheet.addRow(mission);
    });
    
    // Expenses sheet
    if (data.expenses.length > 0) {
      const expensesSheet = workbook.addWorksheet('Expenses');
      expensesSheet.columns = [
        { header: 'Date', key: 'created_at', width: 20 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Runner ID', key: 'runner_id', width: 15 }
      ];
      
      data.expenses.forEach(expense => {
        expensesSheet.addRow(expense);
      });
    }
    
    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow(['Weekly Report Summary']);
    summarySheet.addRow(['']);
    summarySheet.addRow(['Total Budget', data.totalBudget]);
    summarySheet.addRow(['Total Expenses', data.totalExpenses]);
    summarySheet.addRow(['Net', data.totalBudget - data.totalExpenses]);
    summarySheet.addRow(['Mission Count', data.missions.length]);
    summarySheet.addRow(['Expense Count', data.expenses.length]);
    
    await workbook.xlsx.writeFile(filepath);
    
    // Upload to Supabase Storage
    const { data: uploadData, error } = await this.supabase.storage
      .from('weekly-reports')
      .upload(filename, await fs.readFile(filepath), {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    
    if (error) throw new Error(`Storage upload error: ${error.message}`);
    
    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('weekly-reports')
      .getPublicUrl(filename);
    
    return urlData.publicUrl;
  }

  /**
   * Generate HTML content for PDF
   * @param {Object} data - Weekly data
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Object} week - Week boundaries
   * @returns {string} HTML content
   */
  generateHTMLReport(data, userId, role, week) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Club Run Weekly Report</h1>
          <p>${role.toUpperCase()} - Week of ${week.start.toLocaleDateString()} to ${week.end.toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Budget:</strong> $${data.totalBudget}</p>
          <p><strong>Total Expenses:</strong> $${data.totalExpenses}</p>
          <p><strong>Net:</strong> $${data.totalBudget - data.totalExpenses}</p>
          <p><strong>Missions:</strong> ${data.missions.length}</p>
          <p><strong>Expenses:</strong> ${data.expenses.length}</p>
        </div>
        
        <h2>Missions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mission ID</th>
              <th>Status</th>
              <th>Address</th>
              <th>Budget</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.missions.map(mission => `
              <tr>
                <td>${new Date(mission.timestamp).toLocaleDateString()}</td>
                <td>${mission.mission_id}</td>
                <td>${mission.status}</td>
                <td>${mission.address}</td>
                <td>$${mission.budget}</td>
                <td>${mission.action_type}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${data.expenses.length > 0 ? `
          <h2>Expenses</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${data.expenses.map(expense => `
                <tr>
                  <td>${new Date(expense.created_at).toLocaleDateString()}</td>
                  <td>${expense.description}</td>
                  <td>$${expense.amount}</td>
                  <td>${expense.category}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </body>
      </html>
    `;
  }

  /**
   * Store report metadata in Supabase
   * @param {Object} metadata - Report metadata
   */
  async storeReportMetadata(metadata) {
    if (!this.supabaseEnabled) {
      console.warn('Supabase not configured, skipping report metadata storage.');
      return;
    }

    const { error } = await this.supabase
      .from('weekly_reports')
      .insert([metadata]);
    
    if (error) {
      console.error('Failed to store report metadata:', error);
    }
  }

  /**
   * Get user's available reports
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Available reports
   */
  async getUserReports(userId) {
    if (!this.supabaseEnabled) {
      console.warn('Supabase not configured, returning mock reports.');
      return this.getMockUserReports(userId);
    }

    const { data, error } = await this.supabase
      .from('weekly_reports')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  /**
   * Get mock user reports when Supabase is not configured
   * @param {string} userId - User ID
   * @returns {Array} Mock reports
   */
  getMockUserReports(userId) {
    return [
      {
        id: 'report-1',
        user_id: userId,
        role: 'runner',
        week_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        week_end: new Date().toISOString(),
        csv_url: 'https://demo.example.com/reports/report-1.csv',
        pdf_url: 'https://demo.example.com/reports/report-1.pdf',
        excel_url: 'https://demo.example.com/reports/report-1.xlsx',
        generated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        mission_count: 8,
        expense_count: 3,
        total_budget: 4000,
        total_expenses: 450
      }
    ];
  }
}

module.exports = WeeklyReportGenerator; 