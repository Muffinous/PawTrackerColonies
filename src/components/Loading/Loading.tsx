import React from "react";
import "./Loading.css";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading" }) => {
  return (
    <div className="loading-container">
      <h5>
        {message} <span className="loading-dots"></span>
      </h5>
      <img src="src/assets/loading/catloading.gif" alt="Loading" />
    </div>
  );
};

export default Loading;
