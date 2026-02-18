export interface JournalEntry {
  id: string;
  promptIndex: number;
  answer: string;
  date: string;
}

export const PROMPTS = [
  "How has someone shown their love for you in a way you didn't expect? What did that mean to you?",
  "When do you feel most loved — and what is happening in those moments?",
  "How do you tend to show love when you really care about someone or something?",
  "What's a small moment of love you've witnessed or experienced that has stayed with you?"
];

export const SHARING_COLORS = ["#FFF3B0", "#FFD6E0", "#D6EAF8", "#D5F5E3"];
