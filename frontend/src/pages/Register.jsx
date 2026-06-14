/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FileEdit } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      toast.success("Account Created!");
    } catch (err) {
      toast.error(err.response?.data || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff]">
      <div className="bg-white p-10 rounded-xl w-full max-w-105 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <h2 className="text-[1.8rem] text-center font-bold mb-1">
          🏦 BankApp
        </h2>
        <p className="text-gray-500 text-center mb-6"> Create your account </p>
        <form onSubmit={handleSubmit}>
          {["fullName", "email", "password"].map((field) => (
            <div key={field} className="mb-4 flex flex-col gap-1">
              <label>
                {field === "fullName"
                  ? "Full Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>

              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                      ? "email"
                      : "text"
                }
                placeholder={
                  field === "fullName"
                    ? "John Doe"
                    : field === "email"
                      ? "you@example.com"
                      : "••••••••"
                }
                value={form[field]}
                onChange={(e) => {
                  setForm({
                    ...form,
                    [field]: e.target.value,
                  });
                }}
                required
              />
            </div>
          ))}
          <button
            className="w-full py-3 bg-indigo-600 text-white border-none rounded-lg text-base cursor-pointer mt-2 hover:bg-indigo-700 transition disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-500">
          Have an account?
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
