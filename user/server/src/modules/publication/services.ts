import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function to convert a buffer to a GoogleGenerativeAI.Part object
function bufferToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

type Info = {
  title: string;
  author: string;
  language: string;
  pages: string;
  description: string;
};

function generatePrompt({ title, author, language, pages, description }: Info) {
  const prompt = `You're a content reviewer and you're given a pdf file, a cover image, and some metadata for review. The submitted metadata are: Title: ${title}, Author: ${author}, Language: ${language}, Number of pages: ${pages}, and Description: ${description}. Kindly review the files (both pdf and image) and the submitted metadata and perform the checks below IN ORDER. For each step, if you detect a problem, STOP and return the JSON result described at the end:

    1) Metadata vs content: Compare the metadata to the pdf file and the cover image. If the title/author/language/pages/description clearly do NOT reflect the document content (e.g., title claims a cookbook but text is fiction, or description contains links/promotions not present in the document), RETURN Not Approved with one short reason.

    2) Sexual / explicit / harmful content: Check for sexually explicit content intended for pornographic use, non-educational explicit sexual acts, or other content that violates policy (harmful/graphic sexual content, extremist praise, etc.). If found, RETURN Not Approved with one short reason.

    3) Proprietary content & watermarks: Inspect for ISBN numbers, visible watermarks, signatures, or other indications the content is proprietary or requires permission. If present, RETURN Not Approved with one short reason.

    4) Duplicate / plagiarism indicators: Perform a web search to decide whether a registered, trademarked, or proprietary identical or near-identical publication exist online that suggest plagiarism or unauthorized duplication. If you find clear duplication, RETURN Not Approved with one short reason.
  
    5) Other red flags: Optionally flag any other significant issues (malicious links, personal data leakage, or obvious ethical or legal violations). If any issue is found, RETURN Not Approved with one short reason.

    If none of the above checks fail, RETURN Approved.
  
    RESPONSE FORMAT (MUST be valid JSON and nothing else — do not include prose around it):
    {
      "status": "<Approved|Not Approved>",
      "reason": "<single-sentence reason if Not Approved; otherwise empty string or null>"
    }

    Rules for the reason field:
      - If status is "Approved", reason MUST be an empty string "" or null.
      - If status is "Not Approved", reason MUST be a single concise sentence (no lists, no newlines), explaining the primary reason.

   Be concise and only output the JSON object.`;

  return prompt;
}

function extractJsonFromString(s: string) {
  if (!s || typeof s !== "string") return null;

  // remove common markdown/code-fence wrappers first
  const cleaned = s
    .replace(/```(?:json)?/g, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function promiseTextFromResponse(response: any) {
  // Prefer text(), then known candidate path, then output_text
  if (!response) return null;
  if (typeof response.text === "function") return response.text();
  if (response?.candidates?.[0]?.content?.parts?.[0]?.text)
    return response.candidates[0].content.parts[0].text;
  if (response?.candidates?.[0]?.content?.text)
    return response.candidates[0].content.text;
  if (response?.output_text) return response.output_text;
  return typeof response === "string" ? response : JSON.stringify(response);
}

// export const reviewContent = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { title, author, pages, description } = req.body;
//     const prompt = generatePrompt({ title, author, pages, description });

//     const files = req.files as
//       | { [field: string]: Express.Multer.File[] }
//       | undefined;
//     if (!files?.file?.length || !files?.cover?.length) {
//       return res.status(400).json({ error: "No PDF or cover image provided." });
//     }

//     const pdfFile = files.file[0];
//     const imageFile = files.cover[0];

//     const pdf_buffer = pdfFile.buffer;
//     const pdf_mimetype = pdfFile.mimetype;
//     const pdf_size = pdfFile.size;

//     const image_buffer = imageFile.buffer;
//     const image_mimetype = imageFile.mimetype;
//     const image_size = imageFile.size;

//     if (!pdf_mimetype?.startsWith?.("application/pdf")) {
//       return res.status(400).json({ error: "Uploaded file is not a PDF." });
//     }

//     if (!image_mimetype?.startsWith?.("image/")) {
//       return res.status(400).json({ error: "Uploaded file is not an image." });
//     }
//     const MAX_BYTES = 10 * 1024 * 1024;
//     if (pdf_size > MAX_BYTES || image_size > MAX_BYTES) {
//       return res.status(413).json({ error: "PDF or image file is too large." });
//     }

//     try {
//       // Prepare the files for Gemini
//       const imagePart = bufferToGenerativePart(image_buffer, image_mimetype);
//       const pdfPart = bufferToGenerativePart(pdf_buffer, pdf_mimetype);

//       // Build model call payload
//       const modelInput = {
//         model: MODEL,
//         contents: [prompt, pdfPart, imagePart],
//       };

//       // Call Gemini
//       const response = await ai.models.generateContent(modelInput);

//       // Extract text from the sdk response defensively
//       let textOut = promiseTextFromResponse(response);

//       // Try parse JSON (strict), then fallback extraction
//       const parsed = extractJsonFromString(textOut);
//       if (!parsed || typeof parsed !== "object") {
//         console.error(
//           "Failed to parse JSON from Gemini response. Raw output:",
//           textOut
//         );
//         return res.status(500).json({
//           error: "Failed to parse Gemini's JSON response.",
//           geminiRawResponse: textOut,
//         });
//       }

//       // Validate required keys
//       const status =
//         parsed.status && typeof parsed.status === "string"
//           ? parsed.status.trim()
//           : null;
//       const reason =
//         parsed.reason && typeof parsed.reason === "string"
//           ? parsed.reason.trim()
//           : null;

//       if (!status) {
//         return res.status(500).json({
//           error:
//             "Gemini returned JSON but required keys are missing or invalid.",
//           geminiJson: parsed,
//         });
//       }

//       // Return the title and description
//       return res.json({ status, reason });
//     } catch (err) {
//       console.error("Error reviewing content:", err);
//       return res.status(500).json({
//         error: "Failed to analyze content.",
//         details: err,
//       });
//     }
//   }
// );

export const reviewPublication = async (info: Info, files: any) => {
  const { title, author, language, pages, description } = info;
  const prompt = generatePrompt({ title, author, language, pages, description });

  if (!files?.file?.length || !files?.cover?.length) {
    return { error: "No PDF or cover image provided." };
  }

  const pdfFile = files.file[0];
  const imageFile = files.cover[0];

  const pdf_buffer = pdfFile.buffer;
  const pdf_mimetype = pdfFile.mimetype;
  const pdf_size = pdfFile.size;

  const image_buffer = imageFile.buffer;
  const image_mimetype = imageFile.mimetype;
  const image_size = imageFile.size;

  if (!pdf_mimetype?.startsWith?.("application/pdf")) {
    return { error: "Uploaded file is not a PDF." };
  }

  if (!image_mimetype?.startsWith?.("image/")) {
    return { error: "Uploaded file is not an image." };
  }

  const MAX_BYTES = 10 * 1024 * 1024;
  if (pdf_size > MAX_BYTES || image_size > MAX_BYTES) {
    return { error: "PDF or image file is too large." };
  }

  try {
    // Prepare the files for Gemini
    const imagePart = bufferToGenerativePart(image_buffer, image_mimetype);
    const pdfPart = bufferToGenerativePart(pdf_buffer, pdf_mimetype);

    // Build model call payload
    const modelInput = {
      model: MODEL,
      contents: [prompt, pdfPart, imagePart],
    };

    // Call Gemini
    const response = await ai.models.generateContent(modelInput);

    // Extract text from the sdk response defensively
    let textOut = promiseTextFromResponse(response);

    // Try parse JSON (strict), then fallback extraction
    const parsed = extractJsonFromString(textOut);
    if (!parsed || typeof parsed !== "object") {
      console.error(
        "Failed to parse JSON from Gemini response. Raw output:",
        textOut
      );
      return {
        error: "Failed to parse Gemini's JSON response.",
        geminiRawResponse: textOut,
      };
    }

    // Validate required keys
    const status =
      parsed.status && typeof parsed.status === "string"
        ? parsed.status.trim()
        : null;
    const reason =
      parsed.reason && typeof parsed.reason === "string"
        ? parsed.reason.trim()
        : null;

    if (!status) {
      return {
        error: "Gemini returned JSON but required keys are missing or invalid.",
        geminiJson: parsed,
      };
    }

    // Return the title and description
    return { status, reason };
  } catch (err) {
    console.error("Error reviewing publication:", err);
    return {
      error: "Failed to analyze publication.",
      details: err,
    };
  }
};
