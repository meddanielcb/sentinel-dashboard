const { useState, useEffect } = React;

function Card({ title, children, defaultOpen = true, glowColor = "blue", isDark }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const glowColors = {
    blue: 'border-neon-blue',
    purple: 'border-neon-purple',
    green: 'border-neon-green',
    pink: 'border-neon-pink'
  };

  const bgColor = isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50';
  const textColor = isDark ? 'text-neon-blue' : 'text-blue-600';

  return (
    <div className={`${bgColor} rounded-lg border-2 ${glowColors[glowColor]} ${isDark ? 'card-glow' : ''} card-enter overflow-hidden transition-all duration-300 shadow-lg`}>
      <div 
        className={`flex justify-between items-center p-4 cursor-pointer ${bgColor}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className={`text-xl font-bold ${textColor}`}>{title}</h2>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </div>
      <div className={`transition-all duration-300 ${isOpen ? 'max-h-screen p-4 pt-0' : 'max-h-0'}`}>
        {isOpen && children}
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, color = "blue", isDark }) {
  const colors = {
    blue: 'text-neon-blue',
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    pink: 'text-neon-pink'
  };

  const colorsLight = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600'
  };

  const bgColor = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const labelColor = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${bgColor} rounded p-4 text-center`}>
      <div className={`text-sm ${labelColor} mb-2`}>{label}</div>
      <div className={`text-3xl font-bold ${isDark ? colors[color] : colorsLight[color]}`}>
        {value}{unit && <span className="text-lg ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function App() {
  const [vpsStatus, setVpsStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isDark, setIsDark] = useState(true);

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
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const subtextColor = isDark ? 'text-gray-400' : 'text-gray-600';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgColor} ${textColor}`}>
        <div className={`text-4xl animate-pulse ${isDark ? 'text-neon-blue' : 'text-blue-600'}`}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header */}
      <div className="mb-8 text-center relative">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`absolute right-0 top-0 px-4 py-2 rounded-lg font-semibold transition-all ${
            isDark 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
        
        <h1 className="text-5xl font-bold mb-2">
          <span className={isDark ? 'text-neon-blue' : 'text-blue-600'}>SENTINEL</span>
          <span className={isDark ? 'text-neon-purple' : 'text-purple-600'}> DASHBOARD</span>
        </h1>
        <p className={subtextColor}>
          Última atualização: {lastUpdate}
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* VPS Status Card */}
        <Card title="🖥️ Status do VPS" defaultOpen={true} glowColor="blue" isDark={isDark}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard 
              label="CPU" 
              value={vpsStatus?.cpu.toFixed(1)} 
              unit="%" 
              color="blue"
              isDark={isDark}
            />
            <MetricCard 
              label="Memória" 
              value={vpsStatus?.memory.toFixed(1)} 
              unit="%" 
              color="purple"
              isDark={isDark}
            />
            <MetricCard 
              label="Disco" 
              value={vpsStatus?.disk} 
              color="green"
              isDark={isDark}
            />
            <MetricCard 
              label="Status PM2" 
              value={vpsStatus?.pm2?.[0]?.pm2_env?.status === 'online' ? 'ONLINE' : 'OFFLINE'} 
              color={vpsStatus?.pm2?.[0]?.pm2_env?.status === 'online' ? 'green' : 'pink'}
              isDark={isDark}
            />
          </div>
        </Card>

        {/* Gateway Info Card */}
        <Card title="🤖 Gateway OpenClaw" defaultOpen={true} glowColor="purple" isDark={isDark}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard 
              label="Processo" 
              value={vpsStatus?.pm2?.[0]?.name || 'N/A'} 
              color="purple"
              isDark={isDark}
            />
            <MetricCard 
              label="PID" 
              value={vpsStatus?.pm2?.[0]?.pid || 'N/A'} 
              color="blue"
              isDark={isDark}
            />
            <MetricCard 
              label="Tempo Ativo" 
              value={vpsStatus?.pm2?.[0]?.pm2_env?.pm_uptime ? 
                Math.floor((Date.now() - vpsStatus.pm2[0].pm2_env.pm_uptime) / 60000) : 0} 
              unit="min" 
              color="green"
              isDark={isDark}
            />
          </div>
          <div className={`mt-4 p-4 rounded ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm ${subtextColor} mb-2`}>Memória Usada</div>
            <div className={`text-2xl ${isDark ? 'text-neon-green' : 'text-green-600'} font-bold`}>
              {(vpsStatus?.pm2?.[0]?.monit?.memory / 1024 / 1024).toFixed(0)} MB
            </div>
          </div>
        </Card>

        {/* Logs Card */}
        <Card title="📋 Logs Recentes" defaultOpen={false} glowColor="green" isDark={isDark}>
          <div className={`rounded p-4 font-mono text-sm max-h-96 overflow-y-auto ${
            isDark ? 'bg-black text-green-400' : 'bg-gray-100 text-gray-800'
          }`}>
            <p>Logs aparecerão aqui...</p>
            <p className="text-gray-500 mt-2">Implementação em progresso</p>
          </div>
        </Card>

        {/* Alerts Card */}
        <Card title="⚠️ Alertas" defaultOpen={false} glowColor="pink" isDark={isDark}>
          <div className={`text-center py-8 ${subtextColor}`}>
            Nenhum alerta no momento
          </div>
        </Card>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
