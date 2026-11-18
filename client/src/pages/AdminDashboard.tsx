import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { api, mockServices, serviceApi, lorryApi } from '../services/api';
import { Service, CarrierLorry, CarrierRequest } from '../types';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  Trash2,
  Edit,
  Truck,
  Wrench,
  Search,
  Filter,
  X,
  Phone,
  AlertTriangle,
  Radio,
  MapPin,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  activeSection?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSection }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');

  // If not admin, block access immediately
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-[#080B10] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0F141F] border border-red-500/40 text-center shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">403 - Access Denied</h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Administrator privileges required. You do not have permission to access the AutoForge Executive Management Portal.
          </p>
        </div>
      </div>
    );
  }

  // Tabs: overview | services | lorries | tow-requests | bookings | applications
  const [activeTab, setActiveTab] = useState<
    'overview' | 'services' | 'lorries' | 'tow-requests' | 'bookings' | 'applications'
  >('overview');

  useEffect(() => {
    if (activeSection === 'admin-services') setActiveTab('services');
    else if (activeSection === 'admin-lorries') setActiveTab('lorries');
    else if (activeSection === 'admin-tows') setActiveTab('tow-requests');
    else if (activeSection === 'admin-bookings') setActiveTab('bookings');
    else if (activeSection === 'admin-applications') setActiveTab('applications');
    else if (activeSection === 'admin-overview' || activeSection === 'admin') setActiveTab('overview');
  }, [activeSection]);

  // Analytics State
  const [analytics, setAnalytics] = useState<any>({
    summary: {
      totalRevenue: 38450,
      totalBookings: 68,
      totalServices: 6,
      totalWorkshops: 3,
      totalJobs: 4,
      totalApplications: 12,
      totalUsers: 92,
      totalLorries: 3,
      totalTowRequests: 9,
    },
    bookingStatusCounts: {
      pending: 4,
      confirmed: 28,
      inProgress: 14,
      completed: 20,
      cancelled: 2,
    },
  });

  // Data Collections
  const [servicesList, setServicesList] = useState<Service[]>(mockServices);
  const [lorriesList, setLorriesList] = useState<CarrierLorry[]>([]);
  const [towRequests, setTowRequests] = useState<CarrierRequest[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Loading & Filter states
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [lorryHubFilter, setLorryHubFilter] = useState<string>('all');

  // Add Service Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'maintenance',
    price: '199',
    durationHours: '2',
    shortDescription: '',
    fullDescription: '',
    warrantyMonths: '12',
    iconName: 'Wrench',
    features: 'OEM Spec Components, Computerized Diagnostics, Quality Certified',
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
  });

  // Add Carrier Lorry Modal State
  const [showAddLorryModal, setShowAddLorryModal] = useState<boolean>(false);
  const [lorryForm, setLorryForm] = useState({
    truckPlate: '',
    truckModel: '',
    carrierType: 'flatbed' as 'flatbed' | 'wheel_lift' | 'ev_heavy',
    assignedHub: 'Galle' as 'Galle' | 'Hikkaduwa' | 'Ambalangoda',
    driverName: '',
    driverPhone: '+94 7',
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    maxTowingCapacityKg: '4200',
    equippedFeatures: 'Hydraulic Tilt Bed, Low-Clearance Ramps, Laser Winch, High-Vis Strobes',
    notes: '',
  });

  // Load all data on mount
  useEffect(() => {
    // 1. Fetch Analytics
    api
      .get('/analytics/dashboard')
      .then((res) => {
        if (res.data?.success) setAnalytics(res.data.data);
      })
      .catch(() => {});

    // 2. Fetch Services
    serviceApi
      .getAll()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setServicesList(res.data.data);
        }
      })
      .catch(() => {});

    // 3. Fetch Carrier Lorries Fleet
    lorryApi
      .getAll()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setLorriesList(res.data.data);
        }
      })
      .catch(() => {
        // Fallback default fleet
        setLorriesList([
          {
            _id: 'l-1',
            truckPlate: 'SP LY-4109',
            truckModel: 'Isuzu Elf Hydraulic Flatbed Transporter',
            carrierType: 'flatbed',
            assignedHub: 'Galle',
            driverName: 'Chaminda Silva',
            driverPhone: '+94 77 123 4567',
            driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            rating: 4.96,
            status: 'available',
            completedRescues: 142,
            maxTowingCapacityKg: 4200,
            equippedFeatures: ['Hydraulic Tilt Bed', 'Low-Clearance Ramps', 'Laser Winch'],
          },
          {
            _id: 'l-2',
            truckPlate: 'SP LZ-8821',
            truckModel: 'Mitsubishi Fuso Rapid Breakdown Tow',
            carrierType: 'wheel_lift',
            assignedHub: 'Hikkaduwa',
            driverName: 'Sunil Bandara',
            driverPhone: '+94 71 889 2233',
            driverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            rating: 4.98,
            status: 'available',
            completedRescues: 218,
            maxTowingCapacityKg: 3500,
            equippedFeatures: ['Rapid Underlift Boom', 'Dollies Skates', 'Dual Air Winch'],
          },
          {
            _id: 'l-3',
            truckPlate: 'SP LW-9904',
            truckModel: 'Hino 500 Heavy-Duty Recovery Unit',
            carrierType: 'ev_heavy',
            assignedHub: 'Ambalangoda',
            driverName: 'Nalin Fernando',
            driverPhone: '+94 76 554 1122',
            driverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
            rating: 4.94,
            status: 'available',
            completedRescues: 98,
            maxTowingCapacityKg: 7500,
            equippedFeatures: ['High-Voltage Insulated Bed', 'EV Battery Isolation Kit', 'Heavy Rotator Boom'],
          },
        ]);
      });

    // 4. Fetch Breakdown Tow Requests
    lorryApi
      .getAllRequests()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setTowRequests(res.data.data);
        }
      })
      .catch(() => {});

    // 5. Fetch Bookings
    api
      .get('/bookings')
      .then((res) => {
        if (res.data?.success) setBookings(res.data.data);
      })
      .catch(() => {
        setBookings([
          {
            _id: 'b-101',
            invoiceNumber: 'AF-INV-2026-8821',
            user: { name: 'Alexander Wright', email: 'alexander@autoforge.com' },
            service: { name: 'Oil Change', price: 149 },
            workshop: { name: 'AutoForge Galle Superhub', city: 'Galle' },
            vehicle: { make: 'BMW', model: 'M3 Competition', plateNumber: 'WP CAB-4492' },
            appointmentDate: '2026-11-15',
            timeSlot: '10:00 AM',
            status: 'confirmed',
            totalAmount: 149,
          },
          {
            _id: 'b-102',
            invoiceNumber: 'AF-INV-2026-9043',
            user: { name: 'Kavinda Perera', email: 'kavinda@autoforge.com' },
            service: { name: 'Brake Service', price: 289 },
            workshop: { name: 'AutoForge Hikkaduwa Workshop', city: 'Hikkaduwa' },
            vehicle: { make: 'Porsche', model: '911 GT3', plateNumber: 'SP CAA-9110' },
            appointmentDate: '2026-11-18',
            timeSlot: '02:00 PM',
            status: 'in-progress',
            totalAmount: 289,
          },
        ]);
      });

    // 6. Fetch Career Applications
    api
      .get('/applications')
      .then((res) => {
        if (res.data?.success) setApplications(res.data.data);
      })
      .catch(() => {
        setApplications([
          {
            _id: 'app-1',
            fullName: 'Marcus Vance',
            email: 'marcus.vance@techauto.io',
            phone: '+94 77 992 0182',
            currentRole: 'Lead Diagnostic Tech at Audi Sport',
            yearsOfExperience: 6,
            certifications: 'ASE Master Automobile Tech, Audi Master Guild',
            status: 'under_review',
            job: { title: 'Senior Master Diagnostic Technician' },
          },
        ]);
      });
  }, []);

  // Handler: Add New Service
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await serviceApi.create({
        name: serviceForm.name,
        category: serviceForm.category,
        price: parseFloat(serviceForm.price),
        durationHours: parseFloat(serviceForm.durationHours),
        shortDescription: serviceForm.shortDescription,
        fullDescription: serviceForm.fullDescription,
        warrantyMonths: parseInt(serviceForm.warrantyMonths),
        features: serviceForm.features.split(',').map((f) => f.trim()),
        isPopular: serviceForm.isPopular,
        image: serviceForm.image,
      });

      if (res.data?.success && res.data.data) {
        setServicesList((prev) => [res.data.data, ...prev]);
        setShowAddServiceModal(false);
        setServiceForm({
          name: '',
          category: 'maintenance',
          price: '199',
          durationHours: '2',
          shortDescription: '',
          fullDescription: '',
          warrantyMonths: '12',
          iconName: 'Wrench',
          features: 'OEM Spec Components, Computerized Diagnostics, Quality Certified',
          isPopular: false,
          image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        });
        alert('Service successfully added to catalog!');
      }
    } catch (err: any) {
      alert(`Error creating service: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Delete Service
  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the service "${name}"?`)) return;

    try {
      await serviceApi.delete(id);
      setServicesList((prev) => prev.filter((s) => s._id !== id));
    } catch {
      // Local removal
      setServicesList((prev) => prev.filter((s) => s._id !== id));
    }
  };

  // Handler: Add Carrier Lorry
  const handleAddLorrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await lorryApi.create({
        truckPlate: lorryForm.truckPlate,
        truckModel: lorryForm.truckModel,
        carrierType: lorryForm.carrierType,
        assignedHub: lorryForm.assignedHub,
        driverName: lorryForm.driverName,
        driverPhone: lorryForm.driverPhone,
        driverPhoto: lorryForm.driverPhoto,
        maxTowingCapacityKg: parseInt(lorryForm.maxTowingCapacityKg),
        equippedFeatures: lorryForm.equippedFeatures.split(',').map((f) => f.trim()),
        notes: lorryForm.notes,
      });

      if (res.data?.success && res.data.data) {
        setLorriesList((prev) => [res.data.data, ...prev]);
        setShowAddLorryModal(false);
        setLorryForm({
          truckPlate: '',
          truckModel: '',
          carrierType: 'flatbed',
          assignedHub: 'Galle',
          driverName: '',
          driverPhone: '+94 7',
          driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          maxTowingCapacityKg: '4200',
          equippedFeatures: 'Hydraulic Tilt Bed, Low-Clearance Ramps, Laser Winch, High-Vis Strobes',
          notes: '',
        });
        alert('Carrier Lorry successfully registered into AutoForge fleet!');
      }
    } catch (err: any) {
      alert(`Error adding carrier lorry: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Update Lorry Status
  const handleUpdateLorryStatus = async (id: string, newStatus: string) => {
    try {
      await lorryApi.update(id, { status: newStatus });
      setLorriesList((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus as any } : l))
      );
    } catch {
      setLorriesList((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus as any } : l))
      );
    }
  };

  // Handler: Delete / Decommission Lorry
  const handleDeleteLorry = async (id: string, plate: string) => {
    if (!confirm(`Are you sure you want to decommission carrier lorry "${plate}" from fleet?`)) return;

    try {
      await lorryApi.delete(id);
      setLorriesList((prev) => prev.filter((l) => l._id !== id));
    } catch {
      setLorriesList((prev) => prev.filter((l) => l._id !== id));
    }
  };

  // Handler: Update Tow Request Status
  const handleUpdateTowStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/carriers/${id}/status`, { status: newStatus });
      setTowRequests((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: newStatus as any } : t))
      );
    } catch {
      setTowRequests((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: newStatus as any } : t))
      );
    }
  };

  // Handler: Update Booking Status
  const updateBookingStatus = (id: string, status: string) => {
    api
      .patch(`/bookings/${id}/status`, { status })
      .then(() => {
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      })
      .catch(() => {
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      });
  };

  // Handler: Update Application Status
  const updateAppStatus = (id: string, status: string) => {
    api
      .patch(`/applications/${id}/status`, { status })
      .then(() => {
        setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      })
      .catch(() => {
        setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      });
  };

  // Filtered Services
  const filteredServices = servicesList.filter((s) => {
    const matchesCategory =
      serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered Lorries
  const filteredLorries = lorriesList.filter((l) => {
    return lorryHubFilter === 'all' || l.assignedHub === lorryHubFilter;
  });

  return (
    <div className="pt-24 pb-20 bg-[#080B10] min-h-screen text-white">
      {/* Top Administrative Command Header */}
      <div className="border-b border-[#1E2535] bg-gradient-to-b from-[#0F141F] to-[#080B10] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5A93C] to-amber-600 border border-[#E5A93C] text-[#0A0D13] flex items-center justify-center font-bold shadow-gold">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-white">
                AutoForge <span className="gold-text-gradient">Dashboard</span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Centralized Operations: Workshop Services Catalog, Carrier Fleet, Bay Bookings & Guild Recruitment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#141A26] border border-[#232B3C] p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                Logged in as Administrator
              </span>
              <span className="text-xs font-bold text-white">
                {user?.name || 'Lead Administrator'} ({user?.email || 'admin@autoforge.com'})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1E2535]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#E5A93C] text-[#0A0D13] shadow-gold'
                : 'bg-[#0F141F] text-gray-400 hover:text-white border border-[#232B3C]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-[#E5A93C] text-[#0A0D13] shadow-gold'
                : 'bg-[#0F141F] text-gray-400 hover:text-white border border-[#232B3C]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Services Catalog</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
              {servicesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('lorries')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'lorries'
                ? 'bg-[#E5A93C] text-[#0A0D13] shadow-gold'
                : 'bg-[#0F141F] text-gray-400 hover:text-white border border-[#232B3C]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Carrier Lorries & Fleet</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
              {lorriesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tow-requests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'tow-requests'
                ? 'bg-[#E5A93C] text-[#0A0D13] shadow-gold'
                : 'bg-[#0F141F] text-gray-400 hover:text-white border border-[#232B3C]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Breakdown Tow Requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
              {towRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#E5A93C] text-[#0A0D13] shadow-gold'
                : 'bg-[#0F141F] text-gray-400 hover:text-white border border-[#232B3C]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Customer Bookings</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'applications'
                ? 'bg-[#E5A93C] text-[#0A0D13] shadow-gold'
                : 'bg-[#0F141F] text-gray-400 hover:text-white border border-[#232B3C]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Career Applications</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
              {applications.length}
            </span>
          </button>
        </div>

        {/* ============================================================
           TAB 1: OVERVIEW & TELEMETRY
           ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#E5A93C]" />
                </div>
                <div className="text-3xl font-serif font-bold text-white font-mono">
                  ${analytics.summary?.totalRevenue?.toLocaleString() || '38,450'}
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  ↑ +18.4% this quarter
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Active Services</span>
                  <Wrench className="w-5 h-5 text-[#E5A93C]" />
                </div>
                <div className="text-3xl font-serif font-bold text-white font-mono">
                  {servicesList.length}
                </div>
                <span className="text-[11px] text-gray-400 block">
                  Across 5 specialized categories
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Carrier Fleet Lorries</span>
                  <Truck className="w-5 h-5 text-[#E5A93C]" />
                </div>
                <div className="text-3xl font-serif font-bold text-white font-mono">
                  {lorriesList.length}
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  100% On-Duty Availability
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Workshop Bookings</span>
                  <Calendar className="w-5 h-5 text-[#E5A93C]" />
                </div>
                <div className="text-3xl font-serif font-bold text-white font-mono">
                  {bookings.length}
                </div>
                <span className="text-[11px] text-[#E5A93C] font-semibold block">
                  {bookings.filter((b) => b.status === 'confirmed').length} Confirmed Slots
                </span>
              </div>
            </div>

            {/* Regional Superhubs Telemetry & Quick Action Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-5">
                <div className="flex items-center justify-between border-b border-[#232B3C] pb-3">
                  <h3 className="text-base font-serif font-bold text-white">
                    Regional Workshop Network Telemetry
                  </h3>
                  <span className="text-xs text-[#E5A93C] font-mono font-bold">Southern Sri Lanka</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141A26] border border-[#232B3C]">
                    <div>
                      <span className="font-bold text-white block text-sm">Galle Superhub</span>
                      <span className="text-gray-400">Wakwella Road • 18 Bays • 25 Technicians</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#E5A93C] font-bold font-mono">94% Bay Occupancy</span>
                      <span className="text-[10px] text-emerald-400 block">Flatbed Lorry On-Site</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141A26] border border-[#232B3C]">
                    <div>
                      <span className="font-bold text-white block text-sm">Hikkaduwa Workshop</span>
                      <span className="text-gray-400">Galle Road • 20 Bays • 30 Technicians</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#E5A93C] font-bold font-mono">98% Bay Occupancy</span>
                      <span className="text-[10px] text-emerald-400 block">Rapid Tow Lorry Active</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141A26] border border-[#232B3C]">
                    <div>
                      <span className="font-bold text-white block text-sm">Ambalangoda Hub</span>
                      <span className="text-gray-400">Main Street • 16 Bays • 20 Technicians</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#E5A93C] font-bold font-mono">88% Bay Occupancy</span>
                      <span className="text-[10px] text-purple-400 block">Heavy EV Lorry Stationed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] space-y-4">
                <h3 className="text-base font-serif font-bold text-white border-b border-[#232B3C] pb-3">
                  Quick Administrative Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setActiveTab('services');
                      setShowAddServiceModal(true);
                    }}
                    className="w-full p-4 rounded-xl bg-[#141A26] hover:bg-[#1E2638] border border-[#232B3C] hover:border-[#E5A93C] text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center font-bold">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block group-hover:text-[#E5A93C] transition-colors">
                          Add New Garage Service
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Register procedure, pricing, and warranty
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#E5A93C] font-mono font-bold">Launch →</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('lorries');
                      setShowAddLorryModal(true);
                    }}
                    className="w-full p-4 rounded-xl bg-[#141A26] hover:bg-[#1E2638] border border-[#232B3C] hover:border-[#E5A93C] text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block group-hover:text-emerald-400 transition-colors">
                          Register Carrier Lorry
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Add flatbed/tow truck to garage fleet
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-bold">Launch →</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('tow-requests')}
                    className="w-full p-4 rounded-xl bg-[#141A26] hover:bg-[#1E2638] border border-[#232B3C] hover:border-[#E5A93C] text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block group-hover:text-red-400 transition-colors">
                          Monitor Breakdown Requests
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Review on-demand customer towing pipelines
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-red-400 font-mono font-bold">View →</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================
           TAB 2: SERVICES CATALOG (ADMIN MANAGEMENT & ADD SERVICE)
           ============================================================ */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter & Add Service Bar */}
            <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search services..."
                    className="pl-10 pr-4 py-2 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={serviceCategoryFilter}
                    onChange={(e) => setServiceCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="all">All Categories</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repairs">Repairs</option>
                    <option value="diagnostics">Diagnostics</option>
                    <option value="detailing">Detailing</option>
                    <option value="tires">Tires</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddServiceModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-[#080B10] font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-gold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Garage Service</span>
              </button>
            </div>

            {/* Services Data Table */}
            <div className="overflow-x-auto rounded-2xl bg-[#0F141F] border border-[#232B3C]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141A26] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#232B3C]">
                  <tr>
                    <th className="p-4">Service</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (USD)</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Warranty</th>
                    <th className="p-4">Badge</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2436] text-gray-300">
                  {filteredServices.map((srv) => (
                    <tr key={srv._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={srv.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=150&q=80'}
                            alt={srv.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#232B3C]"
                          />
                          <div>
                            <span className="font-bold text-white text-sm block">{srv.name}</span>
                            <span className="text-[11px] text-gray-400 line-clamp-1 max-w-[280px]">
                              {srv.shortDescription}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#141A26] border border-[#232B3C] text-[#E5A93C]">
                          {srv.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-amber-300 text-sm">
                        ${srv.price}.00
                      </td>

                      <td className="p-4 font-mono text-gray-300">
                        {srv.durationHours} hrs
                      </td>

                      <td className="p-4 text-gray-300">
                        {srv.warrantyMonths} Months
                      </td>

                      <td className="p-4">
                        {srv.isPopular ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-[#E5A93C] border border-amber-500/30">
                            POPULAR
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500">Standard</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv._id, srv.name)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
           TAB 3: CARRIER LORRIES & FLEET MANAGEMENT (ADD LORRY)
           ============================================================ */}
        {activeTab === 'lorries' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Lorry Fleet Telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                  TOTAL CARRIER FLEET
                </span>
                <span className="text-2xl font-bold font-mono text-white">{lorriesList.length} Units</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                  AVAILABLE ON DUTY
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {lorriesList.filter((l) => l.status === 'available').length} Trucks
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold block mb-1">
                  CURRENTLY ON CALL
                </span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {lorriesList.filter((l) => l.status === 'on_call').length} Trucks
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold block mb-1">
                  IN SERVICE / MAINTENANCE
                </span>
                <span className="text-2xl font-bold font-mono text-red-400">
                  {lorriesList.filter((l) => l.status === 'maintenance').length} Units
                </span>
              </div>
            </div>

            {/* Filter & Register Carrier Lorry Bar */}
            <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-semibold">Filter by Base Garage:</span>
                <select
                  value={lorryHubFilter}
                  onChange={(e) => setLorryHubFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#141A26] border border-[#232B3C] text-xs text-white focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="all">All Regional Superhubs</option>
                  <option value="Galle">Galle Superhub</option>
                  <option value="Hikkaduwa">Hikkaduwa Workshop</option>
                  <option value="Ambalangoda">Ambalangoda Workshop</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowAddLorryModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#080B10] font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Carrier Lorry</span>
              </button>
            </div>

            {/* Lorries Fleet Data Table */}
            <div className="overflow-x-auto rounded-2xl bg-[#0F141F] border border-[#232B3C]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141A26] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#232B3C]">
                  <tr>
                    <th className="p-4">Lorry Plate & Model</th>
                    <th className="p-4">Base Garage</th>
                    <th className="p-4">Carrier Spec</th>
                    <th className="p-4">Lead Operator / Driver</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Operational Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2436] text-gray-300">
                  {filteredLorries.map((lorry) => (
                    <tr key={lorry._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#141A26] border border-[#232B3C] text-[#E5A93C] flex items-center justify-center font-bold">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-mono font-bold text-white text-sm block">
                              {lorry.truckPlate}
                            </span>
                            <span className="text-gray-400 text-[11px] block">
                              {lorry.truckModel}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-white block">{lorry.assignedHub} Superhub</span>
                        <span className="text-[10px] text-gray-500">Southern Province</span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#141A26] border border-[#232B3C] text-emerald-400">
                          {lorry.carrierType.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={lorry.driverPhoto}
                            alt={lorry.driverName}
                            className="w-8 h-8 rounded-full object-cover border border-[#E5A93C]"
                          />
                          <div>
                            <span className="font-bold text-white block">{lorry.driverName}</span>
                            <span className="text-[11px] text-gray-400 font-mono">{lorry.driverPhone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-gray-300">
                        {lorry.maxTowingCapacityKg} kg
                      </td>

                      <td className="p-4">
                        <select
                          value={lorry.status}
                          onChange={(e) => handleUpdateLorryStatus(lorry._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 outline-none border ${
                            lorry.status === 'available'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : lorry.status === 'on_call'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : lorry.status === 'maintenance'
                              ? 'bg-red-500/10 text-red-400 border-red-500/30'
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                          }`}
                        >
                          <option value="available" className="bg-[#141A26] text-emerald-400">Available (On Duty)</option>
                          <option value="on_call" className="bg-[#141A26] text-amber-400">On Call (En Route)</option>
                          <option value="maintenance" className="bg-[#141A26] text-red-400">Maintenance Service</option>
                          <option value="offline" className="bg-[#141A26] text-gray-400">⚪ Offline</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteLorry(lorry._id, lorry.truckPlate)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="Decommission lorry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
           TAB 4: LIVE BREAKDOWN TOW REQUESTS
           ============================================================ */}
        {activeTab === 'tow-requests' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  Live Roadside Breakdown Requests
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Real-time GPS dispatch pipelines from customer Carrier bookings
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#E5A93C] px-3 py-1 rounded-lg bg-[#141A26] border border-[#232B3C]">
                {towRequests.length} Active Records
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-[#0F141F] border border-[#232B3C]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141A26] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#232B3C]">
                  <tr>
                    <th className="p-4">Tracking Code</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Reported Issue</th>
                    <th className="p-4">Assigned Lorry & Driver</th>
                    <th className="p-4">Route Distance</th>
                    <th className="p-4">Fare</th>
                    <th className="p-4">Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2436] text-gray-300">
                  {towRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-400">
                        No active breakdown tow requests logged. Go to the CARRIER page to test live on-demand dispatch!
                      </td>
                    </tr>
                  ) : (
                    towRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono font-bold text-[#E5A93C]">
                          {req.trackingCode}
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-white block">{req.customerName}</span>
                          <span className="text-gray-400 text-[11px] font-mono">{req.customerPhone}</span>
                        </td>

                        <td className="p-4">
                          <span className="text-white font-medium block">
                            {req.vehicle?.make} {req.vehicle?.model}
                          </span>
                          <span className="text-gray-400 text-[11px] font-mono">
                            {req.vehicle?.plateNumber}
                          </span>
                        </td>

                        <td className="p-4 text-amber-300 max-w-[200px] truncate">
                          {req.vehicle?.breakdownReason}
                        </td>

                        <td className="p-4">
                          <span className="text-white font-bold block">{req.driver?.name}</span>
                          <span className="text-[11px] font-mono text-[#E5A93C]">{req.driver?.truckPlate}</span>
                        </td>

                        <td className="p-4 font-mono text-white font-bold">
                          {req.distanceKm} km
                        </td>

                        <td className="p-4 font-mono font-bold text-[#E5A93C]">
                          ${req.estimatedCost}.00
                        </td>

                        <td className="p-4">
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateTowStatus(req._id, e.target.value)}
                            className="bg-[#141A26] border border-[#2B3549] text-xs text-white rounded px-2.5 py-1 outline-none"
                          >
                            <option value="dispatched">Dispatched</option>
                            <option value="en_route">En Route (GPS)</option>
                            <option value="arrived">On Site</option>
                            <option value="towing">Towing</option>
                            <option value="completed">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
           TAB 5: CUSTOMER BOOKINGS MANAGEMENT
           ============================================================ */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="overflow-x-auto rounded-2xl bg-[#0F141F] border border-[#232B3C]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141A26] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#232B3C]">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2436] text-gray-300">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-mono font-bold text-[#E5A93C]">{b.invoiceNumber}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{b.user?.name || 'Customer'}</span>
                        <span className="text-gray-500 text-[11px]">{b.user?.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white">{b.vehicle?.year} {b.vehicle?.make} {b.vehicle?.model}</span>
                        <span className="block text-gray-500 text-[11px]">{b.vehicle?.plateNumber}</span>
                      </td>
                      <td className="p-4 text-white font-medium">{b.service?.name}</td>
                      <td className="p-4">
                        <span>{b.appointmentDate}</span>
                        <span className="block text-gray-500">{b.timeSlot}</span>
                      </td>
                      <td className="p-4 font-bold text-amber-300 font-mono">${b.totalAmount}.00</td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b._id, e.target.value)}
                          className="bg-[#141A26] border border-[#2B3549] text-xs text-white rounded px-2.5 py-1 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
           TAB 6: CAREER APPLICATIONS
           ============================================================ */}
        {activeTab === 'applications' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="overflow-x-auto rounded-2xl bg-[#0F141F] border border-[#232B3C]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141A26] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#232B3C]">
                  <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Applied Role</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Certifications</th>
                    <th className="p-4">Status Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2436] text-gray-300">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <span className="font-bold text-white block">{app.fullName}</span>
                        <span className="text-gray-500 text-[11px]">{app.email} • {app.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-medium">{app.job?.title}</span>
                        <span className="block text-gray-500 text-[11px]">{app.currentRole}</span>
                      </td>
                      <td className="p-4 font-semibold text-white">{app.yearsOfExperience} Years</td>
                      <td className="p-4 text-gray-300">{app.certifications}</td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => updateAppStatus(app._id, e.target.value)}
                          className="bg-[#141A26] border border-[#2B3549] text-xs text-white rounded px-2.5 py-1 outline-none"
                        >
                          <option value="applied">Applied</option>
                          <option value="under_review">Under Review</option>
                          <option value="interview_scheduled">Interview Scheduled</option>
                          <option value="offered">Offer Extended</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================
         MODAL 1: ADD NEW GARAGE SERVICE
         ============================================================ */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0F141F] border border-[#232B3C] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddServiceModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">Add New Garage Service</h3>
                <p className="text-xs text-gray-400">Register a new maintenance or repair procedure into catalog</p>
              </div>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="e.g. Brembo Ceramic Brake Upgrade"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Category *</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repairs">Repairs</option>
                    <option value="diagnostics">Diagnostics</option>
                    <option value="detailing">Detailing</option>
                    <option value="tires">Tires</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="199"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Duration (Hours) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={serviceForm.durationHours}
                    onChange={(e) => setServiceForm({ ...serviceForm, durationHours: e.target.value })}
                    placeholder="2"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Warranty Period (Months)</label>
                  <input
                    type="number"
                    value={serviceForm.warrantyMonths}
                    onChange={(e) => setServiceForm({ ...serviceForm, warrantyMonths: e.target.value })}
                    placeholder="12"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Service Image URL</label>
                  <input
                    type="text"
                    value={serviceForm.image}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Short Summary</label>
                <input
                  type="text"
                  value={serviceForm.shortDescription}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  placeholder="Concise overview of service benefits..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Features (Comma-separated)</label>
                <input
                  type="text"
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={serviceForm.isPopular}
                  onChange={(e) => setServiceForm({ ...serviceForm, isPopular: e.target.checked })}
                  className="rounded text-[#E5A93C] focus:ring-[#E5A93C]"
                />
                <label htmlFor="popularCheck" className="text-gray-300 font-medium cursor-pointer">
                  Mark as Popular / Featured Service on Homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#232B3C]">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-amber-400 text-[#080B10] font-black uppercase tracking-wider shadow-gold"
                >
                  {loading ? 'Creating...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         MODAL 2: REGISTER NEW CARRIER LORRY
         ============================================================ */}
      {showAddLorryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0F141F] border border-[#232B3C] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddLorryModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">Register Carrier Lorry</h3>
                <p className="text-xs text-gray-400">Add a new breakdown recovery tow truck to the AutoForge fleet</p>
              </div>
            </div>

            <form onSubmit={handleAddLorrySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Truck License Plate *</label>
                  <input
                    type="text"
                    required
                    value={lorryForm.truckPlate}
                    onChange={(e) => setLorryForm({ ...lorryForm, truckPlate: e.target.value.toUpperCase() })}
                    placeholder="e.g. SP LY-5502"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white font-mono uppercase focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Truck Model & Make *</label>
                  <input
                    type="text"
                    required
                    value={lorryForm.truckModel}
                    onChange={(e) => setLorryForm({ ...lorryForm, truckModel: e.target.value })}
                    placeholder="e.g. Isuzu Forward Hydraulic Flatbed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Carrier Type *</label>
                  <select
                    value={lorryForm.carrierType}
                    onChange={(e) => setLorryForm({ ...lorryForm, carrierType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="flatbed">Hydraulic Flatbed (Supercars & Sedans)</option>
                    <option value="wheel_lift">Wheel-Lift Boom (Rapid Urban Tow)</option>
                    <option value="ev_heavy">Heavy EV Transporter (High Voltage)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Assigned Superhub *</label>
                  <select
                    value={lorryForm.assignedHub}
                    onChange={(e) => setLorryForm({ ...lorryForm, assignedHub: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="Galle">Galle Superhub</option>
                    <option value="Hikkaduwa">Hikkaduwa Workshop</option>
                    <option value="Ambalangoda">Ambalangoda Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Lead Operator / Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={lorryForm.driverName}
                    onChange={(e) => setLorryForm({ ...lorryForm, driverName: e.target.value })}
                    placeholder="e.g. Kasun Jayawardena"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Driver Phone (Emergency) *</label>
                  <input
                    type="text"
                    required
                    value={lorryForm.driverPhone}
                    onChange={(e) => setLorryForm({ ...lorryForm, driverPhone: e.target.value })}
                    placeholder="+94 77 456 7890"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Max Towing Capacity (kg)</label>
                  <input
                    type="number"
                    value={lorryForm.maxTowingCapacityKg}
                    onChange={(e) => setLorryForm({ ...lorryForm, maxTowingCapacityKg: e.target.value })}
                    placeholder="4200"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Driver Photo URL</label>
                  <input
                    type="text"
                    value={lorryForm.driverPhoto}
                    onChange={(e) => setLorryForm({ ...lorryForm, driverPhoto: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Equipped Features / Gear (Comma-separated)</label>
                <input
                  type="text"
                  value={lorryForm.equippedFeatures}
                  onChange={(e) => setLorryForm({ ...lorryForm, equippedFeatures: e.target.value })}
                  placeholder="Hydraulic Winch, Safety Strobes, Tie-Down Straps"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3C] text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#232B3C]">
                <button
                  type="button"
                  onClick={() => setShowAddLorryModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#080B10] font-black uppercase tracking-wider shadow-md"
                >
                  {loading ? 'Registering...' : 'Register Lorry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
