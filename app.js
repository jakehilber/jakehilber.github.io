const capabilities = [
  {
    type: "core",
    title: "Engineering Productivity",
    body: "Notepad++, VS Code, 7-Zip, GitHub, Postman, browser dev tools, Wireshark, PuTTY, SSH keys, password management, MFA, and approved AI tooling."
  },
  {
    type: "infra",
    title: "Network, Voice, and Hybrid Systems",
    body: "Cisco routing and switching, GNS3, Packet Tracer, CUCM, Webex, Jabber, SIP, CUBE, Genesys, VPN, RDP, monitoring, and cloud networking fundamentals."
  },
  {
    type: "data",
    title: "Data and Integration Layer",
    body: "SQL Server, PostgreSQL, DBeaver, SQuirreL, Python, pandas, Jupyter, REST, JSON parsing, GraphQL, Power BI, Tableau, Kafka, and RabbitMQ."
  },
  {
    type: "security",
    title: "Security and Identity Architecture",
    body: "SAML, OAuth, OIDC, RBAC, conditional access, TLS, certificate management, SIEM, Splunk, Sentinel, Zero Trust, vulnerability and asset management."
  },
  {
    type: "ops",
    title: "Observability and Reliability",
    body: "Prometheus, Grafana, ELK, OpenTelemetry, AppDynamics, Dynatrace, alert strategy, capacity planning, RCA, SLA and SLO thinking."
  },
  {
    type: "core",
    title: "Architecture Principles",
    body: "High availability, redundancy, resiliency, fault tolerance, API gateways, circuit breakers, cost optimization, and pragmatic system design."
  },
  {
    type: "infra",
    title: "Protocol Fluency",
    body: "IPv4, IPv6, DNS, NTP, SMTP, HTTP(S), TLS handshake basics, EIGRP, OSPF, BGP, QoS, SIP, SBC, packet capture, and log analysis."
  },
  {
    type: "ops",
    title: "DevOps and Automation",
    body: "Git-based workflows, GitHub Actions, Azure DevOps, Jenkins, Terraform, Ansible, Docker, Kubernetes fundamentals, and repeatable delivery."
  },
  {
    type: "security",
    title: "Standards Awareness",
    body: "IEEE, SANS, NIST, CIS, ISO/IEC, ISACA, ISC2, CISA, Cisco ecosystem, Genesys Cloud, and governance-aligned technical judgment."
  }
];

const tools = [
  "Notepad++", "VS Code", "7-Zip", "GitHub", "Git repositories", "Postman", "Wireshark",
  "PuTTY", "SSH", "SSH key management", "Browser Dev Tools", "VPN", "RDP", "AnyDesk",
  "Password manager", "MFA", "SAML", "SSO", "OAuth", "OIDC", "GNS3", "Cisco Packet Tracer",
  "SolarWinds", "PRTG", "Nagios", "Webex", "Jabber", "CUCM", "RTMT", "SIP", "CUBE",
  "Asterisk PBX", "SQL Server Management Studio", "PostgreSQL", "SQuirreL SQL",
  "DBeaver", "Python", "pandas", "Jupyter Notebook", "Power BI", "Tableau", "REST", "JSON",
  "GraphQL", "Kafka", "RabbitMQ", "Splunk", "Sentinel", "Prometheus", "Grafana", "ELK",
  "OpenTelemetry", "AppDynamics", "Dynatrace", "GitHub Actions", "Azure DevOps", "Jenkins",
  "Terraform", "Ansible", "Docker", "Kubernetes", "DNS", "NTP", "SMTP", "TLS", "BGP",
  "OSPF", "EIGRP", "QoS", "VMware", "ESXi", "vSwitches", "PKI", "NIST", "CIS", "ISO/IEC"
];

const grid = document.querySelector("#capabilityGrid");
const filters = document.querySelectorAll(".filter");
const search = document.querySelector("#toolSearch");
const toolResults = document.querySelector("#toolResults");

function renderCapabilities(filter = "all") {
  const visible = filter === "all" ? capabilities : capabilities.filter((item) => item.type === filter);
  grid.innerHTML = visible.map((item) => `
    <article class="cap-card">
      <strong>${item.type}</strong>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `).join("");
}

function renderTools(query = "") {
  const needle = query.trim().toLowerCase();
  const matches = tools
    .filter((tool) => tool.toLowerCase().includes(needle))
    .slice(0, 14);

  toolResults.innerHTML = matches.length
    ? matches.map((tool) => `<div class="tool-pill">${tool}</div>`).join("")
    : `<div class="tool-pill">No match yet. Try a protocol, platform, or tool name.</div>`;
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderCapabilities(button.dataset.filter);
  });
});

search.addEventListener("input", (event) => renderTools(event.target.value));

renderCapabilities();
renderTools();

const canvas = document.querySelector("#networkCanvas");
const ctx = canvas.getContext("2d");
let nodes = [];
let pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.offsetWidth * scale);
  canvas.height = Math.floor(canvas.offsetHeight * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  nodes = Array.from({ length: Math.min(72, Math.floor(canvas.offsetWidth / 18)) }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    r: Math.random() * 2 + 1
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";

  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > canvas.offsetWidth) node.vx *= -1;
    if (node.y < 0 || node.y > canvas.offsetHeight) node.vy *= -1;

    if (pointer.active) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 130) {
        node.x -= dx * 0.002;
        node.y -= dy * 0.002;
      }
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 116) {
        ctx.strokeStyle = `rgba(183, 203, 236, ${1 - distance / 116})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawNetwork);
}

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    active: true
  };
});

canvas.addEventListener("pointerleave", () => {
  pointer.active = false;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawNetwork();
