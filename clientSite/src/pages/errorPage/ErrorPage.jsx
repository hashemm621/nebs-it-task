import { Link } from 'react-router';
import { TriangleAlert, Home, ArrowLeft } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl mx-auto text-center">
          
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-error/20 rounded-full blur-xl animate-ping"></div>
            <div className="relative bg-base-100 p-6 rounded-full shadow-2xl border border-error/20">
              <TriangleAlert size={80} className="text-error animate-bounce" />
            </div>
          </div>

          <h1 className="text-9xl font-black text-base-content/10 absolute left-0 right-0 top-1/2 -translate-y-1/2 select-none z-[-1]">
            404
          </h1>
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-base-content/70 max-w-md mx-auto">
              Sorry, the page you are looking for could not be found. It may have been deleted or the URL is incorrect.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            
            <Link to="/" className="btn btn-primary gap-2 shadow-lg shadow-primary/30">
              <Home size={18} />
              Back to Home
            </Link>
          </div>

        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 text-center text-base-content/30 text-sm">
        &copy; {new Date().getFullYear()} Nebs-IT Assessment. All rights reserved.
      </div>
    </div>
  );
};

export default ErrorPage;