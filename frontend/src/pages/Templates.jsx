import { useState } from 'react';
import { Link } from 'react-router-dom';

const AVAILABLE_TEMPLATES = [
  {
    id: 'email_assistant',
    name: 'Email Assistant Pro',
    icon: '📧',
    tagline: 'AI-Powered Email Automation',
    description: 'Stop wasting 2 hours daily on email. Automatically categorize emails and generate intelligent replies using AI. All processing happens on your computer for complete privacy.',
    price: '$29',
    originalPrice: '$99',
    savings: 'Save $70 today',
    discount: '70% OFF',
    status: 'available',
    popular: true,
    features: [
      'Gmail & Outlook OAuth integration',
      'AI email categorization (URGENT/HIGH/NORMAL/LOW)',
      'Generate 3 AI reply drafts per email',
      'Edit and send from desktop dashboard',
      'Multi-account support (unlimited)',
      'Schedule emails for later',
      'Advanced analytics & tracking',
      'Saved drafts management',
      'Reply history with search',
      'Smart filters (skip promotions/newsletters)',
      'Run manually or on auto-schedule',
      'Morning email briefings with AI summaries',
      'Thread context understanding',
      '100% local - no cloud processing',
      'Lifetime updates included',
      '30-day money-back guarantee'
    ],
    testimonial: {
      quote: "Cut my email time from 2 hours to 20 minutes daily. Best $29 I ever spent.",
      author: "Sarah Chen, Product Manager"
    }
  }
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [spotsLeft] = useState(Math.floor(Math.random() * 30) + 30); // 30-60

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Beta Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl mb-8 text-center font-bold shadow-lg animate-pulse">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-2xl">🔥</span>
            <span className="text-lg">70% OFF BETA PRICING - Only {spotsLeft} Spots Remaining!</span>
            <span className="text-2xl">🔥</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Get Your AI Email Assistant
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Professional-grade email automation for just $29
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
            <span className="text-xl">✓</span>
            <span>One-time payment • 5-minute setup • Instant access</span>
          </div>
        </div>

        {/* Main Template Card */}
        <div className="max-w-5xl mx-auto mb-16">
          <TemplateCard
            template={AVAILABLE_TEMPLATES[0]}
            onSelect={() => setSelectedTemplate(AVAILABLE_TEMPLATES[0])}
            spotsLeft={spotsLeft}
          />
        </div>

        {/* Custom Agent Builder CTA */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-white text-center mb-16">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
            <div className="absolute top-20 right-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10">
            <div className="text-7xl mb-6">🎨</div>
            <h2 className="text-4xl font-bold mb-4">Need Something Custom?</h2>
            <p className="text-xl mb-4 opacity-95">
              Build your own agent with our visual workflow builder
            </p>
            <p className="text-lg mb-8 opacity-90">
              Drag & drop modules, customize behavior, deploy in minutes
            </p>
            <Link
              to="/builder"
              className="inline-block bg-white text-purple-600 px-10 py-5 rounded-xl font-bold text-xl hover:scale-105 hover:shadow-2xl transition"
            >
              Build Custom Agent →
            </Link>
            <p className="text-sm mt-4 opacity-75">
              ✨ No coding required • Unlimited possibilities • $49 one-time
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Why GiggliAgents?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <WhyChooseCard
              icon="🔐"
              title="Complete Privacy"
              description="All processing happens on your computer. Your data never touches our servers. GDPR & HIPAA friendly."
            />
            <WhyChooseCard
              icon="💰"
              title="One-Time Payment"
              description="$29 one-time vs $360/year for competitors. No subscriptions. Lifetime updates included."
            />
            <WhyChooseCard
              icon="⚡"
              title="AI-Powered"
              description="Uses GPT-4 for intelligent replies. Learns from your style. Gets better over time."
            />
            <WhyChooseCard
              icon="🎯"
              title="Multi-Account"
              description="Connect unlimited Gmail, Outlook, and IMAP accounts. Manage everything in one dashboard."
            />
            <WhyChooseCard
              icon="📊"
              title="Analytics Built-in"
              description="Track email volume, response times, and productivity gains. Beautiful charts included."
            />
            <WhyChooseCard
              icon="🚀"
              title="5-Minute Setup"
              description="Download, connect email, add API key, done. No technical skills required."
            />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <TrustBadge icon="🔒" text="256-bit Encryption" />
            <TrustBadge icon="🛡️" text="GDPR Compliant" />
            <TrustBadge icon="✓" text="Open Source" />
            <TrustBadge icon="💯" text="30-Day Guarantee" />
          </div>
        </div>
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}

function TemplateCard({ template, onSelect, spotsLeft }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ring-4 ring-purple-500">
      {/* Popular Badge */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-center font-bold text-sm">
        ⭐ MOST POPULAR - {spotsLeft} Spots Left
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">{template.icon}</span>
          <div>
            <h3 className="text-3xl font-bold">{template.name}</h3>
            <p className="text-purple-100 text-lg">{template.tagline}</p>
          </div>
        </div>
        
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-6xl font-bold">{template.price}</span>
          <div>
            <span className="text-2xl line-through opacity-60">{template.originalPrice}</span>
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block ml-2">
              {template.discount}
            </div>
          </div>
        </div>
        <p className="text-yellow-300 font-bold text-lg">{template.savings}</p>
      </div>

      {/* Content */}
      <div className="p-8">
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          {template.description}
        </p>

        {/* Testimonial */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-gray-700 italic mb-2">"{template.testimonial.quote}"</p>
          <p className="text-sm text-gray-600 font-semibold">— {template.testimonial.author}</p>
        </div>

        {/* Features Preview */}
        <div className="mb-6">
          <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Everything Included:
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {template.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-gray-700">
                <span className="text-green-600 mt-0.5 text-lg flex-shrink-0">✓</span>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/checkout/${template.id}`}
          className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-5 rounded-xl font-bold text-xl hover:shadow-xl hover:scale-105 transition mb-4"
        >
          Get 70% Off - $29 Today →
        </Link>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            ⚡ Instant access • 🔒 Secure checkout • 💯 30-day money-back
          </p>
          <p className="text-red-600 font-semibold text-sm">
            ⏰ Price increases to $99 after {spotsLeft} spots fill
          </p>
        </div>
      </div>
    </div>
  );
}

function TemplateModal({ template, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-10 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="text-7xl">{template.icon}</span>
              <div>
                <h2 className="text-4xl font-bold mb-2">{template.name}</h2>
                <p className="text-purple-100 text-xl">{template.tagline}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                    {template.price}
                  </span>
                  <span className="text-lg line-through opacity-75">{template.originalPrice}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-3 transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-10">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            {template.description}
          </p>

          {/* Testimonial */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-purple-500 p-6 mb-8 rounded-lg">
            <p className="text-gray-800 text-lg italic mb-3">"{template.testimonial.quote}"</p>
            <p className="text-gray-600 font-semibold">— {template.testimonial.author}</p>
          </div>

          <h3 className="text-3xl font-bold mb-6">Complete Feature List</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {template.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                <span className="text-green-600 text-2xl mt-0.5">✓</span>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Savings Highlight */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 mb-8 text-center">
            <p className="text-2xl font-bold mb-2">💰 {template.savings}</p>
            <p className="opacity-90">One-time payment. No subscriptions. Ever.</p>
          </div>

          <Link
            to={`/checkout/${template.id}`}
            className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-5 rounded-xl font-bold text-2xl hover:shadow-2xl hover:scale-105 transition"
          >
            Get {template.name} - {template.price} →
          </Link>
          <p className="text-center text-gray-500 mt-4">
            ⚡ Instant access • 🔒 Secure • 💯 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

function WhyChooseCard({ icon, title, description }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h4 className="font-bold text-xl mb-3">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TrustBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-gray-700">{text}</span>
    </div>
  );
}