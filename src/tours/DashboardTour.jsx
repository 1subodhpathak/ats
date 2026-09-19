import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, GripHorizontal, X } from "lucide-react";

const TOUR_STEPS = [
  {
    target: '[data-tour="dashboard-overview"]',
    eyebrow: "Your workspace",
    title: "Welcome to your dashboard",
    description: "This is your CareerSense command centre. See your recent activity, stored career documents, reports, and account usage in one place.",
  },
  {
    target: '[data-tour="dashboard-stats"]',
    eyebrow: "At a glance",
    title: "Track your progress",
    description: "These cards show how many ATS reports, resumes, and job descriptions you have saved, along with your profile completion.",
  },
  {
    target: '[data-tour="dashboard-actions"]',
    eyebrow: "Quick actions",
    title: "Start your next application check",
    description: "Run a new ATS analysis or upload another resume directly from here whenever you are preparing for a role.",
  },
  {
    target: '[data-tour="dashboard-recent-reports"]',
    eyebrow: "Report history",
    title: "Return to recent ATS reports",
    description: "Open your latest analyses, review scores, and continue working from reports you previously generated.",
  },
  {
    target: '[data-tour="dashboard-nav-sources"]',
    eyebrow: "Reusable files",
    title: "Manage your data sources",
    description: "Data Sources contains the resumes and job descriptions saved in your workspace, ready to reuse for future checks.",
  },
  {
    target: '[data-tour="dashboard-nav-billing"]',
    eyebrow: "Account usage",
    title: "Understand tokens and billing",
    description: "Usage & Billing explains your token balance, estimated cost, plan details, and activity history.",
  },
  {
    target: '[data-tour="dashboard-nav-profile"]',
    eyebrow: "Your account",
    title: "Keep your profile up to date",
    description: "Profile Settings is where you review and update the personal and professional details connected to your account.",
  },
];

const EMPTY_RECT = { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function DashboardTour({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const closeButtonRef = useRef(null);
  const cardRef = useRef(null);
  const dragRef = useRef(null);
  const step = TOUR_STEPS[stepIndex];

  useEffect(() => {
    if (!open) return undefined;
    setStepIndex(0);
    window.setTimeout(() => closeButtonRef.current?.focus(), 50);
    return undefined;
  }, [open]);

  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
  }, [open, stepIndex]);

  useEffect(() => {
    if (!open) return undefined;

    const target = document.querySelector(step.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    const updatePosition = () => {
      const element = document.querySelector(step.target);
      if (!element || element.offsetParent === null) {
        setTargetRect(null);
        return;
      }
      const rect = element.getBoundingClientRect();
      const padding = 8;
      setTargetRect({
        top: Math.max(8, rect.top - padding),
        left: Math.max(8, rect.left - padding),
        right: Math.min(window.innerWidth - 8, rect.right + padding),
        bottom: Math.min(window.innerHeight - 8, rect.bottom + padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    };

    const timer = window.setTimeout(updatePosition, 280);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, step.target]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setStepIndex((current) => Math.min(current + 1, TOUR_STEPS.length - 1));
      if (event.key === "ArrowLeft") setStepIndex((current) => Math.max(current - 1, 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const tooltipBase = useMemo(() => {
    const tooltipWidth = Math.min(380, window.innerWidth - 32);
    if (!targetRect) {
      return {
        left: Math.max(16, (window.innerWidth - tooltipWidth) / 2),
        top: Math.max(16, (window.innerHeight - 300) / 2),
        width: tooltipWidth,
      };
    }
    const placeBelow = window.innerHeight - targetRect.bottom >= 260;
    return {
      left: clamp(targetRect.left, 16, window.innerWidth - tooltipWidth - 16),
      top: placeBelow ? targetRect.bottom + 14 : Math.max(16, targetRect.top - 238),
      width: tooltipWidth,
    };
  }, [targetRect]);

  const tooltipStyle = {
    ...tooltipBase,
    transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
  };

  const startDragging = (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: dragOffset.x,
      originY: dragOffset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragCard = (event) => {
    const drag = dragRef.current;
    const card = cardRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !card) return;

    const nextX = drag.originX + event.clientX - drag.startX;
    const nextY = drag.originY + event.clientY - drag.startY;
    setDragOffset({
      x: clamp(nextX, 8 - tooltipBase.left, window.innerWidth - tooltipBase.left - card.offsetWidth - 8),
      y: clamp(nextY, 8 - tooltipBase.top, window.innerHeight - tooltipBase.top - card.offsetHeight - 8),
    });
  };

  const stopDragging = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (!open) return null;

  const rect = targetRect || EMPTY_RECT;
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-labelledby="dashboard-tour-title">
      {targetRect ? (
        <>
          <div className="absolute inset-x-0 top-0 bg-[#041F31]/72 backdrop-blur-[1px]" style={{ height: rect.top }} />
          <div className="absolute left-0 bg-[#041F31]/72 backdrop-blur-[1px]" style={{ top: rect.top, width: rect.left, height: rect.height }} />
          <div className="absolute right-0 bg-[#041F31]/72 backdrop-blur-[1px]" style={{ top: rect.top, left: rect.right, height: rect.height }} />
          <div className="absolute inset-x-0 bottom-0 bg-[#041F31]/72 backdrop-blur-[1px]" style={{ top: rect.bottom }} />
          <div className="pointer-events-none absolute rounded-[16px] border-2 border-[#EDBC50] shadow-[0_0_0_4px_rgba(237,188,80,.18)]" style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#041F31]/72 backdrop-blur-[2px]" />
      )}

      <section
        ref={cardRef}
        className="absolute max-w-[calc(100vw-32px)] overflow-hidden rounded-[18px] border border-[#E4D5B7] bg-[#FFFDF8] text-[#0B3550] shadow-[0_24px_70px_rgba(3,28,44,.32)]"
        style={tooltipStyle}
      >
        <div className="h-1 bg-[#D79A28]" />
        <div
          className="flex touch-none select-none items-center justify-center gap-2 border-b border-[#E9E1D5] bg-[#F8F3E9] py-1.5 text-[9px] font-black uppercase tracking-[0.13em] text-[#78909D] cursor-grab active:cursor-grabbing"
          onPointerDown={startDragging}
          onPointerMove={dragCard}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          aria-label="Drag tour card"
        >
          <GripHorizontal size={14} aria-hidden="true" />
          Drag to move
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A86D12]">{step.eyebrow}</p>
              <h2 id="dashboard-tour-title" className="mt-2 text-[21px] font-black leading-tight tracking-[-0.02em] text-[#0B3550]">{step.title}</h2>
            </div>
            <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close dashboard tour" className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border border-[#D8E2E7] bg-[#F5F2EB] text-[#4D6D7F] transition hover:bg-[#ECE6DB]">
              <X size={16} />
            </button>
          </div>

          <p className="mt-3 text-[13px] font-medium leading-6 text-[#557486]">{step.description}</p>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E7E0D5] pt-4">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8298A5]">{stepIndex + 1} of {TOUR_STEPS.length}</span>
            <div className="flex items-center gap-2">
              {stepIndex > 0 ? (
                <button type="button" onClick={() => setStepIndex((current) => current - 1)} className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#CBD9E1] bg-white px-4 text-[11px] font-black text-[#385A6D] transition hover:bg-[#F4F7F8]">
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <button type="button" onClick={onClose} className="h-10 px-2 text-[11px] font-black text-[#6C8492] transition hover:text-[#0B3550]">Skip tour</button>
              )}
              <button type="button" onClick={isLast ? onClose : () => setStepIndex((current) => current + 1)} className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#0A3B59] px-4 text-[11px] font-black text-white shadow-[0_8px_18px_rgba(10,59,89,.18)] transition hover:bg-[#0D4A6D]">
                {isLast ? <><Check size={14} /> Finish</> : <>Next <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
