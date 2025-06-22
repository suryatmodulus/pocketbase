import React from 'react';

const OverlayPanel = ({ children, class: className, header, footer, show, onHide }) => {
  if (!show) return null;

  // Basic styling to make it visible and overlay-like
  const styles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    minWidth: '300px',
  };

  const headerStyles = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '15px',
  };

  const footerStyles = {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
    textAlign: 'right',
  };


  return (
    <div style={styles} className={`overlay-panel-placeholder ${className || ''}`}>
      {header && <div style={headerStyles} className="header-placeholder">{header}</div>}
      {children}
      {footer && <div style={footerStyles} className="footer-placeholder">{footer}</div>}
      {/* The close button in the original Svelte component is usually part of the footer slot,
          or handled by the component using OverlayPanel.
          Adding a simple close button here if onHide is provided, for placeholder functionality. */}
      {onHide && (
        <button
          onClick={onHide}
          style={{ marginTop: '10px', display: 'block', marginLeft: 'auto' }}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default OverlayPanel;
