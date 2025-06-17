import { ChannelType } from './types';

export const APP_NAME = "MediGenius";

export const GEMINI_API_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
export const IMAGEN_API_MODEL_NAME = "imagen-3.0-generate-002"; 

export const CHANNEL_OPTIONS: { value: ChannelType; label: string }[] = [
  { value: ChannelType.INSTAGRAM, label: 'Instagram Post' },
  { value: ChannelType.FACEBOOK, label: 'Facebook Post' },
  { value: ChannelType.WHATSAPP, label: 'WhatsApp Message' },
  { value: ChannelType.GOOGLE_BUSINESS, label: 'Google Business Profile Update' },
  { value: ChannelType.BLOG_IDEA, label: 'Blog Post Idea (HubSpot Friendly)' },
  { value: ChannelType.AD_COPY, label: 'Ad Copy (Google & Facebook)' },
  { value: ChannelType.IMAGE_PROMPT, label: 'Image Prompt (for text-to-image)' },
  { value: ChannelType.GENERATED_IMAGE, label: 'Generated Image' },
  { value: ChannelType.VIDEO_SCRIPT, label: 'Video Script (Reel/Short)' },
];

export const MEDICAL_DISCLAIMER = "Disclaimer: All content is AI-generated and for marketing inspiration only. It is NOT medical advice. Please ensure all medical claims are reviewed and approved by a qualified doctor or appropriate healthcare professional before publishing.";

export const DEFAULT_API_KEYS = {
  geminiApiKey: null, // This will be checked against process.env.API_KEY
  groqApiKey: '',
  openRouterApiKey: '',
  stabilityApiKey: '',
  unsplashApiKey: '', // Optional: for stock photos (free tier: 50 requests/hour)
};

export const API_KEY_STORAGE_KEY = 'mediGeniusApiKeys';

export const PLATFORM_URLS: Partial<Record<ChannelType, { name: string; url: string; secondaryUrl?: { name: string; url: string} }>> = {
  [ChannelType.INSTAGRAM]: { name: "Instagram", url: "https://www.instagram.com/" },
  [ChannelType.FACEBOOK]: { name: "Facebook", url: "https://www.facebook.com/" }, // Consider https://www.facebook.com/composer/
  [ChannelType.WHATSAPP]: { name: "WhatsApp Web", url: "https://web.whatsapp.com/" },
  [ChannelType.GOOGLE_BUSINESS]: { name: "Google Business", url: "https://business.google.com/" },
  [ChannelType.BLOG_IDEA]: { name: "HubSpot", url: "https://app.hubspot.com/" }, // User navigates to their blog section
  [ChannelType.AD_COPY]: { 
    name: "Facebook Ads", 
    url: "https://www.facebook.com/adsmanager/",
    secondaryUrl: { name: "Google Ads", url: "https://ads.google.com/"}
  },
  [ChannelType.GENERATED_IMAGE]: { name: "Canva", url: "https://www.canva.com/" }, // Or Instagram, Facebook
  [ChannelType.VIDEO_SCRIPT]: { name: "Instagram Reels", url: "https://www.instagram.com/" }, // Or YouTube Studio: https://studio.youtube.com/
};
