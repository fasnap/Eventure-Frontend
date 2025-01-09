import React from "react";
import Layout from "../shared/user/Layout";
import offlineImage from "../../assets/images/oflline.png";
import onlineImage from "../../assets/images/online.png";
import { useNavigate } from "react-router-dom";
function EventType() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex items-center min-h-screen justify-center space-x-4">
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Card 1 */}
          <div className="max-w-lg h-96 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
            <div className="flex flex-col items-center">
              <img
                className="w-28 h-28 mb-4 mt-8 rounded-full shadow-lg"
                src={onlineImage}
                alt="Online Event"
              />
              <h5 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                Create an Online Event
              </h5>
              <div className="flex mt-4">
                <button
                  onClick={() => navigate("/creator/event/online/create")}
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                >
                  CREATE
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="max-w-lg h-96 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
            <div className="flex flex-col items-center">
              <img
                className="w-28 h-28 mb-4 mt-8 rounded-full shadow-lg"
                src={offlineImage}
                alt="Online Event"
              />
              <h5 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                Create an Offline Event
              </h5>
              <div className="flex mt-4">
                <button
                  onClick={() => navigate("/creator/event/offline/create")}
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                >
                  CREATE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EventType;
