import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface TypingDisplayProps {
  text: string;
  typedText: string;
  currentIndex: number;
  isFinished: boolean;
}

export const TypingDisplay: React.FC<TypingDisplayProps> = memo(({
  text,
  typedText,
  currentIndex,
  isFinished,
}) => {
  // টেক্সটকে শব্দে ভাগ করা হচ্ছে যাতে লাইন ব্রেক না হয়
  const words = text.split(' ');
  let charCounter = 0;

  return (
    <div className="typing-text relative select-none px-4 md:px-0 flex flex-wrap gap-y-1">
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        const currentWordStartIdx = charCounter;
        
        // পরের শব্দের ইন্ডেক্স আপডেট (শব্দের দৈর্ঘ্য + ১টি স্পেস)
        charCounter += word.length + 1;

        return (
          <div key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const globalIdx = currentWordStartIdx + charIdx;
              const isTyped = globalIdx < currentIndex;
              const isCurrent = globalIdx === currentIndex;
              const typedChar = typedText[globalIdx];
              const isCorrect = isTyped && typedChar === char;
              const isIncorrect = isTyped && typedChar !== char;

              return (
                <span key={globalIdx} className="relative inline">
                  <span
                    className={cn(
                      'typing-char',
                      isCorrect && 'typing-char-correct',
                      isIncorrect && 'typing-char-incorrect',
                      !isTyped && 'typing-char-upcoming',
                      isCurrent && !isFinished && 'typing-char-current'
                    )}
                  >
                    {isCurrent && !isFinished && (
                      <span className="typing-cursor absolute left-0" />
                    )}
                    {char}
                  </span>
                </span>
              );
            })}

            {/* শব্দের মাঝের স্পেস হ্যান্ডেল করা */}
            {wordIdx < words.length - 1 && (() => {
              const spaceIdx = charCounter - 1;
              const isSpaceTyped = spaceIdx < currentIndex;
              const isSpaceCurrent = spaceIdx === currentIndex;
              const isSpaceIncorrect = isSpaceTyped && typedText[spaceIdx] !== ' ';

              return (
                <span key={`space-${wordIdx}`} className="relative inline">
                  <span
                    className={cn(
                      'typing-char',
                      isSpaceIncorrect && 'typing-char-incorrect',
                      !isSpaceTyped && 'typing-char-upcoming',
                      isSpaceCurrent && !isFinished && 'typing-char-current'
                    )}
                  >
                    {isSpaceCurrent && !isFinished && (
                      <span className="typing-cursor absolute left-0" />
                    )}
                    &nbsp;
                  </span>
                </span>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
});

TypingDisplay.displayName = 'TypingDisplay';