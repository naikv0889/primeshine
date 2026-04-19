export const REVIEWS = [
  { n: 5, q: "Jason showed up on time, set up in my driveway, and my Civic looked showroom fresh 2 hours later. Worth every penny.", name: "Maya P.", sub: "Signature Detail · Alhambra", av: "MP" },
  { n: 5, q: "Three years of kid mess gone in one afternoon. They steamed out stains I thought were permanent. Booking the Premier next.", name: "Daniel K.", sub: "Interior reset · San Marino", av: "DK" },
  { n: 5, q: "The ceramic coat still beads like day one, 8 months in. Transparent pricing, great communication, real pros.", name: "Lisa T.", sub: "Premier Ceramic · Pasadena", av: "LT" },
];

export const WEATHER_FORECAST = [
  { dow: 'Today', date: 'Mar 12', icon: 'sun', hi: 72, lo: 58, score: 'Perfect', scoreClass: 'ok', precip: 0, wind: 6, humidity: 42 },
  { dow: 'Wed', date: 'Mar 13', icon: 'sun', hi: 74, lo: 60, score: 'Perfect', scoreClass: 'ok', precip: 0, wind: 8, humidity: 38 },
  { dow: 'Thu', date: 'Mar 14', icon: 'cloud-sun', hi: 71, lo: 59, score: 'Great', scoreClass: 'ok', precip: 5, wind: 10, humidity: 50 },
  { dow: 'Fri', date: 'Mar 15', icon: 'cloud', hi: 66, lo: 56, score: 'Good', scoreClass: '', precip: 15, wind: 12, humidity: 62 },
  { dow: 'Sat', date: 'Mar 16', icon: 'rain', hi: 61, lo: 53, score: 'Skip', scoreClass: 'warn', precip: 80, wind: 18, humidity: 88 },
  { dow: 'Sun', date: 'Mar 17', icon: 'rain', hi: 59, lo: 52, score: 'Skip', scoreClass: 'warn', precip: 70, wind: 15, humidity: 82 },
  { dow: 'Mon', date: 'Mar 18', icon: 'cloud-sun', hi: 68, lo: 55, score: 'Great', scoreClass: 'ok', precip: 10, wind: 8, humidity: 55 },
];

export const PORTAL_BOOKINGS = [
  { id: 'B-2048', date: 'Mar 14', day: 14, month: 'Mar', time: '10:00 AM', svc: 'Signature Detail', vehicle: '2021 Honda Civic', status: 'Confirmed', statusClass: 'ok', addr: '412 Los Robles Ave', price: 184 },
  { id: 'B-1994', date: 'Feb 22', day: 22, month: 'Feb', time: '2:00 PM', svc: 'Express Shine', vehicle: '2021 Honda Civic', status: 'Completed', statusClass: 'info', addr: '412 Los Robles Ave', price: 59 },
  { id: 'B-1902', date: 'Jan 30', day: 30, month: 'Jan', time: '11:30 AM', svc: 'Signature Detail', vehicle: '2018 Subaru Outback', status: 'Completed', statusClass: 'info', addr: '412 Los Robles Ave', price: 169 },
];

export const PORTAL_VEHICLES = [
  { id: 'V1', year: 2021, make: 'Honda', model: 'Civic', color: 'Pearl White', plate: '7ABC123', visits: 6, isPrimary: true },
  { id: 'V2', year: 2018, make: 'Subaru', model: 'Outback', color: 'Gray Metallic', plate: '5XYZ987', visits: 3, isPrimary: false },
];

export const ADMIN_BOOKINGS = [
  { id: 'B-2048', customer: 'Sam Rivera', svc: 'Signature Detail', when: 'Today · 10:00a', status: 'Confirmed', statusClass: 'ok', total: 184, tech: 'Jason M.' },
  { id: 'B-2049', customer: 'Alicia Chen', svc: 'Premier Ceramic', when: 'Today · 1:00p', status: 'In progress', statusClass: 'warn', total: 589, tech: 'Jason M.' },
  { id: 'B-2050', customer: 'Marcus Vega', svc: 'Express Shine', when: 'Tomorrow · 8:30a', status: 'Confirmed', statusClass: 'ok', total: 59, tech: 'Wes L.' },
  { id: 'B-2051', customer: 'Priya Rao', svc: 'Signature Detail', when: 'Tomorrow · 11:00a', status: 'Pending', statusClass: 'pending', total: 159, tech: '·' },
  { id: 'B-2052', customer: 'Theo Park', svc: 'Signature + Pet', when: 'Wed · 9:00a', status: 'Confirmed', statusClass: 'ok', total: 194, tech: 'Wes L.' },
];

export const ADMIN_CUSTOMERS = [
  { id: 'C-0104', name: 'Sam Rivera', email: 'sam@example.com', phone: '(626) 555-0112', visits: 4, spent: 712, last: 'Feb 22', tag: 'Regular', tagClass: 'ok' },
  { id: 'C-0088', name: 'Alicia Chen', email: 'alicia@example.com', phone: '(626) 555-0144', visits: 9, spent: 2340, last: 'Today', tag: 'VIP', tagClass: 'red' },
  { id: 'C-0063', name: 'Marcus Vega', email: 'mvega@example.com', phone: '(626) 555-0178', visits: 2, spent: 138, last: 'Jan 18', tag: 'New', tagClass: 'info' },
  { id: 'C-0092', name: 'Priya Rao', email: 'priya.r@example.com', phone: '(626) 555-0199', visits: 6, spent: 1012, last: 'Feb 28', tag: 'Regular', tagClass: 'ok' },
  { id: 'C-0039', name: 'Theo Park', email: 'theo@example.com', phone: '(626) 555-0166', visits: 12, spent: 3180, last: 'Mar 4', tag: 'VIP', tagClass: 'red' },
  { id: 'C-0157', name: 'Harper Lee', email: 'harper@example.com', phone: '(626) 555-0121', visits: 1, spent: 59, last: 'Mar 9', tag: 'New', tagClass: 'info' },
];

export const ADMIN_REVIEWS = [
  { customer: 'Alicia Chen', n: 5, date: 'Mar 10', svc: 'Premier Ceramic', text: 'Absolutely flawless. My Tesla looks better than the day I bought it. The coating prep was obsessive in the best way.', replied: true },
  { customer: 'Theo Park', n: 5, date: 'Mar 7', svc: 'Signature Detail', text: 'Sixth time using them, still impressed. Same attention to detail as visit one.', replied: true },
  { customer: 'Harper Lee', n: 4, date: 'Mar 5', svc: 'Express Shine', text: 'Great wash, wish the tire shine lasted a few more days. Would book again.', replied: false },
  { customer: 'Marcus Vega', n: 5, date: 'Feb 27', svc: 'Signature Detail', text: 'Showed up on time, left the driveway cleaner than they found it. Rare.', replied: true },
];
