import mongoose, { Document, Schema } from 'mongoose';

export interface ICarrierRequest extends Document {
  user?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  destinationWorkshop: {
    workshopId?: mongoose.Types.ObjectId;
    name: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    phone: string;
  };
  carrierType: 'flatbed' | 'wheel_lift' | 'ev_heavy';
  vehicle: {
    make: string;
    model: string;
    year?: number;
    plateNumber: string;
    breakdownReason: string;
    imageUrl?: string;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
    truckPlate: string;
    truckModel: string;
    rating: number;
    avatar: string;
  };
  status: 'dispatched' | 'en_route' | 'arrived' | 'towing' | 'completed' | 'cancelled';
  currentLocation: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  estimatedArrivalMinutes: number;
  estimatedCost: number;
  paymentStatus: 'pending' | 'completed' | 'cash_on_delivery';
  trackingCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const CarrierRequestSchema = new Schema<ICarrierRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
    },
    pickupLocation: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destinationWorkshop: {
      workshopId: { type: Schema.Types.ObjectId, ref: 'Workshop' },
      name: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      phone: { type: String, required: true },
    },
    carrierType: {
      type: String,
      enum: ['flatbed', 'wheel_lift', 'ev_heavy'],
      default: 'flatbed',
    },
    vehicle: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number },
      plateNumber: { type: String, required: true },
      breakdownReason: { type: String, required: true },
      imageUrl: { type: String },
    },
    driver: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      truckPlate: { type: String, required: true },
      truckModel: { type: String, required: true },
      rating: { type: Number, default: 4.9 },
      avatar: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['dispatched', 'en_route', 'arrived', 'towing', 'completed', 'cancelled'],
      default: 'dispatched',
    },
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    distanceKm: {
      type: Number,
      required: true,
    },
    estimatedArrivalMinutes: {
      type: Number,
      required: true,
    },
    estimatedCost: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'cash_on_delivery'],
      default: 'pending',
    },
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CarrierRequest = mongoose.model<ICarrierRequest>('CarrierRequest', CarrierRequestSchema);
