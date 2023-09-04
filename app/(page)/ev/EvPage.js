"use client";

import React, { useState, useContext, useEffect, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DashboardTable from "@/app/src/components/dashboard/Dashboard";
import { evQuery } from "@/app/src/util/query";

const EvPage = () => {
  const [code, setCode] = useState("");

  const pacificTimeZone = "America/Los_Angeles";
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
  const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

  useEffect(() => {
    const evQ = evQuery(formattedStartDate, formattedEndDate);
    setCode(evQ);
    console.log(evQ);
  }, [formattedStartDate, formattedEndDate]);

  return (
    <DashboardTable
      label="ICE"
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      code={code}
    />
  );
};

export default EvPage;
