const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
  evaluateAnswer,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  let resumeText = "";
  if (req.file) {
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    resumeText = resumeContent.text || "";
  }
  const { selfDescription, jobDescription } = req.body;

  const interViewReportByAi = await generateInterviewReport({
    resume: resumeText || "Not provided",
    selfDescription: selfDescription || "Not provided",
    jobDescription,
  });

  // Ensure we have a valid job title, falling back to a snippet of the job description if the AI does not return a title
  const cleanJobDescription = jobDescription || "";
  const firstLine = cleanJobDescription.trim().split("\n")[0] || "Interview Strategy";
  const fallbackTitle = firstLine.length > 60 ? firstLine.substring(0, 57) + "..." : firstLine;

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeText,
    selfDescription,
    jobDescription,
    ...interViewReportByAi,
    title: interViewReportByAi.title || fallbackTitle || "Interview Strategy",
  });

  res.status(201).json({
    message: "Interview report generated successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport =
    await interviewReportModel.findById(interviewReportId);

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

/**
 * @description Controller to evaluate user mock interview response using Gemini.
 */
async function evaluateInterviewResponseController(req, res) {
  const { question, answer, jobTitle } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message: "Question and answer are required.",
    });
  }

  try {
    const evaluation = await evaluateAnswer({
      question,
      answer,
      jobTitle: jobTitle || "Target Position",
    });

    res.status(200).json({
      message: "Answer evaluated successfully.",
      evaluation,
    });
  } catch (error) {
    console.error("Error evaluating answer:", error);
    res.status(500).json({
      message: "Error evaluating answer.",
      error: error.message,
    });
  }
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  evaluateInterviewResponseController,
  deleteInterviewReportController,
};

/**
 * @description Controller to delete interview report by interviewId.
 */
async function deleteInterviewReportController(req, res) {
  const { interviewId } = req.params;

  try {
    const deletedReport = await interviewReportModel.findOneAndDelete({
      _id: interviewId,
      user: req.user.id,
    });

    if (!deletedReport) {
      return res.status(404).json({
        message: "Interview report not found or you are not authorized to delete it.",
      });
    }

    res.status(200).json({
      message: "Interview report deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting interview report:", error);
    res.status(500).json({
      message: "Error deleting interview report.",
      error: error.message,
    });
  }
}
