# CS 499 ePortfolio — Naim Lindsay

Hey, I'm Naim. This repository holds my Southern New Hampshire University CS 499 capstone ePortfolio and the Travlr Getaways artifact I enhanced for the final project.

## What’s inside
- **public/** (also copied to **docs/** for GitHub Pages): the front-end ePortfolio site with links to my code review video, original/enhanced artifacts, narratives, and PSA.
- **app_api/** and **app_server/**: the MEAN-stack backend (Express/Mongo) that powers the Travlr Getaways project with JWT auth, RBAC, validation middleware, caching, and aggregation-based filtering.
- **app.js** / **bin/www**: Express bootstrap.

## Live links
- Portfolio: https://devnom7.github.io/naimlindsay/
- Personal site: https://naimlindsay.com
- GitHub: https://github.com/DevNom7
- LinkedIn: https://www.linkedin.com/in/nlindsay14985/

## How to run locally
```bash
git clone https://github.com/DevNom7/naimlindsay.git
cd naimlindsay
npm install
npm start
```
The API runs on port 3000; static ePortfolio is served from `public/`.

## Notes for reviewers
- Secrets live in `.env` (not checked in). Set `JWT_SECRET` and `MONGODB_URI` (defaults to `mongodb://127.0.0.1/travlr`).
- GitHub Pages serves from the `docs/` folder on `main`, mirroring `public/`.
- Media/zips for the ePortfolio are stored under `public/assets/` and mirrored to `docs/assets/`.

## Acknowledgement
This work represents my capstone deliverable for SNHU CS 499. Thanks for taking a look!
