import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, GripHorizontal, X } from "lucide-react";

const STEPS = [
  {
    target: '[data-tour="game-profiles"]',
    eyebrow: "Choose a challenge",
    title: "Select a resume category",
    description: "Choose the profession you want to practise. Every category uses a different professional resume design and can be completed once for a reward.",
  },
  {
    target: '[data-tour="game-inventory"]',
    eyebrow: "Step 1",
    title: "Pick a resume data block",
    description: "Your resume details begin here. Select a block to inspect it, or drag it directly toward the correct place on the resume.",
  },
  {
    target: '[data-tour="game-staging"]',
    eyebrow: "Step 2",
    title: "Review the staged content",
    description: "The staging panel previews the selected information. Drag the prepared block from here onto its matching destination.",
  },
  {
    target: '[data-tour="game-canvas"]',
    eyebrow: "Build the resume",
    title: "Complete the professional template",
    description: "Drop each block into the matching outlined area. Correct placements build the resume and increase your score and progress.",
  },
  {
    target: '[data-tour="game-progress"]',
    eyebrow: "Your results",
    title: "Track progress, score, and rewards",
    description: "Progress shows how much of the active resume is complete. Your total score carries across challenges, and each completed resume can award 500 tokens.",
  },
  {
    target: '[data-tour="game-tools"]',
    eyebrow: "Game controls",
    title: "Preview and personalise the game",
    description: "Preview the finished A4 resume, control sound and volume, switch the visual theme, or reset the current unfinished challenge.",
  },
  {
    target: '[data-tour="game-create-cv"]',
    eyebrow: "Ready for the real thing?",
    title: "Generate your ATS-friendly CV",
    description: "When you are ready to build your own resume, use this shortcut to open the CareerSense CV builder.",
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ResumeGameTour({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const closeRef = useRef(null);
  const dragRef = useRef(null);
  const step = STEPS[stepIndex];

  useEffect(() => {
    if (!open) return undefined;
    setStepIndex(0);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => setDragOffset({ x: 0, y: 0 }), [open, stepIndex]);

  useEffect(() => {
    if (!open) return undefined;
    const target = document.querySelector(step.target);
    target?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    const update = () => {
      const element = document.querySelector(step.target);
      if (!element || element.offsetParent === null) return setTargetRect(null);
      const box = element.getBoundingClientRect();
      const pad = 7;
      setTargetRect({
        top: Math.max(7, box.top - pad),
        left: Math.max(7, box.left - pad),
        right: Math.min(window.innerWidth - 7, box.right + pad),
        bottom: Math.min(window.innerHeight - 7, box.bottom + pad),
        width: box.width + pad * 2,
        height: box.height + pad * 2,
      });
    };

    const timer = window.setTimeout(update, 260);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, step.target]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setStepIndex((value) => Math.min(value + 1, STEPS.length - 1));
      if (event.key === "ArrowLeft") setStepIndex((value) => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const basePosition = useMemo(() => {
    const width = Math.min(380, window.innerWidth - 32);
    if (!targetRect) return { left: Math.max(16, (window.innerWidth - width) / 2), top: Math.max(16, (window.innerHeight - 300) / 2), width };
    const below = window.innerHeight - targetRect.bottom >= 255;
    return {
      left: clamp(targetRect.left, 16, window.innerWidth - width - 16),
      top: below ? targetRect.bottom + 12 : Math.max(16, targetRect.top - 235),
      width,
    };
  }, [targetRect]);

  const startDrag = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, offset: dragOffset };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event) => {
    const drag = dragRef.current;
    const card = cardRef.current;
    if (!drag || drag.id !== event.pointerId || !card) return;
    setDragOffset({
      x: clamp(drag.offset.x + event.clientX - drag.x, 8 - basePosition.left, window.innerWidth - basePosition.left - card.offsetWidth - 8),
      y: clamp(drag.offset.y + event.clientY - drag.y, 8 - basePosition.top, window.innerHeight - basePosition.top - card.offsetHeight - 8),
    });
  };
  const stopDrag = (event) => {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (!open) return null;
  const last = stepIndex === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[150]" role="dialog" aria-modal="true" aria-labelledby="resume-game-tour-title">
      {targetRect ? (
        <>
          <div className="absolute inset-x-0 top-0 bg-[#031D2D]/76 backdrop-blur-[1px]" style={{ height: targetRect.top }} />
          <div className="absolute left-0 bg-[#031D2D]/76 backdrop-blur-[1px]" style={{ top: targetRect.top, width: targetRect.left, height: targetRect.height }} />
          <div className="absolute right-0 bg-[#031D2D]/76 backdrop-blur-[1px]" style={{ top: targetRect.top, left: targetRect.right, height: targetRect.height }} />
          <div className="absolute inset-x-0 bottom-0 bg-[#031D2D]/76 backdrop-blur-[1px]" style={{ top: targetRect.bottom }} />
          <div className="pointer-events-none absolute rounded-[14px] border-2 border-[#EDBC50] shadow-[0_0_0_4px_rgba(237,188,80,.2)]" style={{ top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height }} />
        </>
      ) : <div className="absolute inset-0 bg-[#031D2D]/76 backdrop-blur-[2px]" />}

      <section ref={cardRef} className="absolute max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] border border-[#D8B35D] bg-[#FFF9EC] text-[#0B3550] shadow-[0_28px_80px_rgba(2,24,38,.38)]" style={{ ...basePosition, transform: `translate3d(${dragOffset.x}px,${dragOffset.y}px,0)` }}>
        <div className="h-1 bg-[#D79A28]" />
        <div className="flex touch-none select-none cursor-grab items-center justify-center gap-2 border-b border-[#E8DDC7] bg-[#F7EEDC] py-1.5 text-[9px] font-black uppercase tracking-[.13em] text-[#6F8795] active:cursor-grabbing" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
          <GripHorizontal size={14} /> Drag to move
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#A86D12]">{step.eyebrow}</p>
              <h2 id="resume-game-tour-title" className="mt-2 text-[21px] font-black leading-tight tracking-[-.02em]">{step.title}</h2>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close Resume Quest tour" className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border border-[#D5DFE4] bg-white text-[#4D6D7F] hover:bg-[#F2EEE6]"><X size={16} /></button>
          </div>
          <p className="mt-3 text-[13px] font-medium leading-6 text-[#557486]">{step.description}</p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E5DCCB] pt-4">
            <span className="text-[10px] font-black uppercase tracking-[.14em] text-[#8298A5]">{stepIndex + 1} of {STEPS.length}</span>
            <div className="flex items-center gap-2">
              {stepIndex ? <button type="button" onClick={() => setStepIndex((value) => value - 1)} className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#CBD9E1] bg-white px-4 text-[11px] font-black text-[#385A6D]"><ArrowLeft size={14} /> Back</button> : <button type="button" onClick={onClose} className="h-10 px-2 text-[11px] font-black text-[#6C8492]">Skip</button>}
              <button type="button" onClick={last ? onClose : () => setStepIndex((value) => value + 1)} className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#0A3B59] px-4 text-[11px] font-black text-white">
                {last ? <><Check size={14} /> Finish</> : <>Next <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
