import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, Share2, Globe, Edit2, Trash2 } from "lucide-react";
import { PROMPTS, JournalEntry } from "../types";
import { ShareCard } from "../components/ShareCard";

export function GalleryView() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [sharingEntry, setSharingEntry] = useState<JournalEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [deletingEntry, setDeletingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const storedEntries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journal_entries") || "[]"
    );
    // Sort by date, newest first
    const sorted = storedEntries
      .filter((e) => e.answer.trim())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(sorted);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setEditAnswer(entry.answer);
  };

  const saveEdit = () => {
    if (!editingEntry || !editAnswer.trim()) return;

    const storedEntries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journal_entries") || "[]"
    );

    const updatedEntries = storedEntries.map((e) =>
      e.id === editingEntry.id
        ? { ...e, answer: editAnswer.trim(), date: new Date().toISOString() }
        : e
    );

    localStorage.setItem("journal_entries", JSON.stringify(updatedEntries));
    loadEntries();
    setEditingEntry(null);
    setEditAnswer("");
  };

  const handleDelete = (entry: JournalEntry) => {
    setDeletingEntry(entry);
  };

  const confirmDelete = () => {
    if (!deletingEntry) return;

    const storedEntries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journal_entries") || "[]"
    );

    const updatedEntries = storedEntries.filter(
      (e) => e.id !== deletingEntry.id
    );

    localStorage.setItem("journal_entries", JSON.stringify(updatedEntries));
    loadEntries();
    setDeletingEntry(null);
  };

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
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 opacity-100">
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
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-3 bg-white border-2 border-[#F4A7B9]/50 rounded-lg hover:bg-[#F4A7B9]/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-md"
                    aria-label="Edit reflection"
                  >
                    <Edit2 className="w-5 h-5 text-[#4A3528]" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry)}
                    className="p-3 bg-white border-2 border-[#F4A7B9]/50 rounded-lg hover:bg-[#F4A7B9]/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-md"
                    aria-label="Delete reflection"
                  >
                    <Trash2 className="w-5 h-5 text-[#4A3528]" />
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

        {/* Edit Modal */}
        {editingEntry && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setEditingEntry(null)}
          >
            <div
              className="max-w-2xl w-full bg-white/95 rounded-lg p-8 font-['Cutive_Mono',monospace] text-[#4A3528] max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[18px] mb-4">Edit Reflection</h2>
              <p className="text-[14px] italic opacity-80 mb-4">
                {PROMPTS[editingEntry.promptIndex]}
              </p>
              <textarea
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                className="w-full flex-1 min-h-[200px] bg-white border-2 border-[#F4A7B9]/30 rounded-lg p-4 resize-none focus:outline-none focus:border-[#F4A7B9] transition-colors font-['Cutive_Mono',monospace] text-[16px] mb-4"
                placeholder="Edit your reflection..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingEntry(null)}
                  className="flex-1 bg-white/50 text-[#4A3528] py-3 px-6 rounded-lg hover:bg-white/70 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] border-2 border-[#F4A7B9]/30"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={!editAnswer.trim()}
                  className="flex-1 bg-[#F4A7B9] text-[#4A3528] py-3 px-6 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingEntry && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setDeletingEntry(null)}
          >
            <div
              className="max-w-md w-full bg-white/95 rounded-lg p-8 font-['Cutive_Mono',monospace] text-[#4A3528]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[18px] mb-4">Delete Reflection?</h2>
              <p className="text-[14px] mb-6 opacity-80">
                Are you sure you want to delete this reflection? This action cannot be undone.
              </p>
              <div className="bg-[#FDF6EE] border-2 border-[#F4A7B9]/30 rounded-lg p-4 mb-6">
                <p className="text-[12px] italic opacity-80 mb-2">
                  {PROMPTS[deletingEntry.promptIndex]}
                </p>
                <p className="text-[14px] leading-relaxed line-clamp-3">
                  {deletingEntry.answer}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingEntry(null)}
                  className="flex-1 bg-white/50 text-[#4A3528] py-3 px-6 rounded-lg hover:bg-white/70 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] border-2 border-[#F4A7B9]/30"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-400 text-white py-3 px-6 rounded-lg hover:bg-red-500 transition-colors font-['Cutive_Mono',monospace] min-h-[44px]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}