import { readFile, writeFile } from 'node:fs/promises';
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
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      'name': 'CareerSense ATS Resume Checker',
      'url': siteUrl,
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      'description': pageDescription,
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
        'category': 'Free'
      },
      'featureList': [
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
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is an ATS Resume Checker?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'An ATS (Applicant Tracking System) resume checker tests whether your resume can be accurately read, parsed, and scored by recruitment software used by top employers like Workday, Taleo, Greenhouse, and Lever.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What is a good ATS resume score?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'An ATS score of 75% to 80% or higher is considered strong, indicating high keyword alignment with the job description, clean formatting, and clear section hierarchy.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Is CareerSense ATS Resume Checker free?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, you can upload your resume and get a free instant ATS score and diagnostic report on CareerSense.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Can I check my resume against specific job descriptions?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. You can paste any target job description to see exactly which keywords, skills, and qualifications you are missing from your resume.'
          }
        }
      ]
    }
  ]
};

const prerenderBody = `
  <div id="root">
    <div style="min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background: #f8fafc;">
      <div style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #0d9488; border-radius: 50%; animation: cs-spin 0.8s linear infinite;"></div>
    </div>
  </div>
  <noscript>
    <style>
      #root { display: none !important; }
      .cs-seo-fallback {
        max-width: 960px;
        margin: 40px auto;
        padding: 24px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #071426;
        line-height: 1.6;
      }
      .cs-seo-fallback h1 { font-size: 32px; font-weight: 700; color: #071426; margin-bottom: 16px; }
      .cs-seo-fallback h2 { font-size: 22px; font-weight: 600; color: #123B6D; margin-top: 28px; margin-bottom: 12px; }
      .cs-seo-fallback h3 { font-size: 17px; font-weight: 600; color: #071426; margin-top: 18px; margin-bottom: 6px; }
      .cs-seo-fallback p { color: #475569; margin-bottom: 16px; font-size: 16px; }
      .cs-seo-fallback a { color: #123B6D; font-weight: 600; text-decoration: underline; }
      .cs-seo-fallback ul, .cs-seo-fallback ol { padding-left: 22px; margin-bottom: 20px; }
      .cs-seo-fallback li { margin-bottom: 8px; color: #334155; }
      .cs-seo-fallback .badge { display: inline-block; background: #E2E8F0; color: #0F172A; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px; }
      .cs-seo-fallback .faq-item { border-bottom: 1px solid #E2E8F0; padding-bottom: 14px; margin-bottom: 14px; }
    </style>
    <div class="cs-seo-fallback">
      <span class="badge">CareerSense AI Workspace</span>
      <h1>Free ATS Resume Score Checker</h1>
      <p>Analyze your resume against top Applicant Tracking Systems. Spot keyword gaps, test readability, and increase interview callbacks with actionable AI diagnostics.</p>

      <h2>Key Features of CareerSense ATS Checker</h2>
      <ul>
        <li><strong>ATS Parseability Test:</strong> Validates whether automated applicant tracking systems can extract your contact details, education, work experience, and skills without errors.</li>
        <li><strong>Job Description Keyword Matching:</strong> Paste any job listing to see missing skills, keyword frequency, and overall match percentage.</li>
        <li><strong>Formatting &amp; Structure Audit:</strong> Detects problematic tables, non-standard fonts, column layouts, or symbols that cause ATS systems to drop your resume.</li>
        <li><strong>Actionable Improvement Report:</strong> Receive step-by-step suggestions to rewrite weak bullet points into high-impact, measurable achievements.</li>
      </ul>

      <h2>How to Check Your ATS Score in 3 Simple Steps</h2>
      <ol>
        <li><strong>Upload Your Resume:</strong> Upload your PDF or DOCX resume to initiate the automated parsing audit.</li>
        <li><strong>Add the Job Description:</strong> Paste the requirements and responsibilities of the role you are applying for.</li>
        <li><strong>Review Your Score &amp; Recommendations:</strong> Get an instant breakdown of keyword matches, formatting compliance, and missing skills to optimize your resume before submitting.</li>
      </ol>

      <h2>Frequently Asked Questions</h2>
      <div class="faq-item">
        <h3>What is an ATS Resume Checker?</h3>
        <p>An ATS (Applicant Tracking System) resume checker tests whether your resume can be accurately read, parsed, and scored by recruitment software used by top employers like Workday, Taleo, Greenhouse, and Lever.</p>
      </div>
      <div class="faq-item">
        <h3>What is a good ATS resume score?</h3>
        <p>An ATS score of 75% to 80% or higher is considered strong, indicating high keyword alignment with the job description, clean formatting, and clear section hierarchy.</p>
      </div>
      <div class="faq-item">
        <h3>Is CareerSense ATS Resume Checker free?</h3>
        <p>Yes, you can upload your resume and get a free instant ATS score and diagnostic report on CareerSense.</p>
      </div>
      <div class="faq-item">
        <h3>Can I check my resume against specific job descriptions?</h3>
        <p>Yes. You can paste any target job description to see exactly which keywords, skills, and qualifications you are missing from your resume.</p>
      </div>

      <h2>Explore the CareerSense AI Ecosystem</h2>
      <ul>
        <li><a href="https://resume.careersenseai.com/">Free AI Resume Builder</a> — Build ATS-compliant resumes with 60+ job-specific examples and templates.</li>
        <li><a href="https://coverletter.careersenseai.com/">Free AI Cover Letter Builder</a> — Generate tailored executive cover letters calibrated to any job description.</li>
        <li><a href="https://careersenseai.com/">CareerSense Platform</a> — Unified career acceleration suite for tech professionals and executives.</li>
      </ul>
    </div>
  </noscript>`;

async function prerender() {
  try {
    const rawHtml = await readFile(distHtmlPath, 'utf8');

    const headInject = `
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(pageDescription)}" />
    <meta name="keywords" content="ATS resume checker, free ATS score check, resume scanner, resume keyword match, ATS compliance test, CareerSense ATS" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${siteUrl}/" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CareerSense" />
    <meta property="og:url" content="${siteUrl}/" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDescription)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${siteUrl}/" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDescription)}" />
    <style>@keyframes cs-spin{to{transform:rotate(360deg)}}body{margin:0;background-color:#f8fafc;}</style>
    <script type="application/ld+json">${escapeJson(schema)}</script>`;

    let processed = rawHtml
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta name="description"[\s\S]*?>/i, '')
      .replace(/<meta name="keywords"[\s\S]*?>/i, '')
      .replace(/<meta name="robots"[\s\S]*?>/i, '')
      .replace(/<link rel="canonical"[\s\S]*?>/i, '')
      .replace(/<meta property="og:[\s\S]*?>/gi, '')
      .replace(/<meta name="twitter:[\s\S]*?>/gi, '')
      .replace(/<meta property="twitter:[\s\S]*?>/gi, '')
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

    processed = processed.replace('</head>', `${headInject}\n  </head>`);

    if (processed.includes('<div id="root"></div>')) {
      processed = processed.replace('<div id="root"></div>', prerenderBody);
    }

    await writeFile(distHtmlPath, processed, 'utf8');
    console.log('✓ Successfully prerendered ATS_Score SEO fallback into dist/index.html');
  } catch (err) {
    console.error('Error during ATS_Score prerender:', err);
    process.exit(1);
  }
}

prerender();
