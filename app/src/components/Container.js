"use client";

import React from "react";

const Container = ({ children }) => {
  return (
    <div className=" w-full h-full flex flex-col bg-neutral-100">
      {children}
    </div>
  );
};

export default Container;
