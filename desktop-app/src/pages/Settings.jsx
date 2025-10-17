import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ollamaInstalled, setOllamaInstalled] = useState(false);
  const [ollamaModels, setOllamaModels] = useState([]);
  const [installingModel, setInstallingModel] = useState(false);

   
 useEffect(() => {
    loadSettings();
    loadOllamaModels();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('🔧 Loading settings...');
      const result = await invoke('get_ai_settings');
      console.log('✅ Settings result:', result);
      const data = typeof result === 'string' ? JSON.parse(result) : result;
      setSettings(data);
    } catch (error) {
      console.error('❌ Failed to load settings:', error);
      // Set default settings on error
      setSettings({
        llm_provider: 'openai',
        embedding_provider: 'openai',
        ollama_model: 'llama3',
        openai_model: 'gpt-4o-mini',
        openai_api_key: '',
        temperature: 0.7,
        chunk_size: 500,
        chunk_overlap: 50,
        top_k: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOllamaModels = async () => {
    try {
      const result = await invoke('get_ollama_models');
      const data = typeof result === 'string' ? JSON.parse(result) : result;
      setOllamaModels(data.models || []);
    } catch (error) {
      console.error('Failed to load Ollama models:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await invoke('save_ai_settings', { 
        settings: JSON.stringify(settings) 
      });
      alert('✅ Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('❌ Failed to save settings: ' + error);
    } finally {
      setSaving(false);
    }
  };
  
 

  const handleInstallModel = async (modelName) => {
    if (!confirm(`Install ${modelName}? This will download ~4-5GB.`)) return;

    setInstallingModel(true);
    try {
      await invoke('install_ollama_model', { modelName });
      alert(`${modelName} installed successfully!`);
      checkOllama();
    } catch (err) {
      alert(`Failed to install ${modelName}: ${err}`);
    } finally {
      setInstallingModel(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-8">
      <h2 className="mb-2 text-3xl font-bold text-gray-900">⚙️ Settings</h2>
      <p className="mb-8 text-gray-600">Configure your AI providers and preferences</p>

      {/* LLM Provider */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-900">🤖 AI Provider</h3>
        
        <div className="space-y-4">
          {/* Local (Ollama) */}
          <label className="flex items-start gap-4 p-4 transition border-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="llm_provider"
              value="local"
              checked={settings?.llm_provider === 'local'}
              onChange={(e) => updateSetting('llm_provider', e.target.value)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔒</span>
                <h4 className="font-bold text-gray-900">100% Local (Ollama)</h4>
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-600">
                Free • Private • No internet required
              </p>
              <p className="text-xs text-gray-500">
                Requires: 8GB RAM, 5GB disk space
              </p>

              {settings?.llm_provider === 'local' && (
                <div className="p-4 mt-4 rounded-lg bg-gray-50">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Ollama Status: {ollamaInstalled ? '✅ Installed' : '❌ Not Installed'}
                  </p>

                  {!ollamaInstalled && (
                    <div className="p-3 mb-3 border border-yellow-200 rounded bg-yellow-50">
                      <p className="mb-2 text-sm text-yellow-800">
                        Install Ollama to use local AI models:
                      </p>
                      <a
                        href="https://ollama.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        Download Ollama →
                      </a>
                    </div>
                  )}

                  {ollamaInstalled && (
                    <>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select Model:
                      </label>
                      <select
                        value={settings?.ollama_model || 'llama3'}
                        onChange={(e) => updateSetting('ollama_model', e.target.value)}
                        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg"
                      >
                        {ollamaModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>

                      {ollamaModels.length === 0 && (
                        <div className="space-y-2">
                          <p className="mb-2 text-sm text-gray-600">Install a model:</p>
                          {['llama3', 'mistral', 'phi3'].map(model => (
                            <button
                              key={model}
                              onClick={() => handleInstallModel(model)}
                              disabled={installingModel}
                              className="w-full px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                            >
                              Install {model}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </label>

          {/* OpenAI */}
          <label className="flex items-start gap-4 p-4 transition border-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="llm_provider"
              value="openai"
              checked={settings?.llm_provider === 'openai'}
              onChange={(e) => updateSetting('llm_provider', e.target.value)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">☁️</span>
                <h4 className="font-bold text-gray-900">OpenAI</h4>
              </div>
              <p className="mb-2 text-sm text-gray-600">
                Best quality • ~$0.01 per question • Data sent to OpenAI
              </p>

              {settings?.llm_provider === 'openai' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      API Key:
                    </label>
                    <input
                      type="password"
                      value={settings?.openai_api_key || ''}
                      onChange={(e) => updateSetting('openai_api_key', e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Model:
                    </label>
                    <select
                      value={settings?.openai_model || 'gpt-4'}
                      onChange={(e) => updateSetting('openai_model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="gpt-4">GPT-4 (Best)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo (Fast)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheap)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </label>

          {/* Claude */}
          <label className="flex items-start gap-4 p-4 transition border-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="llm_provider"
              value="claude"
              checked={settings?.llm_provider === 'claude'}
              onChange={(e) => updateSetting('llm_provider', e.target.value)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🧠</span>
                <h4 className="font-bold text-gray-900">Claude (Anthropic)</h4>
              </div>
              <p className="mb-2 text-sm text-gray-600">
                Great reasoning • ~$0.015 per question • Data sent to Anthropic
              </p>

              {settings?.llm_provider === 'claude' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      API Key:
                    </label>
                    <input
                      type="password"
                      value={settings?.claude_api_key || ''}
                      onChange={(e) => updateSetting('claude_api_key', e.target.value)}
                      placeholder="sk-ant-..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Model:
                    </label>
                    <select
                      value={settings?.claude_model || 'claude-3-sonnet-20240229'}
                      onChange={(e) => updateSetting('claude_model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="claude-3-opus-20240229">Claude 3 Opus (Best)</option>
                      <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                      <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fast)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Embedding Provider */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-900">🔢 Embeddings</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="embedding_provider"
              value="local"
              checked={settings?.embedding_provider === 'local'}
              onChange={(e) => updateSetting('embedding_provider', e.target.value)}
            />
            <div>
              <span className="font-semibold">Local (Free)</span>
              <p className="text-sm text-gray-600">Uses sentence-transformers (good quality)</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="embedding_provider"
              value="openai"
              checked={settings?.embedding_provider === 'openai'}
              onChange={(e) => updateSetting('embedding_provider', e.target.value)}
            />
            <div>
              <span className="font-semibold">OpenAI (Paid)</span>
              <p className="text-sm text-gray-600">Best quality embeddings (~$0.0001 per page)</p>
            </div>
          </label>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-900">🔧 Advanced</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Chunk Size (words):
            </label>
            <input
              type="number"
              value={settings?.chunk_size || 500}
              onChange={(e) => updateSetting('chunk_size', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="100"
              max="2000"
            />
            <p className="mt-1 text-xs text-gray-500">
              Smaller = more precise, Larger = more context
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Top K Results:
            </label>
            <input
              type="number"
              value={settings?.top_k || 5}
              onChange={(e) => updateSetting('top_k', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="1"
              max="20"
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of relevant chunks to retrieve per question
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Temperature: {settings?.temperature || 0.7}
            </label>
            <input
              type="range"
              value={settings?.temperature || 0.7}
              onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
              className="w-full"
              min="0"
              max="1"
              step="0.1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower = more focused, Higher = more creative
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-6 py-4 text-lg font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : '💾 Save Settings'}
      </button>

      {/* Privacy Notice */}
      <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h4 className="mb-1 font-bold text-blue-900">Privacy Note</h4>
            <p className="text-sm text-blue-800">
              With <strong>100% Local</strong> mode, your documents and questions never leave
              your computer. With cloud providers (OpenAI/Claude), only the relevant text chunks
              and questions are sent to generate answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}