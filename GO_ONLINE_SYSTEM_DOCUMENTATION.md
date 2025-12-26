# Go Online System Documentation

## Overview
The Go Online system allows RUNNER, DJ, and VERIFIED_DJ users to toggle their availability status for receiving missions and requests. This feature is **integrated in the ChatBot interface only** with full backend persistence and RBAC validation.

## Architecture

### Frontend Component
**Location**: `frontend/src/components/GoOnlineToggle/GoOnlineToggle.tsx`

The `GoOnlineToggle` component is a reusable, modular component that:
- Manages online/offline state with visual feedback
- Communicates with backend API using Privy JWT authentication
- Displays green gradient with ring effect when online, gray when offline
- Auto-loads user's current status on mount
- Only displays for eligible roles (RUNNER, DJ, VERIFIED_DJ)
- Syncs state with database persistence

### Component Props
```typescript
interface GoOnlineToggleProps {
  size?: 'sm' | 'md' | 'lg';        // Toggle size
  showLabel?: boolean;               // Show/hide label text
  className?: string;                // Additional CSS classes
  variant?: 'pill' | 'standard';    // Visual style
}
```

### Usage

#### ChatBot Integration (PRIMARY LOCATION)
The Go Online toggle is integrated into the ChatBot interface above the quick action buttons:

**Location**: `frontend/src/components/ChatBot.tsx`

```tsx
import { GoOnlineToggle } from './GoOnlineToggle';

// Inside ChatBot component, above quick actions
<div className="mb-3 flex justify-center">
  <GoOnlineToggle variant="pill" size="sm" />
</div>
```

**Visual Design**:
- Small pill-style toggle centered above action buttons
- Green gradient background with ring when ONLINE
- Gray background when offline
- Bold "🟢 ONLINE" text vs regular "Go Online" text
- Smooth scale and shadow transitions

## Backend API

### Endpoints

#### GET `/api/auth/online-status`
Get current user's online status

**Authentication**: Required
**Response**:
```json
{
  "isOnline": true
}
```

#### POST `/api/auth/online-status`
Update user's online status

**Authentication**: Required
**Authorization**: RUNNER, DJ, VERIFIED_DJ only
**Request Body**:
```json
{
  "isOnline": true
}
```

**Response**:
```json
{
  "success": true,
  "isOnline": true,
  "lastOnlineAt": "2025-12-25T10:30:00Z"
}
```

**Error Response** (403 - Forbidden):
```json
{
  "error": "Only RUNNER, DJ, and VERIFIED_DJ can go online"
}
```

### Database Schema
The online status is stored in the User model:

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  role         String   @default("GUEST")
  isOnline     Boolean  @default(false)
  lastOnlineAt DateTime?
  // ... other fields
}
```

## Integration Points

### ChatBot (ONLY ACTIVE LOCATION)
**File**: `frontend/src/components/ChatBot.tsx`
- Displays above quick action buttons in chat interface
- Small pill variant, centered with mb-3 spacing
- Only visible to RUNNER, DJ, VERIFIED_DJ roles
- Real-time state sync with backend

## Visual States

### Offline State
- **Container**: White background with slight transparency
- **Toggle Background**: Gray (#9ca3af)
- **Ball**: White, positioned left, scale 100%
- **Text**: "Go Online" in gray text
- **Transitions**: 300ms ease-in-out

### Online State
- **Container**: White background with green ring (ring-2 ring-green-400)
- **Toggle Background**: Green gradient (from-green-400 to-green-600)
- **Ball**: White, positioned right, scale 110% with shadow
- **Text**: "🟢 ONLINE" in bold green text (text-green-700)
- **Effect**: Scale 105% on text
- **Transitions**: 300ms ease-in-out with smooth animations

### Loading State
- **Opacity**: 50%
- **Cursor**: Not allowed
- **Disabled**: True
- **Prevents**: Multiple rapid clicks

## Role-Based Access Control (RBAC)

### Eligible Roles
✅ **RUNNER** - Can go online to receive delivery/pickup missions
✅ **DJ** - Can go online to receive music submissions
✅ **VERIFIED_DJ** - Can go online with verified status for premium features

### Ineligible Roles
❌ **GUEST** - Must upgrade to a working role
❌ **CLIENT** - Clients create missions, don't receive them
❌ **CURATOR** - Curators manage teams, don't go online
❌ **OPERATIONS** - Operations staff manage the platform
❌ **PARTNER** - Partners collaborate, don't go online
❌ **ADMIN** - Admins manage the system, don't go online

## Behavior & Logic

### Auto-Load on Mount
When component mounts, it:
1. Checks if user has eligible role
2. Fetches current online status from backend
3. Updates local state to match backend

### Toggle Interaction
When user clicks toggle:
1. Prevents interaction if already loading
2. Sets loading state
3. Sends POST request to backend with new status
4. On success: Updates local state and logs to console
5. On error: Logs error and maintains previous state
6. Clears loading state

### State Persistence
- Backend stores `isOnline` boolean in database
- Backend updates `lastOnlineAt` timestamp when going online
- State persists across sessions and page reloads
- State syncs automatically on component mount

## Environment Configuration

### API URL
The component uses environment variable for API endpoint:

```env
VITE_API_URL=http://localhost:3001
```

Default fallback: `http://localhost:3001`

## Error Handling

### Frontend Errors
- Network errors: Logged to console, state unchanged
- Permission errors: Logged to console
- Loading timeout: Prevented by loading state flag

### Backend Errors
- 403 Forbidden: Role not authorized
- 500 Server Error: Database or system error
- 401 Unauthorized: User not authenticated

## Testing

### Manual Testing Checklist
- [x] Toggle appears for RUNNER user
- [x] Toggle appears for DJ user  
- [x] Toggle appears for VERIFIED_DJ user
- [x] Toggle does NOT appear for GUEST user
- [x] Toggle does NOT appear for CLIENT user
- [x] Toggle does NOT appear for other ineligible roles
- [x] Click toggle changes visual state (green gradient vs gray)
- [x] Page refresh maintains online status
- [x] Backend stores status correctly with timestamps
- [x] Console logs status changes with role info
- [x] ChatBot integration shows toggle above quick actions
- [x] Privy JWT authentication works correctly
- [x] RBAC validation enforced on backend
- [x] Database migration completed (isOnline, lastOnlineAt fields)

### Verified Functionality
✅ **Authentication**: Privy JWT token sent in Authorization header  
✅ **State Sync**: Component fetches current status on mount  
✅ **Toggle Updates**: POST requests update database successfully  
✅ **Visual Feedback**: Dramatic green gradient with ring when online  
✅ **RBAC Enforcement**: Backend validates role before allowing toggle  
✅ **Database Persistence**: isOnline and lastOnlineAt stored correctly  
✅ **Error Handling**: 401/403/500 errors logged properly  

### API Testing
```bash
# Get status (requires Privy JWT token)
curl -X GET http://localhost:3001/api/auth/online-status \
  -H "Authorization: Bearer YOUR_PRIVY_JWT_TOKEN"

# Go online
curl -X POST http://localhost:3001/api/auth/online-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_JWT_TOKEN" \
  -d '{"isOnline": true}'

# Go offline
curl -X POST http://localhost:3001/api/auth/online-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_JWT_TOKEN" \
  -d '{"isOnline": false}'
```

### Backend Logs (Verified Working)
```
✅ Privy token verified for user: did:privy:cmjm3n76c02mgju0dxkhw21pn
✅ DJ user_xkhw21pn@privy.generated is now ONLINE
::1 - - [26/Dec/2025:04:32:52 +0000] "POST /api/auth/online-status HTTP/1.1" 200 74

✅ DJ user_xkhw21pn@privy.generated is now OFFLINE
::1 - - [26/Dec/2025:04:32:56 +0000] "POST /api/auth/online-status HTTP/1.1" 200 75
```

## Implementation Summary

### Completed Components
1. ✅ **GoOnlineToggle Component**: Modular, reusable with props for size/variant
2. ✅ **ChatBot Integration**: Primary and only active location for toggle
3. ✅ **Backend API Endpoints**: GET/POST `/api/auth/online-status` with RBAC
4. ✅ **Database Schema**: Added `isOnline` and `lastOnlineAt` to User model
5. ✅ **Prisma Migration**: Migration `20251226042917_add_online_status` applied
6. ✅ **Authentication**: Privy JWT token integration via `getAccessToken()`
7. ✅ **Visual Design**: Enhanced green gradient, ring, shadow effects
8. ✅ **Documentation**: Complete system documentation with examples

### Removed Components
- ❌ **Navigation Bar Toggle**: Removed to avoid state sync issues
- ❌ **Dashboard Toggle**: Removed per user requirements

## Future Enhancements

### Potential Features
1. **Real-time Updates**: WebSocket integration for instant status sync across tabs
2. **Auto-offline**: Automatically go offline after period of inactivity
3. **Notification System**: Alert users when they receive missions while online
4. **Analytics**: Track online/offline patterns, availability metrics
5. **Scheduling**: Allow users to schedule online/offline times
6. **Busy Status**: Add "Busy" state between Online and Offline
7. **Mission Queue**: Show number of pending missions when online

### Technical Improvements
1. **Optimistic Updates**: Update UI before API response for faster UX
2. **Retry Logic**: Auto-retry failed API calls with exponential backoff
3. **Offline Support**: Queue status changes when offline, sync when back online
5. **Accessibility**: ARIA labels, keyboard navigation
6. **Testing**: Unit tests, integration tests, E2E tests

## Troubleshooting

### Toggle Not Showing
1. Check user role: Must be RUNNER, DJ, or VERIFIED_DJ
2. Check authentication: User must be logged in
3. Check component import: Verify GoOnlineToggle is imported correctly
4. Check console: Look for errors

### Status Not Persisting
1. Check API URL in environment variables
2. Check backend is running on correct port
3. Check database connection
4. Check session cookie is being sent
5. Check CORS settings

### Visual Issues
1. Check Tailwind CSS is loaded
2. Check component props are correct
3. Check browser console for styling errors
4. Try different size/variant props

## Related Documentation
- [RBAC System](./RBAC_ROLE_SYSTEM_DOCUMENTATION.md)
- [Authentication System](./AUTHENTICATION_SYSTEM.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Mission System](./P2P_MISSIONS_README.md)

## Changelog

### v3.5.1 - 2025-12-25
- ✅ Created modular GoOnlineToggle component
- ✅ Added backend API endpoints
- ✅ Integrated into Navigation, Dashboard, and ChatBot
- ✅ Added RBAC restrictions
- ✅ Added state persistence
- ✅ Created comprehensive documentation

---

**Last Updated**: December 25, 2025
**Version**: 3.5.1
**Status**: ✅ Production Ready
