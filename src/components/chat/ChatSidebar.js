import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatGroups } from "../../api/chatApi";
import { setSelectedGroup } from "../../features/chatSlice";

const ChatSidebar = () => {
  const chatGroups = useSelector((state) => state.chat.groups);

  const dispatch = useDispatch();
  const [selectedGroup, setSelectedGroupState] = useState(null);

  useEffect(() => {
    dispatch(fetchChatGroups());
  }, [dispatch]);

  const handleGroupClick = (group) => {
    dispatch(setSelectedGroup(group));
    setSelectedGroupState(group);
  };

  return (
    <div className="p-4 h-full bg-gray-100 overflow-y-auto">
      <h3 className="text-2xl font-bold mb-4">Chat Groups</h3>
      <ul className="space-y-2">
        {chatGroups.map((group) => (
          <li
            key={group.id}
            onClick={() => handleGroupClick(group)}
            className={`p-3 rounded-lg cursor-pointer transition duration-200 ${
              selectedGroup?.id === group.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
