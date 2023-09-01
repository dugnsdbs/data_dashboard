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
    router.refresh();
  }, [user?.id]);

  return (
    <div className="border-[1px] w-full flex flex-row items-center justify-between gap-2 m-2 pl-2 pr-2">
      <div className="text-black text-lg text-semibold ">
        Username: {user.name} |
      </div>

      <div className="text-black text-lg text-semibold ">
        email: {user.email} |
      </div>
      <div className="text-black text-lg text-semibold ">Role: {user.role}</div>
      <Button label="delete" small onClick={deleteUser} />
    </div>
  );
};

export default UserCard;
