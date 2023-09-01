import React from "react";
import RegisterPage from "./RegisterPage";
import getAllUsers from "@/app/src/actions/getAllUsers";

const page = async () => {
  const allUsers = await getAllUsers();
  return <RegisterPage allUsers={allUsers} />;
};

export default page;
