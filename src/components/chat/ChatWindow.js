// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMessages } from "../../api/chatApi";
// import { addMessage } from "../../features/chatSlice";
// import EmojiPicker from "emoji-picker-react";
// import { CHAT_BASE_URL } from "../../api/base";

// function ChatWindow() {
//   const selectedGroup = useSelector((state) => state.chat.selectedGroup);
//   const messages = useSelector((state) => state.chat.messages);
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();
//   const [newMessage, setNewMessage] = useState("");
//   const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null); // New state for upload error

//   const ws = useRef(null);
//   const messagesEndRef = useRef(null);
//   const username = user ? user.username : null;

//   useEffect(() => {
//     if (selectedGroup) {
//       setLoading(true);
//       dispatch(fetchMessages(selectedGroup.id)).finally(() =>
//         setLoading(false)
//       );

//       const accessToken = localStorage.getItem("accessToken");
//       ws.current = new WebSocket(
//         `ws://127.0.0.1:8000/ws/chat/${selectedGroup.id}/?token=${accessToken}`
//       );

//       ws.current.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log(data.file);
//         if (!messages.some((msg) => msg.id === data.id)) {
//           dispatch(
//             addMessage({
//               id: data.id,
//               sender: data.sender,
//               sender_username: data.sender_username,
//               content: data.message,
//               timestamp: data.timestamp,
//               file: data.file,
//             })
//           );
//         }
//       };
//       return () => {
//         ws.current?.close();
//         ws.current = null;
//       };
//     }
//   }, [dispatch, selectedGroup]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim() || file) {
//       if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         const messageData = { sender_username: username };
//         if (file) {
//           setUploading(true);
//           uploadFile(file)
//             .then((fileUrl) => {
//               messageData.file = fileUrl;
//               messageData.message = newMessage.trim();
//               ws.current.send(JSON.stringify(messageData));
//               setNewMessage("");
//               setFile(null);
//               setFilePreview(null);
//             })
//             .catch((err) => {
//               setUploadError("File upload failed. Please try again.");
//             })
//             .finally(() => setUploading(false));
//         } else {
//           messageData.message = newMessage.trim();
//           ws.current.send(JSON.stringify(messageData));
//           setNewMessage("");
//         }
//       } else {
//         console.error("WebSocket is not open.");
//       }
//     }
//   };

//   const uploadFile = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch(`${CHAT_BASE_URL}api/upload/`, {
//         method: "POST",
//         body: formData,
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("File upload failed");
//       }

//       const data = await response.json();
//       return data.fileUrl;
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       throw new Error("File upload failed");
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setFilePreview(URL.createObjectURL(selectedFile));
//       setUploadError(null); // Reset any previous upload errors
//     }
//   };

//   const handleDeleteFile = () => {
//     setFile(null);
//     setFilePreview(null);
//   };

//   const handleEmojiClick = (emoji) => {
//     setNewMessage(newMessage + emoji.emoji);
//     setEmojiPickerVisible(false);
//   };

//   const toggleEmojiPicker = () => {
//     setEmojiPickerVisible(!emojiPickerVisible);
//   };

//   if (!selectedGroup) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-50">
//         <p>Select a chat group to start chatting</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Chat Header */}
//       <div className="p-4 bg-blue-600 text-white shadow-md flex justify-between items-center">
//         <h3 className="text-xl font-bold">{selectedGroup.name}</h3>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 p-4 overflow-y-auto bg-white">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading messages...</p>
//         ) : messages.length > 0 ? (
//           messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`mb-4 p-3 rounded-lg max-w-xs break-words ${
//                 msg.sender_username === username
//                   ? "bg-blue-500 text-white ml-auto"
//                   : "bg-gray-200 text-black"
//               }`}
//             >
//               <div className="flex flex-col">
//                 <div className="flex items-baseline">
//                   <strong
//                     className={`mr-2 text-sm ${
//                       msg.sender_username === username
//                         ? "text-white"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     {msg.sender_username === username
//                       ? "You"
//                       : msg.sender_username}
//                   </strong>
//                   {msg.content && <p className="text-sm">{msg.content}</p>}
//                   {msg.file && (
//                     <div className="relative mt-2">
//                       {msg.file.endsWith(".jpg") ||
//                       msg.file.endsWith(".png") ||
//                       msg.sender_username === username ? (
//                         <img
//                           src={msg.file}
//                           alt="Uploaded media"
//                           className="max-w-full rounded-lg"
//                         />
//                       ) : (
//                         <a
//                           href={msg.file}
//                           download
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-black-500 hover:underline"
//                         >
//                           Download File
//                         </a>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <span className="text-xs text-gray-400 mt-1">
//                   {new Date(msg.timestamp).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No messages</p>
//         )}
//         <div ref={messagesEndRef}></div>
//       </div>

//       {/* Message Input */}
//       <div className="p-4 bg-gray-200 flex items-center border-t border-gray-300">
//         <button
//           onClick={toggleEmojiPicker}
//           className="ml-4 p-3 text-white rounded-lg hover:bg-yellow-600 transition"
//         >
//           😊
//         </button>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <div className="relative">
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="ml-4 p-1 hidden"
//             id="fileInput"
//           />
//           <label htmlFor="fileInput" className="cursor-pointer">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-gray-600 hover:text-blue-600"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M12 4v16M5 12l7 7 7-7" />
//             </svg>
//           </label>
//           {filePreview && (
//             <div className="absolute top-0 right-0 p-1 bg-white rounded-full">
//               {file.type.startsWith("image/") ? (
//                 <img
//                   src={filePreview}
//                   alt="Preview"
//                   className="w-8 h-8 object-cover rounded-full"
//                 />
//               ) : (
//                 <span className="text-sm text-gray-600">{file.name}</span>
//               )}
//               <button
//                 onClick={handleDeleteFile}
//                 className="absolute top-0 right-0 text-sm text-red-500"
//               >
//                 X
//               </button>
//             </div>
//           )}
//         </div>
//         <button
//           onClick={handleSendMessage}
//           className="ml-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           disabled={uploading}
//         >
//           {uploading ? "Uploading..." : "Send"}
//         </button>
//       </div>

//       {emojiPickerVisible && (
//         <div className="absolute bottom-16 left-4 z-10">
//           <EmojiPicker onEmojiClick={handleEmojiClick} />
//         </div>
//       )}

//       {uploadError && (
//         <div className="absolute bottom-24 left-4 z-10 bg-red-500 text-white p-2 rounded-lg">
//           {uploadError}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChatWindow;

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../api/chatApi";
import { addMessage } from "../../features/chatSlice";
import EmojiPicker from "emoji-picker-react";
import { CHAT_BASE_URL } from "../../api/base";

function ChatWindow() {
  const selectedGroup = useSelector((state) => state.chat.selectedGroup);
  const messages = useSelector((state) => state.chat.messages);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null); // New state for upload error

  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const username = user ? user.username : null;

  console.log("messages: ", messages);

  useEffect(() => {
    console.log("Fetched messages: ", messages);
  }, [messages]);

  useEffect(() => {
    if (selectedGroup) {
      setLoading(true);
      dispatch(fetchMessages(selectedGroup.id)).finally(() =>
        setLoading(false)
      );

      const accessToken = localStorage.getItem("accessToken");
      ws.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/${selectedGroup.id}/?token=${accessToken}`
      );

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("--------web socket message received: -----", data);
        if (!messages.some((msg) => msg.id === data.id)) {
          dispatch(addMessage(data));
        }
      };
      return () => {
        ws.current?.close();
        ws.current = null;
      };
    }
  }, [dispatch, selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() || file) {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const messageData = { sender_username: username };
        console.log(
          "new message is",
          newMessage,
          "trimmed message is ",
          newMessage.trim()
        );
        if (file) {
          setUploading(true);
          uploadFile(file)
            .then((fileUrl) => {
              messageData.file = fileUrl;
              messageData.message = newMessage.trim();
              ws.current.send(JSON.stringify(messageData));
              dispatch(addMessage(messageData));
              setNewMessage("");
              setFile(null);
              setFilePreview(null);
            })
            .catch((err) => {
              setUploadError("File upload failed. Please try again.");
            })
            .finally(() => setUploading(false));
        } else {
          messageData.message = newMessage.trim();
          ws.current.send(JSON.stringify(messageData));

          setNewMessage("");
        }
      } else {
        console.error("WebSocket is not open.");
      }
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${CHAT_BASE_URL}api/upload/`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data is: ", data, "file url is ", data.fileUrl);
      return data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setUploadError(null); // Reset any previous upload errors
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(newMessage + emoji.emoji);
    setEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  if (!selectedGroup) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p>Select a chat group to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="p-4 bg-blue-600 text-white shadow-md flex justify-between items-center">
        <h3 className="text-xl font-bold">{selectedGroup.name}</h3>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 p-3 rounded-lg max-w-xs break-words ${
                msg.sender_username === username
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <strong
                    className={`mr-2 text-sm ${
                      msg.sender_username === username
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {msg.sender_username === username
                      ? "You"
                      : msg.sender_username}
                  </strong>
                  {msg.content && <p className="text-sm">{msg.content}</p>}
                  {msg.file && (
                    <div className="relative mt-2">
                      {msg.file.endsWith(".jpg") ||
                      msg.file.endsWith(".png") ||
                      msg.sender_username === username ? (
                        <img
                          src={msg.file}
                          alt="uploading..."
                          className="max-w-full rounded-lg"
                        />
                      ) : (
                        <a
                          href={msg.file}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black-500 hover:underline"
                        >
                          Download File
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages</p>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-200 flex items-center border-t border-gray-300">
        <button
          onClick={toggleEmojiPicker}
          className="ml-4 p-3 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          😊
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="ml-4 p-1 hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <img className="h-6 w-6" src="https://img.icons8.com/?size=100&id=EZUNFG5EQSG2&format=png&color=000000" />
          </label>
          {filePreview && (
            <div className="top-0 right-0 p-1 bg-white rounded-full">
              {file.type.startsWith("image/") ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <span className="text-sm text-gray-600">{file.name}</span>
              )}
              <button
                onClick={handleDeleteFile}
                className="absolute top-0 right-0 text-sm text-red-500"
              >
                X
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleSendMessage}
          className="ml-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Send"}
        </button>
      </div>

      {emojiPickerVisible && (
        <div className="absolute bottom-16 left-4 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {uploadError && (
        <div className="absolute bottom-24 left-4 z-10 bg-red-500 text-white p-2 rounded-lg">
          {uploadError}
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
