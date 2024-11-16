import React from "react";
import Header from "../shared/Header";

function CreatorProfilePage({ creatorProfile }) {
  return (
    <div>
      <Header />
      <div className="p-8 shadow-md rounded-lg max-w-4xl mx-auto bg-white mt-8">
        {/* Account Details Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">
            Account Details
          </h1>
          <div className="flex items-center">
            
            <span
              className={`px-4 py-2 rounded-full text-white font-medium ${
                creatorProfile.is_verified ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {creatorProfile.is_verified ? "✔ Verified" : "Not Verified"}
            </span>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="mb-8 rounded-lg">
          <h3 className="text-lg font-bold mb-6 p-4 bg-gray-100 rounded text-gray-700">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={creatorProfile.first_name || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={creatorProfile.last_name || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={creatorProfile.email || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Mobile
              </label>
              <input
                type="text"
                value={creatorProfile.phone_number || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Organization Details Section */}
        <div className="rounded-lg">
          <h3 className="text-lg font-bold mb-6 p-4 bg-gray-100 rounded text-gray-700">
            Organization Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={creatorProfile.organisation_name || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                value={creatorProfile.organisation_address || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
            {creatorProfile.document_copy ? (
              <div className="mt-4">
                <a
                  href={creatorProfile.document_copy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out"
                >
                  View Document
                </a>
              </div>
            ) : (
              <p className="text-gray-600 mt-4">No Document Available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorProfilePage;
