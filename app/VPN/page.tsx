'use client';

import { useState, useEffect } from 'react';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface ServerInfo {
  name: string;
  location: string;
  ping: number;
  flag: string;
}

// Dummy API functions
const connectToVPN = async (): Promise<{ success: boolean; server?: ServerInfo }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    server: {
      name: 'US East Server',
      location: 'New York, USA',
      ping: 23,
      flag: '🇺🇸'
    }
  };
};

const disconnectFromVPN = async (): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

const getServerList = async (): Promise<ServerInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { name: 'US East Server', location: 'New York, USA', ping: 23, flag: '🇺🇸' },
    { name: 'US West Server', location: 'Los Angeles, USA', ping: 45, flag: '🇺🇸' },
    { name: 'UK Server', location: 'London, UK', ping: 12, flag: '🇬🇧' },
    { name: 'Germany Server', location: 'Frankfurt, Germany', ping: 18, flag: '🇩🇪' },
    { name: 'Japan Server', location: 'Tokyo, Japan', ping: 89, flag: '🇯🇵' },
  ];
};

export default function VPNPage() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [currentServer, setCurrentServer] = useState<ServerInfo | null>(null);
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [showServerList, setShowServerList] = useState(false);

  useEffect(() => {
    // Load server list on mount
    getServerList().then(setServers);
  }, []);

  const handleConnect = async () => {
    if (status === 'connected') {
      // Disconnect
      setStatus('connecting');
      const result = await disconnectFromVPN();
      if (result.success) {
        setStatus('disconnected');
        setCurrentServer(null);
      }
    } else {
      // Connect
      setStatus('connecting');
      const result = await connectToVPN();
      if (result.success && result.server) {
        setStatus('connected');
        setCurrentServer(result.server);
      } else {
        setStatus('disconnected');
      }
    }
  };

  const handleServerSelect = async (server: ServerInfo) => {
    if (status === 'connected') {
      setStatus('connecting');
      await disconnectFromVPN();
    }
    
    setStatus('connecting');
    setCurrentServer(server);
    
    // Simulate connection to selected server
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('connected');
    setShowServerList(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main VPN Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-orange-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">VPN Connection</h1>
            <p className="text-gray-500 text-sm">Secure your internet connection</p>
          </div>

          {/* Connection Status Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                {/* Outer ring */}
                <div
                  className={`w-32 h-32 rounded-full border-4 transition-all duration-500 ${
                    status === 'connected'
                      ? 'border-orange-400 bg-orange-50'
                      : status === 'connecting'
                      ? 'border-orange-300 bg-orange-50 animate-pulse'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                />
                {/* Inner circle */}
                <div
                  className={`absolute inset-4 rounded-full transition-all duration-500 ${
                    status === 'connected'
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                      : status === 'connecting'
                      ? 'bg-orange-300 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {status === 'connected' ? (
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : status === 'connecting' ? (
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-8 h-8 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center">
              <p
                className={`text-lg font-semibold mb-1 ${
                  status === 'connected'
                    ? 'text-orange-500'
                    : status === 'connecting'
                    ? 'text-orange-400'
                    : 'text-gray-500'
                }`}
              >
                {status === 'connected'
                  ? 'Connected'
                  : status === 'connecting'
                  ? 'Connecting...'
                  : 'Disconnected'}
              </p>
              {currentServer && status === 'connected' && (
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600">
                    {currentServer.flag} {currentServer.name}
                  </p>
                  <p className="text-xs text-gray-500">{currentServer.location}</p>
                  <p className="text-xs text-orange-500 font-medium">
                    Ping: {currentServer.ping}ms
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Connect/Disconnect Button */}
          <button
            onClick={handleConnect}
            disabled={status === 'connecting'}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              status === 'connected'
                ? 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600'
            }`}
          >
            {status === 'connected' ? 'Disconnect' : status === 'connecting' ? 'Connecting...' : 'Connect'}
          </button>
        </div>

        {/* Server List */}
        {showServerList && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-orange-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Servers</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {servers.map((server, index) => (
                <button
                  key={index}
                  onClick={() => handleServerSelect(server)}
                  disabled={status === 'connecting'}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                    currentServer?.name === server.name && status === 'connected'
                      ? 'bg-orange-50 border-orange-400 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{server.flag}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{server.name}</p>
                        <p className="text-sm text-gray-500">{server.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-500">{server.ping}ms</p>
                      {currentServer?.name === server.name && status === 'connected' && (
                        <span className="text-xs text-orange-500 font-semibold">Active</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Connection Info (when connected) */}
        {status === 'connected' && currentServer && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mt-6 border border-orange-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Connection Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-green-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Secure
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Server</span>
                <span className="font-semibold text-gray-800">{currentServer.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Location</span>
                <span className="font-semibold text-gray-800">{currentServer.location}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Latency</span>
                <span className="font-semibold text-orange-500">{currentServer.ping}ms</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

