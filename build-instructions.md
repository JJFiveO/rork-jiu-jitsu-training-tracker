# GoTrain Web Deployment Instructions

## Files needed for GitHub Pages:

### Core files to copy to your GitHub repository:
1. All files in `app/` folder
2. All files in `assets/` folder  
3. All files in `components/` folder
4. All files in `hooks/` folder
5. All files in `types/` folder
6. `package-web.json` (rename to `package.json`)
7. `webpack.config.js`
8. `index.html`
9. `index.web.js`
10. `App-web.js`
11. `tsconfig.json`
12. `.github/workflows/deploy.yml`

## Deployment Steps:

### Option 1: Automatic with GitHub Actions (Recommended)
1. Create new GitHub repository
2. Upload all files listed above
3. Go to Settings → Pages → Source: "GitHub Actions"
4. Push to main branch - auto-deploys!

### Option 2: Manual Build
1. Run `npm install` 
2. Run `npm run build`
3. Upload contents of `dist/` folder to GitHub Pages

## Your app will be available at:
`https://[username].github.io/[repository-name]/`

## Important Notes:
- The webpack config is already set up for GitHub Pages
- All React Native components are web-compatible
- The app includes a round timer with audio (web-compatible)
- Mobile-responsive design included