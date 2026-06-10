# Sveltia CMS — self-hosted OAuth relay

A single-file Cloudflare Worker that lets Sveltia CMS (at `/admin/` on the
site) authenticate against GitHub without routing through any third-party
vendor. No database, no dependencies; free tier is more than enough.

The CMS popup flow: `/admin` → Worker `/auth` → GitHub login → Worker
`/callback` → token handed back to the CMS via `postMessage`. The GitHub
token never leaves your browser + your Worker.

## One-time setup (manual steps — you must do these yourself)

### 1. Create the GitHub OAuth App

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   (on your personal account, since the repo is `ruralant/outer-reach`).
2. Fill in:
   - **Application name:** `Outer Reach CMS` (anything)
   - **Homepage URL:** `https://www.outerreach.life`
   - **Authorization callback URL:** `https://sveltia-auth.<YOUR-SUBDOMAIN>.workers.dev/callback`
     — you can come back and correct this after step 2 if you don't know your
     `workers.dev` subdomain yet.
3. Register, then copy the **Client ID** and generate a **Client secret**.

> The app needs the `repo` scope (requested by the Worker at login time);
> nothing to configure on the GitHub side for that.

### 2. Deploy the Worker

```sh
cd infra/sveltia-auth
npx wrangler login          # opens browser, authorises your Cloudflare account
npx wrangler deploy         # prints the Worker URL, e.g. https://sveltia-auth.antonio.workers.dev
npx wrangler secret put GITHUB_CLIENT_ID      # paste the Client ID
npx wrangler secret put GITHUB_CLIENT_SECRET  # paste the Client secret
```

If the deployed URL differs from what you put in the GitHub OAuth App's
callback URL, go back and fix the callback URL to
`https://<actual-worker-url>/callback`.

### 3. Point the CMS at the Worker

In `public/admin/config.yml`, replace the placeholder:

```yaml
backend:
  name: github
  repo: ruralant/outer-reach
  branch: main
  base_url: https://<actual-worker-url>   # ← your Worker, no trailing slash
  auth_endpoint: auth
```

Commit, deploy the site, open `https://www.outerreach.life/admin/`, and click
**Sign in with GitHub**.

### 4. (Optional, recommended) Lock the relay to your site

Uncomment `[vars] ALLOWED_DOMAINS` in `wrangler.toml` and redeploy, so other
sites can't piggyback on your relay.

## Local editing without any of this

Sveltia CMS can work directly against the local clone (File System Access
API, Chrome/Edge): run `pnpm dev`, open `http://localhost:4321/admin/`, and
choose **Work with Local Repository**. No OAuth, no Worker needed — useful
for testing the config before deploying anything.
