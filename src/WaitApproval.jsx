import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./stores/authStore";

export function WaitApproval() {
  const { user, role, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Redirect users who have a role
    if (user && role) {
      navigate("/products", { replace: true });
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    // Progress bar duration
    const totalDuration = 5000; // 5 seconds
    const intervalTime = 50;
    const increment = (intervalTime / totalDuration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => (prev + increment > 100 ? 100 : prev + increment));
    }, intervalTime);

    const timeout = setTimeout(async () => {
      clearInterval(interval);
      await signOut(); // sign out user if somehow they are partially signed in
      navigate("/login");
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [user, role, signOut, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <h1 className="text-2xl font-semibold mb-2">Account Pending Approval</h1>
      <p className="text-gray-500 mb-4">
        Your account is not yet approved. Please wait for an administrator to
        grant access.
      </p>

      <progress
        className="progress progress-success w-56"
        value={progress}
        max="100"
      ></progress>

      <p className="text-gray-400 mt-2">
        You will be signed out automatically.
      </p>
    </div>
  );
}
