import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Linkedin,
  Youtube,
  Mail,
  Instagram,
  MapPin,
  Shield,
  Cpu,
  Gamepad2,
  Coffee,
  X,
  Phone,
} from "lucide-react";
import colorLogo from "../../assets/logos/BlueLogo.png";

const Footer = () => {
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);

  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSc3Mf6poLOwWeCvEJRmElZXI4iCPC8KzmVmiaSw5v7NZaQHSw/viewform?embedded=true";

  return (
    <footer className="relative w-full border-t border-[#E8E1D5] bg-[#F4EFE6] pt-16 pb-8 font-sans text-slate-600">
      {/* Subtle Background Grid matching your website theme */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,33,70,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(11,33,70,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-8">

        {/* Top CTA Banner */}
        <div className="mb-16 flex flex-col items-center justify-between gap-6 rounded-[24px] border border-[#E8E1D5] bg-white px-8 py-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:flex-row lg:px-10">
          <div>
            <h3 className="text-xl font-bold text-[#0B2146]">
              Initialize Career Uplink?
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Join the network or grab a virtual coffee with our mentors.
            </p>
          </div>

          <button
            onClick={() => setIsCoffeeOpen(true)}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0B2146] px-6 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#163366] hover:shadow-lg"
          >
            <Coffee size={18} /> Coffee Connect
          </button>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Brand Column */}
          <div className="flex flex-col pr-4">
            {/* Recreated Logo from Screenshot */}
            <div className="flex items-center gap-3">
              <img src={colorLogo} alt="CareerSense Logo" className="h-[46px] w-[46px] object-contain rounded-xl shadow-xs shrink-0" />
              <div className="flex flex-col justify-center">
                <span className="text-[22px] font-bold leading-none tracking-tight text-[#0B2146]">
                  {/* CareerSense */}
                  <span className="text-[#0D2E63]">Career</span><span className="text-[#306099]">Sense</span>
                </span>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748B]">
                  ATS Intelligence
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm font-medium leading-relaxed text-slate-500">
              Stop guessing what the algorithm wants. The ultimate ATS guidance platform for resume scoring, JD matching, and recruiter readiness checks.
            </p>


          </div>

          {/* Column 2: Simulation Hub */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0B2146]">
              <Gamepad2 size={18} className="text-[#475569]" /> SIMULATION HUB
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  to="/play-with-resume"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  Play with Resume
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  ATS Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/repository"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  Report Repository
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Career Intelligence */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0B2146]">
              <Cpu size={18} className="text-[#475569]" /> CAREER INTELLIGENCE
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  to="/check-ats/resume"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  AI Resume Audit
                </Link>
              </li>
              <li>
                <Link
                  to="/check-ats/resume-jd"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  JD & Resume Matcher
                </Link>
              </li>
              <li>
                <a
                  href="/ATS%20Resume%20Checker.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  Sample ATS Report
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: System Core (Contact Info Updated) */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0B2146]">
              <Shield size={18} className="text-[#475569]" /> SYSTEM CORE
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  to="/"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  About Mission
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@careersense.ai"
                  className="group flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B2146]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBD5E1] transition-colors group-hover:bg-[#0B2146]" />
                  Contact Support
                </a>
              </li>

              <li className="my-4 h-px w-full bg-[#E8E1D5]" /> {/* Divider */}

              <li className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Mail size={16} className="shrink-0 text-[#94A3B8]" />
                <a href="mailto:support@careersense.ai" className="hover:text-[#0B2146]">
                  support@careersense.ai
                </a>
              </li>
              <li className="flex flex-col gap-2.5 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-[#94A3B8]" />
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇺🇸</span> +1 (201) 893-6385
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4" /> {/* Spacer to align with text above */}
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇮🇳</span> +91 9891422329
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium leading-relaxed text-slate-500">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#94A3B8]" />
                <span>
                  85 CourtHouse PI, Jersey City<br />
                  New Jersey - 07306
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#E8E1D5] pt-8 md:flex-row">
          <p className="text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} CareerSense AI. All systems operational.
          </p>


        </div>
      </div>

      {/* Coffee Connect Modal */}
      {isCoffeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2146]/40 p-4 backdrop-blur-sm">
          <div className="relative flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#F4EFE6] p-4 px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B2146] shadow-sm">
                  <Coffee size={18} />
                </div>
                <h3 className="font-bold text-[#0B2146]">Coffee Connect</h3>
              </div>
              <button
                onClick={() => setIsCoffeeOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 bg-white">
              <iframe
                src={GOOGLE_FORM_URL}
                className="absolute inset-0 h-full w-full border-0"
                title="Coffee Connect Form"
              >
                Loading...
              </iframe>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;