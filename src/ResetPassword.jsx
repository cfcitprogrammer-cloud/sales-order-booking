import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "./supabase";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setIsLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get("token"); // ✅ your token

  async function resetPassword(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (newPassword !== repeatPassword) {
        setError("Password did not match");
        return;
      }

      const { data, error } = await supabase.auth.updateUser(
        {
          password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (error) throw error;

      setMsg("Password successfully updated! You can now log in.");

      console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setNewPassword("");
      setRepeatPassword("");

      setError("");
      setMsg("");
    }
  }

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-96 shadow-sm">
        <div className="card-body">
          <form className="space-y-2" onSubmit={resetPassword}>
            <h2 className="card-title">Reset Password</h2>

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
              <legend className="fieldset-legend">New Password</legend>
              <input
                type="password"
                className="input w-full"
                placeholder="******"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Repeat Password</legend>
              <input
                type="password"
                className="input w-full"
                placeholder="******"
                onChange={(e) => setRepeatPassword(e.target.value)}
                value={repeatPassword}
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
