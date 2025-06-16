
import { ContentGenerationParams, ChannelType } from '../types';

// This function simulates calls to other AI APIs like Groq, OpenRouter, or Stability AI for image prompts.
// In a real application, each would have its own service file and API interaction logic.

export const generateMockContent = async (
  params: ContentGenerationParams,
  channel: ChannelType,
  apiKey: string // The specific key for Groq, OpenRouter, etc.
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

  if (!apiKey) {
    // This case should ideally be handled before calling, by checking if the key exists.
    // But as a fallback for the mock:
    return `Mock Content: API Key for this service was not provided. Cannot generate for ${channel}.`;
  }

  const { specialty, location, targetAudience, topic, tone } = params;
  let topicStr = topic ? ` focused on "${topic}"` : '';
  let toneStr = tone ? ` with a "${tone}" tone` : '';

  // Simple mock responses based on channel type
  switch (channel) {
    case ChannelType.INSTAGRAM:
      return `[MOCK Groq/OpenRouter] Awesome Instagram post for ${specialty} in ${location} targeting ${targetAudience}${topicStr}${toneStr}! 📱 #StayHealthy #${location.split(',')[0].replace(/\s+/g, '')}`;
    case ChannelType.FACEBOOK:
      return `[MOCK Groq/OpenRouter] Engaging Facebook content about ${specialty} services in ${location} for ${targetAudience}${topicStr}${toneStr}. Learn more on our page!`;
    case ChannelType.WHATSAPP:
      return `[MOCK Groq/OpenRouter] Quick tip from your ${specialty} experts in ${location}${topicStr}${toneStr}: Remember your check-ups!`;
    case ChannelType.GOOGLE_BUSINESS:
      return `[MOCK Groq/OpenRouter] ${specialty} clinic in ${location} is open! We're here for ${targetAudience}${topicStr}${toneStr}. Call us today!`;
    case ChannelType.BLOG_IDEA:
      return `[MOCK Gemini/OpenRouter] Blog Idea${topicStr}${toneStr}: "Top 5 Health Tips for ${targetAudience} in ${location} by ${specialty} Experts". Summary: A comprehensive guide...`;
    case ChannelType.AD_COPY:
      return `[MOCK Groq/OpenRouter]\nGoogle Ad (${specialty}, ${location}${topicStr}${toneStr}):\nHeadline 1: Expert ${specialty} Care\nHeadline 2: ${location} Clinic Open\nDescription: Serving ${targetAudience}. Book now!\n\nFacebook Ad:\nPrimary Text: Trusted ${specialty} services in ${location}. We care for ${targetAudience}${topicStr}${toneStr}.\nHeadline: Your Health Matters!`;
    case ChannelType.IMAGE_PROMPT:
      return `[MOCK Stability/OpenRouter] Image Prompt: A vibrant, welcoming ${specialty} clinic in ${location}, with happy ${targetAudience} patients. Topic: ${topic || 'general health'}. Tone: ${tone || 'professional'}. Style: modern, clean, bright.`;
    case ChannelType.VIDEO_SCRIPT:
      return `[MOCK Gemini/OpenRouter]\nVideo Script for ${specialty} in ${location}${topicStr}${toneStr}:\nSCENE 1: Bright clinic reception in ${location}.\nVO/TEXT: Welcome to your trusted ${specialty} clinic!\nVISUALS: Friendly staff, clean environment.\nCALL TO ACTION: Visit us today!`;
    default:
      return `[MOCK] Generic content for ${channel} about ${specialty} in ${location}${topicStr}${toneStr}.`;
  }
};