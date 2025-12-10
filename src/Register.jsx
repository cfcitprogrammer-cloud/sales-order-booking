"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [error, setError] = useState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSales, setIsSales] = useState(false);

  const [createUserLoading, setCreateUserLoading] = useState(false);
  const navigate = useNavigate();

  async function createUser(e) {
    e.preventDefault();

    setCreateUserLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        setError(error);
      } else {
        if (isSales) {
          await supabase.from("sales_agents").insert([
            {
              user_id: data.user.id,
              name,
            },
          ]);
          navigate("/products");
        }
      }
    } catch (error) {
      alert("Something went wrong. Check console.");
      console.log("ERROR: ", error);
    } finally {
      setCreateUserLoading(false);
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
          disabled={createUserLoading}
          type="submit"
        >
          {createUserLoading ? (
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
