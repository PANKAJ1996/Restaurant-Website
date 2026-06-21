# GitHub Pages Deployment - Quick Start

## Fastest Way to Deploy (2 minutes)

### Step 1: Go to Repository Settings
```
https://github.com/PANKAJ1996/Restaurant-Website/settings
```

### Step 2: Enable GitHub Pages
1. Scroll down to **"Pages"** in the left sidebar
2. Under "Build and deployment":
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` from dropdown
   - **Folder**: Select `/ (root)`
3. Click **Save**

### Step 3: Wait for Deployment
- GitHub will start building automatically
- Takes 1-2 minutes
- Watch the **Actions** tab for status: https://github.com/PANKAJ1996/Restaurant-Website/actions

### Step 4: Access Your Live Site
**URL:** `https://PANKAJ1996.github.io/Restaurant-Website/`

---

## What Gets Deployed

All files from your repository:
- ✅ index.html, menu.html, gallery.html, about.html
- ✅ styles.css
- ✅ script.js
- ✅ images/ folder (all 17 images)
- ✅ reservation.html, cart.html, reservation-confirmation.html

---

## Verify Deployment Status

### Check GitHub Pages Status
1. Go to https://github.com/PANKAJ1996/Restaurant-Website
2. Click the **deployments** section or **Actions** tab
3. Look for a checkmark ✅ indicating successful deployment

### Check the Build Log
- Click **Actions** tab
- Click the most recent workflow
- Scroll down to see "Deploy" step
- Should say "Successfully deployed" in green

---

## Testing Your Live Site

### Test Checklist
```
☐ Home page loads: https://PANKAJ1996.github.io/Restaurant-Website/
☐ Menu page loads: https://PANKAJ1996.github.io/Restaurant-Website/menu.html
☐ Gallery page loads: https://PANKAJ1996.github.io/Restaurant-Website/gallery.html
☐ Images display (check for broken image icons)
☐ Try adding items to cart
☐ Test reservation form
☐ Open DevTools (F12) → Console tab → No red errors
```

### Browser DevTools Check (F12)
1. Open DevTools: **F12** or **Right-click → Inspect**
2. Go to **Console** tab
3. Look for any red error messages
4. Check **Network** tab for failed image loads
5. Go to **Application → Storage → LocalStorage** to verify cart data

---

## Common Issues & Fixes

### Issue: "404 Not Found" Error
**Cause:** GitHub Pages not enabled or wrong branch selected
**Fix:** 
- Go to Settings → Pages
- Verify "Deploy from a branch" is selected
- Verify "main" branch is selected
- Verify "/ (root)" folder is selected
- Wait 2-3 minutes and refresh

### Issue: Images not loading
**Cause:** Image paths are case-sensitive on GitHub Pages
**Fix:** GitHub Pages is case-sensitive. Your image paths look good (lowercase), so should work.
**Verify:** Check Network tab in DevTools (F12)

### Issue: Site shows old version
**Cause:** Browser cache
**Fix:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Or use Ctrl+F5 (hard refresh)
- Or open in Incognito mode

### Issue: Pages not building
**Check:**
1. Actions tab for build errors
2. Verify main branch has all files
3. Try pushing a small change to trigger rebuild

---

## Automatic Updates

Every time you push to GitHub:
```bash
git push
```

GitHub Pages will automatically:
1. Detect the change
2. Rebuild the site
3. Deploy within 1-2 minutes
4. Your live site updates automatically ✨

No need to do anything else!

---

## Share Your Live Site

**Your deployment URL:**
```
https://PANKAJ1996.github.io/Restaurant-Website/
```

Share this link with:
- Clients
- Team members
- For testing across different devices
- On mobile phones and tablets

---

## Next Steps

1. ✅ You already committed your code
2. ✅ You already pushed to GitHub
3. 👉 **Enable GitHub Pages** (follow Step 1-2 above)
4. **Wait 2 minutes** for deployment
5. **Test** at the live URL

**That's it! Your site is now live online.** 🎉
