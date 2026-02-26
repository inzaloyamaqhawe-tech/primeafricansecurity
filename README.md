# Prime African Security Website

Production-ready React + Vite website setup for deployment on GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (GitHub Pages)

This repo is configured with a GitHub Actions workflow in `.github/workflows/deploy.yml`.
Every push to `main` triggers a build and deploy to GitHub Pages.

### One-time GitHub setup

1. Create a new GitHub repository named `primeafricansecurity`.
2. In the repository settings, open **Pages** and set **Build and deployment** source to **GitHub Actions**.
3. Push this project to the `main` branch.

### First push commands

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/primeafricansecurity.git
git push -u origin main
```
