const { useState, useEffect } = React;

// Ícones SVG minimalistas
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Server: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  Logs: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
};

function Sidebar({ activeTab, setActiveTab, isDark, setIsDark }) {
  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Icons.Dashboard },
    { id: 'server', label: 'Servidor', icon: Icons.Server },
    { id: 'logs', label: 'Logs', icon: Icons.Logs },
    { id: 'alerts', label: 'Alertas', icon: Icons.Alert }
  ];

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 p-6 ${isDark ? 'glass' : 'glass-light'} border-r`}>
      <div className="mb-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Sentinel
        </h1>
        <p className="text-xs text-gray-400 mt-1">Dashboard v1.0</p>
      </div>

      <nav className="space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id 
                ? 'sidebar-active text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon />
            <span className="text-sm font-medium">{tab.label}</span>
            {activeTab === tab.id && <Icons.ChevronRight />}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
        >
          {isDark ? <Icons.Sun /> : <Icons.Moon />}
          <span className="text-sm">{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, change, trend, isDark }) {
  return (
    <div className={`metric-card p-6 rounded-2xl ${isDark ? 'glass' : 'glass-light'}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold">{value}</span>
        {unit && <span className="text-lg text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]} pulse-dot`} />
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDark, setIsDark] = useState(true);
  const [vpsStatus, setVpsStatus] = useState(null);
  const [tokensStatus, setTokensStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchStatus = async () => {
    try {
      const [vpsRes, tokensRes] = await Promise.all([
        fetch('/api/vps/status'),
        fetch('/api/tokens/status')
      ]);
      
      const vpsData = await vpsRes.json();
      const tokensData = await tokensRes.json();
      
      setVpsStatus(vpsData);
      setTokensStatus(tokensData);
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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} setIsDark={setIsDark} />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {activeTab === 'overview' && 'Visão Geral'}
                {activeTab === 'server' && 'Servidor'}
                {activeTab === 'logs' && 'Logs'}
                {activeTab === 'alerts' && 'Alertas'}
              </h2>
              <p className="text-sm text-gray-400">Atualizado às {lastUpdate}</p>
            </div>
            <StatusBadge status={vpsStatus?.pm2?.[0]?.pm2_env?.status === 'online' ? 'online' : 'offline'} />
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-slide-in">
            {/* API Status Cards */}
            <div className={`p-6 rounded-2xl ${isDark ? 'glass' : 'glass-light'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Status das APIs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tokensStatus?.providers?.map(provider => (
                  <div key={provider.id} className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{provider.name}</span>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        provider.status === 'configured' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {provider.status === 'configured' ? '✓ Configurado' : '✗ Sem API Key'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{provider.model}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Modelo Primário: <span className="font-semibold text-white">{tokensStatus?.primaryModel}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                label="CPU"
                value={vpsStatus?.cpu?.toFixed?.(1) ?? '0'}
                unit="%"
                change="+2.4%"
                trend="up"
                isDark={isDark}
              />
              <MetricCard
                label="Memória"
                value={vpsStatus?.memory?.toFixed?.(1) ?? '0'}
                unit="%"
                change="-1.2%"
                trend="down"
                isDark={isDark}
              />
              <MetricCard
                label="Disco"
                value={vpsStatus?.disk?.replace('%', '') ?? '0'}
                unit="%"
                isDark={isDark}
              />
              <MetricCard
                label="Tempo Ativo"
                value={vpsStatus?.pm2?.[0]?.pm2_env?.pm_uptime ? 
                  Math.floor((Date.now() - vpsStatus.pm2[0].pm2_env.pm_uptime) / 60000) : 0}
                unit="min"
                isDark={isDark}
              />
            </div>

            {/* Gateway Status */}
            <div className={`p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light'}`}>
              <h3 className="text-lg font-semibold mb-6">Gateway OpenClaw</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Processo</p>
                  <p className="text-2xl font-bold">{vpsStatus?.pm2?.[0]?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">PID</p>
                  <p className="text-2xl font-bold">{vpsStatus?.pm2?.[0]?.pid || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Memória</p>
                  <p className="text-2xl font-bold">
                    {vpsStatus?.pm2?.[0]?.monit?.memory 
                      ? (vpsStatus.pm2[0].monit.memory / 1024 / 1024).toFixed(0) 
                      : '0'} <span className="text-lg text-gray-400">MB</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Server Tab */}
        {activeTab === 'server' && (
          <div className={`p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light'} animate-slide-in`}>
            <h3 className="text-lg font-semibold mb-4">Detalhes do Servidor</h3>
            <p className="text-gray-400">Informações detalhadas do servidor em desenvolvimento...</p>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className={`p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light'} animate-slide-in`}>
            <h3 className="text-lg font-semibold mb-4">Logs do Sistema</h3>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400">
              <p>Logs em tempo real serão exibidos aqui...</p>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className={`p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light'} animate-slide-in`}>
            <h3 className="text-lg font-semibold mb-4">Central de Alertas</h3>
            <p className="text-gray-400 text-center py-8">Nenhum alerta no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
