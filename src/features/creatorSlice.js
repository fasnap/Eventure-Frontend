import { createSlice } from "@reduxjs/toolkit";
import { fetchCreatorProfile, fetchCreators } from "../api/creator";

const creatorSlice = createSlice({
  name: "creator",
  initialState: {
    creators: [],
    currentProfile: {},
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreators.fulfilled, (state, action) => {
        state.creators = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCreatorProfile.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
        state.status = "succeeded";
      });
  },
});
export default creatorSlice.reducer;
