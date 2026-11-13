import { Response } from 'express';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { Workshop } from '../models/Workshop';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalWorkshops = await Workshop.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const bookings = await Booking.find();
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const bookingStatusCounts = {
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      inProgress: bookings.filter((b) => b.status === 'in-progress').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name price')
      .populate('workshop', 'name city')
      .sort({ createdAt: -1 })
      .limit(6);

    const recentApplications = await Application.find()
      .populate('job', 'title department')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalBookings,
          totalServices,
          totalWorkshops,
          totalJobs,
          totalApplications,
          totalUsers,
        },
        bookingStatusCounts,
        recentBookings,
        recentApplications,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

