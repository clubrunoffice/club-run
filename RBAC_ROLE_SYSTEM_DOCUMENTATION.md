# 🔐 RBAC Role-Based Access Control System

## Overview

Club Run implements a comprehensive Role-Based Access Control (RBAC) system with distinct roles for different user types. The system includes **three layers of access control**:

1. **ProtectedRoute**: Authentication-level access control
2. **PermissionGate**: UI element visibility control
3. **Role-Based Content Filtering**: Dynamic content filtering based on user role

## 🎯 Role Hierarchy

```
GUEST (0) < RUNNER (1) < DJ (1) < VERIFIED_DJ (2) < CLIENT (3) < CURATOR (4) < OPERATIONS (5) < PARTNER (6) < ADMIN (7)
```

### Dual Role Support
Users can have **combined roles** to access features from multiple role types:
- **DJ + RUNNER**: Gets both DJ gig permissions AND runner service permissions
- **Example**: A DJ who also runs delivery missions can track expenses and accept both gig and service missions
- **Implementation**: Role string includes both roles (e.g., "DJ+RUNNER" or role checks for `.includes('RUNNER')`)
- **UI Behavior**: Navigation and features adapt based on combined permissions

## 🔐 Three-Layer Access Control System

### Layer 1: ProtectedRoute (Authentication)
```typescript
// Wraps entire routes - ensures user is authenticated
<ProtectedRoute>
  <Missions />
</ProtectedRoute>
```
- **Purpose**: Verify user authentication before page access
- **Action**: Redirects unauthenticated users to login
- **Scope**: Route-level protection
- **Example**: `/missions` requires authentication

### Layer 2: PermissionGate (UI Element Control)
```typescript
// Controls visibility of specific UI elements
<PermissionGate resource="missions" action="create">
  <button>Create Mission</button>
</PermissionGate>
```
- **Purpose**: Show/hide UI elements based on permissions
- **Action**: Conditionally renders components
- **Scope**: Component-level protection
- **Example**: Only CLIENT, CURATOR, ADMIN can see "Create Mission" button

### Layer 3: Role-Based Content Filtering (Dynamic Data)
```typescript
// Filters mission content based on user role
const filteredMissions = allMissions.filter(mission => 
  mission.targetRole?.includes(userRole)
);
```
- **Purpose**: Display role-appropriate content
- **Action**: Filters data before rendering
- **Scope**: Data-level protection
- **Example**: DJs see only gig missions, RUNNERs see only service missions

## 🎭 Mission Role Targeting

### Mission Types by Role

**DJ/VERIFIED_DJ Missions (Gig Type)**:
- Corporate events and holiday parties
- Wedding receptions with MC services
- Club night residencies
- Festival performances
- Private party entertainment

**RUNNER Missions (Service Type)**:
- Equipment delivery and pickup
- Flyer distribution and marketing
- Vinyl record handling and cataloging
- Event setup assistance
- Music gear transportation

**CLIENT Missions**:
- Can create missions targeting specific roles
- See all missions they've created
- Manage mission applicants

**CURATOR Missions**:
- See all platform missions
- Assign missions to team members
- Manage multiple role assignments

**ADMIN/OPERATIONS Missions**:
- Full visibility to all missions
- Platform oversight and management
- System-wide mission control

### Role Levels and Permissions

| Role | Level | Description | Mission Access | Key Permissions |
|------|-------|-------------|----------------|-----------------|
| **GUEST** | 0 | Unregistered users | None - must authenticate | Public read, auth login/register |
| **RUNNER** | 1 | Service providers | Service missions only | Apply, accept service missions |
| **DJ** | 1 | Basic DJ account | Gig missions only | Apply, accept gig missions |
| **VERIFIED_DJ** | 2 | Verified DJ with Serato access | Premium gig missions | Serato integration, exclusive gigs |
| **CLIENT** | 3 | Event organizers, labels | All missions (view only) | Create missions, manage bookings |
| **CURATOR** | 4 | Content curators, team managers | All missions (assign teams) | Team management, mission assignment |
| **OPERATIONS** | 5 | Platform operations team | All missions (oversight) | User verification, system management |
| **PARTNER** | 6 | Business partners | Relevant partnership missions | Analytics, partner features |
| **ADMIN** | 7 | System administrators | All missions (full control) | Full system access |

## 🔑 Detailed Role Permissions

### GUEST (Level 0)
```javascript
permissions: [
  'public:read',
  'auth:login',
  'auth:register'
]
```
- Access public pages and information
- Register new accounts
- Login to existing accounts

### DJ (Level 1) - Basic DJ
```javascript
permissions: [
  'public:read',
  'auth:login',
  'auth:register',
  'user:read',
  'user:update',
  'missions:read',
  'missions:apply',
  'missions:accept',
  'missions:complete',
  'checkins:create',
  'checkins:read',
  'chat:read',
  'chat:send',
  'p2p-missions:accept',
  'p2p-missions:complete',
  'payments:receive',
  'online-status:toggle'  // ✅ Can go online to receive missions
]
```
- Basic DJ functionality focused on music/gig missions
- Apply for and accept gig missions (including P2P)
- Create check-ins at venues
- Chat with other users
- Receive payments for completed gigs
- **✅ Go Online/Offline** - Toggle availability for receiving gig missions
- **❌ NO EXPENSES** - DJs do not track expenses (use RUNNER role for that)
- **Cannot access Serato automatic verification**

**Note on DJ + RUNNER Dual Role**: 
- DJs who also want to run service missions can opt-in to RUNNER role
- Dual role users get combined permissions including `expenses:create` and `expenses:read`
- Expenses menu item only appears if user has RUNNER role or role includes "RUNNER"

### VERIFIED_DJ (Level 2) - Verified DJ
```javascript
permissions: [
  // All DJ permissions +
  'serato:connect',
  'serato:verify',
  'online-status:toggle'  // ✅ Can go online to receive missions
]
```
- All DJ permissions
- **Serato account connection**
- **Automatic mission verification**
- **Seamless mission completion**
- **Professional proof logging**
- **✅ Go Online/Offline** - Toggle availability with verified status

### CLIENT (Level 3)
```javascript
permissions: [
  // Basic permissions +
  'missions:create',
  'missions:read',
  'missions:update',
  'missions:delete',
  'p2p-missions:create',
  'p2p-missions:read',
  'p2p-missions:update',
  'p2p-missions:delete',
  'payments:send',
  'chat:read',
  'chat:send'
]
```
- Create and manage missions
- Send payments to DJs
- Access mission analytics

### CURATOR (Level 4)
```javascript
permissions: [
  // All CLIENT permissions +
  'teams:create',
  'teams:read',
  'teams:update',
  'teams:delete'
]
```
- All CLIENT permissions
- Team management
- Content curation
- Advanced mission features

### OPERATIONS (Level 5)
```javascript
permissions: [
  // Basic permissions +
  'user:read',
  'user:update',
  'user:verify',
  'user:delete',
  'missions:read',
  'missions:update',
  'missions:delete',
  'p2p-missions:read',
  'p2p-missions:update',
  'p2p-missions:delete',
  'teams:read',
  'teams:update',
  'teams:delete',
  'stats:read',
  'logs:read',
  'payments:read',
  'payments:process',
  'chat:read',
  'chat:send',
  'chat:moderate'
]
```
- **DJ verification management**
- System monitoring and maintenance
- Payment processing oversight
- User account management
- Platform operations

### PARTNER (Level 6)
```javascript
permissions: [
  // Basic permissions +
  'user:read',
  'user:update',
  'missions:read',
  'missions:update',
  'p2p-missions:read',
  'p2p-missions:update',
  'teams:read',
  'teams:update',
  'stats:read',
  'payments:read',
  'chat:read',
  'chat:send'
]
```
- Business partner features
- Analytics and reporting
- Partner-specific functionality

### ADMIN (Level 7)
```javascript
permissions: [
  '*:*' // All permissions
]
```
- Complete system access
- Role management
- System configuration
- Full administrative control

## 🔄 DJ Verification Process

### 1. User Registration
- User signs up as **DJ** role
- Account starts with basic permissions
- Can accept and complete P2P missions
- Cannot access Serato automatic verification

### 2. Profile Completion
- User completes profile information
- Adds profile picture and bio
- Builds initial activity (check-ins, basic missions)

### 3. Operations Review
- Operations team reviews user profile
- Checks user activity and engagement
- Reviews any submitted materials

### 4. Verification Decision
- **Approve**: Upgrade to **VERIFIED_DJ** role
- **Reject**: Keep as **DJ** role with feedback

### 5. Post-Verification
- **VERIFIED_DJ** users can:
  - Connect Serato accounts
  - Use automatic verification for mission completion
  - Get seamless payment processing
  - Build professional proof portfolio

## 🛠 Implementation Details

### Backend RBAC Middleware

```javascript
// Enhanced RBAC middleware with role hierarchy
const ROLE_HIERARCHY = {
  GUEST: 0,
  RUNNER: 1,
  VERIFIED_DJ: 2,
  CLIENT: 3,
  CURATOR: 4,
  OPERATIONS: 5,
  PARTNER: 6,
  ADMIN: 7
};

// Role-specific middleware functions
const requireVerifiedDJ = (req, res, next) => {
  if (req.user.role !== 'VERIFIED_DJ') {
    return res.status(403).json({ 
      error: 'Access denied. Verified DJ privileges required.',
      message: 'Your account must be verified by operations to access this feature.'
    });
  }
  next();
};

const requireRunnerOrVerifiedDJ = (req, res, next) => {
  if (!['RUNNER', 'VERIFIED_DJ'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Access denied. Runner or Verified DJ privileges required.'
    });
  }
  next();
};
```

### API Endpoints with Role Protection

```javascript
// Serato integration (VERIFIED_DJ only)
router.get('/api/serato/connect', authenticateToken, requireVerifiedDJ, ...);
router.get('/api/serato/status', authenticateToken, requireVerifiedDJ, ...);
router.post('/api/serato/refresh', authenticateToken, requireVerifiedDJ, ...);

// P2P mission acceptance (DJ or VERIFIED_DJ)
router.post('/api/p2p-missions/:id/accept', authenticateToken, requireRunnerOrVerifiedDJ, ...);

// Runner verification management (OPERATIONS/ADMIN only)
router.get('/api/admin/runner-verification-requests', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), ...);
router.post('/api/admin/verify-runner/:userId', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), ...);
```

### Database Schema Updates

```sql
-- User model includes role field
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  name             String
  role             String    @default("RUNNER") // GUEST, RUNNER, VERIFIED_DJ, CLIENT, CURATOR, OPERATIONS, PARTNER, ADMIN
  
  // Serato integration fields (for VERIFIED_DJ)
  seratoAccessToken     String?
  seratoRefreshToken    String?
  seratoTokenExpiresAt  DateTime?
  seratoUsername        String?
  seratoDisplayName     String?
  seratoConnectedAt     DateTime?
  
  // ... other fields
}
```

## 🎨 Frontend Implementation

### Signup Form with Role Selection

```typescript
// Enhanced signup form with role descriptions
const roleOptions = [
  {
    value: 'CLIENT',
    label: 'Client',
    description: 'I need music services for my events',
    icon: User
  },
  {
    value: 'RUNNER',
    label: 'Runner (DJ)',
    description: "I'm a DJ who wants to earn money playing music",
    warning: '⚠️ Requires manual verification by operations to access Serato integration',
    icon: Briefcase
  },
  {
    value: 'CURATOR',
    label: 'Curator',
    description: 'I manage and oversee platform operations',
    icon: Shield
  }
];
```

### DJ Verification Status Component

```typescript
// Shows verification status for DJ users
export function DJVerificationStatus() {
  const { user } = useAuth();
  
  if (user?.role === 'DJ') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3>Pending Verification</h3>
        <p>Your account is being reviewed by operations...</p>
      </div>
    );
  }
  
  if (user?.role === 'VERIFIED_DJ') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3>Verified DJ</h3>
        <p>You have access to automatic verification!</p>
      </div>
    );
  }
}
```

### Operations Dashboard

```typescript
// DJ verification management dashboard
export function DJVerificationDashboard() {
  // Load pending verification requests
  // Display user statistics
  // Provide verify/reject actions
  // Track verification metrics
}
```

## 📊 Verification Workflow

### 1. User Journey
```
Signup as RUNNER → Complete Profile → Wait for Verification → Get VERIFIED_DJ → Access Serato
```

### 2. Operations Workflow
```
Review Pending Requests → Check DJ Activity → Make Decision → Update Role → Notify User
```

### 3. System Flow
```
RUNNER Role → Limited Permissions → Manual Review → VERIFIED_DJ Role → Full DJ Features
```

## 🔒 Security Considerations

### Role Escalation Protection
- Only OPERATIONS and ADMIN can upgrade RUNNER to VERIFIED_DJ
- All role changes are logged with audit trail
- Verification decisions include notes and reasons

### Permission Validation
- All API endpoints validate user roles
- Frontend components check role before rendering features
- Database queries filter by appropriate permissions

### Audit Logging
```javascript
// Log all role changes
await prisma.systemLog.create({
  data: {
    level: 'info',
    message: `DJ verified: ${user.name} (${user.email})`,
    userId: req.user.id,
    metadata: {
      targetUserId: userId,
      oldRole: 'RUNNER',
      newRole: 'VERIFIED_DJ',
      verifiedBy: req.user.id,
      verificationNotes: verificationNotes
    }
  }
});
```

## 📈 Monitoring and Analytics

### Verification Metrics
- Total RUNNER accounts
- Total VERIFIED_DJ accounts
- Verification approval rate
- Average verification time
- Recent verification activity

### Role Distribution
- Track role distribution across platform
- Monitor role changes over time
- Identify verification bottlenecks

## 🚀 Benefits of This System

### For Platform Security
- **Controlled access** to sensitive features
- **Manual verification** prevents abuse
- **Audit trail** for all role changes
- **Scalable permissions** system

### For DJs
- **Clear progression path** from DJ to VERIFIED_DJ
- **Transparent verification process**
- **Protected access** to premium features
- **Professional credibility** through verification

### For Operations
- **Centralized verification management**
- **Comprehensive user review process**
- **Detailed analytics and reporting**
- **Efficient workflow tools**

### For Platform Growth
- **Quality control** through verification
- **Trust building** with verified DJs
- **Scalable role management**
- **Professional platform reputation**

---

## 🎯 Summary

The RBAC system with **VERIFIED_DJ** role ensures:

1. **DJ** users can accept and complete missions (including P2P)
2. **Manual verification** by operations is required for Serato automatic verification
3. **VERIFIED_DJ** users get seamless automatic verification and payment processing
4. **Clear role hierarchy** with proper permission separation
5. **Comprehensive audit trail** for all role changes
6. **Scalable system** that grows with the platform

This creates a professional, secure, and trustworthy environment for DJs while maintaining platform quality and integrity.
