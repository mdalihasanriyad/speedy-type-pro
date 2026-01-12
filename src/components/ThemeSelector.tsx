import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Palette, ChevronDown, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          )}
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">{theme.name}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="flex flex-col gap-1">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-secondary",
                theme.id === t.id
                  ? "text-accent font-medium"
                  : "text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: `hsl(${t.colors.primary})` }}
                />
                {t.name}
              </div>
              {theme.id === t.id && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
