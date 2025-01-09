import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsersError,
  fetchUsersStart,
  fetchUsersSuccess,
} from "../../features/usersSlice";
import { blockUnblockUser, getAllUsers } from "../../api/admin";
import Layout from "../shared/admin/Layout";
import Modal from "react-modal";
import Spinner from "../shared/Spinner";

function UsersList() {
  const { users, loading, error } = useSelector((state) => state.users);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userType = useSelector((state) => state.auth.user?.user_type);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentAction, setCurrentAction] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("desc");
  const [sortBy, setSortBy] = useState("created_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // New state for total pages

  useEffect(() => {
    if (!accessToken || userType !== "admin") {
      navigate("/admin/login");
    } else {
      const fetchUsers = async () => {
        dispatch(fetchUsersStart());
        try {
          const response = await getAllUsers(
            accessToken,
            search,
            filter,
            sort,
            sortBy,
            currentPage
          );
          const result = response.results;
          dispatch(fetchUsersSuccess(result));
          setTotalPages(Math.ceil(response.count / 10));
        } catch (err) {
          dispatch(fetchUsersError(err.message));
        }
      };
      fetchUsers();
    }
  }, [
    accessToken,
    userType,
    dispatch,
    navigate,
    search,
    filter,
    sort,
    sortBy,
    currentPage,
  ]);

  const openModal = (userId, action) => {
    setCurrentUserId(userId);
    setCurrentAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUserId(null);
    setCurrentAction("");
  };

  const handleConfirm = async () => {
    if (currentUserId !== null) {
      await handleBlockUnblock(currentUserId);
    }
    closeModal();
  };

  const handleBlockUnblock = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    try {
      await blockUnblockUser(userId, accessToken);

      dispatch(fetchUsersStart());
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, is_active: !u.is_active } : u
      );
      dispatch(fetchUsersSuccess(updatedUsers));
    } catch (error) {
      dispatch(fetchUsersError(error.message));
    }
  };

  const handleSortClick = (column) => {
    setSortBy(column);
    setSort((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page) => {
    dispatch(fetchUsersStart());
    setCurrentPage(page);
  };
  return (
    <Layout>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col p-8">
          <h1 className="text-xl font-semibold mb-6">All Users List</h1>

          <div className="flex items-center mb-4 space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All Users</option>
              <option value="attendee">Attendee</option>
              <option value="creator">Creator</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or email"
              className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {error && <p>Error</p>}
          {users.length === 0 ? (
            <Spinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 cursor-pointer flex items-center"
                      onClick={() => handleSortClick("username")}
                    >
                      Name
                      <span className="flex items-center ml-2 text-xl">
                        {/* Up arrow for ascending */}
                        <span
                          className={`${
                            sortBy === "username" && sort === "asc"
                              ? "text-blue-500"
                              : "text-gray-500"
                          } cursor-pointer`}
                        >
                          ↑
                        </span>
                        {/* Down arrow for descending */}
                        <span
                          className={`${
                            sortBy === "username" && sort === "desc"
                              ? "text-red-500"
                              : "text-gray-500"
                          } cursor-pointer `}
                        >
                          ↓
                        </span>
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 cursor-pointer flex items-center"
                      onClick={() => handleSortClick("created_at")}
                    >
                      Date
                      <span className="flex items-center ml-2 text-xl">
                        {/* Up arrow for ascending */}
                        <span
                          className={`${
                            sortBy === "created_at" && sort === "asc"
                              ? "text-blue-500"
                              : "text-gray-500"
                          } cursor-pointer`}
                        >
                          ↑
                        </span>
                        {/* Down arrow for descending */}
                        <span
                          className={`${
                            sortBy === "created_at" && sort === "desc"
                              ? "text-red-500"
                              : "text-gray-500"
                          } cursor-pointer `}
                        >
                          ↓
                        </span>
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
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
                  {users.map((user) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={user.id}
                    >
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{user.user_type}</td>
                      <td className="px-6 py-4">
                        {user.is_active ? "Active" : "Inactive"}
                      </td>
                      <td class="px-6 py-4">
                        {user.user_type !== "admin" && (
                          <button
                            onClick={() =>
                              openModal(
                                user.id,
                                user.is_active ? "Block" : "Unblock"
                              )
                            }
                            className="text-blue-600 hover:underline"
                          >
                            {user.is_active ? "Block" : "Unblock"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 flex justify-center">
            <button
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-1 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Action"
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
          >
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Do you really want to {currentAction} this creator?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}

export default UsersList;
