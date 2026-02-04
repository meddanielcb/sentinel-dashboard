# 🛡️ Sentinel Dashboard

Dashboard de monitoramento em tempo real para OpenClaw Gateway rodando em VPS.

## 🎨 Features

- ✨ **Cards Animados** com efeito neon glow
- 📊 **Abas Minimizáveis** para ambiente clean
- 🌙 **Dark Mode** com acentos neon (blue/purple/green/pink)
- 🔄 **Atualização Automática** a cada 5 segundos
- 📈 **Métricas em Tempo Real**:
  - CPU, RAM, Disco
  - Status PM2 (OpenClaw Gateway)
  - Uptime e memória do processo
- 📋 **Logs** (em desenvolvimento)
- ⚠️ **Alertas Telegram** (em desenvolvimento)

## 🚀 Stack

- **Backend:** Node.js + Express
- **Frontend:** React (via CDN) + Tailwind CSS
- **Database:** PostgreSQL (futuro)
- **Deploy:** Replit

## 📦 Instalação Local (VPS)

```bash
cd /home/clawd/.openclaw/workspace/sentinel-dashboard
npm install
node server.js
```

Acesse: `http://localhost:3000`

## 🔧 Importar no Replit

1. No Replit, clique em **Create Repl**
2. Escolha **Import from GitHub**
3. Cole o URL: `https://github.com/meddanielcb/sentinel-dashboard`
4. Clique em **Import**

### Configurar Secrets no Replit

No painel **Secrets** (ícone de cadeado), adicione:

```
OPENCLAW_GATEWAY_URL=http://seu-vps-ip:18789
OPENCLAW_TOKEN=seu-token-aqui
TELEGRAM_BOT_TOKEN=seu-bot-token
TELEGRAM_CHAT_ID=671901048
VPS_SSH_HOST=srv1323582
VPS_SSH_USER=clawd
VPS_SSH_KEY=conteudo-da-chave-privada-ssh
```

### Rodar no Replit

O Replit vai detectar automaticamente o `package.json` e rodar `npm install`.

Para iniciar:
```bash
npm start
```

Ou adicione no `.replit`:
```toml
run = "node server.js"
```

## 📡 API Endpoints

- `GET /api/health` - Health check
- `GET /api/vps/status` - Status VPS (CPU, RAM, disk, PM2)
- `GET /api/openclaw/logs` - Logs do gateway
- `GET /api/openclaw/gateway` - Detalhes do processo PM2

## 🎯 Roadmap

- [x] Backend básico com Express
- [x] Frontend dark/neon com cards animados
- [x] Monitoramento VPS (CPU, RAM, disk)
- [x] Status PM2 em tempo real
- [ ] Integração completa com logs
- [ ] Alertas Telegram
- [ ] Gráficos históricos
- [ ] Busca inteligente em logs (Fase 2)
- [ ] Timeline de eventos (Fase 2)

## 📄 Licença

MIT

## 👤 Autor

Dr. Daniel (@med_daniel)
