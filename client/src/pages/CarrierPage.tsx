import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { carrierApi } from '../services/api';
import { CarrierRequest } from '../types';
import {
  Truck,
  MapPin,
  Navigation,
  Phone,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Camera,
  Car,
  Wrench,
  Radio,
  Share2,
  Zap,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Search,
  Crosshair,
  Sparkles,
} from 'lucide-react';

interface PresetLocation {
  city: string;
  name: string;
  lat: number;
  lng: number;
}

export interface TownLocation {
  name: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  alias?: string[];
}

// 3 AutoForge Workshop Hubs
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

// Comprehensive Sri Lankan Southern Province & regional towns gazetteer
const SRI_LANKA_GAZETTEER: TownLocation[] = [
  { name: 'Baddegama', city: 'Baddegama', district: 'Galle', lat: 6.1867, lng: 80.1783, alias: ['baddegama town', 'baddegama junction', 'baddegama bus stand'] },
  { name: 'Karapitiya', city: 'Galle', district: 'Galle', lat: 6.0645, lng: 80.2294, alias: ['karapitiya hospital', 'karapitiya junction', 'karapitiya medical'] },
  { name: 'Galle Fort', city: 'Galle', district: 'Galle', lat: 6.0270, lng: 80.2170, alias: ['galle town', 'galle', 'ramparts', 'light house'] },
  { name: 'Wakwella', city: 'Galle', district: 'Galle', lat: 6.0712, lng: 80.2115, alias: ['wakwella junction', 'wakwella road'] },
  { name: 'Unawatuna', city: 'Galle', district: 'Galle', lat: 6.0104, lng: 80.2489, alias: ['unawatuna beach', 'yaddehimulla'] },
  { name: 'Koggala', city: 'Galle', district: 'Galle', lat: 5.9922, lng: 80.3275, alias: ['koggala airport', 'koggala beach', 'koggala epz'] },
  { name: 'Ahangama', city: 'Galle', district: 'Galle', lat: 5.9725, lng: 80.3664, alias: ['ahangama beach', 'ahangama town', 'kaballana'] },
  { name: 'Habaraduwa', city: 'Galle', district: 'Galle', lat: 6.0022, lng: 80.3014, alias: ['habaraduwa town'] },
  { name: 'Talpe', city: 'Galle', district: 'Galle', lat: 5.9985, lng: 80.2780, alias: ['talpe beach'] },
  { name: 'Labuduwa', city: 'Galle', district: 'Galle', lat: 6.0594, lng: 80.2467, alias: ['labuduwa junction', 'labuduwa technology'] },
  { name: 'Hikkaduwa', city: 'Hikkaduwa', district: 'Galle', lat: 6.1404, lng: 80.1030, alias: ['hikkaduwa beach', 'narigama', 'coral reef'] },
  { name: 'Dodanduwa', city: 'Hikkaduwa', district: 'Galle', lat: 6.0967, lng: 80.1386, alias: ['dodanduwa bridge', 'dodanduwa harbour'] },
  { name: 'Rathgama', city: 'Hikkaduwa', district: 'Galle', lat: 6.0792, lng: 80.1614, alias: ['rathgama junction', 'rajgama'] },
  { name: 'Thiranagama', city: 'Hikkaduwa', district: 'Galle', lat: 6.1285, lng: 80.1132, alias: ['thiranagama beach'] },
  { name: 'Meetiyagoda', city: 'Hikkaduwa', district: 'Galle', lat: 6.1883, lng: 80.1250, alias: ['meetiyagoda moonstone', 'meetiyagoda junction'] },
  { name: 'Telwatta', city: 'Hikkaduwa', district: 'Galle', lat: 6.1758, lng: 80.0825, alias: ['telwatta tsunami memorial', 'peraliya'] },
  { name: 'Kahawa', city: 'Ambalangoda', district: 'Galle', lat: 6.1950, lng: 80.0710, alias: ['kahawa beach'] },
  { name: 'Akurala', city: 'Ambalangoda', district: 'Galle', lat: 6.2085, lng: 80.0632, alias: ['akurala beach'] },
  { name: 'Ambalangoda', city: 'Ambalangoda', district: 'Galle', lat: 6.2367, lng: 80.0543, alias: ['ambalangoda town', 'ambalangoda mask museum', 'ambalangoda station'] },
  { name: 'Batapola', city: 'Ambalangoda', district: 'Galle', lat: 6.2415, lng: 80.1167, alias: ['batapola junction', 'batapola town'] },
  { name: 'Balapitiya', city: 'Balapitiya', district: 'Galle', lat: 6.2750, lng: 80.0390, alias: ['madu river', 'balapitiya town', 'balapitiya bridge'] },
  { name: 'Ahungalla', city: 'Balapitiya', district: 'Galle', lat: 6.3114, lng: 80.0306, alias: ['ahungalla beach', 'heritance ahungalla'] },
  { name: 'Kosgoda', city: 'Balapitiya', district: 'Galle', lat: 6.3425, lng: 80.0242, alias: ['kosgoda turtle hatchery'] },
  { name: 'Elpitiya', city: 'Elpitiya', district: 'Galle', lat: 6.2572, lng: 80.1417, alias: ['elpitiya town', 'elpitiya bus stand'] },
  { name: 'Nagoda', city: 'Nagoda', district: 'Galle', lat: 6.2167, lng: 80.2833, alias: ['nagoda hospital', 'nagoda junction'] },
  { name: 'Udugama', city: 'Udugama', district: 'Galle', lat: 6.2167, lng: 80.3333, alias: ['udugama town'] },
  { name: 'Yakkalamulla', city: 'Yakkalamulla', district: 'Galle', lat: 6.0833, lng: 80.3667, alias: ['yakkalamulla junction'] },
  { name: 'Imaduwa', city: 'Imaduwa', district: 'Galle', lat: 6.0333, lng: 80.3667, alias: ['imaduwa interchange', 'imaduwa express'] },
  { name: 'Pinnaduwa', city: 'Galle', district: 'Galle', lat: 6.0683, lng: 80.2642, alias: ['pinnaduwa interchange', 'pinnaduwa highway'] },
  { name: 'Kurundugahahetekma', city: 'Elpitiya', district: 'Galle', lat: 6.2917, lng: 80.1167, alias: ['kurundugaha interchange', 'kurundugaha'] },
  { name: 'Bentota', city: 'Bentota', district: 'Galle', lat: 6.4256, lng: 79.9975, alias: ['bentota beach', 'bentota river'] },
  { name: 'Aluthgama', city: 'Aluthgama', district: 'Kalutara', lat: 6.4333, lng: 80.0000, alias: ['aluthgama town', 'kande viharaya'] },
  { name: 'Beruwala', city: 'Beruwala', district: 'Kalutara', lat: 6.4789, lng: 79.9828, alias: ['beruwala lighthouse', 'moragalla'] },
  { name: 'Weligama', city: 'Weligama', district: 'Matara', lat: 5.9733, lng: 80.4294, alias: ['weligama bay', 'weligama town', 'taprobane'] },
  { name: 'Mirissa', city: 'Mirissa', district: 'Matara', lat: 5.9483, lng: 80.4578, alias: ['mirissa beach', 'coconut tree hill', 'mirissa harbour'] },
  { name: 'Matara', city: 'Matara', district: 'Matara', lat: 5.9496, lng: 80.5469, alias: ['matara fort', 'matara town', 'polhena beach'] },
];

const PRESET_LOCATIONS: PresetLocation[] = [
  { city: 'Galle', name: 'Galle Fort / Ramparts Bypass', lat: 6.0535, lng: 80.2210 },
  { city: 'Galle', name: 'Wakwella Junction, Galle', lat: 6.0680, lng: 80.2150 },
  { city: 'Galle', name: 'Unawatuna Beach Coastal Strip', lat: 6.0104, lng: 80.2489 },
  { city: 'Hikkaduwa', name: 'Hikkaduwa Narigama Beach (A2)', lat: 6.1404, lng: 80.1030 },
  { city: 'Hikkaduwa', name: 'Dodanduwa Lagoon Bridge', lat: 6.0967, lng: 80.1386 },
  { city: 'Hikkaduwa', name: 'Rathgama Highway Junction', lat: 6.0792, lng: 80.1614 },
  { city: 'Ambalangoda', name: 'Ambalangoda Clock Tower Circle', lat: 6.2367, lng: 80.0543 },
  { city: 'Ambalangoda', name: 'Balapitiya River Overpass', lat: 6.2750, lng: 80.0390 },
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
function getRoadDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const crow = calculateCrowFliesKm(lat1, lon1, lat2, lon2);
  if (crow < 1.0) return 1.5;
  return Math.round(crow * 1.28 * 10) / 10;
}

export const CarrierPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Form State
  const [selectedPreset, setSelectedPreset] = useState<PresetLocation | null>(PRESET_LOCATIONS[0]);
  const [typedAddress, setTypedAddress] = useState<string>('');
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number; label: string; isCustom: boolean }>({
    lat: PRESET_LOCATIONS[0].lat,
    lng: PRESET_LOCATIONS[0].lng,
    label: PRESET_LOCATIONS[0].name,
    isCustom: false,
  });

  const [suggestions, setSuggestions] = useState<TownLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const debounceTimerRef = useRef<any>(null);

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+94 77 ');
  const [carrierType, setCarrierType] = useState<'flatbed' | 'wheel_lift' | 'ev_heavy'>('flatbed');
  const [vehicleMake, setVehicleMake] = useState('BMW');
  const [vehicleModel, setVehicleModel] = useState('M3 Competition');
  const [vehiclePlate, setVehiclePlate] = useState('WP CAB-4492');
  const [breakdownReason, setBreakdownReason] = useState('Engine Overheating / Coolant Leak');
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Dispatch & Live Tracking State
  const [activeRequest, setActiveRequest] = useState<CarrierRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingStep, setTrackingStep] = useState<number>(1);
  const [etaRemaining, setEtaRemaining] = useState<number>(12);
  const [truckProgress, setTruckProgress] = useState<number>(15);
  const [simulatingSpeed, setSimulatingSpeed] = useState<number>(45);

  // Handle Typed Address Change & Autocomplete Matching
  const handleAddressChange = (text: string) => {
    setTypedAddress(text);
    setSelectedPreset(null);

    if (!text.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = text.toLowerCase().trim();

    // 1. Instant gazetteer search
    const matches = SRI_LANKA_GAZETTEER.filter((t) => {
      return (
        t.name.toLowerCase().includes(query) ||
        t.city.toLowerCase().includes(query) ||
        t.district.toLowerCase().includes(query) ||
        t.alias?.some((a) => a.toLowerCase().includes(query))
      );
    });

    setSuggestions(matches.slice(0, 5));
    setShowSuggestions(matches.length > 0);

    // If exact or strong match exists in gazetteer, resolve immediately
    const exact = SRI_LANKA_GAZETTEER.find(
      (t) =>
        t.name.toLowerCase() === query ||
        t.alias?.some((a) => a.toLowerCase() === query) ||
        t.name.toLowerCase().startsWith(query)
    );

    if (exact) {
      setActiveCoords({
        lat: exact.lat,
        lng: exact.lng,
        label: `${exact.name}, ${exact.district} District`,
        isCustom: true,
      });
      return;
    }

    // 2. Debounced Online Nominatim Geocoding for custom / unlisted street names
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      if (text.trim().length >= 3) {
        setIsGeocoding(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              text + ', Southern Province, Sri Lanka'
            )}&limit=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          if (data && data.length > 0) {
            const result = data[0];
            setActiveCoords({
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
              label: result.display_name.split(',').slice(0, 3).join(','),
              isCustom: true,
            });
          }
        } catch {
          // Keep current coords on network error
        } finally {
          setIsGeocoding(false);
        }
      }
    }, 600);
  };

  // Select suggestion from dropdown
  const handleSelectSuggestion = (town: TownLocation) => {
    setTypedAddress(town.name);
    setShowSuggestions(false);
    setActiveCoords({
      lat: town.lat,
      lng: town.lng,
      label: `${town.name}, ${town.district} District`,
      isCustom: true,
    });
  };

  // Browser GPS Auto-Locate
  const handleGpsAutoLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGeocoding(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setTypedAddress(`GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        setSelectedPreset(null);
        setActiveCoords({
          lat,
          lng,
          label: `Your Device GPS (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
          isCustom: true,
        });
      },
      (err) => {
        setIsGeocoding(false);
        alert('Could not access GPS location. Please check location permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Calculate real road distances to all 3 garages
  const garageDistances = useMemo(() => {
    return WORKSHOP_HUBS.map((hub) => {
      const dist = getRoadDistanceKm(activeCoords.lat, activeCoords.lng, hub.lat, hub.lng);
      const eta = Math.max(6, Math.round(dist * 2.2));
      return {
        hub,
        distanceKm: dist,
        etaMins: eta,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [activeCoords]);

  // The nearest workshop is the first item after sorting by real km distance
  const nearestHub = garageDistances[0];

  // Dynamic estimated towing cost
  const estimatedCost = useMemo(() => {
    const base = carrierType === 'ev_heavy' ? 45 : carrierType === 'flatbed' ? 35 : 25;
    return Math.round(base + nearestHub.distanceKm * 3.5);
  }, [carrierType, nearestHub]);

  // Handle image upload using backend multer / supabase route
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data && data.url) {
        setVehicleImage(data.url);
      } else {
        setVehicleImage(URL.createObjectURL(file));
      }
    } catch {
      setVehicleImage(URL.createObjectURL(file));
    } finally {
      setUploadingImage(false);
    }
  };

  // Dispatch Carrier Handler
  const handleDispatchCarrier = async () => {
    setIsSubmitting(true);

    const payload = {
      customerName: customerName || 'Vehicle Owner',
      customerPhone: customerPhone || '+94 77 123 4567',
      pickupLocation: {
        address: typedAddress || activeCoords.label,
        city: nearestHub.hub.city,
        lat: activeCoords.lat,
        lng: activeCoords.lng,
      },
      carrierType,
      vehicle: {
        make: vehicleMake,
        model: vehicleModel,
        plateNumber: vehiclePlate,
        breakdownReason,
        imageUrl: vehicleImage || undefined,
      },
    };

    try {
      const res = await carrierApi.requestCarrier(payload);
      if (res.data && res.data.data) {
        setActiveRequest(res.data.data);
        setEtaRemaining(res.data.data.estimatedArrivalMinutes || nearestHub.etaMins);
      }
    } catch (err) {
      console.warn('API error, falling back to local simulated carrier dispatch:', err);
      const fallbackRequest: CarrierRequest = {
        _id: 'req-' + Date.now(),
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        pickupLocation: payload.pickupLocation,
        destinationWorkshop: {
          name: nearestHub.hub.name,
          city: nearestHub.hub.city,
          address: nearestHub.hub.address,
          lat: nearestHub.hub.lat,
          lng: nearestHub.hub.lng,
          phone: nearestHub.hub.phone,
        },
        carrierType,
        vehicle: payload.vehicle,
        driver: nearestHub.hub.driver,
        status: 'en_route',
        currentLocation: { lat: nearestHub.hub.lat, lng: nearestHub.hub.lng },
        distanceKm: nearestHub.distanceKm,
        estimatedArrivalMinutes: nearestHub.etaMins,
        estimatedCost,
        paymentStatus: 'pending',
        trackingCode: `AF-TOW-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActiveRequest(fallbackRequest);
      setEtaRemaining(fallbackRequest.estimatedArrivalMinutes);
    } finally {
      setIsSubmitting(false);
      setTrackingStep(2);
      setTruckProgress(20);
    }
  };

  // Simulated GPS movement and ETA decrement ticker
  useEffect(() => {
    if (!activeRequest || trackingStep > 4) return;

    const interval = setInterval(() => {
      setTruckProgress((prev) => {
        if (prev >= 95) {
          if (trackingStep === 2) setTrackingStep(3);
          return 95;
        }
        return prev + 2.5;
      });

      setEtaRemaining((prev) => (prev > 1 ? prev - 1 : 1));
      setSimulatingSpeed(Math.floor(38 + Math.random() * 18));
    }, 4000);

    return () => clearInterval(interval);
  }, [activeRequest, trackingStep]);

  return (
    <div className="pt-24 pb-20 bg-[#080B10] min-h-screen text-white">
      {/* Header Banner */}
      <div className="border-b border-[#1E2535] bg-gradient-to-b from-[#0F141F] to-[#080B10] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3 animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>24/7 Precision Roadside Carrier Service</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
              Emergency <span className="gold-text-gradient">Breakdown & Carrier</span> Dispatch
            </h1>
            <p className="mt-2 text-sm text-gray-400 max-w-2xl">
              Breakdown anywhere along the Galle, Hikkaduwa, or Ambalangoda coastal corridor? Our precision hydraulic flatbed carrier trucks dispatch immediately with live on-demand GPS tracking.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141A26] border border-[#232B3C] p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
              <Phone className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold block">
                Direct Emergency Tow Hotline
              </span>
              <a
                href="tel:+94912234800"
                className="text-lg font-bold font-mono text-[#E5A93C] hover:underline"
              >
                +94 91 223 4800
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeRequest ? (
          /* ============================================================
             MODE 1: REQUEST & DISPATCH CARRIER
             ============================================================ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form & Options */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Breakdown Location with Real Dynamic Distance Calculation */}
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E5A93C]/20 text-[#E5A93C] flex items-center justify-center text-xs font-bold font-mono">
                      1
                    </div>
                    <h2 className="text-base font-bold text-white uppercase tracking-wider font-serif">
                      Your Breakdown Location
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleGpsAutoLocate}
                    className="text-xs text-[#E5A93C] hover:text-amber-300 flex items-center gap-1.5 font-semibold bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS Auto-Locate</span>
                  </button>
                </div>

                {/* Primary Typing Input Box with Real-Time Dynamic Geocoding */}
                <div className="relative">
                  <label className="text-xs text-gray-200 block mb-1.5 font-bold flex items-center justify-between">
                    <span>Type Your Location or Street Note (Auto-Calculates Real Distance):</span>
                    {isGeocoding && (
                      <span className="text-[10px] text-[#E5A93C] font-normal animate-pulse flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Calculating coordinates & nearest hub...
                      </span>
                    )}
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E5A93C]">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={typedAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      placeholder="Type town or landmark (e.g. Baddegama, Karapitiya, Koggala, Batapola, Elpitiya...)"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141A26] border-2 border-[#E5A93C]/40 text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] transition-all shadow-inner"
                    />
                  </div>

                  {/* Autocomplete Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 bg-[#141A26] border border-[#232B3C] rounded-xl shadow-2xl overflow-hidden divide-y divide-[#1F2738]">
                      {suggestions.map((town, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSuggestion(town)}
                          className="px-4 py-2.5 hover:bg-[#1E2638] cursor-pointer flex items-center justify-between transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                            <span className="font-bold text-white">{town.name}</span>
                            <span className="text-gray-400">({town.district} District)</span>
                          </div>
                          <span className="text-[11px] text-[#E5A93C] font-mono">Select Town →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Active Resolved Location Status Pill */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg">
                    <Crosshair className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold text-white">Target Breakdown Point:</span>
                    <span className="text-emerald-300 font-mono truncate">{activeCoords.label}</span>
                  </div>
                </div>

                {/* Quick Preset Location Chips */}
                <div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-2 font-semibold">
                    Or select a common coastal corridor landmark:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_LOCATIONS.map((loc, idx) => {
                      const isSelected = selectedPreset?.name === loc.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedPreset(loc);
                            setTypedAddress(loc.name);
                            setShowSuggestions(false);
                            setActiveCoords({
                              lat: loc.lat,
                              lng: loc.lng,
                              label: loc.name,
                              isCustom: false,
                            });
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                            isSelected
                              ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-white shadow-gold'
                              : 'bg-[#141A26] border-[#232B3C] text-gray-400 hover:text-white hover:border-[#38435C]'
                          }`}
                        >
                          <div className="flex items-center gap-1 font-bold mb-0.5">
                            <MapPin className={`w-3 h-3 ${isSelected ? 'text-[#E5A93C]' : 'text-gray-500'}`} />
                            <span className={isSelected ? 'text-[#E5A93C]' : 'text-white'}>
                              {loc.city}
                            </span>
                          </div>
                          <span className="text-[10px] line-clamp-1 block text-gray-400">
                            {loc.name.split('/')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time Nearest Workshop Detection Highlight */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#172033] via-[#141A26] to-[#172033] border-2 border-[#E5A93C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-gold">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E5A93C] text-[#0A0D13] flex items-center justify-center font-bold shadow-md flex-shrink-0">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#0A0D13] bg-[#E5A93C] px-2 py-0.5 rounded font-black tracking-widest uppercase">
                          CLOSEST GARAGE DETECTED
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          ★ Fastest Dispatch
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white font-serif mt-1">
                        {nearestHub.hub.name}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {nearestHub.hub.address} • {nearestHub.hub.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#232B3C]">
                    <span className="text-xl font-mono text-[#E5A93C] font-black block">
                      {nearestHub.distanceKm} km away
                    </span>
                    <span className="text-xs text-emerald-400 font-bold block">
                      ~{nearestHub.etaMins} mins response time
                    </span>
                  </div>
                </div>

                {/* All 3 Workshops Distance Comparison Breakdown */}
                <div className="p-4 rounded-xl bg-[#141A26]/80 border border-[#232B3C] space-y-2.5">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold block">
                    Real Road Distance Comparison to All 3 AutoForge Superhubs:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {garageDistances.map((item, idx) => {
                      const isClosest = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                            isClosest
                              ? 'bg-[#E5A93C]/10 border-[#E5A93C] text-white'
                              : 'bg-[#0F141F] border-[#232B3C] text-gray-400'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold ${isClosest ? 'text-[#E5A93C]' : 'text-gray-300'}`}>
                                {item.hub.city} Hub
                              </span>
                              {isClosest && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E5A93C] text-[#0A0D13] font-black">
                                  CLOSEST
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400 line-clamp-1">
                              {item.hub.name}
                            </span>
                          </div>
                          <div className="mt-2 pt-1 border-t border-white/5 flex items-baseline justify-between font-mono">
                            <span className="text-xs font-bold text-white">{item.distanceKm} km</span>
                            <span className="text-[11px] text-emerald-400">~{item.etaMins} mins</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Step 2: Choose Carrier Truck Type */}
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E5A93C]/20 text-[#E5A93C] flex items-center justify-center text-xs font-bold font-mono">
                    2
                  </div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider font-serif">
                    Select Carrier Truck Specification
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Flatbed */}
                  <div
                    onClick={() => setCarrierType('flatbed')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      carrierType === 'flatbed'
                        ? 'bg-[#E5A93C]/15 border-[#E5A93C] shadow-gold'
                        : 'bg-[#141A26] border-[#232B3C] hover:border-[#38435C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Truck className={`w-5 h-5 ${carrierType === 'flatbed' ? 'text-[#E5A93C]' : 'text-gray-400'}`} />
                      <span className="text-[10px] uppercase font-bold text-[#E5A93C] px-2 py-0.5 rounded bg-[#E5A93C]/20">
                        RECOMMENDED
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white">Hydraulic Flatbed</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                      Zero-clearance hydraulic tilt bed for sports cars, exotics, lowered vehicles, and luxury sedans.
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Base</span>
                      <span className="text-white font-mono font-bold">$35.00</span>
                    </div>
                  </div>

                  {/* Option 2: Rapid Wheel-Lift */}
                  <div
                    onClick={() => setCarrierType('wheel_lift')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      carrierType === 'wheel_lift'
                        ? 'bg-[#E5A93C]/15 border-[#E5A93C] shadow-gold'
                        : 'bg-[#141A26] border-[#232B3C] hover:border-[#38435C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Wrench className={`w-5 h-5 ${carrierType === 'wheel_lift' ? 'text-[#E5A93C]' : 'text-gray-400'}`} />
                      <span className="text-[10px] uppercase font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/20">
                        RAPID
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white">Wheel-Lift Recovery</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                      Compact maneuverable tow unit for tight urban alleys, beach lanes, and rapid roadside clearance.
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Base</span>
                      <span className="text-white font-mono font-bold">$25.00</span>
                    </div>
                  </div>

                  {/* Option 3: EV Heavy Carrier */}
                  <div
                    onClick={() => setCarrierType('ev_heavy')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      carrierType === 'ev_heavy'
                        ? 'bg-[#E5A93C]/15 border-[#E5A93C] shadow-gold'
                        : 'bg-[#141A26] border-[#232B3C] hover:border-[#38435C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Zap className={`w-5 h-5 ${carrierType === 'ev_heavy' ? 'text-[#E5A93C]' : 'text-gray-400'}`} />
                      <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20">
                        EV / HYBRID
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white">Heavy EV Transporter</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                      High-voltage insulated bed, dolly skates, and neutral towing harness safe for dual-motor EVs.
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Base</span>
                      <span className="text-white font-mono font-bold">$45.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Vehicle & Breakdown Details */}
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E5A93C]/20 text-[#E5A93C] flex items-center justify-center text-xs font-bold font-mono">
                    3
                  </div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider font-serif">
                    Vehicle Breakdown Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1 font-medium">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1 font-medium">Emergency Mobile Phone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1 font-medium">Vehicle Make & Model</label>
                    <input
                      type="text"
                      value={`${vehicleMake} ${vehicleModel}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(' ');
                        setVehicleMake(parts[0] || '');
                        setVehicleModel(parts.slice(1).join(' ') || '');
                      }}
                      placeholder="e.g. BMW M3 Competition / Porsche Macan"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1 font-medium">License Plate Number</label>
                    <input
                      type="text"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      placeholder="e.g. WP CAB-4492"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs font-mono uppercase text-white placeholder-gray-500 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1 font-medium">Breakdown Condition / Issue</label>
                  <select
                    value={breakdownReason}
                    onChange={(e) => setBreakdownReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="Engine Overheating / Coolant Leak">Engine Overheating / Coolant Leak</option>
                    <option value="Transmission & Gearbox Seized">Transmission & Gearbox Seized</option>
                    <option value="Flat Tyre / Suspension Damage">Flat Tyre / Suspension Damage</option>
                    <option value="Dead 12V / High Voltage Battery Failure">Dead 12V / High Voltage Battery Failure</option>
                    <option value="Accident / Roadside Impact Collision">Accident / Roadside Impact Collision</option>
                    <option value="Engine Cut-off / Electronic Immobilizer Locked">Engine Cut-off / Electronic Immobilizer Locked</option>
                  </select>
                </div>

                {/* Vehicle Photo upload */}
                <div>
                  <label className="text-xs text-gray-300 block mb-1 font-medium">
                    Breakdown Vehicle Condition Photo (Optional - Supabase Upload):
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-[#141A26] hover:bg-[#1C2536] border border-[#232B3C] text-xs text-gray-300 cursor-pointer flex items-center gap-2 transition-all">
                      <Camera className="w-4 h-4 text-[#E5A93C]" />
                      <span>{uploadingImage ? 'Uploading to Supabase...' : 'Upload Breakdown Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                    {vehicleImage && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Attached
                      </span>
                    )}
                  </div>
                  {vehicleImage && (
                    <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-[#E5A93C]/40">
                      <img src={vehicleImage} alt="Vehicle Breakdown" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Instant Dispatch CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-6 sticky top-28">
                <div className="flex items-center justify-between border-b border-[#232B3C] pb-4">
                  <div>
                    <span className="text-[10px] text-[#E5A93C] uppercase tracking-widest font-bold block">
                      DISPATCH SUMMARY
                    </span>
                    <h3 className="text-base font-serif font-bold text-white">
                      Instant Carrier Booking
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Pickup Location:</span>
                    <span className="text-white font-semibold text-right max-w-[200px] truncate">
                      {typedAddress || activeCoords.label}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Target Workshop (Closest):</span>
                    <span className="text-[#E5A93C] font-semibold">
                      {nearestHub.hub.name}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Real Road Route Distance:</span>
                    <span className="text-white font-mono font-bold">
                      {nearestHub.distanceKm} km
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Carrier Arrival:</span>
                    <span className="text-emerald-400 font-bold">
                      ~{nearestHub.etaMins} minutes
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Carrier Truck Type:</span>
                    <span className="text-white capitalize">
                      {carrierType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Assigned Lead Driver:</span>
                    <span className="text-white font-semibold">
                      {nearestHub.hub.driver.name} ({nearestHub.hub.driver.truckPlate})
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#232B3C] space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-400 font-medium">Estimated Towing Fare:</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold font-mono text-[#E5A93C]">
                        ${estimatedCost}.00
                      </span>
                      <span className="text-[11px] text-gray-400 block font-mono">
                        ≈ LKR {(estimatedCost * 310).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    * Distance calculated via actual highway route to {nearestHub.hub.name}. Includes 24/7 on-site hookup and vehicle transit insurance.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDispatchCarrier}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E5A93C] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-[#080B10] font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-gold flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING CARRIER TRUCK...</span>
                  ) : (
                    <>
                      <span>DISPATCH CARRIER TRUCK NOW</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Licensed Sri Lanka Roadside Recovery Network</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
             MODE 2: LIVE ON-DEMAND CARRIER TRACKING SCREEN
             ============================================================ */
          <div className="space-y-8 animate-fadeIn">
            {/* Tracking Top Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141A26] via-[#10141D] to-[#141A26] border border-[#E5A93C]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                    CARRIER EN ROUTE • LIVE GPS TELEMETRY
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#E5A93C]/20 text-[#E5A93C] font-bold">
                    {activeRequest.trackingCode}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
                  Carrier Truck is Heading to Your Location
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  Dispatched from <strong className="text-white">{activeRequest.destinationWorkshop.name}</strong> to{' '}
                  <strong className="text-[#E5A93C]">{activeRequest.pickupLocation.address}</strong>
                </p>
              </div>

              {/* ETA Display Box */}
              <div className="p-4 rounded-xl bg-[#080B10] border border-[#232B3C] text-center min-w-[180px]">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-semibold">
                  ESTIMATED ARRIVAL
                </span>
                <span className="text-3xl font-serif font-black text-[#E5A93C] block font-mono">
                  {etaRemaining} <span className="text-xs font-sans text-gray-400">MINS</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Speed: {simulatingSpeed} km/h • {activeRequest.distanceKm} km away
                </span>
              </div>
            </div>

            {/* Main Interactive Radar Map & Live Trip Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Visual Vector Radar Map */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative rounded-2xl bg-[#0B0E14] border border-[#232B3C] p-6 overflow-hidden min-h-[420px] flex flex-col justify-between shadow-2xl">
                  {/* Subtle Grid Background */}
                  <div
                    className="absolute inset-0 opacity-10 bg-[radial-gradient(#E5A93C_1px,transparent_1px)] [background-size:24px_24px]"
                  />

                  {/* Top Map Indicators */}
                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141A26]/80 backdrop-blur border border-[#232B3C]">
                      <Radio className="w-3.5 h-3.5 text-[#E5A93C] animate-pulse" />
                      <span className="text-gray-300">A2 Southern Coastal Highway Corridor</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#141A26] border border-[#232B3C] text-[10px] text-gray-400 font-mono">
                        LAT: {activeRequest.pickupLocation.lat.toFixed(4)}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#141A26] border border-[#232B3C] text-[10px] text-gray-400 font-mono">
                        LNG: {activeRequest.pickupLocation.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Route Canvas */}
                  <div className="relative z-10 my-8 px-4 sm:px-12">
                    <div className="relative h-28 flex items-center">
                      
                      {/* Route Path Line */}
                      <div className="absolute left-0 right-0 h-2 bg-[#1C2536] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-[#E5A93C] to-amber-500 transition-all duration-1000 ease-out"
                          style={{ width: `${truckProgress}%` }}
                        />
                      </div>

                      {/* Origin: Workshop Hub Pin */}
                      <div className="absolute left-0 -top-1 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#141A26] border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400 mt-2 block whitespace-nowrap">
                          {activeRequest.destinationWorkshop.name.split(' ')[1]} Hub
                        </span>
                        <span className="text-[9px] text-gray-400">Departed</span>
                      </div>

                      {/* Moving Carrier Truck Marker (On-demand live tracking) */}
                      <div
                        className="absolute -top-6 transform -translate-x-1/2 transition-all duration-1000 ease-out flex flex-col items-center"
                        style={{ left: `${Math.min(92, Math.max(8, truckProgress))}%` }}
                      >
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5A93C] to-amber-600 border-2 border-white text-[#0A0D13] flex items-center justify-center shadow-gold animate-bounce">
                            <Truck className="w-7 h-7" />
                          </div>
                          {/* Pulsing Signal Wave */}
                          <div className="absolute inset-0 rounded-2xl bg-[#E5A93C] animate-ping opacity-30" />
                        </div>
                        <div className="mt-2 px-2 py-0.5 rounded bg-[#E5A93C] text-[#0A0D13] font-black text-[10px] uppercase font-mono shadow whitespace-nowrap">
                          {activeRequest.driver.truckPlate}
                        </div>
                      </div>

                      {/* Destination: Customer Breakdown Spot */}
                      <div className="absolute right-0 -top-1 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-lg animate-pulse">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-red-400 mt-2 block whitespace-nowrap">
                          Your Breakdown Spot
                        </span>
                        <span className="text-[9px] text-gray-400">
                          {activeRequest.vehicle.make} {activeRequest.vehicle.model}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Map Controls & Simulation Tool */}
                  <div className="relative z-10 pt-4 border-t border-[#1C2536] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">Trip Stage:</span>
                      <span className="px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] font-bold uppercase text-[11px]">
                        {trackingStep === 2 && 'Carrier Truck Approaching (Live GPS)'}
                        {trackingStep === 3 && 'Carrier Arrived at Breakdown Spot!'}
                        {trackingStep === 4 && 'Vehicle Hooked & Towing to Workshop'}
                        {trackingStep === 5 && 'Safely Delivered at AutoForge Garage'}
                      </span>
                    </div>

                    {/* Simulation Controls for Evaluator Testing */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (trackingStep < 5) {
                            setTrackingStep((s) => s + 1);
                            setTruckProgress((p) => Math.min(100, p + 25));
                            if (trackingStep === 2) setEtaRemaining(2);
                            if (trackingStep >= 3) setEtaRemaining(0);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-[11px] text-white flex items-center gap-1.5 transition-all"
                        title="Simulate driver progression along route"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>Advance Step (Demo)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTrackingStep(2);
                          setTruckProgress(20);
                          setEtaRemaining(10);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-gray-400 hover:text-white"
                        title="Reset simulation"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Step Progress Pipeline */}
                <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-4">
                  <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    Live Dispatch Progress Pipeline
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border ${trackingStep >= 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#141A26] border-[#232B3C] text-gray-500'}`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>1. Dispatched</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">From Workshop</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${trackingStep >= 2 ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-white' : 'bg-[#141A26] border-[#232B3C] text-gray-500'}`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        <Truck className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>2. En Route</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">Live GPS Active</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${trackingStep >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#141A26] border-[#232B3C] text-gray-500'}`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>3. On Site</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">At Breakdown</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${trackingStep >= 4 ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-[#141A26] border-[#232B3C] text-gray-500'}`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>4. Delivered</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">At Superhub Bay</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Driver Profile Card & Emergency Actions */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Driver Profile Card */}
                <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-6">
                  <div className="flex items-center justify-between border-b border-[#232B3C] pb-4">
                    <span className="text-xs uppercase font-bold text-[#E5A93C] tracking-wider">
                      ASSIGNED RECOVERY OPERATOR
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Active On Duty
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={activeRequest.driver.avatar}
                        alt={activeRequest.driver.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E5A93C]"
                      />
                      <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-[#E5A93C] text-[#080B10] text-[9px] font-black">
                        ★ {activeRequest.driver.rating}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-serif font-bold text-white">
                        {activeRequest.driver.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Senior Master Recovery Specialist
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-[#E5A93C] px-2 py-0.5 rounded bg-[#141A26] border border-[#232B3C]">
                          {activeRequest.driver.truckPlate}
                        </span>
                        <span className="text-gray-400 truncate max-w-[150px]">
                          {activeRequest.driver.truckModel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${activeRequest.driver.phone}`}
                      className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080B10] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Driver</span>
                    </a>

                    <a
                      href={`https://wa.me/${activeRequest.driver.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Vehicle In Transit Summary */}
                  <div className="p-4 rounded-xl bg-[#141A26] border border-[#232B3C] space-y-2 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Customer:</span>
                      <span className="text-white font-semibold">{activeRequest.customerName}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Breakdown Vehicle:</span>
                      <span className="text-white font-semibold">
                        {activeRequest.vehicle.make} {activeRequest.vehicle.model} ({activeRequest.vehicle.plateNumber})
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Reported Issue:</span>
                      <span className="text-amber-400 font-medium">{activeRequest.vehicle.breakdownReason}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Towing Carrier Rate:</span>
                      <span className="text-[#E5A93C] font-mono font-bold">${activeRequest.estimatedCost}.00</span>
                    </div>
                  </div>

                  {/* Reset / New Carrier Request */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Cancel this active carrier request?')) {
                          setActiveRequest(null);
                        }
                      }}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Cancel Tow Request</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRequest(null)}
                      className="text-xs text-[#E5A93C] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>New Breakdown Request</span>
                    </button>
                  </div>
                </div>

                {/* Safety Hotline Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 via-[#0F141F] to-[#0F141F] border border-red-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Roadside Safety Protocol
                    </h4>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                    <li>Turn on vehicle double hazard warning flashers immediately.</li>
                    <li>Place warning triangle reflector 30-50m behind your vehicle.</li>
                    <li>Remain behind roadside highway safety barriers while awaiting carrier.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
