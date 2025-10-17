import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Checkout from './pages/Checkout';
import Download from './pages/Download';
import OAuthCallback from './pages/OAuthCallback';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgentBuilder from './pages/AgentBuilder';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/checkout/:templateId" element={<Checkout />} />
            <Route path="/download/:buildId" element={<Download />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/builder" element={<AgentBuilder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;