import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [spotsLeft] = useState(Math.floor(Math.random() * 30) + 30);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProductInfo = () => {
    return {
      name: 'Email Assistant Pro',
      icon: '📧',
      price: '$29',
      priceValue: 2900, // cents for Stripe
      originalPrice: '$99',
      discount: '70% OFF',
      savings: 'Save $70',
      description: 'Complete AI-powered email automation running on your computer',
      features: [
        'Unlimited email accounts',
        'Full AI reply generation',
        'Thread context understanding',
        'Advanced analytics dashboard',
        'Scheduled sending',
        'Priority email support',
        'Lifetime updates',
        '30-day money-back guarantee'
      ]
    };
  };

  const product = getProductInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      // Call your backend to create Stripe checkout session
      //const response = await fetch('http://localhost:8000/api/create-checkout-session', {
        const response = await fetch('http://localhost:8000/api/mock-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          template_id: templateId,
          price: product.priceValue
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment system temporarily unavailable. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Urgency Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl mb-8 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse">⚡</span>
              <div>
                <p className="font-bold text-lg">Limited Beta Spots Remaining!</p>
                <p className="text-sm opacity-90">Only {spotsLeft} spots left at this price</p>
              </div>
            </div>
            <div className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold text-2xl">
              {formatTime(countdown)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* What You're Getting - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Main Product Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-200">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{product.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold">{product.name}</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>
              
              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-6xl font-bold text-purple-600">{product.price}</div>
                <div>
                  <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                    {product.discount}
                  </div>
                  <p className="text-2xl text-gray-500 line-through">{product.originalPrice}</p>
                  <p className="text-lg text-green-600 font-semibold">{product.savings}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <p className="font-bold text-green-800 mb-2">💰 You're saving $70 today</p>
                <p className="text-sm text-green-700">Plus $330+ per year vs subscription competitors</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-xl mb-4">What's Included:</h3>
                <div className="space-y-3">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-green-600 text-xl mt-0.5">✓</span>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
              <h4 className="font-bold text-2xl flex items-center gap-3 mb-4">
                <span className="text-3xl">🔐</span>
                Privacy Guaranteed
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <PrivacyBadge icon="✓" text="Zero data collection" />
                <PrivacyBadge icon="✓" text="No cloud servers" />
                <PrivacyBadge icon="✓" text="Local encryption" />
                <PrivacyBadge icon="✓" text="Open source code" />
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-3">🛡️</div>
              <p className="text-2xl font-bold mb-2">30-Day Money-Back Guarantee</p>
              <p className="opacity-90">Not happy? Full refund. No questions asked.</p>
            </div>
          </div>

          {/* Sign Up Form - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">Secure Checkout</h2>
                <p className="text-gray-600">Join 800+ beta users</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block font-bold mb-2 text-gray-700">Your Name</label>
                  <input 
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-gray-700">Email Address</label>
                  <input 
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none text-lg"
                  />
                  <small className="text-gray-500 text-sm mt-1 block">For your license key and updates</small>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                  <h4 className="font-bold mb-3 text-sm text-gray-800">What Happens Next:</h4>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">1️⃣</span>
                      <span>Secure payment via Stripe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">2️⃣</span>
                      <span>Get unique license key instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">3️⃣</span>
                      <span>Download ready-made package</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">4️⃣</span>
                      <span>Install and start saving time!</span>
                    </li>
                  </ol>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:scale-100 transition"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-spin">⏳</span>
                      <span>Redirecting to checkout...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span>Continue to Secure Payment</span>
                      <span>→</span>
                    </span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">✓</span>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">✓</span>
                    <span>Instant access</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">✓</span>
                    <span>30-day refund</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Secure checkout powered by Stripe. Your payment information is encrypted and secure.
                </p>
              </form>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>🔒 SSL Secure</span>
                  <span>•</span>
                  <span>🛡️ GDPR</span>
                  <span>•</span>
                  <span>✓ PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">System Requirements</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <RequirementCard
              icon="💻"
              title="System"
              items={[
                'Windows, macOS, or Linux',
                '~100MB disk space',
                'Internet connection'
              ]}
            />
            <RequirementCard
              icon="📧"
              title="Email Account"
              items={[
                'Gmail or Outlook',
                'IMAP also supported',
                'Multi-account ready'
              ]}
            />
            <RequirementCard
              icon="🤖"
              title="AI Access"
              items={[
                'OpenAI API key',
                'First $5 credits free',
                '~$2-5/month typical'
              ]}
            />
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Join 800+ Beta Users</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <SocialProofCard
              quote="Setup took 3 minutes. Already saved 2 hours today."
              author="Sarah C."
            />
            <SocialProofCard
              quote="Best $29 I ever spent. Would gladly pay $100."
              author="Mike R."
            />
            <SocialProofCard
              quote="Finally, email doesn't stress me out anymore."
              author="Jessica K."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <span className="text-green-600 text-lg">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function RequirementCard({ icon, title, items }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <h4 className="font-bold text-lg mb-3">{title}</h4>
      <ul className="text-sm text-gray-600 space-y-2">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function SocialProofCard({ quote, author }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
      </div>
      <p className="text-gray-700 italic mb-2">"{quote}"</p>
      <p className="text-sm text-gray-600 font-semibold">— {author}</p>
    </div>
  );
}