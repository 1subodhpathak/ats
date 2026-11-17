import { mkdir, readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';

/* global console */

const siteUrl = String(process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://ats.careersenseai.com').replace(/\/$/, '');
const distHtmlPath = new URL('../dist/index.html', import.meta.url);

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const escapeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const pageTitle = 'Free ATS Resume Checker | Online Resume Score & Keyword Match - CareerSense';
const pageDescription = 'Check your ATS resume score for free with CareerSense. Scan resume formatting, compare against job descriptions, detect missing keywords, and pass recruiter ATS filters.';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'CareerSense ATS Resume Checker',
      url: siteUrl,
      description: pageDescription,
      publisher: {
        '@type': 'Organization',
        name: 'CareerSense',
        url: 'https://careersenseai.com',
        logo: 'https://careersenseai.com/CSlogo.png'
      }
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: 'CareerSense ATS Resume Checker',
      url: siteUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      description: pageDescription,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        category: 'Free'
      },
      featureList: [
        'Instant ATS Score & Match Percentage',
        'Job Description Keyword Match & Gap Analysis',
        'Applicant Tracking System Parseability Audit',
        'Formatting & Layout Compliance Check',
        'Actionable Bullet Point Improvements'
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is an ATS Resume Checker?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An ATS (Applicant Tracking System) resume checker tests whether your resume can be accurately read, parsed, and scored by recruitment software used by top employers like Workday, Taleo, Greenhouse, and Lever.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is a good ATS resume score?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An ATS score of 75% to 80% or higher is considered strong, indicating high keyword alignment with the job description, clean formatting, and clear section hierarchy.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is CareerSense ATS Resume Checker free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can upload your resume and get a free instant ATS score and diagnostic report on CareerSense.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I check my resume against specific job descriptions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can paste any target job description to see exactly which keywords, skills, and qualifications you are missing from your resume.'
          }
        }
      ]
    }
  ]
};

// LIGHT THEME HTML MATCHING ACTIVE PRODUCTION REACT APP
const prerenderBody = `
  <div id="root">
    <div id="home" class="landing-page relative w-full overflow-x-hidden scroll-smooth bg-[#FBF8F1] text-slate-800">
      <!-- EXACT PRODUCTION LIGHT NAVBAR -->
      <header class="relative z-50 w-full border-b border-[#D9C9AA]/65 bg-[#FBF8F1]/96 shadow-[0_8px_24px_rgba(11,52,83,0.10)]">
        <div class="mx-auto flex flex-col w-full max-w-[1600px] px-4 py-2.5 sm:px-8 sm:py-3">
          <div class="flex w-full items-center justify-between gap-3">
            <a href="/" class="flex shrink-0 items-center gap-3">
              <img src="/BlueLogo.png" alt="CareerSense Logo" class="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-2xl shadow-xs shrink-0" />
              <div>
                <span class="text-[25px] font-black leading-none tracking-[-0.04em] block">
                  <span class="text-[#0B3453]">Career</span><span class="text-[#C88A26]">Sense</span>
                </span>
                <span class="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#56768A] block">
                  ATS Intelligence
                </span>
              </div>
            </a>

            <nav class="hidden items-center gap-3.5 xl:gap-5 lg:flex">
              <a href="https://resume.careersenseai.com/" class="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]">Career Tools</a>
              <a href="#why-careersense" class="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]">Why CareerSense</a>
              <a href="#coverage" class="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]">ATS Report</a>
              <a href="#how-it-works" class="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]">How It Works</a>
              <a href="https://careersenseai.com/pricing" class="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]">Pricing</a>
            </nav>

            <div class="flex items-center gap-2">
              <a href="https://careersenseai.com/pricing" class="hidden sm:inline-flex h-10 items-center rounded-xl border border-[#CFE0EC] bg-white/80 px-3 text-[13px] font-black text-[#2F4054]">
                Pricing
              </a>
              <a href="/check-ats" class="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D2E4A] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-[#071C2E]">
                Scan My Resume &rarr;
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- EXACT PRODUCTION HERO SECTION -->
      <section class="relative isolate overflow-hidden border-b border-[#DDD8CF] bg-[#F8F3EA]">
        <!-- HERO BACKGROUND IMAGE -->
        <img src="/hero.png" alt="" aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full object-cover object-center" />
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(250,247,240,.985)_0%,rgba(250,247,240,.96)_26%,rgba(250,247,240,.79)_40%,rgba(250,247,240,.32)_55%,rgba(250,247,240,.07)_70%,rgba(250,247,240,0)_100%)]"></div>
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08),transparent_34%,rgba(248,243,234,.10))]"></div>

        <div class="landing-container relative z-10 mx-auto w-full max-w-[1920px] px-5 py-7 sm:px-8 lg:min-h-[510px] lg:px-12 lg:py-8 xl:px-[88px] 2xl:px-[105px]">
          <div class="grid h-full items-center gap-8 lg:grid-cols-[0.43fr_0.57fr] xl:gap-6">
            <!-- LEFT CONTENT -->
            <div>
              <div class="mb-3.5 flex items-center gap-2.5">
                <span class="h-px w-8 bg-[#B67A21]"></span>
                <p class="text-[8.5px] font-black uppercase tracking-[0.25em] text-[#A96F19] sm:text-[9.5px]">
                  AI-Powered ATS Resume Checker
                </p>
              </div>

              <h1 class="max-w-[690px] font-serif text-[43px] font-semibold leading-[0.93] tracking-[-0.052em] text-[#0D2E4A] sm:text-[50px] md:text-[54px] lg:text-[52px] xl:text-[58px] 2xl:text-[62px]">
                Beat the ATS.<br />
                <span class="text-[#C1882D]">Get More</span> <span class="text-[#0D2E4A]">Interviews.</span>
              </h1>

              <p class="mt-5 max-w-[620px] text-[14px] font-medium leading-[1.68] text-[#456A82] sm:text-[14.5px]">
                Instantly analyze your resume against any job description, uncover what's missing, and get clear, actionable recommendations to improve your chances.
              </p>

              <!-- BUTTONS -->
              <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="/check-ats" class="group inline-flex h-[50px] min-w-[225px] items-center justify-between rounded-[9px] bg-[#0D2E4A] px-6 text-[13px] font-extrabold text-white shadow-[0_10px_22px_rgba(13,46,74,.18)] transition-all hover:bg-[#071C2E]">
                  <span>Scan My Resume</span>
                  <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
                </a>
                <a href="#sample-report" class="inline-flex h-[50px] min-w-[210px] items-center justify-center gap-2.5 rounded-[9px] border border-[#DDD8CF] bg-white/70 px-5 text-[12.5px] font-extrabold text-[#0D2E4A] shadow-[0_8px_18px_rgba(13,46,74,.07)] hover:bg-white transition-all">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span>View Sample Report</span>
                </a>
              </div>

              <!-- STATS -->
              <div class="mt-6 grid max-w-[650px] grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
                <div class="flex items-center gap-2.5">
                  <div class="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] border border-[#D3DDE2] bg-white/90 text-[#0D2E4A] shadow-xs font-bold text-xs">⚡</div>
                  <div>
                    <p class="text-[14px] font-black leading-none text-[#0D2E4A]">100+</p>
                    <p class="mt-1 text-[6.5px] font-black uppercase tracking-[0.13em] text-[#668298]">Check Points</p>
                  </div>
                </div>
                <div class="flex items-center gap-2.5">
                  <div class="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] border border-[#D3DDE2] bg-white/90 text-[#0D2E4A] shadow-xs font-bold text-xs">🎯</div>
                  <div>
                    <p class="text-[14px] font-black leading-none text-[#0D2E4A]">SMART</p>
                    <p class="mt-1 text-[6.5px] font-black uppercase tracking-[0.13em] text-[#668298]">JD Matching</p>
                  </div>
                </div>
                <div class="flex items-center gap-2.5">
                  <div class="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] border border-[#D3DDE2] bg-white/90 text-[#0D2E4A] shadow-xs font-bold text-xs">📄</div>
                  <div>
                    <p class="text-[14px] font-black leading-none text-[#0D2E4A]">95%</p>
                    <p class="mt-1 text-[6.5px] font-black uppercase tracking-[0.13em] text-[#668298]">Accuracy</p>
                  </div>
                </div>
                <div class="flex items-center gap-2.5">
                  <div class="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] border border-[#D3DDE2] bg-white/90 text-[#0D2E4A] shadow-xs font-bold text-xs">⏱️</div>
                  <div>
                    <p class="text-[14px] font-black leading-none text-[#0D2E4A]">60s</p>
                    <p class="mt-1 text-[6.5px] font-black uppercase tracking-[0.13em] text-[#668298]">Instant Results</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT PRODUCT PREVIEW CARDS (EXACT REPLICA OF ACTIVE REACT UI) -->
            <div class="relative z-20 mx-auto hidden h-[390px] w-full max-w-[825px] lg:block xl:translate-x-5">
              <!-- CHECKER PANEL -->
              <div class="absolute left-[4%] top-[35px] z-10 w-[64%] rounded-[14px] border border-[#D8E1E5] bg-[#FFFEFC] p-4 shadow-[0_20px_45px_rgba(10,39,59,.15)]">
                <div class="flex items-center justify-between gap-3">
                  <h2 class="text-[15px] font-black tracking-[-0.025em] text-[#0D2E4A]">
                    CareerSense ATS Checker
                  </h2>
                  <span class="rounded-full bg-[#F5EBD5] px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.13em] text-[#B67A1E]">
                    AI Powered
                  </span>
                </div>

                <!-- RESUME FILE CARD -->
                <div class="mt-4 flex items-center justify-between gap-3 rounded-[8px] border border-[#D7E0E5] bg-white px-3 py-2.5">
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[#EAF3F9] text-[#0D2E4A]">
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-[9.5px] font-extrabold text-[#173A51]">Jordan_Sterling_Resume.pdf</p>
                      <p class="mt-0.5 text-[7px] font-semibold text-[#8CA1AF]">2.4 MB • PDF</p>
                    </div>
                  </div>
                  <button type="button" class="shrink-0 rounded-[7px] border border-[#D5E0E5] bg-white px-3 py-1.5 text-[7.5px] font-extrabold text-[#173A51]">
                    Change
                  </button>
                </div>

                <!-- JOB DESCRIPTION BOX -->
                <div class="mt-3">
                  <label class="text-[8px] font-black text-[#173A51]">
                    Job Description <span class="font-normal text-[#8199A8]">(Optional)</span>
                  </label>
                  <div class="mt-1 min-h-[56px] rounded-[8px] border border-[#CBD9E0] bg-white px-3 py-2 text-[7.5px] font-medium text-[#97A9B4]">
                    Paste the job description or enter a job title...
                  </div>
                  <p class="mt-0.5 text-right text-[6.5px] font-semibold text-[#8EA3AF]">0/2000</p>
                </div>

                <a href="/check-ats" class="mt-3 flex h-[44px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#0B304B] px-4 text-[11px] font-extrabold text-white shadow-md transition hover:bg-[#123D59]">
                  <span>Analyze with CareerSense</span>
                  <span>&rarr;</span>
                </a>
              </div>

              <!-- FLOATING ATS SCORE CARD -->
              <div class="absolute right-[2%] top-[12px] z-20 w-[235px] rounded-[15px] border border-[#DDD8CF] bg-[#FFFDF9] px-4 py-4 shadow-[0_20px_48px_rgba(10,39,59,.18)] xl:w-[245px]">
                <p class="text-center text-[7.5px] font-black text-[#173A51]">Your ATS Score</p>
                <div class="relative mx-auto mt-3 flex h-[98px] w-[98px] items-center justify-center rounded-full" style="background: conic-gradient(#D9A534 0deg 140deg, #EAC455 140deg 190deg, #55BE83 190deg 281deg, #EEF0E9 281deg 360deg);">
                  <div class="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white">
                    <span class="text-[23px] font-black tracking-[-0.05em] text-[#0D2E4A]">78%</span>
                  </div>
                </div>
                <p class="mt-2 text-center text-[14px] font-black text-[#199466]">Good Match</p>
                <p class="mx-auto mt-1 max-w-[180px] text-center text-[7px] font-medium leading-[1.4] text-[#718A99]">
                  Your resume is well aligned, with opportunities to improve.
                </p>
                <div class="mt-3 space-y-1.5">
                  <div class="flex items-center justify-between rounded-[7px] border border-[#E1E8EC] bg-white px-2 py-1.5 text-[8px]">
                    <span class="font-extrabold text-[#159369]">12 Keywords Found</span>
                    <span class="text-[7px] text-[#657E8E] font-semibold">&#10003; Match</span>
                  </div>
                  <div class="flex items-center justify-between rounded-[7px] border border-[#E1E8EC] bg-white px-2 py-1.5 text-[8px]">
                    <span class="font-extrabold text-[#D84E4E]">6 Missing Keywords</span>
                    <span class="text-[7px] text-[#657E8E] font-semibold">&#10005; Gap</span>
                  </div>
                  <div class="flex items-center justify-between rounded-[7px] border border-[#E1E8EC] bg-white px-2 py-1.5 text-[8px]">
                    <span class="font-extrabold text-[#D84E4E]">3 Content Suggestions</span>
                    <span class="text-[7px] text-[#657E8E] font-semibold">&#10005; Rewrite</span>
                  </div>
                  <div class="flex items-center justify-between rounded-[7px] border border-[#E1E8EC] bg-white px-2 py-1.5 text-[8px]">
                    <span class="font-extrabold text-[#159369]">2 Formatting Issues</span>
                    <span class="text-[7px] text-[#657E8E] font-semibold">&#10003; Clean</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TRUSTED COMPANIES SECTION (MATCHES REAL REACT UI) -->
      <section class="border-y border-[#DDD8CF] bg-[#fbfaf7] py-6 px-5 sm:px-8">
        <div class="mx-auto max-w-[1600px] flex flex-col items-center justify-between gap-6 xl:flex-row">
          <div class="min-w-0 flex-1">
            <p class="mb-4 text-center text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#56768A] sm:text-xs xl:text-left">
              Trusted by professionals at top companies
            </p>
            <div class="grid grid-cols-2 items-center gap-x-6 gap-y-4 sm:grid-cols-4 xl:grid-cols-8 xl:gap-6">
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/google.svg" alt="Google" class="max-h-6 w-auto object-contain" /></div>
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/microsoft.svg" alt="Microsoft" class="max-h-6 w-auto object-contain" /></div>
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/amazon.svg" alt="Amazon" class="max-h-6 w-auto object-contain" /></div>
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/meta.svg" alt="Meta" class="max-h-6 w-auto object-contain" /></div>
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/jpmorgan.svg" alt="JPMorgan Chase" class="max-h-6 w-auto object-contain" /></div>
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/deloitte.svg" alt="Deloitte" class="max-h-6 w-auto object-contain" /></div>
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/adobe.svg" alt="Adobe" class="max-h-6 w-auto object-contain" /></div>
              <div class="flex h-8 items-center justify-center px-1"><img src="/companies/linkedin.svg" alt="LinkedIn" class="max-h-6 w-auto object-contain" /></div>
            </div>
          </div>

          <div class="flex shrink-0 items-center justify-center gap-4 xl:border-l xl:border-[#DDD8CF] xl:pl-8">
            <div class="space-y-2">
              <p class="text-center text-xs font-bold leading-snug text-[#0D2E4A] xl:text-left">
                Join 100,000+ job seekers<br />building stronger careers.
              </p>
              <div class="flex items-center justify-center xl:justify-start gap-2">
                <div class="flex -space-x-2">
                  <img src="/testimonials/aarav.png" alt="" class="h-7 w-7 rounded-full border-2 border-[#fbfaf7] object-cover" />
                  <img src="/testimonials/meera.png" alt="" class="h-7 w-7 rounded-full border-2 border-[#fbfaf7] object-cover" />
                  <img src="/testimonials/aditya.png" alt="" class="h-7 w-7 rounded-full border-2 border-[#fbfaf7] object-cover" />
                  <img src="/testimonials/kavya.png" alt="" class="h-7 w-7 rounded-full border-2 border-[#fbfaf7] object-cover" />
                </div>
                <span class="text-xs font-bold text-[#56768A]">&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- KEY FEATURES SECTION -->
      <section class="py-16 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <h2 class="text-2xl font-bold tracking-tight text-[#0D2E4A] sm:text-3xl text-center">
          Engineered for Every Major Applicant Tracking System
        </h2>
        <p class="mt-3 text-sm text-[#56768A] text-center max-w-2xl mx-auto">
          Pass automated filters across Workday, Taleo, Greenhouse, Lever, and iCIMS with comprehensive resume testing.
        </p>

        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-sm">
            <div class="text-2xl mb-3">&#128065;</div>
            <h3 class="text-base font-bold text-[#0D2E4A]">Parseability Test</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">Validates that contact details, work experience, education, and skill sections extract cleanly without corrupting.</p>
          </div>
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-sm">
            <div class="text-2xl mb-3">&#127919;</div>
            <h3 class="text-base font-bold text-[#0D2E4A]">JD Keyword Match</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">Paste target job descriptions to identify exact keyword frequencies, essential skills, and missing terminology.</p>
          </div>
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-sm">
            <div class="text-2xl mb-3">&#128221;</div>
            <h3 class="text-base font-bold text-[#0D2E4A]">Formatting Audit</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">Detects problematic multi-column tables, graphics, non-standard symbols, and font incompatibilities.</p>
          </div>
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-sm">
            <div class="text-2xl mb-3">&#9889;</div>
            <h3 class="text-base font-bold text-[#0D2E4A]">Actionable Fixes</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">Receive line-by-line recommendations to rewrite passive statements into high-impact, measurable achievement bullets.</p>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS SECTION -->
      <section id="how-it-works" class="py-16 px-5 sm:px-8 lg:px-12 bg-white border-y border-[#DDD8CF]">
        <div class="max-w-[1400px] mx-auto">
          <h2 class="text-2xl font-bold tracking-tight text-[#0D2E4A] sm:text-3xl text-center">
            How to Check Your ATS Score in 3 Simple Steps
          </h2>
          <div class="mt-10 grid gap-8 sm:grid-cols-3">
            <div class="text-center p-6">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F3EA] text-[#0D2E4A] font-black text-lg border border-[#D9C9AA]">1</div>
              <h3 class="mt-4 text-base font-bold text-slate-900">Upload Your Resume</h3>
              <p class="mt-2 text-xs text-slate-600 leading-relaxed">Upload PDF or DOCX format. Our parser extracts all textual data and section hierarchies instantly.</p>
            </div>
            <div class="text-center p-6">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F3EA] text-[#0D2E4A] font-black text-lg border border-[#D9C9AA]">2</div>
              <h3 class="mt-4 text-base font-bold text-slate-900">Paste Job Description</h3>
              <p class="mt-2 text-xs text-slate-600 leading-relaxed">Paste the job posting requirements to compare candidate qualifications against employer expectations.</p>
            </div>
            <div class="text-center p-6">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F3EA] text-[#0D2E4A] font-black text-lg border border-[#D9C9AA]">3</div>
              <h3 class="mt-4 text-base font-bold text-slate-900">Get Diagnostic Report</h3>
              <p class="mt-2 text-xs text-slate-600 leading-relaxed">Review overall match rate, missing keywords, and tailored suggestions to optimize before applying.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section class="py-16 px-5 sm:px-8 lg:px-12 max-w-[1200px] mx-auto">
        <h2 class="text-2xl font-bold tracking-tight text-[#0D2E4A] sm:text-3xl text-center">
          Frequently Asked Questions
        </h2>
        <div class="mt-8 space-y-4">
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-xs">
            <h3 class="text-sm font-bold text-slate-900">What is an ATS Resume Checker?</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">An ATS (Applicant Tracking System) resume checker tests whether your resume can be accurately read, parsed, and scored by recruitment software used by top employers like Workday, Taleo, Greenhouse, and Lever.</p>
          </div>
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-xs">
            <h3 class="text-sm font-bold text-slate-900">What is a good ATS resume score?</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">An ATS score of 75% to 80% or higher is considered strong, indicating high keyword alignment with the job description, clean formatting, and clear section hierarchy.</p>
          </div>
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-xs">
            <h3 class="text-sm font-bold text-slate-900">Is CareerSense ATS Resume Checker free?</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">Yes, you can upload your resume and get a free instant ATS score and diagnostic report on CareerSense.</p>
          </div>
          <div class="rounded-2xl border border-[#D9C9AA]/70 bg-white p-6 shadow-xs">
            <h3 class="text-sm font-bold text-slate-900">Can I check my resume against specific job descriptions?</h3>
            <p class="mt-2 text-xs text-slate-600 leading-relaxed">Yes. You can paste any target job description to see exactly which keywords, skills, and qualifications you are missing from your resume.</p>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="border-t border-[#D9C9AA] bg-[#F8F3EA] px-5 py-12 sm:px-8 text-slate-700">
        <div class="mx-auto grid max-w-[1400px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div class="flex items-center gap-2">
              <img src="/BlueLogo.png" alt="CareerSense" class="h-8 w-8 object-contain" />
              <span class="text-lg font-black text-[#0D2E4A]">Career<span class="text-[#C1882D]">Sense</span></span>
            </div>
            <p class="mt-3 text-xs leading-relaxed text-slate-600">
              AI-driven career acceleration tools helping professionals pass recruiter screens and land top interviews.
            </p>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-[#0D2E4A]">CareerSense Tools</h4>
            <ul class="mt-3 space-y-2 text-xs">
              <li><a href="https://resume.careersenseai.com/" class="hover:text-[#B8791D]">AI Resume Builder</a></li>
              <li><a href="https://coverletter.careersenseai.com/" class="hover:text-[#B8791D]">Cover Letter Generator</a></li>
              <li><a href="https://certifi.careersenseai.com/" class="hover:text-[#B8791D]">Skill Certification</a></li>
              <li><a href="https://careersenseai.com/career-gps" class="hover:text-[#B8791D]">Career GPS Diagnostic</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-[#0D2E4A]">Platform</h4>
            <ul class="mt-3 space-y-2 text-xs">
              <li><a href="https://careersenseai.com/pricing" class="hover:text-[#B8791D]">Pricing &amp; Plans</a></li>
              <li><a href="https://careersenseai.com/partner-program" class="hover:text-[#B8791D]">Partner Program</a></li>
              <li><a href="mailto:support@careersenseai.com" class="hover:text-[#B8791D]">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-[#0D2E4A]">ATS Check Points</h4>
            <p class="mt-3 text-xs leading-relaxed text-slate-600">
              Scored against 100+ recruiter heuristics for keyword match, layout readability, font safety, and parseability.
            </p>
          </div>
        </div>
        <div class="mx-auto mt-8 max-w-[1400px] border-t border-[#D9C9AA]/60 pt-6 text-center text-xs text-slate-500">
          &copy; 2026 CareerSense AI. All rights reserved.
        </div>
      </footer>
    </div>
  </div>
`;

async function prerender() {
  try {
    const rawHtml = await readFile(distHtmlPath, 'utf8');

    // 1. GENERATE APP SHELL FOR PRIVATE / INTERNAL ROUTES (dist/app.html + pre-created directories)
    // Prevents flash of homepage when users directly hit /dashboard, /check-ats, /upload, etc.
    // Instead of showing the full pre-rendered landing page, it renders a clean brand spinner
    // loader on frame 1 until React mounts.
    // All SEO pages continue to receive 100% full semantic content with ZERO loader.
    const APP_ROUTES = [
      '/dashboard',
      '/check-ats',
      '/upload',
      '/play-with-resume',
      '/reports',
      '/repository',
      '/analysis',
      '/editor',
      '/preview',
      '/history'
    ];

    const appShellLoader = '<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #FBF8F1;"><div style="width: 36px; height: 36px; border: 3.5px solid #E2E8F0; border-top-color: #0D2E4A; border-radius: 50%; animation: cs-spin 0.8s linear infinite;"></div></div>';
    const appShellStyles = '<style>@keyframes cs-spin { to { transform: rotate(360deg); } }</style>';
    const appShellHtml = rawHtml
      .replace('</head>', `${appShellStyles}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${appShellLoader}</div>`);

    for (const appRoute of APP_ROUTES) {
      const dir = new URL(`../dist${appRoute}/`, import.meta.url);
      await mkdir(dir, { recursive: true });
      await writeFile(new URL('index.html', dir), appShellHtml, 'utf8');
      await writeFile(new URL(`../dist${appRoute}.html`, import.meta.url), appShellHtml, 'utf8');
    }
    await writeFile(new URL('../dist/app.html', import.meta.url), appShellHtml, 'utf8');
    console.log('âœ“ Generated ATS app.html shell with theme loader for internal app routes.');

    // Replace <div id="root"></div> with styled prerenderBody
    let html = rawHtml.replace(/<div id="root"><\/div>/, prerenderBody);
    if (!html.includes('id="home"')) {
      html = html.replace(/<div id="root">[\s\S]*?<\/div>/, prerenderBody);
    }

    // Ensure stylesheet link is at the very top of <head> to prevent white flash
    const stylesheetMatch = html.match(/<link rel="stylesheet"[^>]+>/);
    if (stylesheetMatch) {
      const stylesheetTag = stylesheetMatch[0];
      html = html.replace(stylesheetTag, '');
      html = html.replace('<head>', `<head>\n    ${stylesheetTag}`);
    }

    // Ensure schema is updated
    const schemaTag = `<script type="application/ld+json">${escapeJson(schema)}</script>`;
    if (html.includes('application/ld+json')) {
      html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, schemaTag);
    } else {
      html = html.replace('</head>', `  ${schemaTag}\n</head>`);
    }

    await writeFile(distHtmlPath, html, 'utf8');
    console.log('✓ Successfully prerendered ATS Resume Checker landing page into dist/index.html');
  } catch (err) {
    console.error('Error during ATS prerender:', err);
    process.exit(1);
  }
}

prerender();
