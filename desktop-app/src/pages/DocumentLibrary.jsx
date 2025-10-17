 

  import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import DocumentUpload from '../components/DocumentUpload';

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ total_documents: 0, total_chunks: 0 });
  const [loading, setLoading] = useState(true);

  


const loadDocuments = async () => {
  try {
    setLoading(true);
    
    // Get vector store stats
    const statsResult = await invoke('get_vector_stats');
    const statsData = JSON.parse(statsResult);
    setStats(statsData);
    
    // Get documents
    const docsResult = await invoke('get_documents');
    const docsData = JSON.parse(docsResult);
    
    console.log('📚 Documents loaded:', docsData);
    
    // Transform to display format
    const docsList = (docsData.documents || []).map(doc => ({
      id: doc.doc_id || doc.id,
      name: doc.doc_name || doc.name,
      chunks: doc.chunks_count || 0,
      uploadedAt: doc.added_at || new Date().toISOString(),
      size: doc.size || null
    }));
    
    setDocuments(docsList);
  } catch (error) {
    console.error('Failed to load documents:', error);
    setDocuments([]);
  } finally {
    setLoading(false);
  }
};
 
  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (docName) => {
    if (!confirm(`Delete "${docName}"? This cannot be undone.`)) return;
    
    try {
      await invoke('python_backend', {
        command: 'delete_document',
        params: { document_name: docName }
      });
      loadDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document');
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return '📄';
    const ext = filename.toLowerCase().split('.').pop();
    const icons = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      txt: '📝',
      csv: '📊',
      xlsx: '📊',
      xls: '📊',
      zip: '📦',
      '7z': '📦',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      gif: '🖼️',
      mp3: '🎵',
      wav: '🎵',
      mp4: '🎬',
      avi: '🎬',
      html: '🌐',
      xml: '📋',
      json: '📋'
    };
    return icons[ext] || '📄';
  };
 

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">Document Library</h1>
        <p className="mt-2 text-center text-gray-600">
          {stats.total_documents} documents • {stats.total_chunks} chunks
        </p>
      </div>

      {/* Upload Section - As a prominent card */}
      <div className="p-8 mb-8 border-2 border-blue-300 border-dashed bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="text-center">
          <div className="mb-4 text-5xl">📤</div>
          <h3 className="mb-3 text-xl font-semibold text-gray-800">Upload Documents</h3>
          <p className="mb-6 text-gray-600">Add PDF, images, audio, video, or any document type</p>
          <DocumentUpload onUploadComplete={loadDocuments} />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        /* Empty State */
        <div className="py-12 text-center border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
          <div className="mb-4 text-6xl">📚</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700">No documents yet</h3>
          <p className="text-gray-500">Use the upload section above to get started!</p>
        </div>
      ) : (
        /* Documents Grid */
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Your Documents</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
              >
                {/* Icon and Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1 min-w-0 gap-3">
                    <div className="flex-shrink-0 text-4xl">
                      {getFileIcon(doc.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate" title={doc.name}>
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doc.chunks} chunks
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(doc.name)}
                    className="flex-shrink-0 p-2 text-red-500 transition-colors rounded-lg hover:text-red-700 hover:bg-red-50"
                    title="Delete document"
                  >
                    🗑️
                  </button>
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span className="font-medium text-green-600">Ready to search</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-6 mt-12 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900">🔒 100% Private</h3>
            <p className="mt-1 text-sm text-blue-700">
              All your documents are processed and stored locally on your computer. Nothing is sent to the cloud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}