const { GITHUB_TOKEN, GITHUB_REPO = "Vee635/nova-tech-2" } = process.env;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed." }),
      headers: { "Content-Type": "application/json" },
    };
  }

  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: "Missing GITHUB_TOKEN environment variable. Add a GitHub PAT with issue creation permission.",
      }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
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
    } = payload;

    if (!name || !email || !subject || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: "Name, email, subject, and description are required.",
        }),
        headers: { "Content-Type": "application/json" },
      };
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

    const githubResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
        labels: [priority || "Medium", issueType || "General"],
      }),
    });

    if (!githubResponse.ok) {
      const details = await githubResponse.text();
      return {
        statusCode: githubResponse.status,
        body: JSON.stringify({ ok: false, error: "GitHub issue creation failed.", details }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const data = await githubResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        issueNumber: data.number,
        issueUrl: data.html_url,
        repo: GITHUB_REPO,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Unexpected server error.", details: error.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
