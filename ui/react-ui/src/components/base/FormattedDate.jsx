import React, { useMemo } from 'react';
import CommonHelper from '../../../src/utils/CommonHelper'; // Adjust path as needed

const FormattedDate = ({ date, title = '' }) => {
  const formattedDate = useMemo(() => {
    if (!date) {
      return '';
    }
    return CommonHelper.formatToLocalDate(date);
  }, [date]);

  const displayTitle = useMemo(() => {
    if (title) {
      return title;
    }
    if (date) {
      // Default title to the full ISO string if no specific title is provided
      return CommonHelper.formatToDateTime(date);
    }
    return '';
  }, [date, title]);

  if (!formattedDate) {
    return null; // Or render a placeholder like '-'
  }

  return (
    <span title={displayTitle}>
      {formattedDate}
    </span>
  );
};

export default FormattedDate;
