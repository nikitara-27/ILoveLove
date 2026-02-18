import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface PublicReflection {
  id: string;
  prompt: string;
  answer: string;
  color: string;
  timestamp: number;
  date: string;
  likes: number;
}

export function PublicFeedView() {
  const navigate = useNavigate();
  const [reflections, setReflections] = useState<PublicReflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchReflections();
    // Load liked posts from localStorage
    const liked = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    setLikedPosts(new Set(liked));
  }, []);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b898e3c0/reflections`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reflections");
      }

      const data = await response.json();
      setReflections(data.reflections || []);
    } catch (err) {
      console.error("Error fetching reflections:", err);
      setError("Unable to load reflections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reflectionId: string) => {
    const isLiked = likedPosts.has(reflectionId);
    
    if (isLiked) {
      // Unlike
      setReflections((prev) =>
        prev.map((r) =>
          r.id === reflectionId ? { ...r, likes: Math.max(0, r.likes - 1) } : r
        )
      );

      const newLikedPosts = new Set(likedPosts);
      newLikedPosts.delete(reflectionId);
      setLikedPosts(newLikedPosts);
      localStorage.setItem("liked_posts", JSON.stringify([...newLikedPosts]));

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b898e3c0/reflections/${reflectionId}/unlike`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to unlike reflection");
        }
      } catch (err) {
        console.error("Error unliking reflection:", err);
        // Revert on error
        setReflections((prev) =>
          prev.map((r) =>
            r.id === reflectionId ? { ...r, likes: r.likes + 1 } : r
          )
        );
        const revertedLiked = new Set(likedPosts);
        revertedLiked.add(reflectionId);
        setLikedPosts(revertedLiked);
        localStorage.setItem("liked_posts", JSON.stringify([...revertedLiked]));
      }
    } else {
      // Like
      setReflections((prev) =>
        prev.map((r) =>
          r.id === reflectionId ? { ...r, likes: r.likes + 1 } : r
        )
      );

      const newLikedPosts = new Set(likedPosts);
      newLikedPosts.add(reflectionId);
      setLikedPosts(newLikedPosts);
      localStorage.setItem("liked_posts", JSON.stringify([...newLikedPosts]));

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b898e3c0/reflections/${reflectionId}/like`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to like reflection");
        }
      } catch (err) {
        console.error("Error liking reflection:", err);
        // Revert on error
        setReflections((prev) =>
          prev.map((r) =>
            r.id === reflectionId ? { ...r, likes: r.likes - 1 } : r
          )
        );
        const revertedLiked = new Set(likedPosts);
        revertedLiked.delete(reflectionId);
        setLikedPosts(revertedLiked);
        localStorage.setItem("liked_posts", JSON.stringify([...revertedLiked]));
      }
    }
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
      <header className="px-6 py-6 flex items-center gap-4 sticky top-0 bg-[#FDF6EE] border-b border-[#F4A7B9]/20 z-10">
        <button
          onClick={() => navigate("/journal")}
          className="p-3 hover:bg-[#F4A7B9]/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Back to journal"
        >
          <ArrowLeft className="w-6 h-6 text-[#4A3528]" />
        </button>
        <div>
          <h1 className="text-[20px]">Love Stories</h1>
          <p className="text-[12px] opacity-60">
            Anonymous reflections from our community
          </p>
        </div>
      </header>

      {/* Feed content */}
      <main className="px-6 py-8 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#F4A7B9] animate-spin mb-4" />
            <p className="text-[14px] opacity-60">Loading reflections...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-[16px] opacity-60 mb-4">{error}</p>
            <button
              onClick={fetchReflections}
              className="bg-[#F4A7B9] text-[#4A3528] py-3 px-6 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px]"
            >
              Try Again
            </button>
          </div>
        ) : reflections.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-[#F4A7B9] mx-auto mb-4" />
            <p className="text-[16px] opacity-60 mb-2">
              No reflections yet
            </p>
            <p className="text-[14px] opacity-60">
              Be the first to share a love story!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                className="p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: reflection.color }}
              >
                <p className="text-[12px] italic opacity-80 mb-3">
                  {reflection.prompt}
                </p>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap mb-4">
                  {reflection.answer}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] opacity-60">
                    {formatDate(reflection.date)}
                  </p>
                  <button
                    onClick={() => handleLike(reflection.id)}
                    className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-black/5 transition-colors group"
                    aria-label={likedPosts.has(reflection.id) ? "Unlike this reflection" : "Like this reflection"}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        likedPosts.has(reflection.id)
                          ? "fill-[#F4A7B9] text-[#F4A7B9] scale-110"
                          : "text-[#4A3528] opacity-40 group-hover:scale-110"
                      }`}
                    />
                    {reflection.likes > 0 && (
                      <span className="text-[12px] font-bold opacity-80">
                        {reflection.likes}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}