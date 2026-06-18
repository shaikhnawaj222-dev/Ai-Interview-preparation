import { useState, useEffect } from "react";
import "../style/interview.css";
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

// â”€â”€ Circular Progress SVG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CircularProgress = ({ score, size = 130, strokeWidth = 9 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  let scoreColor = "score-low";
  if (score >= 80) scoreColor = "score-high";
  else if (score >= 60) scoreColor = "score-mid";

  return (
    <div className={`circular-progress ${scoreColor}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
          className="progress-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke={`url(#${score >= 80 ? "scoreHighGrad" : score >= 60 ? "scoreMidGrad" : "scoreLowGrad"})`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-text">
        <span className="progress-score">{score}</span>
        <span className="progress-percent">%</span>
      </div>
    </div>
  );
};

// â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`q-card-premium ${open ? "q-card-premium--open" : ""}`}>
      <div className="q-card-premium__header" onClick={() => setOpen((o) => !o)}>
        <div className="q-card-premium__index-box">
          <span className="index-label">Q</span>
          <span className="index-num">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="q-card-premium__question">{item.question}</p>
        <button
          className={`q-card-premium__chevron ${open ? "chevron--open" : ""}`}
          aria-label="Toggle answer accordion"
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </button>
      </div>
      <div className={`q-card-premium__body-wrapper ${open ? "is-expanded" : ""}`}>
        <div className="q-card-premium__body">
          <div className="q-card-premium__section section-intent">
            <div className="section-title-bar">
              <span className="section-icon">ðŸŽ¯</span>
              <span className="q-card-premium__tag tag--intention">Interviewer's Intent</span>
            </div>
            <p className="section-text">{item.intention}</p>
          </div>
          <div className="q-card-premium__section section-answer">
            <div className="section-title-bar">
              <span className="section-icon">ðŸ’¡</span>
              <span className="q-card-premium__tag tag--answer">Suggested Response</span>
            </div>
            <p className="section-text">{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="timeline-node">
    <div className="timeline-node__indicator">
      <div className="timeline-node__ring">
        <span className="timeline-node__day-num">{day.day}</span>
      </div>
      <div className="timeline-node__line" />
    </div>
    <div className="timeline-node__card glass-panel-glow">
      <div className="timeline-node__card-header">
        <span className="timeline-node__badge">DAY {day.day} FOCUS</span>
        <h3 className="timeline-node__focus">{day.focus}</h3>
      </div>
      <div className="timeline-node__card-divider" />
      <ul className="timeline-node__tasks">
        {day.tasks.map((task, i) => (
          <li key={i} className="timeline-task-item">
            <div className="timeline-task-checkbox">
              <Check size={14} strokeWidth={3.5} />
            </div>
            <span className="timeline-task-text">{task}</span>
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
    <div className="cyber-mock-console">
      <div className="console-header-bar">
        <div className="console-status-indicator">
          <span className="status-ping" />
          <span className="status-label">ONLINE: AI SIMULATOR</span>
        </div>
        <p className="console-subheader">Practice answers dynamically and receive critical ratings & improvements.</p>
      </div>

      <div className="selector-glass-card">
        <label htmlFor="console-question-select" className="selector-label">Select Interview prompt:</label>
        <div className="select-custom-wrapper">
          <select
            id="console-question-select"
            className="selector-select"
            value={selectedIdx}
            onChange={handleSelectChange}
          >
            {allQuestions.map((q, idx) => (
              <option key={idx} value={idx}>
                [{q.type.toUpperCase()}] {q.question.substring(0, 80)}...
              </option>
            ))}
          </select>
          <div className="select-arrow">
            <ChevronDown size={16} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="console-chat-layout">
        {/* Interviewer Hologram Bubble */}
        <div className="console-bubble interviewer-bubble">
          <div className="bubble-avatar-neon">AI</div>
          <div className="bubble-body-glass">
            <div className="bubble-header-meta">
              <span className="sender-tag">READYIQ INTERVIEWER</span>
              <span className="timestamp-tag">LIVE FEED</span>
            </div>
            <p className="bubble-main-text">{currentQ?.question}</p>
            {currentQ?.intention && (
              <div className="bubble-hint-box">
                <span className="hint-label">Intention Clue</span>
                <p className="hint-text">{currentQ.intention}</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Form Area */}
        {!evaluation && !loading && (
          <form onSubmit={handleSubmit} className="console-input-form">
            <div className="textarea-neon-group">
              <label htmlFor="candidateAnswer" className="textarea-label">Formulate Your Response</label>
              <textarea
                id="candidateAnswer"
                className="textarea-neon"
                placeholder="Type your response here... Try to leverage structured layouts like the STAR method for behavioral answers, or highlight core technical workflows."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                maxLength={4000}
                required
              />
              <div className="textarea-footer-info">
                <span className="char-count-pill">{userAnswer.length} / 4000 characters</span>
              </div>
            </div>
            <button type="submit" className="cyber-action-button" disabled={!userAnswer.trim()}>
              <span className="btn-inner">
                <span className="btn-glow-span" />
                ANALYZE PERFORMANCE
              </span>
            </button>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="console-evaluating-placeholder">
            <div className="evaluating-scanner" />
            <div className="loading-spinner-cyber" />
            <p className="evaluating-label">CRITICALLY ANALYZING CANDIDATE ANSWER...</p>
            <span className="evaluating-sublabel">Parsing vocabulary, framework alignments, and generating improved alternatives.</span>
          </div>
        )}

        {/* Evaluation Output */}
        {evaluation && (
          <div className="console-evaluation-results">
            {/* Candidate bubble showing what they typed */}
            <div className="console-bubble candidate-bubble">
              <div className="bubble-avatar-neon">YOU</div>
              <div className="bubble-body-glass">
                <div className="bubble-header-meta">
                  <span className="sender-tag">CANDIDATE ANSWER</span>
                </div>
                <p className="bubble-main-text">{userAnswer}</p>
              </div>
            </div>

            <div className="console-report-card">
              <div className="report-card-header">
                <div className="header-left">
                  <span className="header-accent-dot" />
                  <h4>PERFORMANCE EVALUATION</h4>
                </div>
                <div className="report-radial-score">
                  <span className="score-val">{evaluation.score}</span>
                  <span className="score-max">/10</span>
                </div>
              </div>
              
              <div className="report-card-grid">
                <div className="grid-col strengths-col">
                  <h5>ðŸ‘ STRENGTHS IDENTIFIED</h5>
                  <ul className="bullet-list green-bullets">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid-col improvements-col">
                  <h5>ðŸ’¡ AREAS FOR ENHANCEMENT</h5>
                  <ul className="bullet-list orange-bullets">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid-full model-answer-col">
                  <h5>âœ¨ OPTIMIZED HUMAN-LIKE SAMPLE ANSWER</h5>
                  <div className="model-quote-box">
                    <p>{evaluation.sampleAnswer}</p>
                  </div>
                </div>
              </div>

              <div className="report-card-footer">
                <button
                  onClick={() => {
                    setEvaluation(null);
                    setUserAnswer("");
                  }}
                  className="cyber-reset-button"
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

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, getReportById, loading, getResumePdf, evaluateResponse } = useInterview();
  const { interviewId } = useParams();

  const [animatedScore, setAnimatedScore] = useState(0);
  const targetScore = report?.matchScore || 0;

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, getReportById]);

  useEffect(() => {
    if (targetScore > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimatedScore(0);
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
      <main className="loading-screen-cyber">
        <div className="loading-card-cyber">
          <div className="spinner-glow-ring" />
          <h1>INITIALIZING INTERVIEW CONSOLE</h1>
          <p>Compiling matching metrics, structured roadmaps, and mock interview engines...</p>
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
    <div className="interview-page-premium">
      {/* Dynamic Cyber Backdrop */}
      <div className="cyber-backdrop">
        <div className="glow-spot glow-spot-1" />
        <div className="glow-spot glow-spot-2" />
        <div className="grid-overlay" />
      </div>

      <div className="interview-container-premium">
        {/* â”€â”€ Top Dashboard Banner â”€â”€ */}
        <header className="dashboard-banner glass-panel-glow">
          <div className="banner-meta">
            <div className="breadcrumbs">
              <Link to="/">JobCopilot Dashboard</Link>
              <span className="slash">/</span>
              <span className="current">Interview Console</span>
            </div>
            <h1 className="banner-title">{report.title}</h1>
            <div className="banner-pills">
              <span className="banner-pill pill-ai">â— GEN-AI EVALUATOR</span>
              <span className="banner-pill pill-status">ATS-VERIFIED</span>
            </div>
          </div>
          <div className="banner-actions">
            <button
              onClick={() => getResumePdf(interviewId)}
              className="cyber-download-btn"
            >
              <Download size={16} strokeWidth={2.5} style={{ marginRight: "0.5rem" }} />
              DOWNLOAD RESUME
            </button>
          </div>
        </header>

        {/* â”€â”€ Main Layout Workspace â”€â”€ */}
        <div className="workspace-grid">
          {/* â”€â”€ Left Navigation Console & Workspace Content â”€â”€ */}
          <div className="workspace-main-panel glass-panel-glow">
            {/* Horizontal Section Selector tabs */}
            <div className="selector-tabs-bar">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={`tab-btn-premium ${activeNav === item.id ? "tab-btn-premium--active" : ""}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <span className="tab-btn-icon">{item.icon}</span>
                  <span className="tab-btn-label">{item.label}</span>
                  {activeNav === item.id && <div className="tab-active-indicator" />}
                </button>
              ))}
            </div>

            {/* Active Content Window */}
            <div className="console-content-window">
              {activeNav === "technical" && (
                <div className="content-slide">
                  <div className="content-header-premium">
                    <div className="header-title-wrapper">
                      <h3>TECHNICAL INTERVIEW SYLLABUS</h3>
                      <span className="count-badge">{report.technicalQuestions.length} Questions</span>
                    </div>
                    <p className="header-desc">
                      Critical codebase concepts, systems engineering, and programming architecture prompts likely to be assessed.
                    </p>
                  </div>
                  <div className="q-cards-list">
                    {report.technicalQuestions.map((q, i) => (
                      <QuestionCard key={i} item={q} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeNav === "behavioral" && (
                <div className="content-slide">
                  <div className="content-header-premium">
                    <div className="header-title-wrapper">
                      <h3>BEHAVIORAL FIT AND VALUES</h3>
                      <span className="count-badge">{report.behavioralQuestions.length} Questions</span>
                    </div>
                    <p className="header-desc">
                      Competency checkpoints checking leadership attributes, teamwork values, adaptability, and culture alignment.
                    </p>
                  </div>
                  <div className="q-cards-list">
                    {report.behavioralQuestions.map((q, i) => (
                      <QuestionCard key={i} item={q} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeNav === "roadmap" && (
                <div className="content-slide">
                  <div className="content-header-premium">
                    <div className="header-title-wrapper">
                      <h3>DAILY CRASH PREPARATION TIMELINE</h3>
                      <span className="count-badge">{report.preparationPlan.length} Day Schedule</span>
                    </div>
                    <p className="header-desc">
                      Structured daily tasks, study vectors, and practical assignments to maximize interview output.
                    </p>
                  </div>
                  <div className="timeline-tree">
                    <div className="timeline-spine-line" />
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

          {/* â”€â”€ Right Dashboard Analytics Console â”€â”€ */}
          <aside className="workspace-side-panel">
            {/* Match Score Card */}
            <div className="analytics-card glass-panel-glow card-match-score">
              <h4 className="card-lbl">ALIGNMENT METRICS</h4>
              <div className="score-widget-box">
                <CircularProgress score={animatedScore} />
                <div className="score-details">
                  <span className="score-status">{scoreText}</span>
                  <span className="score-subtext">Candidate Profile vs JD Metrics</span>
                </div>
              </div>
            </div>

            {/* Skill Gaps Card */}
            <div className="analytics-card glass-panel-glow card-skill-gaps">
              <div className="card-header-bar">
                <h4 className="card-lbl">IDENTIFIED SKILL GAPS</h4>
                <span className="gaps-count">{report.skillGaps.length} Found</span>
              </div>
              <p className="card-desc-pill">Focus on these concepts to eliminate recruitment risk indicators.</p>
              <div className="gaps-flex-list">
                {report.skillGaps.map((gap, i) => (
                  <div key={i} className={`gap-badge-premium gap-badge-premium--${gap.severity}`}>
                    <span className="gap-indicator-dot" />
                    <span className="gap-skill-name">{gap.skill}</span>
                    <span className="gap-severity-val">{gap.severity.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="analytics-card glass-panel-glow card-quick-info">
              <h4 className="card-lbl">SYSTEM CHECKS</h4>
              <div className="info-item">
                <span className="info-key">Model Core</span>
                <span className="info-val val-neon-cyan">Gemini 2.5 Flash</span>
              </div>
              <div className="info-item">
                <span className="info-key">Status</span>
                <span className="info-val val-neon-green">Ready</span>
              </div>
              <div className="info-item">
                <span className="info-key">Interview Strategy</span>
                <span className="info-val">Tailored</span>
              </div>
              <div className="info-divider" />
              <Link to="/" className="back-feed-link">
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

