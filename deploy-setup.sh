#!/bin/bash

# GoTrain Web Deployment Script
# This script prepares your files for GitHub Pages deployment

echo "🥋 GoTrain - Preparing for GitHub Pages deployment..."

# Create deployment directory
mkdir -p gotrain-web-deploy
cd gotrain-web-deploy

echo "📁 Setting up file structure..."

# Copy all necessary files
cp ../index.html .
cp ../App.js .
cp ../index.web.js .
cp ../webpack.config.js .
cp ../README.md .
cp ../DEPLOYMENT.md .

# Rename package-web.json to package.json for deployment
cp ../package-web.json package.json

# Copy app directories
cp -r ../app .
cp -r ../hooks .
cp -r ../components .
cp -r ../types .
cp -r ../assets .

# Copy GitHub Actions workflow
mkdir -p .github/workflows
cp ../.github/workflows/deploy.yml .github/workflows/

# Create .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/

# Build output
dist/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db
EOF

echo "✅ Files prepared in 'gotrain-web-deploy' directory"
echo ""
echo "📋 Next steps:"
echo "1. Create a new GitHub repository"
echo "2. Upload all files from 'gotrain-web-deploy' directory"
echo "3. Enable GitHub Pages in repository settings"
echo "4. Set source to 'GitHub Actions'"
echo "5. Push to main branch to deploy"
echo ""
echo "🌐 Your app will be available at:"
echo "https://yourusername.github.io/your-repo-name"
echo ""
echo "🚀 Happy training!"