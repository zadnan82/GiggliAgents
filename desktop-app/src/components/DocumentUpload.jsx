import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

export default function DocumentUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    try {
      setError('');
      setUploading(true);

      // Open file dialog with all supported types
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'All Supported Files',
          extensions: [
            // Documents
            'pdf', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'md',
            // Spreadsheets
            'xlsx', 'xls', 'csv',
            // Images
            'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif',
            // Audio
            'mp3', 'wav', 'm4a', 'flac', 'ogg',
            // Video
            'mp4', 'avi', 'mov', 'mkv',
            // Archives
            'zip', '7z',
            // Web/Data
            'html', 'htm', 'xml', 'json'
          ]
        }]
      });

      if (!selected) {
        setUploading(false);
        return;
      }

      // Upload the file
      const result = await invoke('upload_document', {
        filePath: selected
      });

      console.log('Upload result:', result);
      
      if (onUploadComplete) {
        onUploadComplete();
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.toString());
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-semibold">Upload Documents</h3>
      
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full px-4 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Select File'}
      </button>

      {/* Supported formats info */}
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2 font-semibold">Supported formats:</p>
        <div className="space-y-1">
          <p>📄 <strong>Documents:</strong> PDF, DOCX, PPTX, TXT, MD</p>
          <p>📊 <strong>Spreadsheets:</strong> XLSX, XLS, CSV</p>
          <p>🖼️ <strong>Images:</strong> JPG, PNG, BMP, TIFF, GIF</p>
          <p>🎵 <strong>Audio:</strong> MP3, WAV, M4A, FLAC, OGG</p>
          <p>🎬 <strong>Video:</strong> MP4, AVI, MOV, MKV</p>
          <p>📦 <strong>Archives:</strong> ZIP, 7Z</p>
          <p>🌐 <strong>Web/Data:</strong> HTML, XML, JSON</p>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          ⚠️ Audio/video files may take 2-5 minutes to process
        </p>
      </div>

      {error && (
        <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}