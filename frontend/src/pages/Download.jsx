import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

export default function Download() {
  const { buildId } = useParams(); // This will be Stripe session ID
  const location = useLocation();
  
  const [buildStatus, setBuildStatus] = useState('verifying');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [licenseKey, setLicenseKey] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState(null);
const [spotsLeft] = useState(Math.floor(Math.random() * 50) + 50);
  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      setBuildStatus('verifying');
      
      // Verify payment with backend
      //const response = await fetch(`http://localhost:8000/api/verify-payment/${buildId}`);
      const response = await fetch(`http://localhost:8000/api/mock-verify/${buildId}`);
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      
      if (data.success) {
        setLicenseKey(data.license_key);
        setCustomerEmail(data.email);
        setCustomerName(data.name);
        setBuildStatus('completed');
        
        // Set download URL (you can host the app package on your server or S3)
        // setDownloadUrl(`http://localhost:8000/api/downloads/file/windows/GiggliAgents-1.0.0-windows.exe`);  // ✅ Correct!
         setDownloadUrl(`http://localhost:8000/api/downloads/file/windows/GiggliAgents-1.0.0-windows.zip`);
      } else {
        throw new Error('Payment not confirmed');
      }
      
    } catch (err) {
      console.error('Verification error:', err);
      setError('Unable to verify payment. Please contact support with your order ID: ' + buildId);
      setBuildStatus('failed');
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const sendEmailWithLicense = async () => {
    try {
      await fetch('http://localhost:8000/api/send-license-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          name: customerName,
          license_key: licenseKey
        })
      });
      alert('Email sent! Check your inbox.');
    } catch (error) {
      alert('Failed to send email. Please save your license key manually.');
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container max-w-5xl px-4 mx-auto">
        
        {/* Verifying Payment */}
        {buildStatus === 'verifying' && (
          <div className="py-20 text-center">
            <div className="mb-8 animate-spin text-8xl">⏳</div>
            <h1 className="mb-4 text-4xl font-bold">Verifying Your Payment...</h1>
            <p className="text-xl text-gray-600">Please wait while we confirm your purchase</p>
          </div>
        )}

        {/* Payment Failed */}
        {buildStatus === 'failed' && (
          <div className="py-20 text-center">
            <div className="mb-8 text-8xl">❌</div>
            <h1 className="mb-4 text-4xl font-bold text-red-600">Payment Verification Failed</h1>
            <p className="mb-8 text-xl text-gray-600">{error}</p>
            <Link 
              to="/templates"
              className="inline-block px-8 py-4 font-bold text-white transition bg-purple-600 rounded-xl hover:bg-purple-700"
            >
              Try Again
            </Link>
          </div>
        )}

        {/* Success - Show License & Download */}
        {buildStatus === 'completed' && licenseKey && (
          <>
            {/* Success Header */}
            <div className="mb-10 text-center">
              <div className="inline-block px-6 py-3 mb-6 text-lg font-bold text-white bg-green-500 rounded-full animate-bounce">
                ✓ PURCHASE CONFIRMED
              </div>
              <div className="mb-6 text-7xl">🎉</div>
              <h1 className="mb-4 text-5xl font-bold">
                Welcome to GiggliAgents!
              </h1>
              <p className="mb-2 text-2xl text-gray-600">
                Hey {customerName}! Your Email Assistant is ready.
              </p>
              <p className="text-gray-500">
                You're now part of an exclusive group of 800+ users 🚀
              </p>
            </div>

            {/* License Key Card - MOST IMPORTANT */}
            <div className="p-8 mb-8 text-white shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-3 text-3xl font-bold">
                  <span>🔑</span>
                  <span>Your License Key</span>
                </h2>
                <button
                  onClick={sendEmailWithLicense}
                  className="px-4 py-2 text-sm font-semibold text-purple-600 transition bg-white rounded-lg hover:bg-gray-100"
                >
                  📧 Email Me
                </button>
              </div>
              
              <div className="p-6 mb-4 border-2 bg-white/10 backdrop-blur-sm border-white/30 rounded-xl">
                <div className="mb-3 font-mono text-2xl text-center break-all">
                  {licenseKey}
                </div>
                <button
                  onClick={() => copyToClipboard(licenseKey)}
                  className="w-full px-4 py-2 font-semibold text-white transition rounded-lg bg-white/20 hover:bg-white/30"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
              
              <div className="p-4 border rounded-lg bg-yellow-400/20 border-yellow-400/50">
                <p className="text-sm text-yellow-100">
                  <strong>⚡ SAVE THIS!</strong> You'll need it to activate the desktop app. 
                  We've also sent it to <strong>{customerEmail}</strong>
                </p>
              </div>
            </div>

            {/* Download Section */}
            <div className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
              <h2 className="flex items-center gap-3 mb-6 text-3xl font-bold">
                <span>📦</span>
                <span>Download Your App</span>
              </h2>

              <div className="py-8 text-center">
                <div className="mb-6 text-6xl">✅</div>
                <h3 className="mb-4 text-3xl font-bold text-green-600">Ready to Download!</h3>
                <p className="mb-8 text-xl text-gray-600">Your Email Assistant is ready for installation</p>
                
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-3 px-16 py-6 mb-6 text-2xl font-bold text-white transition bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl hover:shadow-2xl hover:scale-105"
                >
                  <span>🔥</span>
                  <span>Download Now</span>
                  <span>→</span>
                </button>
                
                <p className="mb-8 text-gray-500">
                  ZIP file (~50MB) • Includes full app & instructions
                </p>

                {/* Platform-specific downloads */}
                <div className="grid max-w-3xl gap-4 mx-auto md:grid-cols-3">
                  <PlatformCard
                    icon="🪟"
                    name="Windows"
                    version="Windows 10+"
                    onClick={handleDownload}
                  />
                  <PlatformCard
                    icon="🍎"
                    name="macOS"
                    version="macOS 11+"
                    onClick={handleDownload}
                  />
                  <PlatformCard
                    icon="🐧"
                    name="Linux"
                    version="Ubuntu 20.04+"
                    onClick={handleDownload}
                  />
                </div>
              </div>

              <div className="p-6 mt-8 border-2 border-yellow-300 bg-yellow-50 rounded-xl">
                <p className="mb-2 font-semibold text-yellow-800">
                  📌 Quick Start After Download:
                </p>
                <ol className="space-y-1 text-sm text-yellow-700">
                  <li>1. Extract the ZIP file to any folder</li>
                  <li>2. Run the installer executable</li>
                  <li>3. Launch the app and enter your license key</li>
                  <li>4. Connect your Gmail/Outlook account</li>
                  <li>5. Add your OpenAI API key in settings</li>
                  <li>6. Click "Run Now" and watch the magic! ✨</li>
                </ol>
              </div>
            </div>

            {/* What's Next */}
            <div className="p-10 mb-8 text-white shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
              <h2 className="mb-6 text-3xl font-bold text-center">🚀 What's Next?</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <NextStep 
                  number="1"
                  text="Download and extract ZIP file"
                  icon="📦"
                />
                <NextStep 
                  number="2"
                  text="Install the application"
                  icon="⚙️"
                />
                <NextStep 
                  number="3"
                  text="Enter your license key"
                  icon="🔑"
                />
                <NextStep 
                  number="4"
                  text="Connect Gmail/Outlook via OAuth"
                  icon="📧"
                />
                <NextStep 
                  number="5"
                  text="Add OpenAI API key (get free $5 credits)"
                  icon="🤖"
                />
                <NextStep 
                  number="6"
                  text="Start automating your emails!"
                  icon="✨"
                />
              </div>
            </div>

            {/* Support Section */}
            <div className="p-8 mb-8 bg-white shadow-lg rounded-2xl">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold">Need Help Getting Started?</h3>
                <p className="mb-6 text-gray-600">
                  We're here to help you succeed
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a 
                    href="https://docs.giggliagents.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 font-semibold text-blue-700 transition bg-blue-100 rounded-lg hover:bg-blue-200"
                  >
                    📚 Setup Guide
                  </a>
                  <a 
                    href="https://discord.gg/giggliagents" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 font-semibold text-purple-700 transition bg-purple-100 rounded-lg hover:bg-purple-200"
                  >
                    💬 Join Discord
                  </a>
                  <a 
                    href="mailto:support@giggliagents.com"
                    className="px-6 py-3 font-semibold text-green-700 transition bg-green-100 rounded-lg hover:bg-green-200"
                  >
                    ✉️ Email Support
                  </a>
                </div>
              </div>
            </div>

            {/* Video Tutorial */}
            <div className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <h3 className="mb-4 text-2xl font-bold text-center">📹 Watch: 5-Minute Setup Tutorial</h3>
              <div className="flex items-center justify-center bg-gray-800 aspect-video rounded-xl">
                <div className="text-center text-white">
                  <div className="mb-4 text-6xl">▶️</div>
                  <p className="text-xl">Setup video coming soon!</p>
                  <p className="mt-2 text-sm opacity-75">In the meantime, follow the written guide above</p>
                </div>
              </div>
            </div>

            {/* Share the Love */}
            <div className="p-8 text-center border-2 border-purple-200 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
              <h3 className="mb-3 text-2xl font-bold">Love It? Share It! ❤️</h3>
              <p className="mb-6 text-gray-600">
                Help us spread the word and get more beta users
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ShareButton 
                  platform="Twitter" 
                  icon="🐦"
                  url={`https://twitter.com/intent/tweet?text=Just got GiggliAgents - AI email automation for $29! Saving me 2+ hours daily. Still ${spotsLeft} beta spots left: https://giggliagents.com`}
                />
                <ShareButton 
                  platform="LinkedIn" 
                  icon="💼"
                  url={`https://www.linkedin.com/sharing/share-offsite/?url=https://giggliagents.com`}
                />
                <ShareButton 
                  platform="Facebook" 
                  icon="👍"
                  url={`https://www.facebook.com/sharer/sharer.php?u=https://giggliagents.com`}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PlatformCard({ icon, name, version, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-6 text-center transition bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg"
    >
      <div className="mb-3 text-5xl">{icon}</div>
      <h4 className="mb-1 text-lg font-bold">{name}</h4>
      <p className="text-sm text-gray-600">{version}</p>
    </button>
  );
}

function NextStep({ number, text, icon }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-white/20">
        {number}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{text}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

function ShareButton({ platform, icon, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-6 py-3 font-semibold transition bg-white rounded-lg hover:shadow-lg"
    >
      <span className="text-2xl">{icon}</span>
      <span>{platform}</span>
    </a>
  );
}