"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./stores/authStore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSales, setIsSales] = useState(false);

  const { loading, signUp } = useAuthStore();

  const navigate = useNavigate();

  async function createUser(e) {
    e.preventDefault();

    const user = await signUp(email, password, name, isSales);

    if (user) {
      navigate("/products");
    }
  }

  return (
    <section className="p-4">
      <form action="" className="space-y-4" onSubmit={createUser}>
        <div>
          <h1 className="text-2xl font-semibold">Create User</h1>
          <p className="text-sm text-gray-500">Create user credentials</p>
        </div>
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

        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
          <legend className="fieldset-legend">Are you from sales?</legend>
          <label className="label">
            <input
              type="checkbox"
              className="checkbox"
              checked={isSales}
              onChange={(e) => setIsSales(e.target.value)}
            />
            Yes, I'm from sales
          </label>
        </fieldset>

        <button
          className="btn btn-sm btn-primary"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <>
              <span className="loading loading-bars loading-sm"></span>
              Loading...
            </>
          ) : (
            "Create User"
          )}
        </button>
      </form>
    </section>
  );
}
