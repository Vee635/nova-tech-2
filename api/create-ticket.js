export default async function handler(request, response) {
  const method = request.method || "GET";

  if (method !== "POST") {
    return response.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const repoName = process.env.GITHUB_REPO || "Vee635/nova-tech-2";

  if (!githubToken) {
    return response.status(500).json({
      ok: false,
      error: "Missing GITHUB_TOKEN environment variable. Add a GitHub PAT with issue creation permission.",
    });
  }

  try {
    const payload = await request.json();
    const {
      name,
      email,
      company,
      department,
      issueType,
      priority,
      subject,
      description,
      reference,
    } = payload || {};

    if (!name || !email || !subject || !description) {
      return response.status(400).json({
        ok: false,
        error: "Name, email, subject, and description are required.",
      });
    }

    const title = `[Support Ticket] ${subject}`;
    const body = [
      `**Ticket reference:** ${reference || "N/A"}`,
      `**Issue type:** ${issueType || "General"}`,
      `**Priority:** ${priority || "Medium"}`,
      `**Name:** ${name}`,
      `**Email:** ${email}`,
      `**Company/Team:** ${company || "Not provided"}`,
      `**Department:** ${department || "Not provided"}`,
      "",
      "**Description**",
      description,
    ].join("\n");

    const apiUrl = `https://api.github.com/repos/${repoName}/issues`;
    const githubResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
        labels: [priority || "medium", issueType || "general"],
      }),
    });

    if (!githubResponse.ok) {
      const errorBody = await githubResponse.text();
      return response.status(githubResponse.status).json({
        ok: false,
        error: "GitHub issue creation failed.",
        details: errorBody,
      });
    }

    const data = await githubResponse.json();

    return response.status(200).json({
      ok: true,
      issueNumber: data.number,
      issueUrl: data.html_url,
      repo: repoName,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      error: "Unexpected server error.",
      details: error.message,
    });
  }
}
