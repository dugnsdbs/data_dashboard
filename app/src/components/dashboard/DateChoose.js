"use client";

import React, { useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateChoose = ({
  startDate,
  endDate,
  code,
  handleStartDateChange,
  handleEndDateChange,
  handleSubmit,
}) => {
  return (
    <>
      <div className="flex flex-row gap-4 mt-1">
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl">Start Date:</p>
          <div className="text-2xl">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl">End Date:</p>
          <div className="text-2xl">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <button
            onClick={() => handleSubmit(code)}
            className="btn border rounded py-2 px-4 text-xl text-green-100 bg-blue-600 border-blue-800 hover:bg-blue-400"
          >
            start
          </button>
        </div>
      </div>
    </>
  );
};

export default DateChoose;
