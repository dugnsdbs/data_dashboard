"use client";

import React, { useCallback } from "react";
import Button from "./Button";
import axios from "axios";
import { useRouter } from "next/navigation";

const UserCard = ({ user }) => {
  const router = useRouter();
  const userId = user?.id;

  const deleteUser = useCallback(async () => {
    await axios.delete(`/api/user/${user?.id}`);
    alert(`${user.name} has been deleted`);
    router.refresh();
  }, [user?.id]);

  return (
    <>
      <div className="border-[1px] rounded-md border-gray-700 flex flex-row items-center justify-between hover:bg-neutral-500 hover:border-rose-500 hover:text-white transition cursor-pointer mr-5 px-5">
        <div className="text-lg text-semibold">User: {user.name}</div>
        <div className="text-lg text-semibold">email: {user.email}</div>
        <div className="text-lg text-semibold">Role: {user.role}</div>
        {/* <Button label="delete" small onClick={deleteUser} /> */}
        {/* one more step adds.   are you sure you want to delete? */}
        <button
          onClick={deleteUser}
          className="bg-green-800 py-2 px-3 m-1 rounded-lg text-white hover:bg-red-800 transition"
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default UserCard;
