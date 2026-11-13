import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkshop extends Document {
  name: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  baysCount: number;
  techniciansCount: number;
  specialization: string;
  image: string;
  rating: number;
  operatingHours: string;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkshopSchema = new Schema<IWorkshop>(
  {
    name: {
      type: String,
      required: [true, 'Workshop name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    baysCount: {
      type: Number,
      required: true,
      min: 1,
    },
    techniciansCount: {
      type: Number,
      required: true,
      min: 1,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=800&q=80',
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    operatingHours: {
      type: String,
      default: 'Mon - Sat: 8:00 AM - 7:00 PM',
    },
    amenities: {
      type: [String],
      default: ['Customer Lounge', 'WiFi', 'Beverage Bar', 'EV Fast Charging'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Workshop = mongoose.model<IWorkshop>('Workshop', WorkshopSchema);

