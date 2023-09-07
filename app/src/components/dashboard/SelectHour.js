"use client";

import React, { useState } from "react";
import Select from "react-select";

const SelectHour = ({ handleHourly, onChageHour, isHour }) => {
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
