# 🔐 RBAC Testing Guide - Complete Test Plan

## 📋 Testing Overview

This document provides a comprehensive testing plan for all 8 RBAC roles in Club Run, including test credentials and expected functionality for each role.

---

## 🎯 Test Objectives

1. ✅ Verify signup process for each role
2. ✅ Verify login authentication
3. ✅ Test role-specific permissions
4. ✅ Verify UI elements show/hide based on role
5. ✅ Test protected routes and API endpoints
6. ✅ Validate role hierarchy enforcement

---

## 👥 TEST CREDENTIALS FOR ALL ROLES

### 1. GUEST (Level 0) - Public Access
**No credentials needed - public access**
- **Test URL**: http://localhost:3006/
- **Access**: Homepage, public pages only
- **No Login Required**

**What to Test:**
- [ ] View homepage
- [ ] View public information
- [ ] Access signup page
- [ ] Access login page
- [ ] Cannot access protected routes

---

### 2. DJ (Level 1) - Basic DJ Account
**Email**: `dj@test.com`  
**Password**: `DJ123456!`  
**Name**: DJ Test User  
**Role**: DJ

**What to Test:**
- [ ] Signup process
- [ ] Login authentication
- [ ] View available missions
- [ ] Apply for missions
- [ ] Accept missions
- [ ] Create check-ins
- [ ] Submit expenses
- [ ] Send/receive chat messages
- [ ] Accept P2P missions
- [ ] Receive payments
- [ ] **Cannot** access Serato verification
- [ ] **Cannot** access admin features

---

### 3. VERIFIED_DJ (Level 2) - Verified DJ with Serato
**Email**: `verified.dj@test.com`  
**Password**: `VerifiedDJ123!`  
**Name**: Verified DJ Pro  
**Role**: VERIFIED_DJ

**What to Test:**
- [ ] All DJ permissions (see above)
- [ ] **Serato verification button visible**
- [ ] Connect Serato account
- [ ] View Serato verification status
- [ ] Automatic mission verification
- [ ] Professional proof logging
- [ ] Enhanced mission priority
- [ ] Higher earning potential features
- [ ] Verification badges displayed

---

### 4. CLIENT (Level 3) - Event Organizer
**Email**: `client@test.com`  
**Password**: `Client123!`  
**Name**: Event Client  
**Role**: CLIENT

**What to Test:**
- [ ] Create new missions
- [ ] Edit missions
- [ ] Delete missions
- [ ] View mission applications
- [ ] Accept/reject DJ applications
- [ ] Create P2P missions
- [ ] Send payments to DJs
- [ ] Chat with DJs
- [ ] View mission analytics
- [ ] **Cannot** access admin features
- [ ] **Cannot** manage users

---

### 5. CURATOR (Level 4) - Team Manager
**Email**: `curator@test.com`  
**Password**: `Curator123!`  
**Name**: Music Curator  
**Role**: CURATOR

**What to Test:**
- [ ] All CLIENT permissions (see above)
- [ ] Create and manage teams
- [ ] Assign missions to team members
- [ ] View team performance metrics
- [ ] Manage team resources
- [ ] Access advanced mission features
- [ ] Team coordination tools
- [ ] Content curation features
- [ ] Team analytics dashboard

---

### 6. OPERATIONS (Level 5) - Platform Operations
**Email**: `operations@test.com`  
**Password**: `Operations123!`  
**Name**: Operations Manager  
**Role**: OPERATIONS

**What to Test:**
- [ ] Verify DJ accounts (manual verification)
- [ ] Approve VERIFIED_DJ status
- [ ] System management features
- [ ] User management (view/edit users)
- [ ] Mission oversight
- [ ] Platform analytics
- [ ] Expense approval
- [ ] Support ticket management
- [ ] Operations dashboard
- [ ] **Cannot** access full admin features

---

### 7. PARTNER (Level 6) - Business Partner
**Email**: `partner@test.com`  
**Password**: `Partner123!`  
**Name**: Business Partner  
**Role**: PARTNER

**What to Test:**
- [ ] Partner dashboard access
- [ ] Advanced analytics
- [ ] Revenue sharing reports
- [ ] Partner-specific features
- [ ] Integration APIs
- [ ] White-label features
- [ ] Custom branding options
- [ ] Business metrics
- [ ] Partner resources

---

### 8. ADMIN (Level 7) - System Administrator
**Email**: `admin@test.com`  
**Password**: `Admin123!`  
**Name**: System Admin  
**Role**: ADMIN

**What to Test:**
- [ ] **Full system access**
- [ ] User management (create/edit/delete)
- [ ] Role assignment/changes
- [ ] System configuration
- [ ] Database management
- [ ] Security settings
- [ ] ChatGPT analytics
- [ ] Cost tracking dashboard
- [ ] Enhanced agent dashboard
- [ ] Quantum security controls
- [ ] LangGraph workflows
- [ ] All admin tools
- [ ] System logs and monitoring

---

## 🧪 DETAILED TEST SCENARIOS

### Scenario 1: New User Signup Flow

**Steps for Each Role:**
1. Navigate to signup page: http://localhost:3006/signup
2. Enter email and password (use credentials above)
3. Enter first name and last name
4. Select role from dropdown
5. Click "Sign Up"
6. Verify redirect to appropriate dashboard
7. Verify role-specific UI elements visible

**Expected Results:**
- ✅ Account created successfully
- ✅ JWT token stored
- ✅ Redirected to role-appropriate page
- ✅ User data stored in database

---

### Scenario 2: Login Authentication

**Steps for Each Role:**
1. Navigate to login page: http://localhost:3006/login
2. Enter email from credentials list
3. Enter password
4. Click "Log In"
5. Verify successful login
6. Check dashboard loads correctly

**Expected Results:**
- ✅ Login successful
- ✅ Token generated
- ✅ Dashboard shows role-specific features
- ✅ User name displayed correctly

---

### Scenario 3: Permission Testing

**For DJ Role:**
1. Login as DJ
2. Try to access: http://localhost:3006/admin
3. **Expected**: Denied/Redirected
4. Try to access: http://localhost:3006/missions
5. **Expected**: Allowed

**For VERIFIED_DJ Role:**
1. Login as VERIFIED_DJ
2. Navigate to dashboard
3. Look for "Serato Verification" button
4. **Expected**: Button visible and clickable
5. Click verification button
6. **Expected**: Serato verification flow starts

**For CLIENT Role:**
1. Login as CLIENT
2. Navigate to missions page
3. Look for "Create Mission" button
4. **Expected**: Button visible
5. Click create mission
6. **Expected**: Mission creation form opens

**For ADMIN Role:**
1. Login as ADMIN
2. Navigate to: http://localhost:3006/admin
3. **Expected**: Full admin dashboard loads
4. Navigate to: http://localhost:3006/enhanced-agent-dashboard
5. **Expected**: Enhanced agent dashboard loads with all controls

---

### Scenario 4: Role Hierarchy Testing

**Test Permissions Cascade:**
1. Login as DJ → Cannot access CLIENT features
2. Login as CLIENT → Cannot access CURATOR features
3. Login as CURATOR → Cannot access OPERATIONS features
4. Login as OPERATIONS → Cannot access ADMIN features
5. Login as ADMIN → Can access ALL features

**Expected Results:**
- ✅ Lower roles cannot access higher-level features
- ✅ Higher roles can access lower-level features
- ✅ 403/redirect on unauthorized access

---

### Scenario 5: Serato Verification (VERIFIED_DJ Only)

**Steps:**
1. Login as VERIFIED_DJ: `verified.dj@test.com`
2. Navigate to dashboard
3. Click "Verify with Serato" button
4. Follow verification prompts
5. Check verification status

**Expected Results:**
- ✅ Verification button visible (only for VERIFIED_DJ)
- ✅ Verification process starts
- ✅ Skill level displayed after verification
- ✅ Verification badge shown on profile

---

### Scenario 6: Mission Management

**As CLIENT:**
1. Login as CLIENT
2. Create new mission:
   - Title: "Test DJ Night"
   - Venue: "Test Club"
   - Date: Future date
   - Budget: $500
3. View created mission
4. Edit mission details
5. Delete mission

**As DJ:**
1. Login as DJ
2. View available missions
3. Apply for mission
4. Accept mission
5. Create check-in
6. Submit expense

**Expected Results:**
- ✅ CLIENT can create/edit/delete missions
- ✅ DJ can view/apply/accept missions
- ✅ Check-ins work correctly
- ✅ Expenses submitted successfully

---

### Scenario 7: Admin Dashboard Testing

**Steps:**
1. Login as ADMIN: `admin@test.com`
2. Navigate to admin dashboard
3. Test user management:
   - View all users
   - Edit user role
   - View user activity
4. Test ChatGPT analytics
5. Test system settings

**Expected Results:**
- ✅ All users visible
- ✅ Role changes work
- ✅ Analytics display correctly
- ✅ Settings can be modified

---

### Scenario 8: Enhanced Agent Dashboard (ADMIN)

**Steps:**
1. Login as ADMIN
2. Navigate to: http://localhost:3006/enhanced-agent-dashboard
3. Test Quantum Security Controls:
   - Toggle security on/off
   - View security status
   - Check active sessions
4. Test LangGraph Workflows:
   - View available workflows
   - Execute workflow
   - Monitor execution steps
5. Test AI Agents:
   - View all 10 agents
   - Check agent status
   - Test agent capabilities

**Expected Results:**
- ✅ Dashboard loads with all features
- ✅ Security controls work
- ✅ Workflows execute successfully
- ✅ Agents respond correctly

---

## 📊 TESTING CHECKLIST

### Authentication & Authorization
- [ ] Signup works for all roles
- [ ] Login works for all roles
- [ ] Logout works correctly
- [ ] JWT tokens generated properly
- [ ] Session persistence works
- [ ] Password reset (if implemented)

### Role-Based Access Control
- [ ] GUEST cannot access protected routes
- [ ] DJ has correct permissions
- [ ] VERIFIED_DJ sees Serato features
- [ ] CLIENT can create missions
- [ ] CURATOR can manage teams
- [ ] OPERATIONS can verify users
- [ ] PARTNER sees analytics
- [ ] ADMIN has full access

### UI Elements
- [ ] Navigation shows role-appropriate links
- [ ] Buttons visible/hidden based on role
- [ ] Dashboards customized per role
- [ ] Feature cards match role permissions
- [ ] Error messages for unauthorized access

### Features
- [ ] Mission creation (CLIENT+)
- [ ] Mission application (DJ+)
- [ ] Check-ins (DJ+)
- [ ] Expenses (RUNNER only, or DJ+RUNNER dual role)
- [ ] Serato verification (VERIFIED_DJ)
- [ ] Team management (CURATOR+)
- [ ] User verification (OPERATIONS+)
- [ ] Admin tools (ADMIN)

### API Endpoints
- [ ] Authentication endpoints work
- [ ] Protected endpoints check authorization
- [ ] Role-specific endpoints accessible
- [ ] Proper error codes (401, 403)

---

## 🚀 QUICK START TESTING

### 1. Test Basic Authentication
```bash
# Test as DJ
Email: dj@test.com
Password: DJ123456!

# Test as ADMIN
Email: admin@test.com
Password: Admin123!
```

### 2. Test Permission Boundaries
- Login as DJ → Try accessing /admin → Should be blocked
- Login as ADMIN → Access /admin → Should work

### 3. Test Serato Feature
- Login as VERIFIED_DJ → Look for Serato button → Should be visible
- Login as DJ → Look for Serato button → Should NOT be visible

---

## 📝 NOTES

- All passwords use strong format: `RoleName123!`
- Test in order from lowest to highest role
- Document any bugs or unexpected behavior
- Check console for errors during testing
- Verify network requests in browser DevTools

---

## 🐛 COMMON ISSUES TO WATCH FOR

1. **JWT Token Issues**: Check if token is stored in cookies/localStorage
2. **Role Mismatch**: Verify role is correctly stored in database
3. **Permission Errors**: Check backend RBAC middleware
4. **UI Not Updating**: Clear browser cache if role UI doesn't update
5. **Serato Button Missing**: Ensure VERIFIED_DJ role is set correctly

---

## ✅ SUCCESS CRITERIA

- [ ] All 8 roles can signup successfully
- [ ] All 8 roles can login successfully
- [ ] Each role sees appropriate dashboard
- [ ] Permissions enforced correctly
- [ ] No unauthorized access possible
- [ ] UI matches role permissions
- [ ] All role-specific features work

---

**Last Updated**: December 25, 2025  
**Version**: Pre-MVP 3.777
