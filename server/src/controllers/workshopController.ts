import { Request, Response } from 'express';
import { Workshop } from '../models/Workshop';

// @desc    Get all workshops
// @route   GET /api/workshops
// @access  Public
export const getAllWorkshops = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.query;
    let query: any = { isActive: true };

    if (city && city !== 'All Locations') {
      query.city = { $regex: city as string, $options: 'i' };
    }

    const workshops = await Workshop.find(query).sort({ rating: -1 });
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single workshop
// @route   GET /api/workshops/:id
// @access  Public
export const getWorkshopById = async (req: Request, res: Response): Promise<void> => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      res.status(404).json({ success: false, message: 'Workshop not found' });
      return;
    }
    res.json({ success: true, data: workshop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create workshop
// @route   POST /api/workshops
// @access  Private/Admin
export const createWorkshop = async (req: Request, res: Response): Promise<void> => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json({ success: true, message: 'Workshop created successfully', data: workshop });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update workshop
// @route   PUT /api/workshops/:id
// @access  Private/Admin
export const updateWorkshop = async (req: Request, res: Response): Promise<void> => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!workshop) {
      res.status(404).json({ success: false, message: 'Workshop not found' });
      return;
    }
    res.json({ success: true, message: 'Workshop updated successfully', data: workshop });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete workshop
// @route   DELETE /api/workshops/:id
// @access  Private/Admin
export const deleteWorkshop = async (req: Request, res: Response): Promise<void> => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) {
      res.status(404).json({ success: false, message: 'Workshop not found' });
      return;
    }
    res.json({ success: true, message: 'Workshop deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

