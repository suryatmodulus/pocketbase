import React, { useEffect } from 'react';
import useToastsStore from '../../stores/toastsStore';
// Note: We'll need to add some basic CSS for transitions later.
// For now, focusing on the JSX structure and logic.

const ToastItem = ({ toast, onRemove }) => {
  // Basic styling for visibility. Transitions will require CSS.
  const style = {
    padding: '10px 15px',
    margin: '10px 0',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: toast.type === 'error' ? '#f44336' :
                     toast.type === 'success' ? '#4CAF50' :
                     toast.type === 'warning' ? '#ff9800' :
                     '#2196F3', // Default to info
    opacity: 1, // Will be controlled by CSS transition
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
    position: 'relative', // For absolute positioning of close button
  };

  const messageStyle = {
    marginRight: '20px', // Space for the close button
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div style={style} className={`toast-item toast-${toast.type}`}>
      <span style={messageStyle}>{toast.message}</span>
      <button style={closeButtonStyle} onClick={() => onRemove(toast.id)} title="Dismiss">
        &times;
      </button>
    </div>
  );
};

const Toasts = () => {
  const { toasts, removeToast } = useToastsStore();

  // Basic container styling
  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 2000, // Ensure it's above most other content
    width: '300px',
  };

  if (!toasts.length) {
    return null;
  }

  return (
    <div style={containerStyle} className="toasts-container-placeholder">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default Toasts;
