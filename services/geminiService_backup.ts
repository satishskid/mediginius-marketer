
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ContentGenerationParams, ChannelType } from '../types';
import { GEMINI_API_MODEL_NAME, IMAGEN_API_MODEL_NAME } from '../constants';

// Store client instances mapped by API key to support multiple user keys if needed,
// though current app state uses one active key set at a time.
// For simplicity, we'll re-initialize if the key changes.
let activeGeminiClient: GoogleGenAI | null = null;
let activeApiKey: string | null = null;

const initializeGeminiClient = (apiKey: string): GoogleGenAI | null => {
  if (activeGeminiClient && activeApiKey === apiKey) {
    return activeGeminiClient;
  }

  if (!apiKey) {
    console.warn("Attempted to initialize Gemini client without an API key.");
    return null;
  }
  try {
    const client = new GoogleGenAI({ apiKey });
    activeGeminiClient = client;
    activeApiKey = apiKey;
    console.log("GoogleGenAI client initialized/updated successfully with a new key.");
    return client;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    activeGeminiClient = null;
    activeApiKey = null;
    return null;
  }
};

// This function primarily checks if the process.env.API_KEY is available.
// The app will now favor user-inputted keys for actual operations.
export const checkDefaultGeminiEnvKey = (): string | null => {
    return process.env.API_KEY || null;
};


const createPrompt = (params: ContentGenerationParams, channel: ChannelType): string => {
  const { specialty, location, targetAudience, topic, tone } = params;
  
  let basePrompt = `You are an expert Indian healthcare marketing assistant. Your client is a ${specialty} clinic/practice in ${location}, targeting ${targetAudience}.`;

  if (topic) {
    basePrompt += ` The content should focus on the topic of: "${topic}".`;
  }
  if (tone) {
    basePrompt += ` The desired tone is: "${tone}".`;
  } else {
    // Default tone instruction if not specified
    basePrompt += ` The tone should generally be helpful, trustworthy, empathetic, and patient-centric.`;
  }
  
  basePrompt += ` Avoid generic hashtags like #healthcare or #hospital unless specifically asked. Focus on benefits and clear communication.
  Use Indian context and sensibilities where appropriate (e.g., local references if sensible, common Indian English).`;

  switch (channel) {
    case ChannelType.INSTAGRAM:
      return `${basePrompt}
      Generate an engaging Instagram post (caption text only). 
      Include 3-4 relevant local and topical hashtags. 
      Make it concise and impactful for Instagram's format.`;
    case ChannelType.FACEBOOK:
      return `${basePrompt}
      Generate a Facebook post. This can be slightly longer and more informative than an Instagram post. 
      Consider including a question to encourage engagement. 
      Include 2-3 relevant hashtags.`;
    case ChannelType.WHATSAPP:
      return `${basePrompt}
      Generate a short, friendly WhatsApp message or status update. 
      It should be easily shareable and provide a clear call to action or piece of information. 
      Keep it very concise.`;
    case ChannelType.GOOGLE_BUSINESS:
      return `${basePrompt}
      Generate a Google Business Profile update. 
      This should be informative, highlighting a specific service, offer, or health tip. 
      Include a clear call to action (e.g., 'Learn More', 'Book Now', 'Call Us').`;
    case ChannelType.BLOG_IDEA:
      return `${basePrompt}
      Generate a structured blog post outline, formatted for easy use in a HubSpot (or similar CMS) blog.
      Provide the following:
      1. H1 Title: A catchy and SEO-friendly title for the blog post.
      2. Summary/Lede Paragraph: A brief 2-4 sentence summary of what the blog post will cover, engaging the reader.
      3. H2 Subheadings: Suggest 2-4 relevant H2 subheadings for the main sections of the blog post body.
      4. Meta Description: A concise meta description (around 150-160 characters) for SEO purposes.
      The content should be relevant and valuable to the target audience. Ensure clear separation for each part (e.g., "H1 Title:", "Summary:", "H2 Subheadings:", "Meta Description:").`;
    case ChannelType.AD_COPY:
      return `${basePrompt}
      Generate ad copy suitable for Google Ads and Facebook Ads.
      Provide:
      1. Google Ad: Headline 1 (max 30 chars), Headline 2 (max 30 chars), Description 1 (max 90 chars).
      2. Facebook Ad: Primary Text (2-3 sentences), Headline (1 short sentence).
      Focus on a strong call to action and highlight key benefits.`;
    case ChannelType.IMAGE_PROMPT:
      return `${basePrompt}
      Generate a detailed text-to-image prompt for an AI image generator. 
      The image should be visually appealing and relevant to the specialty, location, target audience, topic, and tone. 
      Describe: scene, subjects, style (e.g., photorealistic, illustration, warm, professional), mood, and any key visual elements.
      The prompt should be concise but descriptive enough for an image generator.
      Example format: "Photorealistic image of a friendly ${specialty} doctor consulting a smiling ${targetAudience} patient in a modern, well-lit clinic in ${location}. Topic focus: ${topic || 'general health'}. Tone: ${tone || 'warm, inviting'}. Bright lighting. Close-up shot focusing on compassionate interaction."`;
    case ChannelType.VIDEO_SCRIPT:
      return `${basePrompt}
      Generate a short video script (approx 30-60 seconds) for an Instagram Reel or YouTube Short.
      The script should be engaging and informative.
      Include:
      - SCENE descriptions (1-2 scenes max)
      - VOICEOVER or ON-SCREEN TEXT for each scene
      - VISUALS description for each scene
      - A clear CALL TO ACTION at the end.
      Format clearly. For example:
      SCENE 1: [Description]
      VO/TEXT: [Text]
      VISUALS: [Description]`;
    default:
      return `${basePrompt} Generate a relevant piece of marketing content for ${channel}.`;
  }
};

export const generateContentWithGemini = async (
  params: ContentGenerationParams,
  channel: ChannelType,
  userProvidedApiKey: string | null // User-provided key takes precedence
): Promise<string> => {
  const apiKeyToUse = userProvidedApiKey || checkDefaultGeminiEnvKey();

  if (!apiKeyToUse) {
     throw new Error("Gemini API key not available. Please provide it in the API Wallet or ensure API_KEY environment variable is set for default use.");
  }
  
  const aiClient = initializeGeminiClient(apiKeyToUse);
  if (!aiClient) { 
    throw new Error("Failed to initialize Gemini AI client with the provided key.");
  }

  const prompt = createPrompt(params, channel);

  try {
    const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: GEMINI_API_MODEL_NAME,
        contents: prompt,
    });
    
    const text = response.text;
    if (typeof text !== 'string') {
        console.error("Unexpected response format from Gemini API:", response);
        throw new Error("Received unexpected response format from Gemini API.");
    }
    return text.trim();

  } catch (error: any) {
    console.error("Error calling Gemini API for text generation:", error);
    if (error.message && (error.message.includes("API key not valid") || error.message.includes("invalid api key"))) {
        throw new Error("The provided Gemini API key is not valid. Please check the key in the API Wallet or your environment configuration.");
    }
    throw new Error(`Gemini API request failed for text generation: ${error.message || 'Unknown error'}`);
  }
};

export const generateImageWithImagen = async (
  prompt: string,
  userProvidedApiKey: string | null // User-provided key takes precedence
): Promise<string> => {
  const apiKeyToUse = userProvidedApiKey || checkDefaultGeminiEnvKey();

  if (!apiKeyToUse) {
    throw new Error("Imagen API key not available (uses Gemini key). Please provide it in the API Wallet or ensure API_KEY environment variable is set.");
  }

  const aiClient = initializeGeminiClient(apiKeyToUse);
  if (!aiClient) {
    throw new Error("Failed to initialize Imagen AI client (GoogleGenAI) with the provided key.");
  }

  if (!prompt || prompt.trim() === "") {
    throw new Error("Image generation prompt cannot be empty.");
  }

  try {
    const response = await aiClient.models.generateImages({
      model: IMAGEN_API_MODEL_NAME,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      console.error("Unexpected response format from Imagen API:", response);
      throw new Error("No image data received from Imagen API or unexpected format.");
    }
  } catch (error: any) {
    console.error("Error calling Imagen API:", error);
    if (error.message && (error.message.includes("API key not valid") || error.message.includes("invalid api key"))) {
      throw new Error("The provided Imagen API key (uses Gemini key) is not valid. Please check the key in the API Wallet or your environment configuration.");
    }
    if (error.message && error.message.toLowerCase().includes("prompt was blocked")) {
      throw new Error("Image generation prompt was blocked due to safety policies. Please revise your prompt.");
    }
    throw new Error(`Imagen API request failed: ${error.message || 'Unknown error'}`);
  }
};

export const generateContentWithGeminiProVision = async (
  parts: (string | { inlineData: { data: string; mimeType: string } })[],
  userProvidedApiKey: string | null
): Promise<string> => {
  const apiKeyToUse = userProvidedApiKey || checkDefaultGeminiEnvKey();

  if (!apiKeyToUse) {
    throw new Error(
      "Gemini API key not available. Please provide it in the API Wallet or ensure API_KEY environment variable is set for default use."
    );
  }

  const aiClient = initializeGeminiClient(apiKeyToUse);
  if (!aiClient) {
    throw new Error(
      "Failed to initialize Gemini AI client with the provided key."
    );
  }

  try {
    const response: GenerateContentResponse = await aiClient.models.generateContent({
      model: "gemini-pro-vision", // Use the vision model
      contents: [{ role: "user", parts: parts }],
    });

    const text = response.text;
    if (typeof text !== "string") {
      console.error("Unexpected response format from Gemini API:", response);
      throw new Error("Received unexpected response format from Gemini API.");
    }
    return text.trim();
  } catch (error: any) {
    console.error("Error calling Gemini Pro Vision API:", error);
    if (
      error.message &&
      (error.message.includes("API key not valid") ||
        error.message.includes("invalid api key"))
    ) {
      throw new Error(
        "The provided Gemini API key is not valid. Please check the key in the API Wallet or your environment configuration."
      );
    }
    throw new Error(
      `Gemini Pro Vision API request failed: ${error.message || "Unknown error"}`
    );
  }
};
    }
    throw new Error(`Imagen API request failed: ${error.message || 'Unknown error'}`);
  }
};