import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveEvent, fetchEvents, rejectEvent } from "../../api/admin";
import Layout from "../shared/admin/Layout";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Spinner from "../shared/Spinner";

function AdminEventList() {
  const { events, loading, error } = useSelector((state) => state.events);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userType = useSelector((state) => state.auth.user?.user_type);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [currentAction, setCurrentAction] = useState("");

  useEffect(() => {
    if (!accessToken || userType !== "admin") {
      navigate("/admin/login");
    } else {
      dispatch(fetchEvents({ accessToken }));
    }
  }, [dispatch, accessToken, navigate, userType]);
  const openModal = (action, eventId) => {
    setCurrentEventId(eventId);
    setCurrentAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEventId(null);
    setCurrentAction("");
  };

  const handleConfirm = async () => {
    try {
      if (currentAction === "approve") {
        await dispatch(
          approveEvent({ eventId: currentEventId, accessToken })
        ).unwrap();
      } else if (currentAction === "reject") {
        await dispatch(
          rejectEvent({ eventId: currentEventId, accessToken })
        ).unwrap();
      }
      await dispatch(fetchEvents({ accessToken })).unwrap();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col p-8">
          <h1 className="text-xl font-semibold mb-6">All Events List</h1>

          {error && <p>Error</p>}
          {events.length === 0 ? (
            ""
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 ">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Event Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Start Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      End Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ticket Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total Tickets
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={event.id}
                    >
                      <td className="px-6 py-4">{event.title}</td>
                      <td className="px-6 py-4">{event.event_type}</td>
                      <td className="px-6 py-4">{event.category}</td>

                      <td className="px-6 py-4">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{event.start_time}</td>
                      <td className="px-6 py-4">{event.end_time}</td>
                      <td className="px-6 py-4">{event.ticket_type}</td>
                      <td className="px-6 py-4">{event.price}</td>
                      <td className="px-6 py-4">{event.total_tickets}</td>

                      <td className="px-6 py-4">
                        {event.is_approved ? "Approved" : "Not Approved"}
                      </td>
                      <td class="px-6 py-4">
                        {event.is_approved ? (
                          <button
                            onClick={() => openModal("reject", event.id)}
                            className="ml-4 text-red-600 hover:underline"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal("approve", event.id)}
                            className="text-green-600 hover:underline"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Action"
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
          >
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Do you really want to {currentAction} this event?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                No
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}

export default AdminEventList;
