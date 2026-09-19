import React from "react";
import { cleanCandidateName } from "../../utils/resumeParser";
import careerSenseLogo from "../../assets/logos/BlueLogo.png";
/* =========================================================
   HELPERS
========================================================= */

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function normalizeScore(score) {
  if (typeof score === "number") {
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  const parsed = parseInt(score, 10);

  return Number.isNaN(parsed)
    ? 0
    : Math.min(100, Math.max(0, parsed));
}

function formatReportDate(dateString) {
  const date = dateString
    ? new Date(dateString)
    : new Date();

  if (Number.isNaN(date.getTime())) {
    return dateString || "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function statusKey(status) {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("strong") ||
    value.includes("pass") ||
    value.includes("high") ||
    value.includes("match") ||
    value.includes("good")
  ) {
    return "strong";
  }

  if (
    value.includes("partial") ||
    value.includes("medium") ||
    value.includes("med")
  ) {
    return "partial";
  }

  if (
    value.includes("gap") ||
    value.includes("low") ||
    value.includes("critical") ||
    value.includes("missing") ||
    value.includes("error") ||
    value.includes("risk")
  ) {
    return "gap";
  }

  return "neutral";
}

function statusLabel(status) {
  const key = statusKey(status);

  if (key === "strong") return "STRONG";
  if (key === "partial") return "PARTIAL";
  if (key === "gap") return "GAP";

  return String(status || "REVIEW").toUpperCase();
}

function scoreBand(score) {
  const value = normalizeScore(score);

  if (value >= 85) {
    return {
      label: "Excellent Match",
      tone: "emerald",
      description:
        "Your resume is strongly aligned and requires only targeted refinements.",
    };
  }

  if (value >= 70) {
    return {
      label: "Good Match",
      tone: "gold",
      description:
        "The foundation is strong. A few targeted changes can materially improve your match.",
    };
  }

  if (value >= 55) {
    return {
      label: "Needs Improvement",
      tone: "amber",
      description:
        "Relevant experience exists, but the resume needs clearer evidence and stronger alignment.",
    };
  }

  return {
    label: "High-Priority Revision",
    tone: "rose",
    description:
      "Significant gaps may prevent the resume from performing well in ATS and recruiter screening.",
  };
}

/* =========================================================
   DESIGN TOKENS
========================================================= */

const BRAND = {
  navy: "#0D3557",
  navyDark: "#082B48",
  gold: "#C98A1D",
  goldSoft: "#FFF3D9",
  ivory: "#FAF7F0",
  ivory2: "#F5EFE5",
  blueSoft: "#EAF3F7",
  blue: "#4F8299",
  green: "#13866B",
  greenSoft: "#EAF7F2",
  coral: "#D95B55",
  coralSoft: "#FDEDEC",
  amber: "#B87A16",
  text: "#163B54",
  muted: "#6C8495",
  border: "#E3DDD3",
};

/* =========================================================
   PAGE WRAPPER
========================================================= */

function PrintPage({
  children,
  pageNumber,
  cover = false,
  footerLabel = "CareerSense ATS Intelligence",
}) {
  return (
    <section
      className="
        relative
        mx-auto
        flex
        flex-col
        overflow-hidden
        bg-[#FAF7F0]
        text-[#163B54]
        print:mx-auto
        print:my-0
      "
      style={{
        boxSizing: "border-box",
        width: "210mm",
        height: "297mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {/* top brand rail */}
      <div className="h-[5px] w-full shrink-0 bg-[#0D3557]" />

      <div
        className={cx(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden",
          cover ? "px-[13mm] py-[12mm]" : "px-[11mm] py-[9mm]"
        )}
      >
        {/* decorative arcs */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[42mm]
            -top-[42mm]
            h-[88mm]
            w-[88mm]
            rounded-full
            border
            border-[#C98A1D]/15
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-[50mm]
            -left-[48mm]
            h-[92mm]
            w-[92mm]
            rounded-full
            border
            border-[#C98A1D]/10
          "
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {children}
        </div>

        {!cover && (
          <footer
            className="
              relative
              z-10
              mt-3
              flex
              shrink-0
              items-center
              justify-between
              border-t
              border-[#E3DDD3]
              pt-2.5
            "
          >
            <div className="flex items-center gap-2">
              <img
                src={careerSenseLogo}
                alt="CareerSense"
                className="h-[24px] w-[24px] shrink-0 object-contain"
              />

              <div>
                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[#0D3557]
                  "
                >
                  CareerSense
                </p>

                <p className="text-[7.5px] font-medium text-[#8799A4]">
                  {footerLabel}
                </p>
              </div>
            </div>

            <span
              className="
                rounded-full
                bg-[#EEE8DE]
                px-2.5
                py-1
                text-[8px]
                font-bold
                text-[#607A8B]
              "
            >
              {pageNumber}
            </span>
          </footer>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   BRAND MARK
========================================================= */

function BrandMark({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={careerSenseLogo}
        alt="CareerSense"
        className="h-[38px] w-[38px] shrink-0 object-contain"
      />

      <div>
        <p
          className={cx(
            "text-[11px] font-black tracking-[-0.02em]",
            light ? "text-white" : "text-[#0D3557]"
          )}
        >
          Career<span className="text-[#C98A1D]">Sense</span>
        </p>

        <p
          className={cx(
            "text-[7px] font-black uppercase tracking-[0.20em]",
            light ? "text-white/55" : "text-[#8799A4]"
          )}
        >
          ATS Intelligence
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  right,
}) {
  return (
    <div
      className="
        mb-5
        flex
        shrink-0
        items-start
        justify-between
        gap-6
      "
    >
      <div className="max-w-[560px]">
        {eyebrow ? (
          <div className="flex items-center gap-2">
            <span className="h-px w-7 bg-[#C98A1D]" />

            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.23em]
                text-[#B47516]
              "
            >
              {eyebrow}
            </p>
          </div>
        ) : null}

        <h2
          className="
            mt-2
            text-[24px]
            font-black
            leading-[1.08]
            tracking-[-0.04em]
            text-[#0D3557]
          "
        >
          {title}
        </h2>

        {description ? (
          <p
            className="
              mt-2
              max-w-[550px]
              text-[10.5px]
              font-medium
              leading-[1.5]
              text-[#6C8495]
            "
          >
            {description}
          </p>
        ) : null}
      </div>

      {right}
    </div>
  );
}

/* =========================================================
   SCORE DONUT
========================================================= */

function ScoreDonut({
  score,
  size = 118,
  label = "ATS Score",
}) {
  const value = normalizeScore(score);

  const ringColor =
    value >= 80
      ? BRAND.green
      : value >= 60
      ? BRAND.gold
      : BRAND.coral;

  return (
    <div className="text-center">
      <div
        className="
          relative
          mx-auto
          flex
          items-center
          justify-center
          rounded-full
        "
        style={{
          width: size,
          height: size,
          background: `conic-gradient(
            ${ringColor} 0deg,
            ${ringColor} ${value * 3.6}deg,
            #ECE8E0 ${value * 3.6}deg,
            #ECE8E0 360deg
          )`,
        }}
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            rounded-full
            bg-[#FAF7F0]
          "
          style={{
            width: size - 18,
            height: size - 18,
          }}
        >
          <div className="flex items-end gap-1">
            <span
              className="
                text-[33px]
                font-black
                leading-none
                tracking-[-0.06em]
                text-[#0D3557]
              "
            >
              {value}
            </span>

            <span
              className="
                mb-1
                text-[11px]
                font-black
                text-[#8B9CA7]
              "
            >
              /100
            </span>
          </div>

          <p
            className="
              mt-1
              text-[7.5px]
              font-black
              uppercase
              tracking-[0.16em]
              text-[#79909F]
            "
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({
  label,
  score,
  tone = "blue",
}) {
  const value = normalizeScore(score);

  const tones = {
    blue: {
      bg: "bg-[#EAF3F7]",
      text: "text-[#356E88]",
      bar: "bg-[#4F8299]",
    },
    gold: {
      bg: "bg-[#FFF3D9]",
      text: "text-[#A66B0D]",
      bar: "bg-[#C98A1D]",
    },
    green: {
      bg: "bg-[#EAF7F2]",
      text: "text-[#13866B]",
      bar: "bg-[#13866B]",
    },
    rose: {
      bg: "bg-[#FDEDEC]",
      text: "text-[#C54E49]",
      bar: "bg-[#D95B55]",
    },
  };

  const style = tones[tone] || tones.blue;

  return (
    <div
      className="
        rounded-[15px]
        border
        border-[#E4DED5]
        bg-white/80
        p-3
      "
    >
      <div className="flex items-end justify-between gap-3">
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.12em]
            text-[#78909F]
          "
        >
          {label}
        </p>

        <span
          className={cx(
            "text-[18px] font-black tracking-[-0.04em]",
            style.text
          )}
        >
          {value}%
        </span>
      </div>

      <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#ECE8E0]">
        <div
          className={cx(
            "h-full rounded-full",
            style.bar
          )}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
  children,
}) {
  const key = statusKey(
    children || status
  );

  const tones = {
    strong:
      "border-[#CBE8DD] bg-[#EAF7F2] text-[#13775F]",
    partial:
      "border-[#F0D69E] bg-[#FFF4DA] text-[#A76B0C]",
    gap:
      "border-[#F0C7C4] bg-[#FDEDEC] text-[#C54E49]",
    neutral:
      "border-[#DDE4E8] bg-[#F2F5F6] text-[#607A8B]",
  };

  return (
    <span
      className={cx(
        `
          inline-flex
          items-center
          justify-center
          rounded-full
          border
          px-2.5
          py-1
          text-[7.5px]
          font-black
          uppercase
          tracking-[0.08em]
        `,
        tones[key]
      )}
    >
      {statusLabel(
        children || status
      )}
    </span>
  );
}

/* =========================================================
   FINDING ROW
========================================================= */

function FindingRow({
  title,
  body,
  tone = "good",
}) {
  const toneStyles = {
    good: {
      icon: "✓",
      iconStyle:
        "bg-[#EAF7F2] text-[#13866B]",
    },
    warning: {
      icon: "!",
      iconStyle:
        "bg-[#FFF3D9] text-[#B87A16]",
    },
    bad: {
      icon: "!",
      iconStyle:
        "bg-[#FDEDEC] text-[#D95B55]",
    },
  };

  const style =
    toneStyles[tone] ||
    toneStyles.good;

  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-[14px]
        border
        border-[#E7E1D8]
        bg-white/75
        px-3
        py-2.5
      "
    >
      <div
        className={cx(
          `
            flex
            h-[26px]
            w-[26px]
            shrink-0
            items-center
            justify-center
            rounded-full
            text-[11px]
            font-black
          `,
          style.iconStyle
        )}
      >
        {style.icon}
      </div>

      <div>
        <p
          className="
            text-[10px]
            font-black
            leading-tight
            text-[#163B54]
          "
        >
          {title}
        </p>

        {body ? (
          <p
            className="
              mt-1
              text-[9px]
              font-medium
              leading-[1.45]
              text-[#748B9A]
            "
          >
            {body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* =========================================================
   BULLET LIST
========================================================= */

function BulletList({
  items,
  tone = "navy",
}) {
  if (!items?.length) {
    return null;
  }

  const bulletTone =
    tone === "gold"
      ? "bg-[#C98A1D]"
      : tone === "green"
      ? "bg-[#13866B]"
      : tone === "rose"
      ? "bg-[#D95B55]"
      : "bg-[#0D3557]";

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${index}-${String(item).slice(0, 20)}`}
          className="
            flex
            items-start
            gap-2.5
            text-[10px]
            font-medium
            leading-[1.5]
            text-[#526F82]
          "
        >
          <span
            className={cx(
              `
                mt-[6px]
                h-[5px]
                w-[5px]
                shrink-0
                rounded-full
              `,
              bulletTone
            )}
          />

          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   DATA TABLE
========================================================= */

function DataTable({
  columns,
  rows,
  compact = false,
}) {
  if (!rows?.length) {
    return null;
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-[15px]
        border
        border-[#E3DDD3]
        bg-white/85
      "
    >
      <table
        className="
          w-full
          table-fixed
          border-collapse
          text-left
        "
      >
        <thead>
          <tr className="bg-[#F3EEE6]">
            {columns.map((column) => (
              <th
                key={column.key}
                style={
                  column.width
                    ? {
                        width:
                          column.width,
                      }
                    : undefined
                }
                className="
                  border-b
                  border-[#E3DDD3]
                  px-3
                  py-2.5
                  text-[7.5px]
                  font-black
                  uppercase
                  tracking-[0.10em]
                  text-[#718796]
                "
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#ECE6DD]">
          {rows.map((row, rowIndex) => (
            <tr
              key={
                row.id ||
                rowIndex
              }
              className="align-top"
            >
              {columns.map(
                (column) => {
                  const value =
                    row[column.key];

                  return (
                    <td
                      key={
                        column.key
                      }
                      className={cx(
                        `
                          overflow-hidden
                          break-words
                          px-3
                          text-[#526F82]
                        `,
                        compact
                          ? "py-2 text-[8.5px] leading-[1.4]"
                          : "py-2.5 text-[9.5px] leading-[1.45]"
                      )}
                    >
                      {column.render ? (
                        column.render(
                          value,
                          row
                        )
                      ) : (
                        <span
                          className={
                            column.emphasis
                              ? "font-black text-[#163B54]"
                              : "font-medium"
                          }
                        >
                          {value !==
                            undefined &&
                          value !==
                            null &&
                          value !== ""
                            ? String(
                                value
                              )
                            : "—"}
                        </span>
                      )}
                    </td>
                  );
                }
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   SCORECARD ROW
========================================================= */

function ScoreRow({
  label,
  score,
}) {
  const value =
    normalizeScore(score);

  const bar =
    value >= 80
      ? "bg-[#13866B]"
      : value >= 60
      ? "bg-[#C98A1D]"
      : "bg-[#D95B55]";

  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-[12px]
        border
        border-[#E5DFD6]
        bg-white/80
        px-3
        py-2.5
      "
    >
      <p
        className="
          min-w-[145px]
          flex-1
          text-[9.5px]
          font-black
          text-[#163B54]
        "
      >
        {label}
      </p>

      <div className="w-[170px]">
        <div className="h-[5px] overflow-hidden rounded-full bg-[#ECE8E0]">
          <div
            className={cx(
              "h-full rounded-full",
              bar
            )}
            style={{
              width: `${value}%`,
            }}
          />
        </div>
      </div>

      <span
        className="
          min-w-[36px]
          text-right
          text-[11px]
          font-black
          text-[#0D3557]
        "
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   BEFORE / AFTER REWRITE
========================================================= */

function RewritePair({
  before,
  after,
  index,
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[17px]
        border
        border-[#E3DDD3]
        bg-white
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#ECE6DD]
          bg-[#F7F3EC]
          px-4
          py-2
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.12em]
            text-[#6D8595]
          "
        >
          Rewrite {String(index).padStart(2, "0")}
        </p>

        <span
          className="
            rounded-full
            bg-[#FFF3D9]
            px-2
            py-1
            text-[7px]
            font-black
            text-[#A66B0D]
          "
        >
          IMPACT + CLARITY
        </span>
      </div>

      <div
        className="
          grid
          divide-y
          divide-[#ECE6DD]

          sm:grid-cols-2
          sm:divide-x
          sm:divide-y-0
        "
      >
        <div className="p-4">
          <p
            className="
              text-[7.5px]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#C05A55]
            "
          >
            Before
          </p>

          <p
            className="
              mt-2
              text-[9.5px]
              font-medium
              leading-[1.55]
              text-[#6B7F8C]
            "
          >
            “{before}”
          </p>
        </div>

        <div className="bg-[#F4FBF8] p-4">
          <p
            className="
              text-[7.5px]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#13866B]
            "
          >
            CareerSense Rewrite
          </p>

          <p
            className="
              mt-2
              text-[9.5px]
              font-bold
              leading-[1.55]
              text-[#24495E]
            "
          >
            “{after}”
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN REPORT
========================================================= */

function ATSPrintReport({
  report,
  resume,
  candidateName: passedCandidateName,

  requirementCheckerPrimaryRows,
  requirementCheckerContinuationRows,

  parsingHealthRows,
  formattingRecommendations,
  requirementOutcomeSummary,

  scorecardRows,

  biReportingSection,
  aiMlSection,
  governanceSection,
  keywordCoverageSection,
  leadershipSection,
  experienceEvidenceSection,
  riskFlagsSection,
  rewriteSection,
  finalVerdictSection,

  dashboardOverallScore,
}) {
  const executive =
    report?.executive_summary || {};

  const candidateName =
    passedCandidateName
      ? cleanCandidateName(
          passedCandidateName
        )
      : cleanCandidateName(
          report?.candidate_name
        ) ||
        cleanCandidateName(
          resume?.candidate_name
        ) ||
        cleanCandidateName(
          report?.resume_file_name
        ) ||
        "Applicant Profile";

  const targetRole =
    report?.target_role ||
    report?.metadata?.target_role ||
    report?.job_description?.title ||
    report?.extracted_jd_data?.jd_profile
      ?.target_role ||
    resume?.target_role ||
    "Target role not specified";

  const targetCompany =
    report?.target_company ||
    report?.metadata?.target_company ||
    report?.job_description?.company ||
    report?.extracted_jd_data?.jd_profile
      ?.company ||
    "Target company not specified";

  const reportDate =
    formatReportDate(
      report?.created_at
    );

  const overall =
    normalizeScore(
      dashboardOverallScore
    );

  const currentScore =
    normalizeScore(
      finalVerdictSection?.currentScore ??
        dashboardOverallScore
    );

  const potentialScore =
    normalizeScore(
      finalVerdictSection?.potentialScore ??
        dashboardOverallScore
    );

  const scoreState =
    scoreBand(overall);

  const topFix =
    executive?.top_fixes?.[0];

  const summary =
    executive?.recommendation ||
    report?.summary ||
    "CareerSense identified targeted opportunities to improve resume clarity, ATS compatibility, and role alignment.";

  const primaryRequirements =
    safeArray(
      requirementCheckerPrimaryRows
    );

  const continuationRequirements =
    safeArray(
      requirementCheckerContinuationRows
    );

  const parsingRows =
    safeArray(
      parsingHealthRows
    );

  const scores =
    safeArray(scorecardRows);

  const risks =
    safeArray(riskFlagsSection);

  const matchedKeywords =
    safeArray(
      keywordCoverageSection
        ?.matchedKeywords
    );

  const missingKeywords =
    safeArray(
      keywordCoverageSection
        ?.missingWeak
    );

  const rewritePairs =
    safeArray(
      rewriteSection?.bulletPairs
    );

  const actionRows =
    safeArray(
      finalVerdictSection?.actionRows
    );

  const evidenceRows =
    safeArray(
      experienceEvidenceSection?.rows
    );

  const coverLetterText =
    report?.generated_cover_letter ||
    report?.cover_letter ||
    report?.cover_letter_text ||
    "";

  let pageCounter = 0;

  const nextPage = () => {
    pageCounter += 1;
    return pageCounter;
  };

  return (
    <div
      className="
        print-report-shell
        m-0
        p-0
        font-sans
        antialiased
        text-[#163B54]
      "
    >
      {/* =====================================================
          PAGE 1 — COVER
      ====================================================== */}

      <PrintPage cover>
        <div className="flex h-full flex-col">
          {/* brand */}
          <BrandMark />

          {/* main */}
          <div
            className="
              my-auto
              grid
              items-center
              gap-10
              lg:grid-cols-[1fr_185px]
            "
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#C98A1D]" />

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.23em]
                    text-[#B47516]
                  "
                >
                  ATS Resume Intelligence Report
                </p>
              </div>

              <h1
                className="
                  mt-5
                  max-w-[470px]
                  text-[43px]
                  font-black
                  leading-[0.99]
                  tracking-[-0.055em]
                  text-[#0D3557]
                "
              >
                Your resume.
                <br />
                <span className="text-[#C98A1D]">
                  Clearly evaluated.
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-[470px]
                  text-[12px]
                  font-medium
                  leading-[1.65]
                  text-[#6C8495]
                "
              >
                A recruiter-readiness and ATS optimization report covering
                structure, job alignment, keywords, evidence, risks, and the
                highest-impact improvements to make before applying.
              </p>

              <div
                className="
                  mt-8
                  grid
                  max-w-[500px]
                  grid-cols-2
                  gap-x-8
                  gap-y-5
                "
              >
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#8B9BA5]">
                    Prepared for
                  </p>

                  <p className="mt-1 text-[13px] font-black text-[#163B54]">
                    {candidateName}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#8B9BA5]">
                    Target role
                  </p>

                  <p className="mt-1 text-[11px] font-bold leading-tight text-[#163B54]">
                    {targetRole}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#8B9BA5]">
                    Target company
                  </p>

                  <p className="mt-1 text-[11px] font-bold text-[#163B54]">
                    {targetCompany}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#8B9BA5]">
                    Generated
                  </p>

                  <p className="mt-1 text-[11px] font-bold text-[#163B54]">
                    {reportDate}
                  </p>
                </div>
              </div>
            </div>

            {/* score */}
            <div
              className="
                rounded-[26px]
                border
                border-[#E2DBD0]
                bg-white/75
                p-5
                text-center
                shadow-[0_16px_45px_rgba(31,48,59,.06)]
              "
            >
              <ScoreDonut
                score={overall}
                size={142}
              />

              <p
                className="
                  mt-4
                  text-[13px]
                  font-black
                  text-[#0D3557]
                "
              >
                {scoreState.label}
              </p>

              <p
                className="
                  mt-2
                  text-[9px]
                  font-medium
                  leading-[1.5]
                  text-[#748B9A]
                "
              >
                {scoreState.description}
              </p>
            </div>
          </div>

          {/* cover footer */}
          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-[#E3DDD3]
              pt-4
            "
          >
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#8395A0]
              "
            >
              CareerSense ATS Intelligence
            </p>

            <p
              className="
                font-serif
                text-[11px]
                italic
                text-[#778C99]
              "
            >
              Better resumes. Brighter opportunities.
            </p>
          </div>
        </div>
      </PrintPage>

      {/* =====================================================
          PAGE 2 — EXECUTIVE DASHBOARD
      ====================================================== */}

      <PrintPage
        pageNumber={nextPage()}
        footerLabel="Executive Overview"
      >
        <SectionHeader
          eyebrow="Executive Overview"
          title="Your Resume at a Glance"
          description="The most important findings from your ATS and job-match analysis, summarized for quick decision-making."
          right={
            <div
              className="
                rounded-full
                bg-[#FFF3D9]
                px-3
                py-1.5
                text-[8px]
                font-black
                uppercase
                tracking-[0.09em]
                text-[#9E680E]
              "
            >
              {scoreState.label}
            </div>
          }
        />

        {/* score + summary */}
        <div
          className="
            grid
            gap-5
            rounded-[22px]
            border
            border-[#E3DDD3]
            bg-white/78
            p-5
            lg:grid-cols-[170px_1fr]
          "
        >
          <ScoreDonut
            score={overall}
            size={126}
          />

          <div className="flex flex-col justify-center">
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.14em]
                text-[#B47516]
              "
            >
              Hiring Readiness Summary
            </p>

            <h3
              className="
                mt-2
                text-[18px]
                font-black
                leading-[1.2]
                tracking-[-0.03em]
                text-[#0D3557]
              "
            >
              {finalVerdictSection?.verdictTitle ||
                executive?.decision_signal ||
                "Targeted improvements recommended before applying."}
            </h3>

            <p
              className="
                mt-3
                max-w-[500px]
                text-[10px]
                font-medium
                leading-[1.6]
                text-[#637E90]
              "
            >
              {summary}
            </p>
          </div>
        </div>

        {/* metrics */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <MiniMetric
            label="Overall ATS"
            score={overall}
            tone="gold"
          />

          <MiniMetric
            label="Current Match"
            score={currentScore}
            tone="blue"
          />

          <MiniMetric
            label="Potential"
            score={potentialScore}
            tone="green"
          />
        </div>

        {/* findings */}
        <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 gap-4">
          <div>
            <p
              className="
                mb-2
                text-[8px]
                font-black
                uppercase
                tracking-[0.14em]
                text-[#13866B]
              "
            >
              What’s Working
            </p>

            <div className="space-y-2">
              {scores
                .filter(
                  (row) =>
                    normalizeScore(
                      row.score
                    ) >= 70
                )
                .slice(0, 4)
                .map((row) => (
                  <FindingRow
                    key={row.label}
                    tone="good"
                    title={row.label}
                    body={`${normalizeScore(
                      row.score
                    )}% strength`}
                  />
                ))}

              {!scores.length ? (
                <FindingRow
                  tone="good"
                  title="Relevant experience identified"
                  body="Your profile contains usable evidence that can be strengthened through clearer presentation."
                />
              ) : null}
            </div>
          </div>

          <div>
            <p
              className="
                mb-2
                text-[8px]
                font-black
                uppercase
                tracking-[0.14em]
                text-[#C98A1D]
              "
            >
              Needs Attention
            </p>

            <div className="space-y-2">
              {scores
                .filter(
                  (row) =>
                    normalizeScore(
                      row.score
                    ) < 70
                )
                .slice(0, 4)
                .map((row) => (
                  <FindingRow
                    key={row.label}
                    tone={
                      normalizeScore(
                        row.score
                      ) < 50
                        ? "bad"
                        : "warning"
                    }
                    title={row.label}
                    body={`${normalizeScore(
                      row.score
                    )}% current score`}
                  />
                ))}

              {!scores.length ? (
                <FindingRow
                  tone="warning"
                  title="Improve measurable impact"
                  body="Add stronger evidence, metrics, and exact role terminology."
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* top priority */}
        <div
          className="
            mt-4
            shrink-0
            rounded-[18px]
            border
            border-[#EBD4A3]
            bg-[#FFF7E7]
            px-4
            py-3
          "
        >
          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#A86E0F]
            "
          >
            Highest Priority
          </p>

          <p
            className="
              mt-1.5
              text-[10px]
              font-bold
              leading-[1.5]
              text-[#24495E]
            "
          >
            {topFix?.recommended_action ||
              requirementOutcomeSummary ||
              "Focus first on missing keywords, measurable impact, and the most important role-specific gaps."}
          </p>
        </div>
      </PrintPage>

      {/* =====================================================
          PAGE 3 — JOB MATCH
      ====================================================== */}

      {primaryRequirements.length > 0 && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Job Match Analysis"
        >
          <SectionHeader
            eyebrow="Role Alignment"
            title="How Well You Match the Job"
            description="Requirement-by-requirement comparison between the target role and the evidence currently visible in your resume."
          />

          {/* match summary */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div
              className="
                rounded-[16px]
                border
                border-[#CFE7DD]
                bg-[#F1FAF6]
                p-3
              "
            >
              <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#13866B]">
                Strong Matches
              </p>

              <p className="mt-1.5 text-[22px] font-black text-[#0D3557]">
                {
                  primaryRequirements.filter(
                    (r) =>
                      statusKey(
                        r.status
                      ) === "strong"
                  ).length
                }
              </p>
            </div>

            <div
              className="
                rounded-[16px]
                border
                border-[#EED9AA]
                bg-[#FFF8E8]
                p-3
              "
            >
              <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#B87A16]">
                Partial Matches
              </p>

              <p className="mt-1.5 text-[22px] font-black text-[#0D3557]">
                {
                  primaryRequirements.filter(
                    (r) =>
                      statusKey(
                        r.status
                      ) === "partial"
                  ).length
                }
              </p>
            </div>

            <div
              className="
                rounded-[16px]
                border
                border-[#F0C9C6]
                bg-[#FEF1F0]
                p-3
              "
            >
              <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#C5524C]">
                Gaps
              </p>

              <p className="mt-1.5 text-[22px] font-black text-[#0D3557]">
                {
                  primaryRequirements.filter(
                    (r) =>
                      statusKey(
                        r.status
                      ) === "gap"
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <DataTable
              columns={[
                {
                  key: "requirement",
                  label: "Job Requirement",
                  width: "26%",
                  emphasis: true,
                },
                {
                  key: "evidence",
                  label: "Resume Evidence",
                  width: "36%",
                },
                {
                  key: "status",
                  label: "Match",
                  width: "14%",
                  render: (value) => (
                    <StatusBadge
                      status={value}
                    >
                      {value}
                    </StatusBadge>
                  ),
                },
                {
                  key: "explanation",
                  label: "What To Improve",
                  width: "24%",
                },
              ]}
              rows={primaryRequirements.slice(
                0,
                8
              )}
            />
          </div>
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 4 — REQUIREMENTS CONTINUED
      ====================================================== */}

      {(continuationRequirements.length >
        0 ||
        primaryRequirements.length > 8) && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Job Match Analysis"
        >
          <SectionHeader
            eyebrow="Role Alignment"
            title="Additional Job Requirements"
            description="Secondary requirements and preferred qualifications that can influence recruiter and ATS ranking."
          />

          <div className="min-h-0 flex-1 overflow-hidden">
            <DataTable
              columns={[
                {
                  key: "requirement",
                  label: "Job Requirement",
                  width: "26%",
                  emphasis: true,
                },
                {
                  key: "evidence",
                  label: "Resume Evidence",
                  width: "36%",
                },
                {
                  key: "status",
                  label: "Match",
                  width: "14%",
                  render: (value) => (
                    <StatusBadge
                      status={value}
                    >
                      {value}
                    </StatusBadge>
                  ),
                },
                {
                  key: "explanation",
                  label: "What To Improve",
                  width: "24%",
                },
              ]}
              rows={
                continuationRequirements.length
                  ? continuationRequirements.slice(
                      0,
                      8
                    )
                  : primaryRequirements.slice(
                      8,
                      16
                    )
              }
            />
          </div>

          {requirementOutcomeSummary ? (
            <div
              className="
                mt-4
                shrink-0
                rounded-[16px]
                border
                border-[#EBD4A3]
                bg-[#FFF7E7]
                p-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-[#A86E0F]
                "
              >
                Match Summary
              </p>

              <p
                className="
                  mt-1.5
                  text-[10px]
                  font-medium
                  leading-[1.55]
                  text-[#526F82]
                "
              >
                {requirementOutcomeSummary}
              </p>
            </div>
          ) : null}
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 5 — ATS STRUCTURE
      ====================================================== */}

      {(parsingRows.length > 0 ||
        scores.length > 0) && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="ATS Structure & Formatting"
        >
          <SectionHeader
            eyebrow="ATS Health"
            title="Structure, Parsing & Readability"
            description="Checks whether your resume can be reliably interpreted by modern applicant tracking systems."
          />

          {parsingRows.length > 0 ? (
            <div className="min-h-0 flex-1 overflow-hidden">
              <DataTable
                compact
                columns={[
                  {
                    key: "check",
                    label: "Check",
                    width: "23%",
                    emphasis: true,
                  },
                  {
                    key: "finding",
                    label: "Finding",
                    width: "38%",
                  },
                  {
                    key: "status",
                    label: "Status",
                    width: "15%",
                    render: (value) => (
                      <StatusBadge
                        status={value}
                      >
                        {value}
                      </StatusBadge>
                    ),
                  },
                  {
                    key: "why",
                    label: "Why It Matters",
                    width: "24%",
                  },
                ]}
                rows={parsingRows.slice(
                  0,
                  7
                )}
              />
            </div>
          ) : null}

          {scores.length > 0 ? (
            <div className="mt-4 shrink-0">
              <p
                className="
                  mb-2
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-[#6C8495]
                "
              >
                Category Scores
              </p>

              <div className="space-y-1.5">
                {scores
                  .slice(0, 5)
                  .map((row) => (
                    <ScoreRow
                      key={row.label}
                      label={row.label}
                      score={row.score}
                    />
                  ))}
              </div>
            </div>
          ) : null}

          {formattingRecommendations?.length >
          0 ? (
            <div
              className="
                mt-4
                shrink-0
                rounded-[16px]
                border
                border-[#D7E5EC]
                bg-[#F1F7F9]
                p-3
              "
            >
              <p
                className="
                  mb-2
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-[#4F8299]
                "
              >
                Recommended Formatting Fixes
              </p>

              <BulletList
                items={formattingRecommendations.slice(
                  0,
                  3
                )}
              />
            </div>
          ) : null}
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 6 — KEYWORDS
      ====================================================== */}

      {(matchedKeywords.length > 0 ||
        missingKeywords.length > 0) && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Keyword Coverage"
        >
          <SectionHeader
            eyebrow="Keyword Intelligence"
            title="Are You Using the Right Language?"
            description="ATS systems and recruiters look for exact role terminology. This page shows which signals are already present and which are weak or missing."
            right={
              keywordCoverageSection?.score !==
              undefined ? (
                <MiniMetric
                  label="Coverage"
                  score={
                    keywordCoverageSection.score
                  }
                  tone="gold"
                />
              ) : null
            }
          />

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
            {/* matched */}
            <div
              className="
                rounded-[20px]
                border
                border-[#D0E9DF]
                bg-[#F3FBF7]
                p-4
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.13em]
                  text-[#13866B]
                "
              >
                Found In Your Resume
              </p>

              <h3
                className="
                  mt-2
                  text-[16px]
                  font-black
                  text-[#0D3557]
                "
              >
                Strong keyword coverage
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {matchedKeywords
                  .slice(0, 24)
                  .map(
                    (
                      term,
                      index
                    ) => (
                      <span
                        key={
                          index
                        }
                        className="
                          rounded-full
                          border
                          border-[#CDE5DB]
                          bg-white
                          px-2.5
                          py-1.5
                          text-[8.5px]
                          font-bold
                          text-[#256F5C]
                        "
                      >
                        {term}
                      </span>
                    )
                  )}
              </div>
            </div>

            {/* gaps */}
            <div
              className="
                rounded-[20px]
                border
                border-[#F0D1CD]
                bg-[#FEF5F4]
                p-4
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.13em]
                  text-[#C5524C]
                "
              >
                Missing / Weak
              </p>

              <h3
                className="
                  mt-2
                  text-[16px]
                  font-black
                  text-[#0D3557]
                "
              >
                Keywords to prioritize
              </h3>

              <div className="mt-4 space-y-2">
                {missingKeywords
                  .slice(0, 10)
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-[12px]
                          border
                          border-[#F1D8D5]
                          bg-white/80
                          px-3
                          py-2
                        "
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="
                              flex
                              h-[20px]
                              w-[20px]
                              items-center
                              justify-center
                              rounded-full
                              bg-[#FDEDEC]
                              text-[8px]
                              font-black
                              text-[#C5524C]
                            "
                          >
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <span className="text-[9px] font-black text-[#24495E]">
                            {item.term ||
                              item}
                          </span>
                        </div>

                        {item.tone ? (
                          <StatusBadge
                            status={
                              item.tone
                            }
                          >
                            {item.tone}
                          </StatusBadge>
                        ) : null}
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 7 — DOMAIN FIT
      ====================================================== */}

      {(biReportingSection ||
        aiMlSection ||
        leadershipSection) && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Capability Fit"
        >
          <SectionHeader
            eyebrow="Capability Mapping"
            title="Where Your Experience Is Strongest"
            description="A consolidated view of the capability areas most relevant to the target opportunity."
          />

          <div className="space-y-4">
            {biReportingSection ? (
              <div
                className="
                  rounded-[18px]
                  border
                  border-[#E3DDD3]
                  bg-white/80
                  p-4
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.12em]
                        text-[#4F8299]
                      "
                    >
                      BI & Reporting
                    </p>

                    <h3 className="mt-1 text-[14px] font-black text-[#0D3557]">
                      {biReportingSection.performance ||
                        "Business Intelligence"}
                    </h3>
                  </div>

                  <span className="text-[22px] font-black text-[#13866B]">
                    {normalizeScore(
                      biReportingSection.score
                    )}
                    %
                  </span>
                </div>

                {biReportingSection.summary ? (
                  <p className="mt-2 text-[9.5px] font-medium leading-[1.5] text-[#637E90]">
                    {
                      biReportingSection.summary
                    }
                  </p>
                ) : null}

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <BulletList
                    tone="green"
                    items={safeArray(
                      biReportingSection.evidence
                    ).slice(0, 3)}
                  />

                  <BulletList
                    tone="gold"
                    items={safeArray(
                      biReportingSection.improvements
                    ).slice(0, 3)}
                  />
                </div>
              </div>
            ) : null}

            {aiMlSection ? (
              <div
                className="
                  rounded-[18px]
                  border
                  border-[#E3DDD3]
                  bg-white/80
                  p-4
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#4F8299]">
                      Advanced Analytics / AI
                    </p>

                    <h3 className="mt-1 text-[14px] font-black text-[#0D3557]">
                      {aiMlSection.performance ||
                        "Advanced Analytics"}
                    </h3>
                  </div>

                  <span className="text-[22px] font-black text-[#C98A1D]">
                    {normalizeScore(
                      aiMlSection.score
                    )}
                    %
                  </span>
                </div>

                {aiMlSection.summary ? (
                  <p className="mt-2 text-[9.5px] font-medium leading-[1.5] text-[#637E90]">
                    {
                      aiMlSection.summary
                    }
                  </p>
                ) : null}

                {aiMlSection.rows?.length >
                0 ? (
                  <div className="mt-3">
                    <DataTable
                      compact
                      columns={[
                        {
                          key: "requirement",
                          label: "Requirement",
                          width: "28%",
                          emphasis: true,
                        },
                        {
                          key: "evidence",
                          label: "Evidence",
                          width: "37%",
                        },
                        {
                          key: "status",
                          label: "Match",
                          width: "15%",
                          render: (
                            value
                          ) => (
                            <StatusBadge
                              status={
                                value
                              }
                            >
                              {
                                value
                              }
                            </StatusBadge>
                          ),
                        },
                        {
                          key: "add",
                          label: "Add / Improve",
                          width: "20%",
                        },
                      ]}
                      rows={aiMlSection.rows.slice(
                        0,
                        4
                      )}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {leadershipSection ? (
              <div
                className="
                  rounded-[18px]
                  border
                  border-[#E3DDD3]
                  bg-white/80
                  p-4
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#4F8299]">
                      Leadership
                    </p>

                    <h3 className="mt-1 text-[14px] font-black text-[#0D3557]">
                      {leadershipSection.performance ||
                        "Leadership & Stakeholder Fit"}
                    </h3>
                  </div>

                  <span className="text-[22px] font-black text-[#13866B]">
                    {normalizeScore(
                      leadershipSection.score
                    )}
                    %
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <BulletList
                    tone="green"
                    items={safeArray(
                      leadershipSection.evidence
                    ).slice(0, 3)}
                  />

                  <BulletList
                    tone="gold"
                    items={safeArray(
                      leadershipSection.improvements
                    ).slice(0, 3)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 8 — GOVERNANCE / RISKS
      ====================================================== */}

      {(governanceSection ||
        risks.length > 0) && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Risk & Governance"
        >
          <SectionHeader
            eyebrow="Screening Risks"
            title="What Could Hold Your Resume Back?"
            description="Potential recruiter objections, missing evidence, and capability gaps that deserve attention before submission."
          />

          {risks.length > 0 ? (
            <div className="min-h-0 flex-1 overflow-hidden">
              <DataTable
                columns={[
                  {
                    key: "flag",
                    label: "Risk",
                    width: "24%",
                    emphasis: true,
                  },
                  {
                    key: "severity",
                    label: "Severity",
                    width: "14%",
                    render: (value) => (
                      <StatusBadge
                        status={
                          value
                        }
                      >
                        {value}
                      </StatusBadge>
                    ),
                  },
                  {
                    key: "why",
                    label: "Why It Matters",
                    width: "31%",
                  },
                  {
                    key: "handle",
                    label: "How To Fix It",
                    width: "31%",
                  },
                ]}
                rows={risks.slice(
                  0,
                  7
                )}
              />
            </div>
          ) : null}

          {governanceSection?.notes
            ?.length > 0 ? (
            <div
              className="
                mt-4
                shrink-0
                rounded-[16px]
                border
                border-[#D8E4E9]
                bg-[#F1F6F8]
                p-3
              "
            >
              <p className="mb-2 text-[8px] font-black uppercase tracking-[0.12em] text-[#4F8299]">
                Governance & Architecture Notes
              </p>

              <BulletList
                items={governanceSection.notes.slice(
                  0,
                  4
                )}
              />
            </div>
          ) : null}
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 9 — REWRITES
      ====================================================== */}

      {(rewriteSection?.summaryDraft ||
        rewritePairs.length > 0) && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Rewrite Recommendations"
        >
          <SectionHeader
            eyebrow="Resume Optimization"
            title="Turn Responsibilities Into Impact"
            description="Examples of how to make your resume more specific, measurable, and recruiter-friendly."
          />

          {rewriteSection?.summaryDraft ? (
            <div
              className="
                mb-4
                shrink-0
                rounded-[18px]
                border
                border-[#D7E5EC]
                bg-[#F2F7F9]
                p-4
              "
            >
              <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#4F8299]">
                Suggested Professional Summary
              </p>

              <p
                className="
                  mt-2
                  text-[10px]
                  font-medium
                  italic
                  leading-[1.6]
                  text-[#375B70]
                "
              >
                “
                {
                  rewriteSection.summaryDraft
                }
                ”
              </p>
            </div>
          ) : null}

          <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
            {rewritePairs
              .slice(0, 4)
              .map(
                (
                  pair,
                  index
                ) => (
                  <RewritePair
                    key={
                      pair.id ||
                      index
                    }
                    index={
                      index + 1
                    }
                    before={
                      pair.before
                    }
                    after={
                      pair.after
                    }
                  />
                )
              )}
          </div>
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 10 — EXPERIENCE EVIDENCE
      ====================================================== */}

      {evidenceRows.length > 0 && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Experience Evidence"
        >
          <SectionHeader
            eyebrow="Evidence Mapping"
            title="Where Your Experience Proves the Match"
            description="Role-level evidence already present in your career history and where stronger proof can be added."
          />

          <div className="min-h-0 flex-1 overflow-hidden">
            <DataTable
              columns={[
                {
                  key: "role",
                  label: "Role",
                  width: "25%",
                  emphasis: true,
                },
                {
                  key: "evidence",
                  label: "Relevant Evidence",
                  width: "58%",
                },
                {
                  key: "fit",
                  label: "Fit",
                  width: "17%",
                },
              ]}
              rows={evidenceRows.slice(
                0,
                7
              )}
            />
          </div>

          {experienceEvidenceSection?.strategy ? (
            <div
              className="
                mt-4
                shrink-0
                rounded-[16px]
                border
                border-[#EBD4A3]
                bg-[#FFF7E7]
                p-3
              "
            >
              <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#A86E0F]">
                Positioning Strategy
              </p>

              <p className="mt-1.5 text-[10px] font-medium leading-[1.55] text-[#526F82]">
                {
                  experienceEvidenceSection.strategy
                }
              </p>
            </div>
          ) : null}
        </PrintPage>
      )}

      {/* =====================================================
          PAGE 11 — FINAL ROADMAP
      ====================================================== */}

      {finalVerdictSection && (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Your Action Plan"
        >
          <SectionHeader
            eyebrow="Next Steps"
            title="Your Resume Improvement Roadmap"
            description="Complete these actions in order of impact before submitting your next application."
          />

          {/* score growth */}
          <div
            className="
              mb-5
              grid
              shrink-0
              grid-cols-[1fr_55px_1fr]
              items-center
              gap-4
              rounded-[22px]
              bg-[#0D3557]
              p-5
              text-white
            "
          >
            <div className="text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/55">
                Current
              </p>

              <p className="mt-1 text-[35px] font-black tracking-[-0.06em]">
                {currentScore}
              </p>
            </div>

            <div className="text-center text-[24px] font-light text-[#F1C45B]">
              →
            </div>

            <div className="text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/55">
                Potential
              </p>

              <p className="mt-1 text-[35px] font-black tracking-[-0.06em] text-[#F2C65F]">
                {potentialScore}
              </p>
            </div>
          </div>

          {/* actions */}
          <div className="min-h-0 flex-1 space-y-2.5">
            {actionRows
              .slice(0, 6)
              .map(
                (
                  row,
                  index
                ) => (
                  <div
                    key={
                      row.priority ||
                      index
                    }
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-[16px]
                      border
                      border-[#E3DDD3]
                      bg-white/82
                      px-4
                      py-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-[34px]
                        w-[34px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FFF3D9]
                        text-[10px]
                        font-black
                        text-[#A66B0D]
                      "
                    >
                      {String(
                        row.priority ||
                          index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black leading-[1.35] text-[#163B54]">
                        {
                          row.action
                        }
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full
                        bg-[#EAF7F2]
                        px-3
                        py-1.5
                        text-[8px]
                        font-black
                        uppercase
                        text-[#13866B]
                      "
                    >
                      {row.impact ||
                        "High Impact"}
                    </span>
                  </div>
                )
              )}

            {!actionRows.length ? (
              <>
                <FindingRow
                  tone="warning"
                  title="Add high-priority missing keywords"
                  body="Integrate exact role terminology naturally into relevant experience."
                />

                <FindingRow
                  tone="warning"
                  title="Strengthen measurable impact"
                  body="Quantify scale, efficiency, revenue, quality, time, or adoption wherever possible."
                />

                <FindingRow
                  tone="good"
                  title="Keep the strongest evidence visible"
                  body="Move the most relevant accomplishments higher in each recent role."
                />
              </>
            ) : null}
          </div>

          {/* closing */}
          <div
            className="
              mt-5
              shrink-0
              rounded-[20px]
              border
              border-[#D8E4E9]
              bg-[#F1F6F8]
              p-4
            "
          >
            <p
              className="
                text-[16px]
                font-black
                tracking-[-0.03em]
                text-[#0D3557]
              "
            >
              You’re closer than your current score suggests.
            </p>

            <p
              className="
                mt-2
                max-w-[570px]
                text-[10px]
                font-medium
                leading-[1.55]
                text-[#617D8F]
              "
            >
              {finalVerdictSection.verdictBody ||
                "The core experience is relevant. The biggest opportunity is presenting it with stronger evidence, clearer impact, and tighter job alignment."}
            </p>
          </div>

          {finalVerdictSection.disclaimer ? (
            <p
              className="
                mt-3
                shrink-0
                text-[8px]
                font-medium
                leading-[1.4]
                text-[#8A9AA4]
              "
            >
              {
                finalVerdictSection.disclaimer
              }
            </p>
          ) : null}
        </PrintPage>
      )}

      {/* =====================================================
          OPTIONAL — GENERATED COVER LETTER
          Only rendered when backend data exists.
      ====================================================== */}

      {coverLetterText ? (
        <PrintPage
          pageNumber={nextPage()}
          footerLabel="Generated Cover Letter"
        >
          <SectionHeader
            eyebrow="Application Asset"
            title="Targeted Cover Letter"
            description={`Draft aligned to ${targetRole} at ${targetCompany}.`}
          />

          <div
            className="
              min-h-0
              flex-1
              rounded-[20px]
              border
              border-[#E3DDD3]
              bg-white/88
              p-6
            "
          >
            <div
              className="
                whitespace-pre-wrap
                text-[10.5px]
                font-medium
                leading-[1.75]
                text-[#435F72]
              "
            >
              {coverLetterText}
            </div>
          </div>
        </PrintPage>
      ) : null}
    </div>
  );
}

export default ATSPrintReport;
