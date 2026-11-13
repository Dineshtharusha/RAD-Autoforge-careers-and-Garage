import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: 'Technician' | 'Diagnostics' | 'Performance & Tuning' | 'Body & Detailing' | 'Workshop Management';
  location: string;
  type: 'Full-time' | 'Contract' | 'Apprenticeship';
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Master' | 'Specialist';
  salaryRange: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      enum: ['Technician', 'Diagnostics', 'Performance & Tuning', 'Body & Detailing', 'Workshop Management'],
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Contract', 'Apprenticeship'],
      default: 'Full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Master', 'Specialist'],
      required: true,
    },
    salaryRange: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: ['Competitive Salary & Performance Bonuses', 'Continuous Factory Certification Training', 'Full Health & Tool Insurance', 'Relocation Assistance for Global Hubs'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);

