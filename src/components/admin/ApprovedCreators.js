import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllApprovedCreators } from "../../api/admin";
import AdminHeader from "../shared/admin/AdminHeader";
import AdminSidebar from "../shared/admin/AdminSidebar";
import Layout from "../shared/admin/Layout";

function ApprovedCreators() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const userType = useSelector((state) => state.auth.user?.user_type);

  useEffect(() => {
    if (!accessToken || userType !== "admin") {
      navigate("/admin/login");
    } else {
      const fetchCreators = async () => {
        try {
          setLoading(true);
          const result = await getAllApprovedCreators(accessToken);
          setCreators(result);
          console.log("Fetched creators:", result);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCreators();
    }
  }, [accessToken, userType, navigate]);

  return (
    <Layout>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <div className="p-4 overflow-auto">
            <h1 className="text-lg font-semibold mb-4">
              Approved Creators List
            </h1>
            {loading ? (
              <p>Loading...</p>
            ) : creators.length === 0 ? (
              <p>No approved creators found</p>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      First Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Last Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Organisation Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Document
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((creator) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={creator.id}
                    >
                      <td className="px-6 py-4">{creator.id}</td>
                      <td className="px-6 py-4">{creator.email}</td>
                      <td className="px-6 py-4">{creator.first_name}</td>
                      <td className="px-6 py-4">{creator.last_name}</td>
                      <td className="px-6 py-4">{creator.phone_number}</td>
                      <td className="px-6 py-4">{creator.organisation_name}</td>
                      <td className="px-6 py-4">
                        {creator.organisation_address}
                      </td>
                      <td className="px-6 py-4">
                        {creator.document_copy ? (
                          <a
                            href={creator.document_copy}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                          >
                            View
                          </a>
                        ) : (
                          "No Document"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ApprovedCreators;
