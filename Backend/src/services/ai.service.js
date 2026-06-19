const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// JSON schemas specified using standard JSON Schema format for Gemini API
const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "integer",
      description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    },
    technicalQuestions: {
      type: "array",
      description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The technical question can be asked in the interview",
          },
          intention: {
            type: "string",
            description: "The intention of interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description: "How to answer this question, what points to cover, what approach to take etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The behavioral question can be asked in the interview",
          },
          intention: {
            type: "string",
            description: "The intention of interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description: "How to answer this question, what points to cover, what approach to take etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      description: "List of skill gaps in the candidate's profile along with their severity",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill which the candidate is lacking",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
            description: "The day number in the preparation plan, starting from 1",
          },
          focus: {
            type: "string",
            description: "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          },
          tasks: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
    title: {
      type: "string",
      description: "The title of the job for which the interview report is generated",
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title",
  ],
};

const resumePdfSchema = {
  type: "object",
  properties: {
    html: {
      type: "string",
      description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
    },
  },
  required: ["html"],
};

const answerEvaluationSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      description: "A score between 1 and 10 indicating how good the candidate's answer is, where 10 is perfect.",
    },
    strengths: {
      type: "array",
      items: {
        type: "string",
      },
      description: "List of strengths or positive aspects in the candidate's answer.",
    },
    improvements: {
      type: "array",
      items: {
        type: "string",
      },
      description: "List of specific areas where the candidate's answer can be improved or what they missed.",
    },
    sampleAnswer: {
      type: "string",
      description: "A highly optimized, professional sample answer incorporating all best practices for this question.",
    },
  },
  required: ["score", "strengths", "improvements", "sampleAnswer"],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "12mm",
      bottom: "12mm",
      left: "12mm",
      right: "12mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate a highly professional, ATS-friendly resume for a candidate tailored to the target job description.

                        Candidate Data:
                        - Resume: ${resume}
                        - Self Description: ${selfDescription}

                        Target Job Description:
                        - ${jobDescription}

                        The response should be a JSON object with a single field "html" containing the complete HTML content of the resume.

                        CRITICAL CONSTRAINTS (STRICTLY 1-2 PAGES MAX):
                        1. The entire resume content and design MUST fit cleanly within exactly 1 or 2 A4 pages when printed or converted to PDF. No extra trailing pages or overflow allowed.
                        2. Implement a compact, modern CSS layout in the HTML style block:
                           - Set body font-size to 10px - 11px for text, 13px - 14px for section headers.
                           - Use compact line heights (1.2 - 1.3) and narrow margins/padding (e.g., 4px - 10px).
                           - Utilize clean layout patterns (such as a two-column sidebar grid or a flexbox row structure) to maximize horizontal space.
                           - Apply page-break-inside rules (e.g., page-break-inside: avoid) to prevent card sections from breaking awkwardly.
                        3. Focus on quality rather than quantity. Keep descriptions crisp and bulleted instead of verbose paragraphs.
                        4. The design must look extremely premium, clean, modern, and human-written.
                    `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumePdfSchema,
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

async function evaluateAnswer({ question, answer, jobTitle }) {
  const prompt = `Evaluate the candidate's response to the following interview question:
                  Job Title: ${jobTitle}
                  Question: ${question}
                  Candidate's Answer: ${answer}

                  Analyze the answer critically. Provide an evaluation including a score out of 10, a list of strengths, key areas for improvement, and a highly polished model/sample response that follows best industry practices.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: answerEvaluationSchema,
    },
  });

  return JSON.parse(response.text);
}

module.exports = { generateInterviewReport, generateResumePdf, evaluateAnswer };
