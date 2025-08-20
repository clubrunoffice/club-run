# Club Run - Pre-MVP 0.1 🎉

**AI-Powered Nightlife Operations Platform**

A comprehensive platform for nightlife business optimization with intelligent AI agents, real-time analytics, and automated operations management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "CLUB RUN"
   ```

2. **Start the main homepage**
   ```bash
   python3 -m http.server 8081
   ```
   Visit: http://localhost:8081

3. **Start the Agent Dashboard**
   ```bash
   cd frontend
   python3 -m http.server 8080
   ```
   Visit: http://localhost:8080/index.html

## 📁 Project Structure

```
CLUB RUN/
├── index.html              # Main purple gradient homepage
├── template.html           # Template for new pages
├── chat-widget.js          # Global chat widget
├── frontend/               # Frontend application
│   ├── index.html         # Agent Dashboard (light theme)
│   ├── src/               # React/Next.js source code
│   ├── styles/            # Global styles
│   └── package.json       # Frontend dependencies
└── backend/               # Backend API (separate repo)
    ├── src/               # Express.js server
    ├── prisma/            # Database schema
    └── package.json       # Backend dependencies
```

## 🎨 Design System

### Main Homepage (Purple Theme)
- **Background**: Purple gradient (`#8B5CF6` to `#7C3AED`)
- **Style**: Glassmorphism with backdrop blur
- **Features**: Hero section, feature cards, AI agents showcase

### Agent Dashboard (Light Theme)
- **Background**: Light gray (`bg-gray-50`)
- **Style**: Clean white cards with shadows
- **Features**: Agent status cards, quick actions, floating FAB

## 🔧 Features Implemented

### ✅ Core Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Glassmorphism Effects**: Modern UI with backdrop blur
- **Agent Dashboard**: Real-time agent status monitoring
- **Navigation System**: Smooth transitions and hover effects
- **Chat Widget**: Global chat functionality

### ✅ AI Agents
- **Research Agent**: Venue trend analysis (85% efficiency)
- **Budget Agent**: Expense tracking (99% efficiency)
- **Reporting Agent**: Data processing (98% efficiency)
- **AI Copilot**: Voice assistant (90% listening)

### ✅ UI Components
- **Hero Sections**: Engaging landing pages
- **Feature Cards**: Glassmorphism design
- **Status Indicators**: Real-time efficiency metrics
- **Quick Actions**: One-click operations
- **Floating Action Button**: Mobile-friendly interactions

## 🎯 Pre-MVP 0.1 Highlights

### Design Excellence
- **Purple Gradient Homepage**: Eye-catching main landing page
- **Clean Agent Dashboard**: Professional light theme interface
- **Responsive Layout**: Works on all device sizes
- **Modern Typography**: Inter font family throughout

### Technical Foundation
- **Static HTML/CSS**: Fast loading and reliable
- **Tailwind CSS**: Utility-first styling
- **Modular Structure**: Easy to maintain and extend
- **Cross-browser Compatible**: Works on all modern browsers

### User Experience
- **Intuitive Navigation**: Clear information hierarchy
- **Visual Feedback**: Hover states and transitions
- **Accessibility**: Proper contrast and semantic HTML
- **Performance**: Optimized assets and minimal dependencies

## 🚀 Next Steps for MVP

### Frontend Enhancements
- [ ] React/Next.js integration
- [ ] User authentication system
- [ ] Real-time data updates
- [ ] Advanced dashboard features

### Backend Integration
- [ ] API endpoints for data
- [ ] Database connectivity
- [ ] AI agent integration
- [ ] Real-time WebSocket communication

### Additional Features
- [ ] User profiles and settings
- [ ] Mission system implementation
- [ ] Expense tracking interface
- [ ] Venue management system

## 🛠️ Development

### Running Locally
```bash
# Main homepage
python3 -m http.server 8081

# Agent dashboard
cd frontend && python3 -m http.server 8080

# React development (when ready)
cd frontend && npm run dev
```

### File Structure
- `index.html` - Main homepage with purple gradient
- `frontend/index.html` - Agent dashboard interface
- `chat-widget.js` - Global chat functionality
- `template.html` - Base template for new pages

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🎨 Color Palette

### Purple Theme (Main Homepage)
- Primary: `#8B5CF6` (Violet-500)
- Secondary: `#7C3AED` (Violet-600)
- Accent: `#A855F7` (Violet-500)

### Light Theme (Agent Dashboard)
- Background: `#F9FAFB` (Gray-50)
- Cards: `#FFFFFF` (White)
- Text: `#111827` (Gray-900)
- Accent: `#3B82F6` (Blue-500)

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a Pre-MVP release. For feedback and suggestions, please contact the development team.

---

**🎉 Club Run Pre-MVP 0.1** - Ready for demonstration and feedback! 