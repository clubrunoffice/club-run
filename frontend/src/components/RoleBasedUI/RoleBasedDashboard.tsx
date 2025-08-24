import React from 'react';
import { useRBAC } from '../../contexts/RBACContext';
import { PermissionGate } from './PermissionGate';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
  permission?: {
    resource: string;
    action: string;
  };
  theme: any;
}

const DashboardCard: React.FC<DashboardCard> = ({ title, description, icon, href, theme }) => {
  return (
    <div 
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
      style={{ borderLeft: `4px solid ${theme.primary}` }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div 
            className="flex-shrink-0 p-3 rounded-md"
            style={{ backgroundColor: theme.background }}
          >
            <div style={{ color: theme.primary }}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-sm text-gray-900">
                {description}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <a
            href={href}
            className="font-medium hover:text-gray-900 transition-colors duration-200"
            style={{ color: theme.primary }}
          >
            View details
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  theme: any;
  disabled?: boolean;
}> = ({ label, icon, onClick, theme, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'hover:shadow-md focus:ring-offset-2'
        }
      `}
      style={{
        backgroundColor: disabled ? '#f3f4f6' : theme.primary,
        color: disabled ? '#9ca3af' : 'white',
        borderColor: disabled ? '#d1d5db' : theme.primary
      }}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

export const RoleBasedDashboard: React.FC = () => {
  const { user, isAuthenticated, getCurrentTheme, hasPermission, hasRole } = useRBAC();
  const theme = getCurrentTheme();

  // Role-specific emoji badges
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'GUEST': return '👤';
      case 'RUNNER': return '🏃‍♂️';
      case 'DJ': return '🎵';
      case 'VERIFIED_DJ': return '✅';
      case 'CLIENT': return '🎯';
      case 'CURATOR': return '🎨';
      case 'OPERATIONS': return '⚙️';
      case 'PARTNER': return '🤝';
      case 'ADMIN': return '👑';
      default: return '👤';
    }
  };

  // Role-specific subtitles
  const getRoleSubtitle = (role: string) => {
    switch (role) {
      case 'GUEST': return 'Welcome! Sign up to start your journey';
      case 'RUNNER': return 'Ready to run missions and earn money';
      case 'DJ': return 'Ready to receive music? Review incoming submissions';
      case 'VERIFIED_DJ': return 'Your verified status unlocks premium music curation features';
      case 'CLIENT': return 'Create missions and connect with talented DJs';
      case 'CURATOR': return 'Curate amazing experiences and manage teams';
      case 'OPERATIONS': return 'Keep the platform running smoothly';
      case 'PARTNER': return 'Manage your partnerships and collaborations';
      case 'ADMIN': return 'Full system control and administration';
      default: return 'Welcome to Club Run';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome to Club Run
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access your dashboard
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <a
              href="/auth"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ backgroundColor: theme.primary }}
            >
              Sign In
            </a>
            <a
              href="/auth"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Role-specific dashboard cards
  const getDashboardCards = (): DashboardCard[] => {
    const baseCards: DashboardCard[] = [];

    // GUEST users get limited view
    if (user.role === 'GUEST') {
      return [
        {
          title: 'My Profile',
          description: 'View and update your profile information',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          href: '/profile',
          theme
        }
      ];
    }

    // All authenticated users get profile card
    baseCards.push({
      title: 'My Profile',
      description: 'View and update your profile information',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: '/profile',
      theme
    });

    // DJ-specific cards
    if (hasRole('DJ') || hasRole('VERIFIED_DJ')) {
      baseCards.push(
        {
          title: 'Music Submissions',
          description: 'Review and manage incoming music submissions',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          ),
          href: '/music-submissions',
          permission: { resource: 'music-submissions', action: 'read' },
          theme
        },
        {
          title: 'Submission History',
          description: 'View your past music submissions and feedback',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          href: '/submission-history',
          permission: { resource: 'music-submissions', action: 'read' },
          theme
        },
        {
          title: 'Expenses',
          description: 'Track and submit your expenses',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          ),
          href: '/expenses',
          permission: { resource: 'expenses', action: 'read' },
          theme
        }
      );
    }

    // Client-specific cards
    if (hasRole('CLIENT')) {
      baseCards.push(
        {
          title: 'Create Mission',
          description: 'Create new missions for DJs',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          href: '/missions/create',
          permission: { resource: 'missions', action: 'create' },
          theme
        },
        {
          title: 'P2P Missions',
          description: 'Manage peer-to-peer missions',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          href: '/p2p-missions',
          permission: { resource: 'p2p-missions', action: 'read' },
          theme
        }
      );
    }

    // VERIFIED_DJ specific cards
    if (hasRole('VERIFIED_DJ')) {
      baseCards.push(
        {
          title: 'Serato Integration',
          description: 'Connect your Serato account for seamless integration',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ),
          href: '/serato',
          permission: { resource: 'serato', action: 'read' },
          theme
        }
      );
    }

    // Curator-specific cards
    if (hasRole('CURATOR')) {
      baseCards.push(
        {
          title: 'Team Management',
          description: 'Manage your teams and members',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ),
          href: '/teams',
          permission: { resource: 'teams', action: 'read' },
          theme
        }
      );
    }

    // Operations/Admin-specific cards
    if (hasRole('OPERATIONS') || hasRole('ADMIN')) {
      baseCards.push(
        {
          title: 'User Management',
          description: 'Manage users and their roles',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ),
          href: '/admin/users',
          permission: { resource: 'user', action: 'read' },
          theme
        },
        {
          title: 'System Analytics',
          description: 'View system statistics and reports',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          href: '/admin/stats',
          permission: { resource: 'stats', action: 'read' },
          theme
        }
      );
    }

    return baseCards;
  };

  // Role-specific quick actions with enhanced theming
  const getQuickActions = () => {
    const actions = [];

    // Role-based mission creation - only show the most relevant one
    if (hasRole('CLIENT')) {
      // Clients primarily create traditional missions
      if (hasPermission('missions', 'create')) {
        actions.push({
          label: 'Create Mission',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          onClick: () => window.location.href = '/missions/create',
          theme: theme
        });
      }
    } else if (hasRole('CURATOR')) {
      // Curators primarily create P2P missions for collaborations
      if (hasPermission('p2p-missions', 'create')) {
        actions.push({
          label: 'Create P2P Mission',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          onClick: () => window.location.href = '/p2p-missions/create',
          theme: { ...theme, primary: '#8b5cf6' } // Purple accent for P2P
        });
      }
    } else if (hasRole('DJ') || hasRole('VERIFIED_DJ')) {
      // DJs receive music submissions
      if (hasPermission('music-submissions', 'read')) {
        actions.push({
          label: 'Music Submissions',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          ),
          onClick: () => window.location.href = '/music-submissions',
          theme: { ...theme, primary: '#3b82f6' } // Blue for music submissions
        });
      }
    } else if (hasRole('RUNNER')) {
      // Runners browse missions and can check in
      if (hasPermission('missions', 'read')) {
        actions.push({
          label: 'Browse Missions',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          onClick: () => window.location.href = '/missions',
          theme: { ...theme, primary: '#3b82f6' } // Blue for browsing
        });
      }
    } else if (hasRole('OPERATIONS') || hasRole('ADMIN')) {
      // Operations/Admin can create both types but prioritize traditional missions
      if (hasPermission('missions', 'create')) {
        actions.push({
          label: 'Create Mission',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          onClick: () => window.location.href = '/missions/create',
          theme: theme
        });
      }
    }

    // Check-in only for runners
    if (hasRole('RUNNER') && hasPermission('checkins', 'create')) {
      actions.push({
        label: 'Check In',
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        onClick: () => window.location.href = '/checkins/create',
        theme: { ...theme, primary: '#10b981' } // Green theme for check-ins
      });
    }

    if (hasPermission('expenses', 'create')) {
      actions.push({
        label: 'Submit Expense',
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        onClick: () => window.location.href = '/expenses/create',
        theme: { ...theme, primary: '#6366f1' } // Indigo theme for expenses
      });
    }

    return actions;
  };

  const dashboardCards = getDashboardCards();
  const quickActions = getQuickActions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Enhanced Role-Based Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  🚀 PRE-MVP 3.5
                </span>
                <span className="text-sm text-gray-500">Curator Role & Appointed-Team Mission System</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getRoleBadge(user.role)}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user.name || user.email}!
                  </h1>
                  <p className="mt-1 text-lg text-gray-600">
                    {getRoleSubtitle(user.role)}
                  </p>
                </div>
              </div>
            </div>
            <div 
              className="px-6 py-3 rounded-full text-lg font-bold text-white shadow-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <span className="flex items-center space-x-2">
                <span className="text-2xl">{getRoleBadge(user.role)}</span>
                <span>{user.role}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        {quickActions.length > 0 && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  label={action.label}
                  icon={action.icon}
                  onClick={action.onClick}
                  theme={action.theme || theme}
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Dashboard Cards */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Dashboard</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card, index) => (
              <PermissionGate
                key={index}
                roles={card.roles}
                resource={card.permission?.resource}
                action={card.permission?.action}
              >
                <DashboardCard {...card} />
              </PermissionGate>
            ))}
          </div>
        </div>

        {/* Enhanced Role-Specific Getting Started Section */}
        <div className="px-4 py-6 sm:px-0">
          <div 
            className="rounded-xl p-8 shadow-lg border"
            style={{ 
              backgroundColor: theme.background,
              borderColor: theme.primary + '20'
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getRoleBadge(user.role)}</span>
              <h3 className="text-xl font-bold" style={{ color: theme.text }}>
                Getting Started with {user.role}
              </h3>
            </div>
            <p className="text-base leading-relaxed" style={{ color: theme.text }}>
              {user.role === 'GUEST' && "Welcome to Club Run! Sign up to start creating missions, connecting with DJs, and building your music community."}
              {user.role === 'DJ' && "Review incoming music submissions, manage your music library, and create playlists for your audience. Build your reputation as a music curator and get verified for premium features."}
              {user.role === 'VERIFIED_DJ' && "Your verified status unlocks premium music curation features! Connect your Serato account for seamless integration, access exclusive submissions, and enjoy priority music reviews."}
              {user.role === 'CLIENT' && "Create missions to connect with talented DJs, manage P2P missions for collaborations, and track your bookings. Build your network and find the perfect music for your events."}
              {user.role === 'CURATOR' && "Curate amazing experiences by managing teams, coordinating with DJs and clients, and creating memorable events. Your expertise drives the community forward."}
              {user.role === 'OPERATIONS' && "Keep the platform running smoothly by monitoring system activity, managing users, and ensuring quality control. Your oversight maintains the community standards."}
              {user.role === 'PARTNER' && "Manage your partnerships and collaborations effectively. Access partner-specific features and build strong relationships within the music community."}
              {user.role === 'ADMIN' && "Full system control and administration capabilities. Monitor platform health, manage users, and configure system settings to ensure optimal performance."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
