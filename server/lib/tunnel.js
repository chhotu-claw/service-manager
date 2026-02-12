const { execSync } = require('child_process');

const SYSTEMD_UNIT = 'cloudflared.service';

function getTunnelInfo() {
  try {
    const active = execSync(`systemctl is-active ${SYSTEMD_UNIT} 2>/dev/null`, { encoding: 'utf8' }).trim();
    const status = active === 'active' ? 'connected' : 'stopped';

    let uptime = 0;
    if (status === 'connected') {
      try {
        const ts = execSync(
          `systemctl show ${SYSTEMD_UNIT} --property=ActiveEnterTimestamp --value`,
          { encoding: 'utf8' }
        ).trim();
        if (ts) uptime = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
      } catch {}
    }

    return { status, uptime, managed_by: 'systemd' };
  } catch {
    return { status: 'unknown', uptime: 0, managed_by: 'systemd' };
  }
}

module.exports = { getTunnelInfo };
