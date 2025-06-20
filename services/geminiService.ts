import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContentGenerationParams, ChannelType } from '../types';
import { GEMINI_API_MODEL_NAME, IMAGEN_API_MODEL_NAME } from '../constants';

// Store client instances mapped by API key to support multiple user keys if needed,
// though current app state uses one active key set at a time.
// For simplicity, we'll re-initialize if the key changes.
let activeGeminiClient: GoogleGenerativeAI | null = null;
let activeApiKey: string | null = null;

const initializeGeminiClient = (apiKey: string): GoogleGenerativeAI | null => {
  if (activeGeminiClient && activeApiKey === apiKey) {
    return activeGeminiClient;
  }

  if (!apiKey) {
    console.warn("Attempted to initialize Gemini client without an API key.");
    return null;
  }

  try {
    activeGeminiClient = new GoogleGenerativeAI(apiKey); // Use string directly for new API
    activeApiKey = apiKey;
    return activeGeminiClient;
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI client:", error);
    return null;
  }
};

export const checkDefaultGeminiEnvKey = (): string | null => {
  // Check if there's an API key available from environment
  const envKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  return envKey && envKey !== 'PLACEHOLDER_API_KEY' ? envKey : null;
};

export const generateContentWithGemini = async (
  params: ContentGenerationParams,
  userProvidedApiKey: string | null // User-provided key takes precedence
): Promise<Record<ChannelType, string>> => {
  const apiKeyToUse = userProvidedApiKey || checkDefaultGeminiEnvKey();

  if (!apiKeyToUse) {
    throw new Error("Gemini API key not available. Please provide it in the API Wallet or ensure GEMINI_API_KEY environment variable is set.");
  }

  const geminiClient = initializeGeminiClient(apiKeyToUse);
  if (!geminiClient) {
    throw new Error("Failed to initialize Gemini AI client with the provided key.");
  }

  const { specialty, location, targetAudience, topic, tone } = params;

  const contextPrompt = `
    You are a medical marketing expert creating content for a healthcare professional/organization.
    
    Context:
    - Medical Specialty: ${specialty}
    - Location: ${location}
    - Target Audience: ${targetAudience}
    ${topic ? `- Topic/Theme: ${topic}` : ''}
    ${tone ? `- Desired Tone: ${tone}` : ''}
    
    IMPORTANT: All content must include a medical disclaimer stating that the content is for informational purposes only and not a substitute for professional medical advice.
  `;

  const channels = [
    ChannelType.INSTAGRAM,
    ChannelType.FACEBOOK,
    ChannelType.WHATSAPP,
    ChannelType.GOOGLE_BUSINESS,
    ChannelType.BLOG_IDEA,
    ChannelType.AD_COPY,
    ChannelType.IMAGE_PROMPT,
    ChannelType.VIDEO_SCRIPT
  ];

  const results: Record<ChannelType, string> = {} as Record<ChannelType, string>;

  try {
    const model = geminiClient.getGenerativeModel({ model: GEMINI_API_MODEL_NAME });

    for (const channel of channels) {
      const channelPrompt = createChannelSpecificPrompt(channel, contextPrompt);
      
      try {
        const result = await model.generateContent(channelPrompt);
        results[channel] = result.response.text();
      } catch (error: any) {
        console.error(`Error generating content for ${channel}:`, error);
        results[channel] = `Error generating content: ${error.message || 'Unknown error'}`;
      }
    }

    return results;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message && (error.message.includes("API key not valid") || error.message.includes("invalid api key"))) {
      throw new Error("The provided Gemini API key is not valid. Please check the key in the API Wallet or your environment configuration.");
    }
    throw new Error(`Gemini API request failed: ${error.message || 'Unknown error'}`);
  }
};

const createChannelSpecificPrompt = (channel: ChannelType, contextPrompt: string): string => {
  switch (channel) {
    case ChannelType.INSTAGRAM:
      return `${contextPrompt}
        Create an engaging Instagram post (max 2200 characters) with:
        - Attention-grabbing opening
        - Key medical information relevant to the specialty
        - 3-5 relevant hashtags
        - Call-to-action
        - Medical disclaimer`;

    case ChannelType.FACEBOOK:
      return `${contextPrompt}
        Create a Facebook post that:
        - Starts with an engaging question or statement
        - Provides valuable health information
        - Encourages community engagement
        - Includes medical disclaimer`;

    case ChannelType.WHATSAPP:
      return `${contextPrompt}
        Create a WhatsApp message that:
        - Is personal and conversational
        - Brief but informative (max 300 words)
        - Includes appointment booking information
        - Contains medical disclaimer`;

    case ChannelType.GOOGLE_BUSINESS:
      return `${contextPrompt}
        Create a Google Business Profile update that:
        - Highlights services or expertise
        - Includes location-specific information
        - Mentions operating hours or special services
        - Professional yet approachable tone`;

    case ChannelType.BLOG_IDEA:
      return `${contextPrompt}
        Create a blog post outline with:
        - Compelling title (SEO-friendly)
        - Brief introduction
        - 5-7 main points/sections
        - Conclusion with call-to-action
        - Meta description (150-160 characters)`;

    case ChannelType.AD_COPY:
      return `${contextPrompt}
        Create ad copy for Google/Facebook ads with:
        - Compelling headline (30 characters)
        - Description (90 characters)
        - Strong call-to-action
        - Benefits-focused messaging`;

    case ChannelType.IMAGE_PROMPT:
      return `${contextPrompt}
        Create a detailed text-to-image prompt for medical marketing visual:
        - Professional, clean aesthetic
        - Healthcare-related imagery
        - Color scheme suggestions
        - Text overlay recommendations`;

    case ChannelType.VIDEO_SCRIPT:
      return `${contextPrompt}
        Create a 30-60 second video script for Instagram Reel/YouTube Short:
        - Hook (first 3 seconds)
        - Main content points
        - Visual cues
        - Call-to-action
        - On-screen text suggestions`;

    default:
      return `${contextPrompt}
        Create marketing content for ${channel} following best practices for this platform.`;
  }
};

export const generateImageWithImagen = async (
  prompt: string,
  userProvidedApiKey: string | null // User-provided key takes precedence
): Promise<string> => {
  const apiKeyToUse = userProvidedApiKey || checkDefaultGeminiEnvKey();

  if (!apiKeyToUse) {
    throw new Error("Imagen API key not available (uses Gemini key). Please provide it in the API Wallet or ensure GEMINI_API_KEY environment variable is set.");
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

// Single channel version for individual content generation
export const generateSingleChannelWithGemini = async (
  params: ContentGenerationParams,
  channel: ChannelType,
  userProvidedApiKey: string | null
): Promise<string> => {
  const apiKeyToUse = userProvidedApiKey || checkDefaultGeminiEnvKey();

  if (!apiKeyToUse) {
    throw new Error("Gemini API key not available. Please provide it in the API Wallet or ensure GEMINI_API_KEY environment variable is set.");
  }

  const geminiClient = initializeGeminiClient(apiKeyToUse);
  if (!geminiClient) {
    throw new Error("Failed to initialize Gemini AI client with the provided key.");
  }

  const { specialty, location, targetAudience, topic, tone } = params;

  const contextPrompt = `
    You are a medical marketing expert creating content for a healthcare professional/organization.
    
    Context:
    - Medical Specialty: ${specialty}
    - Location: ${location}
    - Target Audience: ${targetAudience}
    ${topic ? `- Topic/Theme: ${topic}` : ''}
    ${tone ? `- Desired Tone: ${tone}` : ''}
    
    IMPORTANT: All content must include a medical disclaimer stating that the content is for informational purposes only and not a substitute for professional medical advice.
  `;

  try {
    const model = geminiClient.getGenerativeModel({ model: GEMINI_API_MODEL_NAME });
    const channelPrompt = createChannelSpecificPrompt(channel, contextPrompt);
    
    const result = await model.generateContent(channelPrompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message && (error.message.includes("API key not valid") || error.message.includes("invalid api key"))) {
      throw new Error("The provided Gemini API key is not valid. Please check the key in the API Wallet or your environment configuration.");
    }
    throw new Error(`Gemini API request failed: ${error.message || 'Unknown error'}`);
  }
};
