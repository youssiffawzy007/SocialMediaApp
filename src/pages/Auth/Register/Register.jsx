import { Alert, Button, Form, Input, Select, SelectItem } from "@heroui/react";
import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import ErrorMessage from "../../../components/shared/ErrorMessage/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { TokenContext } from "../../../context/TokenContext";
import { UserContext } from "../../../context/UserContext";
export default function Register() {
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [apiSuccessfulyMessage, setApiSuccessfulyMessage] = useState("");
  const navigate = useNavigate();
  const { saveToken } = useContext(TokenContext);
  const { saveUser } = useContext(UserContext);
  let timeOut
  useEffect(() => {
    return () => {
      clearTimeout(timeOut);
    };
  });
  const regesterSchema = z
    .object({
      name: z.string().nonempty("Pleace Enter Your Name"),
      username: z
        .string()
        .regex(
          /^[a-z0-9_]{3,30}$/,
          "Username must be between 3 and 30 characters long and without any spaces",
        ),
      email: z.string().nonempty("Pleace Enter Your Email"),
      dateOfBirth: z.coerce
        .date()
        .refine(function (val) {
          return new Date().getFullYear() - val.getFullYear() > 16
            ? true
            : false;
        }, "Age Must Be Above 16 Years")
        .transform(function (date) {
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }),
      gender: z.string().nonempty("Gender Should Be Male or Female ONLY"),
      password: z
        .string()
        .nonempty("Pleace Enter Your Password")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        ),
      rePassword: z
        .string()
        .nonempty("Pleace Enter Your Password Again")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        ),
    })
    .refine((data) => data.password === data.rePassword, {
      message: "Passwords do not match",
      path: ["rePassword"],
    });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(regesterSchema),
  });
  async function onSubmiteRegester(data) {
    try {
      const rec = await axios.request({
        method: "POST",
        url: "https://route-posts.routemisr.com/users/signup",
        data: data,
      });
      if (rec.error) {
        throw new Error(rec.error);
      } else {
        setApiErrorMessage("");
        setApiSuccessfulyMessage("The Email created successfuly");
        timeOut = setTimeout(() => {
          navigate("/");
        }, 1000);
      }
      saveToken(rec.data.data.token);
      saveUser(rec.data.data.user);
    } catch (error) {
      setApiErrorMessage(error.response.data.message);
    }
    
  }
  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmiteRegester)}
        className="mt-4 p-6 rounded-2xl w-1/3 mx-auto flex flex-col gap-3.5 shadow-2xl"
      >
        <p className="mx-auto mb-2 text-2xl font-semibold text-blue-900">
          Regstration
        </p>
        <Input
          label="Name"
          type="text"
          color={errors.name && touchedFields.name ? "danger" : "default"}
          {...register("name")}
        />
        <ErrorMessage feild={errors.name} isTouched={touchedFields.name} />
        <Input
          label="User Name"
          type="text"
          color={
            errors.username && touchedFields.username ? "danger" : "default"
          }
          {...register("username")}
        />
        <ErrorMessage
          feild={errors.username}
          isTouched={touchedFields.username}
        />
        <Input
          label="Email"
          type="email"
          color={errors.email && touchedFields.email ? "danger" : "default"}
          {...register("email")}
        />
        <ErrorMessage feild={errors.email} isTouched={touchedFields.email} />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              label="Select Gender"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                field.onChange(value);
              }}
              color={
                errors.gender && touchedFields.gender ? "danger" : "default"
              }
            >
              <SelectItem key="male">Male</SelectItem>
              <SelectItem key="female">Female</SelectItem>
            </Select>
          )}
        />
        <ErrorMessage feild={errors.gender} isTouched={touchedFields.gender} />

        <Input
          label="Date of Birth"
          type="date"
          color={
            errors.dateOfBirth && touchedFields.dateOfBirth
              ? "danger"
              : "default"
          }
          {...register("dateOfBirth")}
        />
        <ErrorMessage
          feild={errors.dateOfBirth}
          isTouched={touchedFields.dateOfBirth}
        />

        <Input
          label="Password"
          type="password"
          color={
            errors.password && touchedFields.password ? "danger" : "default"
          }
          {...register("password")}
        />
        <ErrorMessage
          feild={errors.password}
          isTouched={touchedFields.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          color={
            errors.rePassword && touchedFields.rePassword ? "danger" : "default"
          }
          {...register("rePassword")}
        />
        <ErrorMessage
          feild={errors.rePassword}
          isTouched={touchedFields.rePassword}
        />

        <Button
          className="w-full font-bold"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          color="primary"
          type="submit"
        >
          Create New Account
        </Button>
        <Link
          to="/login"
          className="text-blue-700 ms-2 text-sm hover:text-blue-800"
        >
          I already have an account
        </Link>

        {apiErrorMessage && (
          <Alert color="danger" title={`${apiErrorMessage}`} />
        )}
        {apiSuccessfulyMessage && (
          <Alert color="success" title={`${apiSuccessfulyMessage}`} />
        )}
      </Form>
    </>
  );
}
