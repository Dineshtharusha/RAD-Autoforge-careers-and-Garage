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
// @access  Public / Admin
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      shortDescription,
      fullDescription,
      category,
      price,
      durationHours,
      iconName,
      image,
      features,
      isPopular,
      warrantyMonths,
    } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({ success: false, message: 'Name, price, and category are required' });
      return;
    }

    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    const existing = await Service.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const service = await Service.create({
      name,
      slug,
      shortDescription: shortDescription || `${name} specialized maintenance and precision care by AutoForge master technicians.`,
      fullDescription: fullDescription || `${name} precision engineering procedure adhering strictly to factory specifications and OEM guidelines.`,
      category,
      price: Number(price),
      durationHours: Number(durationHours) || 2,
      iconName: iconName || 'Wrench',
      image: image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split(',').map((s: string) => s.trim()) : ['OEM certified parts', 'Computerized calibration', 'Quality guarantee']),
      isPopular: Boolean(isPopular),
      warrantyMonths: Number(warrantyMonths) || 12,
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

