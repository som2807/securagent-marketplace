# SecurAgent Marketplace

A GitHub-ready React/Vite copy of the public Base44 SecurAgent AI-agent marketplace, prepared for Render deployment.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/som2807/securagent-marketplace)

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy On Render

1. Push this folder to a GitHub repository.
2. In Render, create a new Web Service from that repository.
3. Render can use `render.yaml` automatically, or configure:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Runtime: Static
   - Rewrite rule: `/*` to `/index.html`

The app is a static SPA with client-side routes for the marketplace, dashboard, publish form, and agent detail pages.
