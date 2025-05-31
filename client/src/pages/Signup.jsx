import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import axios from "../utils/Axios";
import { registerSchema } from "../schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/auth/index";
import  {Link} from "react-router-dom";

const Signup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const dispatch = useDispatch();
  const handleSignup = async (data) => {
    const toastId = toast.loading("Registering...");
    try {
      const resp = await axios.post("/auth/register", data);
      const { message, user } = resp.data;
      dispatch(setAuth({ user }));
      toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <AuthLayout>
      <div className="card">
        <h1 className="card__header">Register</h1>
        <div className="card__body">
          <form onSubmit={handleSubmit(handleSignup)}>
            <div className="form__group">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                name="name"
                id="name"
                {...register("name")}
                placeholder="Enter your name"
              />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </div>
            <div className="form__group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
            <div className="form__group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                required
                {...register("password")}
              />
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>
            <div className="form__group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Enter your password"
                required
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword.message}</p>
              )}
            </div>
            <button type="submit" className="btn" disabled={isSubmitting}>
              Register
            </button>
            <p className="form__footer">
              Already have an account 🤔? <Link to="/login">login</Link>
            </p>
            <p className="form__footer">
              Send Verification Email 🤔? <Link to="/verify-email">Send Verification Email</Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
