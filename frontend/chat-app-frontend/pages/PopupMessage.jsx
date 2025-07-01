import React, { useState, useEffect } from 'react';

const PopupMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#52c41a',  // green success color
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      zIndex: 1000,
    }}>
      {message}
    </div>
  );
};

export default PopupMessage;
