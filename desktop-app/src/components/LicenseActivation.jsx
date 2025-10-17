import React, { useState } from 'react';

export default function LicenseActivation({ onActivated }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    
    // For now, auto-approve (you'll add real license validation later)
    setTimeout(() => {
      onActivated({
        valid: true,
        email: email,
        tier: 'pro'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-12 bg-white shadow-2xl rounded-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">🧠</div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            RAG Assistant
          </h1>
          <p className="text-gray-600">
            Your Private AI Knowledge Base
          </p>
        </div>

        <form onSubmit={handleActivate} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 text-lg font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Activating...' : 'Activate License'}
          </button>
        </form>

        <div className="pt-8 mt-8 text-sm text-center text-gray-600 border-t border-gray-200">
          <p>✨ One-time payment • No subscription</p>
          <p className="mt-2">🔒 100% private • Works offline</p>
        </div>
      </div>
    </div>
  );
}