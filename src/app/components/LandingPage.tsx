import { useNavigate } from "react-router";
import { Globe } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#4A3528] font-['Cutive_Mono',monospace] flex flex-col items-center justify-center p-6">
      {/* Sticky Note */}
      <div className="max-w-md w-full mb-8">
        <div
          className="p-12 rounded-lg shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300"
          style={{ backgroundColor: "#FFD6E0" }}
        >
          <h1 className="text-[48px] text-center leading-tight mb-4">
            I Love Love
          </h1>
          <p className="text-[14px] text-center opacity-80 italic">
            A space for reflecting on the love in your life
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={() => navigate("/journal")}
          className="bg-[#F4A7B9] text-[#4A3528] py-4 px-12 rounded-lg hover:bg-[#F4A7B9]/80 transition-colors font-['Cutive_Mono',monospace] min-h-[44px] text-[18px] shadow-lg"
        >
          Start Journaling
        </button>
        
        <button
          onClick={() => navigate("/feed")}
          className="bg-white/70 text-[#4A3528] py-4 px-12 rounded-lg hover:bg-white transition-colors font-['Cutive_Mono',monospace] min-h-[44px] text-[16px] border-2 border-[#F4A7B9]/30 flex items-center justify-center gap-2"
        >
          <Globe className="w-5 h-5" />
          <span>Browse Love Stories</span>
        </button>
      </div>
    </div>
  );
}