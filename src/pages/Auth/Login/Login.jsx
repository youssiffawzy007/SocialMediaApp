import { Alert, Button, Form, Input } from "@heroui/react";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  let timeOut;
  useEffect(() => {
    return () => {
      clearTimeout(timeOut);
    };
  });
  const loginSchema = z.object({
    username: z
      .string()
      .regex(
        /^([a-z0-9_]{3,30}|[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+)$/,
        "Enter Valid UserName or Email",
      ),
    // email: z.string().nonempty("Pleace Enter Your Email"),
    password: z
      .string()
      .nonempty("Pleace Enter Your Password")
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,"Password must contain at least a capital letter, a spetial character and a number, and must be above 8 letters"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  async function onSubmiteLogin(data) {
    try {
      if (data.username.includes("@")) {
        data.email = data.username;
        delete data.username;
      }
      const rec = await axios.request({
        method: "POST",
        url: "https://route-posts.routemisr.com/users/signin",
        data: data,
      });
      if (rec.error) {
        throw new Error(rec.error);
      } else {
        setApiErrorMessage("");
        setApiSuccessfulyMessage("The Email Entered successfuly");
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
    <div className="flex justify-center items-center h-screen">
      <Form
        onSubmit={handleSubmit(onSubmiteLogin)}
        className="mt-4 p-6 rounded-2xl w-1/3 flex flex-col gap-3.5 shadow-2xl border border-gray-100"
      >
        <p className="mx-auto mb-2 text-2xl font-semibold text-blue-900">
          Login
        </p>
        <Input
          label="Email or User Name"
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
        {/* <Input
          label="Email"
          type="email"
          color={errors.email && touchedFields.email ? "danger" : "default"}
          {...register("email")}
        />
        <ErrorMessage feild={errors.email} isTouched={touchedFields.email} /> */}

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

        <Button
          className="w-full font-bold"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          color="primary"
          type="submit"
        >
          Log in
        </Button>
        <Link
          to="/register"
          className="text-blue-700 ms-2 text-sm hover:text-blue-800"
        >
          Create New Account
        </Link>

        {apiErrorMessage && (
          <Alert color="danger" title={`${apiErrorMessage}`} />
        )}
        {apiSuccessfulyMessage && (
          <Alert color="success" title={`${apiSuccessfulyMessage}`} />
        )}
      </Form>
    </div>
  );
}
