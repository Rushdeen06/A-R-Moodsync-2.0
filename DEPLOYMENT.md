# 🚀 GitHub Pages Deployment Guide

## Quick Start (5 minutes)

### 1. Create GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Mood Sync app with GitHub Pages support"

# Add remote repository (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/MoodTrackingApp.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment will start automatically

### 3. Update Configuration
In `vite.config.ts`, update the base URL to match your repository name:
```typescript
export default defineConfig({
  base: '/YOUR_REPOSITORY_NAME/',
  // ... rest of config
})
```

### 4. Access Your App
Your app will be available at:
`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

---

## 🔧 Advanced Configuration

### Custom Domain (Optional)
1. Add a `CNAME` file to the `public/` directory:
   ```
   yourdomain.com
   ```
2. Configure DNS at your domain provider
3. Enable HTTPS in GitHub Pages settings

### Environment Variables
For different environments, create `.env` files:
```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_ANALYTICS_ID=your-analytics-id
```

### Build Optimization
The app is already optimized with:
- ✅ Code splitting (vendor, redux, fluent chunks)
- ✅ Tree shaking
- ✅ Minification
- ✅ Gzip compression

---

## 🛡️ Error Prevention & Stability

### Implemented Safeguards

#### 1. Error Boundaries
```typescript
// Wraps entire app and components
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

#### 2. Data Persistence
```typescript
// Automatic localStorage backup
storageService.saveMoodEntries(entries)
storageService.saveCurrentUser(user)
```

#### 3. Loading States
```typescript
// Prevents UI crashes during loading
if (isLoading) {
  return <LoadingSpinner />
}
```

#### 4. Type Safety
- Full TypeScript coverage
- Strict mode enabled
- Runtime type validation

### Crash Prevention Strategies

#### Network Issues
```typescript
// Graceful fallback for network failures
try {
  const data = await apiCall()
} catch (error) {
  // Use cached data from localStorage
  const cachedData = storageService.getData()
  return cachedData || defaultData
}
```

#### Memory Leaks
```typescript
// Proper cleanup in useEffect
useEffect(() => {
  const subscription = subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}, [])
```

#### State Corruption
```typescript
// Validate data before state updates
const validateMoodEntry = (entry: unknown): entry is MoodEntry => {
  return typeof entry === 'object' && 
         entry !== null &&
         'id' in entry &&
         'mood' in entry
}
```

---

## 🔍 Monitoring & Debugging

### Browser DevTools
1. **Console**: Check for JavaScript errors
2. **Network**: Monitor API calls and resource loading
3. **Application**: Inspect localStorage data
4. **Performance**: Analyze bundle size and loading times

### Error Tracking Integration
To add Sentry or similar service:

```typescript
// Install Sentry
npm install @sentry/react

// Configure in main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
})
```

### Performance Monitoring
```typescript
// Add performance tracking
const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
}
```

---

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Fails
```bash
# Check TypeScript errors
npm run type-check

# Check linting issues
npm run lint

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 404 on GitHub Pages
1. Verify `base` URL in `vite.config.ts`
2. Check repository name matches config
3. Ensure `index.html` exists in `dist/`

#### Blank Page After Deployment
1. Check browser console for errors
2. Verify all assets load correctly
3. Check for CORS issues with external resources

#### App Crashes
1. Check Error Boundary is working
2. Verify localStorage is available
3. Check for unhandled promise rejections

### Performance Issues

#### Large Bundle Size
```bash
# Analyze bundle
npm run build -- --analyze

# Check for unused dependencies
npx depcheck
```

#### Slow Loading
1. Enable compression on your server
2. Use CDN for static assets
3. Implement service worker caching

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] TypeScript errors fixed
- [ ] Linting warnings addressed
- [ ] Tests passing (if implemented)
- [ ] Performance optimized
- [ ] Error boundaries in place
- [ ] Data persistence working

### GitHub Setup
- [ ] Repository created
- [ ] GitHub Pages enabled
- [ ] Actions permissions set
- [ ] Base URL configured correctly

### Post-Deployment
- [ ] App loads without errors
- [ ] All features working
- [ ] Mobile responsive
- [ ] Error handling tested
- [ ] Performance acceptable

---

## 🔄 Continuous Deployment

The GitHub Actions workflow automatically:
1. ✅ Installs dependencies
2. ✅ Runs type checking
3. ✅ Runs linting
4. ✅ Builds the project
5. ✅ Deploys to GitHub Pages

### Manual Trigger
```bash
# Force deployment
git commit --allow-empty -m "Trigger deployment"
git push
```

### Environment-Specific Deployments
```yaml
# In .github/workflows/deploy.yml
on:
  push:
    branches: [main]      # Production
    branches: [develop]   # Staging
```

---

## 🎯 Production Checklist

### Security
- [ ] No sensitive data in code
- [ ] Dependencies updated
- [ ] HTTPS enabled
- [ ] CSP headers configured

### Performance
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] Caching configured
- [ ] CDN setup (if needed)

### Monitoring
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## 🆘 Support

If you encounter issues:

1. **Check the console** for error messages
2. **Review the logs** in GitHub Actions
3. **Test locally** with `npm run build && npm run preview`
4. **Compare with working commit** using git diff
5. **Open an issue** with detailed error information

Remember: The app is designed to be resilient and should gracefully handle most errors without crashing!