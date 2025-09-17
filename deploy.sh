#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting MediGenius Deployment Process${NC}\n"

# Check for required environment variables
echo -e "${YELLOW}Checking environment variables...${NC}"
if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ] || [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}Error: Missing required environment variables${NC}"
    echo "Please set the following variables:"
    echo "- VITE_CLERK_PUBLISHABLE_KEY"
    echo "- GEMINI_API_KEY"
    exit 1
fi

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies${NC}"
    exit 1
fi

# Build the application
echo -e "\n${YELLOW}Building application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi

# Run tests if they exist
if [ -f "package.json" ] && grep -q "\"test\":" "package.json"; then
    echo -e "\n${YELLOW}Running tests...${NC}"
    npm test
    if [ $? -ne 0 ]; then
        echo -e "${RED}Warning: Tests failed${NC}"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Git operations
echo -e "\n${YELLOW}Checking Git status...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit"
else
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Check if remote exists
if ! git remote | grep -q "^origin$"; then
    echo -e "\n${YELLOW}No Git remote found.${NC}"
    read -p "Enter your Git repository URL: " repo_url
    git remote add origin $repo_url
fi

# Push to repository
echo -e "\n${YELLOW}Pushing to repository...${NC}"
git push -u origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to push to repository${NC}"
    exit 1
fi

echo -e "\n${GREEN}Deployment preparation complete!${NC}"
echo -e "Next steps:"
echo "1. Go to your Netlify dashboard"
echo "2. Deploy the site from Git"
echo "3. Configure environment variables in Netlify"
echo "4. Set up custom domain if needed"

echo -e "\n${GREEN}Done!${NC}"
