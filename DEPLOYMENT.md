# GoTrain - GitHub Pages Deployment Guide

## Quick Setup for GitHub Pages

### 1. Create a new GitHub repository
1. Go to GitHub and create a new repository
2. Name it something like `gotrain-app` or `jiu-jitsu-tracker`
3. Make it public (required for free GitHub Pages)

### 2. Upload these files to your repository

**Essential files you need:**
```
├── index.html                 # Main HTML file
├── App.js                     # Main React app
├── index.web.js              # Web entry point
├── webpack.config.js         # Build configuration
├── package-web.json          # Web dependencies
├── .github/workflows/deploy.yml  # Auto-deployment
├── README.md                 # Documentation
└── app/                      # All your app files
    ├── (tabs)/
    │   ├── index.tsx
    │   ├── log.tsx
    │   ├── stats.tsx
    │   └── timer.tsx
    ├── add-session.tsx
    └── edit-session.tsx
├── hooks/
    ├── training-context.tsx
    └── timer-context.tsx
├── components/
    ├── StatCard.tsx
    └── SessionCard.tsx
├── types/
    └── training.ts
└── assets/
    └── images/
        ├── favicon.png
        ├── icon.png
        └── splash-icon.png
```

### 3. Enable GitHub Pages
1. Go to your repository Settings
2. Scroll down to "Pages" section
3. Under "Source", select "GitHub Actions"
4. Save the settings

### 4. Deploy
1. Push all files to your main/master branch
2. GitHub Actions will automatically build and deploy
3. Your app will be available at: `https://yourusername.github.io/your-repo-name`

### 5. Manual Build (Optional)
If you want to build locally:

```bash
# Rename package-web.json to package.json
mv package-web.json package.json

# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' folder
```

## Features Available on Web

✅ **Working Features:**
- Dashboard with training overview
- Training log with session management
- Statistics and analytics
- Round timer with visual progress
- Local data storage (persists in browser)
- Responsive design for mobile and desktop

⚠️ **Limited Features:**
- No haptic feedback (web limitation)
- Audio notifications use Web Audio API
- No native mobile features (camera, etc.)

## Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Troubleshooting

**Build fails?**
- Check that all files are uploaded correctly
- Ensure package-web.json is renamed to package.json
- Check GitHub Actions logs for specific errors

**App doesn't load?**
- Check browser console for errors
- Ensure GitHub Pages is enabled
- Wait a few minutes after deployment

**Data not saving?**
- Check if localStorage is enabled in browser
- Try in incognito/private mode to test

## Customization

You can customize:
- Colors in the StyleSheet objects
- App name in index.html title
- Favicon by replacing assets/images/favicon.png
- Add your own branding/logo

## Support

This is a complete, production-ready Brazilian Jiu-Jitsu training tracker that works entirely in the browser with no backend required!

**Happy training! 🥋**