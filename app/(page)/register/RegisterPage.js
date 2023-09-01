"use client";

import Form from "@/app/src/components/Form";
import UserCard from "@/app/src/components/UserCard";
import React from "react";

const RegisterPage = ({ allUsers }) => {
  console.log(allUsers);
  return (
    <div className="flex flex-row gap-4 items-center justify-between h-full">
      <div className="w-1/2 float-left bg-yellow-400 h-full flex flex-col items-center">
        <Form isRegsiter buttonLabel="Create" />
      </div>
      <div className="w-1/2 float-right bg-red-300 h-full flex flex-col items-center">
        {allUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default RegisterPage;
