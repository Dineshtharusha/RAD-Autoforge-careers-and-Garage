import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '1.1.1.1']);
import { User } from '../models/User';
import { Service } from '../models/Service';
import { Workshop } from '../models/Workshop';
import { Job } from '../models/Job';
import { Booking } from '../models/Booking';
import { Application } from '../models/Application';
import { CarrierLorry } from '../models/CarrierLorry';

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autoforge';
    await mongoose.connect(mongoURI);
    console.log('[AutoForge Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Service.deleteMany({});
    await Workshop.deleteMany({});
    await Job.deleteMany({});
    await Booking.deleteMany({});
    await Application.deleteMany({});
    await CarrierLorry.deleteMany({});

    console.log('[AutoForge Seeder] Cleared previous records.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'AutoForge Executive Admin',
      email: 'admin@autoforge.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+1 (800) 555-0199',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });

    const customerUser = await User.create({
      name: 'Alexander Wright',
      email: 'alexander@autoforge.com',
      password: 'customerpassword123',
      role: 'customer',
      phone: '+1 (800) 555-0144',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    });

    console.log('[AutoForge Seeder] Created Admin and Customer accounts.');

    // 2. Create Services (matching Image 1)
    const services = await Service.insertMany([
      {
        name: 'Oil Change',
        slug: 'oil-change',
        shortDescription: 'High-performance oil changes with premium oils to keep your engine running at its best.',
        fullDescription: 'Comprehensive engine flush and replacement with Motul or Mobil 1 Full Synthetic race-spec lubricants. Includes OEM filter change, 24-point fluid level inspection, and complimentary engine bay dust cleanup.',
        category: 'maintenance',
        price: 149,
        durationHours: 1.5,
        iconName: 'Droplet',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        features: ['Full Synthetic OEM spec oil', 'OEM filter replacement', '24-point visual inspection', 'Fluid top-ups included'],
        isPopular: true,
        warrantyMonths: 6,
      },
      {
        name: 'Brake Service',
        slug: 'brake-service',
        shortDescription: 'Complete brake inspections, pad replacements, and rotor services for maximum safety.',
        fullDescription: 'Precision ceramic and metallic brake pad upgrades, rotor runout checks, caliper pin lubrication, and high-temperature brake fluid flush ensuring confident stopping power under demanding conditions.',
        category: 'repairs',
        price: 289,
        durationHours: 2.5,
        iconName: 'Disc',
        image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80',
        features: ['Brembo & OEM ceramic pads', 'Computerized rotor resurfacing', 'Brake fluid bleed & flush', 'Pedal feel calibration'],
        isPopular: true,
        warrantyMonths: 12,
      },
      {
        name: 'Diagnostics',
        slug: 'diagnostics',
        shortDescription: 'Advanced computer diagnostics to pinpoint issues and optimize performance.',
        fullDescription: 'Proprietary OBD-II protocol scanning, live ECU telemetry reading, sensor waveform analysis, and network communication bus diagnostics by certified diagnostic engineers.',
        category: 'diagnostics',
        price: 199,
        durationHours: 2,
        iconName: 'Cpu',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
        features: ['OEM factory software scanners', 'Live engine sensor waveforms', 'Transmission & ABS diagnosis', 'Detailed PDF health certificate'],
        isPopular: true,
        warrantyMonths: 12,
      },
      {
        name: 'Detailing',
        slug: 'detailing',
        shortDescription: 'Interior and exterior detailing that restores shine and protects your vehicle.',
        fullDescription: 'Multi-stage paint decontamination, rotary dual-action paint correction, 9H Ceramic coating application, leather conditioning, and steam extraction interior revitalization.',
        category: 'detailing',
        price: 349,
        durationHours: 4,
        iconName: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
        features: ['Multi-stage paint correction', 'Hydrophobic ceramic sealant', 'Deep leather steam therapy', 'Ozone air sanitization'],
        isPopular: false,
        warrantyMonths: 24,
      },
      {
        name: 'Engine Repair',
        slug: 'engine-repair',
        shortDescription: 'Expert diagnostics and repairs for engine performance and reliability.',
        fullDescription: 'Master mechanical service covering timing chain/belt replacements, cylinder head rebuilds, turbocharger/supercharger maintenance, cooling system overhauls, and valvetrain calibration.',
        category: 'repairs',
        price: 650,
        durationHours: 6,
        iconName: 'Settings',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
        features: ['Timing system precision alignment', 'Compression & leak-down testing', 'Gasket & seal restorations', 'Dyno performance verification'],
        isPopular: false,
        warrantyMonths: 24,
      },
      {
        name: 'Tire Services',
        slug: 'tire-services',
        shortDescription: 'Tire rotations, balancing, alignments, and premium tire replacements.',
        fullDescription: 'Hunter Road-Force computerized tire balancing, 3D laser suspension alignment, puncture vulcanization, and fitment of performance Michelin, Pirelli, and Continental tires.',
        category: 'tires',
        price: 120,
        durationHours: 1.5,
        iconName: 'CircleDot',
        image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
        features: ['3D digital laser alignment', 'Hunter Road-Force balance', 'TPMS sensor calibration', 'Nitrogen tire inflation'],
        isPopular: false,
        warrantyMonths: 12,
      },
    ]);

    console.log(`[AutoForge Seeder] Seeded ${services.length} services.`);

    // 3. Create Workshops (Galle, Hikkaduwa, Ambalangoda)
    const workshops = await Workshop.insertMany([
      {
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
        amenities: ['VIP Lounge', 'Dyno Bay', 'High-Speed EV Chargers', 'Espresso Bar', 'Viewing Deck'],
        isActive: true,
      },
      {
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
        amenities: ['Climate Controlled Bays', 'Supercar Cleanroom', 'Coastal Concierge', 'Executive Workspace'],
        isActive: true,
      },
      {
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
        amenities: ['Battery Diagnostic Lab', 'Customer Co-working', 'Rapid Charging Superstation'],
        isActive: true,
      },
    ]);

    console.log(`[AutoForge Seeder] Seeded ${workshops.length} workshops.`);

    // 4. Create Jobs (matching Image 4)
    const jobs = await Job.insertMany([
      {
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
        benefits: [
          'Industry-topping base salary + quarterly bonus',
          'Continuous training in Germany & UK facilities',
          'Comprehensive health and tool reimbursement',
        ],
        isOpen: true,
      },
      {
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
          'Fabricate and customize engine components to racing tolerance',
        ],
        requirements: [
          'Demonstrated portfolio of high-horsepower engine rebuilds',
          'Experience with forged internals, bore honing, and head porting',
        ],
        benefits: [
          'Competitive salary package + relocation allowance',
          'Access to cutting-edge CNC and dyno testing labs',
        ],
        isOpen: true,
      },
      {
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
          'Maintain regenerative braking and electric drive units',
        ],
        requirements: [
          'High Voltage EV Level 2 or Level 3 certified',
          '3+ years automotive electrical troubleshooting experience',
        ],
        benefits: [
          'Pioneering green-mobility tech career path',
          'Annual safety and precision gear stipend',
        ],
        isOpen: true,
      },
      {
        title: 'Paint Protection & Ceramic Detailing Artisan',
        department: 'Body & Detailing',
        location: 'Galle',
        type: 'Full-time',
        experienceLevel: 'Mid Level',
        salaryRange: '$40,000 - $65,000 / yr',
        description: 'Provide immaculate multi-stage paint correction, self-healing PPF installation, and multi-year ceramic coating applications.',
        responsibilities: [
          'Multi-stage rotary and DA machine polishing to eliminate orange peel',
          'Precision computer-cut Paint Protection Film (PPF) application',
          'Ultra-clean interior leather restoration and conditioning',
        ],
        requirements: [
          '2+ years in high-end detailing or PPF wrapping studio',
          'Meticulous eye for micro-scratches and swirl marks',
        ],
        benefits: [
          'Work in state-of-the-art dust-free cleanrooms',
          'Commission sharing on exotic and supercar details',
        ],
        isOpen: true,
      },
    ]);

    console.log(`[AutoForge Seeder] Seeded ${jobs.length} career postings.`);

    // 5. Create Sample Bookings
    const booking1 = await Booking.create({
      user: customerUser._id,
      service: services[0]._id, // Oil Change
      workshop: workshops[0]._id, // Galle
      vehicle: {
        make: 'BMW',
        model: 'M3 Competition',
        year: 2023,
        plateNumber: 'WP CAB-4492',
        mileage: 18500,
      },
      appointmentDate: '2026-11-15',
      timeSlot: '10:00 AM',
      status: 'confirmed',
      totalAmount: 149,
      paymentStatus: 'completed',
      notes: 'Customer requested Motul 300V racing grade oil.',
      invoiceNumber: 'AF-INV-2026-8821',
    });

    const booking2 = await Booking.create({
      user: customerUser._id,
      service: services[1]._id, // Brake Service
      workshop: workshops[1]._id, // Hikkaduwa
      vehicle: {
        make: 'Porsche',
        model: '911 GT3',
        year: 2024,
        plateNumber: 'SP CAA-9110',
        mileage: 8200,
      },
      appointmentDate: '2026-11-18',
      timeSlot: '02:00 PM',
      status: 'pending',
      totalAmount: 289,
      paymentStatus: 'completed',
      notes: 'Track day preparation and carbon ceramic brake pad check.',
      invoiceNumber: 'AF-INV-2026-9043',
    });

    console.log('[AutoForge Seeder] Seeded initial sample bookings.');

    // 6. Create Sample Application
    await Application.create({
      job: jobs[0]._id,
      user: customerUser._id,
      fullName: 'Marcus Vance',
      email: 'marcus.vance@techauto.io',
      phone: '+1 555-0182',
      currentRole: 'Lead Diagnostic Tech at Audi Sport',
      yearsOfExperience: 6,
      certifications: 'ASE Master Automobile Technician, Audi Master Guild 2024',
      portfolioOrLinkedIn: 'https://linkedin.com/in/marcus-vance-auto',
      coverLetter: 'Passionate about precision engineering, diagnostic telemetry, and building the future of high-end automotive care with AutoForge.',
      status: 'under_review',
    });

    console.log('[AutoForge Seeder] Seeded sample career application.');

    // 7. Seed Carrier Lorry Fleet
    await CarrierLorry.insertMany([
      {
        truckPlate: 'SP LY-4109',
        truckModel: 'Isuzu Forward F-Series Flatbed Carrier',
        carrierType: 'flatbed',
        assignedHub: 'Galle',
        driverName: 'Chaminda Silva',
        driverPhone: '+94 77 123 4800',
        driverPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        rating: 4.96,
        status: 'available',
        completedRescues: 142,
        maxTowingCapacityKg: 5000,
        equippedFeatures: ['Hydraulic Tilt Bed', 'Heavy Electric Winch', 'Wheel Straps & Chocks'],
      },
      {
        truckPlate: 'SP ND-8201',
        truckModel: 'Mitsubishi Fuso Canter Rapid Tow Recovery',
        carrierType: 'wheel_lift',
        assignedHub: 'Hikkaduwa',
        driverName: 'Dilan Ranasinghe',
        driverPhone: '+94 71 884 9210',
        driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.88,
        status: 'available',
        completedRescues: 86,
        maxTowingCapacityKg: 3500,
        equippedFeatures: ['Under-lift Hydraulic Boom', 'Motorcycle Recovery Cradle', 'Rapid Clearance Hitch'],
      },
      {
        truckPlate: 'SP PJ-9944',
        truckModel: 'Hino 500 Heavy-Duty EV & SUV Carrier',
        carrierType: 'ev_heavy',
        assignedHub: 'Ambalangoda',
        driverName: 'Kasun Gunasekara',
        driverPhone: '+94 76 550 1198',
        driverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        rating: 4.94,
        status: 'available',
        completedRescues: 98,
        maxTowingCapacityKg: 7500,
        equippedFeatures: ['High-Voltage Insulated Bed', 'EV Battery Isolation Kit', 'Heavy Rotator Boom'],
      },
    ]);
    console.log('[AutoForge Seeder] Seeded carrier lorry fleet units.');

    console.log('[AutoForge Seeder] ALL SEED DATA POPULATED SUCCESSFULLY!');

    process.exit(0);
  } catch (error) {
    console.error('[AutoForge Seeder] Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

