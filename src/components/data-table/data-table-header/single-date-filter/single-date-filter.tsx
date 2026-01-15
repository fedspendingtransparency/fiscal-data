import React, { FunctionComponent, useEffect, useState } from 'react';
import { Column } from '@tanstack/react-table';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SingleDateFilter: FunctionComponent<any> = ({ column }: { column: Column<any, any> }) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (date) {
      if (!isNaN(date.toDate().getTime())) {
        column.setFilterValue(dayjs(date.toDate()).format('YYYY-MM-DD'));
      } else {
        column.setFilterValue('');
      }
    } else {
      column.setFilterValue('');
    }
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        sx={{
          '& .MuiInputBase-root': {
            height: '28px',
            fontSize: '14px',
            marginTop: '0.25rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '14px',
          },
        }}
        value={date}
        onChange={newValue => setDate(dayjs(newValue))}
        views={['year', 'month', 'day']}
        slotProps={{ textField: { size: 'small' } }}
      />
    </LocalizationProvider>
  );
};

export default SingleDateFilter;
