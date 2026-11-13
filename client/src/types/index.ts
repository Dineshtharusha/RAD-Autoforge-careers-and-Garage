export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'technician';
  phone?: string;
  avatar?: string;
  token?: string;
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

