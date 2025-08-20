# Club Run Frontend

Elite nightlife operations platform with AI copilot integration - Built with Next.js and sustainability in mind.

## 🚀 Features

- **Multi-agent AI system** with conversational copilot
- **Responsive design** (desktop sidebar, tablet collapsible, mobile bottom nav)
- **Real-time features** via WebSocket integration
- **Light/dark theme system** with smooth transitions
- **Token-based gamification** with mission tracking
- **Professional venue management** for Atlanta nightlife
- **PWA support** with offline capabilities
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for server state
- **Socket.io** for real-time communication

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: Zustand + React Query
- **Real-time**: Socket.io-client
- **Authentication**: JWT with localStorage
- **PWA**: next-pwa plugin
- **UI Components**: Headless UI + Custom components

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── venues/           # Venues page
│   ├── missions/         # Missions page
│   ├── profile/          # Profile page
│   ├── community/        # Community page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── layout/          # Layout components
│   ├── dashboard/       # Dashboard components
│   ├── venues/          # Venue components
│   ├── missions/        # Mission components
│   ├── copilot/         # AI copilot components
│   └── ui/              # UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── store/               # Zustand stores
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🎨 Design System

### Theme System
The application uses CSS custom properties for theming with support for light and dark modes:

```css
:root[data-theme="dark"] {
  --bg-primary: #0D1117;
  --bg-surface: #1A202C;
  --bg-glass: rgba(26, 32, 44, 0.8);
  --text-primary: #FFFFFF;
  --text-secondary: #A0AEC0;
  --accent-primary: #00E5FF;
  --accent-secondary: #8B5CF6;
  --success: #00FF88;
  --warning: #FFD700;
  --error: #FF073A;
}
```

### Glassmorphism Components
```css
.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--shadow);
}
```

### Responsive Breakpoints
- **Mobile**: 320px-767px (bottom nav, single column)
- **Tablet**: 768px-1199px (collapsible sidebar, 2-3 columns)
- **Desktop**: 1200px+ (fixed sidebar, multi-column)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd club-run-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run analyze` - Analyze bundle size
- `npm run format` - Format code with Prettier
- `npm run pwa:generate` - Generate PWA assets

## 🔧 Configuration

### Next.js Configuration
The application is configured with:
- PWA support via `next-pwa`
- Image optimization
- Security headers
- Bundle analysis
- TypeScript strict mode

### PWA Configuration
- Service worker for offline support
- App manifest for installation
- Cache strategies for optimal performance
- Push notification support

### API Integration
- Axios for HTTP requests
- JWT authentication
- Request/response interceptors
- Error handling
- WebSocket integration

## 🎯 Key Components

### AppShell
The main layout component that provides:
- Responsive navigation
- Theme switching
- AI copilot integration
- Mobile/desktop adaptations

### AI Copilot
Conversational interface with:
- Real-time chat
- Voice input support
- Action execution
- Context awareness

### Dashboard
Main user interface featuring:
- Agent status cards
- Quick statistics
- Recent activity feed
- Quick actions

### Venue Management
Comprehensive venue features:
- Browse and search venues
- Check-in functionality
- Real-time crowd levels
- Safety ratings
- Route planning

### Mission System
Gamification elements:
- Daily/weekly missions
- Progress tracking
- Token rewards
- Achievement system

## 🔐 Authentication

The application uses JWT-based authentication:
- Token storage in localStorage
- Automatic token refresh
- Protected routes
- Role-based access control

## 📱 PWA Features

- **Installable**: Add to home screen
- **Offline support**: Service worker caching
- **Push notifications**: Real-time updates
- **Background sync**: Data synchronization
- **App-like experience**: Full-screen mode

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔄 State Management

### Zustand Store
Centralized state management with:
- User authentication
- Theme preferences
- Navigation state
- Real-time data
- UI state

### React Query
Server state management:
- API data caching
- Background updates
- Optimistic updates
- Error handling

## 🌐 API Integration

### REST Endpoints
- Authentication (`/auth/*`)
- Venues (`/venues/*`)
- Missions (`/missions/*`)
- User management (`/users/*`)
- Check-ins (`/checkins/*`)

### WebSocket Events
- Real-time updates
- AI copilot responses
- Notifications
- Live venue data

## 🎨 Styling Guidelines

### CSS Architecture
- Tailwind CSS for utility classes
- CSS Modules for component styles
- CSS custom properties for theming
- Responsive design patterns

### Component Styling
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Accessibility considerations

## 🔍 Performance

### Optimization Strategies
- Code splitting
- Image optimization
- Bundle analysis
- Lazy loading
- Service worker caching

### Monitoring
- Core Web Vitals
- Bundle size tracking
- Performance budgets
- Error tracking

## 🛡️ Security

### Best Practices
- HTTPS enforcement
- Security headers
- XSS protection
- CSRF protection
- Input validation

### Authentication
- JWT token management
- Secure token storage
- Token refresh
- Session management

## 📈 Analytics

### User Analytics
- Page views
- User interactions
- Performance metrics
- Error tracking

### Business Metrics
- Check-in rates
- Mission completion
- User engagement
- Venue popularity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔮 Roadmap

- [ ] Advanced AI features
- [ ] Social features
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Internationalization
- [ ] Advanced gamification
- [ ] Venue partnerships

---

Built with ❤️ for the Atlanta nightlife community 