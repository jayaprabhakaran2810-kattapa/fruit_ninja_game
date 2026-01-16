# 🍉 Fruit Ninja - Hand Gesture Edition

A web-based Fruit Ninja game controlled by hand gestures using your webcam!

## 🎮 Features

- **Hand Gesture Control**: Use all five fingertips from both hands to slice fruits
- **MediaPipe Hand Tracking**: Real-time hand detection
- **Multiple Game Modes**: Fruits, Vegetables, or Mixed
- **Difficulty Levels**: Easy, Medium, Hard
- **Sound Effects**: Generated using Web Audio API
- **Particle Effects**: Satisfying fruit slicing animations
- **Score Tracking**: Local high score storage
- **Responsive Design**: Works on desktop and tablet

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### 3. Allow Camera Access

When prompted, allow camera access for hand tracking to work.

## 📦 Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

## 🌐 Deployment Options

### Option 1: Netlify (Recommended - Easy & Free)

1. **Install Netlify CLI** (if not already installed):
```bash
npm install -g netlify-cli
```

2. **Build your project**:
```bash
npm run build
```

3. **Deploy to Netlify**:
```bash
netlify deploy --prod --dir=dist
```

4. Follow the prompts to link or create a new site.

### Option 2: Vercel (Easy Deployment)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

The CLI will automatically detect the Vite project and deploy it.

### Option 3: GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Update `package.json`** to add deploy script:
```json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

3. **Create `vite.config.js`** in the root directory:
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/fruit-ninja/',
})
```

4. **Initialize Git** (if not done):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/fruit-ninja.git
git push -u origin main
```

5. **Deploy**:
```bash
npm run deploy
```

6. **Enable GitHub Pages** in your repository settings (Settings → Pages → Source: gh-pages branch)

### Option 4: Static Hosting Services

Build the project and upload the `dist` folder to any of these services:

- **AWS S3 + CloudFront**: High performance, scalable
- **Firebase Hosting**: Free tier available, easy setup
- **Azure Static Web Apps**: Integrated with GitHub
- **Cloudflare Pages**: Fast CDN, generous free tier
- **Surge.sh**: Simple static hosting

**Quick Deploy with Surge**:
```bash
npm install -g surge
npm run build
cd dist
surge
```

## 🎯 How to Play

1. **Allow camera access** when prompted by your browser
2. **Show your hand(s)** to the camera (make sure it's well lit)
3. **Use any fingertip** (thumb, index, middle, ring, or pinky) to slice fruits - both hands work!
4. **Earn 10 points** for each fruit sliced
5. **Avoid bombs** (💣) - slicing them loses a life!
6. **Don't miss fruits** - you have 3 lives, lose them all and it's game over!
7. **Speed increases** by 10% every 5 seconds - stay sharp!

## ⚙️ Game Settings

- **Player Name**: Enter your name to personalize your game session
- **Object Type**: Choose between Fruits 🍎, Vegetables 🥕, or Mixed 🍇
- **Difficulty**: 
  - Easy: Slower spawn rate (2000ms), 10% bomb chance
  - Medium: Balanced gameplay (1500ms spawn), 15% bomb chance
  - Hard: Fast and challenging (1000ms spawn), 20% bomb chance!
- **Sound**: Toggle sound effects on/off
- **Hand Tracking**: Show/hide the hand skeleton overlay

### Game Mechanics

- **Lives**: Start with 3 lives
  - Lose a life when you miss a fruit
  - Lose a life when you slice a bomb 💣
  - Successfully avoiding a bomb = no penalty!
- **Speed Progression**: Difficulty increases by 10% every 5 seconds
- **Bombs**: Random bombs spawn based on difficulty - avoid slicing them!
- **Two-Hand Support**: Use both hands simultaneously for better coverage
- **Stats Tracking**: View your accuracy, sliced count, and missed count

## 🛠️ Technical Stack

- **Vite**: Fast build tool and development server
- **MediaPipe Hands**: ML-powered hand tracking
- **HTML5 Canvas**: High-performance game rendering
- **Web Audio API**: Dynamic sound effect generation
- **Vanilla JavaScript**: No frameworks, pure performance
- **LocalStorage**: Persistent high score tracking

## 📝 Browser Requirements

- ✅ Modern browser with WebRTC support
  - Chrome 90+ (recommended)
  - Firefox 88+
  - Edge 90+
  - Safari 14+
- ✅ Webcam access
- ✅ JavaScript enabled
- ✅ Minimum screen resolution: 1024x768

## 🐛 Troubleshooting

### Camera not working?
- ✓ Ensure camera permissions are granted in browser settings
- ✓ Check if another application is using the camera
- ✓ Try a different browser (Chrome recommended)
- ✓ Ensure you're on HTTPS or localhost (required for camera access)

### Hand tracking not accurate?
- ✓ Ensure good lighting conditions
- ✓ Position your hand clearly in front of the camera
- ✓ Keep your hand at a reasonable distance (30-60cm from camera)
- ✓ Avoid cluttered backgrounds

### Game performance issues?
- ✓ Close other browser tabs/applications
- ✓ Reduce difficulty to Easy
- ✓ Disable hand tracking overlay in settings
- ✓ Use Chrome for best performance

### Fruits not slicing?
- ✓ Ensure any fingertip (thumb, index, middle, ring, or pinky) touches the fruit
- ✓ All five fingertips from both hands are tracked (shown as colored dots)
- ✓ Check if hand tracking is active (green/cyan skeleton visible)
- ✓ Try using different fingers or both hands for better coverage

## 🎨 Customization

Want to customize the game? Here are some easy tweaks:

### Change Fruit Emojis

Edit `main.js` and modify the `fruitEmojis` object:

```javascript
const fruitEmojis = {
    fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓'],
    // Add your own!
};
```

### Adjust Difficulty

Modify `difficultySettings` in `main.js`:

```javascript
const difficultySettings = {
    easy: { spawnRate: 2000, fallSpeed: 1.0, bombChance: 0.1 },
    medium: { spawnRate: 1500, fallSpeed: 1.0, bombChance: 0.15 },
    hard: { spawnRate: 1000, fallSpeed: 1.0, bombChance: 0.2 }
    // Customize spawn rate (ms), fall speed, and bomb chance
};
```

### Adjust Speed Progression

Modify the speed increase interval in `main.js` at `gameLoop()`:

```javascript
// Change from every 5 seconds to your preferred interval
const speedIncreaseIntervals = Math.floor(elapsedSeconds / 5);
gameState.speedMultiplier = 1 + (speedIncreaseIntervals * 0.1); // 10% per interval
```

### Change Color Scheme

Edit `style.css` and update the gradient colors:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📊 Project Structure

```
fruit-ninja/
├── index.html          # Main HTML file
├── style.css           # All styling and animations
├── main.js            # Game logic and hand tracking
├── package.json       # Dependencies and scripts
├── README.md          # This file
└── vite.config.js     # Vite configuration (optional)
```

## 🚀 Performance Tips

- Use Chrome for best MediaPipe performance
- Ensure good lighting for accurate hand tracking
- Close unnecessary browser tabs
- Use a modern computer with hardware acceleration

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🙏 Credits

- **MediaPipe Hands** by Google - Hand tracking ML model
- **Vite** - Lightning-fast build tool
- Built with ❤️ using vanilla JavaScript

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Enjoy slicing fruits with your hands! 🍉✋**
