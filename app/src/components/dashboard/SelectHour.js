"use client";

import React, { useState } from "react";
import Select from "react-select";

const SelectHour = ({ handleHourly, onChageHour, isHour }) => {
  const options = [
    { label: "One hour", value: "60" },
    { label: "Two hours", value: "120" },
    // Add more options as needed
  ];
  return (
    <div>
      <Select
        options={options}
        value={isHour}
        onChange={onChageHour}
        id={options.label}
      />
    </div>
  );
};

export default SelectHour;
