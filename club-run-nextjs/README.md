# Club Run - Next.js 14 Fitness Community Platform

A modern fitness community platform built with Next.js 14, Prisma, NextAuth.js, and a comprehensive RBAC (Role-Based Access Control) system.

## Features

- **Next.js 14 App Router** - Modern React framework with server-side rendering
- **Authentication** - NextAuth.js with Google OAuth and credentials provider
- **Database** - PostgreSQL with Prisma ORM
- **RBAC System** - Comprehensive role-based access control
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Modern styling with utility classes
- **Voice Permissions** - Manage microphone and camera permissions
- **Activity Management** - Create and join fitness activities
- **Notification System** - Real-time notifications for users
- **Messaging System** - Direct messaging between users

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Forms**: React Hook Form, Zod validation

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd club-run-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/club_run_db"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application includes a comprehensive database schema with:

### Core Models
- **User** - User accounts and authentication
- **UserProfile** - Extended user information
- **Activity** - Fitness activities and events
- **ActivityParticipant** - Activity participation tracking

### RBAC System
- **Role** - User roles (super_admin, admin, moderator, member, guest)
- **Permission** - Granular permissions (resource:action format)
- **UserRole** - Role assignments to users
- **RolePermission** - Permission assignments to roles
- **UserPermission** - Direct permission grants to users

### Additional Features
- **Notification** - User notifications system
- **Message** - Direct messaging between users
- **VoicePermission** - Microphone/camera permission tracking
- **SystemSetting** - Application configuration

## RBAC System

The Role-Based Access Control system provides:

### Default Roles
- **Super Admin** - Full system access
- **Admin** - Administrative access (excluding system settings)
- **Moderator** - Content moderation capabilities
- **Member** - Standard user access
- **Guest** - Limited read-only access

### Permission Matrix
Permissions follow the format `resource:action`:
- `user:create`, `user:read`, `user:update`, `user:delete`
- `activity:create`, `activity:read`, `activity:update`, `activity:delete`
- `notification:create`, `notification:read`, `notification:update`
- `message:send`, `message:read`
- `voice_permission:grant`, `voice_permission:revoke`

## API Routes

The application includes API routes for:

- **Authentication** - `/api/auth/[...nextauth]`
- **Users** - User management endpoints
- **Activities** - Activity CRUD operations
- **Notifications** - Notification management
- **Messages** - Messaging system
- **RBAC** - Role and permission management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── rbac.ts          # RBAC system
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

## Authentication

The application supports multiple authentication methods:

1. **Google OAuth** - Social login with Google
2. **Credentials** - Email/password authentication
3. **Session Management** - JWT-based sessions

### Default Admin Account

After running the seed script, you can log in with:
- **Email**: admin@clubrun.com
- **Password**: admin123

## Deployment

### Environment Variables

Ensure all required environment variables are set in production:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Database Setup

1. Set up a PostgreSQL database
2. Run migrations: `npm run db:migrate`
3. Seed the database: `npm run db:seed`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
