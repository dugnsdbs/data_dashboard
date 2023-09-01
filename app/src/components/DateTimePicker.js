import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

const DateTimePicker = () => {
  const pacificTimeZone = "America/Los_Angeles";
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // Convert dates to Pacific Time zone
  const pacificStartDate = utcToZonedTime(startDate, pacificTimeZone);
  const pacificEndDate = utcToZonedTime(endDate, pacificTimeZone);

  const formattedStartDate = format(
    pacificStartDate,
    "yyyy-MM-dd'T'HH:mm:ssXXX"
  );
  const formattedEndDate = format(pacificEndDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

  const timeDifferenceInMinutes = differenceInMinutes(
    pacificEndDate,
    pacificStartDate
  );

  return (
    <div>
      <h2>Date and Time Range Picker (Pacific Time)</h2>
      <div>
        <p>Start Date:</p>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
        />
      </div>
      <div>
        <p>End Date:</p>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
        />
      </div>
      <p>Start Date and Time (PT): {formattedStartDate}</p>
      <p>End Date and Time (PT): {formattedEndDate}</p>
      <p>Time Range: {timeDifferenceInMinutes} minutes</p>
    </div>
  );
};

export default DateTimePicker;
