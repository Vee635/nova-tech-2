# NovaTech Support Desk

This folder contains a small support portal and issue capture form for the `Vee635/nova-tech-2` repository.

## Files

- `index.html` — landing page and ticket form UI
- `styles.css` — theme and layout styling
- `app.js` — browser-side form handling and local fallback storage
- `api/create-ticket.js` — Vercel-compatible serverless function
- `netlify/functions/create-ticket.js` — Netlify-compatible serverless function

## Deploy the GitHub issue backend

### 1) Create a GitHub token

Create a PAT with the `repo` scope (or the minimum issue permissions available for your repo).

### 2) Add the environment variable

For the deployment platform you use, add:

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=Vee635/nova-tech-2
```

### 3) Deployment examples

#### Vercel

- Add the project to Vercel.
- Ensure the `api/create-ticket.js` file is included.
- The frontend `fetch("/api/create-ticket")` will call the API route automatically.

#### Netlify

- Add the project to Netlify.
- Place `netlify/functions/create-ticket.js` in your Netlify project.
- Update the browser request URL to `/.netlify/functions/create-ticket` if needed.

## Local preview

Run this from the repository root:

```bash
python -m http.server 8000
```

Then view:

```text
http://localhost:8000/site/
```

The form will save data in local storage if the backend is not running yet.

## Behavior

- The form accepts service ticket information and priority.
- Each submission generates a local reference like `NT-1234`.
- If the backend is configured, the frontend sends the request to GitHub and creates an issue in this repo.
- If the backend is absent, it still saves locally so the form remains functional during testing.
