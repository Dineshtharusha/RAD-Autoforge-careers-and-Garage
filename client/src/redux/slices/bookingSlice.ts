import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../../types';

interface BookingState {
  myBookings: Booking[];
  allBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  lastCreatedBooking: Booking | null;
}

const initialState: BookingState = {
  myBookings: [],
  allBookings: [],
  isLoading: false,
  error: null,
  lastCreatedBooking: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setMyBookings(state, action: PayloadAction<Booking[]>) {
      state.myBookings = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setAllBookings(state, action: PayloadAction<Booking[]>) {
      state.allBookings = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addBooking(state, action: PayloadAction<Booking>) {
      state.myBookings.unshift(action.payload);
      state.lastCreatedBooking = action.payload;
      state.isLoading = false;
    },
    setBookingLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setBookingError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setMyBookings,
  setAllBookings,
  addBooking,
  setBookingLoading,
  setBookingError,
} = bookingSlice.actions;

export default bookingSlice.reducer;

