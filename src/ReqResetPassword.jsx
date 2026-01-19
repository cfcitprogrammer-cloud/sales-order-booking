import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useParams, Link } from "react-router-dom";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const { emailParam } = useParams();

  async function reqResetPassword(e) {
    e.preventDefault();

    // Reset previous messages so alerts are only shown once
    setError(null);
    setMsg(null);

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/sales-order-booking/reset-password`,
      });

      if (error) throw error;

      setMsg("Request Submitted. Check your email for further instructions.");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="card bg-base-100 w-96 shadow-sm">
        <div className="card-body">
          <form className="space-y-2" onSubmit={reqResetPassword}>
            <h2 className="card-title">Request to Reset Password</h2>

            {/* Show only one alert at a time */}
            {error && <p className="alert alert-error">{error}</p>}
            {!error && msg && (
              <p className="alert alert-success">
                {msg}{" "}
                <Link to={"/login"} className="text-xs underline">
                  Back to login
                </Link>
              </p>
            )}

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input w-full"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </fieldset>

            <button
              type="submit"
              className="btn btn-sm btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-bars loading-xs"></span>
              ) : (
                "Request Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
