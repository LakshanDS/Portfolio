import { FaFlag } from "react-icons/fa";
import { RoadmapItem } from "@/lib/types";

interface WhatsNextProps {
  roadmapItems: RoadmapItem[];
  philosophyText: string;
}

export function WhatsNext({ roadmapItems, philosophyText }: WhatsNextProps) {
  const currentFocus = roadmapItems.filter(item => item.status === "in-progress");

  return (
    <section className="py-24 px-6 bg-[#0D1117] border-t border-[#1F2937]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#E6EDF3] mb-8 text-center">What&apos;s Next?</h2>
        
        <div className="bg-[#111827] rounded-xl p-8 relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#0D1117] border border-[#1F2937]">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#4ADE80 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-xl font-semibold text-[#E6EDF3] mb-4 flex items-center gap-2">
                <FaFlag className="text-[#F59E0B]" />
                Current Focus
              </h3>
              
              <div className="space-y-4">
                {currentFocus.length > 0 ? (
                  currentFocus.map((item, i) => (
                    <div key={item.id}>
                      <div className="flex justify-between text-sm text-[#9CA3AF] mb-1">
                        <span>{item.title}</span>
                        <span>In Progress</span>
                      </div>
                      <div className="w-full bg-[#1F2937] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#4ADE80] h-2.5 rounded-full animate-pulse"
                          style={{ width: `${40 + (i % 3) * 15}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[#6B7280] italic">No active items in progress.</div>
                )}
              </div>
            </div>
            
            <div className="bg-[#0B0F14]/50 p-6 rounded-lg border border-[#1F2937]">
              <h4 className="text-base font-semibold text-[#E6EDF3] mb-2">Philosophy</h4>
              <p className="text-[#9CA3AF] italic">
                &quot;{philosophyText}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
