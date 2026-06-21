# Offline Server & Testing Guide

## Quick Start

### Windows Batch (Easiest)
1. Double-click **`run-server.bat`**
2. Browser should open automatically at `http://localhost:8000`
3. Press `Ctrl+C` in the command window to stop the server

### PowerShell
1. Right-click **`run-server.ps1`** → Run with PowerShell
2. Or: Open PowerShell, navigate to the folder, and run:
   ```powershell
   .\run-server.ps1
   ```
3. Browser should open automatically at `http://localhost:8000`
4. Press `Ctrl+C` to stop the server

### Python Script (Direct)
1. Open Command Prompt or Terminal in this folder
2. Run:
   ```
   python server.py
   ```
3. Browser should open automatically at `http://localhost:8000`
4. Press `Ctrl+C` to stop the server

### Manual Python
```bash
python -m http.server 8000
# Then open: http://localhost:8000
```

---

## Offline Testing Checklist

### Images
- [ ] All images load on **Home** page
- [ ] Menu items display images correctly
- [ ] Gallery images load without errors
- [ ] Featured cards show images

### Navigation
- [ ] All page links work (Home, About, Menu, Gallery, Reservations)
- [ ] Cart link updates count properly
- [ ] Hero section backgrounds display

### Menu & Cart
- [ ] Menu items display with correct prices
- [ ] "Order" buttons add items to cart
- [ ] Cart page shows added items
- [ ] Cart count updates in header
- [ ] Remove items from cart

### Forms
- [ ] Reservation form validates input
- [ ] Contact form accepts data
- [ ] Confirmation page displays after submission

### Performance
- [ ] Page loads quickly without internet
- [ ] Images are appropriately sized
- [ ] No console errors (F12 → Console tab)

---

## Troubleshooting

### "Python not found" Error
**Solution:** 
- Install Python from https://www.python.org
- During installation, **check** "Add Python to PATH"
- Restart Command Prompt and try again

### Port 8000 Already in Use
**Solution:**
- Edit `run-server.bat` and change `8000` to another port (e.g., `8001`)
- Or close the program using port 8000

### Browser doesn't open automatically
**Solution:**
- Manually open your browser
- Visit `http://localhost:8000`

### Images not loading
**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify `images/` folder contains image files:
   ```
   images/
   ├── aloo-tikki.png
   ├── butter-chicken.png
   ├── chole-bhature.jpg
   └── ... (more images)
   ```

---

## Server Comparison

| Method | Ease | Browser Auto-Open | Cross-Platform |
|--------|------|-------------------|-----------------|
| run-server.bat | ⭐⭐⭐⭐⭐ | ✓ | Windows only |
| run-server.ps1 | ⭐⭐⭐⭐ | ✓ | Windows only |
| server.py | ⭐⭐⭐ | ✓ | Windows, Mac, Linux |
| Manual Python | ⭐⭐ | ✗ | Windows, Mac, Linux |

---

## Testing on Different Browsers

For best testing coverage, test on:
- **Chrome/Edge** - Check network tab (F12)
- **Firefox** - Check console warnings
- **Safari** (if available) - Check responsive design

---

## Notes

- Server runs on `localhost:8000` by default
- All site features work fully offline (no backend required)
- Cart data persists in browser (localStorage)
- Refresh page to test localStorage persistence
