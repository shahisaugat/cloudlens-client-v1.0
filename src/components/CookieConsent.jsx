import { useState, useEffect } from "react";
import { X, ArrowLeft, Settings } from "lucide-react";

const BRAND = {
  primary: "#0061AA",
  primaryHover: "#004f8a",
  cardBg: "#FAFCFF",
  headerBg: "#F3F6FA",
  border: "#D6E6F7",
};

const COOKIE_KEY = "cloudlens_cookie_consent";

const defaultPrefs = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setTimeout(() => setVisible(true), 800);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (accepted) => {
    setSaving(true);
    const payload = {
      timestamp: Date.now(),
      preferences: accepted
        ? { necessary: true, analytics: true, marketing: true }
        : prefs,
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(payload));
    setTimeout(() => {
      setSaving(false);
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      {showManage && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />
      )}

      <div
        className="
          fixed z-50
          bottom-0 left-0 right-0 w-full
          sm:bottom-6 sm:left-6 sm:right-auto sm:w-95
          rounded-t-2xl sm:rounded-2xl
          border shadow-sm transition-all
        "
        style={{
          background: BRAND.cardBg,
          borderColor: BRAND.border,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2.5 px-5 py-3 border-b rounded-t-2xl"
          style={{
            background: BRAND.headerBg,
            borderColor: BRAND.border,
          }}
        >
          <Settings size={16} style={{ color: BRAND.primary }} />
          <span
            className="text-sm font-semibold"
            style={{ color: BRAND.primary }}
          >
            Cookie Preferences
          </span>

          <button
            onClick={() => save(false)}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* MAIN */}
        {!showManage ? (
          <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
            <p className="mb-4 sm:max-w-75">
              We use cookies to improve your experience and analyze usage.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                onClick={() => setShowManage(true)}
                className="text-sm text-gray-500 hover:text-gray-700 transition text-left"
              >
                Preferences
              </button>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => save(false)}
                  className="px-3 py-1.5 text-sm rounded-lg border"
                  style={{ borderColor: BRAND.border }}
                >
                  Reject
                </button>

                <button
                  onClick={() => save(true)}
                  className="px-3 py-1.5 text-sm rounded-lg text-white"
                  style={{ background: BRAND.primary }}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MANAGE */
          <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
            <button
              onClick={() => setShowManage(false)}
              className="flex items-center gap-1.5 text-xs font-medium mb-4 hover:opacity-70"
              style={{ color: BRAND.primary }}
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <div className="space-y-3 mb-4">
              {[
                {
                  key: "necessary",
                  label: "Strictly Necessary",
                  desc: "Required for the site to function.",
                  locked: true,
                },
                {
                  key: "analytics",
                  label: "Analytics",
                  desc: "Helps us improve the product.",
                },
                {
                  key: "marketing",
                  label: "Marketing",
                  desc: "Used for relevant content.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="rounded-lg border p-3 flex items-center justify-between"
                  style={{
                    borderColor: BRAND.border,
                    background: BRAND.headerBg,
                  }}
                >
                  <div>
                    <div className="text-xs font-semibold text-gray-800">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-gray-500">{item.desc}</div>
                  </div>

                  <button
                    disabled={item.locked}
                    onClick={() =>
                      !item.locked &&
                      setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))
                    }
                    className="relative w-9 h-5 rounded-full transition"
                    style={{
                      background: prefs[item.key] ? BRAND.primary : "#D1D5DB",
                      opacity: item.locked ? 0.5 : 1,
                    }}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition"
                      style={{
                        transform: prefs[item.key]
                          ? "translateX(16px)"
                          : "translateX(0)",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => save(false)}
              className="w-full rounded-lg py-2 text-sm font-semibold text-white"
              style={{ background: BRAND.primary }}
            >
              Save preferences
            </button>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-5 py-2.5 border-t flex items-center justify-between rounded-b-2xl"
          style={{
            borderColor: BRAND.border,
            background: BRAND.cardBg,
          }}
        >
          <span className="text-xs font-medium text-gray-500">
            Cloud Lens · Privacy first
          </span>
          <a
            href="/privacy"
            className="text-xs font-medium underline underline-offset-2 hover:opacity-70"
            style={{ color: BRAND.primary }}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </>
  );
}
