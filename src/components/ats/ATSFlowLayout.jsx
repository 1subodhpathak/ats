import { Clock3, FolderOpen, Shield, UploadCloud } from "lucide-react";

import AnimatedHeroBackground from "../layout/AnimatedHeroBackground";

export const flowColors = {
  cream: "#F6F1EA",
  border: "#CFE0EC",
  dark: "#2F4054",
  muted: "#5C8194",
  softBlue: "#E7F0F8",
};

export function ATSFlowShell({
  children,
  maxWidth = "1420px",
  compact = false,
}) {
  return (
    <main
      className="relative isolate w-full overflow-x-hidden lg:h-[calc(100vh-72px)] lg:overflow-hidden"
      style={{ backgroundColor: flowColors.cream }}
    >
      <AnimatedHeroBackground />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(231,240,248,0.24) 0%, rgba(246,241,234,0.52) 48%, rgba(246,241,234,0.92) 100%)",
        }}
      />

      <section
        className={`relative z-10 mx-auto grid h-full px-4 py-4 lg:grid-cols-[0.72fr_1fr] ${
          compact ? "gap-3 lg:gap-3.5 lg:px-4 lg:py-3.5" : "gap-4 lg:gap-5 lg:px-5 lg:py-5"
        }`}
        style={{ maxWidth }}
      >
        {children}
      </section>
    </main>
  );
}

export function ATSInfoPanel({
  icon: Icon,
  label,
  title,
  description,
  bullets,
  note,
  footer,
  compact = false,
}) {
  return (
    <aside
      className="flex h-full flex-col bg-white"
      style={{
        border: `1px solid ${flowColors.border}`,
        borderRadius: "24px",
        boxShadow: "0 18px 40px rgba(16,36,90,0.07)",
        padding: compact ? "19px" : "28px",
      }}
    >
      <div
        className={`flex items-center justify-center ${compact ? "h-12 w-12 rounded-[16px]" : "h-16 w-16 rounded-[20px]"}`}
        style={{
          backgroundColor: flowColors.softBlue,
          color: flowColors.dark,
        }}
      >
        <Icon className={compact ? "h-6 w-6" : "h-8 w-8"} />
      </div>

      <p
        className={`${compact ? "mt-5 text-[9px]" : "mt-8 text-[11px]"} font-black uppercase tracking-[0.2em]`}
        style={{ color: flowColors.muted }}
      >
        {label}
      </p>

      <h1
        className={`${compact ? "mt-2 max-w-[11ch] text-[2.25rem]" : "mt-3 max-w-[12ch] text-[3.3rem]"} font-black leading-[0.96] tracking-[-0.05em]`}
        style={{ color: flowColors.dark }}
      >
        {title}
      </h1>

      <p
        className={`${compact ? "mt-3.5 max-w-[24ch] text-[0.82rem] leading-6" : "mt-5 max-w-[22ch] text-[1.02rem] leading-9"} font-medium`}
        style={{ color: flowColors.muted }}
      >
        {description}
      </p>

      <div className={compact ? "mt-6 space-y-4" : "mt-10 space-y-6"}>
        {bullets.map((bullet) => (
          <div key={bullet.title} className={`flex ${compact ? "gap-3" : "gap-4"}`}>
            <div
              className={`mt-1 flex shrink-0 items-center justify-center rounded-full border bg-white ${compact ? "h-5.5 w-5.5" : "h-7 w-7"}`}
              style={{ borderColor: "#BFD2DF", color: flowColors.muted }}
            >
              <Shield className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
            </div>
            <div>
              <h2
                className={`${compact ? "text-[0.92rem]" : "text-[1.15rem]"} font-black tracking-tight`}
                style={{ color: flowColors.dark }}
              >
                {bullet.title}
              </h2>
              <p
                className={`${compact ? "mt-1 max-w-[33ch] text-[0.8rem] leading-6" : "mt-2 max-w-[31ch] text-[0.98rem] leading-8"} font-medium`}
                style={{ color: flowColors.muted }}
              >
                {bullet.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {footer ? (
        <div
          className="mt-auto rounded-[20px] border"
          style={{
            borderColor: flowColors.border,
            backgroundColor: "rgba(246,241,234,0.82)",
            padding: compact ? "16px 18px" : "20px 22px",
          }}
        >
          {footer}
        </div>
      ) : null}

      {note ? (
        <div
          className="mt-auto rounded-[20px] border"
          style={{
            borderColor: flowColors.border,
            backgroundColor: "rgba(246,241,234,0.82)",
            padding: compact ? "12px 14px" : "18px 20px",
          }}
        >
          <div className="flex gap-3">
            <Shield className={`${compact ? "mt-0.5 h-3.5 w-3.5" : "mt-1 h-4 w-4"} shrink-0`} style={{ color: flowColors.dark }} />
            <p
              className={`${compact ? "text-[0.78rem] leading-5.5" : "text-[0.96rem] leading-8"} font-medium`}
              style={{ color: flowColors.dark }}
            >
              {note}
            </p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export function ATSUploadPanel({
  title,
  subtitle,
  description,
  helperText,
  onChooseFile,
  accept,
  disabled,
  fileName,
  compact = false,
}) {
  return (
    <div
      className="bg-white"
      style={{
        border: `1px solid ${flowColors.border}`,
        borderRadius: "24px",
        boxShadow: "0 18px 40px rgba(16,36,90,0.07)",
        padding: compact ? "18px" : "26px",
      }}
    >
      <h2
        className={`${compact ? "text-[2rem]" : "text-[3rem]"} font-black leading-none tracking-[-0.05em]`}
        style={{ color: flowColors.dark }}
      >
        {title}
      </h2>
      <p
        className={`${compact ? "mt-2 text-[0.8rem] leading-6" : "mt-3 text-[1.04rem] leading-8"} font-medium`}
        style={{ color: flowColors.muted }}
      >
        {subtitle}
      </p>

      <UploadDropZone
        accept={accept}
        description={description}
        disabled={disabled}
        fileName={fileName}
        helperText={helperText}
        onChooseFile={onChooseFile}
        compact={compact}
      />
    </div>
  );
}

export function UploadDropZone({
  description,
  helperText,
  onChooseFile,
  accept,
  disabled,
  fileName,
  compact = false,
}) {
  return (
    <>
      <label
        className={`${compact ? "mt-4 rounded-[24px] px-5 py-7" : "mt-7 rounded-[32px] px-8 py-11"} flex cursor-pointer flex-col items-center border-2 border-dashed text-center transition hover:-translate-y-0.5`}
        style={{
          borderColor: flowColors.border,
          backgroundColor: "rgba(246,241,234,0.32)",
          opacity: disabled ? 0.65 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => onChooseFile(event.target.files?.[0] || null)}
        />
        <div
          className={`flex items-center justify-center bg-white shadow-[0_16px_34px_rgba(16,36,90,0.08)] ${compact ? "h-16 w-16 rounded-[20px]" : "h-24 w-24 rounded-[28px]"}`}
          style={{ color: flowColors.dark }}
        >
          <UploadCloud className={compact ? "h-8 w-8" : "h-12 w-12"} />
        </div>
        <h3
          className={`${compact ? "mt-5 text-[1.45rem]" : "mt-8 text-[2.15rem]"} font-black leading-tight tracking-[-0.04em]`}
          style={{ color: flowColors.dark }}
        >
          {fileName || description}
        </h3>
        <p
          className={`${compact ? "mt-2.5 max-w-[36ch] text-[0.8rem] leading-6" : "mt-4 max-w-[34ch] text-[1rem] leading-8"} font-medium`}
          style={{ color: flowColors.muted }}
        >
          {fileName ? "This file is selected and ready to use." : helperText}
        </p>
      </label>
    </>
  );
}

export function ATSStoredListCard({
  title,
  description,
  items,
  selectedId,
  onUse,
  emptyText,
  itemLabel,
  maxHeight = "190px",
  compact = false,
}) {
  return (
    <div
      className="bg-white"
      style={{
        border: `1px solid ${flowColors.border}`,
        borderRadius: "24px",
        boxShadow: "0 18px 40px rgba(16,36,90,0.05)",
        padding: compact ? "14px" : "20px",
      }}
    >
      <div className={`flex items-start ${compact ? "gap-2.5" : "gap-3"}`}>
        <FolderOpen className={`${compact ? "mt-0.5 h-4 w-4" : "mt-1 h-5 w-5"} shrink-0`} style={{ color: flowColors.muted }} />
        <div>
          <h3
            className={`${compact ? "text-[1rem]" : "text-[1.35rem]"} font-black tracking-tight`}
            style={{ color: flowColors.dark }}
          >
            {title}
          </h3>
          <p
            className={`${compact ? "mt-0.5 text-[0.76rem] leading-5.5" : "mt-1 text-[0.98rem] leading-7"} font-medium`}
            style={{ color: flowColors.muted }}
          >
            {description}
          </p>
        </div>
      </div>

      {items.length ? (
        <div
          className={`${compact ? "mt-3.5 space-y-2" : "mt-5 space-y-3"} overflow-y-auto pr-1`}
          style={{ maxHeight }}
        >
          {items.map((item) => {
            const isSelected = selectedId === item.id;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-4 rounded-[22px] border bg-white ${compact ? "px-3.5 py-2.5" : "px-5 py-4"}`}
                style={{
                  borderColor: isSelected ? "#A9C2D3" : flowColors.border,
                  boxShadow: isSelected
                    ? "0 14px 32px rgba(16,36,90,0.09)"
                    : "0 8px 20px rgba(16,36,90,0.04)",
                }}
              >
                <div className="min-w-0">
                  <p
                    className={`${compact ? "text-[0.88rem]" : "text-[1.05rem]"} truncate font-black tracking-tight`}
                    style={{ color: flowColors.dark }}
                  >
                    {item.title}
                  </p>
                  <div className={`${compact ? "mt-1.5" : "mt-2"} flex items-center gap-2`}>
                    <Clock3 className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} style={{ color: flowColors.muted }} />
                    <p
                      className={`${compact ? "text-[0.72rem]" : "text-[0.92rem]"} truncate font-medium`}
                      style={{ color: flowColors.muted }}
                    >
                      {itemLabel(item)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUse(item.id)}
                  className={`rounded-[16px] font-black transition hover:-translate-y-0.5 ${compact ? "px-3.5 py-2 text-[0.8rem]" : "px-5 py-3 text-[1rem]"}`}
                  style={{
                    backgroundColor: isSelected ? "#324863" : "#E7EFF5",
                    color: isSelected ? "#FFFFFF" : flowColors.dark,
                  }}
                >
                  {isSelected ? "Selected" : "Use"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`${compact ? "mt-3.5 px-4 py-5" : "mt-5 px-6 py-8"} rounded-[22px] border-2 border-dashed`}
          style={{
            borderColor: flowColors.border,
            backgroundColor: "rgba(255,255,255,0.72)",
          }}
        >
          <p
            className={`${compact ? "text-[0.78rem] leading-6" : "text-[1rem] leading-8"} font-medium`}
            style={{ color: flowColors.muted }}
          >
            {emptyText}
          </p>
        </div>
      )}
    </div>
  );
}
