import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workshop } from '../../types';

interface WorkshopState {
  workshops: Workshop[];
  selectedWorkshop: Workshop | null;
  selectedCity: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkshopState = {
  workshops: [],
  selectedWorkshop: null,
  selectedCity: 'All Locations',
  isLoading: false,
  error: null,
};

const workshopSlice = createSlice({
  name: 'workshop',
  initialState,
  reducers: {
    setWorkshops(state, action: PayloadAction<Workshop[]>) {
      state.workshops = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedWorkshop(state, action: PayloadAction<Workshop | null>) {
      state.selectedWorkshop = action.payload;
    },
    setSelectedCity(state, action: PayloadAction<string>) {
      state.selectedCity = action.payload;
    },
    setWorkshopLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setWorkshopError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setWorkshops,
  setSelectedWorkshop,
  setSelectedCity,
  setWorkshopLoading,
  setWorkshopError,
} = workshopSlice.actions;

export default workshopSlice.reducer;

