import { createSlice } from "@reduxjs/toolkit";
import { fetchCreatorProfile } from "../api/auth";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearProfileState(state) {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCreatorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCreatorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
