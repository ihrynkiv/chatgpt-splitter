# 🚀 GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `chatgpt-splitter` (⚠️ **Important**: Use this exact name or update `vite.config.js`)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we already have files)

**📝 Note**: The repository name becomes part of your URL. If you use a different name, update the `base` path in `vite.config.js` to match.

### Step 2: Push Your Code
```bash
# In your project folder, run these commands:
git remote add origin https://github.com/YOUR_USERNAME/chatgpt-splitter.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically trigger and deploy your app!

### Step 4: Get Your Live URL
After deployment completes (2-3 minutes):
- Your app will be live at: `https://YOUR_USERNAME.github.io/chatgpt-export-splitter/`
- Check the **Actions** tab to see deployment progress
- Green checkmark = successfully deployed! 🎉

## ✨ Automatic Deployment

The included GitHub Action (`.github/workflows/deploy.yml`) will:
- ✅ Automatically build your app on every push to `main`
- ✅ Deploy the latest version to GitHub Pages
- ✅ Use Node.js 18 for compatibility
- ✅ Cache dependencies for faster builds

## 🔄 Making Updates

To update your live app:
1. Make changes to your code
2. Commit and push to `main` branch
3. GitHub automatically rebuilds and redeploys
4. Changes live in 2-3 minutes!

## 🌐 Custom Domain (Optional)

To use a custom domain:
1. In repository **Settings** → **Pages**
2. Add your domain in **Custom domain** field
3. Add a `CNAME` file to your repository root with your domain

## 📊 Features Enabled

Your GitHub Pages deployment includes:
- ✅ **Free hosting** (unlimited bandwidth for public repos)
- ✅ **HTTPS by default** (secure connections)
- ✅ **CDN powered** (fast global delivery)
- ✅ **Auto-deployment** (updates on every push)
- ✅ **No server management** (static hosting)

## 🔧 Troubleshooting

**If deployment fails:**
1. Check **Actions** tab for error details
2. Ensure repository is **Public**
3. Verify **Pages** is set to **GitHub Actions**

**If app doesn't work:**
1. Check browser console for errors
2. Verify all files are in `dist/` folder
3. Test locally with `npm run preview`

## 💡 Pro Tips

1. **Repository name becomes part of URL** - choose wisely!
2. **Keep repository public** for free GitHub Pages
3. **Check Actions tab** to monitor deployments
4. **Use meaningful commit messages** for deployment tracking

---

## 🎉 Result

After setup, you'll have:
- **Live app** at `https://YOUR_USERNAME.github.io/chatgpt-export-splitter/`
- **Automatic updates** on every code change
- **Professional URL** to share with anyone
- **Zero hosting costs** 💰

Perfect for sharing your ChatGPT Export Splitter with the world!