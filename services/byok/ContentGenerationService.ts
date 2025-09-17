import { ApiKeys } from '../../types';
import { MetaPromptEngine, MetaPromptConfig, PlatformPrompt } from './metaPromptEngine';
import { generateSingleChannelWithGemini } from '../geminiService';
import { generateFreeImage } from '../freeImageService';

export interface GeneratedContent {
  platform: string;
  content: string;
  imageUrl?: string;
  imagePrompt?: string;
  metadata: {
    tone: string;
    constraints: string[];
    wordCount: number;
    hashtags?: string[];
    callToAction?: string;
  };
}

export interface ContentGenerationResult {
  success: boolean;
  content: GeneratedContent[];
  errors: string[];
  metadata: {
    totalPlatforms: number;
    successfulGenerations: number;
    generationTime: number;
    campaignConfig: MetaPromptConfig;
  };
}

export class ContentGenerationService {
  private metaPromptEngine: MetaPromptEngine;

  constructor() {
    this.metaPromptEngine = new MetaPromptEngine();
  }

  async generateCampaignContent(
    config: MetaPromptConfig,
    apiKeys: ApiKeys,
    selectedPlatforms: string[] = ['instagram', 'facebook', 'whatsapp']
  ): Promise<ContentGenerationResult> {
    const startTime = Date.now();
    const results: GeneratedContent[] = [];
    const errors: string[] = [];

    try {
      // Generate platform-specific prompts
      const platformPrompts = this.metaPromptEngine.generatePlatformPrompts(config);

      // Filter to selected platforms
      const selectedPrompts = Object.entries(platformPrompts)
        .filter(([platform]) => selectedPlatforms.includes(platform));

      // Generate content for each selected platform
      for (const [platform, promptConfig] of selectedPrompts) {
        try {
          const generatedContent = await this.generatePlatformContent(
            platform,
            promptConfig,
            apiKeys
          );
          results.push(generatedContent);
        } catch (error) {
          const errorMessage = `Failed to generate content for ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMessage);
          console.error(errorMessage);
        }
      }

      return {
        success: results.length > 0,
        content: results,
        errors,
        metadata: {
          totalPlatforms: selectedPlatforms.length,
          successfulGenerations: results.length,
          generationTime: Date.now() - startTime,
          campaignConfig: config
        }
      };

    } catch (error) {
      const errorMessage = `Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      return {
        success: false,
        content: [],
        errors: [errorMessage],
        metadata: {
          totalPlatforms: selectedPlatforms.length,
          successfulGenerations: 0,
          generationTime: Date.now() - startTime,
          campaignConfig: config
        }
      };
    }
  }

  private async generatePlatformContent(
    platform: string,
    promptConfig: PlatformPrompt,
    apiKeys: ApiKeys
  ): Promise<GeneratedContent> {
    // Generate text content using Gemini
    const textContent = await this.generateTextContent(promptConfig.prompt, apiKeys);

    // Generate image if API key is available
    let imageUrl: string | undefined;
    try {
      if (apiKeys.unsplashApiKey || apiKeys.stabilityApiKey) {
        imageUrl = await generateFreeImage(promptConfig.imagePrompt, apiKeys);
      }
    } catch (imageError) {
      console.warn(`Image generation failed for ${platform}:`, imageError);
      // Continue without image - it's not critical
    }

    // Extract metadata from generated content
    const metadata = this.extractContentMetadata(textContent, platform);

    return {
      platform,
      content: textContent,
      imageUrl,
      imagePrompt: promptConfig.imagePrompt,
      metadata: {
        tone: promptConfig.tone,
        constraints: promptConfig.constraints,
        wordCount: textContent.split(' ').length,
        ...metadata
      }
    };
  }

  private async generateTextContent(prompt: string, apiKeys: ApiKeys): Promise<string> {
    try {
      // Use Gemini service for content generation
      const result = await generateSingleChannelWithGemini(
        'general', // channel type
        prompt,
        apiKeys,
        'text' // content type
      );

      if (result && result.content) {
        return result.content;
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      // Fallback to a basic structured response if API fails
      console.warn('API generation failed, using fallback:', error);
      return this.generateFallbackContent(prompt);
    }
  }

  private generateFallbackContent(prompt: string): string {
    // Extract key information from the prompt to create basic content
    const lines = prompt.split('\n');
    const clientLine = lines.find(line => line.includes('Name:')) || '';
    const intentLine = lines.find(line => line.includes('Goal:')) || '';

    return `🏥 Healthcare Update from ${clientLine.replace('Name:', '').trim()}

${intentLine.replace('Goal:', '').trim()}

✨ Quality healthcare services tailored to your needs
📍 Convenient location with modern facilities
👨‍⚕️ Experienced medical professionals

#Healthcare #MedicalCare #Wellness`;
  }

  private extractContentMetadata(content: string, platform: string) {
    const metadata: any = {};

    // Extract hashtags
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const hashtags = content.match(hashtagRegex);
    if (hashtags) {
      metadata.hashtags = hashtags;
    }

    // Extract call-to-action (simple heuristic)
    const ctaKeywords = ['book now', 'call us', 'visit us', 'contact us', 'learn more', 'schedule', 'appointment'];
    const contentLower = content.toLowerCase();
    for (const keyword of ctaKeywords) {
      if (contentLower.includes(keyword)) {
        metadata.callToAction = keyword;
        break;
      }
    }

    return metadata;
  }

  // Utility method to get available platforms
  getAvailablePlatforms(): string[] {
    return ['instagram', 'facebook', 'whatsapp', 'googleBusiness', 'blog', 'adCopy', 'videoScript'];
  }

  // Method to validate campaign configuration
  validateCampaignConfig(config: MetaPromptConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.client?.name) {
      errors.push('Client name is required');
    }

    if (!config.client?.specialty) {
      errors.push('Client specialty is required');
    }

    if (!config.audience?.label) {
      errors.push('Audience label is required');
    }

    if (!config.intent?.title) {
      errors.push('Marketing intent is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
