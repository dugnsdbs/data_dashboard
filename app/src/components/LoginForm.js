"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { signIn } from "next-auth/react";

const Form = ({ isLogin, buttonLabel }) => {
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
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      try {
        setIsLoading(true);

        const { email, password } = data;

        setIsLoading(true);
        signIn("credentials", {
          email,
          password,
        });
        alert("Signin Success");
        router.refresh();
      } catch (error) {
        console.log("Something wrong with Auth");
      } finally {
        setIsLoading(false);
      }
    },
    [isLogin, setIsLoading, router, reset]
  );

  const setRoleValue = (id, value) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-row items-center justify-center mt-10 pt-20">
      <div className="flex flex-col items-center justify-center w-60 gap-2">
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

        <div className="flex flex-row items-center justify-center">
          <p className="text-sm text-neutral-800 ">
            Please contact admin for a new account
          </p>
        </div>
      </div>
    </div>
  );
};

export default Form;
