import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
  evaluateMockAnswer,
  deleteInterviewReport,
} from "../services/interview.api";
import { useContext, useEffect, useCallback } from "react";
import { InterviewContext } from "../interview.context";
import { useParams, useNavigate } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = useCallback(async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      if (response?.interviewReport) {
        setReport(response.interviewReport);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return response?.interviewReport;
  }, [setLoading, setReport]);

  const getReportById = useCallback(async (interviewId) => {
    setLoading(true);
    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      if (response?.interviewReport) {
        setReport(response.interviewReport);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport;
  }, [setLoading, setReport]);

  const getReports = useCallback(async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      if (response?.interviewReports) {
        setReports(response.interviewReports);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return response?.interviewReports;
  }, [setLoading, setReports]);

  const getResumePdf = useCallback(async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });
      
      if (response && response.type === "application/json") {
        const text = await response.text();
        const errObj = JSON.parse(text);
        alert(errObj.message || "Failed to generate PDF resume.");
        return;
      }

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("PDF download error:", error);
      let errMsg = "An error occurred while generating/downloading the PDF.";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errObj = JSON.parse(text);
          errMsg = errObj.message || errMsg;
        } catch (e) {
          // ignore
        }
      } else if (error.message) {
        errMsg = error.message;
      }
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const evaluateResponse = useCallback(async ({ question, answer, jobTitle }) => {
    try {
      const response = await evaluateMockAnswer({ question, answer, jobTitle });
      return response.evaluation;
    } catch (error) {
      console.error("Error in evaluateResponse:", error);
      throw error;
    }
  }, []);

  const deleteReport = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteInterviewReport(id);
      setReports((prev) => prev ? prev.filter((r) => r._id !== id) : []);
      if (interviewId === id) {
        setReport(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReports, setReport, interviewId, navigate]);

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId, getReportById, getReports]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
    evaluateResponse,
    deleteReport,
  };
};
