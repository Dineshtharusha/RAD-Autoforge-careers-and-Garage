import { Request, Response } from 'express';
import { CarrierRequest } from '../models/CarrierRequest';
import { Workshop } from '../models/Workshop';

// Garage Hub references in Southern Province
const WORKSHOP_HUBS = [
  {
    city: 'Galle',
    name: 'AutoForge Galle Superhub',
    address: '42 Wakwella Road, Galle',
    phone: '+94 91 223 4800',
    lat: 6.0535,
    lng: 80.2210,
    driver: {
      id: 'drv-galle-1',
      name: 'Chaminda Silva',
      phone: '+94 77 123 4567',
      truckPlate: 'SP LY-4109',
      truckModel: 'Isuzu Elf Hydraulic Flatbed Transporter',
      rating: 4.96,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    city: 'Hikkaduwa',
    name: 'AutoForge Hikkaduwa Workshop',
    address: '128 Galle Road, Hikkaduwa',
    phone: '+94 91 438 9000',
    lat: 6.1404,
    lng: 80.1030,
    driver: {
      id: 'drv-hikka-1',
      name: 'Sunil Bandara',
      phone: '+94 71 889 2233',
      truckPlate: 'SP LZ-8821',
      truckModel: 'Mitsubishi Fuso Rapid Breakdown Tow',
      rating: 4.98,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    city: 'Ambalangoda',
    name: 'AutoForge Ambalangoda Workshop',
    address: '85 Main Street, Ambalangoda',
    phone: '+94 91 225 8100',
    lat: 6.2367,
    lng: 80.0543,
    driver: {
      id: 'drv-amb-1',
      name: 'Nalin Fernando',
      phone: '+94 76 554 1122',
      truckPlate: 'SP LW-9904',
      truckModel: 'Hino 500 Heavy-Duty Recovery Unit',
      rating: 4.94,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
  },
];

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Find nearest garage
function findNearestGarage(lat: number, lng: number) {
  let nearest = WORKSHOP_HUBS[0];
  let minDistance = calculateDistanceKm(lat, lng, nearest.lat, nearest.lng);

  for (let i = 1; i < WORKSHOP_HUBS.length; i++) {
    const hub = WORKSHOP_HUBS[i];
    const dist = calculateDistanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }

  return { nearest, distanceKm: Math.max(1.2, minDistance) };
}

// @desc    Dispatch / Request a Carrier Truck
// @route   POST /api/carriers/request
// @access  Public (or Authenticated)
export const requestCarrier = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupLocation,
      carrierType = 'flatbed',
      vehicle,
    } = req.body;

    if (!customerName || !customerPhone || !pickupLocation || !vehicle) {
      res.status(400).json({
        success: false,
        message: 'Please provide customer name, phone, pickup location, and vehicle details',
      });
      return;
    }

    const lat = pickupLocation.lat || 6.0535;
    const lng = pickupLocation.lng || 80.2210;

    // Detect nearest garage
    const { nearest, distanceKm } = findNearestGarage(lat, lng);

    // Look up workshop in DB if exists, else fallback
    const workshopDoc = await Workshop.findOne({ city: new RegExp(nearest.city, 'i') });

    // ETA calculation (~2.2 mins per km, minimum 6 mins)
    const estimatedArrivalMinutes = Math.max(6, Math.round(distanceKm * 2.2));

    // Pricing calculation ($30 base callout + $3.50/km)
    const baseFee = carrierType === 'ev_heavy' ? 45 : carrierType === 'flatbed' ? 35 : 25;
    const estimatedCost = Math.round(baseFee + distanceKm * 3.5);

    // Unique tracking code
    const trackingCode = `AF-TOW-${Math.floor(1000 + Math.random() * 9000)}`;

    const carrierRequest = await CarrierRequest.create({
      user: (req as any).user?._id || undefined,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      pickupLocation: {
        address: pickupLocation.address || `${pickupLocation.city || nearest.city}, Southern Province`,
        city: pickupLocation.city || nearest.city,
        lat,
        lng,
      },
      destinationWorkshop: {
        workshopId: workshopDoc?._id,
        name: nearest.name,
        city: nearest.city,
        address: nearest.address,
        lat: nearest.lat,
        lng: nearest.lng,
        phone: nearest.phone,
      },
      carrierType,
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year || new Date().getFullYear(),
        plateNumber: vehicle.plateNumber,
        breakdownReason: vehicle.breakdownReason || 'Breakdown / Mechanical Failure',
        imageUrl: vehicle.imageUrl || '',
      },
      driver: nearest.driver,
      status: 'en_route',
      currentLocation: {
        lat: nearest.lat,
        lng: nearest.lng,
      },
      distanceKm,
      estimatedArrivalMinutes,
      estimatedCost,
      paymentStatus: 'pending',
      trackingCode,
    });

    res.status(201).json({
      success: true,
      message: `Carrier dispatched from ${nearest.name}! Driver ${nearest.driver.name} is en route.`,
      data: carrierRequest,
    });
  } catch (error: any) {
    console.error('[Carrier Controller] Error requesting carrier:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while dispatching carrier truck',
    });
  }
};

// @desc    Get Carrier Request by ID or trackingCode
// @route   GET /api/carriers/:id
// @access  Public
export const getCarrierStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let carrier = null;
    if (id.startsWith('AF-TOW-')) {
      carrier = await CarrierRequest.findOne({ trackingCode: id });
    } else {
      carrier = await CarrierRequest.findById(id);
    }

    if (!carrier) {
      res.status(404).json({
        success: false,
        message: 'Carrier request not found',
      });
      return;
    }

    res.json({
      success: true,
      data: carrier,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching carrier status',
    });
  }
};

// @desc    Get user's carrier requests
// @route   GET /api/carriers/my-requests
// @access  Private / Optional
export const getMyCarrierRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const phone = req.query.phone as string;

    const query: any = {};
    if (userId) {
      query.$or = [{ user: userId }];
      if (phone) query.$or.push({ customerPhone: phone });
    } else if (phone) {
      query.customerPhone = phone;
    } else {
      // Return latest 10 requests
      const all = await CarrierRequest.find().sort({ createdAt: -1 }).limit(10);
      res.json({ success: true, count: all.length, data: all });
      return;
    }

    const requests = await CarrierRequest.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching carrier history',
    });
  }
};

// @desc    Update Carrier Status
// @route   PATCH /api/carriers/:id/status
// @access  Public (for demo) / Admin
export const updateCarrierStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, lat, lng, estimatedArrivalMinutes } = req.body;

    const carrier = await CarrierRequest.findById(id);
    if (!carrier) {
      res.status(404).json({ success: false, message: 'Carrier request not found' });
      return;
    }

    if (status) carrier.status = status;
    if (lat && lng) {
      carrier.currentLocation = { lat, lng };
    }
    if (typeof estimatedArrivalMinutes === 'number') {
      carrier.estimatedArrivalMinutes = estimatedArrivalMinutes;
    }

    await carrier.save();

    res.json({
      success: true,
      message: `Carrier status updated to ${carrier.status}`,
      data: carrier,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating status',
    });
  }
};
