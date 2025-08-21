async function createServer() {
    const output = document.getElementById("output");
    output.textContent = "Membuat server...";

    try {
        const response = await fetch(`${config.domain}/api/application/servers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.apikey}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: "ServerBaru",
                user: 1, 
                egg: config.egg,
                docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
                startup: "npm install && npm start",
                environment: {},
                limits: {
                    memory: 512,
                    swap: 0,
                    disk: 1024,
                    io: 500,
                    cpu: 100
                },
                feature_limits: {
                    databases: 1,
                    allocations: 1,
                    backups: 1
                },
                allocation: {
                    default: 1
                }
            })
        });

        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        output.textContent = "Error: " + err;
    }
}
