'use client';

import { useEffect, useState } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export default function PwaSetup() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function (err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }

    // Detect if device is iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Detect if app is already installed (running in standalone mode)
    const isStandalone = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://')
      );
    };

    // Show prompt if iOS and not installed
    if (isIos() && !isStandalone()) {
      // Check if we already showed it recently
      const hasSeenPrompt = localStorage.getItem('hasSeenPwaPrompt');
      if (!hasSeenPrompt) {
        // Delay showing prompt so it's not immediate
        const timer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setShowInstallPrompt(false);
    // Remember that user dismissed it so we don't spam them immediately
    localStorage.setItem('hasSeenPwaPrompt', 'true');
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-[390px] mx-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 relative">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X size={16} />
        </button>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <img src="/apple-icon.png" alt="App Icon" className="w-12 h-12 rounded-xl shadow-sm" />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="font-semibold text-gray-900 text-sm">Install Smart Campus</h3>
            <p className="text-xs text-gray-500 mt-1">
              Add to home screen to use offline and get full app experience.
            </p>
          </div>
        </div>
        
        <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-700 space-y-2">
          <div className="flex items-center gap-2">
            <span>1. Tap the Share button</span>
            <Share size={14} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <span>2. Scroll down and tap "Add to Home Screen"</span>
            <PlusSquare size={14} className="text-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
