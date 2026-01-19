import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuthStore from "./stores/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // get location state
  const { signIn, loading, error } = useAuthStore();

  const from = location.state?.from?.pathname || "/products"; // fallback

  async function onSubmit(e) {
    e.preventDefault();
    const user = await signIn(email, password);

    if (user) {
      navigate(from, { replace: true }); // redirect to original private route
    }
  }

  return (
    <section className="flex justify-center items-center h-full">
      <form className="w-[300px] space-y-4" onSubmit={onSubmit}>
        <header className="text-center">
          <h1 className="font-semibold text-2xl">Sales Order Booking</h1>
          <p className="text-sm text-gray-600">
            Welcome back! Please login to continue.
          </p>
        </header>

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
            className="input input-sm w-full"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="password"
            className="input input-sm w-full"
            placeholder="****"
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>

        <div>
          <Link
            to={`/req-reset-password/${encodeURIComponent(email || "m@example.com")}`}
            className="text-xs underline"
          >
            Forgot Password
          </Link>
        </div>

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
        <p className="text-sm text-gray-600">
          No account yet?{" "}
          <Link className="underline" to={"/register"}>
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}
