
import React, { useState, useEffect, useCallback } from 'react';
import { Direction } from './types';

// Helper Component: Icon for the direction button
const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);

// Helper Component: Display for parsing errors
interface ErrorDisplayProps {
  message: string | null;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="text-center text-red-400 text-sm p-2 bg-red-900/20 rounded-md border border-red-500/30">
      <p>{message}</p>
    </div>
  );
};

// Helper Component: The dynamic direction button
interface DirectionButtonProps {
  direction: Direction;
}
const DirectionButton: React.FC<DirectionButtonProps> = ({ direction }) => {
  const rotationClass =
    direction === Direction.LEFT_TO_RIGHT
      ? 'rotate-90 md:rotate-0'
      : '-rotate-90 md:rotate-180';

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 bg-cyan-500/20 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <button
          aria-label="Conversion Direction"
          className="relative z-10 w-14 h-14 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-900/50 transition-all duration-300 ease-in-out"
        >
          <ArrowIcon className={`w-8 h-8 transition-transform duration-500 ease-out ${rotationClass}`} />
        </button>
      </div>
    </div>
  );
};

// Helper Component: Styled text area
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <textarea
      {...props}
      className="w-full h-full p-6 bg-gray-900 text-gray-300 rounded-2xl border-2 border-gray-700 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/30 transition-all duration-300 resize-none placeholder-gray-500 shadow-inner shadow-black/30"
    />
  );
};


// Main App Component
export default function App() {
  const [leftText, setLeftText] = useState<string>('"## Welcome!\\n\\nThis is a demo of a JSON-escaped string with Markdown.\\n\\n- Type here to see the conversion.\\n- Newlines are escaped as `\\\\n`.\\n- Quotes are escaped as `\\\\"`."');
  const [rightText, setRightText] = useState<string>('');
  const [direction, setDirection] = useState<Direction>(Direction.LEFT_TO_RIGHT);
  const [error, setError] = useState<string | null>(null);

  const handleLeftFocus = useCallback(() => setDirection(Direction.LEFT_TO_RIGHT), []);
  const handleRightFocus = useCallback(() => setDirection(Direction.RIGHT_TO_LEFT), []);
  
  // Effect for Left -> Right conversion
  useEffect(() => {
    if (direction !== Direction.LEFT_TO_RIGHT) return;
    
    if (leftText.trim() === '') {
      setRightText('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(leftText);
      if (typeof parsed === 'string') {
        setRightText(parsed);
        setError(null);
      } else {
        throw new Error('Input is a valid JSON but not a string.');
      }
    } catch (e) {
      setError('Invalid JSON format. Input must be a valid JSON-encoded string (e.g., wrapped in double quotes).');
      // Do not clear right text on error, so user can see last valid state
    }
  }, [leftText, direction]);

  // Effect for Right -> Left conversion
  useEffect(() => {
    if (direction !== Direction.RIGHT_TO_LEFT) return;
    
    const stringified = JSON.stringify(rightText);
    setLeftText(stringified);
    setError(null); // This operation should not fail
  }, [rightText, direction]);


  return (
    <main className="min-h-screen w-full bg-gray-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-7xl flex-1 flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-0 my-4">
        
        {/* Left/Top Panel */}
        <div className="flex-1 flex flex-col min-h-[300px] md:min-h-0">
          <label htmlFor="json-input" className="mb-2 text-sm font-medium text-gray-400 px-2">JSON-Escaped String</label>
          <TextArea
            id="json-input"
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            onFocus={handleLeftFocus}
            placeholder='e.g., "Hello\\nWorld!"'
            spellCheck="false"
          />
        </div>
        
        {/* Middle Section (Button and Error) */}
        <div className="flex flex-col items-center justify-center md:px-4">
          <DirectionButton direction={direction} />
          <div className="w-64 mt-4">
            <ErrorDisplay message={error} />
          </div>
        </div>

        {/* Right/Bottom Panel */}
        <div className="flex-1 flex flex-col min-h-[300px] md:min-h-0">
          <label htmlFor="markdown-output" className="mb-2 text-sm font-medium text-gray-400 px-2">Raw Text / Markdown Preview</label>
          <TextArea
            id="markdown-output"
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            onFocus={handleRightFocus}
            placeholder="Raw text will appear here..."
            spellCheck="false"
          />
        </div>
      </div>
      <footer className="text-center py-4 text-gray-600 text-sm">
        <p>JSON Markdown Unescaper</p>
      </footer>
    </main>
  );
}
