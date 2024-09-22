import React from "react";
import { useError } from "./errorContext";

const ErrorPopup = () => {
  const { error, hideError } = useError();

  if (!error) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-netflix-red text-netflix-white p-4 rounded shadow-lg z-50 w-full max-w-md">
      <p className="text-center">{error}</p>
      <div className="flex justify-center mt-2">
        <button
          onClick={hideError}
          className="bg-netflix-white text-netflix-red px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;