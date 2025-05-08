import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
            <div className="text-center space-y-8">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-24 w-24 text-sky-400 mx-auto animate-pulse"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>

                <h1 
                    className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500"
                >
                    404
                </h1>
                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-200">
                    Oops! Page Not Found
                </h2>
                <p className="text-lg sm:text-xl text-slate-400 max-w-md mx-auto">
                    It seems you've ventured into uncharted territory. 
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div>
                    <Link
                        to="/"
                        className="inline-block px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
                    >
                        Go Back Home
                    </Link>
                </div>
                <p className="text-sm text-slate-500 mt-12">
                    If you believe this is an error, please <a href="mailto:support@example.com" className="text-sky-400 hover:underline">contact support</a>.
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;