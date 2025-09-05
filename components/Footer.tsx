
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-800/50 border-t border-slate-700 mt-auto">
            <div className="container mx-auto py-4 px-6 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} Nano Banana Studio. Powered by Google Gemini.</p>
            </div>
        </footer>
    );
};

export default Footer;
