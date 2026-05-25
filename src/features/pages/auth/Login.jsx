import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../../store/api/authApi";
import { setCredentials } from "../../../store/slices/authSlice";



export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role,
            avatarUrl: userData.avatarUrl,
          },
          accessToken: userData.accessToken,
        }),
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg(
        err.data?.message || "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-[#FAFCFF] dark:bg-[#080B10] transition-colors">
      <div className="w-full max-w-sm mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-md text-gray-500 dark:text-gray-400">
            Sign in to your Cloud Lens account.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-rose-950/30 text-red-600 dark:text-rose-450 text-sm font-medium border border-red-200 dark:border-rose-900/30">
            {errorMsg}
          </div>
        )}

        <button
          onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/github"}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-md font-semibold text-gray-700 dark:text-gray-200 border secondary-btn-border bg-[#FAFCFF] dark:bg-[#0B0F19] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors mb-6 cursor-pointer"
        >
          <FaGithub size={17} />
          Continue with GitHub
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-800" />
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
            or sign in with email
          </span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-800" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-md border border-gray-300 dark:border-gray-800 bg-[#FAFCFF] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 focus:border-[#0061AA] dark:focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="you@company.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-md font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#0061AA] dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 pr-11 text-md border border-gray-300 dark:border-gray-800 bg-[#FAFCFF] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 focus:border-[#0061AA] dark:focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                rememberMe 
                  ? "border-[#0061AA] bg-[#0061AA]" 
                  : "border-gray-300 dark:border-gray-700 bg-[#FAFCFF] dark:bg-[#0B0F19]"
              }`}
            >
              {rememberMe && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Remember me for 30 days
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl py-3 text-md font-black text-white bg-[#0061AA] hover:bg-[#004d8a] transition-all active:scale-[0.98] mt-4 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#0061AA] dark:text-blue-400 hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
