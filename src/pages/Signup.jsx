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

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            Create account
          </h1>
          <p className="text-md text-gray-500">
            Join Cloud Lens to start monitoring your CI/CD pipelines.
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
          Sign up with GitHub
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "#C8D0DA" }} />
          <span className="text-sm font-medium text-gray-400">
            or sign up with email
          </span>
          <div className="flex-1 h-px" style={{ background: "#C8D0DA" }} />
        </div>

        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-gray-700">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-md"
              placeholder="John Doe"
              style={inputBaseStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
            />
          </div>

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
            <label className="text-md font-semibold text-gray-700">
              Password
            </label>
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-gray-700">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 pr-11 text-md"
                placeholder="••••••••"
                style={inputBaseStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={() => setAgreeTerms(!agreeTerms)}
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 mt-0.5"
              style={{
                borderColor: agreeTerms ? "#0061AA" : "#C8D0DA",
                background: agreeTerms ? "#0061AA" : "#FAFCFF",
              }}
            >
              {agreeTerms && (
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
              I agree to the{" "}
              <a
                href="/terms"
                className="font-semibold hover:underline"
                style={{ color: "#0061AA" }}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold hover:underline"
                style={{ color: "#0061AA" }}
              >
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full rounded-xl py-3 text-md font-black text-white transition-all hover:brightness-90 active:scale-[0.98] mt-4"
            style={{ background: "#0061AA" }}
          >
            Create account
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: "#0061AA" }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
