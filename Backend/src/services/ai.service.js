const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

function cleanAndTruncate(str, maxChars = 3000) {
  if (!str) return "";
  // Compress multiple spaces/newlines to a single space to save tokens
  const cleaned = str.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxChars) return cleaned;
  return cleaned.substring(0, maxChars) + "...";
}

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
  const cleanResume = cleanAndTruncate(resume, 3000);
  const cleanSelfDesc = cleanAndTruncate(selfDescription, 1000);
  const cleanJobDesc = cleanAndTruncate(jobDescription, 2000);

  const prompt = `Generate a concise interview report for a candidate.
                  
                  Candidate Data:
                  - Resume: ${cleanResume}
                  - Self Description: ${cleanSelfDesc}
                  
                  Target Position Job Description:
                  - ${cleanJobDesc}

                  CRITICAL CONSTRAINTS (TOKEN SAVING):
                  1. Generate exactly 3 highly relevant technical questions and exactly 3 behavioral questions.
                  2. Keep all intentions, answers, tasks, and descriptions brief, direct, and under 50 words per item. Avoid verbose explanations.`;

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

let browserInstance = null;

async function getBrowserInstance() {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process", "--no-zygote"],
      headless: "new"
    });
  }
  return browserInstance;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await getBrowserInstance();
  const page = await browser.newPage();
  
  try {
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

    return pdfBuffer;
  } finally {
    await page.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const cleanResume = cleanAndTruncate(resume, 3000);
  const cleanSelfDesc = cleanAndTruncate(selfDescription, 1000);
  const cleanJobDesc = cleanAndTruncate(jobDescription, 2000);

  const prompt = `Generate a highly professional, ATS-friendly resume for a candidate tailored to the target job description.

                        Candidate Data:
                        - Resume: ${cleanResume}
                        - Self Description: ${cleanSelfDesc}

                        Target Job Description:
                        - ${cleanJobDesc}

                        The response should be a JSON object with a single field "html" containing the complete HTML content of the resume.

                        STRICT STYLE & LAYOUT CONSTRAINTS:
                        You MUST use the exact HTML structure and CSS styles specified below. Do NOT alter the CSS classes, colors, fonts, margins, or padding. This is critical to keep the design and styling completely consistent for every resume generated.

                        Strict CSS stylesheet to include inside the <style> tag of the <head>:
                        \`\`\`css
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body {
                          font-family: 'Inter', sans-serif;
                          color: #334155;
                          background-color: #ffffff;
                          line-height: 1.4;
                          font-size: 10px;
                          padding: 10mm 15mm;
                        }
                        .header {
                          text-align: center;
                          border-bottom: 2px solid #0f172a;
                          padding-bottom: 8px;
                          margin-bottom: 12px;
                        }
                        .header h1 {
                          font-size: 20px;
                          font-weight: 700;
                          color: #0f172a;
                          text-transform: uppercase;
                          letter-spacing: 0.5px;
                          margin-bottom: 2px;
                        }
                        .header .title {
                          font-size: 11px;
                          font-weight: 600;
                          color: #2563eb;
                          margin-bottom: 6px;
                          text-transform: uppercase;
                          letter-spacing: 1px;
                        }
                        .header .contact {
                          display: flex;
                          justify-content: center;
                          flex-wrap: wrap;
                          gap: 12px;
                          font-size: 9px;
                          color: #475569;
                        }
                        .header .contact a {
                          color: #475569;
                          text-decoration: none;
                        }
                        .section {
                          margin-bottom: 12px;
                        }
                        .section-title {
                          font-size: 10.5px;
                          font-weight: 700;
                          color: #0f172a;
                          text-transform: uppercase;
                          letter-spacing: 0.5px;
                          border-bottom: 1px solid #cbd5e1;
                          padding-bottom: 2px;
                          margin-bottom: 6px;
                        }
                        .summary {
                          font-size: 9.5px;
                          color: #334155;
                          margin-bottom: 8px;
                          line-height: 1.45;
                          text-align: justify;
                        }
                        .item {
                          margin-bottom: 8px;
                          page-break-inside: avoid;
                        }
                        .item-header {
                          display: flex;
                          justify-content: space-between;
                          font-weight: 600;
                          color: #0f172a;
                          font-size: 10px;
                          margin-bottom: 1px;
                        }
                        .item-subheader {
                          display: flex;
                          justify-content: space-between;
                          font-size: 9px;
                          color: #475569;
                          font-style: italic;
                          margin-bottom: 3px;
                        }
                        .bullets {
                          list-style-type: disc;
                          padding-left: 12px;
                          color: #334155;
                        }
                        .bullets li {
                          margin-bottom: 2px;
                          font-size: 9.5px;
                        }
                        .skills-grid {
                          display: grid;
                          grid-template-columns: repeat(2, 1fr);
                          gap: 6px;
                        }
                        .skill-category {
                          font-size: 9.5px;
                          color: #334155;
                        }
                        .skill-category strong {
                          color: #0f172a;
                        }
                        \`\`\`

                        Strict HTML structure instructions:
                        - Enclose name, title, contact inside a div with class "header".
                        - Use sections with class "section". Inside each, put the title in a div with class "section-title" (e.g., "PROFESSIONAL SUMMARY", "WORK EXPERIENCE", "PROJECTS", "EDUCATION", "SKILLS").
                        - For summary text, use a paragraph with class "summary".
                        - For job roles, projects, or degrees, use a div with class "item".
                          - Use class "item-header" to place Title (e.g. Job Title, Project Name) on the left and Date on the right.
                          - Use class "item-subheader" to place Subtitle (Company / Institution) on the left and Location on the right.
                          - Use a list with class "bullets" for the description items.
                        - For skills, use a div with class "skills-grid" containing divs with class "skill-category".
                        
                        CRITICAL PAGE CONSTRAINTS (STRICTLY 1-2 PAGES):
                        Keep text tight and select only the most relevant experience and points so the generated HTML fits perfectly within exactly 1 or 2 A4 pages.
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
  const cleanQuestion = cleanAndTruncate(question, 1000);
  const cleanAns = cleanAndTruncate(answer, 2000);

  const prompt = `Evaluate the candidate's response to the following interview question:
                  Job Title: ${jobTitle || "Target Position"}
                  Question: ${cleanQuestion}
                  Candidate's Answer: ${cleanAns}

                  Analyze the answer critically. 
                  Provide a concise evaluation:
                  - Score out of 10.
                  - Max 3 key strengths (keep each under 15 words).
                  - Max 3 specific areas of improvement (keep each under 15 words).
                  - A highly polished, brief model/sample response (max 60 words).`;

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
