# Google OAuth Setup Guide

## Current Status: Demo Mode ✅

The Google authentication is currently working in **demo mode** for testing purposes. When you click the "Sign up with Google" or "Sign in with Google" buttons, it will:

1. Show a loading message
2. Simulate the Google OAuth flow
3. Create a demo user account
4. Log you in successfully

## For Production: Real Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized origins:
   - `http://localhost:8081` (for development)
   - `https://yourdomain.com` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:8081/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`

### Step 2: Update Frontend Configuration

Replace the demo implementation in `frontend/index.html` with real Google OAuth:

```javascript
// Replace the demo function with real Google OAuth
async function signInWithGoogle() {
    try {
        // Initialize Google OAuth
        const client = google.accounts.oauth2.initTokenClient({
            client_id: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID', // Replace with your client ID
            scope: 'email profile',
            callback: async (response) => {
                if (response.error) {
                    showToast('Google sign in failed: ' + response.error, 'error');
                    return;
                }
                
                try {
                    // Get user info from Google
                    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: {
                            'Authorization': `Bearer ${response.access_token}`
                        }
                    });
                    
                    const userInfo = await userInfoResponse.json();
                    
                    // Send to our backend for authentication
                    const authResponse = await fetch('http://localhost:3001/api/auth/google', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            accessToken: response.access_token,
                            userInfo: userInfo
                        })
                    });
                    
                    const authData = await authResponse.json();
                    
                    if (authResponse.ok) {
                        // Sign in successful
                        currentUser = authData.user;
                        isAuthenticated = true;
                        
                        // Save token and user to localStorage
                        localStorage.setItem('clubrun_token', authData.token);
                        localStorage.setItem('clubrun_user', JSON.stringify(authData.user));
                        
                        // Update UI
                        updateAuthUI();
                        closeAuthModal();
                        showToast('Welcome back! 🎉', 'success');
                    } else {
                        throw new Error(authData.error || 'Authentication failed');
                    }
                } catch (error) {
                    console.error('Google auth error:', error);
                    showToast('Google authentication failed', 'error');
                }
            }
        });
        
        client.requestAccessToken();
    } catch (error) {
        console.error('Google OAuth error:', error);
        showToast('Google sign in is not available', 'error');
    }
}
```

### Step 3: Environment Variables

Add your Google Client ID to your environment:

```bash
# In backend/.env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# In frontend/.env.local (if using Next.js)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Testing the Current Demo

Right now, you can test the Google authentication by:

1. Visit: http://localhost:8081
2. Click "Sign Up" or "Sign In"
3. Click "Sign up with Google" or "Sign in with Google"
4. Watch the demo flow complete successfully!

The demo creates a test user with:
- Email: `demo-google@clubrun.com`
- Name: `Demo Google User`
- Avatar: Google-style placeholder image

## Backend API Endpoints

The backend now supports these authentication endpoints:

- `POST /api/auth/register` - Email/password registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

All endpoints are working and tested! 🎉 