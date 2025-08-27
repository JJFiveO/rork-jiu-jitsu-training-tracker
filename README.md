# GoTrain - Jiu Jitsu Training Tracker

A comprehensive Brazilian Jiu-Jitsu training tracker built with React Native and Expo, deployable to web via GitHub Pages.

## Features

### 🏠 Dashboard
- Welcome screen with training overview
- Quick stats for current week and all-time
- Recent training sessions display
- Quick access to log new sessions

### 📝 Training Log
- Log different types of training sessions:
  - Gi Training
  - No-Gi Training
  - Open Mat
  - Competition
  - Drilling
  - Private Lessons
- Track duration, techniques practiced, and notes
- Filter sessions by type
- Edit and delete existing sessions

### 📊 Statistics
- Comprehensive stats across different time periods (week, month, year, all-time)
- Training breakdown by session type
- Streak tracking (current and longest)
- Average session length and consistency metrics

### ⏱️ Round Timer
- Customizable round timer for training
- Visual progress indicator
- Audio notifications for round transitions
- Quick preset configurations (5min×5, 3min×6, 2min×10)
- Sound toggle and settings customization
- Color-coded interface (green for training, red for rest)

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Query** for state management
- **AsyncStorage** for local data persistence
- **Expo Router** for navigation
- **Lucide React Native** for icons
- **React Native Web** for web compatibility

## Web Deployment

This app is configured for deployment to GitHub Pages:

1. **Fork or clone this repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Build for web:**
   ```bash
   npm run build
   ```
4. **Deploy to GitHub Pages:**
   - Enable GitHub Pages in your repository settings
   - Set source to "GitHub Actions"
   - Push to main/master branch to trigger automatic deployment

## Local Development

### Mobile Development
```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Web Development
```bash
# Install web dependencies
npm install

# Start web development server
npm run dev

# Build for production
npm run build
```

## File Structure

```
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard
│   │   ├── log.tsx        # Training log
│   │   ├── stats.tsx      # Statistics
│   │   └── timer.tsx      # Round timer
│   ├── add-session.tsx    # Add training session
│   └── edit-session.tsx   # Edit training session
├── components/            # Reusable components
├── hooks/                 # Context providers
├── types/                 # TypeScript type definitions
├── assets/               # Images and static assets
└── dist/                 # Built web files (generated)
```

## Features in Detail

### Training Session Types
- **Gi Training**: Traditional BJJ with the gi
- **No-Gi Training**: Grappling without the gi
- **Open Mat**: Free training sessions
- **Competition**: Tournament or competition training
- **Drilling**: Technique-focused practice
- **Private Lessons**: One-on-one instruction

### Timer Features
- Customizable rounds, round time, and rest time
- Visual progress ring
- Audio cues:
  - 30-second warning
  - 10-second countdown
  - Round end signal
  - New round signal
- Quick presets for common training formats
- Sound toggle for quiet environments

### Data Persistence
- All data stored locally using AsyncStorage
- No server required - works completely offline
- Data persists between app sessions

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own training tracking needs!

## Acknowledgments

- Built with Expo and React Native
- Icons by Lucide
- Inspired by the Brazilian Jiu-Jitsu community

---

**Train hard, track progress, improve daily! 🥋**