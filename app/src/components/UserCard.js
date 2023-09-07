"use client";

import React, { useCallback } from "react";
import Button from "./Button";
import axios from "axios";
import { useRouter } from "next/navigation";

const UserCard = ({ user }) => {
  const router = useRouter();
  const userId = user?.id;

  const deleteUser = useCallback(async () => {
    await axios.delete(`/api/user/${userId}`);
    alert(`${user.name} has been deleted`);
    router.refresh();
  }, [userId]);

  return (
    <>
      <div className=" flex flex-row items-center justify-between hover:bg-neutral-400 hover:border-rose-500 hover:text-white transition cursor-pointer px-2">
        <div className="text-lg text-semibold mr-2">User: {user?.name}</div>
        <div className="text-lg text-semibold mr-2">email: {user?.email}</div>
        <div className="text-lg text-semibold mr-2">Role: {user?.role}</div>
        {/* <Button label="delete" small onClick={deleteUser} /> */}
        {/* one more step adds.   are you sure you want to delete? */}
        <button
          onClick={deleteUser}
          className="bg-green-800 py-2 px-2 mt-1 mb-1 rounded-lg text-white hover:bg-red-800 transition"
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default UserCard;
