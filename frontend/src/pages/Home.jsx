import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [spotsLeft, setSpotsLeft] = useState(47);
  const [usersJoined, setUsersJoined] = useState(853);

  // Simulate spots decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft(prev => Math.max(15, prev - Math.floor(Math.random() * 2)));
      setUsersJoined(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-full text-sm font-bold mb-6 animate-pulse shadow-lg">
              <span>🔥</span>
              <span>70% OFF BETA - Only {spotsLeft} Spots Left!</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Stop Wasting 2 Hours Daily on Email
            </h1>
            <p className="text-2xl md:text-3xl mb-4 opacity-95 font-semibold">
              AI Assistant That Writes Your Replies Automatically
            </p>
            <p className="text-lg mb-8 opacity-90">
              <span className="text-yellow-300 font-bold text-2xl">$29 one-time</span>
              <span className="text-white/80 line-through ml-3">$99 regular price</span>
              <br/>
              Join {usersJoined} professionals saving 500+ hours with AI email automation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                to="/templates" 
                className="bg-yellow-400 text-black px-10 py-5 rounded-xl font-bold hover:bg-yellow-300 hover:scale-105 transition text-lg shadow-2xl"
              >
                Get 70% Off Now →
              </Link>
              <a 
                href="#how-it-works" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-10 py-5 rounded-xl font-semibold hover:bg-white/30 transition text-lg"
              >
                📖 Learn More
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div>
                <div className="text-4xl font-bold mb-1">{usersJoined}</div>
                <div className="text-sm opacity-90">Happy Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">15K+</div>
                <div className="text-sm opacity-90">Emails Automated</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">600+</div>
                <div className="text-sm opacity-90">Hours Saved</div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-2xl">✓</span>
                <span>One-time payment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-2xl">✓</span>
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-2xl">✓</span>
                <span>Complete privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof - Live Purchases */}
      <LivePurchaseBanner />

      {/* What It Does */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Inbox Overwhelm to Inbox Zero in Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your AI-powered email automation running entirely on your computer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureCard 
              icon="📥"
              title="Scans Your Inbox"
              description="Automatically checks for unread emails on your schedule. Never miss important messages."
              color="blue"
            />
            <FeatureCard 
              icon="🤖"
              title="AI Categorization"
              description="Uses GPT to categorize by priority: URGENT, HIGH, NORMAL, LOW. Know what needs attention."
              color="purple"
            />
            <FeatureCard 
              icon="✍️"
              title="Generates Replies"
              description="Creates 3 AI-powered draft replies for each email in different tones."
              color="green"
            />
            <FeatureCard 
              icon="✅"
              title="You Review & Send"
              description="Edit drafts and send with one click from the dashboard. Stay in control."
              color="orange"
            />
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/templates"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition"
            >
              Get Started - $29 →
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <PricingSection spotsLeft={spotsLeft} />

      {/* Social Proof - Testimonials */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Loved by Busy Professionals
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Real people, real time savings
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard 
              quote="Cut my email time from 2 hours to 20 minutes daily. Best $29 I ever spent."
              author="Sarah Chen"
              role="Product Manager"
              avatar="👩‍💼"
              rating={5}
            />
            <TestimonialCard 
              quote="Finally, an email tool that respects my privacy. No cloud servers means my client data stays secure."
              author="Michael Rodriguez"
              role="Privacy Lawyer"
              avatar="👨‍⚖️"
              rating={5}
            />
            <TestimonialCard 
              quote="The AI replies are better than what I'd write myself. Saved me $360/year vs Superhuman."
              author="Jessica Kim"
              role="Startup Founder"
              avatar="👩‍💻"
              rating={5}
            />
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable />

      {/* How It Works */}
      <HowItWorks />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <FinalCTA spotsLeft={spotsLeft} usersJoined={usersJoined} />
    </div>
  );
}

function LivePurchaseBanner() {
  const [currentPurchase, setCurrentPurchase] = useState(0);
  
  const purchases = [
    { name: "Sarah", location: "California", time: "3 minutes ago" },
    { name: "Michael", location: "New York", time: "7 minutes ago" },
    { name: "Jessica", location: "Texas", time: "12 minutes ago" },
    { name: "David", location: "Florida", time: "18 minutes ago" },
    { name: "Emma", location: "Washington", time: "25 minutes ago" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPurchase(prev => (prev + 1) % purchases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-500 text-white py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 animate-pulse">
          <span className="text-xl">🎉</span>
          <span className="font-semibold">
            {purchases[currentPurchase].name} from {purchases[currentPurchase].location} just purchased • {purchases[currentPurchase].time}
          </span>
        </div>
      </div>
    </div>
  );
}

function PricingSection({ spotsLeft }) {
  return (
    <div className="bg-white py-20" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Lock In Beta Pricing Forever
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Pay once, use forever. Price increases to $99 after {spotsLeft} spots fill.
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-10">
              <div className="text-center mb-8">
                <div className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg mb-4 animate-pulse">
                  🔥 70% OFF BETA PRICE
                </div>
                <h3 className="text-4xl font-bold mb-4">Email Assistant Pro</h3>
                <p className="text-gray-600 text-lg">Everything you need to automate email</p>
              </div>

              <div className="flex items-baseline justify-center gap-4 mb-8">
                <div className="text-7xl font-bold text-purple-600">$29</div>
                <div>
                  <p className="text-3xl text-gray-400 line-through">$99</p>
                  <p className="text-green-600 font-bold">Save $70 today</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">Unlimited email accounts</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">Full AI reply generation</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">Thread context understanding</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">Advanced analytics</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">Scheduled sending</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">Lifetime updates</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span className="text-gray-700">30-day money-back</span>
                </div>
              </div>

              <Link
                to="/templates"
                className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition mb-4"
              >
                Get 70% Off Now →
              </Link>

              <p className="text-center text-sm text-gray-500">
                ⚡ One-time payment • 🔒 Secure checkout • 🎉 Instant access
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-red-600 font-bold text-lg">
              ⏰ Price increases to $99 when beta ends (only {spotsLeft} spots left)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component definitions...
function FeatureCard({ icon, title, description, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role, avatar, rating }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl">★</span>
        ))}
      </div>
      <p className="text-gray-700 mb-6 text-lg italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="text-4xl">{avatar}</div>
        <div>
          <div className="font-bold text-gray-900">{author}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Why Choose GiggliAgents?
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Better features, better privacy, better price
        </p>
        
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="text-left py-6 px-6 font-bold text-lg">Feature</th>
                <th className="text-center py-6 px-6 font-bold text-lg">
                  <div className="text-2xl mb-2">🚀</div>
                  GiggliAgents
                </th>
                <th className="text-center py-6 px-6 font-semibold opacity-75">Superhuman</th>
                <th className="text-center py-6 px-6 font-semibold opacity-75">SaneBox</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <ComparisonRow feature="AI Reply Generation" us={true} competitor1={false} competitor2={false} />
              <ComparisonRow feature="Complete Privacy (Local)" us={true} competitor1={false} competitor2={false} />
              <ComparisonRow feature="Multi-Account Support" us={true} competitor1={true} competitor2={true} />
              <ComparisonRow feature="Email Categorization" us={true} competitor1={true} competitor2={true} />
              <ComparisonRow feature="Scheduled Sending" us={true} competitor1={true} competitor2={false} />
              <ComparisonRow feature="Analytics Dashboard" us={true} competitor1={false} competitor2={true} />
              <tr className="bg-purple-50">
                <td className="py-6 px-6 font-bold text-lg">Price</td>
                <td className="text-center py-6 px-6">
                  <div className="text-3xl font-bold text-green-600">$29</div>
                  <div className="text-sm text-gray-500">one-time</div>
                </td>
                <td className="text-center py-6 px-6">
                  <div className="text-2xl font-semibold text-gray-600">$30</div>
                  <div className="text-sm text-gray-500">per month</div>
                </td>
                <td className="text-center py-6 px-6">
                  <div className="text-2xl font-semibold text-gray-600">$29</div>
                  <div className="text-sm text-gray-500">per month</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-12">
          <div className="inline-block bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
            <p className="text-xl font-bold text-gray-900 mb-2">
              💰 Save $330+ per year compared to competitors
            </p>
            <p className="text-gray-600">One-time payment. No subscriptions. Lifetime updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ feature, us, competitor1, competitor2 }) {
  const CheckIcon = () => <span className="text-green-600 text-2xl font-bold">✓</span>;
  const CrossIcon = () => <span className="text-red-500 text-2xl font-bold">✗</span>;

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-5 px-6 font-medium text-gray-900">{feature}</td>
      <td className="text-center py-5 px-6 bg-green-50">
        {us ? <CheckIcon /> : <CrossIcon />}
      </td>
      <td className="text-center py-5 px-6">
        {competitor1 ? <CheckIcon /> : <CrossIcon />}
      </td>
      <td className="text-center py-5 px-6">
        {competitor2 ? <CheckIcon /> : <CrossIcon />}
      </td>
    </tr>
  );
}

function HowItWorks() {
  return (
    <div className="bg-white py-20" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Get Started in 5 Minutes
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          No technical skills required. Just download and go.
        </p>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <Step 
            number="1" 
            title="Purchase & Download" 
            description="Get your license key instantly. Download the desktop app for Windows, Mac, or Linux."
            time="1 min"
          />
          <Step 
            number="2" 
            title="Connect Your Email" 
            description="Secure OAuth connection to Gmail or Outlook. Your credentials never touch our servers."
            time="1 min"
          />
          <Step 
            number="3" 
            title="Add OpenAI API Key" 
            description="Get a free API key from OpenAI (first $5 of credits free). Paste it in settings."
            time="2 min"
          />
          <Step 
            number="4" 
            title="Click 'Run Now'" 
            description="Process your inbox instantly. Review AI-generated replies and send with one click."
            time="1 min"
          />
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/templates"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition"
          >
            Get Started - $29 →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, description, time }) {
  return (
    <div className="flex gap-6 items-start bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {time}
          </span>
        </div>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Everything you need to know
        </p>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem 
            question="Is my email data really safe?"
            answer="Absolutely. Everything runs on YOUR computer. Your emails never touch our servers. OAuth tokens are stored locally in an encrypted SQLite database. We can't access your data even if we wanted to - we have no servers to store it on!"
          />
          <FAQItem 
            question="What email providers are supported?"
            answer="Currently: Gmail, Outlook, Hotmail, and any IMAP provider. We're adding more providers based on user requests."
          />
          <FAQItem 
            question="Do I need technical skills?"
            answer="No! If you can download and install an app (like Zoom or Slack), you can use GiggliAgents. The setup wizard walks you through everything step-by-step."
          />
          <FAQItem 
            question="Can I customize the AI replies?"
            answer="Yes! You can edit any draft before sending, create custom templates with your own tone, and save frequently used responses. The AI learns from your edits over time."
          />
          <FAQItem 
            question="What happens after I purchase?"
            answer="Instant access! You'll receive your license key immediately and can download the app right away. Setup takes about 5 minutes total."
          />
          <FAQItem 
            question="How much does OpenAI cost?"
            answer="Most users spend $2-5/month on OpenAI API credits. New accounts get the first $5 free. That's about 1,000-2,000 emails processed. Way cheaper than $30/month subscriptions!"
          />
          <FAQItem 
            question="Can I use it on multiple computers?"
            answer="Yes! Your license key works on all your devices (Windows, Mac, Linux). Just install and enter your key on each device."
          />
          <FAQItem 
            question="What if I don't like it?"
            answer="We offer a 30-day money-back guarantee, no questions asked. But honestly, once you experience responding to 50 emails in 5 minutes, you won't want to go back."
          />
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
      >
        <span className="font-bold text-lg text-gray-900">{question}</span>
        <span className={`text-2xl text-purple-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-8 pb-6 text-gray-700 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

function FinalCTA({ spotsLeft, usersJoined }) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
      <div className="container mx-auto px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-full font-bold mb-6 animate-pulse">
            ⚡ LIMITED: Only {spotsLeft} Beta Spots Left
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Ready to Reclaim Your Time?
          </h2>
          <p className="text-2xl mb-4 opacity-95">
            Join {usersJoined} professionals saving 10+ hours per week
          </p>
          <p className="text-xl mb-10 opacity-90">
            Stop drowning in email. Start living your life.
          </p>
          
          <Link 
            to="/templates"
            className="inline-block bg-yellow-400 text-black px-12 py-5 rounded-xl font-bold text-xl hover:bg-yellow-300 hover:scale-105 transition shadow-2xl"
          >
            Get 70% Off - $29 Today →
          </Link>

          <p className="text-sm mt-6 opacity-75">
            Price increases to $99 when beta ends
          </p>

          <div className="flex items-center justify-center gap-6 text-sm flex-wrap mt-8">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span>30-day money-back</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span>Lifetime updates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span>No subscriptions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}