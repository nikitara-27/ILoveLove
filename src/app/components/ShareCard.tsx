import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, Instagram, Facebook, Globe } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export function ShareCard({
  prompt,
  answer,
  onClose,
}: {
  prompt: string;
  answer: string;
  onClose: () => void;
}) {
  const [color] = useState(() => {
    const colors = ["#FFF3B0", "#FFD6E0", "#D6EAF8", "#D5F5E3"];
    return colors[Math.floor(Math.random() * colors.length)];
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const sharePublicly = async () => {
    setIsPosting(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b898e3c0/reflections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            prompt,
            answer,
            color,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post reflection");
      }

      setPosted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error posting reflection:", error);
      alert("Failed to share publicly. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const captureImage = async (): Promise<string | null> => {
    if (!cardContainerRef.current) return null;
    
    setIsCapturing(true);
    
    try {
      const canvas = await html2canvas(cardContainerRef.current, {
        backgroundColor: "#FDF6EE",
        scale: 2,
        logging: false,
      });

      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Failed to capture card:", error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const captureAndShare = async () => {
    if (!cardContainerRef.current) return;
    
    setIsCapturing(true);
    
    try {
      const canvas = await html2canvas(cardContainerRef.current, {
        backgroundColor: "#FDF6EE",
        scale: 2,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], "ilovelove-reflection.png", {
          type: "image/png",
        });

        // Try Web Share API (works on mobile - opens native share sheet)
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "ILoveLove Reflection",
              text: "My reflection from ILoveLove 💕",
            });
            setIsCapturing(false);
            return;
          } catch (err) {
            console.log("Share cancelled or failed:", err);
          }
        }
        
        // Fallback: Show social media options
        const dataUrl = canvas.toDataURL("image/png");
        setImageUrl(dataUrl);
        setShowSocialOptions(true);
        setIsCapturing(false);
      });
    } catch (error) {
      console.error("Failed to capture card:", error);
      setIsCapturing(false);
    }
  };

  const shareToInstagram = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;
    
    // Download the image and show instructions
    downloadImageFromUrl(dataUrl);
    
    // Try to open Instagram app on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // Open Instagram app (user will need to manually upload from camera roll)
      window.open("instagram://story-camera", "_blank");
      
      // Fallback to Instagram web if app not installed
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank");
      }, 1000);
    } else {
      window.open("https://www.instagram.com/", "_blank");
    }
  };

  const shareToFacebook = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;
    
    // Download the image first
    downloadImageFromUrl(dataUrl);
    
    // Open Facebook
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open("fb://", "_blank");
      setTimeout(() => {
        window.open("https://www.facebook.com/", "_blank");
      }, 1000);
    } else {
      window.open("https://www.facebook.com/", "_blank");
    }
  };

  const downloadImageFromUrl = (dataUrl: string) => {
    const link = document.createElement("a");
    link.download = "ilovelove-reflection.png";
    link.href = dataUrl;
    link.click();
  };

  const downloadOnly = async () => {
    const dataUrl = await captureImage();
    if (dataUrl) {
      downloadImageFromUrl(dataUrl);
    }
  };

  if (showSocialOptions) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
        onClick={onClose}
      >
        <div
          className="max-w-md w-full bg-[#FDF6EE] rounded-lg p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-[18px] font-['Cutive_Mono',monospace] text-[#4A3528] mb-4">
            Share to Social Media
          </h3>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={shareToInstagram}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 px-6 rounded-lg hover:opacity-90 transition-opacity font-['Cutive_Mono',monospace] min-h-[44px] flex items-center justify-center gap-3"
            >
              <Instagram className="w-6 h-6" />
              <span>Open Instagram</span>
            </button>
            
            <button
              onClick={shareToFacebook}
              className="w-full bg-[#1877F2] text-white py-4 px-6 rounded-lg hover:opacity-90 transition-opacity font-['Cutive_Mono',monospace] min-h-[44px] flex items-center justify-center gap-3"
            >
              <Facebook className="w-6 h-6" />
              <span>Open Facebook</span>
            </button>
            
            <button
              onClick={downloadOnly}
              className="w-full bg-white border-2 border-[#F4A7B9]/50 text-[#4A3528] py-4 px-6 rounded-lg hover:bg-[#F4A7B9]/10 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" />
              <span>Download Image</span>
            </button>
          </div>
          
          <p className="text-[12px] text-center opacity-60 font-['Cutive_Mono',monospace] text-[#4A3528] mb-4">
            Your image has been downloaded. The app will open, then upload it from your camera roll to your story.
          </p>
          
          <button
            onClick={onClose}
            className="w-full bg-[#F4A7B9] text-[#4A3528] py-3 px-6 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={cardContainerRef}
          className="p-12 rounded-lg shadow-xl font-['Cutive_Mono',monospace] text-[#4A3528]"
          style={{ backgroundColor: color }}
        >
          <p className="text-[14px] mb-4 italic opacity-80">{prompt}</p>
          <p className="text-[16px] leading-relaxed whitespace-pre-wrap">
            {answer}
          </p>
          <p className="text-[12px] mt-6 text-right opacity-60">ILoveLove</p>
        </div>
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={captureAndShare}
            disabled={isCapturing}
            className="flex-1 bg-[#F4A7B9] text-[#4A3528] py-3 px-6 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Share2 className="w-5 h-5" />
            <span>{isCapturing ? "Preparing..." : "Share to Story"}</span>
          </button>
          
          <button
            onClick={downloadOnly}
            disabled={isCapturing}
            className="bg-white/90 text-[#4A3528] py-3 px-6 rounded-lg hover:bg-white transition-colors font-['Cutive_Mono',monospace] min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50"
            aria-label="Download image"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-3 w-full bg-white/50 text-[#4A3528] py-3 px-6 rounded-lg hover:bg-white/70 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] border-2 border-[#F4A7B9]/30"
        >
          Close
        </button>
        
        <p className="text-[12px] text-center mt-3 opacity-60 font-['Cutive_Mono',monospace] text-[#4A3528]">
          On mobile: Opens native share menu • On desktop: Choose social app
        </p>
        
        <button
          onClick={sharePublicly}
          disabled={isPosting || posted}
          className="mt-3 w-full bg-[#F4A7B9] text-[#4A3528] py-3 px-6 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Globe className="w-5 h-5" />
          <span>{isPosting ? "Posting..." : posted ? "Posted!" : "Share Publicly"}</span>
        </button>
      </div>
    </div>
  );
}