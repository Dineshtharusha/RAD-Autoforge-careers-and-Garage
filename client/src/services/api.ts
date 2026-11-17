import axios from 'axios';
import { Service, Workshop, Job } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('autoforge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback initial data for instant preview if backend server is not running
export const mockServices: Service[] = [
  {
    _id: 'srv-1',
    name: 'Oil Change',
    slug: 'oil-change',
    shortDescription: 'High-performance oil changes with premium oils to keep your engine running at its best.',
    fullDescription: 'Comprehensive engine flush and replacement with Motul or Mobil 1 Full Synthetic race-spec lubricants. Includes OEM filter change and 24-point fluid level inspection.',
    category: 'maintenance',
    price: 149,
    durationHours: 1.5,
    iconName: 'Droplet',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    features: ['Full Synthetic OEM spec oil', 'OEM filter replacement', '24-point visual inspection'],
    isPopular: true,
    warrantyMonths: 6,
  },
  {
    _id: 'srv-2',
    name: 'Brake Service',
    slug: 'brake-service',
    shortDescription: 'Complete brake inspections, pad replacements, and rotor services for maximum safety.',
    fullDescription: 'Precision ceramic and metallic brake pad upgrades, rotor runout checks, caliper pin lubrication, and high-temperature brake fluid flush.',
    category: 'repairs',
    price: 289,
    durationHours: 2.5,
    iconName: 'Disc',
    image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80',
    features: ['Brembo & OEM ceramic pads', 'Computerized rotor resurfacing', 'Brake fluid bleed & flush'],
    isPopular: true,
    warrantyMonths: 12,
  },
  {
    _id: 'srv-3',
    name: 'Diagnostics',
    slug: 'diagnostics',
    shortDescription: 'Advanced computer diagnostics to pinpoint issues and optimize performance.',
    fullDescription: 'Proprietary OBD-II protocol scanning, live ECU telemetry reading, sensor waveform analysis, and network communication bus diagnostics.',
    category: 'diagnostics',
    price: 199,
    durationHours: 2,
    iconName: 'Cpu',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    features: ['OEM factory software scanners', 'Live engine sensor waveforms', 'Transmission & ABS diagnosis'],
    isPopular: true,
    warrantyMonths: 12,
  },
  {
    _id: 'srv-4',
    name: 'Detailing',
    slug: 'detailing',
    shortDescription: 'Interior and exterior detailing that restores shine and protects your vehicle.',
    fullDescription: 'Multi-stage paint decontamination, rotary dual-action paint correction, 9H Ceramic coating application, leather conditioning, and steam extraction interior revitalization.',
    category: 'detailing',
    price: 349,
    durationHours: 4,
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    features: ['Multi-stage paint correction', 'Hydrophobic ceramic sealant', 'Deep leather steam therapy'],
    isPopular: false,
    warrantyMonths: 24,
  },
  {
    _id: 'srv-5',
    name: 'Engine Repair',
    slug: 'engine-repair',
    shortDescription: 'Expert diagnostics and repairs for engine performance and reliability.',
    fullDescription: 'Master mechanical service covering timing chain/belt replacements, cylinder head rebuilds, turbocharger/supercharger maintenance, and valvetrain calibration.',
    category: 'repairs',
    price: 650,
    durationHours: 6,
    iconName: 'Settings',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    features: ['Timing system precision alignment', 'Compression & leak-down testing', 'Gasket & seal restorations'],
    isPopular: false,
    warrantyMonths: 24,
  },
  {
    _id: 'srv-6',
    name: 'Tire Services',
    slug: 'tire-services',
    shortDescription: 'Tire rotations, balancing, alignments, and premium tire replacements.',
    fullDescription: 'Hunter Road-Force computerized tire balancing, 3D laser suspension alignment, puncture vulcanization, and fitment of performance Michelin, Pirelli, and Continental tires.',
    category: 'tires',
    price: 120,
    durationHours: 1.5,
    iconName: 'CircleDot',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    features: ['3D digital laser alignment', 'Hunter Road-Force balance', 'TPMS sensor calibration'],
    isPopular: false,
    warrantyMonths: 12,
  },
];

export const mockWorkshops: Workshop[] = [
  {
    _id: 'wks-1',
    name: 'AutoForge Galle Superhub',
    city: 'Galle',
    country: 'Sri Lanka',
    address: '42 Wakwella Road, Galle',
    phone: '+94 91 223 4800',
    email: 'galle@autoforge.com',
    baysCount: 18,
    techniciansCount: 25,
    specialization: 'Luxury & Performance Specialist',
    image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    operatingHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    amenities: ['VIP Lounge', 'Dyno Bay', 'High-Speed EV Chargers', 'Espresso Bar'],
    isActive: true,
  },
  {
    _id: 'wks-2',
    name: 'AutoForge Hikkaduwa Workshop',
    city: 'Hikkaduwa',
    country: 'Sri Lanka',
    address: '128 Galle Road, Hikkaduwa',
    phone: '+94 91 438 9000',
    email: 'hikkaduwa@autoforge.com',
    baysCount: 20,
    techniciansCount: 30,
    specialization: 'German & European Specialist',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    rating: 4.98,
    operatingHours: 'Mon - Sun: 7:30 AM - 9:00 PM',
    amenities: ['Climate Controlled Bays', 'Supercar Cleanroom', 'Coastal Concierge'],
    isActive: true,
  },
  {
    _id: 'wks-3',
    name: 'AutoForge Ambalangoda Workshop',
    city: 'Ambalangoda',
    country: 'Sri Lanka',
    address: '85 Main Street, Ambalangoda',
    phone: '+94 91 225 8100',
    email: 'ambalangoda@autoforge.com',
    baysCount: 16,
    techniciansCount: 20,
    specialization: 'Electric & Hybrid Specialist',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
    rating: 4.92,
    operatingHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    amenities: ['Battery Diagnostic Lab', 'Customer Co-working', 'Rapid Supercharging'],
    isActive: true,
  },
];

export const mockJobs: Job[] = [
  {
    _id: 'job-1',
    title: 'Senior Master Diagnostic Technician',
    department: 'Diagnostics',
    location: 'Galle & Hikkaduwa',
    type: 'Full-time',
    experienceLevel: 'Senior Master',
    salaryRange: '$75,000 - $110,000 / yr',
    description: 'Lead complex diagnostic challenges on BMW M, Porsche, and Mercedes-AMG models using factory diagnostic telemetry systems.',
    responsibilities: [
      'Conduct advanced CAN-bus, FlexRay, and ECU network diagnostics',
      'Mentor junior technicians and ensure quality standards',
      'Document diagnostic flowcharts for master repair guides',
    ],
    requirements: [
      'Minimum 5+ years experience with German or luxury performance marques',
      'ASE Master certification or European brand factory credentials',
      'Proficiency with oscilloscopes and OEM telemetry scanners',
    ],
    benefits: ['Competitive base + quarterly bonuses', 'Continuous factory training', 'Health & tool insurance'],
    isOpen: true,
  },
  {
    _id: 'job-2',
    title: 'High-Performance Engine Specialist',
    department: 'Performance & Tuning',
    location: 'Hikkaduwa',
    type: 'Full-time',
    experienceLevel: 'Specialist',
    salaryRange: '$85,000 - $130,000 / yr',
    description: 'Design and assemble bespoke performance engine builds, twin-turbo conversions, and custom valvetrain setups.',
    responsibilities: [
      'Disassemble, inspect, blueprint, and rebuild internal combustion engines',
      'Calibrate dyno performance and verify air-fuel ratios',
    ],
    requirements: [
      'Demonstrated portfolio of high-horsepower engine rebuilds',
      'Experience with forged internals, bore honing, and head porting',
    ],
    benefits: ['Competitive salary package + relocation allowance', 'Access to cutting-edge dyno lab'],
    isOpen: true,
  },
  {
    _id: 'job-3',
    title: 'EV High-Voltage Battery & Drivetrain Technician',
    department: 'Technician',
    location: 'Ambalangoda & Galle',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '$55,000 - $80,000 / yr',
    description: 'Lead diagnostics, maintenance, and thermal management servicing for electric vehicle battery packs and high-voltage inverters.',
    responsibilities: [
      'Perform high-voltage pack de-energizing and safety isolation',
      'Diagnose module-level battery degradation and cell balancing',
    ],
    requirements: [
      'High Voltage EV Level 2 or Level 3 certified',
      '3+ years automotive electrical troubleshooting experience',
    ],
    benefits: ['Pioneering green-mobility tech career path', 'Annual safety stipend'],
    isOpen: true,
  },
];

export const carrierApi = {
  requestCarrier: (data: any) => api.post('/carriers/request', data),
  getTracking: (idOrCode: string) => api.get(`/carriers/${idOrCode}`),
  getMyRequests: (phone?: string) => api.get(`/carriers/my-requests${phone ? `?phone=${encodeURIComponent(phone)}` : ''}`),
  updateStatus: (id: string, update: any) => api.patch(`/carriers/${id}/status`, update),
};

export const serviceApi = {
  getAll: () => api.get('/services'),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

export const lorryApi = {
  getAll: () => api.get('/carriers/lorries'),
  create: (data: any) => api.post('/carriers/lorries', data),
  update: (id: string, data: any) => api.put(`/carriers/lorries/${id}`, data),
  delete: (id: string) => api.delete(`/carriers/lorries/${id}`),
  getAllRequests: () => api.get('/carriers/all-requests'),
};

export const applicationApi = {
  getAll: (params?: { status?: string; jobId?: string }) =>
    api.get('/applications', { params }),
  submit: (data: any) => api.post('/applications', data),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/applications/${id}/status`, { status, notes }),
};

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  verifySignupOTP: (email: string, otp: string) => api.post('/auth/verify-otp', { email, otp }),
  resendSignupOTP: (email: string) => api.post('/auth/resend-otp', { email }),
  resendVerification: (email: string) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  resetPasswordWithOTP: (email: string, otp: string, newPassword: string) =>
    api.post('/auth/reset-password', { email, otp, newPassword }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/me', data),
};

