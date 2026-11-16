import mongoose, { Document, Schema } from 'mongoose';

export interface ICarrierLorry extends Document {
  truckPlate: string;
  truckModel: string;
  carrierType: 'flatbed' | 'wheel_lift' | 'ev_heavy';
  assignedHub: 'Galle' | 'Hikkaduwa' | 'Ambalangoda';
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  rating: number;
  status: 'available' | 'on_call' | 'maintenance' | 'offline';
  completedRescues: number;
  maxTowingCapacityKg: number;
  equippedFeatures: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CarrierLorrySchema = new Schema<ICarrierLorry>(
  {
    truckPlate: {
      type: String,
      required: [true, 'Truck license plate is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    truckModel: {
      type: String,
      required: [true, 'Truck model is required'],
      trim: true,
    },
    carrierType: {
      type: String,
      enum: ['flatbed', 'wheel_lift', 'ev_heavy'],
      default: 'flatbed',
      required: true,
    },
    assignedHub: {
      type: String,
      enum: ['Galle', 'Hikkaduwa', 'Ambalangoda'],
      required: [true, 'Assigned garage hub is required'],
      index: true,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    driverPhone: {
      type: String,
      required: [true, 'Driver phone is required'],
      trim: true,
    },
    driverPhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    rating: {
      type: Number,
      default: 4.95,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['available', 'on_call', 'maintenance', 'offline'],
      default: 'available',
      index: true,
    },
    completedRescues: {
      type: Number,
      default: 0,
    },
    maxTowingCapacityKg: {
      type: Number,
      default: 3500,
    },
    equippedFeatures: {
      type: [String],
      default: ['Hydraulic Winch', 'Wheel Chocks', 'Safety Strobes', 'First Aid Kit'],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const CarrierLorry = mongoose.model<ICarrierLorry>('CarrierLorry', CarrierLorrySchema);
