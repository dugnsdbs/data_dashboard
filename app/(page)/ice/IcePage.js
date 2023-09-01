"use client";

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DashboardTable from "@/app/src/components/DashboardTable";

const IcePage = () => {
  // console.log(props)
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
  // const pacificStartDate = utcToZonedTime(startDate);
  // const pacificEndDate = utcToZonedTime(endDate);

  const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
  const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

  useEffect(() => {
    const queryChanger = () => {
      setCode(`SELECT COUNT(*) FROM "lms_tms_tran*"
      WHERE "@timestamp" >= CAST('${formattedStartDate}' AS DATETIME)
      AND "@timestamp" < CAST('${formattedEndDate}' AS DATETIME) 
    AND company = '02'`);
    };
    queryChanger();
  }, [formattedStartDate, formattedEndDate]);

  const getElasticSql = async (query) => {
    const response = await axios.post("api/elastic", { query });
    return response;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await getElasticSql(code);
      setSqlResult(result.data);
    } catch (error) {
      setResErr(error);
    } finally {
      setIsLoading(false);
    }
  };

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

const getElasticSql = async (query) => {
  const response = await fetch("api/elasticsearch-sql", {
    method: "POST",
    body: JSON.stringify({
      query,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
  });
  const data = await response.json();
  return data;
};

export default IcePage;
