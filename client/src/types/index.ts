export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'technician';
  phone?: string;
  avatar?: string;
  token?: string;
  isEmailVerified?: boolean;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: 'maintenance' | 'repairs' | 'diagnostics' | 'detailing' | 'tires';
  price: number;
  durationHours: number;
  iconName: string;
  image: string;
  features: string[];
  isPopular: boolean;
  warrantyMonths: number;
}

export interface Workshop {
  _id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  baysCount: number;
  techniciansCount: number;
  specialization: string;
  image: string;
  rating: number;
  operatingHours: string;
  amenities: string[];
  isActive: boolean;
}

export interface Booking {
  _id: string;
  user: User | string;
  service: Service;
  workshop: Workshop;
  vehicle: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    mileage?: number;
  };
  appointmentDate: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'refunded';
  notes?: string;
  invoiceNumber: string;
  createdAt: string;
}

export interface Job {
  _id: string;
  title: string;
  department: 'Technician' | 'Diagnostics' | 'Performance & Tuning' | 'Body & Detailing' | 'Workshop Management';
  location: string;
  type: 'Full-time' | 'Contract' | 'Apprenticeship';
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Master' | 'Specialist';
  salaryRange: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isOpen: boolean;
}

export interface JobApplication {
  _id: string;
  job: Job | string;
  fullName: string;
  email: string;
  phone: string;
  currentRole: string;
  yearsOfExperience: number;
  certifications: string;
  portfolioOrLinkedIn?: string;
  coverLetter?: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'offered' | 'rejected';
  createdAt: string;
}

export interface AIDiagnosticResult {
  vehicle: string;
  symptomsAnalyzed: string;
  analysis: {
    issueTitle: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    potentialCauses: string[];
    recommendedServices: string[];
    estimatedCostRange: string;
    safetyAdvice: string;
    suggestedAction: string;
  };
  analyzedAt: string;
  poweredBy: string;
}

export interface CarrierDriver {
  id: string;
  name: string;
  phone: string;
  truckPlate: string;
  truckModel: string;
  rating: number;
  avatar: string;
}

export interface CarrierRequest {
  _id: string;
  user?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  destinationWorkshop: {
    workshopId?: string;
    name: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    phone: string;
  };
  carrierType: 'flatbed' | 'wheel_lift' | 'ev_heavy';
  vehicle: {
    make: string;
    model: string;
    year?: number;
    plateNumber: string;
    breakdownReason: string;
    imageUrl?: string;
  };
  driver: CarrierDriver;
  status: 'dispatched' | 'en_route' | 'arrived' | 'towing' | 'completed' | 'cancelled';
  currentLocation: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  estimatedArrivalMinutes: number;
  estimatedCost: number;
  paymentStatus: 'pending' | 'completed' | 'cash_on_delivery';
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarrierLorry {
  _id: string;
  truckPlate: string;
  truckModel: string;
  carrierType: 'flatbed' | 'wheel_lift' | 'ev_heavy';
  assignedHub: 'Galle' | 'Hikkaduwa' | 'Ambalangoda';
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  rating: number;
  status: 'available' | 'on_call' | 'maintenance' | 'offline';
  completedRescues: number;
  maxTowingCapacityKg: number;
  equippedFeatures: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}


