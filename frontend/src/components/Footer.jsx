import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl">🤖</span>
              <span className="font-bold text-2xl">GiggliAgents</span>
            </div>
            <p className="text-gray-400 mb-4">
              Privacy-first AI email automation. Save 10+ hours per week.
            </p>
            <div className="flex gap-4">
              <SocialIcon href="https://twitter.com/giggli" icon="🐦" />
              <SocialIcon href="https://linkedin.com/company/giggli" icon="💼" />
              <SocialIcon href="https://github.com/giggli" icon="💻" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-lg mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/templates" className="hover:text-white transition">Templates</Link></li>
              <li><Link to="/builder" className="hover:text-white transition">Agent Builder</Link></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://docs.giggli.com" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="mailto:hello@giggli.com" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 GiggliAgents. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                <span>Beta v1.0</span>
              </span>
              <span>•</span>
              <span>847 active users</span>
              <span>•</span>
              <span>12K+ emails processed</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-xl transition"
    >
      {icon}
    </a>
  );
}