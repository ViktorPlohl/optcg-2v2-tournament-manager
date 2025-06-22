# 🚀 Quick Setup Guide

## ⚡ Fastest Way to Run

### Method 1: Download from GitHub (Recommended)
1. **Click** the green "Code" button on GitHub
2. **Select** "Download ZIP"
3. **Extract** the ZIP file to your computer
4. **Double-click** `index.html` 
5. **Done!** The tournament manager opens in your browser

### Method 2: With Local Server (Recommended for some browsers)
```bash
# Option A: Python (usually pre-installed)
python -m http.server 8000
# Then visit: http://localhost:8000

# Option B: Node.js
npx live-server

# Option C: PHP (if available)
php -S localhost:8000
```

> **💡 Why use a server?** Some browsers (especially Chrome) may block local file access due to CORS policies. A local server solves this issue.

---

## 📁 Required Files

Make sure you have these files in the same folder:
- `index.html` ← **Main file to open**
- `tournament_script.js` ← Core logic
- `tournament_styles.css` ← Styling
- `tournament_script.test.js` ← Tests (optional)

---

## 🔧 Testing (Optional)

If you want to run tests:
```bash
npm install
npm test
```

---

## 🌐 Browser Compatibility

✅ **Works in:**
- Chrome
- Firefox  
- Safari
- Edge
- Any modern browser

❌ **Doesn't work in:**
- Internet Explorer
- Very old browsers

---

## 💡 Troubleshooting

**Problem**: App doesn't load or shows CORS errors
**Solution**: Use Method 2 (local server) instead of opening the file directly. Chrome especially blocks local file access.

**Problem**: Tournament data disappears after closing browser
**Solution**: This is normal! Data is saved in browser storage. Use the same browser and it will persist.

**Problem**: Tests won't run
**Solution**: You need Node.js installed. But tests are optional - the app works without them.

**Problem**: Styling looks broken
**Solution**: Make sure `tournament_styles.css` is in the same folder as `index.html`.

**Problem**: JavaScript errors in console
**Solution**: Try using a local server (Method 2) or use Firefox/Safari which are more permissive with local files.

---

## 🎯 Quick Start Checklist

- [ ] Download all files to one folder
- [ ] Open `index.html` in browser
- [ ] Register at least 2 teams
- [ ] Click "Start Tournament"
- [ ] Enjoy your One Piece TCG tournament! 🏴‍☠️

---

*Need help? Check the full documentation in README.md or README-HU.md* 