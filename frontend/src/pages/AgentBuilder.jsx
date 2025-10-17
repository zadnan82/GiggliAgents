// frontend/src/pages/AgentBuilder.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AVAILABLE_MODULES = {
  em: {
    name: 'Email Reader',
    icon: '📧',
    description: 'Fetch emails from Gmail/Outlook',
    params: {
      query: { label: 'Search Query', default: 'is:unread', placeholder: 'is:unread' },
      max: { label: 'Max Emails', default: 50, type: 'number' }
    }
  },
  ec: {
    name: 'Email Categorizer',
    icon: '🤖',
    description: 'AI categorizes emails by priority',
    params: {}
  },
  rg: {
    name: 'Reply Generator',
    icon: '✍️',
    description: 'Generate AI reply drafts',
    params: {
      style: { 
        label: 'Writing Style', 
        default: 'professional',
        type: 'select',
        options: ['professional', 'casual', 'formal', 'friendly']
      },
      count: { label: 'Number of Drafts', default: 3, type: 'number' }
    }
  },
  es: {
    name: 'Email Sender',
    icon: '📤',
    description: 'Send emails',
    params: {}
  },
  su: {
    name: 'Summarizer',
    icon: '📝',
    description: 'Summarize long emails',
    params: {
      max_length: { label: 'Max Summary Length', default: 200, type: 'number' }
    }
  },
  nf: {
    name: 'Notifier',
    icon: '🔔',
    description: 'Desktop notifications',
    params: {
      message: { label: 'Notification Message', default: 'Agent completed!', placeholder: 'Your message' }
    }
  }
};

export default function AgentBuilder() {
  const navigate = useNavigate();
  
  const [agentName, setAgentName] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  const [moduleConfigs, setModuleConfigs] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const addModule = (moduleId) => {
    const newModule = {
      id: `${moduleId}_${Date.now()}`,
      type: moduleId,
      config: {}
    };
    
    // Set default config
    const module = AVAILABLE_MODULES[moduleId];
    if (module.params) {
      Object.keys(module.params).forEach(key => {
        newModule.config[key] = module.params[key].default;
      });
    }
    
    setSelectedModules([...selectedModules, newModule]);
  };

  const removeModule = (index) => {
    setSelectedModules(selectedModules.filter((_, i) => i !== index));
  };

  const updateModuleConfig = (index, key, value) => {
    const updated = [...selectedModules];
    updated[index].config[key] = value;
    setSelectedModules(updated);
  };

  const moveModule = (index, direction) => {
    const updated = [...selectedModules];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < updated.length) {
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      setSelectedModules(updated);
    }
  };

  const generateWorkflowCode = () => {
    let code = `@agent ${agentName.replace(/\s+/g, '_').toLowerCase()} v1.0\n`;
    code += `@tier starter\n\n`;
    
    selectedModules.forEach((module, i) => {
      const moduleType = module.type;
      const config = module.config;
      
      let params = [];
      Object.keys(config).forEach(key => {
        const value = config[key];
        if (typeof value === 'string') {
          params.push(`${key}="${value}"`);
        } else {
          params.push(`${key}=${value}`);
        }
      });
      
      const paramStr = params.length > 0 ? ` ${params.join(' ')}` : '';
      
      if (i === 0) {
        code += `> ${moduleType}.${getModuleAction(moduleType)}${paramStr}\n`;
      } else {
        const prevVar = `$${selectedModules[i-1].type}.result`;
        code += `> ${moduleType}.${getModuleAction(moduleType)} ${prevVar}${paramStr}\n`;
      }
    });
    
    return code;
  };

  const getModuleAction = (type) => {
    const actions = {
      em: 'scan',
      ec: 'categorize',
      rg: 'generate',
      es: 'send',
      su: 'summarize',
      nf: 'notify'
    };
    return actions[type] || 'run';
  };

  const handleBuild = async () => {
    if (!agentName.trim()) {
      alert('Please enter an agent name');
      return;
    }
    
    if (selectedModules.length === 0) {
      alert('Please add at least one module');
      return;
    }

    const workflow = {
      agent_name: agentName,
      modules: selectedModules,
      workflow_code: generateWorkflowCode()
    };

    // Navigate to checkout with custom workflow
    navigate('/checkout/custom', { state: { workflow } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            🎨 Custom Agent Builder
          </div>
          <h1 className="text-4xl font-bold mb-4">Build Your Custom Agent</h1>
          <p className="text-xl text-gray-600">
            Design your own AI workflow with drag-and-drop modules
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left: Agent Config */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Agent Info</h2>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="My Custom Agent"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Available Modules</h3>
                <div className="space-y-2">
                  {Object.keys(AVAILABLE_MODULES).map(moduleId => (
                    <button
                      key={moduleId}
                      onClick={() => addModule(moduleId)}
                      className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{AVAILABLE_MODULES[moduleId].icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{AVAILABLE_MODULES[moduleId].name}</div>
                          <div className="text-xs text-gray-600">{AVAILABLE_MODULES[moduleId].description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition mb-3"
              >
                {showPreview ? '📋 Hide' : '👁️ Preview'} Workflow Code
              </button>

              {showPreview && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto mb-3">
                  <pre>{generateWorkflowCode()}</pre>
                </div>
              )}

              <button
                onClick={handleBuild}
                disabled={!agentName || selectedModules.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 transition"
              >
                Build My Agent →
              </button>
            </div>
          </div>

          {/* Right: Workflow Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Workflow</h2>
              
              {selectedModules.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-lg">Click modules on the left to add them to your workflow</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedModules.map((module, index) => (
                    <div key={module.id} className="border-2 border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{AVAILABLE_MODULES[module.type].icon}</span>
                          <div>
                            <div className="font-bold">{AVAILABLE_MODULES[module.type].name}</div>
                            <div className="text-sm text-gray-600">Step {index + 1}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveModule(index, 'up')}
                            disabled={index === 0}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveModule(index, 'down')}
                            disabled={index === selectedModules.length - 1}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => removeModule(index)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Module Config */}
                      {Object.keys(AVAILABLE_MODULES[module.type].params).length > 0 && (
                        <div className="space-y-3 bg-gray-50 p-3 rounded">
                          {Object.keys(AVAILABLE_MODULES[module.type].params).map(paramKey => {
                            const param = AVAILABLE_MODULES[module.type].params[paramKey];
                            
                            return (
                              <div key={paramKey}>
                                <label className="block text-sm font-semibold mb-1">{param.label}</label>
                                
                                {param.type === 'select' ? (
                                  <select
                                    value={module.config[paramKey]}
                                    onChange={(e) => updateModuleConfig(index, paramKey, e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                  >
                                    {param.options.map(opt => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : param.type === 'number' ? (
                                  <input
                                    type="number"
                                    value={module.config[paramKey]}
                                    onChange={(e) => updateModuleConfig(index, paramKey, parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border rounded"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={module.config[paramKey]}
                                    onChange={(e) => updateModuleConfig(index, paramKey, e.target.value)}
                                    placeholder={param.placeholder}
                                    className="w-full px-3 py-2 border rounded"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {index < selectedModules.length - 1 && (
                        <div className="text-center text-gray-400 text-2xl mt-3">↓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}