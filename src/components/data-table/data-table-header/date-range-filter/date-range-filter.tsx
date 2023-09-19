import React, { FunctionComponent, useEffect, useState } from 'react';
import { Column } from '@tanstack/react-table';
import moment from 'moment/moment';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangeFilter: FunctionComponent<any> = ({ column }: { column: Column<any, any> }) => {
  const [date, setDate] = useState(null);
  const [visibile, setVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  useEffect(() => {
    if (date) {
      if (!isNaN(date.toDate().getTime())) {
        column.setFilterValue(moment(date.toDate()).format('YYYY-MM-DD'));
      } else {
        column.setFilterValue('');
      }
    } else {
      column.setFilterValue('');
    }
  }, [date]);

  const handleChange = ranges => {
    const newDateRange = {
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: 'selection',
    };
    setSelectedRange(newDateRange);
  };

  return (
    <>
      <button onClick={() => setVisible(!visibile)}>Toggle Date Picker</button>
      {visibile && (
        <div style={{ width: '355px', height: '275px', position: 'absolute', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: '-227px' }}>
            <DateRangePicker
              ranges={[selectedRange]}
              onChange={handleChange}
              showSelectionPreview={false}
              shownDate={false}
              showDateDisplay={false}
              showMonthAndYearPicker={false}
              staticRanges={[]}
              inputRanges={[]}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DateRangeFilter;
