
export interface ApiKeys {
  geminiApiKey: string | null; // Can be user-provided if process.env.API_KEY is not available/intended for client-side
  groqApiKey: string;
  openRouterApiKey: string;
  stabilityApiKey: string;
  unsplashApiKey: string; // Optional: for stock photos (free tier: 50 requests/hour)
}

export interface ContentGenerationParams {
  specialty: string;
  location: string;
  targetAudience: string;
  topic?: string; // Optional: e.g., "Women's Day", "New Year Offer", "Monsoon Health Tips"
  tone?: string;  // Optional: e.g., "Celebratory", "Informative", "Urgent", "Empathetic"
  imageFile?: File; // Optional: for medical image analysis
}

export enum ChannelType {
  INSTAGRAM = 'Instagram Post',
  FACEBOOK = 'Facebook Post',
  WHATSAPP = 'WhatsApp Message',
  GOOGLE_BUSINESS = 'Google Business Profile Update',
  BLOG_IDEA = 'Blog Post Idea',
  AD_COPY = 'Ad Copy (Google & Facebook)',
  IMAGE_PROMPT = 'Image Prompt',
  GENERATED_IMAGE = 'Generated Image', // New channel for the actual image
  VIDEO_SCRIPT = 'Video Script (30-60s Reel/Short)',
}

export interface GeneratedContentItem {
  channel: ChannelType;
  content: string; // For text channels, this is text. For GENERATED_IMAGE, this will be base64 string.
  error?: string;
  metadata?: { generatedBy?: string; [key: string]: any }; // Optional metadata for tracking generation method
}

export interface GeneratedContentSet {
  [key: string]: GeneratedContentItem; // Key will be ChannelType
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri: string;
    title: string;
  };
}