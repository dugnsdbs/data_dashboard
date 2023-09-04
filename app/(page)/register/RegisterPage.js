"use client";

import Form from "@/app/src/components/Form";
import UserCard from "@/app/src/components/UserCard";
import React from "react";

const RegisterPage = ({ allUsers }) => {
  return (
    <div className="flex flex-row gap-4 items-center justify-between h-full">
      <div className="border-[1px] w-1/6 float-left bg-neutral-100 h-full flex flex-col items-center">
        <Form isRegsiter buttonLabel="Create" />
      </div>
      <div className="w-3/4 float-right bg-neutral-100 h-full flex flex-col items-center mt-20 mr-20">
        {allUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default RegisterPage;
