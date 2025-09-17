# MediGenius Deployment Guide

## Prerequisites
- Node.js 16 or higher
- npm or yarn
- Git
- Clerk account
- Gemini API key
- Netlify account

## Local Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/medigenius.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Configure your .env.local:
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
GEMINI_API_KEY=your_gemini_key

# Start development server
npm run dev
```

## Production Build
```bash
# Build the application
npm run build

# Test production build locally
npm run preview
```

## Netlify Deployment

### 1. Repository Setup
```bash
# Initialize Git if needed
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial deployment"

# Add remote repository
git remote add origin your-repository-url

# Push to main branch
git push -u origin main
```

### 2. Netlify Configuration
1. Log into Netlify Dashboard
2. Click "New site from Git"
3. Connect to your repository
4. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 16
   ```
5. Add environment variables:
   - VITE_CLERK_PUBLISHABLE_KEY
   - GEMINI_API_KEY

### 3. Domain Setup
1. Configure custom domain
2. Set up SSL certificate
3. Update DNS records if needed

## User Authentication Setup

### Clerk Configuration
1. Create a Clerk application
2. Set up Email Domain allowlist:
   - Go to Clerk Dashboard
   - Navigate to Email Domains
   - Add approved healthcare domains

### Admin Access
1. Set up admin users in Clerk:
   - Navigate to User Management
   - Select user
   - Add custom attribute: `role: "admin"`

2. Configure admin permissions in application

## Troubleshooting

### Build Issues
- Check Node.js version
- Verify all dependencies are installed
- Review build logs

### Authentication Issues
- Verify Clerk configuration
- Check environment variables
- Test authentication flow locally

### API Connection Issues
- Verify API keys
- Check API quotas
- Test API endpoints

## Monitoring

### Netlify Monitoring
- View deploy logs
- Monitor site performance
- Check error logs

### Application Monitoring
- User authentication status
- API usage metrics
- Content generation logs

## Security Considerations
- Keep API keys secure
- Regularly rotate credentials
- Monitor authentication attempts
- Review access logs

## Support
For deployment issues:
- Check Netlify status page
- Review application logs
- Contact support team

