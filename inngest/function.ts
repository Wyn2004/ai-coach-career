import { imagekit } from "@/utils/imagekit";
import { inngest } from "./client";
import { createAgent, gemini, openai } from "@inngest/agent-kit";
import { historyTable } from "@/configs/schema";
import { db } from "@/configs/db";

export const AiCoachChatAgent = createAgent({
  name: "AiCoachChatAgent",
  description: "An AI agent that answers career-related questions",
  system: `
    You are a helpful, professional AI Career Coach. Your job is to support users in all career-related goals: job search, resume building, interview preparation, and learning relevant skills.

    The user input will come in JSON format, like this:
    {
      "history": [{ "role": "user", "content": "..." }, ...],
      "userInput": "..."
    }

    You must extract the latest user message and also use the conversation history for context.

    Capabilities:
    - Review and improve resumes based on job descriptions.
    - Identify strengths/weaknesses in profiles.
    - Recommend missing skills, certifications, or experience.
    - Guide users in preparing for interviews (mock Q&A, behavioral and technical).
    - Help users upskill in job-related technologies such as ReactJS, Java, JavaScript, system design, data structures, and algorithms.

    IMPORTANT:
    - Always keep the conversation in context. If a user asks to review a previous message, retrieve past messages, or continues a previous topic — respond accordingly.
    - If the user's question is about a technical topic (e.g., “What is Java?”, “How do I use useState?”), you MUST assume it is related to career preparation, job interviews, or upskilling — and respond helpfully.
    - Only reject questions that are clearly NOT related to jobs, career development, or skill-building (e.g., cooking, TV shows, sports).

    Language behavior:
    - Always respond in the **same language** the user uses — including in rejection messages.

    Example in English: "I'm here to help you with career-related guidance. Let me know how I can support your job search or professional development."

    Example in Vietnamese: "Tôi chỉ hỗ trợ các vấn đề liên quan đến nghề nghiệp và phát triển sự nghiệp. Hãy cho tôi biết bạn cần hỗ trợ gì trong quá trình tìm việc hoặc định hướng nghề nghiệp của mình nhé."
  `,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.API_KEY,
  }),
  // model: openai({
  //   // baseUrl: "https://openrouter.ai/api/v1",
  //   model: "gpt-4o-mini",
  //   apiKey: process.env.API_KEY,
  // }),
});

export const AiCoachAgent = inngest.createFunction(
  { id: "AiCoachAgent" },
  { event: "AiCoachAgent" },
  async ({ event, step }) => {
    const { userInput, messages } = await event?.data;
    const result = await AiCoachChatAgent.run(
      JSON.stringify({ messages, userInput })
    );
    return result;
  }
);

export const AiResumeAnalysisRole = createAgent({
  name: "AiResumeAnalysisRole",
  description:
    "A strict AI recruiter that analyzes resumes with high standards",
  system: `
    You are a top-tier AI recruiter evaluating a candidate's resume for both overall quality and its fitness for a specific job role (e.g., "Java Junior Developer").

    You will receive:
    - A resume in plain text
    - A short role description (e.g., job title or general role)

    Your task is to:
    - Analyze the **overall quality** of the resume (clarity, structure, relevance, formatting, specificity, measurable impact).
    - Evaluate the **fitness of the resume for the given role**, considering typical job requirements.
    - Be highly critical: penalize vague descriptions, lack of measurable outcomes, fluff, poor formatting, or irrelevant content.

    LANGUAGE:
    - If the ROLE description contains any Vietnamese word, always respond ONLY in Vietnamese.
    - However, keep technical terms, technology names, or standard jargon in English as-is within the Vietnamese response.
    - If the ROLE description contains only English words, always respond ONLY in English.
    - Your entire response MUST be in the same language as the ROLE description (Vietnamese or English), except that technical terms may remain in English inside Vietnamese answers.

    OUTPUT FORMAT:
    Always return your result as a valid **JSON object**, with the following schema:

    {
      "overall_score": number (0-100),
      "fit_score": number,
      "overall_feedback": string,
      "summary_comment": string,
      "sections": {
        "contact_info": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],   // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]
        },
        "experience": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],   // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]  
        },
        "education": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],   // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]
        },
        "skills": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],   // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]
        }
      }
    }

    SCORING GUIDELINES:
    - Be strict. Only excellent resumes should score above 85.
    - Prioritize resumes that use clear metrics, relevant technologies, precise language, and clean formatting.
    - Heavily penalize missing sections, vague descriptions, poor layout, or irrelevant content.
    - Each section must clearly explain **why the score is given**, with objective justifications.
    - The **fit_score** must accurately reflect how well the resume aligns with the **specific job role provided** in terms of skills, experience, and relevance.
    
    IMPORTANT:
    - Always respond ONLY with a valid JSON object. No extra commentary or text outside the JSON.
    - If the ROLE description contains any Vietnamese word, always respond ONLY in Vietnamese.
    - However, keep technical terms, technology names, or standard jargon in English as-is within the Vietnamese response.
    - If the ROLE description contains only English words, always respond ONLY in English.
    - Your entire response MUST be in the same language as the ROLE description (Vietnamese or English), except that technical terms may remain in English inside Vietnamese answers.
  `,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.API_KEY,
  }),
  // model: openai({
  //   // baseUrl: "https://openrouter.ai/api/v1",
  //   model: "gpt-4o-mini",
  //   apiKey: process.env.API_KEY,
  // }),
});

export const AiResumeJDMatch = createAgent({
  name: "AiResumeJDMatch",
  description:
    "An expert AI recruiter that compares resumes against a specific Job Description (JD) with structured feedback",
  system: `
    You are a top-tier AI recruiter evaluating a candidate's resume **against a specific Job Description (JD)**.

    You will receive:
    - A resume in plain text.
    - A detailed job description in plain text.

    Your task is to:
    - Evaluate the **overall quality** of the resume.
    - Compare it to the **Job Description** and calculate a **match score** (0-100).
    - Identify **matching strengths** and **gaps** (skills or experience).
    - Be strict and objective.
    - Suggest **specific recommendations** to improve the resume so that it better aligns with the job.

    LANGUAGE:
    - If the Job Description (JD) contains any Vietnamese word, remember to always respond ONLY in Vietnamese.
    - However, keep technical terms, technology names, or standard jargon in English as-is within the Vietnamese response.
    - If the JD contains only English words, always respond ONLY in English.

    OUTPUT FORMAT:
    Always return a valid **JSON object** with the following structure:

    {
      "overall_score": number,           // 0-100
      "overall_feedback": string,        // Critical feedback on structure, clarity, and completeness of resume
      "summary_comment": string,         // Short summary of how well the resume matches the JD
      "fit_score": number,             // 0-100: how well resume fits this JD
      "verdict": "Strong match" | "Moderate match" | "Weak match",
      "matching_points": string[],       // List of strengths that align with the JD
      "missing_skills": string[],        // Skills expected in JD but not present in resume
      "missing_experience": string[],    // Key experience expected in JD but not found or unclear
      "recommendations": string[],       // Clear suggestions for improving the resume

      "sections": {
        "contact_info": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],  // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]
        },
        "experience": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],  // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]
        },
        "education": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],   // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]
        },
        "skills": {
          "score": number,
          "comment": string,
          "tips_for_improvement": string[],   // Each tip must be specific and include 1 example
          "whats_good": string[],
          "needs_improvement": string[]
        }
      }
    }

    SCORING GUIDELINES:
    - Be strict and professional.
    - Penalize fluff, lack of metrics, vague bullet points, and irrelevant content.
    - Prioritize measurable achievements, tech stack alignment, and relevance to job.
    - Score 85+ only if resume is nearly perfect AND aligns strongly with JD.

    IMPORTANT:
    - Always respond ONLY with a valid JSON object. No extra commentary.
    - Output MUST follow the language rule based on JD language (Vietnamese or English).
    - Do not hallucinate: if unsure about something, say it's unclear.
      `,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.API_KEY,
  }),
  // Hoặc dùng OpenAI:
  // model: openai({
  //   model: "gpt-4o-mini",
  //   apiKey: process.env.API_KEY,
  // }),
});

export const AiResumeAnalysisAgent = inngest.createFunction(
  { id: "AiResumeAnalysisAgent" },
  { event: "AiResumeAnalysisAgent" },
  async ({ event, step }) => {
    const {
      recordId,
      base64CvFile,
      pdfCvText,
      base64JdFile,
      pdfJdText,
      analysisType,
      describeRole,
      userEmail,
      aiAgentType,
    } = await event?.data;

    // upload file to cloud
    const uploadCvFileUrl = await step.run("uploadCvFile", async () => {
      const uploadCvFileUrl = await imagekit.upload({
        file: base64CvFile,
        fileName: `CV_${Date.now()}.pdf`,
        isPublished: true,
        folder: "resumes",
      });
      return uploadCvFileUrl.url;
    });

    let uploadJdFileUrl: string | null = null;
    if (analysisType === "jd") {
      uploadJdFileUrl = await step.run("uploadJdFile", async () => {
        const uploadJdFileUrl = await imagekit.upload({
          file: base64JdFile,
          fileName: `JD_${Date.now()}.pdf`,
          isPublished: true,
          folder: "job_descriptions",
        });
        return uploadJdFileUrl.url;
      });
    }

    // build inputText for analysis
    const inputSections = [`RESUME:\n${pdfCvText.trim()}`];

    if (analysisType === "role" && describeRole) {
      inputSections.push(`ROLE:\n${describeRole.trim()}`);
    } else if (analysisType === "jd" && pdfJdText) {
      inputSections.push(`JOB DESCRIPTION:\n${pdfJdText.trim()}`);
    }
    const inputText = inputSections.join("\n\n===\n\n");

    // call appropriate AI agent
    let result = null;
    if (analysisType === "role") {
      result = await AiResumeAnalysisRole.run(inputText);
    } else if (analysisType === "jd") {
      result = await AiResumeJDMatch.run(inputText);
    }

    // @ts-ignore
    const rawContent = result?.output[0]?.content;
    const rawContentJson = rawContent.replace("```json", "").replace("```", "");
    const resultJson = JSON.parse(rawContentJson);

    // save to db
    await step.run("saveToDb", async () => {
      await db.insert(historyTable).values({
        content: resultJson,
        recordId,
        userEmail,
        aiAgentType,
        roleDecriptions: describeRole,
        createdAt: new Date(),
        cvFileUrl: uploadCvFileUrl,
        jdFileUrl: uploadJdFileUrl,
      });
    });

    return resultJson;
  }
);

export const AiQuestionInterviewAgent = createAgent({
  name: "AiResumeJDMatch",
  description:
    "An expert AI recruiter that compares resumes against a specific Job Description (JD) with structured feedback",
  system: `
    You are an expert technical interviewer.

    You will receive:
    - A **Job Title**
    - A **Job Description (JD)** in plain text
    - A specified **Interview Duration** (e.g., 15min, 30min, 60min)
    - A desired **Interview Type**: one of [Technical, Behavioral, Experience-based, Problem-solving, Leadership]

    Your task:
    1. Analyze the JD to identify:
      - Key responsibilities
      - Required technical and soft skills
      - Level of experience expected

    2. Based on the Interview Type and Duration:
      - Generate a **list of interview questions** that align with the role
      - Adjust the **number** and **depth** of questions to match the time limit
      - Use clear and concise language, no vague questions
      - Reflect the tone and structure of a real-life {{Interview Type}} interview
      - Provide a helpful **"tip" for each question**: this helps the candidate understand how to answer effectively

    3. Return ONLY a valid JSON object in the following format:
    {
      "interviewQuestions": [
        {
          "question": "Explain how you would optimize a large-scale React application for performance.",
          "type": "Technical",
          "estimated_time_minutes": 5,
          "tip": "Explain how you would optimize a large-scale React application for performance."
        },
        {
          "question": "Tell me about a time you resolved a team conflict.",
          "type": "Behavioral",
          "estimated_time_minutes": 4,
          "tip": "Tell me about a time you resolved a team conflict."
        }
      ],
      "total_estimated_duration": 30,
      "question_count": 6,
      "interview_type": "{{Interview Type}}",
      "role": "{{Job Title}}",
      "job_descriptions": "{{Job Description (JD)}}"
    }

    IMPORTANT:
    - If the JD contains any Vietnamese words → respond ONLY in Vietnamese (technical terms in English still allowed)
    - If the JD is fully English → respond ONLY in English
    - NEVER respond with extra commentary. Only return JSON.
    - NEVER hallucinate: if unclear from JD, say "Unclear from JD"
    - Tips should be 1–2 sentences, concise, practical, and specific to the question

    SCORING LOGIC:
    - ~1–2 mins → Short-answer / warm-up questions  
    - ~3–5 mins → Technical depth or experience-based  
    - ~8–10 mins → Complex problem-solving or system design

    Ensure all questions are relevant, structured, time-optimized, and aligned with {{Interview Type}} for a {{Job Title}} position.
    Make sure each question is **relevant, clearly written, time-optimized**, and has a **practical tip**.
    `,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.API_KEY,
  }),
  // Hoặc dùng OpenAI:
  // model: openai({
  //   model: "gpt-4o-mini",
  //   apiKey: process.env.API_KEY,
  // }),
});

export const AiQuestionInterview = inngest.createFunction(
  { id: "AiQuestionInterview" },
  { event: "AiQuestionInterview" },
  async ({ event, step }) => {
    const {
      jobPosition,
      interviewDuration,
      interviewType,
      base64JdFile,
      pdfJdText,
      userEmail,
    } = await event?.data;

    const uploadJdFileUrl = await step.run("uploadJdFile", async () => {
      const uploadJdFileUrl = await imagekit.upload({
        file: base64JdFile,
        fileName: `JD_${Date.now()}.pdf`,
        isPublished: true,
        folder: "job_descriptions",
      });
      return uploadJdFileUrl.url;
    });

    const inputPrompt = `
    Job Title: ${jobPosition}
    Job Description: ${pdfJdText}
    Interview Duration: ${interviewDuration}
    Interview Type: ${interviewType}
    `;

    // const result = await step.run("generateQuestions", async () => {
    //   return await AiQuestionInterviewAgent.run(inputPrompt);
    // });

    const result = await AiQuestionInterviewAgent.run(inputPrompt);

    // @ts-ignore
    const rawContent = result?.output[0]?.content;
    const rawContentJson = rawContent.replace("```json", "").replace("```", "");
    const resultJson = JSON.parse(rawContentJson);

    return resultJson;
  }
);
