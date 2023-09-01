"use client";
import React from "react";

const Input = ({
  id,
  register,
  error,
  required,
  label,
  disabled,
  placeholder,
  type,
}) => {
  return (
    <div className="w-full h-8 relative mt-10">
      <input
        id={id}
        {...register(id, required)}
        placeholder={placeholder}
        type={type}
        className={`peer mt-1 w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed `}
      />
      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0]
        peer-placehoder-shown:scale-100 
        peer-placeholder-shown:transalte-y-0 
        peer-focus:scale-75
        peer-focus:translate-y-4
        `}
      ></label>
    </div>
  );
};

export default Input;
