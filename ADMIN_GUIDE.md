# MediGenius Admin Guide & Deployment Manual

## Table of Contents
1. [Admin Features](#admin-features)
2. [User Authentication](#user-authentication)
3. [Deployment Process](#deployment-process)
4. [Environment Setup](#environment-setup)

## Admin Features

### Accessing Admin Mode
1. Login with an admin-whitelisted email through Clerk authentication
2. Admin status is automatically detected and the admin dashboard icon (🛡️) appears in the header
3. Click the admin dashboard icon to access admin features

### Admin Capabilities
1. **API Management**
   - Monitor API usage and quotas
   - Add/remove API keys
   - Configure API fallbacks
   - View API health status

2. **User Management**
   - View active users
   - Manage whitelist
   - Monitor user activity
   - Set user permissions

3. **Content Monitoring**
   - Review generated content
   - Set content filters
   - Configure compliance rules
   - Monitor usage patterns

4. **System Settings**
   - Configure rate limits
   - Set platform defaults
   - Manage template library
   - Configure emergency messages

## User Authentication

### Whitelisted User Access
1. Only approved email domains can access the system
2. Authentication is handled through Clerk
3. Process:
   ```
   a. User attempts login
   b. Email domain is checked against whitelist
   c. If approved, user is granted access
   d. Admin role is assigned if email is in admin list
   ```

### Setting Up Whitelisted Domains
1. Access Clerk Dashboard
2. Navigate to "Authentication" → "Email Domains"
3. Add approved domains:
   - healthcare.org
   - medigenius.com
   - [other approved domains]

### Admin User Setup
1. In Clerk Dashboard:
   - Go to "Users" section
   - Select user
   - Add custom attribute: `role: "admin"`
2. In MediGenius:
   - Admin privileges are automatically granted
   - Admin dashboard becomes accessible

## Deployment Process

### Prerequisites
- Node.js 16+
- Clerk account
- Gemini API key
- Git access
- Netlify account

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values:
# VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
# GEMINI_API_KEY=your_gemini_key

# Start development server
npm run dev
```

### Deployment to Netlify

1. **Prepare Repository**
   ```bash
   # Initialize Git if needed
   git init
   
   # Add files
   git add .
   
   # Commit changes
   git commit -m "Initial commit"
   
   # Add remote repository
   git remote add origin your-repo-url
   
   # Push to main branch
   git push -u origin main
   ```

2. **Netlify Setup**
   - Log into Netlify
   - Connect to your Git repository
   - Configure build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```
   - Add environment variables in Netlify:
     ```
     VITE_CLERK_PUBLISHABLE_KEY
     GEMINI_API_KEY
     ```

3. **Domain Setup**
   - Set up custom domain in Netlify
   - Configure SSL certificate
   - Update DNS records

## Environment Setup

### Required Environment Variables
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-key

# API Keys
GEMINI_API_KEY=your-gemini-key

# Optional Configuration
VITE_MAX_REQUESTS_PER_MINUTE=60
VITE_CONTENT_FILTER_LEVEL=strict
```

### Security Configurations
1. **API Key Management**
   ```typescript
   // Configure in constants.ts
   export const API_SECURITY = {
     maxRequestsPerMinute: 60,
     keyRotationHours: 24,
     ipWhitelist: ['allowed-ip-ranges']
   };
   ```

2. **Content Filters**
   ```typescript
   // Configure in constants.ts
   export const CONTENT_FILTERS = {
     strict: ['blocked-terms'],
     moderate: ['cautioned-terms'],
     light: ['flagged-terms']
   };
   ```

## Monitoring & Maintenance

### Health Checks
- API status monitoring
- User session tracking
- Content generation metrics
- System performance stats

### Regular Maintenance
1. Update API keys monthly
2. Review user whitelist quarterly
3. Update content filters as needed
4. Monitor system logs daily

### Emergency Procedures
1. System lockdown process
2. Content generation suspension
3. Emergency notifications
4. Backup authentication methods

## Support & Resources
- Technical Support: support@medigenius.com
- Admin Documentation: /admin/docs
- API Documentation: /api/docs
- Security Guidelines: /security/guide
