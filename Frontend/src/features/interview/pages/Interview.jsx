import { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useParams, Link } from "react-router";
import { Code, MessageSquare, Calendar, Bot, ChevronDown, Check, Download, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Skills",
    icon: <Code size={18} strokeWidth={2.5} />,
  },
  {
    id: "behavioral",
    label: "Behavioral Fits",
    icon: <MessageSquare size={18} strokeWidth={2.5} />,
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: <Calendar size={18} strokeWidth={2.5} />,
  },
  {
    id: "mock",
    label: "AI Interviewer",
    icon: <Bot size={18} strokeWidth={2.5} />,
  },
];

// ── Circular Progress SVG ──────────────────────────────────────────────────
const CircularProgress = ({ score, size = 130, strokeWidth = 9 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id="scoreHighGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#3fb950" />
          </linearGradient>
          <linearGradient id="scoreMidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5a623" />
            <stop offset="100%" stopColor="#ffb300" />
          </linearGradient>
          <linearGradient id="scoreLowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="100%" stopColor="#ff2d78" />
          </linearGradient>
        </defs>
        <circle
          className="fill-none stroke-white/3"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={`fill-none stroke-linecap-round transition-[stroke-dashoffset] duration-800 ease-out ${score >= 80 ? "drop-shadow-[0_0_6px_rgba(63,185,80,0.5)]" : score >= 60 ? "drop-shadow-[0_0_6px_rgba(245,166,35,0.5)]" : "drop-shadow-[0_0_6px_rgba(255,77,77,0.5)]"}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke={`url(#${score >= 80 ? "scoreHighGrad" : score >= 60 ? "scoreMidGrad" : "scoreLowGrad"})`}
        />
      </svg>
      <div className="absolute flex items-baseline justify-center">
        <span className="text-[2.2rem] font-black text-white leading-none">{score}</span>
        <span className="text-[0.95rem] font-bold text-[#8b949e] ml-0.5">%</span>
      </div>
    </div>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/1.5 border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden transition-all duration-300 ease-out hover:bg-white/2.5 hover:border-[rgba(167,139,250,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:translate-x-1">
      <div className="flex items-center p-4.5 lg:p-5 gap-5 cursor-pointer select-none" onClick={() => setOpen((o) => !o)}>
        <div className="flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-[#a78bfa]/8 border border-[#a78bfa]/18 shrink-0 shadow-[inset_0_0_6px_rgba(167,139,250,0.1)]">
          <span className="text-[0.6rem] font-extrabold text-[#a78bfa] uppercase leading-none mb-0.5">Q</span>
          <span className="text-[1rem] font-extrabold text-white leading-none">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="flex-1 m-0 text-[0.95rem] font-semibold leading-relaxed text-[#e6edf3]">{item.question}</p>
        <button
          className={`transition-transform duration-300 ease-out text-[#8b949e] hover:text-[#a78bfa] shrink-0 p-1 ${open ? "rotate-180 text-[#a78bfa]!" : ""}`}
          aria-label="Toggle answer accordion"
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </button>
      </div>
      <div className="transition-[max-height] duration-400 ease-out overflow-hidden" style={{ maxHeight: open ? "600px" : "0" }}>
        <div className="p-6 pt-4.5 border-t border-white/5 flex flex-col gap-4.5">
          <div className="p-4.5 rounded-lg flex flex-col gap-2.5 border border-white/3 bg-[#a78bfa]/2 border-l-[3px] border-l-[#a78bfa]">
            <div className="flex items-center gap-2">
              <span className="text-[0.95rem]">🎯</span>
              <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#a78bfa]">Interviewer's Intent</span>
            </div>
            <p className="m-0 text-[0.875rem] leading-relaxed text-[#cbd5e1]">{item.intention}</p>
          </div>
          <div className="p-4.5 rounded-lg flex flex-col gap-2.5 border border-white/3 bg-[#3fb950]/2 border-l-[3px] border-l-[#3fb950]">
            <div className="flex items-center gap-2">
              <span className="text-[0.95rem]">💡</span>
              <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#3fb950]">Suggested Response</span>
            </div>
            <p className="m-0 text-[0.875rem] leading-relaxed text-[#cbd5e1]">{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="flex gap-7 relative">
    <div className="relative w-11 flex justify-center shrink-0">
      <div className="absolute top-4 w-10 h-10 rounded-full bg-[#0c0817] border-3 border-[#ff2d78] flex items-center justify-center z-10 shadow-[0_0_15px_rgba(255,45,120,0.35)]">
        <span className="text-[1.1rem] font-black text-white">{day.day}</span>
      </div>
    </div>
    <div className="flex-1 p-6 bg-[#0d111a]/72 backdrop-blur-[18px] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-white/10 transition-all duration-300">
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.65rem] font-extrabold tracking-wider text-[#ff2d78]">DAY {day.day} FOCUS</span>
        <h3 className="m-0 text-[1.15rem] font-bold text-white">{day.focus}</h3>
      </div>
      <div className="h-px bg-white/5 my-4" />
      <ul className="list-none m-0 p-0 flex flex-col gap-3">
        {day.tasks.map((task, i) => (
          <li key={i} className="flex gap-3.5 items-start">
            <div className="w-4.5 h-4.5 rounded bg-[#00f2fe]/6 border border-[rgba(0,242,254,0.25)] flex items-center justify-center mt-0.5 shrink-0">
              <Check size={14} className="text-[#00f2fe]" strokeWidth={3.5} />
            </div>
            <span className="text-[0.9rem] leading-relaxed text-[#cbd5e1]">{task}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const MockInterviewConsole = ({ report, evaluateResponse }) => {
  const allQuestions = [
    ...(report?.technicalQuestions || []).map((q) => ({ ...q, type: "Technical" })),
    ...(report?.behavioralQuestions || []).map((q) => ({ ...q, type: "Behavioral" })),
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedIdx(Number(e.target.value));
    setUserAnswer("");
    setEvaluation(null);
  };

  const currentQ = allQuestions[selectedIdx];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setLoading(true);
    setEvaluation(null);
    try {
      const result = await evaluateResponse({
        question: currentQ.question,
        answer: userAnswer,
        jobTitle: report.title,
      });
      setEvaluation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5 border-b border-dashed border-white/8 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_10px_#00f2fe]" />
          <span className="text-[0.75rem] font-black tracking-wider text-[#00f2fe]">ONLINE: AI SIMULATOR</span>
        </div>
        <p className="m-0 text-[0.875rem] text-[#8b949e]">Practice answers dynamically and receive critical ratings & improvements.</p>
      </div>

      <div className="bg-black/20 border border-white/4 rounded-xl p-4.5 lg:p-6 flex flex-col gap-2.5">
        <label htmlFor="console-question-select" className="text-[0.75rem] font-bold uppercase tracking-wider text-[#8b949e]">Select Interview prompt:</label>
        <div className="relative w-full">
          <select
            id="console-question-select"
            className="w-full appearance-none bg-[#101520] border border-[rgba(255,255,255,0.06)] text-white px-4 py-3 pr-10 rounded-lg outline-none font-inherit text-[0.9rem] cursor-pointer transition-all duration-300 focus:border-[#a78bfa]/50 focus:shadow-[0_0_15px_rgba(167,139,250,0.15)]"
            value={selectedIdx}
            onChange={handleSelectChange}
          >
            {allQuestions.map((q, idx) => (
              <option key={idx} value={idx}>
                [{q.type.toUpperCase()}] {q.question.substring(0, 80)}...
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b949e] pointer-events-none">
            <ChevronDown size={16} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-black/15 border border-white/3 p-7 rounded-xl">
        <div className="flex gap-5 items-start">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-[0.75rem] font-black tracking-wider shrink-0 bg-linear-to-br from-[#00f2fe] to-[#a78bfa] text-white shadow-[0_0_15px_rgba(167,139,250,0.35)]">AI</div>
          <div className="flex-1 p-4.5 lg:p-6 rounded-xl leading-relaxed bg-[#a78bfa]/4 border border-[#a78bfa]/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.725rem] font-black tracking-wider text-[#a78bfa]">READYIQ INTERVIEWER</span>
              <span className="text-[0.65rem] text-[#484f58] font-bold">LIVE FEED</span>
            </div>
            <p className="m-0 text-[0.95rem] whitespace-pre-wrap text-white">{currentQ?.question}</p>
            {currentQ?.intention && (
              <div className="mt-3.5 bg-white/2 border border-white/4 rounded px-3.5 py-2.5">
                <span className="block text-[0.65rem] font-black uppercase text-[#a78bfa] mb-1">Intention Clue</span>
                <p className="m-0 text-[0.8rem] text-[#8b949e]">{currentQ.intention}</p>
              </div>
            )}
          </div>
        </div>

        {!evaluation && !loading && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="candidateAnswer" className="text-[0.75rem] font-black tracking-wider text-[#8b949e] uppercase">Formulate Your Response</label>
              <textarea
                id="candidateAnswer"
                className="w-full min-h-32.5-[#0d121c] border border-[rgba(255,255,255,0.06)] rounded-lg text-white p-4 font-inherit text-[0.925rem] leading-relaxed outline-none resize-y transition-all duration-300 focus:border-[#ff2d78]/45 focus:shadow-[0_0_15px_rgba(255,45,120,0.12)]"
                placeholder="Type your response here... Try to leverage structured layouts like the STAR method for behavioral answers, or highlight core technical workflows."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                maxLength={4000}
                required
              />
              <div className="flex justify-end">
                <span className="text-[0.65rem] font-bold text-[#8b949e] bg-white/2 border border-white/5 px-2.5 py-0.5 rounded-full">{userAnswer.length} / 4000 characters</span>
              </div>
            </div>
            <button type="submit" className="relative self-start bg-transparent border-none p-0 cursor-pointer outline-none group" disabled={!userAnswer.trim()}>
              <span className="flex items-center justify-center bg-linear-to-brrom-[#ff2d78] to-[#d91c5c] text-white font-extrabold text-[0.85rem] tracking-wider px-9 py-3.5 rounded-lg shadow-[0_4px_20px_rgba(255,45,120,0.28)] relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(255,45,120,0.6)]">
                <span className="absolute top-0 -left-1/2 w-[30%] h-full bg-linear-to-r from-transparent via-white/35 to-transparent skew-x-[-30deg] transition-all duration-750 group-hover:left-[150%]" />
                ANALYZE PERFORMANCE
              </span>
            </button>
          </form>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center p-12 bg-black/25 border border-dashed border-white/8 rounded-xl relative overflow-hidden">
            <div className="w-11 h-11 rounded-full border-3 border-[#00f2fe]/10 border-t-[#00f2fe] animate-spin shadow-[0_0_10px_rgba(0,242,254,0.15)] mb-5" />
            <p className="m-0 text-[0.95rem] font-black tracking-wider text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.25)] mb-1 text-center">CRITICALLY ANALYZING CANDIDATE ANSWER...</p>
            <span className="text-[0.775rem] text-[#8b949e] text-center">Parsing vocabulary, framework alignments, and generating improved alternatives.</span>
          </div>
        )}

        {evaluation && (
          <div className="flex flex-col gap-7">
            <div className="flex gap-5 items-start flex-row-reverse">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[0.75rem] font-black tracking-wider shrink-0 bg-linear-to-brrom-[#00f2fe] to-[#0080ff] text-[#05070c] shadow-[0_0_15px_rgba(0,242,254,0.35)]">YOU</div>
              <div className="flex-1 p-4.5 lg:p-6 rounded-xl leading-relaxed bg-[#00f2fe]/3 border border-[#00f2fe]/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.725rem] font-black tracking-wider text-[#00f2fe]">CANDIDATE ANSWER</span>
                </div>
                <p className="m-0 text-[0.95rem] whitespace-pre-wrap text-white text-left">{userAnswer}</p>
              </div>
            </div>

            <div className="bg-[#101621]/85 border border-[#a78bfa] rounded-xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.4)]">
              <div className="p-5 lg:px-7 bg-white/1.5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d78] shadow-[0_0_8px_#ff2d78]" />
                  <h4 className="m-0 text-[1.05rem] font-black tracking-wider text-white">PERFORMANCE EVALUATION</h4>
                </div>
                <div className="bg-[#ff2d78]/6 border border-[#ff2d78]/25 shadow-[0_0_12px_rgba(255,45,120,0.15)] px-4 py-1.5 rounded-full flex items-baseline gap-0.5">
                  <span className="text-[1.35rem] font-black text-[#ff2d78]">{evaluation.score}</span>
                  <span className="text-[0.8rem] font-bold text-[#8b949e]">/10</span>
                </div>
              </div>
              
              <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="flex flex-col gap-3">
                  <h5 className="m-0 text-[0.825rem] font-black tracking-wider text-[#3fb950]">👍 STRENGTHS IDENTIFIED</h5>
                  <ul className="list-disc pl-5 flex flex-col gap-2 marker:text-[#3fb950]">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i} className="text-[0.875rem] leading-relaxed text-[#cbd5e1]">{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <h5 className="m-0 text-[0.825rem] font-black tracking-wider text-[#f5a623]">💡 AREAS FOR ENHANCEMENT</h5>
                  <ul className="list-disc pl-5 flex flex-col gap-2 marker:text-[#f5a623]">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i} className="text-[0.875rem] leading-relaxed text-[#cbd5e1]">{imp}</li>
                    ))}
                  </ul>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
                  <h5 className="m-0 text-[0.825rem] font-black tracking-wider text-[#a78bfa]">✨ OPTIMIZED HUMAN-LIKE SAMPLE ANSWER</h5>
                  <div className="bg-[#a78bfa]/2 border border-[#a78bfa]/15 p-4.5 lg:p-6 rounded-lg leading-relaxed">
                    <p className="m-0 text-[0.925rem] text-[#cbd5e1] italic">{evaluation.sampleAnswer}</p>
                  </div>
                </div>
              </div>

              <div className="p-4.5 lg:px-7 bg-black/20 border-t border-white/4">
                <button
                  onClick={() => {
                    setEvaluation(null);
                    setUserAnswer("");
                  }}
                  className="bg-transparent border border-white/12 text-white px-5 py-2.5 text-[0.8rem] font-bold tracking-wider rounded transition-all duration-300 hover:border-white hover:bg-white/4 cursor-pointer"
                >
                  PRACTICE ANOTHER ANSWER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, getReportById, loading, getResumePdf, evaluateResponse } = useInterview();
  const { interviewId } = useParams();

  const [animatedScore, setAnimatedScore] = useState(0);
  const [prevTargetScore, setPrevTargetScore] = useState(0);
  const targetScore = report?.matchScore || 0;

  if (targetScore !== prevTargetScore) {
    setPrevTargetScore(targetScore);
    setAnimatedScore(0);
  }

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, getReportById]);

  useEffect(() => {
    if (targetScore > 0) {
      let start = 0;
      const duration = 900;
      const stepTime = Math.max(Math.floor(duration / targetScore), 8);
      
      const timer = setInterval(() => {
        start += 1;
        setAnimatedScore(start);
        if (start >= targetScore) {
          clearInterval(timer);
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [targetScore]);

  if (loading || !report) {
    return (
      <main className="w-full min-h-screen bg-[#0c0817] flex items-center justify-center p-8 relative overflow-hidden before:content-[''] before:absolute before:w-[300px] before:height-[300px] before:bg-[rgba(0,242,254,0.05)] before:blur-[85px] before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2">
        <div className="bg-[rgba(13,17,26,0.72)] backdrop-blur-lg border border-[rgba(0,242,254,0.2)] rounded-2xl p-10 max-w-120 w-full text-center flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
          <div className="w-[50px] h-[50px] rounded-full border-3 border-[rgba(0,242,254,0.08)] border-t-[#00f2fe] animate-spin mb-6" />
          <h1 className="m-0 text-[#00f2fe] text-[1.15rem] font-extrabold tracking-[0.08em] uppercase mb-2">INITIALIZING INTERVIEW CONSOLE</h1>
          <p className="m-0 text-[#8b949e] text-[0.85rem] leading-relaxed max-w-[380px]">Compiling matching metrics, structured roadmaps, and mock interview engines...</p>
        </div>
      </main>
    );
  }

  const scoreText =
    report.matchScore >= 80
      ? "EXCELLENT ALIGNMENT"
      : report.matchScore >= 60
        ? "GOOD PROSPECT"
        : "DEVELOPMENT REQUIRED";

  return (
    <div className="relative w-full min-h-screen bg-[#0c0817] text-[#e6edf3] font-sans overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full filter blur-[130px] opacity-[0.28] top-[5%] right-[15%] w-[450px] h-[450px] bg-[radial-gradient(circle,#00f2fe_0%,transparent_80%)]" />
        <div className="absolute rounded-full filter blur-[130px] opacity-[0.28] bottom-[15%] left-[5%] w-125 h-125 bg-[radial-gradient(circle,#ff2d78_0%,transparent_80%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[40px_40px] bg-position-[center_top]" />
      </div>

      <div className="relative z-10 w-full max-w-330 mx-auto p-6 lg:p-10 flex flex-col gap-7">
        <header className="bg-[#0d111a]/72 backdrop-blur-[18px] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-white/10 transition-all duration-300 p-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[0.8rem] text-[#8b949e]">
              <Link to="/" className="text-[#8b949e] no-underline hover:text-[#00f2fe] transition-colors duration-200">JobCopilot Dashboard</Link>
              <span className="text-[#484f58]">/</span>
              <span className="text-[#e6edf3]">Interview Console</span>
            </div>
            <h1 className="m-0 text-2xl lg:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-[#a78bfa]">{report.title}</h1>
            <div className="flex gap-2.5">
              <span className="text-[0.725rem] font-bold tracking-wider px-2.5 py-0.5 rounded-full border text-[#00f2fe] bg-[#00f2fe]/6 border-[#00f2fe]/25">● GEN-AI EVALUATOR</span>
              <span className="text-[0.725rem] font-bold tracking-wider px-2.5 py-0.5 rounded-full border text-[#a78bfa] bg-[#a78bfa]/6 border-[#a78bfa]/25">ATS-VERIFIED</span>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <button
              onClick={() => getResumePdf(interviewId)}
              className="w-full sm:w-auto flex items-center justify-center bg-linear-to-br from-[#0d1527] to-[#151e33] border border-[rgba(0,242,254,0.25)] text-[#00f2fe] font-bold text-[0.8rem] tracking-wider px-5 py-3 rounded-lg shadow-[0_4px_15px_rgba(0,242,254,0.08)] cursor-pointer transition-all duration-300 ease-out hover:bg-none hover:bg-[#00f2fe] hover:text-[#0c0817] hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] hover:-translate-y-0.5"
            >
              <Download size={16} strokeWidth={2.5} style={{ marginRight: "0.5rem" }} />
              DOWNLOAD RESUME
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[3.2fr_1fr] gap-7">
          <div className="bg-[#0d111a]/72 backdrop-blur-[18px] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-white/10 transition-all duration-300 flex flex-col p-0 overflow-hidden">
            <div className="flex bg-black/25 border-b border-white/6 p-2 gap-1.5 flex-wrap">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center gap-2.5 bg-transparent border-none px-5 py-3 text-[#8b949e] font-semibold text-[0.875rem] cursor-pointer relative rounded-lg transition-all duration-300 hover:text-white hover:bg-white/3 ${activeNav === item.id ? "text-[#ff2d78]! bg-[#ff2d78]/6 hover:text-[#ff2d78]! hover:bg-[#ff2d78]/6!" : ""}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <span className={`tab-btn-icon ${activeNav === item.id ? "text-[#ff2d78]" : ""}`}>{item.icon}</span>
                  <span className="tab-btn-label">{item.label}</span>
                  {activeNav === item.id && <div className="absolute bottom-0 left-[10%] right-[10%] h-[3px] bg-linear-to-r from-transparent via-[#ff2d78] to-transparent rounded-full" />}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-9 flex-1 overflow-y-auto max-h-[calc(100vh-15rem)] scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {activeNav === "technical" && (
                <div>
                  <div className="flex flex-col gap-2 mb-8 border-b border-dashed border-white/8 pb-5">
                    <div className="flex items-center justify-between gap-6">
                      <h3 className="m-0 text-[1.15rem] font-extrabold tracking-wider text-[#a78bfa]">TECHNICAL INTERVIEW SYLLABUS</h3>
                      <span className="text-[0.725rem] font-bold text-white bg-white/4 border border-white/8 px-2.5 py-0.5 rounded-full">{report.technicalQuestions.length} Questions</span>
                    </div>
                    <p className="m-0 text-[0.875rem] text-[#8b949e] leading-relaxed">
                      Critical codebase concepts, systems engineering, and programming architecture prompts likely to be assessed.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {report.technicalQuestions.map((q, i) => (
                      <QuestionCard key={i} item={q} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeNav === "behavioral" && (
                <div>
                  <div className="flex flex-col gap-2 mb-8 border-b border-dashed border-white/8 pb-5">
                    <div className="flex items-center justify-between gap-6">
                      <h3 className="m-0 text-[1.15rem] font-extrabold tracking-wider text-[#a78bfa]">BEHAVIORAL FIT AND VALUES</h3>
                      <span className="text-[0.725rem] font-bold text-white bg-white/4 border border-white/8 px-2.5 py-0.5 rounded-full">{report.behavioralQuestions.length} Questions</span>
                    </div>
                    <p className="m-0 text-[0.875rem] text-[#8b949e] leading-relaxed">
                      Competency checkpoints checking leadership attributes, teamwork values, adaptability, and culture alignment.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {report.behavioralQuestions.map((q, i) => (
                      <QuestionCard key={i} item={q} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeNav === "roadmap" && (
                <div>
                  <div className="flex flex-col gap-2 mb-8 border-b border-dashed border-white/8 pb-5">
                    <div className="flex items-center justify-between gap-6">
                      <h3 className="m-0 text-[1.15rem] font-extrabold tracking-wider text-[#a78bfa]">DAILY CRASH PREPARATION TIMELINE</h3>
                      <span className="text-[0.725rem] font-bold text-white bg-white/4 border border-white/8 px-2.5 py-0.5 rounded-full">{report.preparationPlan.length} Day Schedule</span>
                    </div>
                    <p className="m-0 text-[0.875rem] text-[#8b949e] leading-relaxed">
                      Structured daily tasks, study vectors, and practical assignments to maximize interview output.
                    </p>
                  </div>
                  <div className="relative flex flex-col gap-8">
                    <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-linear-to-b from-[#ff2d78] via-[#a78bfa] to-transparent rounded" />
                    {report.preparationPlan.map((day) => (
                      <RoadMapDay key={day.day} day={day} />
                    ))}
                  </div>
                </div>
              )}

              {activeNav === "mock" && (
                <MockInterviewConsole report={report} evaluateResponse={evaluateResponse} />
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-5 xl:flex xl:flex-col animate-[panelSlideInRight_0.7s_ease_both]">
            {/* Match Score Card */}
            <div className="bg-[#0d111a]/72 backdrop-blur-[18px] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-white/10 transition-all duration-300 p-6">
              <h4 className="margin-0 text-[0.75rem] font-extrabold tracking-wider text-[#8b949e] uppercase">ALIGNMENT METRICS</h4>
              <div className="flex flex-col items-center gap-5 mt-5">
                <CircularProgress score={animatedScore} />
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[0.85rem] font-extrabold tracking-wider text-[#00f2fe]">{scoreText}</span>
                  <span className="text-[0.725rem] text-[#8b949e]">Candidate Profile vs JD Metrics</span>
                </div>
              </div>
            </div>

            {/* Skill Gaps Card */}
            <div className="bg-[#0d111a]/72 backdrop-blur-[18px] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-white/10 transition-all duration-300 p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="margin-0 text-[0.75rem] font-extrabold tracking-wider text-[#8b949e] uppercase">IDENTIFIED SKILL GAPS</h4>
                <span className="text-[0.7rem] font-extrabold text-[#ff2d78] bg-[#ff2d78]/6 border border-[#ff2d78]/20 px-2.5 py-0.5 rounded-full">{report.skillGaps.length} Found</span>
              </div>
              <p className="m-0 text-[0.775rem] text-[#8b949e] leading-relaxed mb-4">Focus on these concepts to eliminate recruitment risk indicators.</p>
              <div className="flex flex-col gap-2.5">
                {report.skillGaps.map((gap, i) => {
                  const severityClass = gap.severity === "high"
                    ? "bg-[#ff4d4d]/3 border-[#ff4d4d]/16 text-[#ff4d4d]"
                    : gap.severity === "medium"
                      ? "bg-[#f5a623]/3 border-[#f5a623]/16 text-[#f5a623]"
                      : "bg-[#3fb950]/3 border-[#3fb950]/16 text-[#3fb950]";

                  const dotColor = gap.severity === "high"
                    ? "bg-[#ff4d4d] shadow-[0_0_6px_#ff4d4d]"
                    : gap.severity === "medium"
                      ? "bg-[#f5a623] shadow-[0_0_6px_#f5a623]"
                      : "bg-[#3fb950] shadow-[0_0_6px_#3fb950]";

                  return (
                    <div key={i} className={`flex items-center px-3.5 py-2.5 rounded-lg border gap-2.5 transition-all duration-250 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:border-white/15 ${severityClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                      <span className="flex-1 text-[0.8rem] font-semibold text-white truncate">{gap.skill}</span>
                      <span className="text-[0.6rem] font-black tracking-wider uppercase">{gap.severity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[#0d111a]/72 backdrop-blur-[18px] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-white/10 transition-all duration-300 p-6 lg:col-span-2 xl:col-span-1 flex flex-col gap-3">
              <h4 className="margin-0 text-[0.75rem] font-extrabold tracking-wider text-[#8b949e] uppercase">SYSTEM CHECKS</h4>
              <div className="flex justify-between items-center text-[0.8rem] py-1">
                <span className="text-[#8b949e]">Model Core</span>
                <span className="text-[#00f2fe] font-semibold">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between items-center text-[0.8rem] py-1">
                <span className="text-[#8b949e]">Status</span>
                <span className="text-[#3fb950] font-semibold">Ready</span>
              </div>
              <div className="flex justify-between items-center text-[0.8rem] py-1">
                <span className="text-[#8b949e]">Interview Strategy</span>
                <span className="text-white font-semibold">Tailored</span>
              </div>
              <div className="h-px bg-white/5 my-1" />
              <Link to="/" className="flex items-center text-[#8b949e] text-[0.75rem] font-extrabold tracking-wider no-underline hover:text-[#ff2d78] transition-colors duration-200 align-self-start">
                <ArrowLeft size={14} strokeWidth={3.5} style={{ marginRight: "0.4rem" }} />
                EXIT CONSOLE FEED
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Interview;

