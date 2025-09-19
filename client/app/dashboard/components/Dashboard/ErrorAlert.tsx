"use client";

interface ErrorAlertProps {
  error: string;
  onClear: () => void;
}

export function ErrorAlert({ error, onClear }: ErrorAlertProps) {
  return (
    <div className="w-full max-w-xl mb-6">
      <div 
        className="px-4 py-3 rounded relative border" 
        role="alert" 
        style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.08)', 
          borderColor: 'var(--color-error)', 
          color: 'var(--color-error)' 
        }}
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={onClear}
          className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:opacity-75 transition-opacity"
          aria-label="Close error message"
        >
          <svg 
            className="fill-current h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            style={{ color: 'var(--color-error)' }}
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}