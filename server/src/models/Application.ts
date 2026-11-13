import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  currentRole: string;
  yearsOfExperience: number;
  certifications: string;
  portfolioOrLinkedIn?: string;
  coverLetter?: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'offered' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    currentRole: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    certifications: {
      type: String,
      default: 'ASE / OEM / Brand Certified',
    },
    portfolioOrLinkedIn: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'interview_scheduled', 'offered', 'rejected'],
      default: 'applied',
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);

