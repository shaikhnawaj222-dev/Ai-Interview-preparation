import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center p-8 bg-[#0c0817] relative overflow-hidden before:content-[''] before:absolute before:w-[300px] before:height-[300px] before:bg-[rgba(0,242,254,0.05)] before:blur-[85px] before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2">
        <div className="bg-[rgba(13,17,26,0.72)] backdrop-blur-[16px] border border-[rgba(0,242,254,0.2)] rounded-2xl p-10 max-w-[480px] w-full text-center flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 animate-[spring-up_0.6s_ease_both]">
          <div className="w-[50px] h-[50px] rounded-full border-3 border-[rgba(0,242,254,0.08)] border-t-[#00f2fe] animate-spin filter drop-shadow-[0_0_8px_rgba(0,242,254,0.4)] mb-6" />
          <h1 className="m-0 text-[#00f2fe] text-[1.15rem] font-extrabold tracking-[0.08em] uppercase drop-shadow-[0_0_10px_rgba(0,242,254,0.25)] mb-2">Checking authentication</h1>
          <p className="m-0 text-[#8b949e] text-[0.85rem] leading-relaxed max-w-[380px]">Loading your user session securely.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;
