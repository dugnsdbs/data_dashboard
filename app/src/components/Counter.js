import React, { useState, useEffect } from "react";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setTimeout(() => setCounter(counter + 1), 1000);
  }, [counter]);
  return <div className="w-full flex justify-end text-white">{counter}s</div>;
};

export default Counter;
