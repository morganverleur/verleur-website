# Verleur Website

Final audited static website for [Verleur.com](https://verleur.com), prepared for deployment on Windows Server with IIS.

## Deployment

- Production files are in `wwwroot/`.
- Copy the contents of `wwwroot/` into the IIS website root.
- Keep the included `web.config`.
- Ensure the IIS URL Rewrite module is installed.
- No build step or runtime dependency is required.

See `DEPLOYMENT-GUIDE-IIS.txt` and `SEO-DEPLOYMENT-CHECKLIST.txt` before publishing.

## Entry point

`wwwroot/index.html`

Audit date: July 30, 2026.
