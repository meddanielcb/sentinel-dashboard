const { useState, useEffect } = React;

function Card({ title, children, defaultOpen = true, glowColor = "blue" }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const glowColors = {
    blue: 'border-neon-blue',
    purple: 'border-neon-purple',
    green: 'border-neon-green',
    pink: 'border-neon-pink'
  };

  return (
    <div className={`bg-gray-800 rounded-lg border-2 ${glowColors[glowColor]} card-glow card-enter overflow-hidden transition-all duration-300`}>
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-750"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-neon-blue">{title}</h2>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </div>
      <div className={`transition-all duration-300 ${isOpen ? 'max-h-screen p-4 pt-0' : 'max-h-0'}`}>
        {isOpen && children}
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, color = "blue" }) {
  const colors = {
    blue: 'text-neon-blue',
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    pink: 'text-neon-pink'
  };

  return (
    <div className="bg-gray-700 rounded p-4 text-center">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className={`text-3xl font-bold ${colors[color]}`}>
        {value}{unit && <span className="text-lg ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function App() {
  const [vpsStatus, setVpsStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/vps/status');
      const data = await res.json();
      setVpsStatus(data);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl text-neon-blue animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-2">
          <span className="text-neon-blue">SENTINEL</span>
          <span className="text-neon-purple"> DASHBOARD</span>
        </h1>
        <p className="text-gray-400">
          Última atualização: {lastUpdate}
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* VPS Status Card */}
        <Card title="🖥️ Status VPS" defaultOpen={true} glowColor="blue">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard 
              label="CPU" 
              value={vpsStatus?.cpu.toFixed(1)} 
              unit="%" 
              color="blue"
            />
            <MetricCard 
              label="Memória" 
              value={vpsStatus?.memory.toFixed(1)} 
              unit="%" 
              color="purple"
            />
            <MetricCard 
              label="Disco" 
              value={vpsStatus?.disk} 
              color="green"
            />
            <MetricCard 
              label="PM2 Status" 
              value={vpsStatus?.pm2?.[0]?.pm2_env?.status === 'online' ? 'ONLINE' : 'OFFLINE'} 
              color={vpsStatus?.pm2?.[0]?.pm2_env?.status === 'online' ? 'green' : 'pink'}
            />
          </div>
        </Card>

        {/* Gateway Info Card */}
        <Card title="🤖 OpenClaw Gateway" defaultOpen={true} glowColor="purple">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard 
              label="Process" 
              value={vpsStatus?.pm2?.[0]?.name || 'N/A'} 
              color="purple"
            />
            <MetricCard 
              label="PID" 
              value={vpsStatus?.pm2?.[0]?.pid || 'N/A'} 
              color="blue"
            />
            <MetricCard 
              label="Uptime" 
              value={vpsStatus?.pm2?.[0]?.pm2_env?.pm_uptime ? 
                Math.floor((Date.now() - vpsStatus.pm2[0].pm2_env.pm_uptime) / 60000) : 0} 
              unit="min" 
              color="green"
            />
          </div>
          <div className="mt-4 p-4 bg-gray-900 rounded">
            <div className="text-sm text-gray-400 mb-2">Memória Usada</div>
            <div className="text-2xl text-neon-green">
              {(vpsStatus?.pm2?.[0]?.monit?.memory / 1024 / 1024).toFixed(0)} MB
            </div>
          </div>
        </Card>

        {/* Logs Card */}
        <Card title="📋 Logs Recentes" defaultOpen={false} glowColor="green">
          <div className="bg-black rounded p-4 font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
            <p>Logs aparecerão aqui...</p>
            <p className="text-gray-500 mt-2">Implementação em progresso</p>
          </div>
        </Card>

        {/* Alerts Card */}
        <Card title="⚠️ Alertas" defaultOpen={false} glowColor="pink">
          <div className="text-gray-400 text-center py-8">
            Nenhum alerta no momento
          </div>
        </Card>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
