import { useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { 
  X, 
  Menu, 
  ChevronDown, 
  Trash2, 
  LogOut, 
  FileText, 
  UploadCloud, 
  Info, 
  Sparkles 
} from "lucide-react";

const Home = () => {
  const { loading, generateReport, reports, deleteReport } = useInterview();
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentStrategiesExpanded, setRecentStrategiesExpanded] = useState(false);
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeInMb} MB`);
    } else {
      setFileName("");
      setFileSize("");
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
    setFileName("");
    setFileSize("");
  };

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];
    if (!jobDescription.trim()) {
      alert("Please enter a target job description.");
      return;
    }
    if (!resumeFile && !selfDescription.trim()) {
      alert("Please upload a resume or provide a quick self-description.");
      return;
    }
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-[#0c0817] flex items-center justify-center p-8 relative overflow-hidden before:content-[''] before:absolute before:w-[300px] before:height-[300px] before:bg-[rgba(0,242,254,0.05)] before:blur-[85px] before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2">
        <div className="bg-[rgba(13,17,26,0.72)] backdrop-blur-lg border border-[rgba(0,242,254,0.2)] rounded-2xl p-10 max-w-[480px] w-full text-center flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 animate-[spring-up_0.6s_ease_both]">
          <div className="w-[50px] h-[50px] rounded-full border-3 border-[rgba(0,242,254,0.08)] border-t-[#00f2fe] animate-spin filter drop-shadow-[0_0_8px_rgba(0,242,254,0.4)] mb-6" />
          <h1 className="m-0 text-[#00f2fe] text-[1.15rem] font-extrabold tracking-[0.08em] uppercase drop-shadow-[0_0_10px_rgba(0,242,254,0.25)] mb-2">GENERATING STRATEGY</h1>
          <p className="m-0 text-[#8b949e] text-[0.85rem] leading-relaxed max-w-[380px]">
            Our intelligence engine is comparing your credentials to the job parameters. This usually takes under 30 seconds.
          </p>
        </div>
      </main>
    );
  }

  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative w-full min-h-screen bg-[#0c0817] text-[#e6edf3] font-sans overflow-x-hidden flex">
      {/* Dynamic Cyber Backdrop */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full filter blur-[130px] opacity-[0.28] top-[-5%] right-[10%] w-[550px] h-[550px] bg-[radial-gradient(circle,#a78bfa_0%,transparent_80%)] animate-float-glow-1" />
        <div className="absolute rounded-full filter blur-[130px] opacity-[0.28] bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-[radial-gradient(circle,#00f2fe_0%,transparent_80%)] animate-float-glow-2" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[40px_40px] bg-position-[center_top]" />
      </div>

      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 w-full h-[70px] z-30 px-6 flex items-center justify-between bg-[#0d111a]/72 backdrop-blur-[18px] border-b border-[rgba(255,255,255,0.06)] rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] lg:hidden">
        <button
          className="bg-white/2 border border-[rgba(255,255,255,0.06)] text-[#e6edf3] w-[38px] h-[38px] rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/5 active:scale-95 transition-all duration-200"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? (
            <X size={20} strokeWidth={2.5} />
          ) : (
            <Menu size={20} strokeWidth={2.5} />
          )}
        </button>
       
        <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[0.8rem] font-extrabold text-[#00f2fe] bg-[#00f2fe]/8 border border-[rgba(0,242,254,0.35)] shadow-[0_0_10px_rgba(0,242,254,0.15)]">{avatarLetter}</div>
      </header>

      {/* Left Sidebar Navigation */}
      <aside className={`fixed top-0 left-0 z-40 w-70 h-screen flex flex-col p-6 lg:p-8 bg-[#0d111a]/72 backdrop-blur-[18px] border-r border-[rgba(255,255,255,0.06)] rounded-r-3xl transition-transform duration-300 ease-out shadow-[0_10px_40px_rgba(0,0,0,0.45)] lg:translate-x-0 ${sidebarOpen ? "translate-x-0 shadow-[10px_0_40px_rgba(0,0,0,0.6)]" : "-translate-x-full"}`}>
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-lg bg-[#00f2fe]/8 border border-[rgba(0,242,254,0.25)] flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,242,254,0.1)]">
              <img src="/logo.png" alt="JobCopilot Logo" className="w-[22px] h-[22px] object-contain" />
            </div>
            <span className="text-[1.3rem] font-extrabold tracking-tight text-white">JobCopilot</span>
          </div>
        </div>

        {/* Sidebar Middle - Recent Plans */}
        <div className="flex-1 flex flex-col overflow-y-auto gap-4 mb-6 pr-1 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
          <div 
            className="flex items-center justify-between text-[0.725rem] font-black tracking-[0.08em] text-[#8b949e] uppercase p-2 mb-2 cursor-pointer select-none rounded hover:bg-white/3 hover:text-[#e6edf3] transition-all duration-200"
            onClick={() => setRecentStrategiesExpanded(!recentStrategiesExpanded)}
          >
            <div className="flex items-center gap-2">
              <span>Recent Strategies</span>
              <span className="text-[0.65rem] font-black px-2.5 py-0.5 rounded-full text-[#a78bfa] bg-[#a78bfa]/8 border border-[rgba(167,139,250,0.25)]">{reports?.length || 0}</span>
            </div>
            <ChevronDown 
              className={`transition-transform duration-300 ease-in-out text-[#8b949e] shrink-0 ${recentStrategiesExpanded ? "rotate-180 text-[#a78bfa]" : ""}`}
              size={14} 
              strokeWidth={2.5}
            />
          </div>
          
          {recentStrategiesExpanded && (
            reports && reports.length > 0 ? (
              <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
                {reports.map((report) => {
                  const scoreClass = report.matchScore >= 80 
                    ? "text-[#3fb950] border-[#3fb950]/25 bg-[#3fb950]/5" 
                    : report.matchScore >= 60 
                      ? "text-[#f5a623] border-[#f5a623]/25 bg-[#f5a623]/5" 
                      : "text-[#ff4d4d] border-[#ff4d4d]/25 bg-[#ff4d4d]/5";
                  return (
                    <li
                      key={report._id}
                      className="group flex items-center justify-between p-3.5 rounded-xl cursor-pointer gap-3 border border-[rgba(255,255,255,0.06)] bg-white/1.5 hover:bg-white/3.5 hover:border-[rgba(167,139,250,0.25)] hover:shadow-[0_4px_15px_rgba(167,139,250,0.15)] hover:translate-x-0.5 transition-all duration-300 ease-out"
                      onClick={() => {
                        setSidebarOpen(false);
                        navigate(`/interview/${report._id}`);
                      }}
                    >
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <span className="text-[0.85rem] font-bold text-white truncate" title={report.title || "Untitled Position"}>
                          {report.title || "Untitled Position"}
                        </span>
                        <span className="text-[0.7rem] text-[#8b949e]">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[0.725rem] font-extrabold px-2.5 py-1 rounded-full border ${scoreClass}`}>
                          {report.matchScore}%
                        </span>
                        <button
                          className="bg-transparent border-none text-[#484f58] hover:text-[#ff4d4d]! hover:bg-[#ff4d4d]/10 hover:shadow-[0_0_8px_rgba(255,77,77,0.25)] cursor-pointer p-1.5 rounded flex items-center justify-center transition-all duration-250"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this strategy?")) {
                              deleteReport(report._id);
                            }
                          }}
                          title="Delete Strategy"
                          aria-label="Delete Strategy"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-6 text-center rounded-xl border border-dashed border-[rgba(255,255,255,0.06)] bg-black/15">
                <p className="m-0 text-[0.8rem] text-[#8b949e]">No strategies generated yet.</p>
              </div>
            )
          )}
        </div>

        {/* Sidebar Footer - Profile / Logout */}
        <div className="p-4 rounded-2xl flex items-center justify-between gap-3 border border-[rgba(255,255,255,0.06)] bg-black/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[0.9rem] font-black text-[#00f2fe] bg-[#00f2fe]/8 border border-[rgba(0,242,254,0.35)] shrink-0 shadow-[0_0_10px_rgba(0,242,254,0.15)]">{avatarLetter}</div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[0.8rem] font-bold text-white truncate">{user?.username || "Developer"}</span>
              <span className="text-[0.65rem] text-[#8b949e]">Workspace Owner</span>
            </div>
          </div>
          <button className="bg-white/2 border border-[rgba(255,255,255,0.06)] text-[#8b949e] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:text-[#ff4d4d] hover:border-[#ff4d4d]/30 hover:bg-[#ff4d4d]/5 hover:shadow-[0_0_10px_rgba(255,77,77,0.2)] transition-all duration-300" onClick={handleLogout} title="Sign Out">
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace on Right */}
      <main className="flex-1 lg:ml-[280px] p-6 lg:p-12 pt-24 lg:pt-12 z-10 relative">
        <div className="max-w-240 mx-auto">
          <header className="mb-10 text-left">
            <h1 className="m-0 text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Create Your Custom <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-[#a78bfa] drop-shadow-[0_0_12px_rgba(167,139,250,0.35)]">Interview Plan</span>
            </h1>
          </header>

          <div className="p-6 lg:p-8 bg-[#0d111a]/72 backdrop-blur-[18px] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-white/10 transition-all duration-300">
            <div className="flex flex-col gap-6">
              {/* Step 1: Target Job Details */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.85rem] font-black text-[#a78bfa] bg-[#a78bfa]/8 border border-[rgba(167,139,250,0.25)] shadow-[0_0_10px_rgba(167,139,250,0.15)]">1</div>
                  <div className="flex-1">
                    <h2 className="m-0 text-[0.95rem] font-bold text-white">Target Job Description</h2>
                    <p className="m-0 mt-1 text-[0.75rem] text-[#8b949e]">Paste the requirements or description of the role you are interviewing for</p>
                  </div>
                  <span className="text-[0.65rem] font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase border text-[#ff4d4d] border-[#ff4d4d]/25 bg-[#ff4d4d]/5">Required</span>
                </div>
                
                <div className="flex flex-col">
                  <textarea
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                    }}
                    className="w-full min-h-30 bg-black/20 border border-[rgba(255,255,255,0.06)] rounded-lg text-white px-4 py-3 font-inherit text-[0.9rem] leading-relaxed outline-none resize-y hover:border-white/10 focus:border-[#00f2fe]/45 focus:bg-black/30 focus:shadow-[0_0_15px_rgba(0,242,254,0.12)] transition-all duration-300"
                    placeholder={`Paste the job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                    maxLength={5000}
                    value={jobDescription}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[0.65rem] font-bold text-[#8b949e] px-2.5 py-0.5 rounded-full bg-white/3 border border-[rgba(255,255,255,0.06)]">{jobDescription.length} / 5000 characters</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/6 my-2" />

              {/* Step 2: Professional Profile */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.85rem] font-black text-[#a78bfa] bg-[#a78bfa]/8 border border-[rgba(167,139,250,0.25)] shadow-[0_0_10px_rgba(167,139,250,0.15)]">2</div>
                  <div className="flex-1">
                    <h2 className="m-0 text-[0.95rem] font-bold text-white">Your Professional Profile</h2>
                    <p className="m-0 mt-1 text-[0.75rem] text-[#8b949e]">Provide your background via a resume upload or a short description</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
                  {/* Left: Upload Resume */}
                  <div className="flex flex-col gap-3 min-w-0">
                    <label className="flex items-center gap-3 text-[0.775rem] font-bold uppercase tracking-wider text-[#8b949e]">
                      Upload Resume
                      <span className="text-[0.65rem] font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase border text-[#3fb950] border-[#3fb950]/25 bg-[#3fb950]/5">Best Results</span>
                    </label>
                    
                    {fileName ? (
                      <div className="flex items-center justify-between p-4 rounded-xl gap-4 border border-[#3fb950]/30 bg-[#3fb950]/4 shadow-[0_4px_15px_rgba(63,185,80,0.05)]">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <FileText className="text-[#3fb950] shrink-0 filter drop-shadow-[0_0_5px_rgba(63,185,80,0.4)]" size={20} strokeWidth={2.5} />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[0.85rem] font-bold text-white truncate" title={fileName}>{fileName}</span>
                            <span className="text-[0.7rem] text-[#8b949e]">{fileSize}</span>
                          </div>
                        </div>
                        <button className="bg-white/2 border border-[rgba(255,255,255,0.06)] text-[#8b949e] w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:text-[#ff4d4d] hover:border-[#ff4d4d]/30 hover:bg-[#ff4d4d]/5" onClick={handleRemoveFile} title="Remove File">
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 cursor-pointer text-center bg-black/15 border-2 border-dashed border-[rgba(0,242,254,0.25)] rounded-xl hover:bg-[#00f2fe]/2 hover:border-[#00f2fe] hover:shadow-[0_0_20px_rgba(0,242,254,0.12)] transition-all duration-300" htmlFor="resume">
                        <span className="w-8 h-8 rounded-full bg-[#00f2fe]/8 border border-[rgba(0,242,254,0.25)] flex items-center justify-center text-[#00f2fe] mb-2 shadow-[0_0_10px_rgba(0,242,254,0.15)]">
                          <UploadCloud size={24} strokeWidth={2.5} />
                        </span>
                        <p className="m-0 text-[0.9rem] font-bold text-white mb-1">
                          Click to upload or drag &amp; drop
                        </p>
                        <p className="m-0 text-[0.75rem] text-[#8b949e]">PDF or DOCX (Max 5MB)</p>
                      </label>
                    )}
                    <input
                      ref={resumeInputRef}
                      hidden
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Middle: OR Divider */}
                  <div className="flex flex-row lg:flex-col items-center justify-center gap-3 self-stretch py-1 lg:py-0">
                    <div className="w-full lg:w-px h-px lg:h-full bg-white/6" />
                    <span className="text-[0.725rem] font-black text-[#8b949e]">OR</span>
                    <div className="w-full lg:w-px h-px lg:h-full bg-white/6" />
                  </div>

                  {/* Right: Quick Self-Description */}
                  <div className="flex flex-col gap-3 min-w-0">
                    <label className="flex items-center gap-3 text-[0.775rem] font-bold uppercase tracking-wider text-[#8b949e]" htmlFor="selfDescription">
                      Quick Self-Description
                    </label>
                    <textarea
                      onChange={(e) => {
                        setSelfDescription(e.target.value);
                      }}
                      id="selfDescription"
                      name="selfDescription"
                      className="w-full bg-black/20 border border-[rgba(255,255,255,0.06)] rounded-lg text-white px-4 py-3 font-inherit text-[0.9rem] leading-relaxed outline-none resize-none hover:border-white/10 focus:border-[#00f2fe]/45 focus:bg-black/30 focus:shadow-[0_0_15px_rgba(0,242,254,0.12)] transition-all duration-300 h-full min-h-20"
                      placeholder="Describe your background, skills, and experience if you don't have a resume handy..."
                      value={selfDescription}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="flex p-3 rounded-lg items-start gap-3.5 bg-[#00f2fe]/2 border border-[#00f2fe]/15">
                  <span className="text-[#00f2fe] mt-0.5 shrink-0 filter drop-shadow-[0_0_4px_rgba(0,242,254,0.3)]">
                    <Info size={16} strokeWidth={2.5} />
                  </span>
                  <p className="m-0 text-[0.8rem] leading-normal text-[#8b949e]">
                    Either a <strong>Resume</strong> or a{" "}
                    <strong>Self Description</strong> is required to generate a
                    personalized plan.
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/6 mt-4 flex-wrap gap-4">
              <span className="text-[0.7rem] text-[#8b949e] font-semibold">
                AI-Powered Strategy Generation &bull; Approx 30s
              </span>
              <button onClick={handleGenerateReport} className="group relative bg-transparent border-none p-0 cursor-pointer outline-none font-inherit transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-px w-full sm:w-auto">
                <span className="flex items-center justify-center bg-linear-to-br from-[#0d1527] to-[#151e33] border border-[rgba(0,242,254,0.25)] text-[#00f2fe] font-extrabold text-[0.825rem] tracking-wider px-8 py-3.5 rounded-lg shadow-[0_4px_15px_rgba(0,242,254,0.08)] relative overflow-hidden transition-all duration-300 ease-out hover:bg-none hover:bg-[#00f2fe] hover:text-[#0c0817] hover:shadow-[0_0_22px_rgba(0,242,254,0.45)]">
                  <span className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-all duration-500 group-hover:left-full" />
                  <Sparkles size={16} strokeWidth={2.5} style={{ marginRight: "0.45rem" }} />
                  GENERATE STRATEGY
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay to close sidebar on mobile click-away */}
      {sidebarOpen && <div className="fixed top-0 left-0 w-full h-full bg-black/55 backdrop-blur-xs z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Home;
