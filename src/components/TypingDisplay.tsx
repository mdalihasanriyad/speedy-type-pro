import React from 'react';
import { cn } from '@/lib/utils';

interface TypingDisplayProps {
  text: string;
  typedText: string;
  currentIndex: number;
  isFinished: boolean;
}

export const TypingDisplay: React.FC<TypingDisplayProps> = ({
  text,
  typedText,
  currentIndex,
  isFinished,
}) => {
  return (
    <div className="typing-text relative select-none px-4 md:px-0">
      {text.split('').map((char, index) => {
        const isTyped = index < currentIndex;
        const isCurrent = index === currentIndex;
        const typedChar = typedText[index];
        const isCorrect = isTyped && typedChar === char;
        const isIncorrect = isTyped && typedChar !== char;

        return (
          <span key={index} className="relative inline">
            {isCurrent && !isFinished && (
              <span className="typing-cursor absolute -left-0.5" />
            )}
            <span
              className={cn(
                'typing-char',
                isCorrect && 'typing-char-correct',
                isIncorrect && 'typing-char-incorrect',
                !isTyped && 'typing-char-upcoming'
              )}
            >
              {char}
            </span>
          </span>
        );
      })}
    </div>
  );
};
