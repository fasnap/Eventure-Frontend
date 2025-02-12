import React, { useState } from "react";
import { setupCreatorAccount } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import { useSelector } from "react-redux";

function AccountSetup() {
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: "",
    organisation_name: "",
    organisation_address: "",
    document_copy: null,
    profile_picture: null,
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.first_name.trim()) {
      formErrors.first_name = "First name is required";
    } else if (formData.first_name.trim().length < 4) {
      formErrors.first_name = "First name must contain at least 4 letters";
    }
    if (!formData.last_name.trim()) {
      formErrors.last_name = "Last name is required";
    }
    if (!formData.phone_number.trim()) {
      formErrors.phone_number = "Phone number is required";
    }
    if (!formData.organisation_name.trim()) {
      formErrors.organisation_name = "Organization name is required";
    } else if (formData.organisation_name.trim().length < 4) {
      formErrors.organisation_name =
        "Organization name must contain at least 4 letters";
    }
    if (!formData.organisation_address.trim()) {
      formErrors.organisation_address = "Organization address is required";
    }
    if (!formData.document_copy) {
      formErrors.document_copy = "Document copy is required";
    }
    if (!formData.profile_picture) {
      formErrors.profile_picture = "Profile picture is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    try {
      console.log("submit button clicked", data);
      await setupCreatorAccount(data);
      navigate("/creator/profile");
    } catch (error) {
      console.log("cat block", error);
      alert("Account setup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Complete Your Account Setup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Personal Information
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.first_name && (
                <p className="text-red-600 text-sm">{errors.first_name}</p>
              )}

              <input
                type="text"
                name="last_name"
                onChange={handleChange}
                value={formData.last_name}
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.last_name && (
                <p className="text-red-600 text-sm">{errors.last_name}</p>
              )}

              <input
                type="email"
                name="email"
                value={user.email}
                placeholder="Email"
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Organization Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Organization Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.phone_number && (
                <p className="text-red-600 text-sm">{errors.phone_number}</p>
              )}

              <input
                type="text"
                name="organisation_name"
                placeholder="Organization Name"
                value={formData.organisation_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.organisation_name && (
                <p className="text-red-600 text-sm">
                  {errors.organisation_name}
                </p>
              )}

              <textarea
                name="organisation_address"
                placeholder="Organization Address"
                value={formData.organisation_address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
              {errors.organisation_address && (
                <p className="text-red-600 text-sm">
                  {errors.organisation_address}
                </p>
              )}
            </div>
          </div>

          {/* Upload Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Upload Documents
            </h3>
            <div className="space-y-4">
              <input
                type="file"
                name="document_copy"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.document_copy && (
                <p className="text-red-600 text-sm">{errors.document_copy}</p>
              )}
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Upload Profile Picture
              </h3>
              <input
                type="file"
                name="profile_picture"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.profile_picture && (
                <p className="text-red-600 text-sm">{errors.profile_picture}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Submit for Admin Approval
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountSetup;
