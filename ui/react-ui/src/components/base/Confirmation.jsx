import React, { useState, useEffect } from 'react';
import useConfirmationStore from '../../stores/confirmationStore';
import OverlayPanel from './OverlayPanel'; // Using the placeholder

const Confirmation = () => {
  const { text, yesCallback, noCallback, resetConfirmation } = useConfirmationStore();
  const [isConfirmationBusy, setIsConfirmationBusy] = useState(false);

  const onYes = async () => {
    if (typeof yesCallback !== 'function') {
      return;
    }
    setIsConfirmationBusy(true);
    try {
      await yesCallback();
    } catch (err) {
      console.error("Confirmation 'yes' callback error:", err);
      // Optionally: show an error toast or handle error state
    } finally {
      setIsConfirmationBusy(false);
      resetConfirmation(); // Close confirmation after action
    }
  };

  const onNo = async () => {
    if (typeof noCallback === 'function') {
      setIsConfirmationBusy(true); // Prevent double-clicks or race conditions
      try {
        await noCallback();
      } catch (err) {
        console.error("Confirmation 'no' callback error:", err);
      } finally {
        setIsConfirmationBusy(false);
      }
    }
    resetConfirmation(); // Always close confirmation on "No"
  };

  // Handle Escape key to close/cancel confirmation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (text && event.key === 'Escape') {
        event.preventDefault();
        onNo();
      }
    };

    if (text) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [text, onNo]); // Dependency array includes onNo in case its definition changes

  if (!text) {
    return null;
  }

  const header = (
    <h5 className="txt-default">
      <span className="txt-xl">Confirmation</span>
    </h5>
  );

  const footer = (
    <div className="flex">
      <button
        type="button"
        className="btn btn-transparent btn-expanded"
        onClick={onNo}
        disabled={isConfirmationBusy}
      >
        No
      </button>
      <button
        type="button"
        className="btn btn-primary btn-expanded"
        onClick={onYes}
        disabled={isConfirmationBusy}
      >
        <span className="txt">{ isConfirmationBusy ? 'Please wait...' : 'Yes' }</span>
        {isConfirmationBusy && (
          <span className="loader loader-sm btn-loader"></span>
        )}
      </button>
    </div>
  );

  return (
    <OverlayPanel
      show={!!text}
      onHide={onNo} // Use onNo for closing via OverlayPanel's mechanism
      header={header}
      footer={footer}
      class="confirmation-overlay" // For potential specific styling
    >
      <p className="txt m-b-sm">{text}</p>
    </OverlayPanel>
  );
};

export default Confirmation;
