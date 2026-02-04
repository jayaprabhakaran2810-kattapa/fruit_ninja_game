# 🧪 Testing Guide - Hand Tracking & Collision Detection

## Changes Made

I've enhanced the game with better debugging and visualization tools:

### ✅ Visual Enhancements
1. **Collision Radius Visualization** - When "Show Hand Tracking" is enabled:
   - Semi-transparent circles (35px radius) around each fingertip
   - Shows the exact detection zone for slicing fruits
   - Fingertip labels (4, 8, 12, 16, 20) for each tracked point

2. **Hand Detection Status** - Real-time indicator in header:
   - Shows "Hands: 👋 0/1/2" 
   - Green text = hands detected
   - Red text = no hands detected
   - Only visible during gameplay

3. **Debug Console Logs**:
   - When fruit is sliced: position and score updates
   - When bomb is hit: warning and lives remaining
   - Periodic hand tracking status (~every second)

---

## 🔍 Step-by-Step Testing

### Step 1: Open Diagnostic Tool
```
URL: http://localhost:5173/test-diagnostics.html
```

**What to check:**
- [ ] All MediaPipe libraries show ✅
- [ ] Camera permission granted
- [ ] Video feed shows you clearly
- [ ] Hand landmarks appear when you show hands
- [ ] Fingertips show as green dots
- [ ] "Hands detected" count shows 1 or 2
- [ ] "Fingertips detected" shows 5 or 10

**If any fail:** See TROUBLESHOOTING.md

---

### Step 2: Test Main Game

1. **Open Game**
   ```
   URL: http://localhost:5173
   ```

2. **Enable Hand Tracking Visualization**
   - In Settings panel (right side)
   - Check ✅ "Show Hand Tracking"
   - This is CRITICAL for testing!

3. **Grant Camera Permission**
   - Allow camera access when prompted
   - Wait for "Camera ready!" message

4. **Start Game**
   - Enter your name (optional)
   - Click "Start Game"
   - Look at header - should show "Hands: 👋 0"

5. **Test Hand Detection**
   - Hold up one hand
   - Header should change to "Hands: 👋 1" (green)
   - You should see:
     - Red/magenta dots on fingertips
     - Semi-transparent circles around fingertips (35px radius)
     - White numbers (4, 8, 12, 16, 20) labeling fingertips
     - Cyan/green lines connecting hand landmarks

6. **Test Collision Detection**
   - Wait for fruits to fall (emoji characters)
   - Move fingertips to touch falling fruits
   - Fruit should explode into particles when fingertip circle overlaps it
   - Score should increase by +10
   - Console should log: "✅ Fruit sliced! Score: X"

---

### Step 3: Check Browser Console

**Open Console:**
- Mac: `CMD + Option + I` → Click "Console" tab
- PC: `F12` → Click "Console" tab

**Expected Console Messages:**

✅ **Startup:**
```
MediaPipe libraries loaded successfully
Starting hand tracking setup...
Hands instance created, setting options...
Camera started successfully!
```

✅ **During Gameplay:**
```
🖐️ Tracking 1 hand(s) with 5 fingertips
🖐️ Tracking 2 hand(s) with 10 fingertips
```

✅ **When Slicing:**
```
Fruit sliced at (450, 320) by finger at (455, 325)
✅ Fruit sliced! Score: 10, Total sliced: 1
```

❌ **If You See Errors:**
- Red error messages = something is wrong
- Copy the error and check TROUBLESHOOTING.md

---

## 🎯 What Should Happen

### ✅ Success Indicators:
1. Video feed shows you in real-time
2. Hand indicator shows "👋 1" or "👋 2" in green
3. Fingertips have visible red/magenta dots
4. Semi-transparent circles around fingertips
5. Fruits fall from top to bottom
6. When fingertip circle touches fruit = EXPLODES
7. Score increases (+10 per fruit)
8. Particles fly out from sliced fruits
9. Console logs successful slices

### ❌ Problem Indicators:
1. Hand indicator shows "👋 0" in red
2. No hand visualization appears
3. Fruits fall but don't explode when touched
4. No console logs when touching fruits
5. Camera feed is frozen
6. No fingertip circles visible

---

## 🐛 Common Issues

### Issue 1: Hands Not Detected
**Symptoms:** "Hands: 👋 0" stays red, no visualization

**Fixes:**
- Ensure good lighting on your hands
- Keep hands flat and open (don't make a fist)
- Keep hands within camera frame
- Try moving closer to camera
- Ensure background is not too busy

### Issue 2: Fruits Not Slicing
**Symptoms:** Hands detected, but fruits pass through without slicing

**Check:**
1. Is "Show Hand Tracking" enabled? (MUST be on for testing)
2. Are fingertip circles visible?
3. Are fruits actually falling? (should see emoji characters)
4. Is fingertip circle overlapping the fruit?
5. Check browser console for errors

**Try:**
- Use index finger (landmark 8) - most reliable
- Make circular motion to increase contact area
- Slow down your movements
- Ensure good hand tracking (all 5 fingertips visible)

### Issue 3: Collision Not Registering
**Symptoms:** Fingertip touches fruit but no slice

**Debug:**
- Open browser console
- Should see: "Fruit sliced at..." when successful
- If no log = collision not detected
- Verify fingertip is within 35px circle of fruit center
- Fruit size is 50px, so you need to hit the center-ish area

---

## 🎮 Gameplay Tips (Once Working)

1. **Slicing Technique:**
   - Use sweeping motions through fruits
   - All 5 fingertips can slice (not just index finger)
   - Use both hands for more coverage

2. **Avoid Bombs:**
   - Bombs have red glow (💣 emoji)
   - Touching bomb = lose 1 life
   - Let bombs fall off screen safely

3. **Maximize Score:**
   - Don't miss fruits (lose 1 life per miss)
   - Speed increases every 5 seconds
   - Watch the multiplier increase!

---

## 📊 Performance Metrics

**Good Performance:**
- Hand tracking: 20-30 FPS minimum
- Latency: < 100ms from hand move to visual update
- Collision detection: Instant response

**Poor Performance:**
- Laggy hand visualization
- Delayed fruit slicing
- Choppy video feed

**Fixes for Poor Performance:**
- Close other browser tabs
- Disable other camera apps
- Use Chrome (best performance)
- Lower camera resolution (if needed)

---

## 📞 Getting Help

If still not working after following this guide:

1. Complete Step 1 (Diagnostic Tool)
2. Screenshot the diagnostic page results
3. Complete Step 3 (Browser Console)
4. Screenshot any red errors in console
5. Note specifically what's not working:
   - Camera not working?
   - Hands not detected?
   - Collision not working?
   - Something else?

Include this information when asking for help.
