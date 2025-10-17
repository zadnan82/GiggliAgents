import React from 'react';

export default function DocumentCard({ document, onDelete }) {
  const getFileIcon = (name) => {
    if (!name) return ' '
    const ext = name.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      ppt: '📙',
      pptx: '📙',
      txt: '📄',
      md: '📝'
    };
    return icons[ext] || '📄';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="p-6 transition bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{getFileIcon(document.name)}</div>
        <button
          onClick={onDelete}
          className="text-xl text-red-500 transition hover:text-red-700"
          title="Delete document"
        >
          🗑️
        </button>
      </div>

      <h3 className="mb-2 font-bold text-gray-900 line-clamp-2" title={document.name}>
        {document.name}
      </h3>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>🧩</span>
          <span>{document.chunks} chunks</span>
        </div>

        <div className="flex items-center gap-2">
          <span>📅</span>
          <span className="text-xs">{formatDate(document.added_at)}</span>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-200">
        <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
          Ready to search
        </span>
      </div>
    </div>
  );
}