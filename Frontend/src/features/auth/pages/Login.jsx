import { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.css";
import { useAuth } from "../hooks/useAuth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await handleLogin({ email, password });
    if (res && res.success) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <div className="loading-spinner" />
          <h1>Logging you in</h1>
          <p>Verifying your credentials and preparing your workspace.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="glow-circle glow-1"></div>
      <div className="glow-circle glow-2"></div>
      <div className="form-container">
        <div className="brand-header">
          <div className="brand-logo">
            <img src="/logo.png" alt="JobCopilot Logo" className="logo-img-large" />
          </div>
          <h1>JobCopilot</h1>
        </div>

        <div className="header-text">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to access your interview strategy dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail className="field-icon" size={18} strokeWidth={2.5} />
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="field-icon" size={18} strokeWidth={2.5} />
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
          <button className="button primary-button auth-submit-btn">Login</button>
        </form>
        <p className="auth-footer-text">
          Don't have an account? <Link to={"/register"}>Register</Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Login;
