import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, Share2, Globe } from "lucide-react";
import { PROMPTS, JournalEntry } from "../types";
import { ShareCard } from "../components/ShareCard";

export function GalleryView() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [sharingEntry, setSharingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const storedEntries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journal_entries") || "[]"
    );
    // Sort by date, newest first
    const sorted = storedEntries
      .filter((e) => e.answer.trim())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(sorted);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#4A3528] font-['Cutive_Mono',monospace]">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-[#FDF6EE] border-b border-[#F4A7B9]/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/journal")}
            className="p-3 hover:bg-[#F4A7B9]/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Back to journal"
          >
            <ArrowLeft className="w-6 h-6 text-[#4A3528]" />
          </button>
          <h1 className="text-[20px]">Your Reflections</h1>
        </div>
        <button
          onClick={() => navigate("/feed")}
          className="p-3 hover:bg-[#F4A7B9]/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Browse love stories"
        >
          <Globe className="w-6 h-6 text-[#4A3528]" />
        </button>
      </header>

      {/* Gallery content */}
      <main className="px-6 py-8 max-w-2xl mx-auto">
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[16px] opacity-60">No reflections yet.</p>
            <p className="text-[14px] opacity-60 mt-2">
              Start journaling to see your entries here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="relative bg-white/50 border-2 border-[#F4A7B9]/30 rounded-lg p-6 group hover:border-[#F4A7B9] transition-all"
              >
                <p className="text-[14px] italic opacity-80 mb-3">
                  {PROMPTS[entry.promptIndex]}
                </p>
                <p className="text-[16px] leading-relaxed whitespace-pre-wrap mb-4 line-clamp-3">
                  {entry.answer}
                </p>
                <p className="text-[12px] opacity-60 text-right">
                  {formatDate(entry.date)}
                </p>
                
                {/* Hover buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setViewingEntry(entry)}
                    className="p-3 bg-white border-2 border-[#F4A7B9]/50 rounded-lg hover:bg-[#F4A7B9]/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-md"
                    aria-label="View full reflection"
                  >
                    <Eye className="w-5 h-5 text-[#4A3528]" />
                  </button>
                  <button
                    onClick={() => setSharingEntry(entry)}
                    className="p-3 bg-white border-2 border-[#F4A7B9]/50 rounded-lg hover:bg-[#F4A7B9]/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-md"
                    aria-label="Share reflection"
                  >
                    <Share2 className="w-5 h-5 text-[#4A3528]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Modal */}
        {viewingEntry && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setViewingEntry(null)}
          >
            <div
              className="max-w-2xl w-full bg-white/95 rounded-lg p-8 font-['Cutive_Mono',monospace] text-[#4A3528] max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[14px] italic opacity-80 mb-4">
                {PROMPTS[viewingEntry.promptIndex]}
              </p>
              <p className="text-[16px] leading-relaxed whitespace-pre-wrap mb-6">
                {viewingEntry.answer}
              </p>
              <p className="text-[12px] opacity-60 mb-6">
                {formatDate(viewingEntry.date)}
              </p>
              <button
                onClick={() => setViewingEntry(null)}
                className="w-full bg-[#F4A7B9] text-[#4A3528] py-3 px-6 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Share Card Modal */}
        {sharingEntry && (
          <ShareCard
            prompt={PROMPTS[sharingEntry.promptIndex]}
            answer={sharingEntry.answer}
            onClose={() => setSharingEntry(null)}
          />
        )}
      </main>
    </div>
  );
}