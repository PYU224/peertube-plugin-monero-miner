const { Plugin } = require('peertube-plugin');
const fs = require('fs');
const path = require('path');

module.exports = class MoneroMinerPlugin extends Plugin {
  constructor() {
    super();
    this.settingsFilePath = path.join(__dirname, 'pluginSettings.json'); // 設定ファイルのパス
  }

  // 設定の読み込み
  async loadSettings() {
    if (fs.existsSync(this.settingsFilePath)) {
      const data = fs.readFileSync(this.settingsFilePath, 'utf-8');
      return JSON.parse(data);
    } else {
      return { walletAddress: '1145148101919', webSocket: 'wss://ny1.xmrminingproxy.com', poolAddress: 'moneroocean.stream', threads: 2 }; // デフォルト設定
    }
  }

  // 設定の保存
  async saveSettings(walletAddress, webSocket, poolAddress, threads) {
    const settings = { walletAddress, webSocket, poolAddress, threads };
    fs.writeFileSync(this.settingsFilePath, JSON.stringify(settings, null, 2));
    console.log('Settings saved to file');
  }

  // フック：管理画面に設定フォームを追加
  async hooks() {
    const settings = await this.loadSettings();

    return [
      {
        target: 'admin.plugins.list',
        handler: async () => {
          return `
            <div class="container">
              <h3>Monero Miner Plugin Settings</h3>
              <form id="monero-miner-settings">
                <div class="form-group">
                  <label for="walletAddress">Monero Wallet Address starting with 4~</label>
                  <input type="text" id="walletAddress" class="form-control" value="${settings.walletAddress}" required>
                </div>
                <div class="form-group">
                  <label for="webSocket">WebSocket</label>
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
          `;
        }
      },
      {
        target: 'admin.plugins.save',
        handler: async (pluginData) => {
          const { walletAddress, webSocket, poolAddress, threads } = pluginData;
          await this.saveSettings(walletAddress, webSocket, poolAddress, threads);
        }
      }
    ];
  }
};

