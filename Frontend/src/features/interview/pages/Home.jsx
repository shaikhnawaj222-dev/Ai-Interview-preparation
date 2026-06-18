import { useState, useRef } from "react";
import "../style/home.css";
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
      <main className="loading-screen-cyber">
        <div className="loading-card-cyber">
          <div className="spinner-glow-ring" />
          <h1>GENERATING STRATEGY</h1>
          <p>
            Our intelligence engine is comparing your credentials to the job parameters. This usually takes under 30 seconds.
          </p>
        </div>
      </main>
    );
  }

  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className={`dashboard-wrapper-cyber ${sidebarOpen ? "sidebar-open-cyber" : ""}`}>
      {/* Dynamic Cyber Backdrop */}
      <div className="cyber-backdrop">
        <div className="glow-spot glow-spot-1" />
        <div className="glow-spot glow-spot-2" />
        <div className="grid-overlay" />
      </div>

      {/* Mobile Top Header */}
      <header className="mobile-header-cyber glass-panel-glow">
        <button
          className="menu-toggle-btn-cyber"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? (
            <X size={20} strokeWidth={2.5} />
          ) : (
            <Menu size={20} strokeWidth={2.5} />
          )}
        </button>
       
        <div className="user-avatar-small-cyber">{avatarLetter}</div>
      </header>

      {/* Left Sidebar Navigation */}
      <aside className="dashboard-sidebar-cyber glass-panel-glow">
        <div className="sidebar-header-cyber">
          <div className="navbar-logo-cyber">
            <div className="logo-icon-wrapper-cyber">
              <img src="/logo.png" alt="JobCopilot Logo" className="logo-img-cyber" />
            </div>
            <span className="logo-text-cyber">JobCopilot</span>
          </div>
        </div>

        {/* Sidebar Middle - Recent Plans */}
        <div className="sidebar-middle-cyber">
          <div 
            className="sidebar-section-header-cyber"
            onClick={() => setRecentStrategiesExpanded(!recentStrategiesExpanded)}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <div className="section-title-left-cyber">
              <span>Recent Strategies</span>
              <span className="count-pill-cyber">{reports?.length || 0}</span>
            </div>
            <ChevronDown 
              className={`chevron-toggle-cyber ${recentStrategiesExpanded ? "expanded" : ""}`}
              size={14} 
              strokeWidth={2.5}
            />
          </div>
          
          {recentStrategiesExpanded && (
            reports && reports.length > 0 ? (
              <ul className="sidebar-reports-list-cyber">
                {reports.map((report) => {
                  const scoreClass = report.matchScore >= 80 
                    ? "score--high-cyber" 
                    : report.matchScore >= 60 
                      ? "score--mid-cyber" 
                      : "score--low-cyber";
                  return (
                    <li
                      key={report._id}
                      className="sidebar-report-item-cyber"
                      onClick={() => {
                        setSidebarOpen(false);
                        navigate(`/interview/${report._id}`);
                      }}
                    >
                      <div className="report-info-main-cyber">
                        <span className="report-title-text-cyber" title={report.title || "Untitled Position"}>
                          {report.title || "Untitled Position"}
                        </span>
                        <span className="report-date-cyber">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="sidebar-report-actions-cyber">
                        <span className={`match-mini-badge-cyber ${scoreClass}`}>
                          {report.matchScore}%
                        </span>
                        <button
                          className="delete-report-btn-cyber"
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
              <div className="sidebar-empty-state-cyber">
                <p>No strategies generated yet.</p>
              </div>
            )
          )}
        </div>

        {/* Sidebar Footer - Profile / Logout */}
        <div className="sidebar-footer-cyber">
          <div className="user-profile-cyber">
            <div className="user-avatar-cyber">{avatarLetter}</div>
            <div className="user-details-cyber">
              <span className="user-name-cyber">{user?.username || "Developer"}</span>
              <span className="user-role-cyber">Workspace Owner</span>
            </div>
          </div>
          <button className="signout-btn-cyber" onClick={handleLogout} title="Sign Out">
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace on Right */}
      <main className="dashboard-content-cyber">
        <div className="content-inner-cyber">
          <header className="page-header-cyber">
            <h1>
              Create Your Custom <span className="highlight-cyber">Interview Plan</span>
            </h1>
          </header>

          <div className="interview-card-cyber glass-panel-glow">
            <div className="interview-card__body-cyber">
              {/* Step 1: Target Job Details */}
              <div className="wizard-step-cyber">
                <div className="step-header-cyber">
                  <div className="step-number-cyber">1</div>
                  <div className="step-title-group-cyber">
                    <h2>Target Job Description</h2>
                    <p className="step-desc-cyber">Paste the requirements or description of the role you are interviewing for</p>
                  </div>
                  <span className="badge-cyber badge--required-cyber">Required</span>
                </div>
                
                <div className="step-content-cyber">
                  <textarea
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                    }}
                    className="textarea-field-cyber"
                    placeholder={`Paste the job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                    maxLength={5000}
                    value={jobDescription}
                  />
                  <div className="char-counter-cyber">
                    <span className="char-count-badge-cyber">{jobDescription.length} / 5000 characters</span>
                  </div>
                </div>
              </div>

              <div className="step-divider-recess-cyber" />

              {/* Step 2: Professional Profile */}
              <div className="wizard-step-cyber">
                <div className="step-header-cyber">
                  <div className="step-number-cyber">2</div>
                  <div className="step-title-group-cyber">
                    <h2>Your Professional Profile</h2>
                    <p className="step-desc-cyber">Provide your background via a resume upload or a short description</p>
                  </div>
                </div>

                <div className="step-content-cyber profile-inputs-cyber">
                  {/* Left: Upload Resume */}
                  <div className="profile-inputs-column-cyber">
                    <label className="section-label-cyber">
                      Upload Resume
                      <span className="badge-cyber badge--best-cyber">Best Results</span>
                    </label>
                    
                    {fileName ? (
                      <div className="file-success-card-cyber">
                        <div className="file-info-main-cyber">
                          <FileText className="file-icon-cyber" size={20} strokeWidth={2.5} />
                          <div className="file-text-cyber">
                            <span className="file-name-cyber" title={fileName}>{fileName}</span>
                            <span className="file-size-cyber">{fileSize}</span>
                          </div>
                        </div>
                        <button className="remove-file-btn-cyber" onClick={handleRemoveFile} title="Remove File">
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <label className="dropzone-cyber" htmlFor="resume">
                        <span className="dropzone__icon-cyber">
                          <UploadCloud size={24} strokeWidth={2.5} />
                        </span>
                        <p className="dropzone__title-cyber">
                          Click to upload or drag &amp; drop
                        </p>
                        <p className="dropzone__subtitle-cyber">PDF or DOCX (Max 5MB)</p>
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
                  <div className="profile-inputs-divider-cyber">
                    <div className="vertical-line-cyber" />
                    <span className="divider-text-cyber">OR</span>
                    <div className="vertical-line-cyber" />
                  </div>

                  {/* Right: Quick Self-Description */}
                  <div className="profile-inputs-column-cyber self-description-cyber">
                    <label className="section-label-cyber" htmlFor="selfDescription">
                      Quick Self-Description
                    </label>
                    <textarea
                      onChange={(e) => {
                        setSelfDescription(e.target.value);
                      }}
                      id="selfDescription"
                      name="selfDescription"
                      className="textarea-field-cyber"
                      placeholder="Describe your background, skills, and experience if you don't have a resume handy..."
                      value={selfDescription}
                      style={{ height: "100%", minHeight: "80px", resize: "none" }}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="info-box-cyber">
                  <span className="info-box__icon-cyber">
                    <Info size={16} strokeWidth={2.5} />
                  </span>
                  <p>
                    Either a <strong>Resume</strong> or a{" "}
                    <strong>Self Description</strong> is required to generate a
                    personalized plan.
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="interview-card__footer-cyber">
              <span className="footer-info-cyber">
                AI-Powered Strategy Generation &bull; Approx 30s
              </span>
              <button onClick={handleGenerateReport} className="cyber-action-button">
                <span className="btn-inner">
                  <span className="btn-glow-span" />
                  <Sparkles size={16} strokeWidth={2.5} style={{ marginRight: "0.45rem" }} />
                  GENERATE STRATEGY
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay to close sidebar on mobile click-away */}
      {sidebarOpen && <div className="sidebar-overlay-cyber" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Home;
