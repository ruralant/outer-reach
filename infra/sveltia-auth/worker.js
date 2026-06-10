/**
 * Minimal self-hosted GitHub OAuth relay for Sveltia CMS (single file, zero
 * dependencies). Implements the Netlify/Decap-compatible popup flow that
 * Sveltia expects, so authentication never touches a third-party service.
 *
 * Routes:
 *   GET /auth?provider=github&site_id=<host>  — start OAuth, redirect to GitHub
 *   GET /callback?code=...&state=...          — exchange code, hand token to the CMS popup
 *
 * Secrets (set via `wrangler secret put`):
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 *
 * Optional var (wrangler.toml [vars]):
 *   ALLOWED_DOMAINS — comma-separated hosts allowed to use this relay,
 *                     e.g. "www.outerreach.life,localhost:4321"
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/auth") return handleAuth(url, env);
    if (url.pathname === "/callback") return handleCallback(url, request, env);
    return new Response("Sveltia CMS OAuth relay. Nothing to see here.", { status: 404 });
  },
};

function handleAuth(url, env) {
  if (url.searchParams.get("provider") !== "github") {
    return new Response("Unsupported provider", { status: 400 });
  }

  // The CMS sends its own host as site_id; use it to optionally restrict
  // which sites may authenticate through this relay.
  const siteId = url.searchParams.get("site_id") ?? "";
  if (env.ALLOWED_DOMAINS) {
    const allowed = env.ALLOWED_DOMAINS.split(",").map((d) => d.trim());
    if (!allowed.includes(siteId)) {
      return new Response("Site not allowed", { status: 403 });
    }
  }

  const state = crypto.randomUUID().replaceAll("-", "");
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set("scope", "repo");
  authUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.href,
      "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600`,
    },
  });
}

async function handleCallback(url, request, env) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = (request.headers.get("Cookie") ?? "").match(/oauth_state=([0-9a-f]+)/)?.[1];

  let payload;

  if (!code || !state || state !== cookieState) {
    payload = { error: "Invalid OAuth state or missing code" };
  } else {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "sveltia-oauth-relay",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await res.json();
    payload = data.access_token
      ? { token: data.access_token, provider: "github" }
      : { error: data.error_description ?? "Token exchange failed" };
  }

  const result = `authorization:github:${payload.error ? "error" : "success"}:${JSON.stringify(payload)}`;
  // Escape "<" so a hostile error_description can't break out of the <script>.
  const resultJs = JSON.stringify(result).replaceAll("<", "\\u003c");

  // Standard Netlify/Decap/Sveltia handshake: the popup announces itself with
  // a wildcard target, the CMS replies, and the token is then delivered only
  // to the origin that replied.
  const html = `<!doctype html><meta charset="utf-8"><title>Authenticating…</title><script>
    window.addEventListener("message", ({ data, origin }) => {
      if (data === "authorizing:github") {
        window.opener.postMessage(${resultJs}, origin);
        window.close();
      }
    });
    window.opener?.postMessage("authorizing:github", "*");
  </script><p>Authenticating… you can close this window if it does not close itself.</p>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Set-Cookie": "oauth_state=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0",
    },
  });
}
