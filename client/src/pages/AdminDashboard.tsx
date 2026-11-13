import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { api, mockServices, mockWorkshops } from '../services/api';
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
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'applications' | 'services'>('overview');
  const [analytics, setAnalytics] = useState<any>({
    summary: {
      totalRevenue: 24890,
      totalBookings: 64,
      totalServices: 6,
      totalWorkshops: 4,
      totalJobs: 4,
      totalApplications: 12,
      totalUsers: 89,
    },
    bookingStatusCounts: {
      pending: 4,
      confirmed: 28,
      inProgress: 14,
      completed: 16,
      cancelled: 2,
    },
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>(mockServices);

  // New Service state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('199');
  const [newServiceCategory, setNewServiceCategory] = useState('maintenance');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  useEffect(() => {
    // Fetch analytics
    api
      .get('/analytics/dashboard')
      .then((res) => {
        if (res.data && res.data.success) {
          setAnalytics(res.data.data);
        }
      })
      .catch(() => {});

    // Fetch all bookings
    api
      .get('/bookings')
      .then((res) => {
        if (res.data && res.data.success) {
          setBookings(res.data.data);
        }
      })
      .catch(() => {
        setBookings([
          {
            _id: 'b-101',
            invoiceNumber: 'AF-INV-2026-8821',
            user: { name: 'Alexander Wright', email: 'alexander@autoforge.com' },
            service: { name: 'Oil Change', price: 149 },
            workshop: { name: 'AutoForge Workshop', city: 'Bengaluru' },
            vehicle: { make: 'BMW', model: 'M3 Competition', plateNumber: 'KA 03 AF 4492' },
            appointmentDate: '2026-11-15',
            timeSlot: '10:00 AM',
            status: 'confirmed',
            totalAmount: 149,
          },
          {
            _id: 'b-102',
            invoiceNumber: 'AF-INV-2026-9043',
            user: { name: 'Farooq Al-Maktoum', email: 'farooq@autoforge.com' },
            service: { name: 'Brake Service', price: 289 },
            workshop: { name: 'AutoForge Workshop', city: 'Dubai' },
            vehicle: { make: 'Porsche', model: '911 GT3', plateNumber: 'DXB-AF-911' },
            appointmentDate: '2026-11-18',
            timeSlot: '02:00 PM',
            status: 'in-progress',
            totalAmount: 289,
          },
        ]);
      });

    // Fetch all applications
    api
      .get('/applications')
      .then((res) => {
        if (res.data && res.data.success) {
          setApplications(res.data.data);
        }
      })
      .catch(() => {
        setApplications([
          {
            _id: 'app-1',
            job: { title: 'Senior Master Diagnostic Technician', department: 'Diagnostics' },
            fullName: 'Marcus Vance',
            email: 'marcus.vance@techauto.io',
            phone: '+1 555-0182',
            currentRole: 'Lead Diagnostic Tech at Audi Sport',
            yearsOfExperience: 6,
            certifications: 'ASE Master, Audi Master Guild',
            status: 'under_review',
            createdAt: '2026-11-09T10:14:00Z',
          },
          {
            _id: 'app-2',
            job: { title: 'High-Performance Engine Specialist', department: 'Performance & Tuning' },
            fullName: 'Vikram Sengupta',
            email: 'vikram.s@motorsport.com',
            phone: '+91 98200 44102',
            currentRole: 'Dyno Engine Tuner',
            yearsOfExperience: 8,
            certifications: 'Cosworth ECU & Motec Certified',
            status: 'interview_scheduled',
            createdAt: '2026-11-08T15:30:00Z',
          },
        ]);
      });
  }, []);

  const updateBookingStatus = (id: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );
    api.patch(`/bookings/${id}/status`, { status: newStatus }).catch(() => {});
  };

  const updateAppStatus = (id: string, newStatus: string) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );
    api.patch(`/applications/${id}/status`, { status: newStatus }).catch(() => {});
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    const newSrv = {
      _id: `srv-${Date.now()}`,
      name: newServiceName,
      slug: newServiceName.toLowerCase().replace(/\s+/g, '-'),
      shortDescription: newServiceDesc || 'High performance workshop service.',
      fullDescription: newServiceDesc,
      category: newServiceCategory as any,
      price: Number(newServicePrice) || 199,
      durationHours: 2,
      iconName: 'Wrench',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      features: ['Genuine OEM Parts', 'Full Diagnostics Check'],
      isPopular: false,
      warrantyMonths: 12,
    };

    setServicesList([newSrv, ...servicesList]);
    setNewServiceName('');
    setNewServiceDesc('');
    api.post('/services', newSrv).catch(() => {});
  };

  return (
    <div className="pt-28 pb-20 bg-[#080B10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1E2535]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E5A93C] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> AutoForge Central Management
              </span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-white mt-1">
              Executive Analytics Dashboard
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Analytics' },
              { id: 'bookings', label: `Bookings (${bookings.length})` },
              { id: 'applications', label: `Careers (${applications.length})` },
              { id: 'services', label: 'Manage Services' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#E5A93C] text-[#0A0D13] font-bold shadow-gold'
                    : 'bg-[#121722] text-gray-400 hover:text-white border border-[#21293A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-semibold text-gray-400">Total Revenue</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-[#E5A93C]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-white">
                  ${analytics.summary.totalRevenue.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  ↑ +18.4% from last quarter
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-semibold text-gray-400">Service Appointments</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-white">
                  {analytics.summary.totalBookings}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Across 4 international superhubs
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-semibold text-gray-400">Career Candidates</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-white">
                  {analytics.summary.totalApplications}
                </div>
                <span className="text-[11px] text-amber-300 mt-1 block">
                  4 active technician roles
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-semibold text-gray-400">Registered Clients</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-white">
                  {analytics.summary.totalUsers}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  MERN + JWT authorized
                </span>
              </div>

            </div>

            {/* Pipeline Distribution Chart Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <h3 className="text-base font-bold font-serif text-white mb-4">
                  Garage Bay Capacity & Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Confirmed (Scheduled)</span>
                      <span className="text-emerald-400 font-bold">{analytics.bookingStatusCounts.confirmed} slots</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#181F2F] overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[45%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">In-Progress (On Hoist Bays)</span>
                      <span className="text-blue-400 font-bold">{analytics.bookingStatusCounts.inProgress} bays</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#181F2F] overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[25%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Completed & Dispatched</span>
                      <span className="text-[#E5A93C] font-bold">{analytics.bookingStatusCounts.completed} jobs</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#181F2F] overflow-hidden">
                      <div className="h-full bg-[#E5A93C] rounded-full w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hub Performance */}
              <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
                <h3 className="text-base font-bold font-serif text-white mb-4">
                  International Superhubs Telemetry
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#141A26]">
                    <div>
                      <span className="font-bold text-white block">Bengaluru Workshop</span>
                      <span className="text-gray-400">18 Bays • 25 Technicians</span>
                    </div>
                    <span className="text-[#E5A93C] font-bold">94% Occupancy</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#141A26]">
                    <div>
                      <span className="font-bold text-white block">Dubai Superbay</span>
                      <span className="text-gray-400">20 Bays • 30 Technicians</span>
                    </div>
                    <span className="text-[#E5A93C] font-bold">98% Occupancy</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#141A26]">
                    <div>
                      <span className="font-bold text-white block">Mumbai Hub</span>
                      <span className="text-gray-400">16 Bays • 20 Technicians</span>
                    </div>
                    <span className="text-[#E5A93C] font-bold">88% Occupancy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: All Bookings Management */}
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
                      <td className="p-4 font-bold text-amber-300">${b.totalAmount}</td>
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

        {/* Tab 3: Careers & Applications Management */}
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

        {/* Tab 4: Manage Services */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Add Service Form */}
            <div className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C]">
              <h3 className="text-base font-bold font-serif text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#E5A93C]" /> Add New Garage Service
              </h3>

              <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="e.g. Dyno Power Tune"
                    className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repairs">Repairs</option>
                    <option value="diagnostics">Diagnostics</option>
                    <option value="detailing">Detailing</option>
                    <option value="tires">Tires</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase mb-1">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="250"
                    className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-gray-400 uppercase mb-1">Description</label>
                  <input
                    type="text"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    placeholder="Summary of service procedure..."
                    className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider shadow-gold"
                  >
                    Add Service to Catalog
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Services List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesList.map((srv) => (
                <div key={srv._id} className="p-4 rounded-xl bg-[#0F141F] border border-[#232B3C] flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#E5A93C]">{srv.category}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{srv.name}</h4>
                    <span className="text-xs text-gray-400 mt-1 block">${srv.price} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

