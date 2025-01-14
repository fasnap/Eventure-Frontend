import { Paperclip, X } from "lucide-react";
import React, { useRef, useState } from "react";

function MessageInput({ message, setMessage, onSubmit }) {
  const fileInputRef = useRef();
  const [mediaPreview, setMediaPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const clearFileSelection = () => {
    setMediaPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !selectedFile) return;

    let mediaData = null;
    if (selectedFile) {
      const reader = new FileReader();
      const mediaPromise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
      reader.readAsDataURL(selectedFile);

      const mediaResult = await mediaPromise;
      mediaData = {
        data: mediaResult,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      };
    }

    onSubmit(e, mediaData);
    clearFileSelection();
  };

  return (
    <div className="p-4 border-t bg-white">
      {mediaPreview && (
        <div className="mb-2 relative inline-block">
          {selectedFile.type.startsWith("image/") && (
            <img
              src={mediaPreview}
              alt="Preview"
              className="max-h-32 rounded"
            />
          )}
          <button
            onClick={clearFileSelection}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,application/*"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            disabled={!message.trim() && !selectedFile}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
