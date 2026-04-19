export const SERVICES = [
  { id: 'express', name: 'Express Shine', priceFrom: 59, time: 45, tier: 'Essential',
    desc: 'Quick exterior refresh: foam wash, hand dry, tire dressing. Perfect between full details.',
    features: ['Hand-wash + foam bath', 'Wheels & tires cleaned', 'Streak-free windows', 'Tire dressing', 'Mobile, we come to you']
  },
  { id: 'signature', name: 'Signature Detail', priceFrom: 159, time: 150, tier: 'Most booked', popular: true,
    desc: 'Our benchmark detail: full exterior decon, two-stage interior reset, and a 3-month sealant.',
    features: ['Everything in Express', 'Clay bar decontamination', 'Interior vacuum + steam', 'Leather cleaned & conditioned', '3-month paint sealant', 'Engine bay wipe-down']
  },
  { id: 'premier', name: 'Premier Ceramic', priceFrom: 549, time: 360, tier: 'Premium',
    desc: 'Multi-stage paint correction and a 3-year ceramic coating. By appointment only. Includes follow-up.',
    features: ['Everything in Signature', '1-step paint correction', '3-year ceramic coating', 'Headlight restoration', 'Ceramic wheel coat', '30-day inspection included']
  },
];

export const ADDONS = [
  { id: 'pet', name: 'Pet hair removal', price: 35, time: 30 },
  { id: 'ozone', name: 'Ozone odor treatment', price: 60, time: 60 },
  { id: 'engine', name: 'Engine bay deep clean', price: 45, time: 30 },
  { id: 'headlight', name: 'Headlight restoration', price: 55, time: 40 },
  { id: 'clay', name: 'Clay bar treatment', price: 40, time: 30 },
  { id: 'glass', name: 'Glass coating', price: 70, time: 30 },
];

export const VEHICLE_TYPES = [
  { id: 'sedan', name: 'Sedan', multiplier: 1.0 },
  { id: 'suv', name: 'SUV', multiplier: 1.15 },
  { id: 'truck', name: 'Truck', multiplier: 1.2 },
  { id: 'van', name: 'Van / XL', multiplier: 1.35 },
];
