# 🎯 **Updated Mission Structure Summary**

## 📋 **Mission Creation Flow - 4 Steps**

### **Key Changes Made:**

#### **1. Mission Structure Updated to 4 Steps**
- **Step 1**: Club Location & Details
- **Step 2**: Client & Artist Information  
- **Step 3**: Mission Requirements
- **Step 4**: DJ Service Package Link

#### **2. CLIENT/CURATOR Provides DJ Service Package Link**
- **Step 4**: CLIENT/CURATOR provides the DJ service package link
- **RUNNERS** access the link to view complete service details
- **Link Integration**: Direct access to service package information

---

## 🏢 **Step 1: Club Location & Details**

### **Required Fields:**
- **Club Name** * (required)
- **Street Address** * (required)
- **City, State, ZIP Code**
- **Club Hours** * (required)
- **Club Contact Phone**

### **Purpose:**
- Provides RUNNERS with exact location information
- Club hours help RUNNERS know when the venue is open
- Contact information for venue coordination

---

## 👥 **Step 2: Client & Artist Information**

### **Required Fields:**
- **Client Name** * (required)
- **Artist Name** * (required)
- **Contact Phone**
- **Contact Email**

### **Purpose:**
- RUNNERS need client and artist contact information
- Enables direct communication between RUNNERS and clients
- Essential for mission coordination and execution

---

## ⚙️ **Step 3: Mission Requirements**

### **Fields:**
- **Expected Mission Duration** (Hours) * (required)
- **Special Requests** (Optional)

### **Purpose:**
- Helps RUNNERS understand time commitment
- Provides specific requirements and instructions
- Ensures RUNNERS can meet all mission needs

---

## 🔗 **Step 4: DJ Service Package Link**

### **New Feature:**
- **DJ Service Package Link** * (required)
- **Link Preview**: Shows what RUNNERS will access
- **Service Details**: Equipment, pricing, per diem, features

### **Purpose:**
- **CLIENT/CURATOR** provides the service package link
- **RUNNERS** access link for complete service information
- **Standardized Access**: Consistent service package viewing

---

## 🔐 **RBAC Permission Updates**

### **Mission Management Permissions:**

| Role | missions:apply | missions:accept | missions:complete |
|------|----------------|-----------------|-------------------|
| **GUEST** | ❌ | ❌ | ❌ |
| **RUNNER** | ✅ | ✅ | ✅ |
| **DJ** | ❌ | ❌ | ❌ |
| **VERIFIED_DJ** | ❌ | ❌ | ❌ |
| **CLIENT** | ❌ | ❌ | ❌ |
| **CURATOR** | ❌ | ❌ | ❌ |
| **OPERATIONS** | ❌ | ❌ | ❌ |
| **PARTNER** | ❌ | ❌ | ❌ |
| **ADMIN** | ✅ | ✅ | ✅ |

---

## 🎯 **Mission Flow Summary**

### **Mission Creation:**
1. **CLIENT/CURATOR** creates mission with club details
2. **CLIENT/CURATOR** provides client and artist information
3. **CLIENT/CURATOR** specifies mission requirements
4. **CLIENT/CURATOR** provides DJ service package link
5. Mission is posted for **RUNNERS** to apply

### **Mission Execution:**
1. **RUNNER** applies for and accepts mission
2. **RUNNER** accesses DJ service package link for details
3. **RUNNER** contacts client and artist using provided information
4. **RUNNER** coordinates with club using provided details
5. **RUNNER** executes mission with service package requirements
6. **RUNNER** submits expenses within per diem limits

### **Mission Completion:**
1. **RUNNER** completes mission and submits proof
2. **CLIENT** reviews and approves completion
3. **RUNNER** receives payment based on service package
4. Expenses are tracked against per diem allowances

---

## 🔧 **Technical Implementation**

### **Updated Components:**
1. **MissionCreationWizard.tsx**: Updated to 4 steps with service pack link
2. **RBAC System**: Maintained RUNNER-only mission permissions
3. **Service Pack Link Integration**: New field for CLIENT/CURATOR to provide link
4. **Mission Requirements**: Simplified step 3 with duration and special requests

### **Data Structure Changes:**
```typescript
interface MissionData {
  clubDetails: {
    clubName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    clubHours: string;
    contactPhone: string;
  };
  clientDetails: {
    clientName: string;
    artistName: string;
    contactPhone: string;
    contactEmail: string;
  };
  musicRequirements: {
    servicePack: string;
    duration: number;
    specialRequests: string;
    selectedPack?: DJServicePack;
    servicePackLink?: string; // NEW FIELD
  };
  budget: {
    min: number;
    max: number;
    suggested: number;
  };
}
```

---

## ✅ **Benefits of Updated Structure**

### **For Mission Creators (CLIENTS/CURATORS):**
- **Service Package Control**: CLIENT/CURATOR provides the service package link
- **Flexible Service Selection**: Can link to any service package
- **Clear Requirements**: Mission duration and special requests
- **Standardized Process**: 4-step streamlined creation

### **For RUNNERS:**
- **Exclusive Access**: Only RUNNERS can execute missions
- **Service Package Access**: Direct link to complete service details
- **Clear Information**: All necessary contact and requirement details
- **Structured Process**: Well-defined mission requirements

### **For System Administrators:**
- **Role Clarity**: Clear separation between creators and executors
- **Service Package Flexibility**: CLIENT/CURATOR controls service selection
- **Audit Trail**: Complete mission lifecycle tracking
- **Link Management**: Service package link tracking

---

## 🎯 **Summary**

The updated mission structure ensures:

✅ **ONLY RUNNERS can go on missions** - Clear role separation  
✅ **Club Location + Address** - Essential venue information  
✅ **Client/Artist Name** - Required contact information  
✅ **Club Hours** - Important for mission timing  
✅ **CLIENT/CURATOR provides DJ service package link** - Service control  
✅ **4-Step Process** - Streamlined mission creation  
✅ **Service Package Access** - RUNNERS access via provided link  
✅ **RBAC Compliance** - Proper permission enforcement  

**🎵 The system now provides a clear, structured approach to mission creation with CLIENT/CURATOR control over service package selection!**
