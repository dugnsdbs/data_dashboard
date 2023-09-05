"use client";

import React, { useState, useContext, useEffect, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { iceQuery, evHourlyQuery } from "@/app/src/util/query";
import axios from "axios";
import Table from "./Table";
import DateChoose from "./DateChoose";
import SelectHour from "./SelectHour";
import Select from "react-select";

const Dashboard = ({ label }) => {
  const [sqlResult, setSqlResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resErr, setResErr] = useState("");
  const [code, setCode] = useState(null);

  const pacificTimeZone = "America/Los_Angeles";
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
  const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

  const [selectedOption, setSelectedOption] = useState(null);

  console.log(selectedOption);

  // Handle the onChange event to update the selected option
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    if (selectedOption !== null) {
      let hourly = evHourlyQuery(selectedOption?.value);
      handleSubmit(hourly);
      const now = new Date();
      const nextFiveMinuteMark = new Date(
        Math.ceil(now.getTime() / 30000) * 30000
      );
      const timeUntilNextMark = nextFiveMinuteMark - now;
      const interval = setInterval(() => {
        handleSubmit(hourly);
      }, timeUntilNextMark);
      return () => {
        clearInterval(interval);
      };
    } else {
      const evQ = iceQuery(formattedStartDate, formattedEndDate);
      setCode(evQ);
      console.log(selectedOption);
    }
  }, [selectedOption, formattedStartDate, formattedEndDate]);

  // useEffect(() => {
  //   const evQ = iceQuery(formattedStartDate, formattedEndDate);
  //   setCode(evQ);
  //   console.log(selectedOption);
  // }, [formattedStartDate, formattedEndDate]);

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

  const options = [
    { label: "One hour", value: "60" },
    { label: "Two hours", value: "120" },
    // Add more options as needed
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-row justify-between items-center">
          <div className="mr-20">
            <h2 className="mt-5 text-4xl font-semibold text-red-800">
              {label}
            </h2>
          </div>
          <div className="border-[1px] border-gray-700 mt-8 flex flex-row px-10 py-3 rounded-md">
            <div className="flex flex-row justify-start mt-2 mr-10">
              <div className="font-semibold text-2xl mr-5">
                <p>Pick Hour</p>
              </div>
              <div>
                <Select
                  value={selectedOption}
                  onChange={handleSelectChange}
                  options={options}
                  isClearable
                  placeholder="Select an option"
                />
              </div>
            </div>

            <DateChoose
              startDate={startDate}
              endDate={endDate}
              code={code}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
        <Table isLoading={isLoading} resErr={resErr} sqlResult={sqlResult} />
      </div>
    </>
  );
};

export default Dashboard;
