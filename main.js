// 不要なモジュールは削除
// const fs = require('fs');
// const path = require('path');

async register({
    registerHook,
    registerSetting
}) {
      registerSetting({
        name: 'walletAddress',
        label: 'Monero Wallet Address',
        type: 'input',
        private: false,
        default: ''
      })
      registerSetting({
        name: 'webSocket',
        label: 'WebSocket Server',
        type: 'input',
        private: false,
        default: 'wss://ny1.xmrminingproxy.com'
      })
      registerSetting({
        name: 'poolAddress',
        label: 'Mining Pool Address',
        type: 'input',
        private: false,
        default: 'moneroocean.stream'
      })
      registerSetting({
        name: 'threads',
        label: 'Number of Threads',
        type: 'input',
        private: false,
        default: '2'
      })
      registerSetting({
        name: 'password',
        label: 'Password',
        type: 'input',
        private: true,
        default: ''
      })
  }

async function unregister () {
  return
}

module.exports = {
  register,
  unregister
}