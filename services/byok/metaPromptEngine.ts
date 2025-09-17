import { HealthcareClient } from '../../data/clientDatabase';
import { MarketingIntent } from '../../data/marketingIntents';

export interface MetaPromptConfig {
  client: HealthcareClient;
  audience: any;
  intent: MarketingIntent;
  customGoals?: string[];
  additionalContext?: string;
}

export interface PlatformPrompt {
  platform: string;
  prompt: string;
  imagePrompt: string;
  tone: string;
  constraints: string[];
}

export class MetaPromptEngine {

  generatePlatformPrompts(config: MetaPromptConfig): Record<string, PlatformPrompt> {
    const baseContext = this.buildBaseContext(config);

    return {
      instagram: this.generateInstagramPrompt(baseContext, config),
      facebook: this.generateFacebookPrompt(baseContext, config),
      whatsapp: this.generateWhatsAppPrompt(baseContext, config),
      googleBusiness: this.generateGoogleBusinessPrompt(baseContext, config),
      blog: this.generateBlogPrompt(baseContext, config),
      adCopy: this.generateAdCopyPrompt(baseContext, config),
      videoScript: this.generateVideoScriptPrompt(baseContext, config)
    };
  }

  private buildBaseContext(config: MetaPromptConfig): string {
    const { client, audience, intent, customGoals, additionalContext } = config;

    return `
HEALTHCARE CLIENT PROFILE:
- Name: ${client.name}
- Type: ${client.type}
- Specialty: ${client.specialty}
- Location: ${client.location.city}, ${client.location.state}${client.location.area ? `, ${client.location.area}` : ''}
- Brand Voice: ${client.brandVoice}
- Services: ${client.services?.join(', ') || 'Standard healthcare services'}
- USPs: ${client.uniqueSellingPoints?.join(', ') || 'Quality healthcare'}

TARGET AUDIENCE:
- Profile: ${audience.label || 'Custom audience'}
- Description: ${audience.description}
- Characteristics: ${audience.characteristics?.join(', ') || 'Health-conscious individuals'}
- Preferred Channels: ${audience.preferredChannels?.join(', ') || 'Social media'}
- Communication Style: ${audience.communicationStyle}

MARKETING INTENT:
- Category: ${intent.category}
- Goal: ${intent.title}
- Description: ${intent.description}
- Target Outcomes: ${intent.targetOutcomes.join(', ')}
- Content Types: ${intent.contentTypes.join(', ')}
- Urgency: ${intent.urgencyLevel}
- Compliance: ${intent.compliance.join(', ')}

${customGoals && customGoals.length > 0 ? `ADDITIONAL GOALS: ${customGoals.join(', ')}` : ''}
${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

IMPORTANT GUIDELINES:
- Always maintain medical accuracy and ethical standards
- Use Indian cultural context and regional preferences
- Include relevant local healthcare regulations compliance
- Focus on patient benefit and trust-building
- Use appropriate medical terminology for the audience level
- Include clear call-to-action relevant to the platform
- Ensure content is engaging yet professional
`;
  }

  private generateInstagramPrompt(baseContext: string, config: MetaPromptConfig): PlatformPrompt {
    return {
      platform: 'Instagram',
      prompt: `${baseContext}

INSTAGRAM-SPECIFIC REQUIREMENTS:
Create an engaging Instagram post that:
- Uses visual-first storytelling approach
- Includes relevant hashtags (mix of popular and niche medical hashtags)
- Optimized for mobile viewing and quick consumption
- Encourages engagement (likes, comments, shares)
- Includes Instagram-style emojis and formatting
- Features a compelling hook in the first line
- Includes location tags for local discovery
- Follows Instagram character limits
- Uses Instagram-friendly language (casual yet professional)
- Creates FOMO or curiosity to drive action

TONE: ${config.client.brandVoice} but Instagram-friendly (more casual and visual)
FORMAT: Caption + Hashtags + Call-to-action
CHARACTER LIMIT: Keep under 2,200 characters
HASHTAG STRATEGY: 15-30 relevant hashtags including medical, local, and trending tags`,

      imagePrompt: `Professional Instagram-style healthcare image for ${config.client.name} (${config.client.specialty}) in ${config.client.location.city}.
Visual style: Modern, clean, Instagram-worthy healthcare photography.
Context: ${config.intent.description}
Audience: ${config.audience.description}
Style: Bright, welcoming, professional healthcare setting with Indian context.
Elements: Include medical equipment, clean facilities, or doctor consultation scene.
Mood: Trustworthy, modern, approachable.
Aspect ratio: 1:1 (Instagram square format)`,

      tone: `${config.client.brandVoice} + Instagram casual`,
      constraints: [
        'Visual-first content',
        'Mobile-optimized',
        'Hashtag strategy required',
        'Engagement-focused',
        'Instagram character limits',
        'Story-friendly format'
      ]
    };
  }

  private generateFacebookPrompt(baseContext: string, config: MetaPromptConfig): PlatformPrompt {
    return {
      platform: 'Facebook',
      prompt: `${baseContext}

FACEBOOK-SPECIFIC REQUIREMENTS:
Create a comprehensive Facebook post that:
- Encourages meaningful conversations and community engagement
- Includes detailed information suitable for longer-form content
- Optimized for Facebook's algorithm (engagement-driving)
- Uses Facebook-style formatting and emojis
- Includes relevant community groups and local references
- Designed for easy sharing among families and friends
- Features educational value that people want to share
- Includes multiple call-to-action options
- Uses Facebook's community-building approach
- References local events, festivals, or health observances

TONE: ${config.client.brandVoice} but community-focused and detailed
FORMAT: Detailed post + Community engagement + Share-worthy content
ENGAGEMENT STRATEGY: Ask questions, create polls, encourage sharing
COMMUNITY FOCUS: Build local healthcare community presence`,

      imagePrompt: `Facebook-optimized healthcare image for ${config.client.name} (${config.client.specialty}) in ${config.client.location.city}.
Visual style: Community-focused, detailed, Facebook-appropriate healthcare imagery.
Context: ${config.intent.description}
Audience: ${config.audience.description}
Style: Warm, community-oriented, family-friendly healthcare environment.
Elements: Group settings, community health, family healthcare scenarios.
Mood: Welcoming, trustworthy, community-centered.
Aspect ratio: 16:9 or 4:3 (Facebook feed optimized)`,

      tone: `${config.client.brandVoice} + Facebook community-focused`,
      constraints: [
        'Community engagement focus',
        'Longer-form content allowed',
        'Share-worthy information',
        'Local community references',
        'Family-friendly approach',
        'Educational value'
      ]
    };
  }

  private generateWhatsAppPrompt(baseContext: string, config: MetaPromptConfig): PlatformPrompt {
    return {
      platform: 'WhatsApp',
      prompt: `${baseContext}

WHATSAPP-SPECIFIC REQUIREMENTS:
Create a WhatsApp message that:
- Is concise and easily forwardable
- Uses WhatsApp-style formatting (*bold*, _italic_, ~strikethrough~)
- Includes clear, actionable information
- Optimized for quick reading and sharing
- Uses appropriate emojis for visual break-up
- Includes direct contact information (phone, WhatsApp number)
- Designed for personal sharing among family/friends
- Features urgent or time-sensitive information if applicable
- Uses bullet points for easy scanning
- Includes location and directions if relevant
- Creates urgency or immediate action
- Family-group friendly content

TONE: ${config.client.brandVoice} but personal and direct
FORMAT: *Bold headers* + bullet points + direct contact info
MESSAGE TYPE: Forward-friendly, family-shareable, action-oriented
URGENCY LEVEL: ${config.intent.urgencyLevel}`,

      imagePrompt: `WhatsApp-shareable healthcare image for ${config.client.name} (${config.client.specialty}) in ${config.client.location.city}.
Visual style: Clean, simple, WhatsApp-appropriate healthcare graphic.
Context: ${config.intent.description}
Audience: ${config.audience.description}
Style: Simple, clear, easily readable on mobile devices.
Elements: Contact information, clear medical symbols, location details.
Mood: Direct, trustworthy, action-oriented.
Format: Square or vertical for WhatsApp sharing`,

      tone: `${config.client.brandVoice} + WhatsApp personal/direct`,
      constraints: [
        'Message length optimization',
        'Forward-friendly format',
        'WhatsApp formatting syntax',
        'Contact info inclusion',
        'Mobile-first design',
        'Family sharing appropriate'
      ]
    };
  }

  private generateGoogleBusinessPrompt(baseContext: string, config: MetaPromptConfig): PlatformPrompt {
    return {
      platform: 'Google Business',
      prompt: `${baseContext}

GOOGLE BUSINESS PROFILE REQUIREMENTS:
Create a Google Business post that:
- Optimized for local SEO and discovery
- Includes relevant keywords for local healthcare searches
- Features clear business information and services
- Designed to drive foot traffic and appointments
- Uses Google Business post formatting
- Includes specific offers, events, or announcements
- Optimized for "near me" searches
- Features reviews and testimonials integration
- Includes hours, contact, and location information
- Uses local healthcare and medical keywords
- Designed to appear in Google Maps and local search
- Encourages Google reviews and engagement

TONE: ${config.client.brandVoice} but SEO-optimized and local-focused
FORMAT: Business announcement + Local SEO + Clear CTA
SEO FOCUS: Local healthcare keywords, location-based terms
LOCAL OPTIMIZATION: ${config.client.location.city} healthcare searches`,

      imagePrompt: `Google Business-optimized healthcare image for ${config.client.name} (${config.client.specialty}) in ${config.client.location.city}.
Visual style: Professional, Google Business-appropriate healthcare facility image.
Context: ${config.intent.description}
Audience: ${config.audience.description}
Style: Professional, local business-focused, facility exterior or interior.
Elements: Clear signage, professional healthcare environment, location context.
Mood: Professional, trustworthy, local business-oriented.
Format: High-quality business photo for Google listings`,

      tone: `${config.client.brandVoice} + Google Business professional`,
      constraints: [
        'Local SEO optimization',
        'Google Business formatting',
        'Location-specific keywords',
        'Review generation focus',
        'Map listing optimization',
        'Local search visibility'
      ]
    };
  }

  private generateBlogPrompt(baseContext: string, config: MetaPromptConfig): PlatformPrompt {
    return {
      platform: 'Blog/HubSpot',
      prompt: `${baseContext}

BLOG POST REQUIREMENTS:
Create a comprehensive blog post that:
- Provides in-depth, educational healthcare content
- Optimized for SEO with relevant medical keywords
- Features expert medical insights and advice
- Includes credible sources and medical references
- Designed for thought leadership and authority building
- Uses blog-appropriate formatting (H2, H3, bullets, etc.)
- Includes internal and external linking opportunities
- Features FAQ sections and actionable takeaways
- Optimized for search engines and social sharing
- Includes medical disclaimers and professional advice notes
- Positions ${config.client.name} as healthcare authority
- Addresses common patient questions and concerns

TONE: ${config.client.brandVoice} but educational and authoritative
FORMAT: Full blog post with headers, subheadings, and structured content
WORD COUNT: 800-1200 words
SEO FOCUS: Healthcare keywords, medical terms, local health topics`,

      imagePrompt: `Professional blog header image for ${config.client.name} (${config.client.specialty}) healthcare blog post.
Visual style: Professional, educational, blog-appropriate healthcare imagery.
Context: ${config.intent.description}
Audience: ${config.audience.description}
Style: Clean, professional, educational healthcare setting or medical illustration.
Elements: Medical charts, healthcare professionals, educational materials.
Mood: Authoritative, educational, professional.
Format: Blog header image (16:9 aspect ratio)`,

      tone: `${config.client.brandVoice} + Educational authority`,
      constraints: [
        'Long-form educational content',
        'SEO optimization required',
        'Medical accuracy critical',
        'Expert positioning',
        'Source citations needed',
        'Professional disclaimers'
      ]
    };
  }

  private generateAdCopyPrompt(baseContext: string, config: MetaPromptConfig): PlatformPrompt {
    return {
      platform: 'Ad Copy (Google & Facebook)',
      prompt: `${baseContext}

ADVERTISEMENT COPY REQUIREMENTS:
Create compelling ad copy that:
- Drives immediate action and conversions
- Complies with Google and Facebook advertising policies
- Uses persuasive but ethical medical advertising language
- Includes clear value propositions and benefits
- Features compelling headlines and descriptions
- Optimized for click-through rates and conversions
- Includes specific offers, pricing, or incentives
- Uses urgency and scarcity when appropriate
- Targets specific healthcare needs and pain points
- Includes trust signals and credibility markers
- Complies with medical advertising regulations in India
- Features multiple ad variations for A/B testing

TONE: ${config.client.brandVoice} but persuasive and conversion-focused
FORMAT: Headlines + Descriptions + CTAs for multiple ad formats
COMPLIANCE: Medical advertising guidelines, platform policies
CONVERSION FOCUS: Appointment bookings, consultations, service inquiries`,

      imagePrompt: `Professional healthcare advertisement image for ${config.client.name} (${config.client.specialty}) advertising campaign.
Visual style: Clean, professional, ad-appropriate healthcare imagery.
Context: ${config.intent.description}
Audience: ${config.audience.description}
Style: Polished, professional, advertising-quality healthcare visuals.
Elements: Clear medical branding, professional healthcare environment.
Mood: Trustworthy, professional, conversion-oriented.
Format: Multiple ad formats (square, landscape, portrait)`,

      tone: `${config.client.brandVoice} + Persuasive advertising`,
      constraints: [
        'Advertising policy compliance',
        'Conversion optimization',
        'Medical advertising regulations',
        'Multiple format variations',
        'Trust signal inclusion',
        'Ethical persuasion only'
      ]
    };
  }

  private generateVideoScriptPrompt(baseContext: string, config: MetaPromptConfig): PlatformPrompt {
    return {
      platform: 'Video Script (Reels/Shorts)',
      prompt: `${baseContext}

VIDEO SCRIPT REQUIREMENTS:
Create an engaging video script that:
- Optimized for short-form video content (30-60 seconds)
- Uses hook-retention-payoff structure
- Includes visual cues and scene descriptions
- Designed for Instagram Reels, YouTube Shorts, Facebook Reels
- Features engaging opening hook (first 3 seconds)
- Uses trending audio/music suggestions when appropriate
- Includes text overlay suggestions for accessibility
- Optimized for mobile viewing and engagement
- Features healthcare professional or patient scenarios
- Uses trending video formats and styles
- Includes specific timing and scene transitions

TONE: ${config.client.brandVoice} but video-optimized and engaging
FORMAT: Scene-by-scene script with timing and visual cues
DURATION: 30-60 seconds optimal for short-form content
ENGAGEMENT: Hook within first 3 seconds, retention throughout`,

      imagePrompt: `Video thumbnail/poster image for ${config.client.name} (${config.client.specialty}) short-form video content.
Visual style: Engaging, video-appropriate, mobile-optimized healthcare imagery.
Context: ${config.intent.description}
Audience: ${config.audience.description}
Style: Dynamic, engaging, video-thumbnail style healthcare visuals.
Elements: Healthcare professionals in action, patient interactions, medical procedures.
Mood: Engaging, dynamic, video-friendly.
Format: Video thumbnail/poster (9:16 vertical for mobile)`,

      tone: `${config.client.brandVoice} + Video engaging`,
      constraints: [
        'Short-form video optimization',
        'Mobile-first design',
        'Hook-retention-payoff structure',
        'Visual storytelling focus',
        'Platform-specific formatting',
        'Accessibility considerations'
      ]
    };
  }
}
