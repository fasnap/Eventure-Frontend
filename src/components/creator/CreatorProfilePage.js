import React from "react";
import Header from "../shared/Header";
import CreatorSidebar from "../shared/creator/CreatorSidebar";

function CreatorProfilePage({ creatorProfile }) {
  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <div className="flex-1 pt-4 pl-2">
          <h1 className="mb-8 text-3xl ml-4 font-bold text-gray-900">
            Account Details
          </h1>
          <div className="p-8 bg-white mx-4 my-4 rounded-sm shadow-sm">
            {/* Account Details Header */}
            <div className="flex items-center justify-between mb-10">
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

            <div className="mb-8">
              {creatorProfile.is_verified ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold">
                    Your account is verified!
                  </h2>
                  <p className="mt-2">
                    You are now authorized to create and manage events. Go ahead
                    and start creating your events!
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold">
                    Account Pending Verification
                  </h2>
                  <p className="mt-2">
                    Your account has been sent for verification. Once it's
                    approved by the admin, you'll be able to create events.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* section3 */}
          <div className="p-8 bg-white mx-4 my-8 rounded-sm shadow-sm">
            <div className="mb-8 rounded-lg">
              <h3 className="text-lg font-bold mb-6 p-4 bg-blue-100 rounded text-gray-700">
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          {/* section2 */}
          <div className="p-8 bg-white mx-4 my-4 rounded-sm shadow-sm">
            {/* Organization Details Section */}
            <div className="mb-8 rounded-lg">
              <h3 className="text-lg font-bold mb-6 p-4 bg-blue-100 rounded text-gray-700">
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
                    disabled
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
                    disabled
                  />
                </div>
                {creatorProfile.document_copy ? (
                  <div className="mt-4">
                    <a
                      href={creatorProfile.document_copy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition duration-200 ease-in-out"
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
      </div>
    </div>
  );
}

export default CreatorProfilePage;
