import React, { useEffect, useState, useRef } from "react";
import useResumeStore from "../../store/useResumeStore";
import { getResumeLayout, updateResumeLine } from "../../services/resumeApi";
import { rewriteLine } from "../../services/aiApi";
import { debounce } from "../../utils/debounce";
import { Sparkles, Loader2, Check, X, Wand2 } from "lucide-react";

function InteractiveOverlayEditor({ resumeId, highlightedLineId }) {
  const layout = useResumeStore((state) => state.layout);
  const setLayout = useResumeStore((state) => state.setLayout);
  const updateLayoutBlockLocally = useResumeStore((state) => state.updateLayoutBlockLocally);
  const currentResume = useResumeStore((state) => state.currentResume);
  
  const [loading, setLoading] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const textareaRef = useRef(null);

  // AI Suggestion states
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Debounced auto-save to backend
  const debouncedSave = useRef(
    debounce(async (blockId, text) => {
      try {
        await updateResumeLine(resumeId, blockId, { text });
      } catch (err) {
        console.error("Failed to auto-save block:", err);
      }
    }, 800)
  ).current;

  useEffect(() => {
    async function fetchLayout() {
      if (!resumeId) return;
      setLoading(true);
      try {
        const response = await getResumeLayout(resumeId);
        setLayout(response.data);
      } catch (err) {
        console.error("Error fetching coordinate layout:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLayout();
  }, [resumeId, setLayout]);

  useEffect(() => {
    if (activeBlockId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeBlockId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0a66c2]" />
        <span className="ml-3 text-slate-500 font-medium animate-pulse">Extracting coordinate layout...</span>
      </div>
    );
  }

  if (!layout || !layout.pages || layout.pages.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-slate-900">No coordinate layout detected</h3>
        <p className="mt-1 text-sm text-slate-500">We couldn't extract coordinates for this file format.</p>
      </div>
    );
  }

  const handleBlockClick = (block) => {
    setActiveBlockId(block.block_id);
    setEditingText(block.text);
  };

  const handleInputChange = (blockId, val) => {
    setEditingText(val);
    updateLayoutBlockLocally(blockId, val);
    debouncedSave(blockId, val);
  };

  const handleBlur = (e) => {
    // Check if the blur happened because the user clicked on the AI Polish sparkles button
    if (e.relatedTarget && e.relatedTarget.closest(".ai-polish-btn")) {
      return;
    }
    setActiveBlockId(null);
  };

  // Call the AI Polish route
  const handleAiPolishClick = async (block, e) => {
    e.stopPropagation();
    setSelectedBlock(block);
    setShowAiModal(true);
    setAiLoading(true);
    setAiSuggestion(null);

    try {
      const response = await rewriteLine({
        resume_id: resumeId,
        line_id: block.block_id,
        line_text: block.text,
        target_role: currentResume?.target_role || "Professional Candidate"
      });
      setAiSuggestion(response.data);
    } catch (err) {
      console.error("AI Polish failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiPolish = async () => {
    if (!selectedBlock || !aiSuggestion) return;
    const PolishText = aiSuggestion.rewritten_line;

    updateLayoutBlockLocally(selectedBlock.block_id, PolishText);
    try {
      await updateResumeLine(resumeId, selectedBlock.block_id, { text: PolishText });
    } catch (err) {
      console.error("Failed to save AI Polish text:", err);
    }

    setShowAiModal(false);
    setSelectedBlock(null);
    setAiSuggestion(null);
  };

  return (
    <div className="space-y-6 overflow-auto bg-slate-100 p-6 flex flex-col items-center relative w-full">
      <div className="mb-2 text-center max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 mb-2 border border-blue-100 shadow-xs">
          <Wand2 className="h-3 w-3" />
          Interactive A4 Workspace
        </div>
        <h3 className="text-base font-bold text-slate-800">SaaS Live Canvas Editor</h3>
        <p className="text-xs text-slate-500 mt-1">
          Click directly on any text block on this A4 canvas to edit, format, or improve it live!
        </p>
      </div>
      
      {layout.pages.map((page) => (
        <div
          key={page.page_number}
          className="relative bg-white shadow-xl border border-slate-300 rounded-sm mb-8 shrink-0 overflow-hidden"
          style={{
            width: `${page.width}px`,
            height: `${page.height}px`,
          }}
        >
          {page.text_blocks.map((block) => {
            const isEditing = activeBlockId === block.block_id;
            const isHighlighted = highlightedLineId === block.block_id;
            const isLowScore = block.score < 70;
            
            return (
              <div
                key={block.block_id}
                onClick={() => handleBlockClick(block)}
                className={`absolute cursor-pointer border rounded-xs transition-all duration-200 group ${
                  isEditing 
                    ? "border-[#0a66c2] bg-blue-50/70 z-30 shadow-md ring-2 ring-blue-100" 
                    : isHighlighted 
                      ? "border-amber-400 bg-amber-100/40 z-20" 
                      : isLowScore 
                        ? "border-rose-300 hover:bg-rose-50/20" 
                        : "border-transparent hover:border-slate-300 hover:bg-slate-50/20"
                }`}
                style={{
                  left: `${block.x}px`,
                  top: `${block.y}px`,
                  width: `${block.width}px`,
                  height: `${block.height + 4}px`,
                }}
              >
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={editingText}
                    onBlur={handleBlur}
                    onChange={(e) => handleInputChange(block.block_id, e.target.value)}
                    className="w-full h-full p-0 border-0 outline-none resize-none bg-transparent font-medium"
                    style={{
                      fontSize: `${block.font_size}px`,
                      fontFamily: block.font_family,
                      lineHeight: "1.2",
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full overflow-hidden text-slate-800 whitespace-pre-wrap select-text leading-tight"
                    style={{
                      fontSize: `${block.font_size}px`,
                      fontFamily: block.font_family,
                    }}
                  >
                    {block.text}
                  </div>
                )}

                {/* AI Polish Trigger Button */}
                {!isEditing && (
                  <button
                    type="button"
                    onClick={(e) => handleAiPolishClick(block, e)}
                    className="ai-polish-btn absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded bg-[#0a66c2] text-white shadow-md hover:bg-blue-700 z-10 transition duration-150"
                    title="Improve with AI"
                  >
                    <Sparkles className="h-3 w-3" />
                  </button>
                )}

                {isLowScore && !isEditing && (
                  <span className="absolute -top-3.5 -right-1 text-[8px] px-1 bg-rose-500 text-white rounded-full font-bold shadow-xs">
                    {block.score}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* AI Suggestion Dialog Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] transition-all duration-300">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a66c2] to-blue-700 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse text-yellow-300" />
                <h4 className="font-bold text-base">Billion-Dollar AI Polish</h4>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAiModal(false)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="h-10 w-10 animate-spin text-[#0a66c2]" />
                  <p className="text-sm font-semibold text-slate-700">Writing recruiter-grade optimizations...</p>
                  <p className="text-xs text-slate-400">Quantifying metrics, injecting action verbs, and aligning keywords</p>
                </div>
              ) : aiSuggestion ? (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original Text</h5>
                    <p className="mt-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                      "{selectedBlock?.text}"
                    </p>
                  </div>

                  <div className="p-0.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md">
                    <div className="bg-white rounded-md p-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <h5 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">AI Suggested Polish</h5>
                      </div>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">
                        "{aiSuggestion.rewritten_line}"
                      </p>
                    </div>
                  </div>

                  {aiSuggestion.reason && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-blue-900">Why it's better: </span>
                      {aiSuggestion.reason}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <X className="h-10 w-10 text-rose-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Optimization failed</p>
                  <p className="text-xs text-slate-400 mt-1">We couldn't rewrite this block. Please try again or edit it manually.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              {aiSuggestion && (
                <button
                  type="button"
                  onClick={applyAiPolish}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  Apply Polish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveOverlayEditor;
