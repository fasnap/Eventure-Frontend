import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  creators: [],
  loading: false,
  error: null,
};

const creatorsSlice = createSlice({
  name: "creators",
  initialState,
  reducers: {
    fetchCreatorsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCreatorsSuccess: (state, action) => {
      state.loading = false;
      state.creators = action.payload;
    },
    fetchCreatorsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    approveCreatorSuccess: (state, action) => {
      state.creators = state.creators.map((creator) =>
        creator.id === action.payload
          ? { ...creator, is_verified: true }
          : creator
      );
    },
    rejectCreatorSuccess: (state, action) => {
      state.creators = state.creators.filter(
        (creator) => creator.id!== action.payload
      );
    }
  },
});

export const { fetchCreatorsStart, fetchCreatorsSuccess, fetchCreatorsError , approveCreatorSuccess, rejectCreatorSuccess} =
  creatorsSlice.actions;

export default creatorsSlice.reducer;
