import { PrismaClient } from '@prisma/client'
import { initializeRBAC } from '../src/lib/rbac'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Initialize RBAC system
  console.log('Initializing RBAC system...')
  await initializeRBAC()

  // Create a default super admin user
  console.log('Creating default super admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@clubrun.com' },
    update: {},
    create: {
      email: 'admin@clubrun.com',
      name: 'Super Admin',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  })

  // Assign super admin role
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'super_admin' }
  })

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id
        }
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id
      }
    })
  }

  // Create some sample activities
  console.log('Creating sample activities...')
  const activities = [
    {
      title: 'Morning Run',
      description: 'Early morning 5K run around the park',
      type: 'running',
      distance: 5.0,
      duration: 30,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      location: 'Central Park',
      maxParticipants: 10,
      createdBy: adminUser.id
    },
    {
      title: 'Cycling Group',
      description: 'Group cycling session for all levels',
      type: 'cycling',
      distance: 20.0,
      duration: 60,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      location: 'Riverside Trail',
      maxParticipants: 15,
      createdBy: adminUser.id
    }
  ]

  for (const activity of activities) {
    await prisma.activity.create({
      data: activity
    })
  }

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 