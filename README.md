# nova-tech-2

A support portal and ticketing site for the NovaTech project.

## Website

The functional ticketing website lives in the `site/` folder.

- Open `site/index.html` in a browser for local preview.
- For deployed ticket recording, use the API function in `api/create-ticket.js` (Vercel-style) or copy the same logic to `netlify/functions/create-ticket.js` for Netlify.

## Required environment variable

Set `GITHUB_TOKEN` in your deployment platform with a GitHub Personal Access Token that has permission to create issues in this repo.

Example:

- Repo: `Vee635/nova-tech-2`
- Token scope: `repo` or `public_repo` depending on repo visibility.

## Local preview

From the repo root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/site/
```
