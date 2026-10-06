import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmailGenerator from './pages/EmailGenerator';
import ReportGenerator from './pages/ReportGenerator';
import TechnicalExplainer from './pages/TechnicalExplainer';
import TextImprover from './pages/TextImprover';
import PromptGenerator from './pages/PromptGenerator';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Home';
      case '/email': return 'Email Generator Mode';
      case '/report': return 'Report Generator Mode';
      case '/explain': return 'Technical Explainer Mode';
      case '/improve': return 'Text Improver Mode';
      case '/prompt': return 'Prompt Generator Mode';
      case '/history': return 'Generation History';
      case '/settings': return 'System Settings';
      case '/about': return 'About Project';
      default: return 'GenAI Content Studio';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          title={getPageTitle()} 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/email" element={<EmailGenerator />} />
            <Route path="/report" element={<ReportGenerator />} />
            <Route path="/explain" element={<TechnicalExplainer />} />
            <Route path="/improve" element={<TextImprover />} />
            <Route path="/prompt" element={<PromptGenerator />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
