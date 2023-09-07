"use client";

import Form from "@/app/src/components/Form";
import UserCard from "@/app/src/components/UserCard";
import React from "react";

const RegisterPage = ({ allUsers }) => {
  const userRole = allUsers.filter((user) => user.role === "User");
  const AdminRole = allUsers.filter((user) => user.role === "Admin");

  return (
    <div className="h-full">
      <div className="border-[1px] w-1/5 float-left bg-neutral-100 h-full flex flex-col items-center">
        <Form isRegsiter buttonLabel="Create" />
      </div>
      {/* <div className="flex flex-row items-center justify-center"> */}
      <div className="w-3/4 float-right h-5/6 bg-neutral-100 flex flex-wrap mt-20 justify-center gap-10 mr-9">
        <div className="flex flex-col">
          <div className="text-4xl font-semibold mb-2 text-blue-600">Admin</div>
          <div className="border-[1px] rounded-md border-gray-500 overflow-y-auto h-5/6">
            {AdminRole.map((user) => (
              <div
                className="h-auto border-[1px] w-auto border-neutral-400 rounded-md m-2"
                key={user.id}
              >
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-4xl font-semibold mb-2 text-blue-600">User</div>
          <div className="border-[1px] rounded-md border-gray-700 overflow-y-auto h-5/6">
            {userRole.map((user) => (
              <div
                className="h-auto border-[1px] w-auto border-neutral-400 rounded-md m-2"
                key={user.id}
              >
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default RegisterPage;
