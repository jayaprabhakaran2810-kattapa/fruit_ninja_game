# 🔧 Fruit Ninja Hand Tracking Troubleshooting Guide

## Issue: Unable to Squash Fruits/Vegetables

### Quick Diagnostics

I've created a diagnostic tool for you: **http://localhost:5173/test-diagnostics.html**

This page will test:
1. ✅ MediaPipe libraries loading
2. ✅ Camera access and permissions
3. ✅ Hand detection (shows number of hands)
4. ✅ Fingertip detection (shows all 10 fingertips from both hands)
5. 👁️ Live visualization of hand tracking

---

## Common Issues & Solutions

### 1. Camera Permission Not Granted
**Symptoms:** No video feed, camera status shows error
**Solution:**
- Click the camera icon 🎥 in your browser's address bar
- Select "Allow" for camera access
- Refresh the page (CMD+R)

### 2. MediaPipe Libraries Not Loading
**Symptoms:** Long loading time, error messages about libraries
**Solution:**
- Check your internet connection (MediaPipe loads from CDN)
- Clear browser cache and hard refresh (CMD+SHIFT+R)
- Try a different browser (Chrome, Firefox, Edge)

### 3. Hand Tracking Not Showing
**Symptoms:** Camera works but hands not detected
**Solution:**
- Ensure good lighting - your hands need to be well-lit
- Keep hands within camera frame
- Try the "Show Hand Tracking" toggle in settings to see if tracking is working
- Make sure hands are visible against a contrasting background

### 4. Collision Detection Not Working
**Symptoms:** Hands detected but fruits not slicing
**Solution:**
- **ENABLE "Show Hand Tracking"** in the settings panel
- Verify green dots appear on your fingertips
- Make sure you're using fingertips to touch fruits (not palm)
- Check that fruits are actually falling (they should appear as emojis)

---

## Step-by-Step Testing Procedure

### Test 1: Open Diagnostic Page
1. Open: http://localhost:5173/test-diagnostics.html
2. Grant camera permission when prompted
3. Verify all checks show green ✅
4. Hold up your hands - you should see:
   - Hand count: 1 or 2
   - Fingertips detected: 5 or 10
   - Green dots on your fingertips
   - Cyan lines connecting hand landmarks

### Test 2: Main Game Testing
1. Open: http://localhost:5173
2. Grant camera permission
3. **IMPORTANT:** Enable "Show Hand Tracking" checkbox in settings
4. Click "Start Game"
5. Hold up your hands - verify you see visualization
6. When fruits fall, move fingertips to touch them
7. Fruits should explode into particles when touched

---

## Technical Details

### Collision Detection
- Uses **5 fingertip landmarks** per hand (Thumb, Index, Middle, Ring, Pinky)
- Detection radius: **35 pixels** around each fingertip
- Supports **both hands simultaneously** (up to 10 fingertips)

### Hand Tracking Settings
- Max hands: 2
- Model complexity: 1 (balanced)
- Detection confidence: 0.5
- Tracking confidence: 0.5

### Fingertip Indices (MediaPipe)
- Thumb tip: 4
- Index finger tip: 8
- Middle finger tip: 12
- Ring finger tip: 16
- Pinky tip: 20

---

## Browser Compatibility

✅ **Recommended:** Google Chrome, Microsoft Edge  
⚠️ **Works:** Firefox (may have performance issues)  
❌ **Not Supported:** Safari (MediaPipe issues)

---

## Performance Tips

1. **Use Good Lighting:** Bright, even lighting improves tracking
2. **Simple Background:** Avoid busy backgrounds behind your hands
3. **Close Other Tabs:** Free up browser resources
4. **Update Browser:** Use the latest version

---

## Still Not Working?

### Check Browser Console
1. Press **F12** or **CMD+Option+I**
2. Click "Console" tab
3. Look for red error messages
4. Share screenshots of errors if you need help

### Verify Game Is Running
- Fruits should be falling from top to bottom
- Lives indicator should show hearts (❤️❤️❤️)
- Score should be at 0

### Camera Verification
- Video feed should show you in real-time
- Image should not be frozen
- Camera indicator light should be on

---

## Quick Fix Checklist

- [ ] Camera permission granted
- [ ] Internet connection active (for MediaPipe CDN)
- [ ] Using Chrome or Edge browser
- [ ] Good lighting on hands
- [ ] "Show Hand Tracking" enabled in settings
- [ ] Hands visible in camera frame
- [ ] Fingertips touching falling fruits
- [ ] No browser console errors

---

## Expected Behavior

When everything works correctly:
1. ✅ Camera shows live video feed
2. ✅ Hands are detected (with tracking enabled, you see landmarks)
3. ✅ Fruits fall from top of screen
4. ✅ Moving fingertips to touch fruits causes them to explode
5. ✅ Score increases (+10 per fruit)
6. ✅ Particle effects show when slicing
7. ✅ Sound effects play (if enabled)

---

## Contact Info

If issues persist after following this guide:
1. Open the diagnostic page and take a screenshot
2. Open browser console (F12) and screenshot any errors
3. Note what specifically isn't working (camera, tracking, collision, etc.)
