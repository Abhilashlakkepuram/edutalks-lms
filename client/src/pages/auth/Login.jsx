import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "../../styles/auth-premium.css";
import { Link } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await loginUser(form);

    if (!res.success) {
      setError(res.message);
      return;
    }

    // ✅ Save token
    sessionStorage.setItem("token", res.token);
    sessionStorage.setItem("user", JSON.stringify(res.user));

    // ✅ ROLE BASED NAVIGATION
    // ✅ 4. Check for redirect intent
    if (location.state?.redirectTo) {
      navigate(location.state.redirectTo);
      return;
    }

    // ✅ 5. Default Role-Based Navigation
    if (res.user.role === "student") {
      navigate("/student/dashboard");
    } else if (res.user.role === "instructor") {
      navigate("/instructor/dashboard");
    } else if (res.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="split-layout">
        {/* LEFT PANEL */}
        {/* RIGHT PANEL */}
        <div className="split-right">
          <h2>{t('signIn')}</h2>
          <p className="subtitle" style={{ textAlign: "left", marginBottom: "30px" }}>{t('enterDetails')}</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="input-group" style={{ marginBottom: "0" }}>
              <input
                className="premium-input"
                placeholder={t('email')}
                type="email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: "0" }}>
              <div style={{ position: "relative" }}>
                <input
                  className="premium-input"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('password')}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  style={{ paddingRight: "45px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#6b7280"
                  }}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash"></i>
                  )}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", margin: "-10px 0 20px" }}>
              <Link to="/forgot-password" style={{ color: "#4f46e5", fontSize: "0.9rem", textDecoration: "none" }}>
                {t('forgotPassword')}
              </Link>
            </div>

            <button className="premium-btn">{t('signIn')}</button>
          </form>

          <div className="auth-footer" style={{ textAlign: "left", marginTop: "30px" }}>
            {t('noAccount')} <Link to="/register">{t('createAccount')}</Link>
          </div>
        </div>
        {/* LEFT PANEL (Previously RIGHT PANEL in layout depending on CSS but structurally here) */}
        <div className="split-left">
          <h1 style={{ color: "#333" }}>{t('welcome')}<br /><span style={{ color: "red" }}>{t('welcomeBack').split(' ')[1] || 'Back'}!</span></h1>
          <p style={{ color: "#333", fontWeight: "bold" }}>Login to continue your learning journey.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
