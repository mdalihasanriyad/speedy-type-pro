import React from 'react';
import { cn } from '@/lib/utils';
import { Type, Quote, Hash, AtSign } from 'lucide-react';
import { TypingMode } from '@/data/words';

interface ModeSelectorProps {
  mode: TypingMode;
  onModeChange: (mode: TypingMode) => void;
  disabled?: boolean;
}

const MODE_OPTIONS: { value: TypingMode; label: string; icon: React.ReactNode }[] = [
  { value: 'words', label: 'words', icon: <Type className="w-4 h-4" /> },
  { value: 'quotes', label: 'quotes', icon: <Quote className="w-4 h-4" /> },
  { value: 'numbers', label: 'numbers', icon: <Hash className="w-4 h-4" /> },
  { value: 'punctuation', label: 'punctuation', icon: <AtSign className="w-4 h-4" /> },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onModeChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 bg-secondary/50 rounded-lg p-1">
      {MODE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onModeChange(option.value)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
            "hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            mode === option.value
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
