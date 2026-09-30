import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { ArrowRight, Check, Coins, FileSearch, ListChecks, Lock, Sparkles, X } from "lucide-react";
import { REPORT_LEVELS } from "../constants/reportTypes";
import { fetchSubscriptionStatus, isPaidPlan } from "../../services/subscriptionService";

const PRICING_URL = "https://careersenseai.com/pricing";

const choices = [
  {
    value: REPORT_LEVELS.BASIC,
    title: "Basic ATS Report",
    description: "Focused 8-page compatibility report",
    resumeTokenEstimate: "8,000–10,000 tokens",
    resumeJdTokenEstimate: "8,000–10,000 tokens",
    badge: "Recommended",
    icon: FileSearch,
  },
  {
    value: REPORT_LEVELS.DETAILED,
    title: "Detailed 50-Point Analysis",
    description: "Full evidence, rewrites, and deep checks",
    resumeTokenEstimate: "12,000–20,000 tokens",
    resumeJdTokenEstimate: "12,000–30,000 tokens",
    badge: "Deep analysis",
    icon: ListChecks,
  },
];

function ReportTypeSelector({
  value,
  onChange,
  disabled = false,
  compact = false,
  showResumeTokenEstimate = false,
  showResumeJdTokenEstimate = false,
  userPlan,
}) {
  const { user, isLoaded } = useUser();
  const [currentPlan, setCurrentPlan] = useState(() => userPlan || "free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (userPlan) {
      setCurrentPlan(userPlan);
      return;
    }

    if (!isLoaded) return;
    if (!user?.id) {
      setCurrentPlan("free");
      return;
    }

    let isMounted = true;
    fetchSubscriptionStatus(user.id).then((sub) => {
      if (isMounted && sub?.plan) {
        setCurrentPlan(sub.plan);
      }
    });

    const handleTokensUpdated = () => {
      fetchSubscriptionStatus(user.id).then((sub) => {
        if (isMounted && sub?.plan) {
          setCurrentPlan(sub.plan);
        }
      });
    };

    window.addEventListener("careersense:tokens-updated", handleTokensUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener("careersense:tokens-updated", handleTokensUpdated);
    };
  }, [user?.id, isLoaded, userPlan]);

  const isPaid = isPaidPlan(currentPlan);

  // If free user has detailed report selected, auto revert to basic
  useEffect(() => {
    if (isLoaded && !isPaid && value === REPORT_LEVELS.DETAILED) {
      onChange?.(REPORT_LEVELS.BASIC);
    }
  }, [isLoaded, isPaid, value, onChange]);

  const handleSelect = (optionValue, isLocked) => {
    if (disabled) return;

    if (isLocked) {
      setShowUpgradeModal(true);
      return;
    }

    onChange?.(optionValue);
  };

  return (
    <>
      <fieldset className="min-w-0" disabled={disabled}>
        <legend className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-[#6E8797]">
          Choose report depth
        </legend>
        <div className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"}`}>
          {choices.map(
            ({
              value: optionValue,
              title,
              description,
              resumeTokenEstimate,
              resumeJdTokenEstimate,
              badge,
              icon: Icon,
            }) => {
              const isLocked = optionValue === REPORT_LEVELS.DETAILED && !isPaid;
              const selected = value === optionValue && !isLocked;
              const tokenEstimate = showResumeJdTokenEstimate
                ? resumeJdTokenEstimate
                : resumeTokenEstimate;

              return (
                <label
                  key={optionValue}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault();
                      handleSelect(optionValue, true);
                    }
                  }}
                  className={`group relative flex cursor-pointer items-center gap-3 rounded-[14px] border px-3 py-2.5 transition ${selected
                      ? "border-[#D3A445] bg-[#FFF6E3] shadow-[0_7px_18px_rgba(138,91,16,.08)]"
                      : isLocked
                        ? "border-[#E2E8F0] bg-[#F8FAFC]/90 hover:border-[#D3A445] hover:bg-[#FFFDF7]"
                        : "border-[#D5E1E7] bg-white hover:border-[#AFC5D0]"
                    } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <input
                    type="radio"
                    name="report-level"
                    value={optionValue}
                    checked={selected}
                    disabled={isLocked || disabled}
                    onChange={() => handleSelect(optionValue, false)}
                    className="sr-only"
                  />
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${selected
                        ? "bg-[#0B3B59] text-white"
                        : isLocked
                          ? "bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#FFF6E3] group-hover:text-[#81540B]"
                          : "bg-[#EAF2F5] text-[#416A80]"
                      }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-[#123A54]">{title}</span>
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#E0BE70] bg-[#FFF2D2] px-1.5 py-0.5 text-[6.5px] font-black uppercase tracking-[0.1em] text-[#81540B] shadow-sm">
                          <Lock size={8} strokeWidth={2.5} />
                          Pro Plan
                        </span>
                      ) : (
                        <span className="text-[6px] font-black uppercase tracking-[0.12em] text-[#A66B0D]">
                          {badge}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[7.5px] font-medium text-[#748D9C]">
                      {description}
                    </span>
                    {showResumeTokenEstimate || showResumeJdTokenEstimate ? (
                      <span
                        className={`mt-2 inline-flex items-center gap-2 rounded-[8px] border px-2.5 py-1.5 text-[9.5px] font-black leading-none shadow-sm transition ${selected
                            ? "border-[#C98B24] bg-[#D9A43A] text-white"
                            : isLocked
                              ? "border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]"
                              : "border-[#E0BE70] bg-[#FFF2D2] text-[#81540B]"
                          }`}
                      >
                        <Coins size={13} strokeWidth={2.5} aria-hidden="true" />
                        <span>
                          <span className="mr-1 text-[7px] uppercase tracking-[0.1em] opacity-90">
                            Estimated usage
                          </span>
                          {tokenEstimate}
                        </span>
                      </span>
                    ) : null}
                  </span>
                  {isLocked ? (
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#E0BE70] bg-[#FFF2D2] text-[#81540B] shadow-sm transition group-hover:scale-105 group-hover:bg-[#FFE8B3]"
                      title="Unlock with any Paid Plan (Click to view Plans)"
                    >
                      <Lock size={11} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                  ) : (
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected
                          ? "border-[#D3A445] bg-[#D3A445] text-white"
                          : "border-[#C8D6DD] text-transparent"
                        }`}
                    >
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}
                </label>
              );
            }
          )}
        </div>
      </fieldset>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#041E30]/75 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] transition hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Badge & Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8CE92] bg-[#FFF6E3] text-[#A66B0D] shadow-xs">
              <Sparkles className="h-7 w-7 text-[#D3A445]" />
            </div>

            {/* Title & Description */}
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5A442]/45 bg-[#FFF3D9] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#99620A]">
                <Lock className="h-3 w-3" /> Premium Feature
              </span>
              <h3 className="mt-2.5 text-xl font-black tracking-tight text-[#0B3B59]">
                Unlock Detailed 50-Point Analysis
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#617D8E]">
                Detailed 50-Point Analysis is exclusive to paid plans. Upgrade to access full evidence checks, recruiter diagnostics, and personalized rewrites.
              </p>
            </div>

            {/* Included Capabilities */}
            <div className="mt-5 rounded-xl border border-[#E9F0F4] bg-[#F7FAFC] p-3.5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1A435D]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F3FA] text-[#0B3B59]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <span>ATS & recruiter benchmark diagnostics</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1A435D]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F3FA] text-[#0B3B59]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <span>Line-by-line resume rewrites & action plan</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1A435D]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F3FA] text-[#0B3B59]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <span>Role-specific keyword density & skill gap analysis</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  window.location.href = PRICING_URL;
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B3B59] to-[#082F49] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:from-[#0E4A6F] hover:to-[#0B3B59] active:translate-y-0.5 cursor-pointer"
              >
                <span>Upgrade Pack & Unlock</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2 text-xs font-bold text-[#64748B] hover:text-[#0B3B59] transition cursor-pointer"
              >
                Continue with Basic ATS Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportTypeSelector;


