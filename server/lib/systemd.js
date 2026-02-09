const { execFile } = require('child_process');
const util = require('util');
const execFileAsync = util.promisify(execFile);

async function systemctl(action, unit) {
  try {
    const { stdout } = await execFileAsync('systemctl', ['--user', action, unit], { timeout: 15000 });
    return stdout.trim();
  } catch (err) {
    throw new Error(err.stderr || err.message);
  }
}

async function getStatus(unit) {
  try {
    const { stdout } = await execFileAsync('systemctl', ['--user', 'is-active', unit], { timeout: 5000 });
    return stdout.trim(); // active, inactive, failed
  } catch (err) {
    return (err.stdout || '').trim() || 'unknown';
  }
}

async function startService(unit) { return systemctl('start', unit); }
async function stopService(unit) { return systemctl('stop', unit); }
async function restartService(unit) { return systemctl('restart', unit); }

async function getLogs(unit, lines = 100) {
  try {
    const { stdout } = await execFileAsync('journalctl', ['--user', '-u', unit, '-n', String(lines), '--no-pager'], { timeout: 5000 });
    return stdout;
  } catch (err) {
    return err.stderr || err.message;
  }
}

module.exports = { getStatus, startService, stopService, restartService, getLogs };
