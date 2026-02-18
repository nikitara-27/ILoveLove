import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PROMPTS, JournalEntry } from "../types";
import { Book, Share2, Home } from "lucide-react";
import { ShareCard } from "./ShareCard";

export function JournalView() {
  const navigate = useNavigate();
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [answer, setAnswer] = useState("");
  const [shownPrompts, setShownPrompts] = useState<number[]>([]);
  const [showShareCard, setShowShareCard] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const entries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journal_entries") || "[]"
    );
    const shown: number[] = JSON.parse(
      localStorage.getItem("shown_prompts") || "[]"
    );
    const current = parseInt(
      localStorage.getItem("current_prompt") || "0",
      10
    );

    setShownPrompts(shown);
    setCurrentPromptIndex(current);

    // Load existing answer for this prompt
    const existingEntry = entries.find((e) => e.promptIndex === current);
    if (existingEntry) {
      setAnswer(existingEntry.answer);
    } else {
      setAnswer("");
    }
  }, []);

  // Auto-save answer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (answer.trim()) {
        saveAnswer();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [answer]);

  const saveAnswer = () => {
    const entries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journal_entries") || "[]"
    );

    const existingIndex = entries.findIndex(
      (e) => e.promptIndex === currentPromptIndex
    );

    const entry: JournalEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : crypto.randomUUID(),
      promptIndex: currentPromptIndex,
      answer: answer.trim(),
      date: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }

    localStorage.setItem("journal_entries", JSON.stringify(entries));
  };

  const getNextPrompt = () => {
    // Save current answer before moving
    if (answer.trim()) {
      saveAnswer();
    }

    // Get available prompts
    const availablePrompts = Array.from({ length: 4 }, (_, i) => i).filter(
      (i) => !shownPrompts.includes(i)
    );

    let nextPrompt: number;
    let newShownPrompts: number[];

    if (availablePrompts.length === 0) {
      // All prompts shown, reset and pick randomly
      newShownPrompts = [];
      nextPrompt = Math.floor(Math.random() * 4);
    } else if (availablePrompts.length === 1) {
      // Last available prompt
      nextPrompt = availablePrompts[0];
      newShownPrompts = [];
    } else {
      // Pick random from available
      nextPrompt =
        availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
      newShownPrompts = [...shownPrompts, currentPromptIndex];
    }

    // Load existing answer for the new prompt
    const entries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journal_entries") || "[]"
    );
    const existingEntry = entries.find((e) => e.promptIndex === nextPrompt);

    setCurrentPromptIndex(nextPrompt);
    setShownPrompts(newShownPrompts);
    setAnswer(existingEntry ? existingEntry.answer : "");

    // Save state to localStorage
    localStorage.setItem("current_prompt", nextPrompt.toString());
    localStorage.setItem("shown_prompts", JSON.stringify(newShownPrompts));
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#4A3528] font-['Cutive_Mono',monospace] flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between">
        <h1 className="text-[20px]">ILoveLove</h1>
        <button
          onClick={() => navigate("/gallery")}
          className="p-3 hover:bg-[#F4A7B9]/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="View gallery"
        >
          <Book className="w-6 h-6 text-[#4A3528]" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 pb-8 flex flex-col max-w-2xl w-full mx-auto">
        {/* Prompt */}
        <div className="mb-8">
          <p className="text-[18px] leading-relaxed">
            {PROMPTS[currentPromptIndex]}
          </p>
        </div>

        {/* Text area */}
        <div className="flex-1 mb-6">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Take your time..."
            className="w-full h-full min-h-[300px] p-4 bg-white/50 border-2 border-[#F4A7B9]/30 rounded-lg resize-none focus:outline-none focus:border-[#F4A7B9] transition-colors font-['Cutive_Mono',monospace] text-[16px]"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <button
            onClick={getNextPrompt}
            className="flex-1 bg-[#F4A7B9] text-[#4A3528] py-4 px-6 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px]"
          >
            New Question
          </button>
          <button
            onClick={() => navigate("/")}
            className="sm:w-auto w-full bg-white/50 text-[#4A3528] py-4 px-6 rounded-lg hover:bg-white/70 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] border-2 border-[#F4A7B9]/30 flex items-center justify-center"
            aria-label="Back to home"
          >
            <Home className="w-5 h-5" />
          </button>
          {answer.trim() && (
            <button
              onClick={() => setShowShareCard(true)}
              className="sm:w-auto w-full bg-white/50 text-[#4A3528] py-4 px-6 rounded-lg hover:bg-white/70 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] flex items-center justify-center gap-2 border-2 border-[#F4A7B9]/30"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          )}
        </div>
      </main>

      {/* Share Card Modal */}
      {showShareCard && (
        <ShareCard
          prompt={PROMPTS[currentPromptIndex]}
          answer={answer}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
}