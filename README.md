# Club Run Platform 🎉

**AI-Powered Nightlife Operations - Main Platform**

The main landing page and documentation hub for the Club Run platform. This repository contains the beautiful purple gradient homepage and serves as the central entry point for the entire platform.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for local server)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <platform-repo-url>
   cd club-run-platform
   ```

2. **Start the main homepage**
   ```bash
   python3 -m http.server 8081
   ```
   Visit: http://localhost:8081

## 📁 Project Structure

```
club-run-platform/
├── index.html              # Main purple gradient homepage
├── template.html           # Template for new pages
├── chat-widget.js          # Global chat widget
├── README.md              # This documentation
└── RELEASE_NOTES.md       # Release information
```

## 🎨 Design System

### Main Homepage (Purple Theme)
- **Background**: Purple gradient (`#8B5CF6` to `#7C3AED`)
- **Style**: Glassmorphism with backdrop blur
- **Features**: Hero section, feature cards, AI agents showcase

### Key Features
- **Responsive Design**: Mobile-first approach
- **Modern UI/UX**: Tailwind CSS with smooth animations
- **Glassmorphism Effects**: Beautiful backdrop blur effects
- **Professional Branding**: Consistent Club Run identity

## 🔗 Connected Repositories

### Frontend Application
- **Repository**: `club-run-frontend`
- **Technology**: React/Next.js, TypeScript, Tailwind CSS
- **Purpose**: Agent dashboard and user interface
- **URL**: http://localhost:3000

### Backend API
- **Repository**: `club-run-backend`
- **Technology**: Node.js, Express.js, PostgreSQL, Prisma
- **Purpose**: API endpoints and database management
- **URL**: http://localhost:3001

## 🎯 Platform Overview

### Main Homepage Features
- ✅ **Hero Section**: Eye-catching introduction with call-to-action
- ✅ **Feature Showcase**: AI agents and platform capabilities
- ✅ **Navigation**: Links to frontend and backend applications
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Modern Animations**: Smooth transitions and hover effects

### AI Agents Highlighted
- **Research Agent**: Venue trend analysis (85% efficiency)
- **Budget Agent**: Expense tracking (99% efficiency)
- **Reporting Agent**: Data processing (98% efficiency)
- **AI Copilot**: Voice assistant (90% listening)

## 🛠️ Development

### Running Locally
```bash
# Start main homepage
python3 -m http.server 8081
# Visit: http://localhost:8081

# Alternative: Use any static file server
npx serve .
# or
npx http-server .
```

### File Descriptions
- `index.html` - Main homepage with purple gradient and glassmorphism
- `template.html` - Base template for creating new pages
- `chat-widget.js` - Global chat functionality
- `README.md` - Platform documentation
- `RELEASE_NOTES.md` - Release information

## 🎨 Color Palette

### Purple Theme (Main Homepage)
- **Primary Purple**: `#8B5CF6` (Violet-500)
- **Secondary Purple**: `#7C3AED` (Violet-600)
- **Accent**: `#A855F7` (Violet-500)
- **Glass Effect**: `rgba(255, 255, 255, 0.1)`
- **Text**: `#FFFFFF` (White)

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔗 Integration Points

### Frontend Connection
- **Launch Button**: Links to `http://localhost:3000`
- **Navigation**: Seamless transition to agent dashboard
- **Branding**: Consistent visual identity

### Backend Connection
- **API Ready**: Configured for backend integration
- **Chat Widget**: Connects to backend chat system
- **Data Flow**: Prepared for real-time updates

## 🚀 Deployment

### Static Hosting
This platform is ready for deployment on:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting
- **AWS S3**: Scalable static hosting
- **Cloudflare Pages**: Fast global CDN

### Environment Setup
```bash
# Production build (if needed)
# This is a static site, no build process required

# Deploy to Netlify
netlify deploy

# Deploy to Vercel
vercel

# Deploy to GitHub Pages
git push origin main
```

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is the main platform repository. For contributions:
- **Frontend**: Contribute to `club-run-frontend` repository
- **Backend**: Contribute to `club-run-backend` repository
- **Platform**: Submit issues and suggestions here

---

**🎉 Club Run Platform** - The beautiful entry point to AI-powered nightlife operations! 