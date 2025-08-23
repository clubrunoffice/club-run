# 🌐 Club Run P2P Mission System

A **peer-to-peer decentralized flow** for curator missions with multi-payment options (crypto, fiat, digital transfers). This combines Web2 convenience with Web3 decentralization.

## 🎯 **Decentralized Mission Architecture**

```
Curator Creates Mission → Smart Contract Escrow → Runner Matching (P2P) → Mission Execution → Multi-Payment Release
     ↓                        ↓                      ↓                    ↓                    ↓
Web2/Web3 UI            Blockchain Escrow      Decentralized Network   Proof Verification   Fiat/Crypto Payout
```

## 🚀 **Quick Start**

### 1. **Smart Contract Deployment**

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat deploy --network mumbai  # Testnet
npx hardhat deploy --network polygon # Mainnet
```

### 2. **Backend Setup**

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm start
```

### 3. **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

## 💰 **Multi-Payment Smart Contract**

### **Features**
- **Crypto Payments**: MATIC (Polygon), USDC, USDT
- **Traditional Payments**: Cash App, Zelle, Venmo, PayPal
- **Blockchain Escrow**: Secure payment protection
- **IPFS Storage**: Decentralized mission details and proof
- **Reputation System**: User trust scores
- **Dispute Resolution**: Built-in arbitration system

### **Contract Addresses**
- **Mumbai Testnet**: `0x...` (Update after deployment)
- **Polygon Mainnet**: `0x...` (Update after deployment)

## 🌐 **Frontend Components**

### **P2P Mission Creator**
- Create missions with detailed requirements
- Choose from 6+ payment methods
- Upload mission details to IPFS
- Set budget and deadlines

### **P2P Mission Board**
- Browse decentralized missions
- Filter by payment type, budget, status
- Accept missions directly (P2P)
- View mission details and curator info

### **Payment Integration**
- **Crypto**: Direct smart contract integration
- **Fiat**: Manual payment instructions with notifications
- **Hybrid**: Seamless switching between payment types

## 🔧 **Backend Services**

### **IPFS Service**
```javascript
// Upload mission details
const ipfsHash = await ipfsService.uploadMissionDetails(missionData);

// Upload proof of completion
const proofHash = await ipfsService.uploadProof(proofData);

// Fetch data from IPFS
const details = await ipfsService.fetchFromIPFS(hash);
```

### **Hybrid Payment Service**
```javascript
// Process different payment methods
const result = await hybridPaymentService.processPayment(
  'cashapp',    // Payment method
  500,          // Amount
  recipientInfo, // Recipient details
  missionId,    // Mission ID
  curatorId     // Curator ID
);
```

### **P2P Mission Routes**
- `GET /api/p2p-missions` - Browse missions
- `POST /api/p2p-missions` - Create mission
- `POST /api/p2p-missions/:id/accept` - Accept mission
- `POST /api/p2p-missions/:id/proof` - Submit proof
- `POST /api/p2p-missions/:id/approve` - Approve and pay

## 📊 **Database Schema**

### **P2pMission Model**
```sql
CREATE TABLE p2p_missions (
  id TEXT PRIMARY KEY,
  curator_id TEXT NOT NULL,
  runner_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  venue_address TEXT,
  event_type TEXT,
  budget REAL NOT NULL,
  deadline DATETIME NOT NULL,
  payment_method TEXT NOT NULL,
  ipfs_hash TEXT NOT NULL,
  proof_hash TEXT,
  status TEXT DEFAULT 'OPEN',
  requirements TEXT,
  assigned_at DATETIME,
  proof_submitted_at DATETIME,
  completed_at DATETIME,
  cancelled_at DATETIME,
  payment_details TEXT,
  dispute_raised_by TEXT,
  dispute_reason TEXT,
  dispute_evidence TEXT,
  dispute_raised_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 **Environment Variables**

### **Backend (.env)**
```bash
# Database
DATABASE_URL="file:./dev.db"

# IPFS Configuration
IPFS_HOST="ipfs.infura.io"
IPFS_PORT=5001
IPFS_PROTOCOL="https"
INFURA_PROJECT_ID="your_infura_project_id"
INFURA_SECRET="your_infura_secret"

# Pinata (IPFS Backup)
PINATA_API_KEY="your_pinata_api_key"
PINATA_SECRET_KEY="your_pinata_secret_key"

# Smart Contract
ESCROW_CONTRACT_ADDRESS="0x..." # Update after deployment
POLYGON_RPC_URL="https://polygon-rpc.com"
```

### **Frontend (.env)**
```bash
VITE_API_URL="http://localhost:3000"
VITE_ESCROW_CONTRACT_ADDRESS="0x..." # Update after deployment
VITE_POLYGON_RPC_URL="https://polygon-rpc.com"
```

## 🎯 **Complete P2P Flow**

### **1. Mission Creation (Curator)**
1. Navigate to `/p2p-missions` → "Create Mission"
2. Fill in mission details (title, description, budget, deadline)
3. Select payment method (crypto/fiat)
4. Mission details uploaded to IPFS
5. Smart contract escrow created (crypto) or payment instruction (fiat)

### **2. Mission Discovery (Runner)**
1. Browse mission board at `/p2p-missions`
2. Filter by payment type, budget, location
3. View mission details from IPFS
4. Accept mission directly (P2P, no intermediary)

### **3. Mission Execution**
1. Runner completes work
2. Submits proof to IPFS (photos, audio, notes)
3. Proof hash recorded on blockchain
4. Mission status updated to "IN_PROGRESS"

### **4. Payment Release**
1. **Crypto**: Automatic smart contract release
2. **Fiat**: Curator receives notification to send payment
3. All payments recorded on blockchain for transparency

## 🌟 **Benefits of P2P Approach**

- ✅ **True decentralization** - no platform middleman
- ✅ **Payment flexibility** - crypto AND traditional methods
- ✅ **Global accessibility** - work across borders
- ✅ **Transparent escrow** - blockchain-secured payments
- ✅ **Zero platform fees** - direct curator-to-runner payments
- ✅ **Immutable proof** - IPFS-stored mission details and proof
- ✅ **Reputation system** - build trust over time

## 🔧 **Development**

### **Running Tests**
```bash
# Smart Contract Tests
cd contracts
npx hardhat test

# Backend Tests
cd backend
npm test

# Frontend Tests
cd frontend
npm test
```

### **Local Development**
```bash
# Start local blockchain
npx hardhat node

# Deploy contracts locally
npx hardhat deploy --network localhost

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

## 📈 **Deployment**

### **Smart Contracts**
```bash
# Deploy to Mumbai testnet
npx hardhat deploy --network mumbai

# Deploy to Polygon mainnet
npx hardhat deploy --network polygon

# Verify on Etherscan
npx hardhat verify --network polygon 0xCONTRACT_ADDRESS
```

### **Backend**
```bash
# Deploy to Vercel
vercel --prod

# Deploy to Railway
railway up
```

### **Frontend**
```bash
# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

## 🆘 **Support**

- **Documentation**: [P2P_MISSIONS_README.md](./P2P_MISSIONS_README.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discord**: [Club Run Community](https://discord.gg/clubrun)

---

**Built with ❤️ by the Club Run Team**

*Combining Web2 convenience with Web3 decentralization for the future of music servicing.*
