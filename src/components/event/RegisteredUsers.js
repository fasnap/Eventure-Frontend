import React, { useEffect } from "react";
import Header from "../shared/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredUsers } from "../../api/attendance";
import CreatorSidebar from "../shared/creator/CreatorSidebar";

function RegisteredUsers() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const { registeredUsers, loading, error } = useSelector(
    (state) => state.events
  );
  console.log("registeredUsers users", registeredUsers);
  useEffect(() => {
    if (eventId) {
      dispatch(fetchRegisteredUsers(eventId));
      console.log("registeredUsers users", registeredUsers);
    }
  }, [eventId, dispatch]);

  // Utility function to format date
  const formatDateTime = (isoString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Optional: Displays time in 12-hour format
    };
    return new Date(isoString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Event Registration Details
          </h1>

          {/* Event Statistics Section as Table */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Registration Time
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Payment
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Ticket Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {registeredUsers.length === 0 && <div>No Users Registered</div>}
                {registeredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2 text-gray-600">
                      {user.attendee_username}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {user.attendee_email}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatDateTime(user.created_at)}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                     {user.payment_status}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                     {user.ticket}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisteredUsers;
