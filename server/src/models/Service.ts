import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: 'maintenance' | 'repairs' | 'diagnostics' | 'detailing' | 'tires';
  price: number;
  durationHours: number;
  iconName: string;
  image: string;
  features: string[];
  isPopular: boolean;
  warrantyMonths: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [100, 'Service name too long'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: [200, 'Short description too long'],
    },
    fullDescription: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['maintenance', 'repairs', 'diagnostics', 'detailing', 'tires'],
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    durationHours: {
      type: Number,
      default: 2,
    },
    iconName: {
      type: String,
      default: 'Wrench',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    },
    features: {
      type: [String],
      default: [],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    warrantyMonths: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);

