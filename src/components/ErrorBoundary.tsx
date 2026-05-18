import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950 mb-3">কিছু একটা সমস্যা হয়েছে</h2>
            <p className="text-emerald-700 font-medium mb-8 leading-relaxed">
              অ্যাপ লোড করতে সমস্যা হয়েছে। পেজটি রিফ্রেশ করুন অথবা পরে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-950 text-white font-bold px-8 py-3 rounded-2xl hover:bg-emerald-900 transition-all shadow-lg"
            >
              পেজ রিফ্রেশ করুন
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
