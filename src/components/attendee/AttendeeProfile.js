import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../api/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AttendeeProfile() {
  const [profile, setProfile] = useState({
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    birthday: "",
    address: "",
  });
  const [backupProfile, setBackupProfile] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false); // New state for edit mode

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate("/attendee/login");
        return;
      }
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/attendee/login");
        }
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleEditClick = () => {
    setBackupProfile(profile);
    setIsEditable(true); 
  };
  const handleSaveClick = async () => {
    try {
      await updateProfile(profile);
      setIsEditable(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 400) {
        toast.error("Invalid input. Please check your details.");
      } else {
        toast.error("Error updating profile");
      }
    }
  };
  const handleCancelClick = () => {
    setProfile(backupProfile); // Restore the backup profile data
    setIsEditable(false); // Disable edit mode
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div className="mt-3 max-w-3xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {/* Profile Header */}
      <div className="flex items-center p-6 bg-blue-100 rounded-lg mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hi, {user ? user.username : "guest"}
          </h1>
          <p className="text-gray-600">Welcome back to your profile!</p>
        </div>
      </div>

      {/* Account Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Account Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="text-gray-700 font-medium w-1/3">Email:</label>
            <input
              type="email"
              name="email"
              className="flex-1 border rounded p-2"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 font-medium w-1/3">
              Phone Number:
            </label>
            <input
              type="tel"
              name="phone_number"
              className="flex-1 border rounded p-2"
              value={profile.phone_number}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Personal Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="text-gray-700 font-medium w-1/3">
              First Name:
            </label>
            <input
              type="text"
              name="first_name"
              className="flex-1 border rounded p-2"
              value={profile.first_name}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 font-medium w-1/3">
              Last Name:
            </label>
            <input
              type="text"
              name="last_name"
              className="flex-1 border rounded p-2"
              value={profile.last_name}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 font-medium w-1/3">Birthday:</label>
            <input
              type="date"
              name="birthday"
              className="flex-1 border rounded p-2"
              value={profile.birthday}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 font-medium w-1/3">Address:</label>
            <input
              type="text"
              name="address"
              className="flex-1 border rounded p-2"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>
      {/* Edit/Save Button */}
      <div className="mt-6 text-right">
        {isEditable ? (
          <>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default AttendeeProfile;
