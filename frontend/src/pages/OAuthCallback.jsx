// frontend/src/pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('oauth_success');
    const userEmail = searchParams.get('user_email');
    const error = searchParams.get('error');

    if (window.opener) {
      // Send message to parent window
      if (success === 'true' && sessionId) {
        window.opener.postMessage({
          type: 'oauth_success',
          session_id: sessionId,
          user_email: userEmail
        }, window.location.origin);
      } else if (error) {
        window.opener.postMessage({
          type: 'oauth_error',
          error: error
        }, window.location.origin);
      }

      // Close popup after 500ms
      setTimeout(() => {
        window.close();
      }, 500);
    } else {
      // If not in popup, redirect to home
      window.location.href = '/';
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-800">Authorization Complete!</h2>
        <p className="text-gray-600 mt-2">Closing window...</p>
      </div>
    </div>
  );
}