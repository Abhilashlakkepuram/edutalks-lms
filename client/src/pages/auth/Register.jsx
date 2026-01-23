import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "../../styles/auth-premium.css";

const Register = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { confirmPassword, ...dataToSubmit } = form;
    const res = await registerUser(dataToSubmit);

    if (!res.success) {
      setError(res.message);
      return;
    }

    navigate("/verify-otp", {
      state: {
        email: form.email,
        redirectTo: location.state?.redirectTo
      }
    });
  };

  return (
    <div className="auth-page-container">

      <div className="split-layout">
        {/* LEFT PANEL */}
        <div className="split-left">
          <h1 style={{ color: "#333" }}>{t('joinEduTalks').split(' ')[0]}<br /><span style={{ color: "red" }}>Edu</span><span style={{ color: "#333" }}>Talks</span></h1>
          <p style={{ color: "#333", fontWeight: "bold" }}>{t('startJourney')}</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="split-right">
          <h2>{t('createAccount')}</h2>
          <p className="subtitle" style={{ textAlign: "left", marginBottom: "20px" }}>{t('enterDetails')}</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className="premium-input"
                type="text"
                placeholder={t('firstName')}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <input
                className="premium-input"
                type="text"
                placeholder={t('lastName')}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>

            <input
              className="premium-input"
              type="email"
              placeholder={t('email')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div style={{ position: "relative" }}>
              <input
                className="premium-input"
                type={showPassword ? "text" : "password"}
                placeholder={t('password')}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingRight: "40px" }}
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

            <div style={{ position: "relative" }}>
              <input
                className="premium-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('confirmPassword')}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            </div>

            <select
              className="premium-input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">{t('student')}</option>
              <option value="instructor">{t('instructor')}</option>
            </select>

            <button type="submit" className="premium-btn">{t('register')}</button>
          </form>

          <div className="auth-footer" style={{ textAlign: "left" }}>
            {t('alreadyAccount')} <a href="/login">{t('login')}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
