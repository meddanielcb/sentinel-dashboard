const express = require('express');
const cors = require('cors');
const { Client } = require('ssh2');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// VPS Status (local)
app.get('/api/vps/status', async (req, res) => {
  try {
    const [cpu, mem, disk, pm2] = await Promise.all([
      executeCommand("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'"),
      executeCommand("free -m | awk 'NR==2{printf \"%.2f\", $3*100/$2 }'"),
      executeCommand("df -h / | awk 'NR==2{print $5}'"),
      executeCommand("pm2 jlist")
    ]);

    res.json({
      cpu: parseFloat(cpu),
      memory: parseFloat(mem),
      disk: disk.trim(),
      pm2: JSON.parse(pm2),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OpenClaw logs
app.get('/api/openclaw/logs', async (req, res) => {
  try {
    const logs = await executeCommand("pm2 logs brotherbot --lines 50 --nostream");
    res.json({ logs, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gateway status
app.get('/api/openclaw/gateway', async (req, res) => {
  try {
    const status = await executeCommand("pm2 describe brotherbot");
    res.json({ status, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function executeCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

// API Tokens & Status
app.get('/api/tokens/status', async (req, res) => {
  try {
    const configPath = require('os').homedir() + '/.openclaw/openclaw.json';
    const config = JSON.parse(require('fs').readFileSync(configPath, 'utf8'));
    
    const providers = [];
    
    // Anthropic
    if (config.auth?.profiles?.['anthropic:default']) {
      const apiKeyPath = require('os').homedir() + '/.openclaw/secrets/anthropic.default.api_key';
      const hasKey = require('fs').existsSync(apiKeyPath);
      providers.push({
        name: 'Anthropic (Claude)',
        id: 'anthropic',
        status: hasKey ? 'configured' : 'missing',
        model: 'claude-sonnet-4-5',
        hasKey
      });
    }
    
    // Moonshot (Kimi)
    if (config.auth?.profiles?.['moonshot:default']) {
      const apiKeyPath = require('os').homedir() + '/.openclaw/secrets/moonshot.default.api_key';
      const hasKey = require('fs').existsSync(apiKeyPath);
      providers.push({
        name: 'Moonshot (Kimi K2)',
        id: 'moonshot',
        status: hasKey ? 'configured' : 'missing',
        model: 'kimi-k2-0905-preview',
        hasKey
      });
    }
    
    // Check model usage from session_status if available
    const primaryModel = config.agents?.defaults?.model?.primary || 'N/A';
    
    res.json({
      providers,
      primaryModel,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Session status (usage stats)
app.get('/api/session/status', async (req, res) => {
  try {
    const stats = await executeCommand("openclaw status 2>/dev/null || echo 'unavailable'");
    res.json({ stats, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Sentinel API running on port ${PORT}`);
});
