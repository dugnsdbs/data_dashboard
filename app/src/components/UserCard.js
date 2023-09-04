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
    <div className="border-[1px] border-gray-700 w-full flex flex-row items-center justify-between gap-2 m-2 pl-20 pr-20 hover:opacity-60 hover:border-blue-900 transition cursor-pointer">
      <div className="text-black text-lg text-semibold mr-5">
        User: {user.name}
      </div>

      <div className="text-black text-lg text-semibold mr-5">
        email: {user.email}
      </div>
      <div className="text-black text-lg text-semibold mr-5">
        Role: {user.role}
      </div>
      {/* <Button label="delete" small onClick={deleteUser} /> */}
      {/* one more step adds.   are you sure you want to delete? */}
      <button
        onClick={deleteUser}
        className="bg-green-800 py-2 px-3 m-1 rounded-lg text-white hover:bg-red-800 transition"
      >
        Delete
      </button>
    </div>
  );
};

export default UserCard;
