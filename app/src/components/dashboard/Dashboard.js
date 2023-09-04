"use client";

import React, { useCallback, useState } from "react";

import axios from "axios";
import Table from "./Table";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const DashboardTable = ({
  label,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  code,
}) => {
  console.log(label);
  const [sqlResult, setSqlResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resErr, setResErr] = useState("");

  const options = [
    { label: "One hour", value: "60" },
    { label: "Two hours", value: "120" },
    // Add more options as needed
  ];

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSubmit = useCallback(
    async (query) => {
      try {
        setIsLoading(true);
        const result = await axios.post("api/elastic", { query });
        setSqlResult(result.data);
      } catch (error) {
        setResErr(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setSqlResult, setResErr]
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Table
          label={label}
          startDate={startDate}
          handleStartDateChange={handleStartDateChange}
          endDate={endDate}
          handleEndDateChange={handleEndDateChange}
          code={code}
          isLoading={isLoading}
          resErr={resErr}
          sqlResult={sqlResult}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default DashboardTable;
