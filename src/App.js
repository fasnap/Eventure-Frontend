import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./tailwind.css";
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

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/user/login" element={<UserLoginPage />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Landing />} />

            <Route path="/attendee/login" element={<AttendeeLogin />} />
            <Route path="/attendee/register" element={<AttendeeRegister />} />
            <Route path="/attendee/profile" element={<AttendeeProfilePage />} />
            <Route path="/attendee/home/events" element={<AllEvents />} />
            <Route path="/attendee/events/:id" element={<EventDetail />} />

            <Route path="/creator/login" element={<CreatorLogin />} />
            <Route path="/creator/register" element={<CreatorRegister />} />
            <Route path="/creator/profile" element={<CreatorProfile />} />
            <Route path="/creator/profile/setup" element={<AccountSetup />} />
            <Route path="/creator/event/type" element={<EventType />} />
            <Route
              path="/creator/event/offline/create"
              element={<CreateOfflineEvent />}
            />
            <Route path="/creator/events" element={<CreatorEvents />} />

            <Route path="/admin/login" element={<AdminLogin />} />
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

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
