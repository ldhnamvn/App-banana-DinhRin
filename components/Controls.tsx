
import React from 'react';

interface ControlsProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    maintainConsistency: boolean;
    setMaintainConsistency: (value: boolean) => void;
    isImageUploaded: boolean;
}

const Controls: React.FC<ControlsProps> = ({
    prompt,
    setPrompt,
    isGenerating,
    onGenerate,
    maintainConsistency,
    setMaintainConsistency,
    isImageUploaded
}) => {
    return (
        <div className="flex flex-col gap-4">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., make the person wear sunglasses"
                rows={4}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder-slate-500 disabled:opacity-50"
                disabled={!isImageUploaded || isGenerating}
            />
            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    id="consistency"
                    checked={maintainConsistency}
                    onChange={(e) => setMaintainConsistency(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-600 focus:ring-offset-slate-800"
                    disabled={!isImageUploaded || isGenerating}
                />
                <label htmlFor="consistency" className="text-sm font-medium text-slate-300 select-none">
                    Maintain Character Consistency
                </label>
            </div>
            <button
                onClick={onGenerate}
                disabled={isGenerating || !isImageUploaded || !prompt.trim()}
                className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.5H3a1 1 0 000 2h1v1.5a1 1 0 002 0V6.5h1.5a1 1 0 000-2H6V3a1 1 0 00-1-1zM5.5 13.5A2.5 2.5 0 008 11V7.5a1 1 0 00-2 0V11a.5.5 0 01-1 0V7.5a1 1 0 00-2 0V11a2.5 2.5 0 002.5 2.5zM12 2a1 1 0 00-1 1v1.5h-1.5a1 1 0 100 2H11V8a1 1 0 102 0V6.5h1.5a1 1 0 100-2H13V3a1 1 0 00-1-1zM11.5 18a2.5 2.5 0 002.5-2.5v-3.5a1 1 0 10-2 0v3.5a.5.5 0 01-1 0v-3.5a1 1 0 10-2 0v3.5A2.5 2.5 0 0011.5 18z" clipRule="evenodd" />
                        </svg>
                        Generate Image
                    </>
                )}
            </button>
        </div>
    );
};

export default Controls;

