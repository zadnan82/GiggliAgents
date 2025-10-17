import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export default function ChatView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('all');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadHistory();
    loadDocuments();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 const loadDocuments = async () => {
  try {
    const result = await invoke('get_documents');
    const data = JSON.parse(result);
    console.log('📚 Chat documents loaded:', data);
    setDocuments(data.documents || []);
  } catch (error) {
    console.error('Failed to load documents:', error);
  }
};

const loadHistory = async () => {
  try {
    const result = await invoke('get_chat_history', { limit: 50 });
    const data = JSON.parse(result);
    setMessages(data.history || []);
  } catch (error) {
    console.error('Failed to load history:', error);
  }
};

const handleSend = async () => {
  if (!input.trim() || loading) return;

  const question = input;
  setInput('');
  setLoading(true);

  setMessages(prev => [...prev, {
    question,
    answer: '...',
    sources: [],
    timestamp: new Date().toISOString()
  }]);

  try {
    // Add the document filter to the question if a specific doc is selected
    let finalQuestion = question;
    if (selectedDoc !== 'all') {
      finalQuestion = `[Search only in ${selectedDoc}] ${question}`;
    }
    
    const result = await invoke('ask_question', { 
      question: finalQuestion
    });
    const data = JSON.parse(result);
    
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        question,
        answer: data.answer,
        sources: data.sources || [],
        timestamp: new Date().toISOString(),
        filtered: selectedDoc !== 'all' ? selectedDoc : null  // Show what was filtered
      };
      return updated;
    });
  } catch (error) {
    console.error('Failed to ask question:', error);
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        question,
        answer: `Error: ${error}`,
        sources: [],
        timestamp: new Date().toISOString()
      };
      return updated;
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col h-screen max-w-5xl p-6 mx-auto">
      {/* Document Selector */}
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-md">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          🔍 Search in:
        </label>
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">✨ All Documents ({documents.length})</option>
          {documents.map((doc) => (
            <option key={doc.doc_id} value={doc.doc_name}>
              📄 {doc.doc_name}
            </option>
          ))}
        </select>
        {selectedDoc !== 'all' && (
          <p className="mt-2 text-sm text-blue-600">
            🎯 Only searching in: <strong>{selectedDoc}</strong>
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 mb-4 space-y-6 overflow-y-auto rounded-lg bg-gray-50">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <div className="mb-4 text-6xl">💬</div>
            <p>Ask a question about your documents!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="space-y-3">
              {/* Question */}
              <div className="flex justify-end">
                <div className="max-w-2xl px-5 py-3 text-white bg-blue-600 shadow-md rounded-2xl">
                  <p className="font-medium">{msg.question}</p>
                </div>
              </div>
              
              {/* Answer */}
              <div className="flex justify-start">
                <div className="max-w-2xl px-5 py-4 bg-white border border-gray-200 shadow-md rounded-2xl">
                  <p className="leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {msg.answer}
                  </p>
                  
                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <p className="mb-2 text-sm font-semibold text-gray-700">📎 Sources:</p>
                      <div className="space-y-1">
                        {msg.sources.slice(0, 3).map((source, i) => (
                          <div key={i} className="px-2 py-1 text-xs text-gray-600 rounded bg-gray-50">
                            {source.document}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask a question about your documents..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? '⏳' : '📤 Send'}
        </button>
      </div>
    </div>
  );
}