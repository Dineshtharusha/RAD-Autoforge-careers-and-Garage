import { Request, Response } from 'express';
import { Job } from '../models/Job';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, location } = req.query;
    let query: any = { isOpen: true };

    if (department && department !== 'all') {
      query.department = department;
    }
    if (location && location !== 'all') {
      query.location = { $regex: location as string, $options: 'i' };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job posting not found' });
      return;
    }
    res.json({ success: true, data: job });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job posting
// @route   POST /api/jobs
// @access  Private/Admin
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, message: 'Job posting created successfully', data: job });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private/Admin
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }
    res.json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

