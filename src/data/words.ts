export type TypingMode = 'words' | 'quotes' | 'numbers' | 'punctuation';

export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "program", "move", "become", "against", "point", "public", "leave", "state", "where",
  "off", "problem", "number", "feel", "must", "those", "real", "another", "stand",
  "keep", "find", "long", "while", "between", "through", "right", "still", "start",
  "should", "home", "never", "much", "world", "hand", "high", "life", "since",
  "part", "place", "made", "under", "last", "great", "same", "before", "might",
  "every", "show", "change", "system", "thing", "group", "case", "woman", "man",
  "child", "need", "house", "here", "old", "both", "week", "open", "continue",
  "next", "less", "end", "few", "country", "company", "school", "area", "side"
];

export const quotes = [
  "The only way to do great work is to love what you do.",
  "In the middle of difficulty lies opportunity.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Your time is limited, do not waste it living someone else's life.",
  "The only impossible journey is the one you never begin.",
  "Believe you can and you are halfway there.",
  "Everything you have ever wanted is on the other side of fear.",
  "The journey of a thousand miles begins with a single step.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "The mind is everything. What you think you become.",
  "Strive not to be a success, but rather to be of value.",
  "The best revenge is massive success.",
  "I have not failed. I have just found 10,000 ways that will not work.",
  "A person who never made a mistake never tried anything new.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "Do what you can, with what you have, where you are.",
  "Life is what happens when you are busy making other plans."
];

export const punctuationPhrases = [
  "Hello, world! How are you today?",
  "The quick, brown fox jumps over the lazy dog.",
  "Wait... what? That can't be right!",
  "She said, \"I'll be there at 5:00 p.m.\"",
  "Items needed: eggs, milk, bread, and butter.",
  "Is this the real life? Is this just fantasy?",
  "Stop! Don't go there; it's dangerous.",
  "The price was $19.99 (plus tax).",
  "Dear Sir/Madam, I'm writing to inquire...",
  "He shouted, \"Watch out!\" but it was too late.",
  "The meeting is at 3:30 p.m. -- don't be late!",
  "Options: (a) yes, (b) no, or (c) maybe.",
  "P.S. Don't forget to R.S.V.P. by Friday!",
  "What's the matter? Can't you see it's obvious?",
  "The CEO's decision was final: no more delays.",
  "I bought apples, oranges, bananas, and grapes.",
  "Why? Because I said so! That's why.",
  "He asked, \"Where are we going?\" nervously.",
  "Note: This offer expires on 12/31/2025.",
  "Success = hard work + dedication + luck."
];

export function getRandomWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    words.push(commonWords[randomIndex]);
  }
  return words;
}

function generateNumberSequence(length: number): string {
  const patterns = [
    () => Math.floor(Math.random() * 1000).toString(),
    () => Math.floor(Math.random() * 10000).toString(),
    () => (Math.random() * 100).toFixed(2),
    () => `${Math.floor(Math.random() * 100)}%`,
    () => `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 25) + 2000}`,
    () => `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    () => `$${(Math.random() * 1000).toFixed(2)}`,
    () => Math.floor(Math.random() * 1000000).toLocaleString(),
  ];
  
  const numbers: string[] = [];
  for (let i = 0; i < length; i++) {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    numbers.push(pattern());
  }
  return numbers.join(" ");
}

function getRandomQuotes(count: number): string {
  const shuffled = [...quotes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, quotes.length)).join(" ");
}

function getRandomPunctuationPhrases(count: number): string {
  const shuffled = [...punctuationPhrases].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, punctuationPhrases.length)).join(" ");
}

export function generateTypingText(wordCount: number = 50, mode: TypingMode = 'words'): string {
  switch (mode) {
    case 'quotes':
      return getRandomQuotes(3);
    case 'numbers':
      return generateNumberSequence(wordCount);
    case 'punctuation':
      return getRandomPunctuationPhrases(4);
    case 'words':
    default:
      return getRandomWords(wordCount).join(" ");
  }
}
