import { createSlice } from "@reduxjs/toolkit";
import { fetchNotifications, markAsViewed } from "../api/notification";

const initialState = {
  notifications: [],
};
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(markAsViewed.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(
          (notif) => notif.id === notificationId
        );
        if (notification) {
          notification.viewed = true; // Mark notification as viewed
        }
      });
  },
});

export const { addNotification, setNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
