import React, { useState, useEffect } from "react";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setTimeout(() => setCounter(counter + 1), 1000);
  }, [counter]);
  return (
    <div className="w-full flex justify-center text-black text-4xl">
      {counter}s
    </div>
  );
};

export default Counter;
