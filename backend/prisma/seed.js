const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create default agents
  const agents = [
    {
      name: 'research',
      displayName: 'Research Agent',
      description: 'Analyzes venue data and crowd intelligence',
      status: 'active',
      confidence: 87.0
    },
    {
      name: 'budget',
      displayName: 'Budget Agent', 
      description: 'Tracks expenses and financial optimization',
      status: 'active',
      confidence: 92.0
    },
    {
      name: 'reporting',
      displayName: 'Reporting Agent',
      description: 'Processes check-ins and generates analytics',
      status: 'active', 
      confidence: 95.0
    },
    {
      name: 'copilot',
      displayName: 'Copilot',
      description: 'Conversational AI assistant for all operations',
      status: 'listening',
      confidence: 98.0
    }
  ];

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { name: agent.name },
      update: agent,
      create: agent
    });
  }

  // Create Atlanta venues
  const venues = [
    {
      name: 'MJQ Concourse',
      address: '736 Ponce de Leon Ave NE, Atlanta, GA 30306',
      type: 'nightclub',
      hours: '10 PM - 3 AM',
      checkInReward: 10,
      status: 'open',
      crowdLevel: 'Medium',
      safetyRating: 4.2,
      avgCost: 25,
      specialMissions: ['Photo Check-in: +15 tokens', 'Review Venue: +5 tokens'],
      amenities: ['Dance Floor', 'VIP Area', 'Live Music', 'Cocktail Bar']
    },
    {
      name: '529 Bar',
      address: '529 Flat Shoals Ave SE, Atlanta, GA 30316',
      type: 'bar',
      hours: '9 PM - 2 AM',
      checkInReward: 10,
      status: 'open',
      crowdLevel: 'High',
      safetyRating: 4.5,
      avgCost: 20,
      specialMissions: ['DJ Set Review: +20 tokens'],
      amenities: ['Outdoor Patio', 'Live Music', 'Craft Beer', 'Food Menu']
    },
    {
      name: 'Aisle 5',
      address: '1492 Piedmont Ave NE, Atlanta, GA 30309',
      type: 'nightclub',
      hours: '11 PM - 3 AM',
      checkInReward: 10,
      status: 'opening_soon',
      crowdLevel: 'Low',
      safetyRating: 4.1,
      avgCost: 30,
      specialMissions: ['Early Bird Check-in: +25 tokens'],
      amenities: ['Live Music', 'Dance Floor', 'Cocktail Bar', 'VIP Tables']
    },
    {
      name: 'Paradise Lounge',
      address: '1123 Zonolite Rd NE, Atlanta, GA 30306',
      type: 'lounge',
      hours: '8 PM - 1 AM',
      checkInReward: 10,
      status: 'open',
      crowdLevel: 'Medium',
      safetyRating: 3.8,
      avgCost: 35,
      specialMissions: ['VIP Area Photo: +30 tokens'],
      amenities: ['VIP Lounge', 'Bottle Service', 'Dance Floor', 'Cocktail Bar']
    },
    {
      name: 'Opera Nightclub',
      address: '1150 Crescent Ave NE, Atlanta, GA 30309',
      type: 'nightclub',
      hours: '10 PM - 3 AM',
      checkInReward: 15,
      status: 'open',
      crowdLevel: 'High',
      safetyRating: 4.3,
      avgCost: 40,
      specialMissions: ['VIP Check-in: +25 tokens'],
      amenities: ['VIP Bottle Service', 'Dance Floor', 'Live DJs', 'Cocktail Bar']
    },
    {
      name: 'Believe Music Hall',
      address: '1924 Piedmont Cir NE, Atlanta, GA 30324',
      type: 'music_venue',
      hours: '7 PM - 2 AM',
      checkInReward: 12,
      status: 'open',
      crowdLevel: 'Medium',
      safetyRating: 4.4,
      avgCost: 28,
      specialMissions: ['Concert Review: +20 tokens'],
      amenities: ['Live Music', 'Dance Floor', 'Bar', 'Food Options']
    }
  ];

  // Clear existing venues and create new ones
  await prisma.venue.deleteMany({});
  
  for (const venue of venues) {
    await prisma.venue.create({
      data: venue
    });
  }

  // Create default missions
  const missions = [
    {
      title: 'Triple Threat',
      description: 'Check into 3 different venues tonight',
      type: 'daily',
      category: 'check_in',
      target: 3,
      reward: 30,
      timeLimit: '24h',
      priority: 1
    },
    {
      title: 'Show & Tell',
      description: 'Upload 5 venue photos',
      type: 'daily',
      category: 'photo',
      target: 5,
      reward: 25,
      timeLimit: '24h',
      priority: 2
    },
    {
      title: 'Money Manager',
      description: 'Log all expenses for the night',
      type: 'daily',
      category: 'budget',
      target: 1,
      reward: 15,
      timeLimit: '24h',
      priority: 3
    },
    {
      title: 'Consistency King',
      description: 'Check-in 7 days in a row',
      type: 'weekly',
      category: 'streak',
      target: 7,
      reward: 100,
      timeLimit: '7d',
      priority: 1
    },
    {
      title: 'Venue Explorer',
      description: 'Visit 10 different venues this week',
      type: 'weekly',
      category: 'check_in',
      target: 10,
      reward: 75,
      timeLimit: '7d',
      priority: 2
    },
    {
      title: 'Budget Master',
      description: 'Track $500 in expenses this month',
      type: 'weekly',
      category: 'budget',
      target: 500,
      reward: 50,
      timeLimit: '30d',
      priority: 3
    },
    {
      title: 'Social Butterfly',
      description: 'Check into 5 venues with photos',
      type: 'special',
      category: 'photo',
      target: 5,
      reward: 40,
      timeLimit: '7d',
      priority: 1
    }
  ];

  // Clear existing missions and create new ones
  await prisma.mission.deleteMany({});
  
  for (const mission of missions) {
    await prisma.mission.create({
      data: mission
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 