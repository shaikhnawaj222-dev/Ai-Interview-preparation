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
import html2pdf from "html2pdf.js";

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
      
      if (!response || !response.html) {
        throw new Error("No HTML content received from the server.");
      }

      // Create a temporary container for the HTML element
      const element = document.createElement("div");
      element.innerHTML = response.html;
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.top = "0";
      document.body.appendChild(element);

      // PDF configuration options
      const opt = {
        margin:       [10, 10, 10, 10], // top, left, bottom, right in mm
        filename:     `resume_${interviewReportId}.pdf`,
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true,
          logging: false
        },
        jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
      };

      // Generate PDF on client-side and download
      await html2pdf().set(opt).from(element).save();

      // Clean up the temporary container from DOM
      document.body.removeChild(element);
    } catch (error) {
      console.error("PDF download error:", error);
      let errMsg = "An error occurred while generating/downloading the PDF.";
      if (error.response?.data) {
        errMsg = error.response.data.message || errMsg;
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
