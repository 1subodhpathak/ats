import React from "react";
import {
  ArrowRight,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

import ctaBackground from "../../assets/home/cta.png";

function FinalCTASection() {
  return (
    <section
      id="final-cta"
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#173F59]
        bg-[#062B45]
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
          ===================================================== */}

      <img
        src={ctaBackground}
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
        "
      />

      {/* Left-side readability gradient only */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(
            90deg,
            rgba(3,26,43,.90)_0%,
            rgba(3,29,48,.76)_28%,
            rgba(4,34,54,.28)_50%,
            rgba(4,34,54,.03)_72%,
            transparent_100%
          )]
        "
      />

      {/* very subtle overall darkening */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[#062B45]/10
        "
      />


      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="landing-container
          relative
          z-10
          mx-auto
          flex
          min-h-[250px]
          w-full
          max-w-[1900px]
          items-center
          px-5
          py-7
          sm:px-8
          lg:min-h-[270px]
          lg:px-12
          lg:py-8
          xl:px-[82px]
        "
      >
        <div
          className="
            w-full
            max-w-[760px]
          "
        >
          {/* =================================================
              EYEBROW
              ================================================= */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-7
                bg-[#E7B94F]
              "
            />

            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.27em]
                text-[#EBC464]
                sm:text-[8.5px]
              "
            >
              Ready When You Are
            </p>
          </div>


          {/* =================================================
              HEADING
              ================================================= */}

          <h2
            className="
              mt-3
              max-w-[720px]
              font-serif
              text-[30px]
              font-semibold
              leading-[1]
              tracking-[-0.04em]
              text-[#FFFDF7]
              sm:text-[34px]
              lg:text-[26px]
              xl:text-[28px]
            "
          >
            Turn your resume into opportunities.
          </h2>


          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <p
            className="
              mt-3
              max-w-[670px]
              text-[10.5px]
              font-medium
              leading-[1.55]
              text-[#D5E0E6]
              sm:text-[11.5px]
            "
          >
            Join thousands of professionals who trust CareerSense
            to make their applications stronger.
          </p>


          {/* =================================================
              ACTIONS
              ================================================= */}

          <div
            className="
              mt-5
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
            "
          >
            {/* PRIMARY */}

            <Link
              to="/check-ats/resume-jd"
              className="
                group
                inline-flex
                h-[48px]
                min-w-[220px]
                items-center
                justify-between
                rounded-[8px]
                border
                border-[#E5B84F]
                bg-[linear-gradient(110deg,#F6D37B,#E8B745)]
                px-5
                text-[11px]
                font-black
                text-[#12354C]
                shadow-[0_10px_24px_rgba(0,0,0,.17)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:brightness-105
              "
            >
              <span>
                Start ATS Check
              </span>

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>


            {/* SECONDARY */}

            <a
              href="/ATS%20Resume%20Checker.pdf"
              target="_blank"
              rel="noreferrer"
              className="
                group
                inline-flex
                h-[48px]
                min-w-[220px]
                items-center
                justify-between
                rounded-[8px]
                border
                border-[#8DA4B3]/55
                bg-[#0A3550]/58
                px-5
                text-[11px]
                font-black
                text-[#F6F9FB]
                shadow-[0_8px_20px_rgba(0,0,0,.10)]
                backdrop-blur-[3px]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#E1B754]/65
                hover:bg-[#103D59]/76
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-2.5
                "
              >
                <FileText
                  size={15}
                  className="
                    text-[#E5BD60]
                  "
                />

                View Sample Report
              </span>

              <ArrowRight
                size={15}
                className="
                  text-[#C6D5DE]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </a>
          </div>
        </div>
      </div>


      {/* =====================================================
          TOP / BOTTOM SUBTLE EDGE
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#D7B059]/35
          to-transparent
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/15
          to-transparent
        "
      />
    </section>
  );
}

export default FinalCTASection;
