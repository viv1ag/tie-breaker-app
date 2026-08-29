import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'pet-puppy-vs-cat',
    tag: 'Lifestyle & Home',
    title: 'Adopt an Energetic Puppy vs. Calm Rescue Cat',
    context: 'Working hybrid (3 days home, 2 in office). Living in a 2-bedroom apartment with a nearby park. Want companionship and daily joy.',
    options: [
      {
        title: 'Option A: Golden Retriever Puppy',
        description: 'High energy, great companionship, requires 2+ hours daily training & walking, higher first-year vet and care investment.',
      },
      {
        title: 'Option B: Adult Rescue Cat (3 yrs old)',
        description: 'Litter-trained, calm temperament, affectionate, minimal daily exercise needed, comfortable alone during office hours.',
      },
    ],
    priorities: ['Daily Time & Energy', 'Lifestyle Compatibility', 'Companionship & Wellbeing', 'Monthly Cost & Care'],
  },
  {
    id: 'car-hybrid-vs-keep',
    tag: 'Finances & Auto',
    title: 'Buy a New Fuel-Efficient Hybrid vs. Keep Old Sedan',
    context: 'Commuting 25 miles round-trip 4 days a week. Current 2015 sedan has 110k miles, fully paid off, but requires periodic maintenance.',
    options: [
      {
        title: 'Option A: Buy New Hybrid ($32,000)',
        description: '50+ MPG, latest active safety suite, 5-year warranty, monthly financing payment of $460/mo for 48 months.',
      },
      {
        title: 'Option B: Keep Driving 2015 Gas Sedan ($0/mo)',
        description: 'Zero monthly loan debt, lower insurance, 27 MPG, retain investment capital, budget for periodic repair visits.',
      },
    ],
    priorities: ['Total Monthly Cost', 'Daily Safety & Comfort', 'Reliability & Peace of Mind', 'Financial Flexibility'],
  },
  {
    id: 'housing-rent-alone-vs-roommates',
    tag: 'Housing & Living',
    title: 'Rent a Studio Alone vs. Share a 2-Bed with a Roommate',
    context: 'Flexible budget but aiming to grow personal savings. Value quiet evening focus after work, with occasional weekend socializing.',
    options: [
      {
        title: 'Option A: Studio Apartment Solo ($1,750/mo)',
        description: 'Complete personal autonomy, custom decor, zero roommate friction, compact floorplan, higher rent expenditure.',
      },
      {
        title: 'Option B: Share 2-Bed / 2-Bath ($1,100/mo)',
        description: 'Save $650/month, large shared living space and full kitchen, split utility bills, requires shared chore coordination.',
      },
    ],
    priorities: ['Monthly Rent Savings', 'Personal Privacy & Autonomy', 'Living Space & Comfort', 'Social Balance'],
  },
  {
    id: 'vacation-roadtrip-vs-resort',
    tag: 'Travel & Leisure',
    title: 'Scenic Mountain Road Trip vs. All-Inclusive Beach Resort',
    context: 'Planning a 10-day summer break after an intensive work cycle. Traveling as a couple with a total budget around $3,500.',
    options: [
      {
        title: 'Option A: Scenic Mountain Road Trip',
        description: 'Explore national parks, local towns, open itinerary, 3-4 hours driving every couple days, memorable active exploration.',
      },
      {
        title: 'Option B: All-Inclusive Beach Resort',
        description: 'Zero itinerary planning, full dining & amenities on site, ocean relaxation, restorative downtime.',
      },
    ],
    priorities: ['Rest & Recovery', 'Exploration & Memory', 'Low Planning Overhead', 'Budget Efficiency'],
  },
  {
    id: 'career-startup-vs-established',
    tag: 'Career & Growth',
    title: 'Join an Early-Stage Startup vs. Stay at an Established Firm',
    context: '4 years of industry experience. Seeking faster career advancement and broader scope, while evaluating stability and workload balance.',
    options: [
      {
        title: 'Option A: Series-A Growth Startup',
        description: 'Direct ownership of core projects, rapid learning curve, equity upside, dynamic hours and changing scope.',
      },
      {
        title: 'Option B: Established Enterprise Firm',
        description: 'Predictable 40-hour schedule, comprehensive benefits, steady compensation structure, structured hierarchy.',
      },
    ],
    priorities: ['Career Trajectory & Skill Growth', 'Work-Life Balance', 'Role Stability & Compensation', 'Long-Term Upside'],
  },
  {
    id: 'learning-coding-vs-language',
    tag: 'Skills & Development',
    title: 'Learn Conversational Spanish vs. Learn Full-Stack Coding',
    context: '5-7 hours available per week. Goal is to build a high-leverage personal skill over the next 12 months.',
    options: [
      {
        title: 'Option A: Conversational Spanish',
        description: 'Immediate conversational utility, travel ease across 20+ countries, rich cultural access, interactive learning.',
      },
      {
        title: 'Option B: Web Development & Automation',
        description: 'Build custom software tools, explore technical freelancing or side ventures, requires rigorous analytical problem solving.',
      },
    ],
    priorities: ['Practical Everyday Value', 'Skill Retention & Engagement', 'Career & Economic Upside', 'Cognitive Challenge'],
  },
];


