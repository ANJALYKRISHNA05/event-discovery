import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const INITIAL_EVENTS = [
  {
    name: 'Global AI & Neural Summit 2026',
    description:
      'The premier international forum for artificial intelligence researchers, enterprise architects, machine learning leaders, and frontier tech visionaries. Featuring keynotes from pioneers in generative models, agentic workflows, quantum ML, and ethical AI systems.',
    category: 'Technology',
    industry: 'AI & Robotics',
    startDate: new Date('2026-10-15T09:00:00Z'),
    endDate: new Date('2026-10-17T18:00:00Z'),
    venue: 'Moscone Convention Center, South Hall',
    city: 'San Francisco',
    country: 'United States',
    organizer: 'Nexus Frontier Tech Alliance',
    website: 'https://globalsummit.ai',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'World HealthTech & Biotech Congress 2026',
    description:
      'Gathering over 8,000 healthcare innovators, clinical trial directors, MedTech engineers, and hospital executives. Discussions span CRISPR precision therapies, digital therapeutics, AI diagnostics, and sovereign medical data fabrics.',
    category: 'Healthcare',
    industry: 'Biotechnology & MedTech',
    startDate: new Date('2026-11-04T08:30:00Z'),
    endDate: new Date('2026-11-06T17:30:00Z'),
    venue: 'ExCeL London International Exhibition Centre',
    city: 'London',
    country: 'United Kingdom',
    organizer: 'BioGlobal Healthcare Network',
    website: 'https://healthtechcongress.org',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'FinTech Nexus & Global Capital Expo',
    description:
      'The definitive crossroads for decentralised capital, cross-border digital payments, central bank digital currencies (CBDCs), and institutional digital asset custodianship. Connect with top venture funds and fintech unicorns.',
    category: 'Finance',
    industry: 'FinTech & Blockchain',
    startDate: new Date('2026-09-22T09:00:00Z'),
    endDate: new Date('2026-09-25T18:00:00Z'),
    venue: 'Sands Expo & Convention Centre, Marina Bay',
    city: 'Singapore',
    country: 'Singapore',
    organizer: 'Global Fintech Council',
    website: 'https://fintechnexusglobal.com',
    image:
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
    status: 'ONGOING',
  },
  {
    name: 'CleanEnergy World Forum & Hydrogen Expo',
    description:
      'Accelerating global decarbonization, utility-scale grid modernization, green hydrogen ecosystems, and next-gen solid state energy storage. Bringing together energy ministers, climate venture capitalists, and infrastructure builders.',
    category: 'Energy & Sustainability',
    industry: 'Renewable Energy',
    startDate: new Date('2026-12-01T09:00:00Z'),
    endDate: new Date('2026-12-03T17:00:00Z'),
    venue: 'Dubai World Trade Centre (DWTC)',
    city: 'Dubai',
    country: 'United Arab Emirates',
    organizer: 'Emirates Energy Authority & IRENA Partner Network',
    website: 'https://cleanenergyworldexpo.ae',
    image:
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'Future Mobility & EV World Trade Show',
    description:
      'Experience live autonomous driving demonstrations, megawatt fast-charging infrastructure, eVTOL urban air mobility showcases, and supply chain manufacturing breakthroughs for next-gen electric vehicles.',
    category: 'Manufacturing',
    industry: 'Automotive & EV',
    startDate: new Date('2026-10-28T09:30:00Z'),
    endDate: new Date('2026-10-31T18:00:00Z'),
    venue: 'Messe Frankfurt Exhibition Grounds',
    city: 'Frankfurt',
    country: 'Germany',
    organizer: 'VDA Mobility Group',
    website: 'https://futuremobilityexpo.de',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'CyberShield Global Security Conference',
    description:
      'Hands-on red teaming, zero-trust architectures, post-quantum cryptographic resilience, and critical infrastructure cyber defense workshops led by former intelligence chiefs and world-class cybersecurity researchers.',
    category: 'Technology',
    industry: 'Cybersecurity',
    startDate: new Date('2026-11-12T08:00:00Z'),
    endDate: new Date('2026-11-14T17:00:00Z'),
    venue: 'Tokyo Big Sight, International Exhibition Center',
    city: 'Tokyo',
    country: 'Japan',
    organizer: 'Nippon Cybersecurity Consortium',
    website: 'https://cybershieldsummit.jp',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'Global Supply Chain & Logistics Expo',
    description:
      'Explore real-time multimodal freight tracking, automated robotic warehousing, predictive supply routing, and resilient maritime logistics solutions in an interconnected global trading economy.',
    category: 'Business & Trade',
    industry: 'Supply Chain & Logistics',
    startDate: new Date('2026-09-20T09:00:00Z'),
    endDate: new Date('2026-09-24T18:00:00Z'),
    venue: 'RAI Amsterdam Convention Centre',
    city: 'Amsterdam',
    country: 'Netherlands',
    organizer: 'EuroLogistics Trade Federation',
    website: 'https://globalsupplychainexpo.nl',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    status: 'ONGOING',
  },
  {
    name: 'Enterprise Cloud & DevOps Summit',
    description:
      'Deep-dive into multi-cloud governance, platform engineering, serverless microservices, eBPF telemetry, and continuous autonomous deployment pipelines for Fortune 500 engineering organizations.',
    category: 'Technology',
    industry: 'Cloud & Enterprise SaaS',
    startDate: new Date('2026-08-10T09:00:00Z'),
    endDate: new Date('2026-08-12T17:00:00Z'),
    venue: 'Seattle Convention Center, Arch Building',
    city: 'Seattle',
    country: 'United States',
    organizer: 'Cloud Native Scale Institute',
    website: 'https://enterprisecloudsummit.com',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    status: 'COMPLETED',
  },
  {
    name: 'OmniChannel Retail & E-Commerce Expo',
    description:
      'Transforming modern customer commerce: contextual AI shopping assistants, frictionless checkout hardware, live social commerce streaming, and ultra-fast direct-to-consumer micro-fulfillment.',
    category: 'Retail & E-commerce',
    industry: 'Retail & E-commerce',
    startDate: new Date('2026-11-18T09:00:00Z'),
    endDate: new Date('2026-11-20T17:30:00Z'),
    venue: 'Javits Center, Level 3',
    city: 'New York',
    country: 'United States',
    organizer: 'National Retail Strategy Group',
    website: 'https://omnichannelexpo.nyc',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'BioGenomics & Longevity World Summit',
    description:
      'Frontier research on cellular rejuvenation, epigenetic reprogramming, biomarker discovery pipelines, and clinical longevity interventions presented by world-renowned scientists.',
    category: 'Healthcare',
    industry: 'Biotechnology & MedTech',
    startDate: new Date('2026-12-08T09:00:00Z'),
    endDate: new Date('2026-12-10T17:00:00Z'),
    venue: 'Palais des Congrès de Paris',
    city: 'Paris',
    country: 'France',
    organizer: 'European Longevity Science Foundation',
    website: 'https://biogenomicssummit.fr',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'Industrial Robotics & Automation Forum',
    description:
      'Hands-on industrial automation workshops, cobot manufacturing workflows, computer vision defect inspection, and next-generation smart factory digital twin demonstrations.',
    category: 'Manufacturing',
    industry: 'AI & Robotics',
    startDate: new Date('2026-07-14T09:00:00Z'),
    endDate: new Date('2026-07-16T17:00:00Z'),
    venue: 'COEX Convention & Exhibition Center',
    city: 'Seoul',
    country: 'South Korea',
    organizer: 'Korea Robotics Industry Association',
    website: 'https://industrialroboticsforum.kr',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80',
    status: 'COMPLETED',
  },
  {
    name: 'Creative Economy & Digital Media Festival',
    description:
      'The international gathering for spatial computing creators, brand designers, immersive media producers, and interactive storytelling studios exploring spatial UI, synthetic media, and generative art.',
    category: 'Creative & Design',
    industry: 'Creative & Design',
    startDate: new Date('2026-10-05T10:00:00Z'),
    endDate: new Date('2026-10-08T19:00:00Z'),
    venue: 'Melbourne Convention and Exhibition Centre',
    city: 'Melbourne',
    country: 'Australia',
    organizer: 'Pacific Creative Guild',
    website: 'https://creativemediafest.org.au',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80',
    status: 'UPCOMING',
  },
];

export async function main() {
  console.log('🔄 Seeding database with realistic global events...');

  // Clear existing
  await prisma.event.deleteMany({});

  // Insert seed events
  for (const ev of INITIAL_EVENTS) {
    await prisma.event.create({
      data: ev,
    });
  }

  const count = await prisma.event.count();
  console.log(`✅ Database successfully seeded with ${count} events!`);
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Error during seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
