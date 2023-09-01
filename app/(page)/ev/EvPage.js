"use client";

import React, { useState, useContext, useEffect, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DashboardTable from "@/app/src/components/DashboardTable";

const EvPage = () => {
  const [code, setCode] = useState("");

  const [sqlResult, setSqlResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resErr, setResErr] = useState("");

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
  // const pacificStartDate = utcToZonedTime(startDate, pacificTimeZone);
  // const pacificEndDate = utcToZonedTime(endDate, pacificTimeZone);

  const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
  const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

  useEffect(() => {
    const queryChanger = () => {
      setCode(`SELECT scenario FROM "lms_tms_tran*"
      WHERE "@timestamp" >= CAST('${formattedStartDate}' AS DATETIME)
      AND "@timestamp" < CAST('${formattedEndDate}' AS DATETIME) 
    AND company = '02'
    group by scenario
    `);
    };
    queryChanger();
  }, [formattedStartDate, formattedEndDate]);

  return (
    <DashboardTable
      startDate={startDate}
      endDate={endDate}
      handleEndDateChange={handleEndDateChange}
      handleStartDateChange={handleStartDateChange}
      resErr={resErr}
      sqlResult={sqlResult}
      setSqlResult={setSqlResult}
      setResErr={setResErr}
      setIsLoading={setIsLoading}
      isLoading={isLoading}
      code={code}
    />
  );
};

export default EvPage;
