# 🎯 Club Run RBAC Integration Guide

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Recent Updates](#recent-updates)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Component Usage](#component-usage)
6. [Theming & Styling](#theming--styling)
7. [Permissions & Security](#permissions--security)
8. [Troubleshooting](#troubleshooting)
9. [Complete RBAC Spreadsheet](#complete-rbac-spreadsheet)

---

## 🎯 **Overview**

The Club Run RBAC (Role-Based Access Control) system provides comprehensive security and role-based UI/UX that dynamically adapts based on user roles. This system ensures users only see and can access features relevant to their role.

### **Key Features:**
- ✅ **Real-time role reflection** in UI
- ✅ **Dynamic navigation** based on permissions
- ✅ **Role-specific theming** with custom colors
- ✅ **Permission-based component rendering**
- ✅ **Secure backend middleware**
- ✅ **Role inheritance** system
- ✅ **RBAC-aware chat bot**

---

## 🆕 **Recent Updates**

### **Latest Changes (Latest Session):**

#### **1. Enhanced Dashboard with Real-Time RBAC Integration**
- **Role-based header** with dynamic greeting and role badges
- **Smart quick actions** that appear only for relevant roles
- **Dynamic dashboard cards** that adapt based on user permissions
- **Role-specific "Getting Started" section** with contextual guidance
- **Enhanced visual design** with larger typography and better spacing

#### **2. Role-Based Mission Access**
- **Only RUNNERS can apply** to missions (removed from other roles)
- **Role-specific mission descriptions** and actions
- **View-only access** for non-runner roles
- **Role-appropriate buttons** (Edit for clients, Manage for admins)

#### **3. RBAC-Aware Chat Bot**
- **Role-specific quick actions** in chat interface
- **Personalized welcome messages** based on user role
- **Role-appropriate help** and guidance
- **Guest users** get platform exploration features only

#### **4. Navigation Cleanup**
- **Removed Chat button** from top navigation (chat available at bottom)
- **Removed redundant buttons** (Create Mission vs Create P2P Mission)
- **Role-based button display** (only show relevant actions)

#### **5. DJ Role Clarification**
- **DJs are music curators** who receive music submissions
- **Updated DJ dashboard** to focus on music management
- **Removed performance-related features** from DJ role
- **Added music-specific cards** (Submissions, Library, Playlists)

#### **6. Authentication Persistence**
- **localStorage integration** for session persistence
- **Users stay logged in** until explicit logout
- **Cross-session authentication** maintained

---

## 🔧 **Backend Implementation**

### **RBAC Middleware (`backend/src/middleware/rbac.js`)**

```javascript
// Role hierarchy with inheritance
const ROLE_INHERITANCE = {
  GUEST: [],
  DJ: ['GUEST'],
  VERIFIED_DJ: ['DJ'],
  CLIENT: ['DJ'],
  CURATOR: ['CLIENT'],
  OPERATIONS: ['CLIENT', 'CURATOR', 'DJ'],
  PARTNER: ['CLIENT'],
  ADMIN: ['ALL']
};

// Permission-based middleware functions
const requireRole = (roles) => (req, res, next) => {
  // Role validation with inheritance
};

const requirePermission = (resource, action) => (req, res, next) => {
  // Permission validation with role inheritance
};
```

### **Security Features:**
- ✅ **Permission inheritance** across roles
- ✅ **Case-insensitive role comparison**
- ✅ **Comprehensive null checks**
- ✅ **Security logging** for all authorization events
- ✅ **Standardized error codes**
- ✅ **Default GUEST role** (principle of least privilege)

---

## 🎨 **Frontend Implementation**

### **RBAC Context Provider (`frontend/src/contexts/RBACContext.tsx`)**

```typescript
// Role-specific themes
const ROLE_THEMES = {
  GUEST: { primary: '#6b7280', /* gray */ },
  DJ: { primary: '#3b82f6', /* blue */ },
  VERIFIED_DJ: { primary: '#10b981', /* green */ },
  CLIENT: { primary: '#8b5cf6', /* purple */ },
  CURATOR: { primary: '#f59e0b', /* amber */ },
  OPERATIONS: { primary: '#ef4444', /* red */ },
  PARTNER: { primary: '#06b6d4', /* cyan */ },
  ADMIN: { primary: '#dc2626', /* dark red */ }
};

// Real-time permission calculation
const hasPermission = (resource: string, action: string): boolean => {
  // Permission checking with inheritance
};
```

### **Key Features:**
- ✅ **Real-time permission calculation**
- ✅ **Automatic role inheritance**
- ✅ **Dynamic theming** based on user role
- ✅ **Token validation** and user data sync
- ✅ **Integration with AuthContext**

---

## 🧩 **Component Usage**

### **Permission Gate Component**

```jsx
import { PermissionGate } from '../components/RoleBasedUI';

// Role-based rendering
<PermissionGate roles={['CLIENT', 'ADMIN']}>
  <CreateMissionButton />
</PermissionGate>

// Permission-based rendering
<PermissionGate resource="missions" action="create">
  <CreateMissionButton />
</PermissionGate>
```

### **Role-Based Navigation**

```jsx
import { RoleBasedNavigation } from '../components/RoleBasedUI';

// Automatically adapts based on user role
<RoleBasedNavigation />
```

### **Role-Based Dashboard**

```jsx
import { RoleBasedDashboard } from '../components/RoleBasedUI';

// Dynamic dashboard with role-specific cards and actions
<RoleBasedDashboard />
```

---

## 🎨 **Theming & Styling**

### **Role-Specific Color Schemes**

```scss
// Each role gets unique colors
GUEST: Gray (#6b7280)
DJ: Blue (#3b82f6) 
VERIFIED_DJ: Green (#10b981)
CLIENT: Purple (#8b5cf6)
CURATOR: Amber (#f59e0b)
OPERATIONS: Red (#ef4444)
PARTNER: Cyan (#06b6d4)
ADMIN: Dark Red (#dc2626)
```

### **Dynamic Theme Application**

```jsx
const theme = getCurrentTheme();

// Apply role-specific colors
<button style={{ backgroundColor: theme.primary }}>
  Create Mission
</button>
```

---

## 🔐 **Permissions & Security**

### **Permission Structure**

```javascript
// Format: resource:action
'missions:create'    // Create missions
'missions:read'      // View missions
'missions:update'    // Edit missions
'missions:delete'    // Delete missions
'missions:apply'     // Apply to missions (RUNNERS only)
```

### **Role Inheritance Rules**

- **DJ** inherits all **GUEST** permissions
- **VERIFIED_DJ** inherits all **DJ** permissions + Serato features
- **CLIENT** inherits all **DJ** permissions + mission creation
- **CURATOR** inherits all **CLIENT** permissions + team management
- **OPERATIONS** inherits from **CLIENT**, **CURATOR**, and **DJ**
- **ADMIN** inherits **ALL** permissions

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Navigation Items Not Showing**
```javascript
// Check if user is authenticated
const { isAuthenticated } = useRBAC();

// Check if user has required permissions
const { hasPermission } = useRBAC();
if (hasPermission('missions', 'read')) {
  // Show missions navigation
}
```

#### **2. Theme Not Applying**
```javascript
// Ensure theme is properly retrieved
const theme = getCurrentTheme();
console.log('Current theme:', theme);

// Check if user role is set correctly
console.log('User role:', user?.role);
```

#### **3. Permissions Not Working**
```javascript
// Verify permission format
const hasAccess = hasPermission('missions', 'create');

// Check role inheritance
const hasRole = hasRole('CLIENT'); // Includes inherited roles
```

### **Debug Tools**

```jsx
// Temporary debug component
import { RBACDebug } from '../components/RBACDebug';

// Add to your component for debugging
<RBACDebug />
```

---

## 📊 **Complete RBAC Spreadsheet**

For a comprehensive breakdown of all roles, permissions, and features, see the complete RBAC spreadsheet below:

---

# 🎯 Club Run RBAC Roles & Permissions Spreadsheet

## 📊 **Role Hierarchy & Access Levels**

| Role Level | Role Name | Color Theme | Description | Access Level |
|------------|-----------|-------------|-------------|--------------|
| 0 | **GUEST** | Gray (#6b7280) | Unauthenticated visitors | Public Access |
| 1 | **DJ** | Blue (#3b82f6) | Music curators/receivers | Basic User |
| 2 | **VERIFIED_DJ** | Green (#10b981) | Verified music curators | Enhanced User |
| 3 | **CLIENT** | Purple (#8b5cf6) | Mission creators | Mission Management |
| 4 | **CURATOR** | Amber (#f59e0b) | Team managers | Team Management |
| 5 | **OPERATIONS** | Red (#ef4444) | Platform operators | System Management |
| 6 | **PARTNER** | Cyan (#06b6d4) | Business partners | Partner Access |
| 7 | **ADMIN** | Dark Red (#dc2626) | System administrators | Full Access |

---

## 🔐 **Permissions Matrix**

### **Authentication & User Management**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `public:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth:login` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth:register` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user:update` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user:verify` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `user:delete` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### **Mission Management**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `missions:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `missions:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `missions:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `missions:delete` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `missions:apply` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `missions:accept` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `missions:complete` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### **P2P Mission Management**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `p2p-missions:read` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `p2p-missions:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `p2p-missions:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `p2p-missions:delete` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `p2p-missions:accept` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `p2p-missions:complete` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### **Team Management**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `teams:create` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| `teams:read` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| `teams:update` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `teams:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |

### **Venue & Check-in Management**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `checkins:create` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `checkins:read` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### **Financial Management**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `expenses:create` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `expenses:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `payments:send` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `payments:receive` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `payments:read` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `payments:process` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### **System & Analytics**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `stats:read` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `logs:read` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `chat:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chat:send` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chat:moderate` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### **Special Features**
| Permission | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|----|-------------|--------|---------|------------|---------|-------|
| `serato:connect` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `serato:verify` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `*:*` (All Permissions) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎨 **UI Features by Role**

### **Navigation Menu Items**
| Feature | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|---------|-------|----|-------------|--------|---------|------------|---------|-------|
| Home | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Features | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contact | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Missions | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| P2P Missions | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Teams | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Expenses | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### **Dashboard Quick Actions**
| Action | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|--------|-------|----|-------------|--------|---------|------------|---------|-------|
| Create Mission | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Create P2P Mission | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Browse Missions | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Check In | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Submit Expense | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

### **Dashboard Cards**
| Card | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------|-------|----|-------------|--------|---------|------------|---------|-------|
| My Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Music Submissions | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Music Library | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Playlist Management | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Create Mission | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| P2P Missions | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Team Management | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Serato Integration | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| System Analytics | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 💬 **Chat Bot Features**

### **Chat Quick Actions**
| Action | GUEST | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|--------|-------|----|-------------|--------|---------|------------|---------|-------|
| Help | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| About | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Features | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sign Up | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Music Submissions | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Music Library | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Mission | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| P2P Missions | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Team Management | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| User Management | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Analytics | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## 🔄 **Role Inheritance**

### **Inheritance Chain**
```
GUEST (Base)
├── DJ
│   ├── VERIFIED_DJ
│   └── CLIENT
│       ├── CURATOR
│       └── PARTNER
└── OPERATIONS (inherits from CLIENT, CURATOR, DJ)
└── ADMIN (inherits ALL permissions)
```

### **Permission Inheritance Rules**
- **DJ** inherits all **GUEST** permissions
- **VERIFIED_DJ** inherits all **DJ** permissions + Serato features
- **CLIENT** inherits all **DJ** permissions + mission creation
- **CURATOR** inherits all **CLIENT** permissions + team management
- **OPERATIONS** inherits from **CLIENT**, **CURATOR**, and **DJ**
- **PARTNER** inherits all **CLIENT** permissions + partner features
- **ADMIN** inherits **ALL** permissions from every role

---

## 🎯 **Role-Specific Use Cases**

### **GUEST**
- **Purpose**: Platform exploration and registration
- **Primary Actions**: Browse public content, learn about features, sign up
- **Limitations**: No authenticated features

### **DJ**
- **Purpose**: Music curation and submission review
- **Primary Actions**: Review music submissions, manage library, create playlists
- **Key Features**: Music submission management, expense tracking

### **VERIFIED_DJ**
- **Purpose**: Enhanced music curation with verification
- **Primary Actions**: All DJ features + Serato integration, priority access
- **Key Features**: Serato connection, verified status benefits

### **CLIENT**
- **Purpose**: Mission creation and management
- **Primary Actions**: Create missions, manage P2P collaborations, track bookings
- **Key Features**: Mission creation, P2P mission management, payment sending

### **CURATOR**
- **Purpose**: Team and collaboration management
- **Primary Actions**: Manage teams, create P2P missions, coordinate collaborations
- **Key Features**: Team management, advanced collaboration tools

### **OPERATIONS**
- **Purpose**: Platform operations and user management
- **Primary Actions**: Monitor system, manage users, ensure quality control
- **Key Features**: User verification, system analytics, payment processing

### **PARTNER**
- **Purpose**: Business partnership management
- **Primary Actions**: Manage partnerships, view analytics, update missions
- **Key Features**: Partner-specific features, limited admin access

### **ADMIN**
- **Purpose**: Full system administration
- **Primary Actions**: Complete system control, configuration, user management
- **Key Features**: All permissions, system configuration, full access

---

## 📈 **Access Level Summary**

| Access Level | Roles | Description |
|--------------|-------|-------------|
| **Public** | GUEST | Basic platform exploration |
| **Basic User** | DJ | Music curation and basic features |
| **Enhanced User** | VERIFIED_DJ | Advanced music curation with verification |
| **Mission Manager** | CLIENT | Mission creation and management |
| **Team Manager** | CURATOR | Team and collaboration management |
| **System Operator** | OPERATIONS | Platform operations and user management |
| **Business Partner** | PARTNER | Partnership management and analytics |
| **System Administrator** | ADMIN | Complete system control |

---

*This RBAC system provides granular control over user access while maintaining clear role hierarchies and permission inheritance. Always refer to this spreadsheet for role definitions and permission clarity.*
