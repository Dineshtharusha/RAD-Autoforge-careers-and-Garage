import { Request, Response } from 'express';
import { Service } from '../models/Service';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { shortDescription: { $regex: search as string, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ isPopular: -1, createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service by slug or id
// @route   GET /api/services/:idOrSlug
// @access  Public
export const getServiceByIdOrSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
    let service = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(idOrSlug);
    }
    if (!service) {
      service = await Service.findOne({ slug: idOrSlug });
    }

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, shortDescription, fullDescription, category, price, durationHours, iconName, image, features, isPopular, warrantyMonths } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Service.findOne({ slug });
    if (existing) {
      res.status(400).json({ success: false, message: 'Service with similar name already exists' });
      return;
    }

    const service = await Service.create({
      name,
      slug,
      shortDescription,
      fullDescription,
      category,
      price,
      durationHours: durationHours || 2,
      iconName: iconName || 'Wrench',
      image,
      features: Array.isArray(features) ? features : [],
      isPopular: Boolean(isPopular),
      warrantyMonths: warrantyMonths || 12,
    });

    res.status(201).json({ success: true, message: 'Service created successfully', data: service });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    res.json({ success: true, message: 'Service updated successfully', data: service });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

