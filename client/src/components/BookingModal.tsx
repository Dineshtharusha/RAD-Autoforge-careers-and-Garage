import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addBooking, setBookingLoading } from '../redux/slices/bookingSlice';
import { api, mockServices, mockWorkshops } from '../services/api';
import { Service, Workshop } from '../types';
import { generateBookingInvoicePDF } from '../utils/pdfGenerator';
import { uploadFileToSupabase } from '../services/supabaseClient';
import {
  X,
  Calendar,
  Clock,
  Car,
  MapPin,
  CheckCircle2,
  FileDown,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Camera,
  Cloud,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServicePreset?: Service | null;
  selectedWorkshopPreset?: Workshop | null;
  onOpenAuth: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedServicePreset,
  selectedWorkshopPreset,
  onOpenAuth,
}) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { services } = useSelector((state: RootState) => state.service);
  const { workshops } = useSelector((state: RootState) => state.workshop);

  const availableServices = services.length > 0 ? services : mockServices;
  const availableWorkshops = workshops.length > 0 ? workshops : mockWorkshops;

  // Selected Service & Workshop
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    selectedServicePreset?._id || availableServices[0]?._id || ''
  );
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(
    selectedWorkshopPreset?._id || availableWorkshops[0]?._id || ''
  );

  // Form Fields
  const [vehicleMake, setVehicleMake] = useState('BMW');
  const [vehicleModel, setVehicleModel] = useState('M4 Competition');
  const [vehicleYear, setVehicleYear] = useState('2024');
  const [plateNumber, setPlateNumber] = useState('KA-01-AF-9921');
  const [mileage, setMileage] = useState('14500');
  const [appointmentDate, setAppointmentDate] = useState('2026-11-20');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingPhoto(true);
      setPhotoName(file.name);
      const { url, error } = await uploadFileToSupabase(file, 'grage', 'vehicle-photos');
      setUploadingPhoto(false);
      if (!error && url) {
        setPhotoUrl(url);
      }
    }
  };

  // States
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentService = availableServices.find((s) => s._id === selectedServiceId) || availableServices[0];
  const currentWorkshop = availableWorkshops.find((w) => w._id === selectedWorkshopId) || availableWorkshops[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    setLoading(true);
    dispatch(setBookingLoading(true));

    const payload = {
      serviceId: selectedServiceId || currentService._id,
      workshopId: selectedWorkshopId || currentWorkshop._id,
      vehicle: {
        make: vehicleMake,
        model: vehicleModel,
        year: Number(vehicleYear) || 2024,
        plateNumber,
        mileage: Number(mileage) || undefined,
      },
      appointmentDate,
      timeSlot,
      notes: photoUrl ? `${notes ? notes + ' | ' : ''}Attached Photo: ${photoUrl}` : notes,
    };

    try {
      const response = await api.post('/bookings', payload).catch(() => {
        // Fallback demo booking if server not active
        const demoInvoice = `AF-INV-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
        return {
          data: {
            success: true,
            data: {
              _id: `book-${Date.now()}`,
              user: user,
              service: currentService,
              workshop: currentWorkshop,
              vehicle: payload.vehicle,
              appointmentDate,
              timeSlot,
              status: 'confirmed',
              totalAmount: currentService.price,
              paymentStatus: 'completed',
              notes,
              invoiceNumber: demoInvoice,
              createdAt: new Date().toISOString(),
            },
          },
        };
      });

      if (response.data && response.data.success) {
        const bookingData = response.data.data;
        dispatch(addBooking(bookingData));
        setConfirmedBooking(bookingData);
      } else {
        setErrorMessage(response.data?.message || 'Failed to complete booking.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with booking server.');
    } finally {
      setLoading(false);
      dispatch(setBookingLoading(false));
    }
  };

  const timeSlots = [
    '08:30 AM',
    '10:00 AM',
    '11:30 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#0F141F] border border-[#232B3C] shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Screen */}
        {confirmedBooking ? (
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E5A93C]/10 border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] shadow-gold">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5A93C] font-bold">
                Appointment Confirmed
              </span>
              <h2 className="text-2xl font-bold font-serif text-white mt-1">
                Your Service Bay is Reserved!
              </h2>
              <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
                Invoice Number: <span className="font-mono text-amber-300 font-semibold">{confirmedBooking.invoiceNumber}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141A26] border border-[#232B3C] text-left text-xs space-y-2 max-w-lg mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-400">Service:</span>
                <span className="font-semibold text-white">{confirmedBooking.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="font-semibold text-white">{confirmedBooking.workshop?.name} ({confirmedBooking.workshop?.city})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle:</span>
                <span className="font-semibold text-white">{confirmedBooking.vehicle?.year} {confirmedBooking.vehicle?.make} {confirmedBooking.vehicle?.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Appointment Slot:</span>
                <span className="font-semibold text-amber-300">{confirmedBooking.appointmentDate} at {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1E2638]">
                <span className="text-gray-400">Total Investment:</span>
                <span className="font-bold text-[#E5A93C] text-sm">${confirmedBooking.totalAmount} USD</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={() => generateBookingInvoicePDF(confirmedBooking)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#F0BA51] to-[#E5A93C] text-[#0A0D13] font-bold text-xs tracking-wider uppercase shadow-gold hover:opacity-90 transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Official Tax Invoice (PDF)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white tracking-wider uppercase transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="flex items-center gap-2 mb-1 text-[#E5A93C]">
              <Calendar className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-widest">
                Reserve Service Bay
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-white mb-2">
              Book a Workshop Service
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Precision technicians, factory-grade diagnostic scanners, and 12-month guaranteed warranty.
            </p>

            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!isAuthenticated && (
              <div className="mb-5 p-3 rounded-lg bg-amber-950/30 border border-amber-600/40 flex items-center justify-between">
                <span className="text-xs text-amber-200">
                  Please sign in or create an account to record your appointment history.
                </span>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1 text-xs font-bold bg-[#E5A93C] text-[#0A0D13] rounded uppercase hover:bg-amber-400"
                >
                  Sign In
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Select Service
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-[#151B27] border border-[#2B3549] focus:border-[#E5A93C] text-sm text-white rounded-lg p-2.5 outline-none"
                  >
                    {availableServices.map((srv) => (
                      <option key={srv._id} value={srv._id}>
                        {srv.name} (${srv.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Select Workshop Hub
                  </label>
                  <select
                    value={selectedWorkshopId}
                    onChange={(e) => setSelectedWorkshopId(e.target.value)}
                    className="w-full bg-[#151B27] border border-[#2B3549] focus:border-[#E5A93C] text-sm text-white rounded-lg p-2.5 outline-none"
                  >
                    {availableWorkshops.map((wks) => (
                      <option key={wks._id} value={wks._id}>
                        {wks.city} - {wks.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="p-4 rounded-xl bg-[#141A26] border border-[#232B3C] space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-[#E5A93C] font-bold flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" /> Vehicle Specification
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Make</label>
                    <input
                      type="text"
                      required
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      placeholder="BMW"
                      className="w-full bg-[#1A2232] border border-[#2B3549] focus:border-[#E5A93C] text-xs text-white rounded p-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Model</label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="M3 / 911"
                      className="w-full bg-[#1A2232] border border-[#2B3549] focus:border-[#E5A93C] text-xs text-white rounded p-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Year</label>
                    <input
                      type="number"
                      required
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      placeholder="2024"
                      className="w-full bg-[#1A2232] border border-[#2B3549] focus:border-[#E5A93C] text-xs text-white rounded p-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Plate Number</label>
                    <input
                      type="text"
                      required
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="KA-01-AF-9921"
                      className="w-full bg-[#1A2232] border border-[#2B3549] focus:border-[#E5A93C] text-xs text-white rounded p-2 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-[#151B27] border border-[#2B3549] focus:border-[#E5A93C] text-sm text-white rounded-lg p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2 px-1 text-center text-xs font-semibold rounded border transition-colors ${
                          timeSlot === slot
                            ? 'bg-[#E5A93C] text-[#0A0D13] border-[#E5A93C]'
                            : 'bg-[#151B27] text-gray-300 border-[#2B3549] hover:border-gray-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Supabase Vehicle Photo Upload */}
              <div className="p-3 rounded-xl bg-[#141A26] border border-[#232B3C] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-gray-300 uppercase flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Attach Vehicle/Dashboard Photo (Optional)</span>
                  </label>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> Supabase Storage
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A2232] hover:bg-[#202A3C] border border-[#2B3549] text-xs text-gray-200 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>{uploadingPhoto ? 'Uploading to Supabase...' : 'Select Photo...'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>

                  {photoName && (
                    <span className="text-xs text-emerald-400 truncate max-w-[200px]">
                      ✓ {photoName}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Specific Requests or Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Please perform brake fluid boiling point test as well..."
                  className="w-full bg-[#151B27] border border-[#2B3549] focus:border-[#E5A93C] text-xs text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              {/* Total & Submit Button */}
              <div className="pt-3 border-t border-[#232B3C] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Estimated Service Total</span>
                  <span className="text-xl font-bold text-[#E5A93C]">${currentService?.price || 149} USD</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-r from-[#F0BA51] to-[#E5A93C] text-[#0A0D13] font-bold text-xs tracking-wider uppercase shadow-gold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>CONFIRM & BOOK BAY</span>
                      <Calendar className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

