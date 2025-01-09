import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminDashboardData } from "../api/admin";

const dashboardSlice=createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(fetchAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
     .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
})

export default dashboardSlice.reducer;