const { ethers } = require('ethers');
const crypto = require('crypto');

class HybridPaymentService {
  
  constructor() {
    this.paymentInstructions = new Map();
    this.webhookHandlers = new Map();
  }

  /**
   * Process payment based on selected method
   */
  async processPayment(
    paymentMethod,
    amount,
    recipientInfo,
    missionId,
    curatorId
  ) {
    
    switch (paymentMethod) {
      case 'matic':
      case 'usdc':
        return await this.processCryptoPayment(paymentMethod, amount, recipientInfo, missionId);
      
      case 'cashapp':
        return await this.processCashAppPayment(amount, recipientInfo, missionId, curatorId);
      
      case 'zelle':
        return await this.processZellePayment(amount, recipientInfo, missionId, curatorId);
      
      case 'venmo':
        return await this.processVenmoPayment(amount, recipientInfo, missionId, curatorId);
      
      case 'paypal':
        return await this.processPayPalPayment(amount, recipientInfo, missionId, curatorId);
      
      default:
        throw new Error('Unsupported payment method');
    }
  }

  /**
   * Crypto payments (handled by smart contract)
   */
  private async processCryptoPayment(
    method, 
    amount, 
    recipientInfo, 
    missionId
  ) {
    // This is triggered by smart contract event
    // Payment already held in escrow
    return {
      success: true,
      transactionId: recipientInfo.blockchainTxHash || this.generateTransactionId(),
      paymentMethod: method,
      amount,
      fees: method === 'matic' ? 0.01 : 0.02, // Gas fees
      status: 'completed',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Cash App integration
   */
  async processCashAppPayment(
    amount, 
    recipientInfo, 
    missionId,
    curatorId
  ) {
    const payload = {
      amount,
      recipient: recipientInfo.cashAppHandle || recipientInfo.email,
      note: `Club Run Mission Payment - ${missionId}`,
      source: 'curator_account',
      missionId,
      curatorId
    };

    const instruction = await this.createPaymentInstruction('cashapp', payload);
    
    return {
      success: true,
      transactionId: instruction.id,
      paymentMethod: 'cashapp',
      amount,
      fees: 0,
      status: 'pending',
      instruction: this.getPaymentInstructions('cashapp', payload),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Zelle integration
   */
  async processZellePayment(
    amount, 
    recipientInfo, 
    missionId,
    curatorId
  ) {
    const payload = {
      amount,
      recipient: recipientInfo.email || recipientInfo.phone,
      memo: `Club Run Mission - ${missionId}`,
      type: 'zelle_transfer',
      missionId,
      curatorId
    };

    const instruction = await this.createPaymentInstruction('zelle', payload);
    
    return {
      success: true,
      transactionId: instruction.id,
      paymentMethod: 'zelle',
      amount,
      fees: 0,
      status: 'pending',
      instruction: this.getPaymentInstructions('zelle', payload),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Venmo integration
   */
  async processVenmoPayment(
    amount, 
    recipientInfo, 
    missionId,
    curatorId
  ) {
    const payload = {
      amount,
      recipient: recipientInfo.venmoHandle,
      note: `🎵 Club Run Mission Payment`,
      audience: 'private',
      missionId,
      curatorId
    };

    const instruction = await this.createPaymentInstruction('venmo', payload);
    
    return {
      success: true,
      transactionId: instruction.id,
      paymentMethod: 'venmo',
      amount,
      fees: 0,
      status: 'pending',
      instruction: this.getPaymentInstructions('venmo', payload),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * PayPal integration
   */
  async processPayPalPayment(
    amount, 
    recipientInfo, 
    missionId,
    curatorId
  ) {
    const payload = {
      amount,
      recipient: recipientInfo.paypalEmail,
      note: `Club Run Mission Payment - ${missionId}`,
      currency: 'USD',
      missionId,
      curatorId
    };

    const instruction = await this.createPaymentInstruction('paypal', payload);
    
    return {
      success: true,
      transactionId: instruction.id,
      paymentMethod: 'paypal',
      amount,
      fees: amount * 0.029 + 0.30, // PayPal fee structure
      status: 'pending',
      instruction: this.getPaymentInstructions('paypal', payload),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create manual payment instruction for fiat methods
   */
  async createPaymentInstruction(method, payload) {
    const instructionId = this.generateTransactionId();
    
    const instruction = {
      id: instructionId,
      payment_method: method,
      payload: payload,
      status: 'pending',
      created_at: new Date(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    // Store in memory (in production, use database)
    this.paymentInstructions.set(instructionId, instruction);
    
    // Notify curator to complete payment
    await this.notifyCuratorPayment(method, payload, instructionId);
    
    return instruction;
  }

  /**
   * Notify curator to complete fiat payment
   */
  async notifyCuratorPayment(method, payload, instructionId) {
    const notification = {
      type: 'payment_required',
      method,
      amount: payload.amount,
      recipient: payload.recipient,
      instructions: this.getPaymentInstructions(method, payload),
      instructionId,
      missionId: payload.missionId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    // In production, send via WebSocket or push notification
    console.log('Payment notification:', notification);
    
    // Store notification for curator dashboard
    this.storePaymentNotification(payload.curatorId, notification);
  }

  /**
   * Get payment instructions for different methods
   */
  getPaymentInstructions(method, payload) {
    const instructions = {
      cashapp: {
        steps: [
          "Open Cash App on your phone",
          "Tap the '$' button",
          "Enter amount: $" + payload.amount,
          "Tap 'Pay'",
          `Enter recipient: ${payload.recipient}`,
          "Add note: " + payload.note,
          "Tap 'Pay' to send"
        ],
        tips: [
          "Make sure you have sufficient balance",
          "Double-check the recipient handle",
          "Keep the payment receipt"
        ]
      },
      zelle: {
        steps: [
          "Open your banking app",
          "Find 'Zelle' or 'Send Money'",
          "Add recipient: " + payload.recipient,
          "Enter amount: $" + payload.amount,
          "Add memo: " + payload.memo,
          "Review and send"
        ],
        tips: [
          "Use the exact email/phone provided",
          "Zelle transfers are usually instant",
          "Save the confirmation number"
        ]
      },
      venmo: {
        steps: [
          "Open Venmo app",
          "Tap the 'Pay' button",
          `Search for: ${payload.recipient}`,
          "Enter amount: $" + payload.amount,
          "Add note: " + payload.note,
          "Set privacy to 'Private'",
          "Tap 'Pay'"
        ],
        tips: [
          "Make sure you're friends with the recipient",
          "Venmo payments are instant",
          "Keep the transaction ID"
        ]
      },
      paypal: {
        steps: [
          "Go to PayPal.com or open the app",
          "Click 'Send & Request'",
          "Enter recipient email: " + payload.recipient,
          "Enter amount: $" + payload.amount,
          "Add note: " + payload.note,
          "Select 'Friends and Family'",
          "Review and send"
        ],
        tips: [
          "Use 'Friends and Family' to avoid fees",
          "PayPal payments are usually instant",
          "Save the transaction ID"
        ]
      }
    };
    
    return instructions[method] || { steps: [], tips: [] };
  }

  /**
   * Store payment notification for curator
   */
  storePaymentNotification(curatorId, notification) {
    // In production, store in database
    const key = `payment_notification_${curatorId}`;
    const notifications = this.getStoredNotifications(curatorId);
    notifications.push(notification);
    
    // Store in memory (replace with database in production)
    if (!this.curatorNotifications) {
      this.curatorNotifications = new Map();
    }
    this.curatorNotifications.set(curatorId, notifications);
  }

  /**
   * Get stored notifications for curator
   */
  getStoredNotifications(curatorId) {
    if (!this.curatorNotifications) {
      this.curatorNotifications = new Map();
    }
    return this.curatorNotifications.get(curatorId) || [];
  }

  /**
   * Mark payment as completed
   */
  async markPaymentCompleted(instructionId, transactionDetails) {
    const instruction = this.paymentInstructions.get(instructionId);
    if (instruction) {
      instruction.status = 'completed';
      instruction.completed_at = new Date();
      instruction.transaction_details = transactionDetails;
      
      // Notify runner that payment is completed
      await this.notifyRunnerPaymentCompleted(instruction.payload.missionId, transactionDetails);
    }
  }

  /**
   * Notify runner that payment is completed
   */
  async notifyRunnerPaymentCompleted(missionId, transactionDetails) {
    const notification = {
      type: 'payment_completed',
      missionId,
      amount: transactionDetails.amount,
      method: transactionDetails.method,
      transactionId: transactionDetails.transactionId,
      timestamp: new Date().toISOString()
    };

    // In production, send via WebSocket or push notification
    console.log('Payment completed notification:', notification);
  }

  /**
   * Get payment status
   */
  getPaymentStatus(instructionId) {
    const instruction = this.paymentInstructions.get(instructionId);
    return instruction ? instruction.status : 'not_found';
  }

  /**
   * Generate unique transaction ID
   */
  generateTransactionId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Validate payment method
   */
  validatePaymentMethod(method) {
    const validMethods = ['matic', 'usdc', 'cashapp', 'zelle', 'venmo', 'paypal'];
    return validMethods.includes(method);
  }

  /**
   * Get payment method details
   */
  getPaymentMethodDetails(method) {
    const details = {
      matic: {
        name: 'MATIC (Polygon)',
        icon: '🔷',
        description: 'Direct peer-to-peer crypto payment',
        fees: '~$0.01 gas fee',
        processingTime: 'Instant',
        supported: true
      },
      usdc: {
        name: 'USDC Stablecoin',
        icon: '💵',
        description: 'USD-pegged stable cryptocurrency',
        fees: '~$0.02 gas fee',
        processingTime: 'Instant',
        supported: true
      },
      cashapp: {
        name: 'Cash App',
        icon: '💸',
        description: 'Instant mobile payment',
        fees: 'Free',
        processingTime: 'Instant',
        supported: true
      },
      zelle: {
        name: 'Zelle',
        icon: '🏦',
        description: 'Bank-to-bank transfer',
        fees: 'Free',
        processingTime: 'Instant',
        supported: true
      },
      venmo: {
        name: 'Venmo',
        icon: '💙',
        description: 'Social payment app',
        fees: 'Free for bank transfers',
        processingTime: 'Instant',
        supported: true
      },
      paypal: {
        name: 'PayPal',
        icon: '🔵',
        description: 'Global digital payments',
        fees: '2.9% + $0.30 (Friends & Family free)',
        processingTime: 'Instant',
        supported: true
      }
    };

    return details[method] || null;
  }

  /**
   * Calculate fees for payment method
   */
  calculateFees(method, amount) {
    const feeStructure = {
      matic: 0.01,
      usdc: 0.02,
      cashapp: 0,
      zelle: 0,
      venmo: 0,
      paypal: amount * 0.029 + 0.30
    };

    return feeStructure[method] || 0;
  }
}

module.exports = new HybridPaymentService();
