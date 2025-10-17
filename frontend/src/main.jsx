import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
 
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-4">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingComponent />}>
      <App />
    </Suspense>
  </StrictMode>,
)