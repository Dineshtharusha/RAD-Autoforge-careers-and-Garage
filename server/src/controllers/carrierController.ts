import { Request, Response } from 'express';
import { CarrierRequest } from '../models/CarrierRequest';
import { Workshop } from '../models/Workshop';

// Garage Hub references in Southern Province
export const WORKSHOP_HUBS = [
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

// Comprehensive Sri Lankan Southern Province & regional town coordinates gazetteer
export const SRI_LANKA_GAZETTEER = [
  { name: 'Baddegama', city: 'Baddegama', lat: 6.1867, lng: 80.1783 },
  { name: 'Karapitiya', city: 'Galle', lat: 6.0645, lng: 80.2294 },
  { name: 'Wakwella', city: 'Galle', lat: 6.0712, lng: 80.2115 },
  { name: 'Galle Fort', city: 'Galle', lat: 6.0270, lng: 80.2170 },
  { name: 'Galle', city: 'Galle', lat: 6.0535, lng: 80.2210 },
  { name: 'Unawatuna', city: 'Galle', lat: 6.0104, lng: 80.2489 },
  { name: 'Koggala', city: 'Galle', lat: 5.9922, lng: 80.3275 },
  { name: 'Ahangama', city: 'Galle', lat: 5.9725, lng: 80.3664 },
  { name: 'Habaraduwa', city: 'Galle', lat: 6.0022, lng: 80.3014 },
  { name: 'Talpe', city: 'Galle', lat: 5.9985, lng: 80.2780 },
  { name: 'Labuduwa', city: 'Galle', lat: 6.0594, lng: 80.2467 },
  { name: 'Hikkaduwa', city: 'Hikkaduwa', lat: 6.1404, lng: 80.1030 },
  { name: 'Dodanduwa', city: 'Hikkaduwa', lat: 6.0967, lng: 80.1386 },
  { name: 'Rathgama', city: 'Hikkaduwa', lat: 6.0792, lng: 80.1614 },
  { name: 'Thiranagama', city: 'Hikkaduwa', lat: 6.1285, lng: 80.1132 },
  { name: 'Meetiyagoda', city: 'Hikkaduwa', lat: 6.1883, lng: 80.1250 },
  { name: 'Telwatta', city: 'Hikkaduwa', lat: 6.1758, lng: 80.0825 },
  { name: 'Kahawa', city: 'Ambalangoda', lat: 6.1950, lng: 80.0710 },
  { name: 'Akurala', city: 'Ambalangoda', lat: 6.2085, lng: 80.0632 },
  { name: 'Ambalangoda', city: 'Ambalangoda', lat: 6.2367, lng: 80.0543 },
  { name: 'Batapola', city: 'Ambalangoda', lat: 6.2415, lng: 80.1167 },
  { name: 'Balapitiya', city: 'Balapitiya', lat: 6.2750, lng: 80.0390 },
  { name: 'Ahungalla', city: 'Balapitiya', lat: 6.3114, lng: 80.0306 },
  { name: 'Kosgoda', city: 'Balapitiya', lat: 6.3425, lng: 80.0242 },
  { name: 'Elpitiya', city: 'Elpitiya', lat: 6.2572, lng: 80.1417 },
  { name: 'Nagoda', city: 'Nagoda', lat: 6.2167, lng: 80.2833 },
  { name: 'Udugama', city: 'Udugama', lat: 6.2167, lng: 80.3333 },
  { name: 'Yakkalamulla', city: 'Yakkalamulla', lat: 6.0833, lng: 80.3667 },
  { name: 'Imaduwa', city: 'Imaduwa', lat: 6.0333, lng: 80.3667 },
  { name: 'Pinnaduwa', city: 'Galle', lat: 6.0683, lng: 80.2642 },
  { name: 'Kurundugahahetekma', city: 'Elpitiya', lat: 6.2917, lng: 80.1167 },
  { name: 'Bentota', city: 'Bentota', lat: 6.4256, lng: 79.9975 },
  { name: 'Aluthgama', city: 'Aluthgama', lat: 6.4333, lng: 80.0000 },
  { name: 'Beruwala', city: 'Beruwala', lat: 6.4789, lng: 79.9828 },
  { name: 'Weligama', city: 'Weligama', lat: 5.9733, lng: 80.4294 },
  { name: 'Mirissa', city: 'Mirissa', lat: 5.9483, lng: 80.4578 },
  { name: 'Matara', city: 'Matara', lat: 5.9496, lng: 80.5469 },
];

// Straight-line Haversine formula
function calculateCrowFliesKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  return R * c;
}

// Accurate real road driving distance (1.28x road winding factor on Sri Lanka roads)
export function calculateRoadDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const crow = calculateCrowFliesKm(lat1, lon1, lat2, lon2);
  if (crow < 1.0) return 1.5;
  return Math.round(crow * 1.28 * 10) / 10;
}

// Find nearest garage and return distance breakdown
export function findNearestGarage(lat: number, lng: number) {
  let nearest = WORKSHOP_HUBS[0];
  let minDistance = calculateRoadDistanceKm(lat, lng, nearest.lat, nearest.lng);

  const allDistances = WORKSHOP_HUBS.map((hub) => {
    const dist = calculateRoadDistanceKm(lat, lng, hub.lat, hub.lng);
    return {
      hub,
      distanceKm: dist,
      etaMins: Math.max(6, Math.round(dist * 2.2)),
    };
  });

  for (let i = 1; i < WORKSHOP_HUBS.length; i++) {
    const hub = WORKSHOP_HUBS[i];
    const dist = calculateRoadDistanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }

  return { nearest, distanceKm: Math.max(1.5, minDistance), allDistances };
}

// Lookup coordinates by town name in address string
function resolveCoordinatesFromText(text: string): { lat: number; lng: number; matchedTown?: string } | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  for (const town of SRI_LANKA_GAZETTEER) {
    if (lower.includes(town.name.toLowerCase())) {
      return { lat: town.lat, lng: town.lng, matchedTown: town.name };
    }
  }
  return null;
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

    let lat = pickupLocation.lat;
    let lng = pickupLocation.lng;

    // Check if customer typed a known location string (e.g. "Baddegama")
    const searchString = `${pickupLocation.address || ''} ${pickupLocation.city || ''}`;
    const textResolved = resolveCoordinatesFromText(searchString);

    if (textResolved && (!lat || lat === 6.0535)) {
      lat = textResolved.lat;
      lng = textResolved.lng;
    } else if (!lat || !lng) {
      lat = 6.0535;
      lng = 80.2210;
    }

    // Detect nearest garage based on actual coordinates
    const { nearest, distanceKm } = findNearestGarage(lat, lng);

    // Look up workshop in DB if exists, else fallback
    const workshopDoc = await Workshop.findOne({ city: new RegExp(nearest.city, 'i') });

    // ETA calculation (~2.2 mins per km, minimum 6 mins)
    const estimatedArrivalMinutes = Math.max(6, Math.round(distanceKm * 2.2));

    // Pricing calculation ($35 base callout + $3.50/km for flatbed)
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
      message: `Carrier dispatched from ${nearest.name}! Driver ${nearest.driver.name} is en route (${distanceKm} km away).`,
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

// @desc    Calculate distance and nearest garage without dispatching (preview endpoint)
// @route   POST /api/carriers/calculate-distance
// @access  Public
export const calculateDistancePreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address, lat, lng } = req.body;

    let targetLat = lat;
    let targetLng = lng;

    if ((!targetLat || !targetLng) && address) {
      const resolved = resolveCoordinatesFromText(address);
      if (resolved) {
        targetLat = resolved.lat;
        targetLng = resolved.lng;
      }
    }

    if (!targetLat || !targetLng) {
      targetLat = 6.0535;
      targetLng = 80.2210;
    }

    const result = findNearestGarage(targetLat, targetLng);

    res.json({
      success: true,
      data: {
        lat: targetLat,
        lng: targetLng,
        nearestHub: result.nearest,
        distanceKm: result.distanceKm,
        estimatedArrivalMinutes: Math.max(6, Math.round(result.distanceKm * 2.2)),
        allHubsComparison: result.allDistances,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
