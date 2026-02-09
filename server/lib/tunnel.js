const { spawn } = require('child_process');
const fs = require('fs');

let tunnelProc = null;
let tunnelUrl = null;
let tunnelStatus = 'stopped';
let startTime = null;

function notifyTelegram(message) {
  try {
    fs.appendFileSync('/tmp/telegram-queue.txt', JSON.stringify({ to: '727735902', text: message }) + '\n');
  } catch {}
}

function startTunnel() {
  if (tunnelProc) return { url: tunnelUrl, status: tunnelStatus };

  tunnelStatus = 'starting';
  tunnelProc = spawn('cloudflared', ['tunnel', '--url', 'http://localhost:9090'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const handleOutput = (data) => {
    const line = data.toString();
    const match = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match && match[0] !== tunnelUrl) {
      tunnelUrl = match[0];
      tunnelStatus = 'connected';
      startTime = Date.now();
      console.log(`[tunnel] URL: ${tunnelUrl}`);
      notifyTelegram(`🚇 Tunnel up: ${tunnelUrl}`);
    }
  };

  tunnelProc.stdout.on('data', handleOutput);
  tunnelProc.stderr.on('data', handleOutput);

  tunnelProc.on('exit', (code) => {
    console.log(`[tunnel] exited with code ${code}`);
    tunnelProc = null;
    tunnelStatus = 'stopped';
    tunnelUrl = null;
    // Auto-restart after 5s
    setTimeout(() => {
      if (tunnelStatus === 'stopped') startTunnel();
    }, 5000);
  });

  return { status: tunnelStatus };
}

function stopTunnel() {
  if (tunnelProc) {
    tunnelProc.kill();
    tunnelProc = null;
    tunnelStatus = 'stopped';
    tunnelUrl = null;
  }
  return { status: tunnelStatus };
}

function getTunnelInfo() {
  return {
    url: tunnelUrl,
    status: tunnelStatus,
    uptime: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
  };
}

module.exports = { startTunnel, stopTunnel, getTunnelInfo };
