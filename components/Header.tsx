
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-800/50 border-b border-slate-700 shadow-lg sticky top-0 z-10 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M16.5 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-2.5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.85 0 1.67-.11 2.44-.31-.77-1.03-1.22-2.3-1.22-3.69 0-3.31 2.69-6 6-6 .34 0 .67.03 1 .08V12c0-4.42-3.58-8-8-8z" />
                         </svg>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                            Nano <span className="text-yellow-300">Banana</span> Studio
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
