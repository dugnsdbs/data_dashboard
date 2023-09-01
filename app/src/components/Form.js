"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import RoleSelect from "./RoleSelect";
import Input from "./Input";
import Button from "./Button";
import { signIn } from "next-auth/react";

const Form = ({ isRegsiter, isLogin, buttonLabel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { error },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const role = watch("role");

  const onSubmit = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        if (isRegsiter) {
          await axios.post("/api/register", data);
          router.refresh();
          reset();
        }
        if (isLogin) {
          const { email, password } = data;
          const response = await signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
            redirect: false,
          });

          if (response.error) {
            alert("Wrong email or password");
          } else {
            alert("Login Success");
            router.refresh();
            router.push("/");
          }

          reset();
        }
      } catch (error) {
        console.log("Something wrong with Auth");
      } finally {
        setIsLoading(false);
      }
    },
    [isRegsiter, setIsLoading, router, reset, isLogin]
  );

  const setRoleValue = (id, value) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-row items-center justify-center mt-5 pt-20">
      <div className="flex flex-col items-center justify-center w-60 gap-2">
        {isRegsiter && (
          <>
            <h1 className="text-xl">Create User</h1>
            <RoleSelect
              value={role}
              onChange={(value) => setRoleValue("role", value)}
            />
            <Input
              id="name"
              register={register}
              error={error}
              required
              label="Name"
              disabled={isLoading}
              placeholder="Name"
              type="text"
            />
          </>
        )}

        <Input
          id="email"
          register={register}
          error={error}
          required
          label="email"
          disabled={isLoading}
          placeholder="email"
          type="text"
        />
        <Input
          id="password"
          register={register}
          error={error}
          required
          label="Password"
          disabled={isLoading}
          placeholder="Password"
          type="password"
        />

        <Button
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          label={buttonLabel}
        />
      </div>
    </div>
  );
};

export default Form;
