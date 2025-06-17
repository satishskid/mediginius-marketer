// Free Image Generation Service
// Uses free APIs as alternatives to Google's Imagen API

export interface FreeImageOptions {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'medical' | 'illustration';
}

/**
 * Pollinations.ai - Completely free image generation
 * No API key required, just HTTP requests
 */
export const generateImageWithPollinations = async (
  prompt: string, 
  style: string = 'realistic'
): Promise<string> => {
  try {
    // Add medical/healthcare context to the prompt
    const enhancedPrompt = `professional healthcare ${prompt}, medical setting, clean, professional lighting, ${style} style`;
    
    // Pollinations.ai endpoint - completely free
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&model=flux&nologo=true`;
    
    // Fetch the image and convert to base64
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Pollinations API failed: ${response.status}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix to match expected format
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error("Pollinations API error:", error);
    throw new Error(`Free image generation failed: ${error.message}`);
  }
};

/**
 * Unsplash API - Free stock photos related to healthcare
 * Requires free API key but has generous limits
 */
export const getHealthcareStockPhoto = async (
  prompt: string,
  accessKey?: string
): Promise<string> => {
  if (!accessKey) {
    throw new Error("Unsplash access key not provided");
  }

  try {
    // Extract keywords from prompt for search
    const keywords = prompt.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join(' ');
    
    const searchQuery = `healthcare medical ${keywords}`;
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.small;
      
      // Convert to base64
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      throw new Error("No relevant images found");
    }
  } catch (error: any) {
    console.error("Unsplash API error:", error);
    throw new Error(`Stock photo search failed: ${error.message}`);
  }
};

/**
 * Main free image generation function with fallbacks
 */
export const generateFreeImage = async (
  prompt: string,
  options: {
    unsplashKey?: string;
    preferStock?: boolean;
    style?: string;
  } = {}
): Promise<string> => {
  const { unsplashKey, preferStock = false, style = 'realistic' } = options;

  // Try stock photos first if preferred and key available
  if (preferStock && unsplashKey) {
    try {
      return await getHealthcareStockPhoto(prompt, unsplashKey);
    } catch (error) {
      console.warn("Stock photo failed, falling back to AI generation:", error);
    }
  }

  // Try AI-generated images
  try {
    return await generateImageWithPollinations(prompt, style);
  } catch (error) {
    console.warn("AI generation failed:", error);
    
    // Final fallback: try stock photos if not already tried
    if (!preferStock && unsplashKey) {
      try {
        return await getHealthcareStockPhoto(prompt, unsplashKey);
      } catch (stockError) {
        console.error("All image generation methods failed");
        throw new Error("Unable to generate image using any available service");
      }
    }
    
    throw error;
  }
};

/**
 * Generate a placeholder image with text (as final fallback)
 */
export const generatePlaceholderImage = (text: string): string => {
  // Create a simple SVG placeholder and convert to base64
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#e2e8f0"/>
      <rect x="50" y="50" width="412" height="412" fill="#cbd5e1" rx="20"/>
      <text x="256" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">
        Healthcare Image
      </text>
      <text x="256" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#64748b">
        ${text.substring(0, 40)}${text.length > 40 ? '...' : ''}
      </text>
      <text x="256" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8">
        Generated by MediGenius
      </text>
    </svg>
  `;
  
  // Convert SVG to base64
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return base64;
};
