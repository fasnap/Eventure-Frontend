// src/redux/slices/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createRazorpayOrder } from "../api/event";

const initialState = {
  paymentData: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
