import React, { useState } from "react";
import { setupCreatorAccount } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import { useSelector } from "react-redux";

function AccountSetup() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    phone_number: "",
    organisation_name: "",
    organisation_address: "",
    document_copy: null,
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
      await setupCreatorAccount(data);

      navigate("/creator/profile");
    } catch (error) {
      console.log(error);
      alert("Account setup failed");
    }
  };

  return (
    <div>
      <Header />
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-lg mx-auto p-4 bg-white shadow-md rounded"
      >
        <h2 className="text-xl font-semibold mb-4">
          Complete Your Account Setup
        </h2>
        {/* Firstname, Lastname, Email (Read-only) */}
        <div className="space-y-2">
          <input
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            placeholder="First Name"
            className="w-full p-2 border rounded "
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Editable fields */}
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
        />
        {errors.organisation_name && (
          <p className="text-red-600 text-sm">{errors.organisation_name}</p>
        )}
        <textarea
          name="organisation_address"
          placeholder="Organization Address"
          value={formData.organisation_address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        {errors.organisation_address && (
          <p className="text-red-600 text-sm">{errors.organisation_address}</p>
        )}
        <input
          type="file"
          name="document_copy"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.document_copy && (
          <p className="text-red-600 text-sm">{errors.document_copy}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit for Admin Approval
        </button>
      </form>
    </div>
  );
}

export default AccountSetup;
