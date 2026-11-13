import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Submit career application
// @route   POST /api/applications
// @access  Public / Authenticated
export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId, fullName, email, phone, currentRole, yearsOfExperience, certifications, portfolioOrLinkedIn, coverLetter } = req.body;

    if (!jobId || !fullName || !email || !phone || !currentRole) {
      res.status(400).json({ success: false, message: 'Please fill in all mandatory application fields.' });
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'The specified job position was not found.' });
      return;
    }

    const application = await Application.create({
      job: jobId,
      user: req.user ? req.user._id : undefined,
      fullName,
      email,
      phone,
      currentRole,
      yearsOfExperience: Number(yearsOfExperience) || 0,
      certifications,
      portfolioOrLinkedIn,
      coverLetter,
      status: 'applied',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our recruitment team will review your profile.',
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, jobId } = req.query;
    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (jobId && jobId !== 'all') {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('job', 'title department location type experienceLevel salaryRange')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    ).populate('job', 'title department');

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({ success: true, message: 'Application status updated', data: application });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

