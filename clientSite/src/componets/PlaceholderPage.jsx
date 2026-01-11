import React from 'react';
import { Construction, ArrowLeft, Cog } from 'lucide-react';
import { useNavigate } from 'react-router';

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50/50 border border-white">
      
      {/* Background Decorative Elements - Live Feel */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-2xl px-6 py-12 md:py-20 flex flex-col items-center text-center">
        
        {/* Animated Icon Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping"></div>
          <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-orange-100 border border-orange-50 flex items-center justify-center">
            <div className="relative">
              <Construction size={56} className="text-primary z-10 relative" />
              <Cog 
                size={24} 
                className="text-primary/40 absolute -top-2 -right-2 animate-spin" 
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3 md:space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-orange-100 text-primary text-xs font-bold tracking-wider uppercase">
            Coming Soon
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-accent tracking-tight">
            {title || "Feature"}
          </h2>
          <p className="text-paragraph text-sm md:text-lg max-w-md mx-auto leading-relaxed">
            We are working on this feature. It will be live on your dashboard very soon. Until then, thanks for sticking with us!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline border-gray-200 text-accent hover:bg-gray-50 hover:border-gray-300 gap-2 w-full sm:w-auto px-8 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary shadow-lg shadow-orange-200 gap-2 w-full sm:w-auto px-8 transition-all active:scale-95"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Subtle Bottom Watermark */}
      <div className="absolute bottom-6 text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">
        System Under Maintenance &bull; Nebs-IT
      </div>
    </div>
  );
};

export default PlaceholderPage;