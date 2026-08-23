import {
  BannerImage,
  ServiceCategory,
  TradeCard,
  HowItWorksStep,
  FaqItem,
  SupportFeature,
  QuickPrompt,
} from '@/types/home';

export const BANNER_IMAGES: BannerImage[] = [
  { id: '1', src: '/banner_images/brad-weaver-7IBmf8uH4WY-unsplash.jpg', alt: 'TradeSlot Banner 1' },
  { id: '2', src: '/banner_images/pexels-infinity-lifespaces-1420423121-30580527.jpg', alt: 'TradeSlot Banner 2' },
  { id: '3', src: '/banner_images/pexels-janzakelj-9389356.jpg', alt: 'TradeSlot Banner 3' },
  { id: '4', src: '/banner_images/pexels-karola-g-7285919.jpg', alt: 'TradeSlot Banner 4' },
  { id: '5', src: '/banner_images/pexels-karola-g-7285924.jpg', alt: 'TradeSlot Banner 5' },
  { id: '6', src: '/banner_images/pexels-ranjeet-860714737-27928761.jpg', alt: 'TradeSlot Banner 6' },
  { id: '7', src: '/banner_images/pexels-tima-miroshnichenko-6473982.jpg', alt: 'TradeSlot Banner 7' },
  { id: '8', src: '/banner_images/pexels-tima-miroshnichenko-6474482.jpg', alt: 'TradeSlot Banner 8' },
  { id: '9', src: '/banner_images/pexels-traveliving-6004890.jpg', alt: 'TradeSlot Banner 9' },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'All', label: 'All Services', icon: '⚡' },
  { id: 'Electrician', label: 'Electrical & EV', icon: '💡' },
  { id: 'Plumber', label: 'Plumbing & Gas', icon: '🔧' },
  { id: 'HVAC', label: 'Heating & AC', icon: '❄️' },
  { id: 'Carpentry', label: 'Carpentry & Wood', icon: '🪚' },
  { id: 'Roofing', label: 'Roofing & Gutter', icon: '🏠' },
  { id: 'Painting', label: 'Painting & Decor', icon: '🎨' },
];

export const FEATURED_TRADES: TradeCard[] = [
  {
    category: 'Electrician',
    title: 'Electrical & EV Charger Installation',
    traderName: 'Alex Morgan',
    role: 'Master Electrician • 12+ Yrs Exp',
    rating: '4.9',
    reviewCount: 142,
    hourlyRate: '$55',
    image: 'https://images.pexels.com/photos/38171148/pexels-photo-38171148.jpeg',
    tag: 'Available Today',
    area: 'North & Central London',
    features: ['NICEIC Certified', 'EV Ready', 'Emergency Callout'],
  },
  {
    category: 'Plumber',
    title: 'Emergency Plumbing & Boiler Servicing',
    traderName: 'David Miller',
    role: 'Gas Safe Heating Specialist',
    rating: '5.0',
    reviewCount: 98,
    hourlyRate: '$60',
    image: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg',
    tag: 'Fast 30m Response',
    area: 'West & South London',
    features: ['Gas Safe Registered', 'Leak Detection', 'Boiler Installs'],
  },
  {
    category: 'Carpentry',
    title: 'Custom Joinery & Architectural Woodwork',
    traderName: 'James Wilson',
    role: 'Master Carpenter & Joiner',
    rating: '4.8',
    reviewCount: 164,
    hourlyRate: '$50',
    image: 'https://images.pexels.com/photos/5974413/pexels-photo-5974413.jpeg',
    tag: 'Top Rated Pro',
    area: 'Camden & Islington',
    features: ['Bespoke Cabinets', 'Flooring', 'Door Fitting'],
  },
  {
    category: 'HVAC',
    title: 'Air Conditioning & Heat Pump Systems',
    traderName: 'Marcus Vance',
    role: 'HVAC Certified Engineer',
    rating: '4.9',
    reviewCount: 86,
    hourlyRate: '$65',
    image: 'https://images.pexels.com/photos/7347538/pexels-photo-7347538.jpeg',
    tag: 'Energy Certified',
    area: 'Greater London',
    features: ['F-Gas Certified', 'Eco Heat Pumps', 'Annual Servicing'],
  },
  {
    category: 'Roofing',
    title: 'Roof Repairs, Flat Roofs & Gutters',
    traderName: 'Sam Hughes',
    role: 'Roofing Contractor',
    rating: '4.9',
    reviewCount: 110,
    hourlyRate: '$55',
    image: 'https://images.pexels.com/photos/37623613/pexels-photo-37623613.jpeg',
    tag: 'Guaranteed Work',
    area: 'South & East London',
    features: ['Tile & Slate', 'Gutter Cleaning', '10-Yr Guarantee'],
  },
  {
    category: 'Painting',
    title: 'Interior & Exterior Precision Painting',
    traderName: 'Elena Rostova',
    role: 'Decorative Finish Expert',
    rating: '5.0',
    reviewCount: 79,
    hourlyRate: '$45',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    tag: 'Clean & Fast',
    area: 'Kensington & Chelsea',
    features: ['Dustless Sanding', 'Eco Paints', 'Commercial & Domestic'],
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    num: '1',
    title: 'Send Inquiry',
    description: 'Connect via WhatsApp or Web Chat. Share your job details and location.',
  },
  {
    num: '2',
    title: '30m Buffer Routing',
    description: "Our engine checks the trader's daily zone and adds travel buffers to avoid delays.",
  },
  {
    num: '3',
    title: 'Pick Schedule',
    description: 'Choose an available slot directly in our interactive schedule selector.',
  },
  {
    num: '4',
    title: 'Secure Stripe Pay',
    description: 'Pay securely online with Stripe escrow. The trader is notified and booked instantly.',
  },
];

export const FAQS: FaqItem[] = [
  {
    q: 'How does the automated 30-minute travel buffer work?',
    a: 'TradeSlot automatically calculates travel times between service locations and inserts a mandatory 30-minute buffer after every booking. This guarantees your tradesperson arrives on time without running late from prior appointments.',
  },
  {
    q: 'Can I book directly through WhatsApp?',
    a: 'Yes! You can tap "WhatsApp Booking" to instantly message our scheduling bot or verified tradesperson. Your slots and booking confirmations are synchronized across both WhatsApp and web in real-time.',
  },
  {
    q: 'How are payments protected?',
    a: 'All transactions are processed through Stripe Connect. Your booking fee and job payment are held securely and only transferred upon confirmed appointment scheduling.',
  },
  {
    q: 'How do tradespeople join TradeSlot?',
    a: 'Tradespeople can click "Trader Portal" to create an account, verify their credentials, set daily service zones, and connect their Stripe account for instant direct payouts.',
  },
];

export const CUSTOMER_CARE_HIGHLIGHTS: SupportFeature[] = [
  {
    icon: '⚡',
    iconBg: 'bg-emerald-100 text-emerald-700',
    title: 'Fast 60-Second Response',
    description: 'Instant assistance directly through WhatsApp or live Web Chat with zero bot delays.',
  },
  {
    icon: '🛡️',
    iconBg: 'bg-rose-100 text-[#E11D48]',
    title: '100% Vetted Trades',
    description: 'Every electrician, plumber, and carpenter is verified with background & trade credentials.',
  },
  {
    icon: '🚗',
    iconBg: 'bg-blue-100 text-blue-700',
    title: 'Guaranteed On-Time Arrival',
    description: 'Automated 30-minute travel buffer eliminates overlapping appointments and delays.',
  },
  {
    icon: '💳',
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'Stripe Protected Escrow',
    description: 'Your deposit is safely held via Stripe and only completed once your appointment is confirmed.',
  },
];

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'service',
    label: 'I want a service',
    icon: '🛠️',
    desc: 'Electrician, Plumber, Carpentry etc.',
    defaultMsg: 'Hi, I would like to request a trade service.',
  },
  {
    id: 'book',
    label: 'I want to book a slot',
    icon: '📅',
    desc: 'Check dates & book guaranteed slot',
    defaultMsg: 'Hi, I want to check available time slots and book an appointment.',
  },
  {
    id: 'emergency',
    label: 'Emergency repair inquiry',
    icon: '⚡',
    desc: 'Urgent callout needed today',
    defaultMsg: 'Hi, I need an urgent emergency repair callout as soon as possible.',
  },
  {
    id: 'quote',
    label: 'Ask a question / Custom quote',
    icon: '💬',
    desc: 'Get pricing & job consultation',
    defaultMsg: 'Hi, I have a question about a job and would like to get a price quote.',
  },
];
