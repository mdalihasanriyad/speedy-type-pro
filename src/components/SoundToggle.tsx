import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SoundToggleProps {
  soundEnabled: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  soundEnabled,
  onToggle,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{soundEnabled ? 'Disable sounds' : 'Enable sounds'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
