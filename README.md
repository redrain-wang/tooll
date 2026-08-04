# ToolBox - Free Online Utility Toolbox

> A lightweight, fast, offline-capable online tool platform with 108+ tools across 10 categories, built with Vue 3 + Vite + Tailwind CSS.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/github/deployments/redrain-wang/tooll/github-pages?label=pages)](https://redrain-wang.github.io/tooll/)

- **Online Demo**: https://redrain-wang.github.io/tooll/
- **Live Site**: https://tooll.cc.cd

---

## Features

- **108+ Tools** covering 10 categories: Text, Developer, Frontend, Regex, Crypto, Generator, Convert, Color, Utility, Time, Network
- **Bilingual** (Chinese/English) with auto-remembered language preference
- **Dark/Light Mode** with responsive layout for all devices
- **Sidebar Navigation** with search, recent tools, favorites, and sharing
- **Backend Services** for Translation, RSA, AES, and Hash operations
- **Ad-Ready** with built-in Google AdSense slots
- **Docker Support** with multi-stage build (Nginx + backend services in one image)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 (`<script setup>`) + Vue Router 4 + Vite 5 |
| Styling | Tailwind CSS 3 + PostCSS + Autoprefixer |
| Components | Pure Vue SFC, no UI library dependencies |
| Utilities | xlsx (JSON/Excel), native Web APIs |
| Backend | Flask (Python 3.11) / Node.js + Express (optional) |
| Container | Nginx + Supervisor + Gunicorn |
| Deployment | Docker / Docker Compose / 1Panel / Manual |

---

## Directory Structure

```
toolbox/
├── src/                 # Frontend source
│   ├── components/      # Shared components (ads, tree nodes, etc.)
│   ├── composables/     # Composable functions (tool stats, etc.)
│   ├── data/            # Category and tool route data
│   ├── i18n.js          # Chinese/English translations (300+ keys)
│   ├── router/          # Route configuration
│   ├── views/           # Page views (Home / 404)
│   │   └── tools/       # 108 tool components
│   ├── App.vue          # Main layout
│   └── main.js          # Entry point
├── server/              # Node.js backend (optional): MyMemory translation proxy
├── server_py/           # Python backend (default): Translation + RSA + AES + Hash
├── public/              # Static assets: favicon, manifest, sitemap, robots.txt
├── tests/               # Unit tests (Vitest) and E2E tests (Playwright)
├── nginx.conf           # Container Nginx config (HTTP)
├── nginx-tooll.conf     # Host Nginx config template (HTTPS reverse proxy)
├── Dockerfile           # Multi-stage build
├── supervisord.conf     # Container process manager
├── package.json         # Frontend dependencies & scripts
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

---

## Quick Start

### Docker (Recommended)

```bash
# Build image
docker build -t toolbox:latest .

# Run container
docker run -d \
  --name toolbox \
  --restart unless-stopped \
  -p 8089:80 \
  toolbox:latest
```

Access: `http://your-server-ip:8089`

### Docker Compose

```yaml
version: "3.8"
services:
  toolbox:
    build: .
    container_name: toolbox
    restart: unless-stopped
    ports:
      - "8089:80"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

```bash
docker compose up -d
```

### Manual Development

```bash
# Install dependencies
npm ci

# Start dev server (default port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Services (Development)

```bash
# Python backend (default)
cd server_py
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Translation service
gunicorn --bind 0.0.0.0:3001 --workers 2 translate:app

# RSA service
gunicorn --bind 0.0.0.0:3002 --workers 2 rsa_server:app

# AES service
gunicorn --bind 0.0.0.0:3003 --workers 2 aes_server:app
```

---

## Service Ports (Container Internal)

| Port | Service |
|------|---------|
| 80 | Nginx (frontend + API proxy) |
| 3001 | Translation API (Python/Node) |
| 3002 | RSA Key Generation + Hash |
| 3003 | AES Encrypt/Decrypt |

---

## Quick Reference

| Action | Command |
|--------|---------|
| Dev mode | `npm run dev` |
| Build | `npm run build` |
| Test | `npm run test` |
| Build Docker image | `docker build -t toolbox:latest .` |
| Run container | `docker run -d -p 8089:80 --restart unless-stopped --name toolbox toolbox:latest` |
| Start (Compose) | `docker compose up -d` |
| Stop (Compose) | `docker compose down` |
| View logs | `docker logs -f toolbox` |
| Enter container | `docker exec -it toolbox sh` |

---

## Configuration

### Change Port

- **Development**: Edit `server.port` in `vite.config.js`
- **Docker**: Change `-p 外部端口:80` in `docker run`
- **1Panel**: Update reverse proxy target address

### Enable Ads

1. Edit `index.html` and replace the Google AdSense `ca-pub` ID
2. Configure ad slot IDs in `src/components/AdBanner.vue` and `AdSidebar.vue`
3. Remove the `hidden` class from ad slot elements in `src/views/Home.vue`

### Add New Tool

1. Add route entry in `src/data/categories.js`
2. Add translation keys (`tool-key` and `tool-key-desc`) to `src/i18n.js` (both `zh` and `en` sections)
3. Add lazy-loaded route in `src/router/index.js`
4. Create tool component in `src/views/tools/`

---

## i18n

All UI text uses `t('key')` function calls. The `src/i18n.js` file contains 300+ translation keys for both Chinese and English. To add new translations:

```js
// In i18n.js zh section:
'my-new-key': '中文文案',

// In i18n.js en section:
'my-new-key': 'English text',
```

Usage in templates:
```html
<h1>{{ t('my-new-key') }}</h1>
```

---

## Production Notes

1. **HTTPS**: Recommended for production. Use `nginx-tooll.conf` as template.
2. **SSL Certificates**: Let's Encrypt path: `/etc/letsencrypt/live/your-domain/`
3. **Caching**: Static assets use 1-year cache with content-hash filenames.
4. **Translation API**: Free tier has daily limits. Consider paid API for commercial use.
5. **Backup**: Data is stored in browser localStorage. Only code repository needs backup.

---

## Browser Support

Modern browsers (Chrome, Firefox, Edge, Safari - latest 2 major versions).

---

## Development

```bash
npm install
npm run dev        # dev server on http://localhost:3000
npm run build      # production build to dist/
npm test           # run vitest unit tests
```

Push to `main` automatically builds and deploys to GitHub Pages via GitHub Actions.

---

## License

MIT

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request
