const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const PANEL_URL = "https://domain-panelkamu.com"; // ganti domain panel
const PTLA = "API_KEY_APLIKASI"; // Application API Key (admin)
const PTLC = "API_KEY_CLIENT";   // Client API Key (user)

// Buat server baru otomatis
app.post("/create-server", async (req, res) => {
  const { username, serverName } = req.body;
  try {
    const response = await fetch(PANEL_URL + "/api/application/servers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PTLA}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: serverName,
        user: 1, // ID user Pterodactyl
        egg: 15, // ID egg
        docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
        startup: "node index.js",
        environment: { },
        limits: { memory: 1024, swap: 0, disk: 10240, io: 500, cpu: 100 },
        feature_limits: { databases: 1, backups: 1, allocations: 1 },
        allocation: { default: 1 }
      })
    });

    const data = await response.json();
    res.json({ success: true, id: data.attributes.id, name: data.attributes.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Daftar server user
app.get("/list-servers", async (req, res) => {
  try {
    const response = await fetch(PANEL_URL + "/api/client", {
      headers: {
        "Authorization": `Bearer ${PTLC}`,
        "Accept": "application/json"
      }
    });
    const data = await response.json();
    res.json(data.data.map(s => ({
      id: s.attributes.identifier,
      name: s.attributes.name
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Proxy running on http://localhost:3000"));
