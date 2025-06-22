import React, { useState, useEffect, useCallback } from 'react';
import CommonHelper from '../../../src/utils/CommonHelper'; // Adjust path as needed

const CopyIcon = ({
  value,
  tooltip = 'Copy to clipboard',
  idleClasses = 'ri-clipboard-line',
  successClasses = 'ri-check-line txt-green',
  successDuration = 1000,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState(tooltip);

  useEffect(() => {
    if (isCopied) {
      setCurrentTooltip('Copied!');
      const timer = setTimeout(() => {
        setIsCopied(false);
        setCurrentTooltip(tooltip); // Reset tooltip after success duration
      }, successDuration);
      return () => clearTimeout(timer);
    } else {
      setCurrentTooltip(tooltip); // Set to initial/idle tooltip
    }
  }, [isCopied, successDuration, tooltip]);

  const handleCopy = useCallback(async (e) => {
    e.preventDefault(); // Prevent any default action if it's, for example, inside a link
    e.stopPropagation();

    if (CommonHelper.isEmpty(value) || isCopied) {
      return;
    }

    try {
      await CommonHelper.copyToClipboard(String(value));
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCurrentTooltip('Failed to copy');
      // Optionally, revert to idle icon immediately or show a specific error icon/state
      setTimeout(() => setCurrentTooltip(tooltip), 1500); // Show error briefly
    }
  }, [value, isCopied, successDuration, tooltip]); // Added successDuration and tooltip to deps

  const iconClasses = isCopied ? successClasses : idleClasses;

  // Basic styling for the icon wrapper to make it clickable
  const wrapperStyle = {
    cursor: 'pointer',
    display: 'inline-flex', // To align icon properly
    alignItems: 'center',
  };

  return (
    <span
      style={wrapperStyle}
      className="copy-icon-placeholder"
      title={currentTooltip}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopy(e);}} // Accessibility
    >
      <i className={iconClasses}></i>
    </span>
  );
};

export default CopyIcon;
