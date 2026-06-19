import { useState } from "react";
import { useNavigate, Link } from "react-router";
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
      <main className="w-full min-h-screen flex items-center justify-center p-8 bg-[#0c0817] relative overflow-hidden before:content-[''] before:absolute before:w-[300px] before:height-[300px] before:bg-[rgba(0,242,254,0.05)] before:blur-[85px] before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2">
        <div className="bg-[rgba(13,17,26,0.7)] backdrop-blur-[20px] border border-[rgba(0,242,254,0.15)] rounded-[1.25rem] p-10 shadow-[0_24px_60px_rgba(0,0,0,0.45)] w-full max-w-[480px] text-center z-10 animate-[spring-up_0.6s_cubic-bezier(0.165,0.84,0.44,1)_both]">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full border-[0.35rem] border-white/5 border-t-[#00f2fe] animate-spin" />
          <h1 className="m-0 text-[1.45rem] font-bold text-white tracking-tight">Logging you in</h1>
          <p className="mt-3.5 mx-auto mb-0 text-[#7d8590] text-[0.95rem] leading-relaxed max-w-[380px]">Verifying your credentials and preparing your workspace.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#0c0817] flex justify-center items-center relative overflow-hidden px-6 py-8">
      <div className="absolute rounded-full pointer-events-none z-1 w-[clamp(300px,45vw,550px)] h-[clamp(300px,45vw,550px)] bg-[rgba(0,242,254,0.08)] top-[10%] left-[10%] blur-[85px] animate-float-glow-1"></div>
      <div className="absolute rounded-full pointer-events-none z-1 w-[clamp(350px,55vw,650px)] h-[clamp(350px,55vw,650px)] bg-[rgba(99,102,241,0.12)] bottom-[10%] right-[10%] blur-[105px] animate-float-glow-2"></div>
      <div className="bg-[rgba(13,17,26,0.55)] backdrop-blur-[20px] border border-[rgba(0,242,254,0.15)] shadow-[0_24px_60px_rgba(0,0,0,0.45)] rounded-[1.25rem] p-10 w-full max-w-[460px] flex flex-col gap-7 z-10 hover:border-[rgba(0,242,254,0.35)] hover:shadow-[0_30px_75px_rgba(0,0,0,0.55),0_0_35px_rgba(0,242,254,0.05)] transition-all duration-300 animate-[spring-up_0.75s_cubic-bezier(0.175,0.885,0.32,1.1)_both]">
        <div className="flex items-center justify-center gap-3 -mb-1 group">
          <div className="bg-[rgba(0,242,254,0.08)] border border-[rgba(0,242,254,0.35)] rounded-lg p-1 flex items-center justify-center shadow-md animate-logo-glow-breath group-hover:rotate-[10deg] group-hover:scale-[1.05] group-hover:shadow-[0_0_20px_rgba(0,242,254,0.45),inset_0_0_8px_rgba(0,242,254,0.25)] transition-all duration-300">
            <img src="/logo.png" alt="JobCopilot Logo" className="w-8 h-8 object-cover rounded-[0.2rem] filter drop-shadow-[0_0_6px_rgba(0,242,254,0.15)]" />
          </div>
          <h1 className="text-[1.6rem] font-extrabold tracking-wider bg-linear-to-br from-white to-[#a2b2cd] bg-clip-text text-transparent m-0">JobCopilot</h1>
        </div>

        <div className="text-center">
          <h2 className="text-[1.45rem] font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-[0.9rem] text-[#7d8590] leading-relaxed m-0">Sign in to access your interview strategy dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[0.85rem] font-semibold text-[#a2b2cd] tracking-wide uppercase">Email</label>
            <div className="relative flex items-center group/input">
              <Mail className="absolute left-4 text-[#7d8590] pointer-events-none group-focus-within/input:text-[#00f2fe] group-focus-within/input:scale-105 transition-all duration-300" size={18} strokeWidth={2.5} />
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                className="w-full bg-[rgba(20,27,41,0.65)] border border-[rgba(255,255,255,0.08)] text-white px-11 py-3.5 rounded-xl text-[0.95rem] outline-none hover:border-[rgba(255,255,255,0.15)] focus:border-[#00f2fe] focus:bg-[rgba(30,37,53,0.85)] focus:shadow-[0_0_0_3px_rgba(0,242,254,0.15)] focus:animate-focus-pulse transition-all duration-300"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[0.85rem] font-semibold text-[#a2b2cd] tracking-wide uppercase">Password</label>
            <div className="relative flex items-center group/input">
              <Lock className="absolute left-4 text-[#7d8590] pointer-events-none group-focus-within/input:text-[#00f2fe] group-focus-within/input:scale-105 transition-all duration-300" size={18} strokeWidth={2.5} />
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                className="w-full bg-[rgba(20,27,41,0.65)] border border-[rgba(255,255,255,0.08)] text-white px-11 py-3.5 rounded-xl text-[0.95rem] outline-none hover:border-[rgba(255,255,255,0.15)] focus:border-[#00f2fe] focus:bg-[rgba(30,37,53,0.85)] focus:shadow-[0_0_0_3px_rgba(0,242,254,0.15)] focus:animate-focus-pulse transition-all duration-300"
                required
              />
              <button
                type="button"
                className="password-toggle absolute right-3 bg-none border-none outline-none cursor-pointer text-[#7d8590] flex items-center justify-center p-1 rounded transition-all duration-200 hover:text-white hover:bg-[rgba(255,255,255,0.05)] active:scale-95"
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
          <button className="w-full py-3.5 px-6 rounded-xl text-base font-bold bg-linear-to-r from-[#00f2fe] to-[#4facfe] shadow-[0_4px_15px_rgba(0,242,254,0.35)] text-[#0d1117] border-none outline-none cursor-pointer relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,242,254,0.5)] hover:brightness-105 active:translate-y-0 active:scale-98 before:content-[''] before:absolute before:top-0 before:left-[-150%] before:w-full before:height-full before:bg-linear-to-r before:from-transparent before:via-[rgba(255,255,255,0.35)] before:to-transparent before:skew-x-[-25deg] hover:before:animate-[shine_1.5s_infinite_ease-in-out]">Login</button>
        </form>
        <p className="text-center text-[0.9rem] text-[#7d8590] m-0">
          Don't have an account? <Link to={"/register"} className="font-semibold text-[#00f2fe] hover:text-[#4facfe] hover:underline transition-all duration-200">Register</Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Login;
