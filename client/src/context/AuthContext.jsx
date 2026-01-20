import { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Fake register
  const register = async (data) => {
    setLoading(true);
    setError(null);
    console.log("REGISTER:", data);
    showToast("Registration submitted", "info");
    setLoading(false);
    return true;
  };

  // Fake OTP verify
  const verifyOtp = async (otp) => {
    setLoading(true);
    console.log("VERIFY OTP:", otp);
    setLoading(false);
    return true;
  };

  // Fake login
  const login = async (data) => {
    setLoading(true);
    console.log("LOGIN:", data);
    setUser({ email: data.email, role: "student" });
    showToast("Logged in", "success");
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, register, verifyOtp, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
