# Deployment Guide

Your Astro blog is a static site that can be deployed to any hosting service. Here are detailed instructions for popular platforms.

## Before Deploying

1. **Update Site URL** in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: "https://yourdomain.com", // Change this to your domain!
  // ...
});
```

2. **Build the site**:

```bash
npm run build
```

3. **Test locally**:

```bash
npm run preview
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel is optimized for Astro and provides automatic deployments.

**Setup:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and select your repository
4. Vercel auto-detects Astro - just click "Deploy"

**After deployment:**

- Your site is live at `https://your-project.vercel.app`
- Connect a custom domain in project settings
- Automatic deployments on every git push

**Environment Variables:**
If needed, add in Vercel dashboard under Settings > Environment Variables

### 2. Netlify

**Setup:**

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git" and select your repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

**After deployment:**

- Your site is live at `https://your-site-name.netlify.app`
- Connect a custom domain in site settings
- Auto-deploys on git push

### 3. GitHub Pages

**Setup:**

1. Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: "https://username.github.io/repo-name",
  // For organization: 'https://orgname.github.io'
  // ...
});
```

2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. Push to main branch - GitHub Actions will deploy automatically

**Note:** If using organization GitHub Pages, update `site` to just `https://orgname.github.io`

### 4. AWS Amplify

**Setup:**

1. Push to GitHub
2. Go to AWS Amplify Console
3. Click "New app" > "Host web app"
4. Select your GitHub repository
5. Configure:
   - **Build command**: `npm run build`
   - **Base directory**: (leave empty)
   - **Build output directory**: `dist`
6. Deploy

### 5. Cloudflare Pages

**Setup:**

1. Push to GitHub
2. Go to Cloudflare Pages
3. Click "Create a project"
4. Select your repository
5. Configure:
   - **Framework**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Deploy

### 6. Traditional Hosting (cPanel, etc.)

**Setup:**

1. Build locally:

```bash
npm run build
```

2. The `dist/` folder contains your entire static site

3. Upload `dist/` contents to your server via FTP/SFTP

4. Set web root to point to the `dist/` folder

**SSH/Command Line:**

```bash
npm run build
scp -r dist/* user@server.com:/var/www/your-domain/
```

## Post-Deployment Tasks

### 1. Verify RSS Feed

Visit `https://yourdomain.com/rss.xml` - you should see XML content

### 2. Verify Sitemap

Visit `https://yourdomain.com/sitemap-index.xml` - you should see sitemap XML

### 3. Submit to Search Engines

- **Google**: Go to [Google Search Console](https://search.google.com/search-console)
  - Add property for your domain
  - Submit sitemap URL
- **Bing**: Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
  - Add site
  - Submit sitemap

### 4. Set Up Monitoring

- Enable analytics (Google Analytics, Plausible, etc.)
- Set up uptime monitoring
- Configure error tracking if needed

## Continuous Deployment

Most platforms support automatic deployments on git push:

1. Make changes locally
2. Commit and push to your repository
3. Platform automatically builds and deploys
4. Your site updates within seconds

## Custom Domain

After deployment, add your custom domain:

**Vercel:**

- Project Settings > Domains > Add Domain

**Netlify:**

- Domain Settings > Custom Domains

**GitHub Pages:**

- Repository Settings > Pages > Custom domain

**AWS Amplify:**

- App Settings > Domain Management

**Cloudflare Pages:**

- Custom Domains > Add Domain

Then update your domain registrar's DNS to point to the hosting service.

## Environment Variables

For any API keys or secrets:

1. Add to `.env.local` (local development only)
2. Never commit `.env.local` to git
3. Add to hosting platform's environment variables in dashboard

## Troubleshooting

### Site shows old content

- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Clear CDN cache in hosting dashboard
- Hosting platforms usually cache for 24-48 hours

### RSS feed returns 404

- Verify `site` URL is set in `astro.config.mjs`
- Rebuild: `npm run build`

### Deployment fails

- Check build logs in hosting dashboard
- Verify `package.json` is committed
- Ensure Node.js version is 18+

### Custom domain not working

- DNS changes can take 24 hours to propagate
- Check DNS settings with `nslookup` or `dig`
- Verify nameservers point to correct hosting service

## Performance Optimization

After deployment, optimize further:

1. **Enable Gzip compression** - Most hosts do this automatically
2. **Use CDN** - Cloudflare (free) or Bunny CDN
3. **Optimize images** - Use Astro's `<Image>` component
4. **Minify CSS** - Astro does this automatically

## Monitoring

Set up monitoring for:

- **Uptime**: UptimeRobot, Pingdom
- **Performance**: PageSpeed Insights, WebPageTest
- **Analytics**: Google Analytics, Plausible, Simple Analytics
- **Errors**: Sentry, LogRocket

## Backup

Always keep backups:

- Push code to GitHub (version control)
- Export content regularly
- Keep local copies of important files

## Next Steps After Deployment

1. Share your blog with others
2. Promote on social media
3. Set up email newsletter (optional)
4. Submit to directories/aggregators
5. Keep writing great content!

---

**Happy hosting!** 🚀
