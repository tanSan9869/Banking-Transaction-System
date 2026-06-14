/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Logged in successfully");
    } catch (err) {
        console.log("--- Login Error Debugging ---");
        console.error("Full Error Object:", err);
        console.log("Backend Error Message:", err.response?.data);
        console.log("HTTP Status Code:", err.response?.status);
        console.log("-----------------------------");
      toast.error(err.response?.data || "Login Failed");
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
        <p className="text-gray-500 text-center mb-6">
          
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-1">
            <label>Email</label>
            <input
              className="px-[0.9rem] py-[0.65rem] border border-gray-300 rounded-lg text-[0.95rem] outline-none"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label>Password</label>
            <input
              className="px-[0.9rem] py-[0.65rem] border border-gray-300 rounded-lg text-[0.95rem] outline-none"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className="w-full py-3 bg-indigo-600 text-white border-none rounded-lg text-base cursor-pointer mt-2 hover:bg-indigo-700 transition disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-500">
          
          No account?
          <Link to="/register" className="text-indigo-600 hover:underline">
            
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
