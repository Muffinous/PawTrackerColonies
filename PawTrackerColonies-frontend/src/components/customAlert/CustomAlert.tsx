import React from "react";
import './CustomAlert.css';

const CustomAlert = ({ message, onClose }: { message: string; onClose: () => void }) => {

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="custom-alert-backdrop" onClick={handleClose}>
      <div className="custom-alert" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={handleClose}>OK</button>
      </div>
    </div>
  );
};

export default CustomAlert;