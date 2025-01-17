import React from "react";

function NoDataFound({ message, subMessage }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-gray-100 p-6 rounded-full shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 9.75l5.5 5.5m-5.5 0l5.5-5.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="mt-8 text-2xl font-semibold text-gray-700">{message}</h1>
      {subMessage && (
        <p className="mt-4 text-gray-500 text-sm text-center max-w-md">
          {subMessage}
        </p>
      )}
    </div>
  );
}

export default NoDataFound;
