import { Response } from 'express';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new service booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serviceId, workshopId, vehicle, appointmentDate, timeSlot, notes } = req.body;

    if (!serviceId || !workshopId || !vehicle || !appointmentDate || !timeSlot) {
      res.status(400).json({ success: false, message: 'Please provide all required booking details.' });
      return;
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ success: false, message: 'Selected service does not exist.' });
      return;
    }

    // Generate readable invoice number
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `AF-INV-${Date.now().toString().slice(-4)}-${randomHex}`;

    const booking = await Booking.create({
      user: req.user!._id,
      service: serviceId,
      workshop: workshopId,
      vehicle,
      appointmentDate,
      timeSlot,
      status: 'confirmed',
      totalAmount: service.price,
      paymentStatus: 'completed',
      notes,
      invoiceNumber,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'name price durationHours iconName')
      .populate('workshop', 'name city address phone')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ user: req.user!._id })
      .populate('service', 'name price durationHours iconName image')
      .populate('workshop', 'name city address phone rating')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin/Technician)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, workshopId } = req.query;
    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (workshopId && workshopId !== 'all') {
      query.workshop = workshopId;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name price durationHours')
      .populate('workshop', 'name city address')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('service')
      .populate('workshop');

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Customer can only view their own booking unless admin
    if (req.user!.role !== 'admin' && booking.user._id.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('service')
      .populate('workshop');

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    res.json({ success: true, message: 'Booking status updated successfully', data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (req.user!.role !== 'admin' && booking.user.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      return;
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking has been cancelled', data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

