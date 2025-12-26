# 🎭 Role-Based Mission Filtering System

**Last Updated**: December 25, 2025  
**Status**: ✅ Implemented

## Overview

The Role-Based Mission Filtering system ensures that users only see missions relevant to their role, creating a focused and efficient experience for both service providers (DJs, RUNNERs) and clients.

## Architecture

### Three-Layer Security Model

```
┌─────────────────────────────────────────────────┐
│  Layer 1: ProtectedRoute (Authentication)      │
│  - Verifies user is logged in                  │
│  - Redirects to login if not authenticated     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Layer 2: PermissionGate (UI Visibility)       │
│  - Controls button/component visibility        │
│  - Based on resource + action permissions      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Layer 3: Role-Based Filtering (Content)       │
│  - Filters mission data by targetRole          │
│  - Shows only relevant mission types           │
└─────────────────────────────────────────────────┘
```

## Mission Data Structure

```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  client: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
  deadline: string;
  
  // NEW: Role-based filtering fields
  targetRole?: string[];  // Which roles can see this mission
  missionType?: 'gig' | 'delivery' | 'task' | 'service';
}
```

## Role-Specific Mission Types

### DJ / VERIFIED_DJ (Gig Missions)

**Target Roles**: `['DJ', 'VERIFIED_DJ']`  
**Mission Type**: `gig`

**Examples**:
- Corporate holiday parties and events
- Wedding receptions with MC services
- Club night residencies (weekly/monthly)
- Festival performances
- Private party entertainment
- Bar/restaurant ambient music

**Key Characteristics**:
- Performance-focused
- Requires music equipment and DJ skills
- Typically higher budget ($300-$1500+)
- May require specific genres or styles
- Often includes equipment requirements

### RUNNER (Service Missions)

**Target Roles**: `['RUNNER']`  
**Mission Type**: `delivery`, `task`, or `service`

**Examples**:
- Music equipment delivery and pickup
- Flyer distribution and marketing
- Vinyl record handling and cataloging
- Event setup and breakdown assistance
- Music gear transportation
- Promotional material distribution

**Key Characteristics**:
- Service and logistics focused
- Requires reliable transportation
- Lower budget ($50-$200)
- Task-based completion
- Time-sensitive delivery windows

### CLIENT (All Missions)

**Access**: Can see all missions they created  
**Purpose**: Manage their posted missions and applications

### CURATOR (All Missions)

**Access**: Can see all platform missions  
**Purpose**: Assign missions to team members

### ADMIN / OPERATIONS (All Missions)

**Access**: Full platform visibility  
**Purpose**: Platform oversight and management

## Implementation

### Frontend Filtering Logic

```typescript
// File: frontend/src/pages/Missions.tsx

const allPlatformMissions: Mission[] = [
  // All missions from database
];

// Filter based on user role
const mockPlatformMissions = allPlatformMissions.filter(mission => {
  // ADMIN and OPERATIONS see everything
  if (isAdmin || isOperations) return true;
  
  // CURATOR sees everything (to assign teams)
  if (isCurator) return true;
  
  // Filter by targetRole
  if (mission.targetRole && mission.targetRole.length > 0) {
    return mission.targetRole.includes(userRole);
  }
  
  // No targetRole = show to all
  return true;
});
```

### Mission Dashboard Layout

```
┌──────────────────────────────────────────────────────┐
│              Missions Dashboard Header               │
│  "Find DJ gigs and manage active bookings"          │
└──────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────┐
│  [🌐 Platform Missions] [📋 My Missions]            │
└──────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────┐
│  Platform Missions Tab (Role-Filtered)               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │  DJ for    │  │  Wedding   │  │  Club      │    │
│  │  Corporate │  │  Reception │  │  Night     │    │
│  │  Party     │  │  DJ        │  │  Resident  │    │
│  │  $500      │  │  $800      │  │  $300/wk   │    │
│  └────────────┘  └────────────┘  └────────────┘    │
└──────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────┐
│  My Missions Tab (Status-Based)                      │
│  ┌─ Pending (2) ────────────────────────────────┐   │
│  │  Missions awaiting client response           │   │
│  └──────────────────────────────────────────────┘   │
│  ┌─ Active (1) ──────────────────────────────────┐  │
│  │  Currently booked gigs                        │  │
│  └──────────────────────────────────────────────┘   │
│  ┌─ In Review (0) ───────────────────────────────┐  │
│  │  Completed, awaiting payment                  │  │
│  └──────────────────────────────────────────────┘   │
│  ┌─ Cancelled (0) ───────────────────────────────┐  │
│  │  Rejected or withdrawn                        │  │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

## User Experience Flow

### DJ User Flow

1. **Login** → ProtectedRoute verifies authentication
2. **Navigate to Missions** → Page loads
3. **Role Check** → System identifies user as DJ
4. **Content Filter** → Shows only `targetRole: ['DJ', 'VERIFIED_DJ']` missions
5. **Platform Tab** → Sees "DJ for Corporate Party", "Wedding Reception DJ", "Club Night Resident"
6. **Apply** → Can apply to gig missions
7. **My Missions** → Track applications through Pending → Active → In Review → Payment

### RUNNER User Flow

1. **Login** → ProtectedRoute verifies authentication
2. **Navigate to Missions** → Page loads
3. **Role Check** → System identifies user as RUNNER
4. **Content Filter** → Shows only `targetRole: ['RUNNER']` missions
5. **Platform Tab** → Sees "Equipment Delivery", "Flyer Distribution", "Vinyl Pickup"
6. **Apply** → Can apply to service missions
7. **My Missions** → Track tasks through workflow

### CLIENT User Flow

1. **Login** → ProtectedRoute verifies authentication
2. **Navigate to Missions** → Page loads
3. **Role Check** → System identifies user as CLIENT
4. **Content Filter** → Shows all missions (reference)
5. **PermissionGate** → "Create Mission" button visible
6. **Create Mission** → Can post DJ or RUNNER missions with targetRole
7. **Manage** → Track applications and bookings

## Benefits

### For Service Providers (DJ/RUNNER)
✅ See only relevant opportunities  
✅ No irrelevant mission clutter  
✅ Focused application process  
✅ Clear role-specific workflow  

### For Clients
✅ Target specific service types  
✅ Get qualified applicants  
✅ Manage role-based missions  
✅ Clear booking pipeline  

### For Platform
✅ Better user experience  
✅ Higher application quality  
✅ Clearer role boundaries  
✅ Scalable architecture  

## Backend Integration (Future)

```typescript
// Backend API endpoint with role filtering
app.get('/api/missions/platform', authenticate, async (req, res) => {
  const { role } = req.user;
  
  let missions;
  
  if (role === 'ADMIN' || role === 'OPERATIONS' || role === 'CURATOR') {
    // See all missions
    missions = await prisma.mission.findMany({
      where: { status: 'open' }
    });
  } else {
    // Filter by targetRole
    missions = await prisma.mission.findMany({
      where: {
        status: 'open',
        targetRole: { has: role }
      }
    });
  }
  
  res.json(missions);
});
```

## Testing Scenarios

### Test Case 1: DJ sees only gig missions
```
User: DJ role
Expected: Platform tab shows 3 gig missions
Expected: No service/delivery missions visible
```

### Test Case 2: RUNNER sees only service missions
```
User: RUNNER role
Expected: Platform tab shows 3 service missions
Expected: No gig missions visible
```

### Test Case 3: ADMIN sees all missions
```
User: ADMIN role
Expected: Platform tab shows all 6 missions (3 gigs + 3 services)
Expected: Full platform oversight
```

### Test Case 4: CLIENT can create but not apply
```
User: CLIENT role
Expected: "Create Mission" button visible
Expected: Cannot see "Apply Now" buttons (not a service provider)
```

## Extensibility

### Adding New Roles
1. Add role to `targetRole` array in missions
2. Update filtering logic in `Missions.tsx`
3. Create role-specific mission types
4. Update documentation

### Adding New Mission Types
1. Extend `missionType` union type
2. Create mission templates
3. Add type-specific fields
4. Update UI components

## Related Documentation

- [RBAC_ROLE_SYSTEM_DOCUMENTATION.md](./RBAC_ROLE_SYSTEM_DOCUMENTATION.md) - Full RBAC system
- [MISSION_EXPERIENCE_IMPLEMENTATION.md](./MISSION_EXPERIENCE_IMPLEMENTATION.md) - Mission UX details
- [AUTHENTICATION_SYSTEM.md](./AUTHENTICATION_SYSTEM.md) - Privy authentication
- [RBAC_INTEGRATION_GUIDE.md](./RBAC_INTEGRATION_GUIDE.md) - Integration guide

## Summary

The Role-Based Mission Filtering system creates a focused, efficient marketplace by showing users only the missions relevant to their role. Combined with ProtectedRoute and PermissionGate, it provides a complete three-layer security and UX model for the Club Run platform.
