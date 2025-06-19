
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
  
  // Clean and normalize inputs to prevent corruption
  const cleanSpecialty = specialty ? specialty.trim() : 'healthcare';
  const cleanLocation = location ? location.trim() : 'your area';
  const cleanAudience = targetAudience ? targetAudience.trim() : 'patients';
  const cleanTopic = topic ? topic.trim() : '';

  // Simple mock responses based on channel type
  switch (channel) {
    case ChannelType.INSTAGRAM:
      return `[MOCK Groq/OpenRouter] Awesome Instagram post for ${cleanSpecialty} in ${cleanLocation} targeting ${cleanAudience}${topicStr}${toneStr}! 📱 #StayHealthy #${cleanLocation.split(',')[0].replace(/\s+/g, '')}`;
    case ChannelType.FACEBOOK:
      return `[MOCK Groq/OpenRouter] Engaging Facebook content about ${cleanSpecialty} services in ${cleanLocation} for ${cleanAudience}${topicStr}${toneStr}. Learn more on our page!`;
    case ChannelType.WHATSAPP:
      return `[MOCK Groq/OpenRouter] Quick tip from your ${cleanSpecialty} experts in ${cleanLocation}${topicStr}${toneStr}: Remember your check-ups!`;
    case ChannelType.GOOGLE_BUSINESS:
      return `[MOCK Groq/OpenRouter] ${cleanSpecialty} clinic in ${cleanLocation} is open! We're here for ${cleanAudience}${topicStr}${toneStr}. Call us today!`;
    case ChannelType.BLOG_IDEA:
      return `[MOCK Gemini/OpenRouter] Blog Idea${topicStr}${toneStr}: "Top 5 Health Tips for ${cleanAudience} in ${cleanLocation} by ${cleanSpecialty} Experts". Summary: A comprehensive guide covering essential health recommendations and preventive care strategies.`;
    case ChannelType.AD_COPY:
      return `[MOCK Groq/OpenRouter]\nGoogle Ad (${cleanSpecialty}, ${cleanLocation}${topicStr}${toneStr}):\nHeadline 1: Expert ${cleanSpecialty} Care\nHeadline 2: ${cleanLocation} Clinic Open\nDescription: Serving ${cleanAudience}. Book now!\n\nFacebook Ad:\nPrimary Text: Trusted ${cleanSpecialty} services in ${cleanLocation}. We care for ${cleanAudience}${topicStr}${toneStr}.\nHeadline: Your Health Matters!`;
    case ChannelType.IMAGE_PROMPT:
      return `[MOCK Stability/OpenRouter] Image Prompt: A vibrant, welcoming ${cleanSpecialty} clinic in ${cleanLocation}, with happy ${cleanAudience} patients. Topic: ${cleanTopic || 'general health'}. Tone: ${tone || 'professional'}. Style: modern, clean, bright.`;
    case ChannelType.VIDEO_SCRIPT:
      return `[MOCK Gemini/OpenRouter]\nVideo Script for ${cleanSpecialty} in ${cleanLocation}${topicStr}${toneStr}:\nSCENE 1: Bright clinic reception in ${cleanLocation}.\nVO/TEXT: Welcome to your trusted ${cleanSpecialty} clinic!\nVISUALS: Friendly staff, clean environment.\nCALL TO ACTION: Visit us today!`;
    default:
      return `[MOCK] Generic content for ${channel} about ${cleanSpecialty} in ${cleanLocation}${topicStr}${toneStr}.`;
  }
};