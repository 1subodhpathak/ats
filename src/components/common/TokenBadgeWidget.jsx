import React, { useEffect, useState } from "react";
import { Zap, Sparkles } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export default function TokenBadgeWidget({ isLightTheme = false }) {
  const { user } = useUser();
  const [tokens, setTokens] = useState(null);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    if (!user) return;

    const fetchTokenStatus = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://server.datasenseai.com";
        const backendUrl = apiBase.replace(/\/careersense\/ats\/?$/, "");
        const res = await fetch(`${backendUrl}/careersense/subscription/status?clerkId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setTokens(data.tokensRemaining);
          setPlan(data.plan);
        }
      } catch (err) {
        console.error("Error fetching token status:", err);
      }
    };

    fetchTokenStatus();
  }, [user]);

  if (!user) return null;

  const planBadgeColors = {
    free: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    student: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    intern: "bg-[#0EA8B9]/10 text-[#0EA8B9] border-[#0EA8B9]/30",
    partner: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  };

  return (
    <a
      href="https://careersenseai.com/pricing"
      target="_blank"
      rel="noreferrer"
      className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-200 hover:scale-105 ${
        isLightTheme
          ? "border-slate-200 bg-white/90 text-slate-800 shadow-xs hover:border-[#0EA8B9]"
          : "border-white/12 bg-white/5 text-white hover:border-[#0EA8B9] hover:bg-white/10"
      }`}
      title="View AI Token Usage & Subscription Plans on CareerSense"
    >
      <div className="flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
        <span>
          {tokens !== null ? tokens.toLocaleString() : "..."}
        </span>
        <span className="text-[10px] font-semibold text-slate-400">Tokens</span>
      </div>

      <span className={`rounded-md border px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider ${planBadgeColors[plan] || planBadgeColors.free}`}>
        {plan}
      </span>

      <Sparkles className="h-3 w-3 text-[#0EA8B9] opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
