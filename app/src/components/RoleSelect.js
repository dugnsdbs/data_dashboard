"use client";

import Select from "react-select";
import React from "react";

const RoleSelect = ({ value, onChange }) => {
  const option = [{ name: "Admin" }, { name: "User" }];

  const select = option.map((item) => ({
    value: item.name,
  }));

  return (
    <div className="w-full mt-12">
      <Select
        placeholder="Role"
        isClearable
        options={select}
        value={value.value}
        onChange={(value) => onChange(value.value)}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.value}</div>
          </div>
        )}
        className={{
          control: () => "p2 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
};

export default RoleSelect;
