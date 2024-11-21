import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import usersReducer from "../features/usersSlice";
import creatorsReducer from "../features/creatorsSlice";
import eventsReducer from "../features/eventsSlice";
import eventCategoriesReducer from "../features/eventCategorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    creators: creatorsReducer,
    events: eventsReducer,
    eventCategories: eventCategoriesReducer,
  },
});
