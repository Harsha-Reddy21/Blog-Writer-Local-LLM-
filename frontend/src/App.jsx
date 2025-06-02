import React, { useState } from 'react';
import BlogGenerator from './components/BlogGenerator';
import HistoryPanel from './components/HistoryPanel';
import SettingsPanel from './components/SettingsPanel';
import { useStatus } from './hooks/useAPI';
import { AlertCircle, CheckCircle, Settings, History, PenTool } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const { data: status } = useStatus();

  const tabs = [
    { id: 'generator', label: 'Generator', icon: PenTool },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <PenTool className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Writer</h1>
                <p className="text-sm text-gray-500">Powered by DeepSeek R1</p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              {status?.lm_studio_connected ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">LM Studio Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">LM Studio Disconnected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generator' && <BlogGenerator />}
        {activeTab === 'history' && <HistoryPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}

export default App; 