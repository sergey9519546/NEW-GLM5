# Cloudflare Worker Deployment

This project deploys as an OpenNext Cloudflare Worker, not as a Cloudflare Pages `next-on-pages` app.

## 1. Create Cloudflare resources

Create these resources in the same Cloudflare account:

- D1 database: `new-glm5-db`
- R2 bucket: `new-glm5-opennext-cache`
- R2 bucket: `new-glm5-media`

## 2. Update worker config

Edit `/workspaces/NEW-GLM5/wrangler.jsonc` and replace the placeholder `database_id` for the `DB` binding with the real D1 database ID.

Set Worker secrets for the worker named `new-glm5`:

```bash
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put ZAI_API_KEY
```

The worker also expects `ZAI_BASE_URL`, which is already configured in `wrangler.jsonc`.

## 3. Install and build

```bash
npm install
npm run cf:build
```

## 4. Apply D1 schema

This repo now includes the initial D1 migration in `prisma/migrations/0001_init.sql`.

Apply it to the remote Cloudflare D1 database:

```bash
npm run db:d1:remote
```

If you need a local D1 instance for previewing with Wrangler:

```bash
npm run db:d1:local
```

To preview the built worker locally, run the build first and then start Wrangler:

```bash
npm run cf:build
npm run cf:preview
```

## 5. Deploy

```bash
npm run cf:deploy
```

The `cf:deploy` script uses the same direct Wrangler command that was verified to work for this repo:

```bash
CI=1 wrangler deploy --config wrangler.jsonc
```

The `cf:preview` script uses the direct Wrangler preview command:

```bash
wrangler dev --config wrangler.jsonc
```

## Important

Do not use the Cloudflare Pages default Next.js build command `npx @cloudflare/next-on-pages@1` for this repo. That pipeline is incompatible with this app's Worker/OpenNext runtime setup and will fail on the dynamic API routes.