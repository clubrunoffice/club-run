# Voice Permission Synchronization

## Overview

The Club Run application now has a unified voice permission system that synchronizes microphone access permissions across all voice-enabled components. This ensures a consistent user experience regardless of which component is requesting voice access.

**NEW: Enhanced Permission Sync** - When you accept microphone permissions on either interface (main AI Copilot or chat widget), the permission state is automatically synchronized across both interfaces in real-time.

## Components

### 1. Global Voice Permission Manager (`chat-widget.js`)

The `VoicePermissionManager` is a global object that handles all voice permission logic:

```javascript
window.VoicePermissionManager = {
    PERMISSION_KEY: 'clubrun_mic_permission',
    PERMISSION_STATES: {
        NEVER: 'never',
        ALWAYS: 'always', 
        ASK: 'ask'
    },
    
    getStoredPermission() // Get current permission state
    setStoredPermission(permission) // Set permission and notify other components
    requestPermission() // Request microphone access with proper flow
    showPermissionDialog() // Show permission dialog with sync feedback
    resetPermission() // Reset to default state
}
```

### 2. Chat Widget (`chat-widget.js`)

The chat widget uses the global permission manager for all voice interactions:

- **Voice Mode Toggle**: Requests permission before activating
- **Microphone Button**: Uses shared permission state
- **Permission Dialog**: Centralized dialog with sync indicators
- **Permission Reset**: Global reset function with sync feedback
- **Real-time UI Updates**: Automatically updates when permissions change

### 3. Main AI Copilot (`index.html`)

The main AI Copilot voice activation now:

- Checks global permission state before activating
- Uses the same permission dialog as other components
- Provides fallback if permission manager isn't available
- Shows appropriate error messages for denied permissions
- **Real-time UI Updates**: Automatically updates when permissions change
- **Test Sync Button**: Allows testing permission synchronization

### 4. React Components

#### CopilotChat Component (`frontend/src/components/copilot/CopilotChat.tsx`)

- Voice input button checks global permissions first
- Falls back to basic functionality if permission manager unavailable
- Proper TypeScript integration with global types

#### Agents Page (`frontend/src/app/agents/page.tsx`)

- Voice command button uses global permission system
- Consistent permission flow across all voice features
- Error handling for permission denials

## Permission States

### `ASK` (Default)
- Shows permission dialog every time voice is activated
- User can choose to allow, deny, or set preference

### `ALWAYS`
- Automatically grants microphone access
- No dialog shown for subsequent requests
- **UI Updates**: Shows "Voice enabled" status across interfaces

### `NEVER`
- Blocks all microphone access attempts
- Shows helpful message about enabling in browser settings
- **UI Updates**: Shows "Voice disabled" status across interfaces

## Usage Examples

### Requesting Permission
```javascript
if (window.VoicePermissionManager) {
    const permission = await window.VoicePermissionManager.requestPermission();
    if (permission) {
        // Proceed with voice functionality
    } else {
        // Handle permission denied
    }
}
```

### Checking Current Status
```javascript
const currentPermission = window.VoicePermissionManager.getStoredPermission();
console.log('Current permission:', currentPermission);
```

### Resetting Permissions
```javascript
window.VoicePermissionManager.resetPermission();
// This will reset to 'ASK' state and notify all components
```

## Event System

The permission manager dispatches events when permissions change:

```javascript
window.addEventListener('voicePermissionChanged', (event) => {
    const { permission } = event.detail;
    // Update UI or state based on new permission
});
```

## Testing

### Check Permission Status
Click the checkmark button in the AI Copilot section to see current permission status across all components.

### Test Permission Sync
Click the sync button (🔄) in the AI Copilot section to test permission synchronization between interfaces.

### Reset Permissions
Use the "Reset Microphone Permissions" button in the chat widget to test the reset functionality.

### Test Voice Activation
Try activating voice mode in different components to see the synchronized permission flow.

## New Features

### Real-time Permission Sync
- When permissions are changed in one interface, all other interfaces update automatically
- Visual feedback shows when permissions are being synced
- Success notifications confirm when sync is complete

### Enhanced Permission Dialog
- Shows sync status while processing permission changes
- Success confirmation when permissions are synced
- Clear visual indicators for each permission state

### Test Sync Functionality
- Test button in main AI Copilot interface
- Test button in chat widget
- Simulates permission changes to verify sync works

## Browser Compatibility

- **Chrome/Edge**: Full support for permission API
- **Firefox**: Full support for permission API  
- **Safari**: Limited support, falls back gracefully
- **Mobile Browsers**: Varies by platform

## Security Considerations

- Permissions are stored in localStorage (user-controlled)
- No voice data is stored or transmitted
- Permission dialog clearly explains data usage
- Users can reset permissions at any time
- Browser-level permissions take precedence

## Troubleshooting

### Permission Not Syncing
1. Check if `VoicePermissionManager` is loaded
2. Verify localStorage access
3. Check browser console for errors
4. Use test sync button to verify functionality

### Voice Not Working
1. Check browser microphone permissions
2. Verify permission state in localStorage
3. Try resetting permissions
4. Check browser compatibility

### TypeScript Errors
1. Ensure `global.d.ts` is included in tsconfig
2. Check window object type declarations
3. Verify proper type checking for global objects 