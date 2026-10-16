const STORAGE_KEY = "novatech.support.tickets";

const form = document.getElementById("support-form");
const formStatus = document.getElementById("form-status");
const ticketList = document.getElementById("ticket-list");

function getTickets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildTicketReference() {
  const prefix = "NT";
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${random}`;
}

function renderTickets() {
  const tickets = getTickets().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!tickets.length) {
    ticketList.innerHTML = '<div class="empty-state">No tickets have been recorded yet. Submit the first support request.</div>';
    return;
  }

  ticketList.innerHTML = tickets
    .map(
      (ticket) => `
        <article class="ticket-item">
          <div>
            <h4>${ticket.subject}</h4>
            <p>${ticket.name} • ${ticket.company || "Unknown team"}</p>
            <div class="ticket-meta">
              <span>${ticket.reference}</span>
              <span>${ticket.issueType}</span>
              <span>${formatDate(ticket.createdAt)}</span>
            </div>
          </div>
          <div>
            <p>${ticket.department || "General"}</p>
            <p>${ticket.email}</p>
          </div>
          <span class="badge ${ticket.priority.toLowerCase()}">${ticket.priority}</span>
        </article>
      `
    )
    .join("");
}

function setStatus(message, type = "success") {
  formStatus.textContent = message;
  formStatus.className = `status-message ${type}`;
}

async function submitTicket(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    company: formData.get("company")?.toString().trim(),
    department: formData.get("department")?.toString().trim(),
    issueType: formData.get("issueType")?.toString().trim(),
    priority: formData.get("priority")?.toString().trim(),
    subject: formData.get("subject")?.toString().trim(),
    description: formData.get("description")?.toString().trim(),
  };

  if (!payload.name || !payload.email || !payload.subject || !payload.description) {
    setStatus("Please complete the required fields before submitting.", "error");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  const ticketToSave = {
    ...payload,
    reference: buildTicketReference(),
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch("/api/create-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketToSave),
    });

    if (response.ok) {
      const data = await response.json();
      const storedTickets = getTickets();
      saveTickets([
        {
          ...ticketToSave,
          status: data.issueUrl ? "Logged in GitHub" : "Saved locally",
          issueUrl: data.issueUrl || "",
        },
        ...storedTickets,
      ]);
      renderTickets();
      setStatus(`Ticket ${ticketToSave.reference} created successfully. ${data.issueUrl ? `Issue link: ${data.issueUrl}` : "Saved locally until deployment is live."}`);
      form.reset();
      return;
    }

    throw new Error("Ticket submission failed on the server.");
  } catch (error) {
    const storedTickets = getTickets();
    saveTickets([
      {
        ...ticketToSave,
        status: "Saved locally",
      },
      ...storedTickets,
    ]);
    renderTickets();
    setStatus(
      `Ticket ${ticketToSave.reference} was saved locally. Deploy the backend to sync with GitHub Issues.`,
      "success"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Ticket";
  }
}

form.addEventListener("submit", submitTicket);
renderTickets();
