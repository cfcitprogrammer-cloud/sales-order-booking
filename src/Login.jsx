"use client";

import { useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./stores/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { signIn, loading, error } = useAuthStore();

  async function onSubmit(e) {
    e.preventDefault();

    const user = await signIn(email, password);

    if (user) {
      navigate("/products");
    }
  }

  return (
    <section className="flex justify-center items-center h-full">
      <form action="" className="w-1/3 space-y-4" onSubmit={onSubmit}>
        <header className="text-center">
          <h1 className="font-semibold text-2xl">Sales Order Booking</h1>
          <p className="text-sm text-gray-600">
            Welcome back! Please login to continue.
          </p>
        </header>

        {error != "" && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Email</legend>
          <input
            type="email"
            class="input input-sm w-full"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Password</legend>
          <input
            type="password"
            class="input input-sm w-full"
            placeholder="****"
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>

        <button
          className="btn btn-sm btn-primary w-full text-center"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-bars loading-xs"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </section>
  );
}
