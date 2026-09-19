import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

import aaravImage from "../../assets/testimonials/aarav.png";
import adityaImage from "../../assets/testimonials/aditya.png";
import kavyaImage from "../../assets/testimonials/kavya.png";
import meeraImage from "../../assets/testimonials/meera.png";
import rohanImage from "../../assets/testimonials/rohan.png";
import snehaImage from "../../assets/testimonials/sneha.png";

import testimonyBackground from "../../assets/home/testimony.png";


/* =========================================================
   TESTIMONIALS
   ========================================================= */

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Principal Software Engineer",
    company: "Tata Consultancy Services",
    image: aaravImage,
    text:
      "After applying to 50+ roles with no replies, I ran my resume through CareerSense. The ATS report caught critical gaps. I fixed them and landed three interviews within two weeks!",
  },
  {
    name: "Meera Iyer",
    role: "Head of Talent Acquisition",
    company: "Infosys",
    image: meeraImage,
    text:
      "The JD match analysis highlighted exact keywords I was missing. Editing my resume with CareerSense was quick and easy — and I finally started getting interview calls!",
  },
  {
    name: "Aditya Varma",
    role: "Lead Data Scientist",
    company: "Wipro Technologies",
    image: adityaImage,
    text:
      "I thought my resume was perfect because of a fancy two-column template. CareerSense showed me it was failing ATS parsers completely. I switched formats and scored 94%!",
  },
  {
    name: "Kavya Nair",
    role: "Senior Product Manager",
    company: "Flipkart",
    image: kavyaImage,
    text:
      "CareerSense made it easy to understand how my resume would actually perform before applying. The instant scoring and clear recommendations made a real difference.",
  },
  {
    name: "Rohan Deshmukh",
    role: "DevOps Architect",
    company: "Reliance Jio",
    image: rohanImage,
    text:
      "The Impact Metrics analysis completely changed how I present engineering achievements. It pushed me to quantify my work and helped raise my score from 55 to 91.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Engineering Director",
    company: "Tech Mahindra",
    image: snehaImage,
    text:
      "As a hiring manager, I know what modern ATS systems look for. CareerSense comes remarkably close to an actual recruiter screen, especially for readability and structure.",
  },
];

const itemsPerSlide = 2;


/* =========================================================
   TESTIMONIAL CARD
   ========================================================= */

function TestimonialCard({
  testimonial,
}) {
  const {
    name,
    role,
    company,
    image,
    text,
  } = testimonial;

  return (
    <article
      className="
        group
        grid
        h-full
        min-h-[190px]
        overflow-hidden
        rounded-[13px]
        border
        border-[#CCD9DF]/90
        bg-[#FFFDFC]
        text-[#15364D]
        shadow-[0_12px_30px_rgba(0,0,0,.13)]
        md:grid-cols-[31%_69%]
        lg:min-h-0
      "
    >
      {/* ===================================================
          PHOTO
          =================================================== */}

      <div
        className="
          relative
          min-h-[185px]
          overflow-hidden
          bg-[#E7ECEE]
          md:min-h-0
        "
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="
            h-full
            w-full
            object-cover
            object-top
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.025]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-12
            bg-gradient-to-t
            from-[#092D47]/12
            to-transparent
          "
        />
      </div>


      {/* ===================================================
          COPY
          =================================================== */}

      <div
        className="
          relative
          flex
          min-w-0
          flex-col
          justify-between
          px-5
          py-[14px]
          xl:px-6
        "
      >
        {/* quote + text */}

        <div className="flex items-start gap-3">
          <Quote
            size={23}
            strokeWidth={1.8}
            className="
              mt-[1px]
              shrink-0
              fill-[#6E93A8]/8
              text-[#7898AA]
            "
          />

          <p
            className="
              max-w-[430px]
              text-[10.5px]
              font-medium
              leading-[1.55]
              text-[#557487]
              xl:text-[11px]
            "
          >
            “{text}”
          </p>
        </div>


        {/* identity */}

        <div
          className="
            mt-4
            pl-[35px]
          "
        >
          <h3
            className="
              text-[10.5px]
              font-black
              leading-none
              text-[#173A52]
              xl:text-[11px]
            "
          >
            {name}
          </h3>

          <p
            className="
              mt-2
              text-[6.2px]
              font-black
              uppercase
              leading-[1.45]
              tracking-[0.13em]
              text-[#78909F]
            "
          >
            {role}

            <span
              className="
                mx-1.5
                text-[#B9C5CB]
              "
            >
              •
            </span>

            <span className="text-[#536D7D]">
              {company}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}


/* =========================================================
   MAIN SECTION
   ========================================================= */

function TestimonialsSection() {
  const reduceMotion =
    useReducedMotion();

  const [index, setIndex] =
    useState(0);

  const totalSlides =
    Math.ceil(
      testimonials.length /
        itemsPerSlide
    );

  const visibleTestimonials =
    testimonials.slice(
      index * itemsPerSlide,
      index * itemsPerSlide +
        itemsPerSlide
    );


  const previousSlide = () => {
    setIndex(
      (current) =>
        (current -
          1 +
          totalSlides) %
        totalSlides
    );
  };


  const nextSlide = () => {
    setIndex(
      (current) =>
        (current + 1) %
        totalSlides
    );
  };


  return (
    <section
      id="testimony"
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#17435E]
        bg-[#062C47]
        scroll-mt-20
        text-white
      "
    >
      {/* ===================================================
          BACKGROUND
          =================================================== */}

      <img
        src={testimonyBackground}
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


      {/* light darkening only;
          preserve the gold waves */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[#052A43]/20
        "
      />


      {/* subtle center focus */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_56%_50%,rgba(25,83,116,.12),transparent_48%)]
        "
      />


      {/* ===================================================
          SECTION CONTENT
          =================================================== */}

      <div
        className="landing-container
          relative
          z-10
          mx-auto
          w-full
          max-w-[1900px]
          px-5
          py-[18px]
          sm:px-8
          lg:px-12
          lg:py-4
          xl:px-[72px]
        "
      >
        <div
          className="
            grid
            items-stretch
            gap-5
            lg:grid-cols-[0.72fr_2.52fr_0.52fr]
            xl:gap-6
          "
        >
          {/* =================================================
              LEFT INTRO
              ================================================= */}

          <div
            className="
              flex
              flex-col
              justify-center
              lg:h-[190px]
            "
          >
            {/* eyebrow */}

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
                  bg-[#E8B94C]
                "
              />

              <p
                className="
                  text-[7.5px]
                  font-black
                  uppercase
                  tracking-[0.27em]
                  text-[#EBC562]
                "
              >
                Success Stories
              </p>
            </div>


            {/* heading */}

            <h2
              className="
                mt-1
                max-w-[505px]
                font-serif
                text-[29px]
                font-semibold
                leading-[0.94]
                tracking-[-0.04em]
                text-[#FFFDF7]
                sm:text-[31px]
                xl:text-[28px]
              "
            >
              <span className="whitespace-nowrap">Real professionals.</span>
              <br />
              Real results.
            </h2>


            {/* description */}

            <p
              className="
                mt-3
                max-w-[285px]
                text-[7.3px]
                font-medium
                leading-[1.45]
                text-[#C8D6DE]
                xl:text-[7.7px]
              "
            >
              See how job seekers are getting
              more interviews with CareerSense.
            </p>


            {/* navigation */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2.5
              "
            >
              <button
                type="button"
                aria-label="Previous testimonials"
                onClick={previousSlide}
                className="
                  group
                  flex
                  h-[36px]
                  w-[36px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8AA4B4]/55
                  bg-[#0A3551]/60
                  text-[#E8F0F4]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#E4B953]/75
                  hover:bg-[#123D59]
                  active:scale-95
                "
              >
                <ChevronLeft
                  size={16}
                  className="
                    transition-transform
                    group-hover:-translate-x-0.5
                  "
                />
              </button>


              <button
                type="button"
                aria-label="Next testimonials"
                onClick={nextSlide}
                className="
                  group
                  flex
                  h-[36px]
                  w-[36px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8AA4B4]/55
                  bg-[#0A3551]/60
                  text-[#E8F0F4]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#E4B953]/75
                  hover:bg-[#123D59]
                  active:scale-95
                "
              >
                <ChevronRight
                  size={16}
                  className="
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </button>


              {/* dots */}

              <div
                className="
                  ml-1
                  flex
                  items-center
                  gap-[4px]
                "
              >
                {Array.from({
                  length:
                    totalSlides,
                }).map(
                  (_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      aria-label={`Show testimonial page ${
                        dotIndex + 1
                      }`}
                      onClick={() =>
                        setIndex(
                          dotIndex
                        )
                      }
                      className={`
                        h-[4px]
                        rounded-full
                        transition-all
                        duration-300

                        ${
                          index ===
                          dotIndex
                            ? "w-[17px] bg-[#E8B94F]"
                            : "w-[4px] bg-[#8099A8]"
                        }
                      `}
                    />
                  )
                )}
              </div>
            </div>
          </div>


          {/* =================================================
              TESTIMONIAL SLIDE
              ================================================= */}

          <div
            className="
              relative
              min-w-0
              lg:h-[190px]
            "
          >
            <AnimatePresence
              initial={false}
              mode="wait"
            >
              <motion.div
                key={index}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: 18,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        x: -18,
                      }
                }
                transition={{
                  duration: 0.3,
                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
                className="
                  grid
                  h-full
                  gap-5
                  md:grid-cols-2
                  xl:gap-6
                "
              >
                {visibleTestimonials.map(
                  (testimonial) => (
                    <TestimonialCard
                      key={
                        testimonial.name
                      }
                      testimonial={
                        testimonial
                      }
                    />
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>


          {/* =================================================
              RESULT PANEL
              ================================================= */}

          <motion.aside
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 16,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            className="
              relative
              flex
              min-h-[190px]
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-[13px]
              border
              border-[#6D8A9E]/48
              bg-[#0D3854]/74
              px-3
              py-4
              text-center
              shadow-[0_12px_30px_rgba(0,0,0,.15)]
              backdrop-blur-[2px]
              lg:h-[190px]
              lg:min-h-0
            "
          >
            {/* top-right detail */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-[18px]
                -top-[20px]
                h-[68px]
                w-[68px]
                rounded-full
                border
                border-[#B1C0C8]/35
              "
            />


            {/* percent */}

            <motion.p
              animate={
                reduceMotion
                  ? {}
                  : {
                      y: [
                        0,
                        -2,
                        0,
                      ],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                text-[31px]
                font-black
                leading-none
                tracking-[-0.055em]
                text-[#F0C157]
                xl:text-[34px]
              "
            >
              87%
            </motion.p>


            <p
              className="
                mt-3
                max-w-[145px]
                text-[9px]
                font-bold
                leading-[1.45]
                text-[#FFFDF8]
                xl:text-[9.5px]
              "
            >
              see more interviews
              <br />
              within 30 days
            </p>


            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : {
                      scale: [
                        1,
                        1.07,
                        1,
                      ],
                    }
              }
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                mt-5
                flex
                h-[32px]
                w-[32px]
                items-center
                justify-center
                rounded-full
                bg-[#EABC53]/10
                text-[#EABC53]
              "
            >
              <BarChart3
                size={15}
              />
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}


export default TestimonialsSection;
