export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    typingCorrect: string;
    typingIncorrect: string;
    typingCursor: string;
    typingUpcoming: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      background: '220 10% 18%',
      foreground: '220 10% 90%',
      card: '220 10% 20%',
      cardForeground: '220 10% 90%',
      primary: '45 100% 50%',
      primaryForeground: '220 10% 10%',
      secondary: '220 10% 25%',
      secondaryForeground: '220 10% 70%',
      muted: '220 10% 25%',
      mutedForeground: '220 10% 50%',
      accent: '45 100% 50%',
      accentForeground: '220 10% 10%',
      border: '220 10% 25%',
      typingCorrect: '220 10% 90%',
      typingIncorrect: '0 70% 55%',
      typingCursor: '45 100% 50%',
      typingUpcoming: '220 10% 45%',
    },
  },
  {
    id: 'serika',
    name: 'Serika Dark',
    colors: {
      background: '46 6% 12%',
      foreground: '43 18% 85%',
      card: '46 6% 14%',
      cardForeground: '43 18% 85%',
      primary: '47 100% 62%',
      primaryForeground: '46 6% 10%',
      secondary: '46 6% 18%',
      secondaryForeground: '43 18% 70%',
      muted: '46 6% 18%',
      mutedForeground: '43 8% 45%',
      accent: '47 100% 62%',
      accentForeground: '46 6% 10%',
      border: '46 6% 20%',
      typingCorrect: '43 18% 85%',
      typingIncorrect: '0 65% 55%',
      typingCursor: '47 100% 62%',
      typingUpcoming: '43 8% 40%',
    },
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      background: '0 0% 98%',
      foreground: '220 10% 15%',
      card: '0 0% 100%',
      cardForeground: '220 10% 15%',
      primary: '220 70% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '220 10% 92%',
      secondaryForeground: '220 10% 40%',
      muted: '220 10% 92%',
      mutedForeground: '220 10% 45%',
      accent: '220 70% 50%',
      accentForeground: '0 0% 100%',
      border: '220 10% 88%',
      typingCorrect: '220 10% 15%',
      typingIncorrect: '0 70% 50%',
      typingCursor: '220 70% 50%',
      typingUpcoming: '220 10% 60%',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      background: '210 50% 12%',
      foreground: '200 20% 90%',
      card: '210 50% 14%',
      cardForeground: '200 20% 90%',
      primary: '180 70% 50%',
      primaryForeground: '210 50% 10%',
      secondary: '210 40% 20%',
      secondaryForeground: '200 20% 70%',
      muted: '210 40% 20%',
      mutedForeground: '200 20% 50%',
      accent: '180 70% 50%',
      accentForeground: '210 50% 10%',
      border: '210 40% 22%',
      typingCorrect: '200 20% 90%',
      typingIncorrect: '0 65% 55%',
      typingCursor: '180 70% 50%',
      typingUpcoming: '200 20% 45%',
    },
  },
  {
    id: 'rose',
    name: 'Rosé Pine',
    colors: {
      background: '249 22% 12%',
      foreground: '245 7% 81%',
      card: '249 22% 14%',
      cardForeground: '245 7% 81%',
      primary: '343 76% 68%',
      primaryForeground: '249 22% 10%',
      secondary: '249 15% 20%',
      secondaryForeground: '245 7% 70%',
      muted: '249 15% 20%',
      mutedForeground: '245 7% 50%',
      accent: '343 76% 68%',
      accentForeground: '249 22% 10%',
      border: '249 15% 22%',
      typingCorrect: '245 7% 81%',
      typingIncorrect: '2 55% 60%',
      typingCursor: '343 76% 68%',
      typingUpcoming: '245 7% 45%',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    colors: {
      background: '120 10% 5%',
      foreground: '120 100% 50%',
      card: '120 10% 7%',
      cardForeground: '120 100% 50%',
      primary: '120 100% 45%',
      primaryForeground: '120 10% 5%',
      secondary: '120 10% 12%',
      secondaryForeground: '120 70% 40%',
      muted: '120 10% 12%',
      mutedForeground: '120 50% 30%',
      accent: '120 100% 45%',
      accentForeground: '120 10% 5%',
      border: '120 15% 15%',
      typingCorrect: '120 100% 50%',
      typingIncorrect: '0 70% 50%',
      typingCursor: '120 100% 50%',
      typingUpcoming: '120 50% 25%',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: {
      background: '270 20% 15%',
      foreground: '270 15% 85%',
      card: '270 20% 17%',
      cardForeground: '270 15% 85%',
      primary: '270 60% 65%',
      primaryForeground: '270 20% 10%',
      secondary: '270 15% 22%',
      secondaryForeground: '270 15% 70%',
      muted: '270 15% 22%',
      mutedForeground: '270 15% 50%',
      accent: '270 60% 65%',
      accentForeground: '270 20% 10%',
      border: '270 15% 25%',
      typingCorrect: '270 15% 85%',
      typingIncorrect: '0 65% 55%',
      typingCursor: '270 60% 65%',
      typingUpcoming: '270 15% 45%',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    colors: {
      background: '220 16% 22%',
      foreground: '219 28% 88%',
      card: '220 16% 24%',
      cardForeground: '219 28% 88%',
      primary: '193 43% 67%',
      primaryForeground: '220 16% 18%',
      secondary: '220 16% 28%',
      secondaryForeground: '219 28% 75%',
      muted: '220 16% 28%',
      mutedForeground: '219 14% 50%',
      accent: '193 43% 67%',
      accentForeground: '220 16% 18%',
      border: '220 16% 30%',
      typingCorrect: '219 28% 88%',
      typingIncorrect: '354 42% 56%',
      typingCursor: '193 43% 67%',
      typingUpcoming: '219 14% 45%',
    },
  },
];

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--card-foreground', theme.colors.cardForeground);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--secondary-foreground', theme.colors.secondaryForeground);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--input', theme.colors.secondary);
  root.style.setProperty('--ring', theme.colors.primary);
  root.style.setProperty('--typing-correct', theme.colors.typingCorrect);
  root.style.setProperty('--typing-incorrect', theme.colors.typingIncorrect);
  root.style.setProperty('--typing-cursor', theme.colors.typingCursor);
  root.style.setProperty('--typing-upcoming', theme.colors.typingUpcoming);
}
