"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "./stores/authStore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { loading, signUp, error } = useAuthStore();

  const navigate = useNavigate();

  async function createUser(e) {
    e.preventDefault();

    const user = await signUp(email, password, name);

    if (user) {
      navigate("/");
    }
  }

  return (
    <section className="p-4 w-full h-full flex justify-center items-center">
      <form action="" className="space-y-2 w-64" onSubmit={createUser}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Register</h1>
          <p className="text-sm text-gray-500">Create user credentials</p>
        </div>

        {error && (
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

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            className="input input-sm"
            placeholder="Type here"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            className="input input-sm"
            placeholder="Type here"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="password"
            className="input input-sm"
            placeholder="Type here"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </fieldset>

        <button
          className="btn btn-sm btn-primary w-full"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <>
              <span className="loading loading-bars loading-sm"></span>
            </>
          ) : (
            "Create User"
          )}
        </button>
        <p className="text-sm text-gray-600">
          Have an account?{" "}
          <Link className="underline" to={"/login"}>
            Sign In
          </Link>
        </p>
      </form>
    </section>
  );
}
