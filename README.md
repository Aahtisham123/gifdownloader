# Framepop

GIF downloader and GIF maker. Public links are checked in the browser and routed to the matching tool. Files you create are meant to stay on the device.

The site name and domain live in `config/site.ts`. Platform size limits and URL hosts live in `config/platforms.ts`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run typecheck
npm run build
```

Copy `.env.example` when you need a public URL or, later, a proxy signing secret.
