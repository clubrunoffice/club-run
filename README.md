# 🎵 Club Run - Mission & Music Platform

## 🚀 Overview

Club Run is a revolutionary mission-based platform connecting DJs, Runners, Clients, and Curators through a sophisticated RBAC system. Built with modern web technologies and AI-powered features, Club Run enables seamless mission assignment, real-time availability tracking, and community collaboration.

**Current Version**: PRE MVP 4.0 (December 25, 2025)

## 📊 Repository Status

- **Version**: PRE MVP 4.0
- **Status**: ✅ Production Ready
- **GitHub Compatibility**: ✅ Ready
- **Documentation**: 📚 Comprehensive
- **Testing**: ✅ Verified

## 🛠️ Technical Stack

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **State Management**: React Context

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Prisma ORM
- **Authentication**: Google OAuth
- **Real-time**: WebSocket

## 🏗️ Project Structure

```
club-run-clean/
├── frontend-src/          # React frontend source code
├── backend-src/           # Node.js backend source code
├── .gitattributes         # Git LFS configuration
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
└── *.md                  # Documentation files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-github-repo-url]
   cd club-run-clean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 Features

### For Musicians
- AI-powered music learning
- Interactive practice sessions
- Community collaboration tools
- Progress tracking

### For Developers
- Role-based access control
- Real-time chat system
- Admin dashboard
- API documentation

### For Community
- User management
- Event coordination
- Resource sharing
- Community engagement

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Documentation

### Core Documentation
- **[PRE MVP 4.0 Release Notes](PRE_MVP_4.0_RELEASE_NOTES.md)** - Latest release features and changes
- [API Documentation](API_DOCUMENTATION.md) - Complete API endpoint reference
- [RBAC Role System](RBAC_ROLE_SYSTEM_DOCUMENTATION.md) - Role-based access control guide
- [RBAC Testing Guide](RBAC_TESTING_GUIDE.md) - Comprehensive testing scenarios

### Feature Documentation
- **[Go Online System](GO_ONLINE_SYSTEM_DOCUMENTATION.md)** - Real-time availability tracking (NEW in 4.0)
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [Authentication System](AUTHENTICATION_SYSTEM.md) - Privy OAuth integration
- [Expense System](ENHANCED_EXPENSES_SYSTEM.md) - RUNNER-only expense tracking

### Developer Resources
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Technical overview
- [Setup Guide](SETUP_COMPLETE.md) - Local development setup
- [Production Setup](PRODUCTION_SETUP_GUIDE.md) - Production environment configuration

## 🎵 Community

- **Support**: Check documentation or file an issue
- **Contributions**: See [Contributing Guidelines](CONTRIBUTING.md)
- **Updates**: Follow release notes for latest features

## 🏆 Version History

### PRE MVP 4.0 (December 25, 2025) - CURRENT
- ✅ **Go Online System**: Real-time availability tracking for RUNNER/DJ/VERIFIED_DJ
- ✅ **Role Refinement**: Removed expenses from DJ role (RUNNER-exclusive)
- ✅ **Enhanced Navigation**: Added Home button to all pages
- ✅ **Database Migration**: Added isOnline/lastOnlineAt fields
- ✅ **Full Documentation**: 6 files updated with comprehensive guides

### Previous Releases
- [PRE MVP 3.777 Release Notes](RELEASE_NOTES_3.777.md)
- [PRE MVP 3.6 Release Notes](RELEASE_NOTES_3.6.md)
- [PRE MVP 3.5 Release Notes](RELEASE_NOTES_3.5.md)
- [PRE MVP 3.0 Release Notes](RELEASE_NOTES_3.0.md)
- [PRE MVP 1.0 Release Notes](RELEASE_NOTES_1.0.md)

## 🚀 Roadmap

### Phase 4.1: Real-time Enhancements (Next)
- [ ] WebSocket integration for cross-tab sync
- [ ] Auto-offline after inactivity
- [ ] Mission notifications when online
- [ ] Analytics dashboard for availability metrics

### Phase 5.0: Advanced Features (Planned)
- [ ] Scheduling online/offline times
- [ ] Busy status intermediate state
- [ [ ] Geolocation tracking for online runners
- [ ] Mission queue display

### Long-term Vision
- [ ] Mobile application
- [ ] Advanced AI mission matching
- [ ] International expansion
- [ ] Enterprise features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Our amazing community of musicians and developers
- Open source contributors
- Beta testers and early adopters
- Technical advisors and mentors

---

**Built with ❤️ for the music education community**

*Every technical improvement brings us closer to revolutionizing music education and building the future of community-driven learning.* 🎵✨ 