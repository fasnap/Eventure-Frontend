import React, { useState, useEffect } from "react";
import Layout from "../shared/user/Layout";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, fetchEventCategories } from "../../api/event";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateOfflineEvent() {
  const [activeSection, setActiveSection] = useState("details");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector(
    (state) => state.eventCategories
  );
  const accessToken = useSelector((state) => state.auth.accessToken);
  const loggedInUser = useSelector((state) => state.auth.user);
  const [eventData, setEventData] = useState({
    title: "",
    category: "",
    date: "",
    start_time: "",
    end_time: "",
    description: "",
    venue: "",
    country: "",
    state: "",
    district: "",
    image: null,
    ticket_type: "",
    price: 0,
    total_tickets: 1,
    event_type: "offline",
  });
  const handleProceed = () => {
    setActiveSection("tickets");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 100 * 1024; // 200kb in bytes
    if (file) {
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please choose a JPEG or PNG file.");
        return;
      }
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds the maximum limit of 200 KB.");
      return;
    }
    setEventData((prevData) => ({ ...prevData, image: file }));
  };
  const handleCreateEvent = () => {
    const requiredFields = [
      "title",
      "category",
      "date",
      "start_time",
      "end_time",
      "description",
      "venue",
      "country",
      "state",
      "district",
      "image",
      "ticket_type",
      "total_tickets",
    ];
    const missingField = requiredFields.find((field) => {
      const value = eventData[field];
      return !value || (typeof value === "string" && value.trim() === "");
    });
    if (missingField) {
      toast.error(
        `Please fill in all required fields. Missing: ${missingField}`
      );
      return;
    }
    if (eventData.ticket_type === "paid" && !eventData.price) {
      toast.error("Please specify a ticket price for paid events.");
      return;
    }
    const selectedDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error("Please select a current event date.");
      return;
    }
    dispatch(createEvent({ eventData, accessToken }));
    toast.success("Event created successfully!");
    navigate("/creator/events");
  };

  useEffect(() => {
    dispatch(fetchEventCategories());
  }, [dispatch]);

  return (
    <Layout>
      <ToastContainer />
      <h1 className="mt-8 text-3xl font-semibold text-center">
        CREATE YOUR OFFLINE EVENT
      </h1>
      <div className="mt-4">
        <div className="flex space-x-4">
          {/* Section Nav */}
          <div
            onClick={() => setActiveSection("details")}
            className={`cursor-pointer px-6 py-2 text-xl ${
              activeSection === "details"
                ? "text-blue-500 border-b-2 border-blue-500 w-full" // Ensures underline is the full width
                : "text-gray-500 border-b-2 border-gray-300 w-full"
            }`}
          >
            Details
          </div>
          <div
            onClick={() => setActiveSection("tickets")}
            className={`cursor-pointer px-6 py-2 text-xl ${
              activeSection === "tickets"
                ? "text-blue-500 border-b-2 border-blue-500 w-full" // Ensures underline is the full width
                : "text-gray-500 border-b-2 border-gray-300 w-full"
            }`}
          >
            Tickets
          </div>
        </div>
        {/* Details Section */}
        {activeSection === "details" && (
          <div className="py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3">
              <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow sm:p-10">
                <div className="mx-auto">
                  <div className="flex items-center space-x-5">
                    <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                      <h2 className="leading-relaxed">Event Details</h2>
                      <p className="text-sm text-gray-500 font-normal leading-relaxed">
                        Enter the details of your event.
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div className="flex flex-col">
                        <label className="leading-loose">Event Title</label>
                        <input
                          name="title"
                          value={eventData.title}
                          onChange={handleChange}
                          type="text"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Event title"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="leading-loose">Event Category</label>
                        <select
                          name="category"
                          value={eventData.category}
                          onChange={handleChange}
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="flex flex-col">
                          <label className="leading-loose">Date</label>
                          <input
                            name="date"
                            value={eventData.date}
                            onChange={handleChange}
                            type="date"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="25/02/2020"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="leading-loose">Start Time</label>
                          <input
                            name="start_time"
                            value={eventData.start_time}
                            onChange={handleChange}
                            type="time"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="leading-loose">End Time</label>
                          <input
                            name="end_time"
                            value={eventData.end_time}
                            onChange={handleChange}
                            type="time"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="leading-loose">
                          Event Description
                        </label>
                        <textarea
                          name="description"
                          value={eventData.description}
                          onChange={handleChange}
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <label className="leading-loose">Venue</label>
                          <input
                            name="venue"
                            value={eventData.venue}
                            onChange={handleChange}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="leading-loose">Country</label>
                          <input
                            name="country"
                            value={eventData.country}
                            onChange={handleChange}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="leading-loose">State</label>
                          <input
                            name="state"
                            value={eventData.state}
                            onChange={handleChange}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="leading-loose">District</label>
                          <input
                            name="district"
                            value={eventData.district}
                            onChange={handleChange}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="leading-loose">Event Image</label>
                        <input
                          onChange={handleFileChange}
                          type="file"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          accept=".jpeg, .jpg, .png"
                        />
                        <p className="text-sm text-gray-500">
                          Image should be in JPEG, JPG, or PNG format and below
                          200kb.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center space-x-4">
                      <button
                        onClick={handleProceed}
                        className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                      >
                        Proceed to Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Tickets Section */}
        {activeSection === "tickets" && (
          <div className="py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3">
              <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow sm:p-10">
                <div className="mx-auto">
                  <div className="flex items-center space-x-5">
                    <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                      <h2 className="leading-relaxed">Ticket Details</h2>
                      <p className="text-sm text-gray-500 font-normal leading-relaxed">
                        Enter the ticket details for your event.
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div className="flex flex-col">
                        <label className="leading-loose">Ticket Type</label>
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="free"
                              name="ticket_type"
                              value="free"
                              onChange={handleChange}
                              className="focus:ring-blue-500 text-blue-600"
                            />
                            <label
                              htmlFor="free"
                              className="ml-2 text-gray-600"
                            >
                              Free
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="paid"
                              name="ticket_type"
                              value="paid"
                              onChange={handleChange}
                              className="focus:ring-blue-500 text-blue-600"
                            />
                            <label
                              htmlFor="paid"
                              className="ml-2 text-gray-600"
                            >
                              Paid
                            </label>
                          </div>
                        </div>
                      </div>
                      {eventData.ticket_type === "paid" && (
                        <div className="flex flex-col">
                          <label className="leading-loose">Ticket Price</label>
                          <input
                            type="number"
                            name="price"
                            value={eventData.price}
                            onChange={handleChange}
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Ticket price"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <label className="leading-loose">Ticket Quantity</label>
                        <input
                          type="number"
                          name="total_tickets"
                          value={eventData.total_tickets}
                          onChange={handleChange}
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Ticket quantity"
                        />
                      </div>
                    </div>
                    <div className="pt-4 flex items-center space-x-4">
                      <button
                        onClick={handleCreateEvent}
                        className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                      >
                        Create Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CreateOfflineEvent;