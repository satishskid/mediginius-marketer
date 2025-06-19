# 🩺 MediGenius - AI Healthcare Marketing Assistant

Your intelligent assistant for creating professional healthcare marketing content tailored for Indian medical practices.

## 🎯 What is MediGenius?

MediGenius is an AI-powered platform that generates customized marketing content for healthcare professionals across multiple channels - from Instagram posts to Google Business updates, blog ideas to video scripts and images - all tailored to your medical specialty and local audience.

## ✨ Features

- 🤖 **Smart AI Content Generation** - Using multiple AI services for best results
- 🆓 **Free Image Generation** - Works without API keys using free AI services
- 🔐 **Secure Authentication** - User authentication with Clerk
- 📱 **Multi-Platform Support** - Instagram, Facebook, WhatsApp, Google Business, Blog posts, Ads, Video scripts
- 🎨 **Multiple Image Sources** - Google Imagen, Free AI, Unsplash stock photos, Smart placeholders
- ⚡ **Fast & Reliable** - Built with React, TypeScript, and Vite
- 🎯 **India-Focused** - Tailored for Indian healthcare market and regulations
- 📋 **Ready-to-Use Content** - Copy-paste ready content for all platforms

## 🚀 Quick Start (No Setup Required!)

1. **Visit the Live App**: [Your Netlify URL]
2. **Sign In**: Use Google or email
3. **Start Creating**: Works immediately - no API keys required for basic features!

### For Enhanced Features (Optional):
- Add your **free** Google Gemini API key from [Google AI Studio](https://aistudio.google.com)
- Add your **free** Unsplash API key from [Unsplash Developers](https://unsplash.com/developers)

## 📖 Complete User Guide

### 🔧 How to Use

#### Step 1: Basic Information
Fill in your details:
- **Medical Specialty**: e.g., "Cardiologist", "Pediatrician", "Dermatologist"
- **Location**: e.g., "Mumbai, Maharashtra", "Delhi NCR", "Bangalore"
- **Target Audience**: e.g., "Young professionals aged 25-40", "Parents with children"

#### Step 2: Optional Details
- **Topic**: e.g., "World Heart Day", "Monsoon health tips", "New clinic opening"
- **Tone**: e.g., "Professional and trustworthy", "Friendly and approachable"

#### Step 3: Generate Content
Click "Generate Marketing Content" and wait 10-30 seconds.

### 🎨 What You Get

**Text Content:**
- Instagram Post with hashtags
- Facebook Post (longer format)
- WhatsApp Message (personal)
- Google Business Profile Update
- Blog Post Ideas (SEO-friendly)
- Ad Copy (Google/Facebook ready)
- Video Script (Reels/Shorts)

**Visual Content:**
- Image Prompt (AI description)
- Generated Image (actual visual)

### 🖼️ Image Generation System

MediGenius uses a smart fallback system:
1. **🏆 Premium**: Google Imagen (requires Gemini API key)
2. **🆓 Free AI**: Pollinations.ai (completely free, no key needed)
3. **📸 Stock**: Unsplash professional photos (optional free key)
4. **🖼️ Fallback**: Professional custom placeholder

**You always get an image, even without any API keys!**

### 💡 Pro Tips

**Be Specific:**
- ❌ Poor: "Doctor", "India", "People"
- ✅ Good: "Pediatric Cardiologist", "Pune, Maharashtra", "Parents of children with heart conditions"

**Use Relevant Topics:**
- Seasonal: "Monsoon health precautions", "Winter skin care"
- Awareness: "World Diabetes Day", "Breast Cancer Awareness Month"
- Services: "New telemedicine services", "Weekend clinic hours"

## 🔑 API Keys Guide

### Google Gemini API Key (Recommended)
- **Cost**: FREE from Google AI Studio
- **Benefits**: High-quality text generation, premium image creation
- **How to get**: Visit [aistudio.google.com](https://aistudio.google.com), create account, generate API key

### Unsplash API Key (Optional)
- **Cost**: FREE (50 requests/hour)
- **Benefits**: Professional healthcare stock photos
- **How to get**: Visit [unsplash.com/developers](https://unsplash.com/developers), create account, register app

### Other Optional Keys
- **Groq API**: Lightning-fast text generation
- **OpenRouter API**: Access to multiple AI models
- **Stability AI**: Alternative image generation

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd medigenius-ai-healthcare-marketing-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## Deployment to Netlify

### Method 1: Deploy from GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Configure Environment Variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add the following variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
     ```
   - Optional additional API keys:
     ```
     VITE_GROQ_API_KEY=your_groq_api_key_here
     VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
     VITE_STABILITY_API_KEY=your_stability_api_key_here
     ```

4. **Deploy:**
   - Click "Deploy site"
   - Wait for the build to complete

### Method 2: Manual Deploy

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify's deploy area
   - Configure environment variables as above

## Required API Keys

### Gemini API Key (Required)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to your environment variables as `GEMINI_API_KEY`

### Clerk Publishable Key (Required)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key
4. Add it to your environment variables as `VITE_CLERK_PUBLISHABLE_KEY`

### Optional API Keys
- **Groq API**: For additional AI model options
- **OpenRouter API**: For alternative AI models
- **Stability API**: For enhanced image generation

## Project Structure

```
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── ApiKeyWallet.tsx # API key management
│   ├── GeneratorForm.tsx# Content generation form
│   ├── Planner.tsx      # Content planning
│   └── ResultsDisplay.tsx # Generated content display
├── services/            # API services
│   ├── geminiService.ts # Gemini API integration
│   └── mockApiService.ts# Mock API for testing
├── App.tsx             # Main application component
├── constants.ts        # Application constants
├── types.ts           # TypeScript type definitions
└── vite.config.ts     # Vite configuration
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI content generation |
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key for authentication |
| `VITE_GROQ_API_KEY` | No | Groq API key for alternative AI models |
| `VITE_OPENROUTER_API_KEY` | No | OpenRouter API key for various AI models |
| `VITE_STABILITY_API_KEY` | No | Stability AI API key for image generation |

## Medical Disclaimer

⚠️ **Important**: All content generated by this application is AI-generated and for marketing inspiration only. It is NOT medical advice. Please ensure all medical claims are reviewed and approved by a qualified doctor or appropriate healthcare professional before publishing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the GitHub repository.
