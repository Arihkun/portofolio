# Ari Hendrawan — Portfolio

Public portfolio for a Risk and Data Scientist, built with Next.js and TypeScript. The site is statically generated from Markdown case studies and does not require a database, CMS, authentication, or environment variables.

## Run locally

Requirements: Node.js 20 or newer and npm.

```powershell
cd "D:\Project\cv's\portfolio"
npm install
npm run dev
```

Open `http://localhost:3000`.

The first `npm install` also creates `package-lock.json`. Keep that file in the repository so local and Vercel installs resolve the same dependency versions.

Before publishing, run:

```powershell
npm run check
```

This runs ESLint, TypeScript checking, and a production build.

## Update the portfolio

- Project case studies: edit the Markdown files in `content/projects`.
- Project order: edit `projectOrder` in `lib/projects.ts`.
- Contact links and canonical domain: edit `lib/site.ts`.
- Public resume content: edit `lib/resume.ts` and `app/resume/page.tsx`.
- Profile photo: replace `public/me.jpeg` with another image using the same file name.
- Main page and About copy: edit `app/page.tsx` and `app/about/page.tsx`.

### Project media and public metrics

The five selected projects use different kinds of evidence: the credit-scoring card shows a reproducible public-data benchmark; CDE and OCR use explicitly illustrative diagrams; Koii and KasMate use silent clips captured from local-only fixture views. They are not production recordings or integration-test evidence.

To reproduce the credit-scoring figures:

```powershell
python -m pip install pandas numpy requests scikit-learn xlrd
python scripts/credit_default_benchmark.py
```

The script downloads the [UCI Default of Credit Card Clients dataset](https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients) into memory. It does not use company data. The random holdout is educational; it does not establish out-of-time or production performance.

To recapture the two product clips, run Koii locally on port 3001 and KasMate locally on port 5174, then:

```powershell
python -m pip install playwright imageio-ffmpeg pillow
python scripts/capture_project_media.py
```

The capture script uses a fresh headless Chrome context and visits only the development-only `/portfolio-demo` routes. No login, production database, or personal account is needed. Koii's route returns 404 in production and its demo page blocks API calls; KasMate's fixture view is excluded from its production build. Review all four generated files in `public/media` before publishing. The portfolio shows posters first and starts videos only through their native controls. Clips pause offscreen or when the tab is hidden; they never resume automatically. Reduced motion keeps manual playback available.

The Koii clip and poster include [OpenMoji](https://openmoji.org/) icons ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)). Credit is shown beside the clip on the case-study page. Treat those two derived media assets as CC BY-SA 4.0; this does not change the license of the Koii application code.

Every project Markdown file must keep this front matter:

```yaml
---
title: Project title
category: Featured Risk & ML
status: Project status
featured: true
---
```

Allowed categories are `Featured Risk & ML`, `AI, OCR & Automation`, `Product Engineering`, and `Experiments`.

## Current local design

The warmer personal redesign is described in `DESIGN.md`. All 16 project routes remain available, and only Koii/KasMate have videos. The CDE scroll highlight is an illustrative diagram, not a video or live rule execution. IBM Plex fonts are served locally through the two Fontsource dependencies, which contain their SIL OFL licenses.

For browser acceptance checks, use an installed Chrome and Python Playwright:

```powershell
npm run check
npm run start -- --hostname 127.0.0.1 --port 3100
# In another terminal:
python scripts/verify_redesign.py --url http://127.0.0.1:3100 --round confirm
```

Results and screenshots go to the ignored `artifacts/redesign/` directory. This is local verification, not a deployed-site check.

## Publication safety checklist

Before every public update, confirm that the repository contains no:

- customer, applicant, KTP, or KK data;
- employer source code, decision matrices, thresholds, payloads, mappings, screenshots, or model artifacts;
- credentials, API keys, tokens, `.env` files, internal URLs, or private documents;
- claims that imply sole authorship of Spendid or ERP implementation.

Professional case studies must remain high-level. Any public demonstration based on professional experience must be recreated independently in an empty repository with fictional entities, synthetic data, new schemas, and new rules.

## GitHub setup — run this yourself

Create an empty repository named `portfolio` in the `Arihkun` GitHub account. Do not initialize the repository with a README because this folder already contains one.

Then run only from this `portfolio` folder:

```powershell
cd "D:\Project\cv's\portfolio"
git init
git branch -M main
git add .
git status
git commit -m "Build personal portfolio"
git remote add origin https://github.com/Arihkun/portfolio.git
git push -u origin main
```

Review `git status` before committing. Never initialize Git in the parent `D:\Project\cv's` folder because it contains private documents.

For later updates:

```powershell
git add .
git status
git commit -m "Update portfolio content"
git push
```

## Deploy to Vercel — run this yourself

1. Sign in to Vercel and choose **Add New → Project**.
2. Import `Arihkun/portfolio` from GitHub.
3. Keep **Framework Preset: Next.js** and **Root Directory: `./`**.
4. No environment variables are required.
5. Select **Deploy** and verify the generated preview URL.
6. In the Vercel project, open **Settings → Domains** and add `arih.my.id`.
7. Add the DNS record Vercel displays in the dashboard. Use the exact current record rather than copying an old example.
8. After DNS verification, test the home page, every navigation link, the resume print view, and several project pages.

GitHub pushes to `main` will trigger new production deployments after the repository is connected to Vercel.
