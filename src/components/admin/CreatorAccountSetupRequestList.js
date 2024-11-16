import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCreators, approveCreator, rejectCreator } from "../../api/admin";
import {
  fetchCreatorsError,
  fetchCreatorsStart,
  fetchCreatorsSuccess,
  approveCreatorSuccess,
  rejectCreatorSuccess,
} from "../../features/creatorsSlice";
import Layout from "../shared/admin/Layout";
import Modal from "react-modal";

function CreatorAccountSetupRequestList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { creators, loading, error } = useSelector((state) => state.creators);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userType = useSelector((state) => state.auth.user?.user_type);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [currentCreatorId, setCurrentCreatorId] = useState(null);

  useEffect(() => {
    if (!accessToken || userType !== "admin") {
      navigate("/admin/login");
    } else {
      const fetchCreators = async () => {
        dispatch(fetchCreatorsStart());
        try {
          const result = await getAllCreators(accessToken);

          console.log(result);
          dispatch(fetchCreatorsSuccess(result));
        } catch (err) {
          dispatch(fetchCreatorsError(err.message));
        }
      };
      fetchCreators();
    }
  }, [accessToken, userType, dispatch, navigate]);

  const openModal = (action, creatorId) => {
    setCurrentAction(action);
    setCurrentCreatorId(creatorId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAction("");
    setCurrentCreatorId(null);
  };

  const handleConfirm = async () => {
    if (currentAction === "approve") {
      await approveCreator(currentCreatorId, accessToken);
      dispatch(approveCreatorSuccess(currentCreatorId));
      dispatch(
        fetchCreatorsSuccess(
          creators.filter((creator) => creator.id !== currentCreatorId)
        )
      );
    } else if (currentAction === "reject") {
      await rejectCreator(currentCreatorId, accessToken);
      dispatch(rejectCreatorSuccess(currentCreatorId));
    }
    closeModal();
  };

  return (
    <Layout>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <div className="p-4 overflow-auto">
            <h1 className="text-lg font-semibold mb-4">
              Creator Account Setup Requests
            </h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error</p>}
            {creators.length === 0 ? (
              <p>No Creators Request </p>
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
                    <th scopered="col" className="px-6 py-3">
                      Action
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
                      <td class="px-6 py-4">
                        <button
                          onClick={() => openModal("approve", creator.id)}
                          className="text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openModal("reject", creator.id)}
                          className="ml-4 text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Confirm Action"
              className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
              overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
            >
              <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
              <p className="mb-6">
                Do you really want to {currentAction} this creator?
              </p>
              <div className="flex justify-end">
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
      </div>
    </Layout>
  );
}

export default CreatorAccountSetupRequestList;
