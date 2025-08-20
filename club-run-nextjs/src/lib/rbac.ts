import { prisma } from './prisma'

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
}

export interface UserPermissions {
  roles: string[]
  permissions: string[]
}

// Permission checking utilities
export const hasPermission = (
  userPermissions: UserPermissions,
  resource: string,
  action: string
): boolean => {
  const permissionName = `${resource}:${action}`
  return userPermissions.permissions.includes(permissionName)
}

export const hasRole = (
  userPermissions: UserPermissions,
  roleName: string
): boolean => {
  return userPermissions.roles.includes(roleName)
}

export const hasAnyRole = (
  userPermissions: UserPermissions,
  roleNames: string[]
): boolean => {
  return roleNames.some(role => userPermissions.roles.includes(role))
}

export const hasAllRoles = (
  userPermissions: UserPermissions,
  roleNames: string[]
): boolean => {
  return roleNames.every(role => userPermissions.roles.includes(role))
}

// Role management functions
export const createRole = async (
  name: string,
  description?: string,
  permissionIds?: string[]
): Promise<Role> => {
  const role = await prisma.role.create({
    data: {
      name,
      description,
      permissions: permissionIds ? {
        create: permissionIds.map(permissionId => ({
          permission: {
            connect: { id: permissionId }
          }
        }))
      } : undefined
    },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  })

  return {
    id: role.id,
    name: role.name,
    description: role.description || undefined,
    permissions: role.permissions.map((rp: any) => ({
      id: rp.permission.id,
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action,
      description: rp.permission.description || undefined
    }))
  }
}

export const assignRoleToUser = async (
  userId: string,
  roleId: string
): Promise<void> => {
  await prisma.userRole.create({
    data: {
      userId,
      roleId
    }
  })
}

export const removeRoleFromUser = async (
  userId: string,
  roleId: string
): Promise<void> => {
  await prisma.userRole.delete({
    where: {
      userId_roleId: {
        userId,
        roleId
      }
    }
  })
}

export const getUserPermissions = async (userId: string): Promise<UserPermissions> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      },
      permissions: {
        include: {
          permission: true
        }
      }
    }
  })

  if (!user) {
    return { roles: [], permissions: [] }
  }

  const roles = user.userRoles.map((ur: any) => ur.role.name)
  const rolePermissions = user.userRoles.flatMap((ur: any) =>
    ur.role.permissions.map((rp: any) => rp.permission.name)
  )
  const userPermissions = user.permissions
    .filter((up: any) => up.granted)
    .map((up: any) => up.permission.name)

  const allPermissions = [...new Set([...rolePermissions, ...userPermissions])]

  return {
    roles,
    permissions: allPermissions
  }
}

// Permission management functions
export const createPermission = async (
  name: string,
  resource: string,
  action: string,
  description?: string
): Promise<Permission> => {
  const permission = await prisma.permission.create({
    data: {
      name,
      resource,
      action,
      description
    }
  })

  return {
    id: permission.id,
    name: permission.name,
    resource: permission.resource,
    action: permission.action,
    description: permission.description || undefined
  }
}

export const grantPermissionToUser = async (
  userId: string,
  permissionId: string,
  grantedBy?: string
): Promise<void> => {
  await prisma.userPermission.upsert({
    where: {
      userId_permissionId: {
        userId,
        permissionId
      }
    },
    update: {
      granted: true,
      grantedAt: new Date(),
      grantedBy
    },
    create: {
      userId,
      permissionId,
      granted: true,
      grantedAt: new Date(),
      grantedBy
    }
  })
}

export const revokePermissionFromUser = async (
  userId: string,
  permissionId: string
): Promise<void> => {
  await prisma.userPermission.update({
    where: {
      userId_permissionId: {
        userId,
        permissionId
      }
    },
    data: {
      granted: false,
      revokedAt: new Date()
    }
  })
}

// Predefined roles and permissions
export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
  GUEST: 'guest'
}

export const DEFAULT_PERMISSIONS = {
  // User management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Activity management
  ACTIVITY_CREATE: 'activity:create',
  ACTIVITY_READ: 'activity:read',
  ACTIVITY_UPDATE: 'activity:update',
  ACTIVITY_DELETE: 'activity:delete',
  ACTIVITY_JOIN: 'activity:join',
  ACTIVITY_LEAVE: 'activity:leave',
  
  // Notification management
  NOTIFICATION_CREATE: 'notification:create',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_UPDATE: 'notification:update',
  NOTIFICATION_DELETE: 'notification:delete',
  
  // Messaging
  MESSAGE_SEND: 'message:send',
  MESSAGE_READ: 'message:read',
  
  // Voice permissions
  VOICE_PERMISSION_GRANT: 'voice_permission:grant',
  VOICE_PERMISSION_REVOKE: 'voice_permission:revoke',
  
  // System management
  SYSTEM_SETTINGS_READ: 'system_settings:read',
  SYSTEM_SETTINGS_UPDATE: 'system_settings:update'
}

// Initialize default roles and permissions
export const initializeRBAC = async (): Promise<void> => {
  // Create default permissions
  const permissions = await Promise.all(
    Object.entries(DEFAULT_PERMISSIONS).map(([key, value]) =>
      prisma.permission.upsert({
        where: { name: value },
        update: {},
        create: {
          name: value,
          resource: value.split(':')[0],
          action: value.split(':')[1],
          description: `Permission to ${value.split(':')[1]} ${value.split(':')[0]}`
        }
      })
    )
  )

  // Create default roles with permissions
  const superAdminPermissions = permissions.map(p => p.id)
  const adminPermissions = permissions
    .filter(p => !p.name.includes('system_settings'))
    .map(p => p.id)
  const moderatorPermissions = permissions
    .filter(p => ['activity:read', 'activity:update', 'notification:create', 'notification:read', 'user:read'].includes(p.name))
    .map(p => p.id)
  const memberPermissions = permissions
    .filter(p => ['activity:read', 'activity:join', 'activity:leave', 'notification:read', 'message:send', 'message:read'].includes(p.name))
    .map(p => p.id)
  const guestPermissions = permissions
    .filter(p => ['activity:read', 'notification:read'].includes(p.name))
    .map(p => p.id)

  await Promise.all([
    prisma.role.upsert({
      where: { name: DEFAULT_ROLES.SUPER_ADMIN },
      update: {},
      create: {
        name: DEFAULT_ROLES.SUPER_ADMIN,
        description: 'Full system access',
        permissions: {
          create: superAdminPermissions.map(permissionId => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      }
    }),
    prisma.role.upsert({
      where: { name: DEFAULT_ROLES.ADMIN },
      update: {},
      create: {
        name: DEFAULT_ROLES.ADMIN,
        description: 'Administrative access',
        permissions: {
          create: adminPermissions.map(permissionId => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      }
    }),
    prisma.role.upsert({
      where: { name: DEFAULT_ROLES.MODERATOR },
      update: {},
      create: {
        name: DEFAULT_ROLES.MODERATOR,
        description: 'Moderation access',
        permissions: {
          create: moderatorPermissions.map(permissionId => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      }
    }),
    prisma.role.upsert({
      where: { name: DEFAULT_ROLES.MEMBER },
      update: {},
      create: {
        name: DEFAULT_ROLES.MEMBER,
        description: 'Member access',
        permissions: {
          create: memberPermissions.map(permissionId => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      }
    }),
    prisma.role.upsert({
      where: { name: DEFAULT_ROLES.GUEST },
      update: {},
      create: {
        name: DEFAULT_ROLES.GUEST,
        description: 'Guest access',
        permissions: {
          create: guestPermissions.map(permissionId => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      }
    })
  ])
} 