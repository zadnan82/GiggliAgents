import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

// Components
import LicenseActivation from './components/LicenseActivation';
import Dashboard from './pages/Dashboard';
import DocumentLibrary from './pages/DocumentLibrary';
import ChatView from './pages/ChatView';
import Settings from './pages/Settings';
import { ToastProvider } from './components/Toast';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLicensed, setIsLicensed] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [checkingLicense, setCheckingLicense] = useState(true);
  const [stats, setStats] = useState({ documents: 0, chunks: 0 });

  useEffect(() => {
    checkLicense();
    loadStats();
  }, []);

  const checkLicense = async () => {
    try {
      const info = await invoke('get_license_info');
      const licenseData = typeof info === 'string' ? JSON.parse(info) : info;
      if (licenseData && licenseData.valid) {
        setIsLicensed(true);
        setLicenseInfo(licenseData);
        console.log('✅ Valid license found:', licenseData.email);
      }
    } catch (err) {
      console.log('ℹ️ No license found');
    } finally {
      setCheckingLicense(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await invoke('get_vector_stats');
      const statsData = typeof result === 'string' ? JSON.parse(result) : result;
      setStats({
        documents: statsData.total_documents || 0,
        chunks: statsData.total_chunks || 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleLicenseActivated = (info) => {
    setIsLicensed(true);
    setLicenseInfo(info);
    console.log('🎉 License activated successfully!');
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to remove your license?')) {
      try {
        await invoke('remove_license');
        setIsLicensed(false);
        setLicenseInfo(null);
        window.location.reload();
      } catch (err) {
        alert('Failed to remove license: ' + err);
      }
    }
  };

  // Loading screen
  if (checkingLicense) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-16 h-16 mb-4 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
        <p className="text-xl font-semibold text-gray-700">
          Loading RAG Assistant...
        </p>
      </div>
    );
  }

  // License activation screen
  if (!isLicensed) {
    return <LicenseActivation onActivated={handleLicenseActivated} />;
  }

  // Main application
  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">🧠 RAG Assistant</h1>
            <p className="mt-1 text-xs text-gray-500">AI Knowledge Base</p>
          </div>

          {/* License Badge */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-green-600">✅</span>
              <span className="text-sm font-semibold text-gray-900">Licensed</span>
            </div>
            <p className="text-xs text-gray-600 truncate">{licenseInfo?.email}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="px-2 py-1 text-xs font-semibold text-purple-700 capitalize bg-purple-100 rounded-full">
                {licenseInfo?.tier} Plan
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 transition hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="mb-2 text-xs text-gray-600">📊 Quick Stats</div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Documents:</span>
              <span className="font-bold text-blue-600">{stats.documents}</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-gray-700">Chunks:</span>
              <span className="font-bold text-blue-600">{stats.chunks}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavButton
              icon="🏠"
              label="Dashboard"
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            />
            
            <NavButton
              icon="💬"
              label="Chat"
              active={currentView === 'chat'}
              onClick={() => setCurrentView('chat')}
            />
            
            <NavButton
              icon="📚"
              label="Documents"
              active={currentView === 'documents'}
              onClick={() => setCurrentView('documents')}
              badge={stats.documents > 0 ? stats.documents : null}
            />
            
            <div className="my-4 border-t border-gray-200"></div>
            
            <NavButton
              icon="⚙️"
              label="Settings"
              active={currentView === 'settings'}
              onClick={() => setCurrentView('settings')}
            />
          </nav>

          {/* Footer */}
          <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
            <p className="font-semibold text-gray-700">RAG Assistant Pro</p>
            <p className="mt-1">Version 1.0.0</p>
            <p className="mt-1">🔒 100% Private</p>
            <a
              href="https://giggliagents.com/support"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-600 hover:underline"
            >
              Get Support
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && <Dashboard onRefresh={loadStats} />}
          {currentView === 'chat' && <ChatView />}
          {currentView === 'documents' && <DocumentLibrary onRefresh={loadStats} />}
          {currentView === 'settings' && <Settings />}
        </div>
      </div>
    </ToastProvider>
  );
}

// Navigation Button Component
function NavButton({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition font-medium flex items-center justify-between ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span>
        {icon} {label}
      </span>
      {badge && (
        <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

export default App;