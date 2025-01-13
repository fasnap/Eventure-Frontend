import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import usersReducer from "../features/usersSlice";
import creatorsReducer from "../features/creatorsSlice";
import eventsReducer from "../features/eventsSlice";
import eventCategoriesReducer from "../features/eventCategorySlice";
import profileReducer from "../features/profileSlice";
import notificationsReducer from "../features/notificationsSlice";
import paymentReducer from "../features/paymentSlice";
import feedbackReducer from "../features/feedbackSlice";
import dashboardReducer from "../features/dashboardSlice";
import creatorReducer from "../features/creatorSlice";
import chatReducer from "../features/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    creators: creatorsReducer,
    events: eventsReducer,
    eventCategories: eventCategoriesReducer,
    profile: profileReducer,
    notifications: notificationsReducer,
    payment: paymentReducer,
    feedback: feedbackReducer,
    dashboard: dashboardReducer,
    creator: creatorReducer,
    chat: chatReducer,
  },
});
