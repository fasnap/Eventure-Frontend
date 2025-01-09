import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./tailwind.css";
import "./App.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import AttendeeProfilePage from "./pages/attendees/AttendeeProfilePage";
import UserLoginPage from "./pages/UserLoginPage";
import AttendeeRegister from "./components/auth/AttendeeRegister";
import CreatorRegister from "./components/auth/CreatorRegister";
import CreatorProfile from "./components/creator/CreatorProfile";
import AdminLogin from "./components/auth/AdminLogin";
import PageNotFound from "./components/PageNotFound";
import AccountSetup from "./components/creator/AccountSetup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ApprovedCreators from "./components/admin/ApprovedCreators";
import AdminDashboard from "./components/admin/AdminDashboard";
import CreatorAccountSetupRequestList from "./components/admin/CreatorAccountSetupRequestList";
import UsersList from "./components/admin/UsersList";
import AllEvents from "./components/attendee/AllEvents";
import EventType from "./components/creator/EventType";
import CreateOfflineEvent from "./components/creator/CreateOfflineEvent";
import AdminEventList from "./components/admin/AdminEventList";
import CreatorEvents from "./components/creator/CreatorEvents";
import AttendeeLogin from "./components/auth/AttendeeLogin";
import CreatorLogin from "./components/auth/CreatorLogin";
import EventDetail from "./components/attendee/EventDetail";
import Landing from "./components/attendee/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisteredEvents from "./components/attendee/RegisteredEvents";
import Chat from "./components/chat/Chat";
import CreateOnlineEvent from "./components/creator/CreateOnlineEvent";
import PaymentPage from "./components/attendee/PaymentPage";
import PaymentSuccessPage from "./components/attendee/PaymentSuccessPage";
import CreatorDashboard from "./components/creator/CreatorDashboard";
import PaymentFailurePage from "./components/attendee/PaymentFailurePage";
import AttendedUsers from "./components/event/AttendedUsers";
import RegisteredUsers from "./components/event/RegisteredUsers";
import AttendeeProfile from "./components/attendee/AttendeeProfile";
import AttendedEvents from "./components/attendee/AttendedEvents";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/user/login" element={<UserLoginPage />} />
            <Route path="" element={<Landing />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route path="/attendee/login" element={<AttendeeLogin />} />
            <Route path="/attendee/register" element={<AttendeeRegister />} />

            <Route element={<ProtectedRoute alllowedType={["attendee"]} />}>
              <Route path="/attendee/profile" element={<AttendeeProfile />} />
              <Route path="/attendee/home/events" element={<AllEvents />} />
              <Route path="/attendee/events/:id" element={<EventDetail />} />
              <Route
                path="/attendee/registered_events"
                element={<RegisteredEvents />}
              />
              <Route path="/attended/events" element={<AttendedEvents />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-failure" element={<PaymentFailurePage />} />
            </Route>

            <Route path="/creator/login" element={<CreatorLogin />} />
            <Route path="/creator/register" element={<CreatorRegister />} />

            <Route element={<ProtectedRoute alllowedType={["creator"]} />}>
              <Route path="/creator/profile" element={<CreatorProfile />} />
              <Route path="/creator/profile/setup" element={<AccountSetup />} />
              <Route path="/creator/event/type" element={<EventType />} />
              <Route
                path="/creator/event/offline/create"
                element={<CreateOfflineEvent />}
              />
              <Route
                path="/creator/event/online/create"
                element={<CreateOnlineEvent />}
              />
              <Route path="/creator/events" element={<CreatorEvents />} />
              <Route path="/creator/dashboard" element={<CreatorDashboard />} />
              <Route
                path="/event/attended-users/:eventId"
                element={<AttendedUsers />}
              />
              <Route
                path="/event/registered-users/:eventId"
                element={<RegisteredUsers />}
              />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute alllowedType={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route
                path="/admin/creators"
                element={<CreatorAccountSetupRequestList />}
              />
              <Route
                path="/admin/approved-creators"
                element={<ApprovedCreators />}
              />
              <Route path="/admin/events" element={<AdminEventList />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />

            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
