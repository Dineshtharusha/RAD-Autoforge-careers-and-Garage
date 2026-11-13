import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Booking } from '../types';
import { api } from '../services/api';
import { generateBookingInvoicePDF } from '../utils/pdfGenerator';
import {
  Calendar,
  FileDown,
  Car,
  MapPin,
  Clock,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface MyBookingsPageProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onOpenBooking,
  onOpenAuth,
}) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { myBookings } = useSelector((state: RootState) => state.booking);

  const [bookingsList, setBookingsList] = useState<Booking[]>(myBookings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api
        .get('/bookings/my')
        .then((res) => {
          if (res.data && res.data.success) {
            setBookingsList(res.data.data);
          }
        })
        .catch(() => {
          // Demo fallback bookings
          if (bookingsList.length === 0) {
            setBookingsList([
              {
                _id: 'b-demo-1',
                user: user ? user._id : 'usr-1',
                service: {
                  _id: 'srv-1',
                  name: 'Oil Change',
                  slug: 'oil-change',
                  shortDescription: 'High-performance oil changes with premium synthetic oils.',
                  fullDescription: '',
                  category: 'maintenance',
                  price: 149,
                  durationHours: 1.5,
                  iconName: 'Droplet',
                  image: '',
                  features: [],
                  isPopular: true,
                  warrantyMonths: 6,
                },
                workshop: {
                  _id: 'w-1',
                  name: 'AutoForge Workshop',
                  city: 'Bengaluru',
                  country: 'India',
                  address: '42 Prestige Tech Boulevard, Whitefield, Bengaluru',
                  phone: '+91 80 4920 1800',
                  email: 'bengaluru@autoforge.com',
                  baysCount: 18,
                  techniciansCount: 25,
                  specialization: 'Luxury & Performance Specialist',
                  image: '',
                  rating: 4.95,
                  operatingHours: '8:00 AM - 8:00 PM',
                  amenities: [],
                  isActive: true,
                },
                vehicle: {
                  make: 'BMW',
                  model: 'M3 Competition',
                  year: 2023,
                  plateNumber: 'KA 03 AF 4492',
                  mileage: 18500,
                },
                appointmentDate: '2026-11-15',
                timeSlot: '10:00 AM',
                status: 'confirmed',
                totalAmount: 149,
                paymentStatus: 'completed',
                invoiceNumber: 'AF-INV-2026-8821',
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 bg-[#080B10] min-h-screen text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0F141F] border border-[#232B3C] text-center space-y-4">
          <Calendar className="w-12 h-12 text-[#E5A93C] mx-auto" />
          <h2 className="text-xl font-bold font-serif text-white">
            Client Portal Login Required
          </h2>
          <p className="text-xs text-gray-400">
            Please sign in to view your active garage reservations, repair records, and download tax invoices.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider shadow-gold hover:bg-amber-400 transition-colors"
          >
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'completed':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#080B10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1E2535]">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#E5A93C]">
              Customer Service Portfolio
            </span>
            <h1 className="text-3xl font-bold font-serif text-white mt-1">
              My Appointments & Invoices
            </h1>
          </div>

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider shadow-gold hover:bg-amber-400 transition-colors"
          >
            <span>Book New Service</span>
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-[#E5A93C]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && bookingsList.length === 0 && (
          <div className="text-center py-20 bg-[#0F141F] rounded-2xl border border-[#232B3C] p-8">
            <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Service Bookings Found</h3>
            <p className="text-xs text-gray-400 mb-6">
              You haven't reserved any garage appointments yet.
            </p>
            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider"
            >
              Book Your First Service
            </button>
          </div>
        )}

        {/* Bookings List */}
        <div className="grid grid-cols-1 gap-6">
          {bookingsList.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/40 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#E5A93C]">
                    {booking.invoiceNumber}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    Paid: <strong className="text-white">${booking.totalAmount} USD</strong>
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-white">
                  {booking.service?.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.plateNumber})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {booking.workshop?.city} Superhub
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {booking.appointmentDate} at {booking.timeSlot}
                  </span>
                </div>
              </div>

              {/* PDF Download Button */}
              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => generateBookingInvoicePDF(booking)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-[#2B3549] text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-[#E5A93C]" />
                  <span>Download Tax Invoice (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

