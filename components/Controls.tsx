
import React from 'react';

interface ControlsProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    maintainConsistency: boolean;
    setMaintainConsistency: (value: boolean) => void;
    isImageUploaded: boolean;
    onRemoveBackground: () => void;
    isRemovingBg: boolean;
    brightness: number;
    setBrightness: (value: number) => void;
    contrast: number;
    setContrast: (value: number) => void;
}

const examplePrompts = [
    "Add sunglasses to the person.",
    "Change the background to a futuristic city.",
    "Make the shirt a vibrant red color.",
    "Give the person a pirate hat.",
    "Apply a vintage, black and white photo style.",
    "Surround them with floating magical orbs.",
];

const Controls: React.FC<ControlsProps> = ({
    prompt,
    setPrompt,
    isGenerating,
    onGenerate,
    maintainConsistency,
    setMaintainConsistency,
    isImageUploaded,
    onRemoveBackground,
    isRemovingBg,
    brightness,
    setBrightness,
    contrast,
    setContrast,
}) => {
    const handleResetAdjustments = () => {
        setBrightness(100);
        setContrast(100);
    };
    
    return (
        <div className="flex flex-col gap-4">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., make the person wear sunglasses"
                rows={4}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder-slate-500 disabled:opacity-50"
                disabled={!isImageUploaded || isGenerating || isRemovingBg}
                aria-label="Image editing prompt"
            />

            <div className="flex flex-col gap-3">
                 <p className="text-sm font-medium text-slate-400">Try an example:</p>
                 <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPrompt(p)}
                            disabled={!isImageUploaded || isGenerating || isRemovingBg}
                            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-cyan-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
                        >
                            {p}
                        </button>
                    ))}
                 </div>
            </div>
            
            <fieldset className="space-y-4 rounded-lg border border-slate-700 p-4 disabled:opacity-50" disabled={!isImageUploaded || isGenerating || isRemovingBg}>
                <legend className="px-2 text-md font-semibold text-slate-300">Adjustments</legend>
                
                <div className="flex flex-col">
                    <div className="flex justify-between text-sm">
                        <label htmlFor="brightness" className="font-medium text-slate-400">Brightness</label>
                        <span className="font-mono text-cyan-400">{brightness}%</span>
                    </div>
                    <input 
                        type="range" 
                        id="brightness" 
                        min="0" max="200" 
                        value={brightness} 
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        aria-label="Brightness"
                    />
                </div>
                
                <div className="flex flex-col">
                    <div className="flex justify-between text-sm">
                        <label htmlFor="contrast" className="font-medium text-slate-400">Contrast</label>
                        <span className="font-mono text-cyan-400">{contrast}%</span>
                    </div>
                    <input 
                        type="range" 
                        id="contrast" 
                        min="0" max="200" 
                        value={contrast} 
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        aria-label="Contrast"
                    />
                </div>

                {(brightness !== 100 || contrast !== 100) && (
                    <button 
                        onClick={handleResetAdjustments} 
                        className="w-full text-xs text-slate-400 hover:text-cyan-400 transition-colors py-1 rounded-md hover:bg-slate-700/50"
                    >
                        Reset Adjustments
                    </button>
                )}
            </fieldset>

             <button
                onClick={onRemoveBackground}
                disabled={isRemovingBg || isGenerating || !isImageUploaded}
                className="w-full flex items-center justify-center bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500"
            >
                {isRemovingBg ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Removing...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M5.5 2a.5.5 0 00-.5.5v1.75a.75.75 0 01-1.5 0V2.5a2 2 0 012-2h11a2 2 0 012 2v11a2 2 0 01-2 2H8.25a.75.75 0 010-1.5H16a.5.5 0 00.5-.5V2.5a.5.5 0 00-.5-.5h-11z" clipRule="evenodd" />
                           <path fillRule="evenodd" d="M2 7.5a1 1 0 011-1h6.5a1 1 0 010 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
                           <path fillRule="evenodd" d="M2 11.5a1 1 0 011-1h3.5a1 1 0 010 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
                           <path fillRule="evenodd" d="M11.246 13.51a.75.75 0 01.194.522l.333 4.5a.75.75 0 01-1.496.11l-.333-4.5a.75.75 0 011.302-.632z" clipRule="evenodd" />
                        </svg>
                        Remove Background
                    </>
                )}
            </button>

            <div className="flex items-center space-x-3 mt-2">
                <input
                    type="checkbox"
                    id="consistency"
                    checked={maintainConsistency}
                    onChange={(e) => setMaintainConsistency(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-600 focus:ring-offset-slate-800"
                    disabled={!isImageUploaded || isGenerating || isRemovingBg}
                />
                <label htmlFor="consistency" className="text-sm font-medium text-slate-300 select-none">
                    Maintain Character Consistency
                </label>
            </div>
            <button
                onClick={onGenerate}
                disabled={isGenerating || isRemovingBg || !isImageUploaded || !prompt.trim()}
                className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 mt-2"
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
