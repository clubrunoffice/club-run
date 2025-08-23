const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clubrun.com' },
    update: {},
    create: {
      email: 'admin@clubrun.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      tokenBalance: 1000,
      currentStreak: 5,
      totalCheckIns: 50,
      missionsCompleted: 25,
      level: 'Legend',
      theme: 'dark',
      badges: JSON.stringify(['admin', 'founder', 'early-adopter']),
      isActive: true
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample users
  console.log('👥 Creating sample users...');
  
  const runnerPassword = await bcrypt.hash('password123', 10);
  const runner = await prisma.user.upsert({
    where: { email: 'runner@clubrun.com' },
    update: {},
    create: {
      email: 'runner@clubrun.com',
      passwordHash: runnerPassword,
      name: 'DJ Runner',
      role: 'RUNNER',
      tokenBalance: 500,
      currentStreak: 3,
      totalCheckIns: 20,
      missionsCompleted: 10,
      level: 'Professional',
      theme: 'dark',
      badges: JSON.stringify(['verified', 'top-performer']),
      isActive: true
    }
  });
  console.log('✅ Created RUNNER user:', runner.email);

  const clientPassword = await bcrypt.hash('password123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@clubrun.com' },
    update: {},
    create: {
      email: 'client@clubrun.com',
      passwordHash: clientPassword,
      name: 'Event Client',
      role: 'CLIENT',
      tokenBalance: 200,
      currentStreak: 1,
      totalCheckIns: 5,
      missionsCompleted: 2,
      level: 'Newcomer',
      theme: 'light',
      badges: JSON.stringify(['verified']),
      isActive: true
    }
  });
  console.log('✅ Created CLIENT user:', client.email);

  const curatorPassword = await bcrypt.hash('password123', 10);
  const curator = await prisma.user.upsert({
    where: { email: 'curator@clubrun.com' },
    update: {},
    create: {
      email: 'curator@clubrun.com',
      passwordHash: curatorPassword,
      name: 'Festival Curator',
      role: 'CURATOR',
      tokenBalance: 2000,
      currentStreak: 10,
      totalCheckIns: 100,
      missionsCompleted: 50,
      level: 'Legend',
      theme: 'dark',
      badges: JSON.stringify(['curator', 'premium', 'verified']),
      isActive: true
    }
  });
  console.log('✅ Created CURATOR user:', curator.email);

  const operationsPassword = await bcrypt.hash('password123', 10);
  const operations = await prisma.user.upsert({
    where: { email: 'operations@clubrun.com' },
    update: {},
    create: {
      email: 'operations@clubrun.com',
      passwordHash: operationsPassword,
      name: 'Operations Manager',
      role: 'OPERATIONS',
      tokenBalance: 300,
      currentStreak: 2,
      totalCheckIns: 15,
      missionsCompleted: 8,
      level: 'Professional',
      theme: 'dark',
      badges: JSON.stringify(['operations', 'verified']),
      isActive: true
    }
  });
  console.log('✅ Created OPERATIONS user:', operations.email);

  const partnerPassword = await bcrypt.hash('password123', 10);
  const partner = await prisma.user.upsert({
    where: { email: 'partner@clubrun.com' },
    update: {},
    create: {
      email: 'partner@clubrun.com',
      passwordHash: partnerPassword,
      name: 'Partner Venue',
      role: 'PARTNER',
      tokenBalance: 400,
      currentStreak: 4,
      totalCheckIns: 25,
      missionsCompleted: 15,
      level: 'Professional',
      theme: 'dark',
      badges: JSON.stringify(['partner', 'verified']),
      isActive: true
    }
  });
  console.log('✅ Created PARTNER user:', partner.email);

  // Create sample teams for curator
  console.log('👥 Creating sample teams...');
  
  const atlTeam = await prisma.team.upsert({
    where: { id: 'atl-team-1' },
    update: {},
    create: {
      id: 'atl-team-1',
      name: 'ATL Residency DJs',
      description: 'Premium Atlanta-based DJ team for high-end events',
      curatorId: curator.id,
      isActive: true
    }
  });
  console.log('✅ Created ATL team:', atlTeam.name);

  const festivalTeam = await prisma.team.upsert({
    where: { id: 'festival-team-1' },
    update: {},
    create: {
      id: 'festival-team-1',
      name: 'Festival Elite',
      description: 'Top-tier festival and outdoor event performers',
      curatorId: curator.id,
      isActive: true
    }
  });
  console.log('✅ Created Festival team:', festivalTeam.name);

  // Add runner to ATL team
  await prisma.user.update({
    where: { id: runner.id },
    data: { teamId: atlTeam.id }
  });
  console.log('✅ Added runner to ATL team');

  // Create sample venues
  console.log('🏢 Creating sample venues...');
  
  const venue1 = await prisma.venue.upsert({
    where: { id: 'venue-1' },
    update: {},
    create: {
      id: 'venue-1',
      name: 'The Underground',
      address: '123 Main St, Atlanta, GA',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      latitude: 33.7490,
      longitude: -84.3880,
      type: 'Nightclub',
      hours: '9 PM - 2 AM',
      phoneNumber: '(404) 555-0123',
      website: 'https://underground-atl.com',
      checkInReward: 50,
      status: 'open',
      crowdLevel: 'High',
      safetyRating: 4.5,
      avgCost: 75,
      specialMissions: JSON.stringify(['VIP Service', 'Sound Check']),
      amenities: JSON.stringify(['VIP Area', 'Sound System', 'Parking']),
      isActive: true
    }
  });
  console.log('✅ Created venue:', venue1.name);

  const venue2 = await prisma.venue.upsert({
    where: { id: 'venue-2' },
    update: {},
    create: {
      id: 'venue-2',
      name: 'Skyline Lounge',
      address: '456 Peachtree St, Atlanta, GA',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30308',
      latitude: 33.7701,
      longitude: -84.3802,
      type: 'Lounge',
      hours: '6 PM - 12 AM',
      phoneNumber: '(404) 555-0456',
      website: 'https://skyline-lounge.com',
      checkInReward: 30,
      status: 'open',
      crowdLevel: 'Medium',
      safetyRating: 4.2,
      avgCost: 50,
      specialMissions: JSON.stringify(['Ambient Music', 'Cocktail Service']),
      amenities: JSON.stringify(['Rooftop', 'Bar', 'Seating']),
      isActive: true
    }
  });
  console.log('✅ Created venue:', venue2.name);

  // Create sample missions
  console.log('🎯 Creating sample missions...');
  
  const mission1 = await prisma.mission.upsert({
    where: { id: 'mission-1' },
    update: {},
    create: {
      id: 'mission-1',
      title: 'Weekend DJ Performance',
      description: 'Provide high-energy DJ performance for weekend crowd',
      type: 'performance',
      difficulty: 'Medium',
      reward: 200,
      requirements: JSON.stringify(['Own equipment', 'Professional attire', '3+ hours']),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true
    }
  });
  console.log('✅ Created mission:', mission1.title);

  const mission2 = await prisma.mission.upsert({
    where: { id: 'mission-2' },
    update: {},
    create: {
      id: 'mission-2',
      title: 'Corporate Event Music',
      description: 'Provide ambient music for corporate networking event',
      type: 'performance',
      difficulty: 'Easy',
      reward: 150,
      requirements: JSON.stringify(['Professional attire', 'Background music', '2 hours']),
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      isActive: true
    }
  });
  console.log('✅ Created mission:', mission2.title);

  // Create sample P2P missions
  console.log('🌐 Creating sample P2P missions...');
  
  const p2pMission1 = await prisma.p2pMission.upsert({
    where: { id: 'p2p-mission-1' },
    update: {},
    create: {
      id: 'p2p-mission-1',
      curatorId: curator.id,
      teamId: atlTeam.id,
      title: 'Premium Wedding Reception',
      description: 'High-end wedding reception with 200+ guests',
      venueAddress: '789 Luxury Ave, Atlanta, GA',
      eventType: 'Wedding Reception',
      budget: 800,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      paymentMethod: 'cashapp',
      ipfsHash: 'QmSampleHash123',
      status: 'OPEN',
      requirements: JSON.stringify(['Own equipment', 'Wedding experience', 'Professional attire']),
      openMarket: false // Team-only mission
    }
  });
  console.log('✅ Created team P2P mission:', p2pMission1.title);

  const p2pMission2 = await prisma.p2pMission.upsert({
    where: { id: 'p2p-mission-2' },
    update: {},
    create: {
      id: 'p2p-mission-2',
      curatorId: client.id,
      title: 'Bar Mitzvah Celebration',
      description: 'Family celebration with mixed age groups',
      venueAddress: '321 Family St, Atlanta, GA',
      eventType: 'Family Event',
      budget: 400,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      paymentMethod: 'zelle',
      ipfsHash: 'QmSampleHash456',
      status: 'OPEN',
      requirements: JSON.stringify(['Family-friendly music', 'Own equipment', '4 hours']),
      openMarket: true // Open marketplace mission
    }
  });
  console.log('✅ Created open P2P mission:', p2pMission2.title);

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@clubrun.com / admin123');
  console.log('Runner: runner@clubrun.com / password123');
  console.log('Client: client@clubrun.com / password123');
  console.log('Curator: curator@clubrun.com / password123');
  console.log('Operations: operations@clubrun.com / password123');
  console.log('Partner: partner@clubrun.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 