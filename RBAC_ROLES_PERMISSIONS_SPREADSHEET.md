# 🎯 Club Run RBAC Roles & Permissions Spreadsheet

## 📊 **Role Hierarchy & Access Levels**

| Role Level | Role Name | Color Theme | Description | Access Level |
|------------|-----------|-------------|-------------|--------------|
| 0 | **GUEST** | Gray (#6b7280) | Unauthenticated visitors | Public Access |
| 1 | **RUNNER** | Green (#059669) | Mission runners/executors | Basic User |
| 2 | **DJ** | Blue (#3b82f6) | Music curators/receivers | Music Curation |
| 3 | **VERIFIED_DJ** | Green (#10b981) | Verified music curators | Enhanced Music Curation |
| 4 | **CLIENT** | Purple (#8b5cf6) | Mission creators | Mission Management |
| 5 | **CURATOR** | Amber (#f59e0b) | Team managers | Team Management |
| 6 | **OPERATIONS** | Red (#ef4444) | Platform operators | System Management |
| 7 | **PARTNER** | Cyan (#06b6d4) | Business partners | Partner Access |
| 8 | **ADMIN** | Dark Red (#dc2626) | System administrators | Full Access |

---

## 🔐 **Permissions Matrix**

### **Authentication & User Management**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
| `public:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth:login` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth:register` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user:update` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user:verify` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `user:delete` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### **Mission Management**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
| `missions:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `missions:create` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `missions:update` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `missions:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `missions:apply` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `missions:accept` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `missions:complete` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### **P2P Mission Management**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
| `p2p-missions:read` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `p2p-missions:create` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `p2p-missions:update` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `p2p-missions:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `p2p-missions:accept` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `p2p-missions:complete` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### **Team Management**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
| `teams:create` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| `teams:read` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| `teams:update` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `teams:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |

### **Venue & Check-in Management**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
| `checkins:create` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `checkins:read` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### **Financial Management**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
| `expenses:create` | ❌ | ✅ | ❌* | ❌* | ✅ | ✅ | ❌ | ✅ |
| `expenses:read` | ❌ | ✅ | ❌* | ❌* | ✅ | ✅ | ❌ | ✅ |
| `payments:send` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `payments:receive` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `payments:read` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `payments:process` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

**Note**: *DJs and VERIFIED_DJs do **NOT** have expense permissions by default. Only users with RUNNER role (or dual DJ+RUNNER role) can access expenses.*

### **System & Analytics**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
| `stats:read` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `logs:read` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `chat:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chat:send` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chat:moderate` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### **Special Features**
| Permission | GUEST | RUNNER | DJ | VERIFIED_DJ | CLIENT | CURATOR | OPERATIONS | PARTNER | ADMIN |
|------------|-------|--------|----|-------------|--------|---------|------------|---------|-------|
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

*This RBAC system provides granular control over user access while maintaining clear role hierarchies and permission inheritance.*
