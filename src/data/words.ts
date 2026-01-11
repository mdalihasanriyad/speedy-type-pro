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

export function getRandomWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    words.push(commonWords[randomIndex]);
  }
  return words;
}

export function generateTypingText(wordCount: number = 50): string {
  return getRandomWords(wordCount).join(" ");
}
