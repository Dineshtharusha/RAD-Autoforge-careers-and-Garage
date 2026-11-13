import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Service } from '../../types';

interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  activeCategory: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  selectedService: null,
  activeCategory: 'all',
  isLoading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setServices(state, action: PayloadAction<Service[]>) {
      state.services = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedService(state, action: PayloadAction<Service | null>) {
      state.selectedService = action.payload;
    },
    setActiveCategory(state, action: PayloadAction<string>) {
      state.activeCategory = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setServices,
  setSelectedService,
  setActiveCategory,
  setError,
} = serviceSlice.actions;

export default serviceSlice.reducer;

