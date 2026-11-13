import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job, JobApplication } from '../../types';

interface JobState {
  jobs: Job[];
  applications: JobApplication[];
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
  applicationSuccess: boolean;
}

const initialState: JobState = {
  jobs: [],
  applications: [],
  selectedJob: null,
  isLoading: false,
  error: null,
  applicationSuccess: false,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobs(state, action: PayloadAction<Job[]>) {
      state.jobs = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setApplications(state, action: PayloadAction<JobApplication[]>) {
      state.applications = action.payload;
      state.isLoading = false;
    },
    setSelectedJob(state, action: PayloadAction<Job | null>) {
      state.selectedJob = action.payload;
    },
    setJobLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setJobError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    setApplicationSuccess(state, action: PayloadAction<boolean>) {
      state.applicationSuccess = action.payload;
    },
  },
});

export const {
  setJobs,
  setApplications,
  setSelectedJob,
  setJobLoading,
  setJobError,
  setApplicationSuccess,
} = jobSlice.actions;

export default jobSlice.reducer;

