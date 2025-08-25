# 🎯 Club Run Demo Accounts & Login Credentials

## 📋 **Overview**

This document provides login credentials for all available roles in the Club Run platform. These demo accounts are pre-created and ready for testing all features and permissions.

---

## 🔐 **Login Credentials**

### **Universal Password for All Demo Accounts**
```
Password: Demo123!
```

---

## 👥 **Demo Accounts by Role**

### **1. 🏃 RUNNER Account**
- **Email**: `runner@demo.com`
- **Password**: `Demo123!`
- **Name**: Alex Runner
- **Role Level**: 1
- **Permissions**: Mission execution, expense tracking, check-ins
- **Features**: 
  - Accept and complete missions
  - Track expenses and submit receipts
  - Check in at venues
  - Basic user dashboard

### **2. 🎵 DJ Account**
- **Email**: `dj@demo.com`
- **Password**: `Demo123!`
- **Name**: Maria DJ
- **Role Level**: 2
- **Permissions**: Music curation, playlist creation, basic missions
- **Features**:
  - Music submission and review
  - Playlist creation
  - Basic mission access
  - Music library management

### **3. ⭐ VERIFIED_DJ Account**
- **Email**: `verified-dj@demo.com`
- **Password**: `Demo123!`
- **Name**: DJ Verified
- **Role Level**: 3
- **Permissions**: Serato integration, advanced missions, priority access
- **Features**:
  - Serato integration access
  - Advanced mission features
  - Priority booking access
  - Enhanced music curation tools

### **4. 👑 CLIENT Account**
- **Email**: `client@demo.com`
- **Password**: `Demo123!`
- **Name**: Sarah Client
- **Role Level**: 4
- **Permissions**: Mission creation, booking management, analytics
- **Features**:
  - Create and manage missions
  - Booking analytics
  - Service optimization
  - Payment management

### **5. 🛡️ CURATOR Account**
- **Email**: `curator@demo.com`
- **Password**: `Demo123!`
- **Name**: Mike Curator
- **Role Level**: 5
- **Permissions**: Team management, advanced missions, quality control
- **Features**:
  - Team creation and management
  - Advanced mission oversight
  - Quality control tools
  - Collaboration coordination

### **6. ⚙️ OPERATIONS Account**
- **Email**: `operations@demo.com`
- **Password**: `Demo123!`
- **Name**: Lisa Operations
- **Role Level**: 6
- **Permissions**: User verification, system management, performance metrics
- **Features**:
  - User verification and approval
  - System monitoring
  - Performance analytics
  - Platform management

### **7. 🤝 PARTNER Account**
- **Email**: `partner@demo.com`
- **Password**: `Demo123!`
- **Name**: David Partner
- **Role Level**: 7
- **Permissions**: Business analytics, partner features, collaboration tools
- **Features**:
  - Business intelligence
  - Partner-specific analytics
  - Collaboration tools
  - Market insights

### **8. 👑 ADMIN Account**
- **Email**: `admin@clubrun.com`
- **Password**: `Admin123!`
- **Name**: Admin User
- **Role Level**: 8
- **Permissions**: Full system access, user management, system configuration
- **Features**:
  - Complete system administration
  - User role management
  - System configuration
  - All platform features

---

## 🎯 **Role Hierarchy & Access Levels**

| Role | Level | Color Theme | Description | Key Features |
|------|-------|-------------|-------------|--------------|
| **RUNNER** | 1 | Green | Mission execution | Mission acceptance, expense tracking |
| **DJ** | 2 | Blue | Music curation | Playlist creation, music management |
| **VERIFIED_DJ** | 3 | Emerald | Advanced DJ features | Serato integration, priority access |
| **CLIENT** | 4 | Purple | Mission creation | Booking management, analytics |
| **CURATOR** | 5 | Amber | Team management | Team oversight, quality control |
| **OPERATIONS** | 6 | Red | Platform operations | User verification, system management |
| **PARTNER** | 7 | Cyan | Business partnership | Analytics, collaboration tools |
| **ADMIN** | 8 | Rose | System administration | Full access, user management |

---

## 🚀 **Quick Start Guide**

### **1. Access the Platform**
- **Frontend URL**: `http://localhost:3006`
- **Backend URL**: `http://localhost:3001`

### **2. Login Process**
1. Navigate to the login page
2. Enter any of the demo account credentials above
3. Click "Sign In"
4. You'll be redirected to the role-specific dashboard

### **3. Testing Different Roles**
- Use different demo accounts to test role-specific features
- Each role has different permissions and dashboard layouts
- Switch between accounts to compare functionality

### **4. Role-Specific Testing**

#### **For RUNNER Testing:**
- Login as `runner@demo.com`
- Test mission acceptance and completion
- Submit expense reports
- Use check-in features

#### **For CLIENT Testing:**
- Login as `client@demo.com`
- Create new missions
- View booking analytics
- Manage service preferences

#### **For ADMIN Testing:**
- Login as `admin@clubrun.com`
- Access user management
- View system analytics
- Configure platform settings

---

## 🔧 **Development Notes**

### **Password Hashing**
All demo accounts use the same hashed password:
- **Plain text**: `Demo123!`
- **Hashed**: `$2a$12$KywgAkb9a0LKDSOyvjRiMe48UGujwMoPZ1rANCtIfZIP60BlPMq9W`

### **Account Status**
- All demo accounts are **verified** and **active**
- No approval required for immediate access
- All accounts have full permissions for their respective roles

### **Data Persistence**
- Demo accounts are stored in memory for development
- Accounts will reset when the server restarts
- For production, accounts should be stored in a database

---

## 📱 **Mobile Testing**

### **Responsive Design**
- All role dashboards are mobile-responsive
- Test on different screen sizes
- Verify touch interactions work properly

### **Progressive Web App**
- Platform works as a PWA
- Can be installed on mobile devices
- Offline functionality available

---

## 🛡️ **Security Notes**

### **Development Environment**
- These credentials are for **development/testing only**
- Do not use in production environments
- Change passwords before deployment

### **Role-Based Security**
- Each role has specific permissions
- Users cannot access features outside their role
- Admin accounts have full system access

---

## 📞 **Support**

For questions about demo accounts or role testing:
- Check the role-specific documentation
- Review the RBAC system documentation
- Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0
**Environment**: Development
