import React, { useState } from "react";
import {
  ArrowUpRight,
  Coffee,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import BlueLogo from "../../assets/logos/BlueLogo.png";
import footerBackground from "../../assets/home/footer.png";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfz55NWi27Do0xWsPxNVEMU6CTqW8diTrwk3oxR62ufMVsPxg/viewform";


/* =========================================================
   LINKS
   ========================================================= */

const productLinks = [
  {
    label: "ATS Resume Check",
    path: "/check-ats/resume",
  },
  {
    label: "Resume + JD Match",
    path: "/check-ats/resume-jd",
  },
  {
    label: "Saved Reports",
    path: "/repository",
  },
  {
    label: "Dashboard",
    path: "/dashboard",
  },
];

const intelligenceLinks = [
  "ATS Parsing Review",
  "Keyword Analysis",
  "Resume Readability",
  "JD Alignment",
];

const companyLinks = [
  {
    label: "Why CareerSense",
    href: "#why-careersense",
  },
  {
    label: "How It Works",
    href: "#ats-report-coverage",
  },
  {
    label: "Success Stories",
    href: "#testimony",
  },
];


/* =========================================================
   FOOTER
   ========================================================= */

function Footer() {
  const navigate = useNavigate();

  const [
    isCoffeeOpen,
    setIsCoffeeOpen,
  ] = useState(false);


  /* =======================================================
     LINK HANDLER
     ======================================================= */

  const handleLink = (item) => {
    if (item.path) {
      navigate(item.path);
      return;
    }

    if (item.href) {
      document
        .querySelector(item.href)
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }
  };


  return (
    <>
      <footer
        className="
          relative
          w-full
          overflow-hidden
          border-t
          border-[#D9C9AA]
          bg-[#FBF8F1]
          text-[#0B3453]
        "
      >
        {/* =================================================
            BACKGROUND IMAGE
            ================================================= */}

        <img
          src={footerBackground}
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


        {/* white readability wash */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[#FBF8F1]/36
          "
        />


        {/* subtle top light */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-40
            bg-gradient-to-b
            from-white/45
            to-transparent
          "
        />


        {/* =================================================
            MAIN
            ================================================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1600px]
            px-5
            pb-6
            pt-7
            sm:px-8
            lg:px-10
            lg:pb-7
            lg:pt-8
            xl:px-14
          "
        >
          {/* =================================================
              TOP CONNECT BANNER
              ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-5
              rounded-[16px]
              border
              border-[#D9C9AA]/80
              bg-[#FFFDF8]/82
              px-5
              py-4
              shadow-[0_12px_30px_rgba(18,52,76,.055)]
              backdrop-blur-[5px]
              sm:px-6
              md:flex-row
              md:items-center
              md:justify-between
              lg:px-7
            "
          >
            <div>
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
                    bg-[#C98A25]
                  "
                />

                <p
                  className="
                    text-[7.5px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-[#B8791D]
                  "
                >
                  CareerSense Network
                </p>
              </div>


              <h3
                className="
                  mt-2
                  font-serif
                  text-[21px]
                  font-semibold
                  tracking-[-0.025em]
                  text-[#102F48]
                  sm:text-[23px]
                "
              >
                Initialize your career uplink.
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  leading-relaxed
                  text-[#678394]
                  sm:text-[10.5px]
                "
              >
                Have a question, need guidance, or
                simply want to connect with the team?
              </p>
            </div>


            <button
              type="button"
              onClick={() =>
                setIsCoffeeOpen(true)
              }
              className="
                group
                inline-flex
                h-[44px]
                shrink-0
                items-center
                justify-between
                gap-4
                rounded-[8px]
                bg-[#103A55]
                px-5
                text-[10px]
                font-black
                text-white
                shadow-[0_8px_20px_rgba(16,58,85,.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#0B3048]
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Coffee
                  size={15}
                  className="
                    text-[#E8BE62]
                  "
                />

                Coffee Connect
              </span>

              <ArrowUpRight
                size={14}
                className="
                  text-[#D9E4EA]
                  transition-transform
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </button>
          </div>


          {/* =================================================
              MAIN FOOTER GRID
              ================================================= */}

          <div
            className="
              grid
              gap-8
              py-8
              sm:grid-cols-2
              lg:grid-cols-[1.35fr_0.8fr_0.9fr_0.9fr_1.15fr]
              lg:gap-7
              lg:py-9
            "
          >
            {/* =================================================
                BRAND
                ================================================= */}

            <div>
              <button
                type="button"
                onClick={() =>
                  navigate("/")
                }
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-left
                "
              >
                <div
                  className="
                    flex
                    h-[46px]
                    w-[46px]
                    items-center
                    justify-center
                    rounded-[12px]
                    border
                    border-[#D9E1E4]
                    bg-white/85
                    shadow-[0_8px_22px_rgba(16,58,85,.07)]
                  "
                >
                  <img
                    src={BlueLogo}
                    alt="CareerSense"
                    className="
                      h-[34px]
                      w-[34px]
                      object-contain
                    "
                  />
                </div>


                <div>
                  <h2
                    className="
                      text-[20px]
                      font-black
                      leading-none
                      tracking-[-0.045em]
                    "
                  >
                    <span className="text-[#0B3453]">
                      Career
                    </span>

                    <span className="text-[#C88A26]">
                      Sense
                    </span>
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[6px]
                      font-black
                      uppercase
                      tracking-[0.27em]
                      text-[#8199A7]
                    "
                  >
                    ATS Intelligence
                  </p>
                </div>
              </button>


              <p
                className="
                  mt-4
                  max-w-[290px]
                  text-[9px]
                  font-medium
                  leading-[1.6]
                  text-[#668293]
                "
              >
                Understand how ATS systems see your
                resume, identify gaps, strengthen
                alignment, and apply with more
                confidence.
              </p>


              {/* socials */}

              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                "
              >
                <a
                  href="mailto:support@careersenseai.com"
                  aria-label="Email CareerSense"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D5DEE3]
                    bg-white/65
                    text-[#58788B]
                    transition-all
                    hover:-translate-y-0.5
                    hover:border-[#BD8B37]
                    hover:text-[#B7781D]
                  "
                >
                  <Mail size={13} />
                </a>


                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="CareerSense LinkedIn"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D5DEE3]
                    bg-white/65
                    text-[#58788B]
                    transition-all
                    hover:-translate-y-0.5
                    hover:border-[#BD8B37]
                    hover:text-[#B7781D]
                  "
                >
                  <Linkedin size={13} />
                </a>


                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="CareerSense Twitter"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D5DEE3]
                    bg-white/65
                    text-[#58788B]
                    transition-all
                    hover:-translate-y-0.5
                    hover:border-[#BD8B37]
                    hover:text-[#B7781D]
                  "
                >
                  <Twitter size={13} />
                </a>
              </div>
            </div>


            {/* =================================================
                PRODUCT
                ================================================= */}

            <FooterColumn
              title="Product"
              links={productLinks}
              onLinkClick={handleLink}
            />


            {/* =================================================
                INTELLIGENCE
                ================================================= */}

            <div>
              <FooterHeading>
                ATS Intelligence
              </FooterHeading>

              <ul
                className="
                  mt-4
                  space-y-2.5
                "
              >
                {intelligenceLinks.map(
                  (item) => (
                    <li
                      key={item}
                      className="
                        text-[8.5px]
                        font-medium
                        text-[#6C8796]
                      "
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>


            {/* =================================================
                COMPANY
                ================================================= */}

            <FooterColumn
              title="Explore"
              links={companyLinks}
              onLinkClick={handleLink}
            />


            {/* =================================================
                CONTACT
                ================================================= */}

            <div>
              <FooterHeading>
                Contact
              </FooterHeading>


              <ul
                className="
                  mt-4
                  space-y-3
                "
              >
                <li
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <Mail
                    size={13}
                    className="
                      shrink-0
                      text-[#B77A20]
                    "
                  />

                  <a
                    href="mailto:support@careersenseai.com"
                    className="
                      text-[8.5px]
                      font-medium
                      text-[#617E90]
                      transition
                      hover:text-[#B77A20]
                    "
                  >
                    support@careersenseai.com
                  </a>
                </li>


                <li
                  className="
                    flex
                    items-start
                    gap-2.5
                  "
                >
                  <Phone
                    size={13}
                    className="
                      mt-[2px]
                      shrink-0
                      text-[#B77A20]
                    "
                  />

                  <div
                    className="
                      space-y-1.5
                    "
                  >
                    <a
                      href="tel:+12018936385"
                      className="
                        block
                        text-[8.5px]
                        font-medium
                        text-[#617E90]
                        transition
                        hover:text-[#B77A20]
                      "
                    >
                      🇺🇸 +1 (201) 893-6385
                    </a>

                    <a
                      href="tel:+919891422329"
                      className="
                        block
                        text-[8.5px]
                        font-medium
                        text-[#617E90]
                        transition
                        hover:text-[#B77A20]
                      "
                    >
                      🇮🇳 +91 9891422329
                    </a>
                  </div>
                </li>


                <li
                  className="
                    flex
                    items-start
                    gap-2.5
                  "
                >
                  <MapPin
                    size={13}
                    className="
                      mt-[2px]
                      shrink-0
                      text-[#B77A20]
                    "
                  />

                  <p
                    className="
                      text-[8.5px]
                      font-medium
                      leading-[1.55]
                      text-[#617E90]
                    "
                  >
                    85 CourtHouse Pl,
                    Jersey City
                    <br />
                    New Jersey - 07306
                  </p>
                </li>
              </ul>
            </div>
          </div>


          {/* =================================================
              BOTTOM
              ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-[#DED8CF]
              pt-5
              text-[8px]
              font-medium
              text-[#748C9A]
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-2
                gap-y-1
              "
            >
              <span>
                © 2026 CareerSense AI.
                All rights reserved.
              </span>

              <span
                className="
                  hidden
                  text-[#B7C1C6]
                  sm:inline
                "
              >
                •
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <span
                  className="
                    h-[5px]
                    w-[5px]
                    rounded-full
                    bg-[#3DBD82]
                  "
                />

                All systems operational
              </span>
            </div>


            <div
              className="
                flex
                items-center
                gap-5
              "
            >
              <a
                href="#"
                className="
                  transition
                  hover:text-[#B77A20]
                "
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="
                  transition
                  hover:text-[#B77A20]
                "
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>


      {/* =====================================================
          COFFEE CONNECT MODAL
          ===================================================== */}

      {isCoffeeOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-[#082D46]/54
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsCoffeeOpen(false);
            }
          }}
        >
          <div
            className="
              relative
              flex
              h-[82vh]
              w-full
              max-w-2xl
              flex-col
              overflow-hidden
              rounded-[20px]
              border
              border-[#D9E0E3]
              bg-white
              shadow-[0_28px_80px_rgba(7,35,54,.28)]
            "
          >
            {/* modal header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#E5DED4]
                bg-[#FBF7EF]
                px-5
                py-3.5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-[9px]
                    border
                    border-[#E4D9C5]
                    bg-white
                    text-[#B67A20]
                    shadow-sm
                  "
                >
                  <Coffee size={15} />
                </div>


                <div>
                  <p
                    className="
                      text-[7px]
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-[#8096A4]
                    "
                  >
                    CareerSense
                  </p>

                  <h3
                    className="
                      mt-0.5
                      text-[13px]
                      font-black
                      text-[#173A52]
                    "
                  >
                    Coffee Connect
                  </h3>
                </div>
              </div>


              <button
                type="button"
                onClick={() =>
                  setIsCoffeeOpen(false)
                }
                aria-label="Close Coffee Connect"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-[#79909E]
                  transition
                  hover:bg-[#EEE9E1]
                  hover:text-[#173A52]
                "
              >
                <X size={17} />
              </button>
            </div>


            {/* form */}

            <div
              className="
                relative
                flex-1
                bg-white
              "
            >
              <iframe
                src={GOOGLE_FORM_URL}
                title="Coffee Connect Form"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  border-0
                "
              >
                Loading...
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* =========================================================
   HELPERS
   ========================================================= */

function FooterHeading({
  children,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >
      <span
        className="
          h-[5px]
          w-[5px]
          rounded-full
          bg-[#C68A27]
        "
      />

      <h3
        className="
          text-[8px]
          font-black
          uppercase
          tracking-[0.18em]
          text-[#173A52]
        "
      >
        {children}
      </h3>
    </div>
  );
}


function FooterColumn({
  title,
  links,
  onLinkClick,
}) {
  return (
    <div>
      <FooterHeading>
        {title}
      </FooterHeading>

      <ul
        className="
          mt-4
          space-y-2.5
        "
      >
        {links.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() =>
                onLinkClick(item)
              }
              className="
                group
                inline-flex
                items-center
                gap-1.5
                text-left
                text-[8.5px]
                font-medium
                text-[#6C8796]
                transition
                hover:text-[#B77A20]
              "
            >
              <span>
                {item.label}
              </span>

              <ArrowUpRight
                size={9}
                className="
                  opacity-0
                  transition-all
                  duration-200
                  group-hover:-translate-y-[1px]
                  group-hover:translate-x-[1px]
                  group-hover:opacity-100
                "
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Footer;
