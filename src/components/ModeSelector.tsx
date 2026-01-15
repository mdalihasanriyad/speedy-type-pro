import React from 'react';
import { cn } from '@/lib/utils';
import { Type, Quote, Hash, AtSign, Target } from 'lucide-react';
import { TypingMode } from '@/data/words';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModeSelectorProps {
  mode: TypingMode;
  onModeChange: (mode: TypingMode) => void;
  disabled?: boolean;
  hasPracticeData?: boolean;
}

const MODE_OPTIONS: { value: TypingMode; label: string; icon: React.ReactNode; description?: string }[] = [
  { value: 'words', label: 'words', icon: <Type className="w-4 h-4" /> },
  { value: 'quotes', label: 'quotes', icon: <Quote className="w-4 h-4" /> },
  { value: 'numbers', label: 'numbers', icon: <Hash className="w-4 h-4" /> },
  { value: 'punctuation', label: 'punctuation', icon: <AtSign className="w-4 h-4" /> },
  { value: 'practice', label: 'practice', icon: <Target className="w-4 h-4" />, description: 'Focus on your weak keys' },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onModeChange,
  disabled = false,
  hasPracticeData = false,
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-center gap-1 bg-secondary/50 rounded-lg p-1">
        {MODE_OPTIONS.map((option) => {
          const isPracticeWithNoData = option.value === 'practice' && !hasPracticeData;
          
          const button = (
            <button
              key={option.value}
              onClick={() => onModeChange(option.value)}
              disabled={disabled || isPracticeWithNoData}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                "hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                mode === option.value
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary",
                (disabled || isPracticeWithNoData) && "opacity-50 cursor-not-allowed",
                option.value === 'practice' && hasPracticeData && mode !== 'practice' && "text-warning"
              )}
            >
              {option.icon}
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );

          if (option.value === 'practice') {
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent>
                  {isPracticeWithNoData 
                    ? "Complete some tests first to identify weak keys" 
                    : "Practice words with your frequently mistyped keys"}
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </div>
    </TooltipProvider>
  );
};
