import React from 'react';
import { useStatus, useModels } from '../hooks/useAPI';
import { CheckCircle, AlertCircle, Server, Cpu, Loader2, RefreshCw } from 'lucide-react';

const SettingsPanel = () => {
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useStatus();
  const { data: models, isLoading: modelsLoading } = useModels();

  const handleRefreshStatus = () => {
    refetchStatus();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings & Status</h2>
        <p className="text-gray-600">System configuration and connection status</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">LM Studio Connection</h3>
          <button
            onClick={handleRefreshStatus}
            disabled={statusLoading}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${statusLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {statusLoading ? (
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Checking connection...</span>
          </div>
        ) : status ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {status.lm_studio_connected ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Connected</p>
                    <p className="text-sm text-green-600">{status.message}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Disconnected</p>
                    <p className="text-sm text-red-600">{status.message}</p>
                  </div>
                </>
              )}
            </div>

            {!status.lm_studio_connected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Steps:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ensure LM Studio is running on your machine</li>
                  <li>• Check that the server is started in LM Studio</li>
                  <li>• Verify the server is running on localhost:1234</li>
                  <li>• Make sure DeepSeek R1 model is loaded</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-600">Failed to check status</span>
          </div>
        )}
      </div>

      {/* Available Models */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Cpu className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Available Models</h3>
        </div>

        {modelsLoading ? (
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading models...</span>
          </div>
        ) : models?.models?.length > 0 ? (
          <div className="space-y-2">
            {models.models.map((model, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
              >
                <Server className="h-4 w-4 text-gray-600" />
                <span className="font-mono text-sm">{model}</span>
                {model.toLowerCase().includes('deepseek') && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Recommended
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600">
            <p>No models available</p>
            <p className="text-sm text-gray-500 mt-1">
              Make sure LM Studio is connected and has models loaded
            </p>
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Frontend</p>
              <p className="text-sm text-gray-600">React + Vite</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Backend</p>
              <p className="text-sm text-gray-600">FastAPI + Python</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Database</p>
              <p className="text-sm text-gray-600">SQLite</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">LLM Provider</p>
              <p className="text-sm text-gray-600">LM Studio (Local)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Model</p>
              <p className="text-sm text-gray-600">DeepSeek R1</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">API Endpoint</p>
              <p className="text-sm text-gray-600 font-mono">localhost:1234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium text-gray-700">Auto-save generations</p>
              <p className="text-sm text-gray-500">Automatically save all generated content</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium text-gray-700">History retention</p>
              <p className="text-sm text-gray-500">Keep generation history indefinitely</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-700">Real-time status updates</p>
              <p className="text-sm text-gray-500">Check LM Studio connection every 30 seconds</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 