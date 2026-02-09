const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '../..');

function loadServices() {
  const raw = fs.readFileSync(path.join(ROOT, 'services.yaml'), 'utf8');
  return yaml.load(raw).services;
}

function loadConfig() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
}

function saveConfig(cfg) {
  fs.writeFileSync(path.join(ROOT, 'config.json'), JSON.stringify(cfg, null, 2));
}

module.exports = { loadServices, loadConfig, saveConfig, ROOT };
