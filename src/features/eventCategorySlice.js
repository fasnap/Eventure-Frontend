import { createSlice } from "@reduxjs/toolkit";
import { fetchEventCategories } from "../api/event";

const eventCategorySlice = createSlice({
  name: "eventCategories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; // Format categories as an array of [value, label]
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default eventCategorySlice.reducer;
