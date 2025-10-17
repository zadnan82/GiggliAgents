import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import DocumentUpload from '../components/DocumentUpload';

export default function Dashboard({ onRefresh }) {
  const [stats, setStats] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Load stats
      const statsResult = await invoke('get_vector_stats');
      const statsData = typeof statsResult === 'string' ? JSON.parse(statsResult) : statsResult;
      setStats(statsData);

      // Load recent chats
      const chatResult = await invoke('get_chat_history', { limit: 5 });
      const chatData = typeof chatResult === 'string' ? JSON.parse(chatResult) : chatResult;
      setRecentChats(chatData.history || []);

      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    loadDashboard();
    if (onRefresh) onRefresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          Welcome to RAG Assistant
        </h2>
        <p className="text-gray-600">
          Your private AI-powered knowledge base. Upload documents and ask questions.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <StatCard
          icon="📚"
          label="Total Documents"
          value={stats?.total_documents || 0}
          color="blue"
        />
        <StatCard
          icon="🧩"
          label="Text Chunks"
          value={stats?.total_chunks || 0}
          color="purple"
        />
        <StatCard
          icon="💬"
          label="Conversations"
          value={recentChats.length}
          color="green"
        />
      </div>

      {/* Upload Section */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          📤 Upload Documents
        </h3>

        <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    <div className="flex-1">
      <p className="text-sm font-semibold text-blue-900">Processing Times</p>
      <p className="mt-1 text-xs text-blue-700">
        Most files process instantly. Audio/video transcription takes 2-5 minutes. 
        Watch the terminal for progress updates.
      </p>
    </div>
  </div>
</div>
        <DocumentUpload onUploadComplete={handleUploadComplete} />

        
      </div>

      {/* Recent Chats */}
      {recentChats.length > 0 && (
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            💭 Recent Conversations
          </h3>
          <div className="space-y-4">
            {recentChats.map((chat, idx) => (
              <div key={idx} className="py-2 pl-4 border-l-4 border-blue-500">
                <p className="font-semibold text-gray-900">{chat.question}</p>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {chat.answer}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(chat.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {stats?.total_documents === 0 && (
        <div className="p-8 mt-8 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            🚀 Getting Started
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h4 className="font-bold">Upload Documents</h4>
                <p className="text-sm">
                  Upload PDFs, DOCX, PPTX, or text files. Your data stays private on your computer.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h4 className="font-bold">Configure AI Provider</h4>
                <p className="text-sm">
                  Choose between 100% local (free, private) or cloud AI (OpenAI/Claude).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h4 className="font-bold">Ask Questions</h4>
                <p className="text-sm">
                  Go to Chat and ask anything about your documents. Get instant answers with sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="mb-2 text-4xl">{icon}</div>
      <div className="mb-1 text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}