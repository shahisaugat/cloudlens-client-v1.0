import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const inputBaseStyle = {
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#C8D0DA",
  background: "#FAFCFF",
  outline: "none",
};

const inputFocusStyle = {
  borderColor: "#0061AA",
  boxShadow: "none",
  outline: "none",
};

const inputBlurStyle = {
  borderColor: "#C8D0DA",
  boxShadow: "none",
  outline: "none",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6 py-12"
      style={{ background: "#FAFCFF" }}
    >
      <div className="w-full max-w-sm mb-8">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: "#666" }}
        >
          <ArrowLeft size={14} />
          Back to home
        </a>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-md text-gray-500">
            Sign in to your Cloud Lens account.
          </p>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-md font-semibold text-gray-700 transition-colors mb-6"
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#C8D0DA",
            background: "#FAFCFF",
          }}
        >
          <FaGithub size={17} />
          Continue with GitHub
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "#C8D0DA" }} />
          <span className="text-sm font-medium text-gray-400">
            or sign in with email
          </span>
          <div className="flex-1 h-px" style={{ background: "#C8D0DA" }} />
        </div>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-md"
              placeholder="you@company.com"
              style={inputBaseStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-md font-semibold text-gray-700">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-medium hover:underline"
                style={{ color: "#0061AA" }}
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 pr-11 text-md"
                placeholder="••••••••"
                style={inputBaseStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0"
              style={{
                borderColor: rememberMe ? "#0061AA" : "#C8D0DA",
                background: rememberMe ? "#0061AA" : "#FAFCFF",
              }}
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
            <span className="text-sm text-gray-600">
              Remember me for 30 days
            </span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full rounded-xl py-3 text-md font-black text-white transition-all hover:brightness-90 active:scale-[0.98] mt-4"
            style={{ background: "#0061AA" }}
          >
            Sign in
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/cloudlens-client-v1.0/src/features/pages/auth/Signup"
            className="font-semibold hover:underline"
            style={{ color: "#0061AA" }}
          >
            Sign up free
          </a>
        </p>
      </div>
    </div>
  );
}
