import React, { useMemo } from "react";
import { Info, Mail, Phone, MapPin, Linkedin, FileText, CheckCircle } from "lucide-react";

function Ats({ resume, report }) {
  // Extract data from the report or fallback to resume
  const profile = report?.extracted_resume_data?.candidate_profile || {};
  const education = report?.extracted_resume_data?.education || [];
  const workExperience = report?.extracted_resume_data?.work_experience || [];
  const skills = report?.extracted_resume_data?.skills || {};
  const projects = report?.extracted_resume_data?.projects || [];
  const certifications = report?.extracted_resume_data?.certifications || [];

  // Parse candidate name
  const candidateName = profile.name || report?.candidate_name || resume?.candidate_name || "[CANDIDATE_NAME]";
  
  // Format skills list
  const formattedSkills = useMemo(() => {
    const allSkills = [
      ...(skills.technical_skills || []),
      ...(skills.tools || []),
      ...(skills.programming_languages || []),
      ...(skills.bi_tools || []),
      ...(skills.data_tools || []),
      ...(skills.analytics_methods || []),
      ...(skills.soft_skills || [])
    ];
    // Remove duplicates
    const uniqueSkills = Array.from(new Set(allSkills.map(s => String(s).trim()))).filter(Boolean);
    return uniqueSkills.length > 0 ? uniqueSkills.join(", ") : "[TECHNICAL_SKILLS_LIST]";
  }, [skills]);

  // Determine section display status
  const summaryText = profile.summary || "[PROFESSIONAL_SUMMARY_STATEMENT]";

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm w-full max-w-4xl">
      {/* Sandbox Banner */}
      <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-indigo-800 text-indigo-300">
            <CheckCircle className="h-4.5 w-4.5" />
          </span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              100% ATS optimized blueprint
            </h4>
            <p className="text-[10px] text-indigo-200 font-bold">
              This layout demonstrates what a perfect, 100% ATS-readable single-column template should look like.
            </p>
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-indigo-50 flex items-start gap-2.5 border-b border-slate-200">
        <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-indigo-950 font-bold">
          All multi-columns, complex graphics, tables, and parse-blocking formats have been automatically flattened into a standard single-column blueprint. Missing credentials are flagged with <span className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-black border border-rose-200">[placeholder]</span> tags for easy completion.
        </div>
      </div>

      {/* A4 Resume Simulator Canvas */}
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-200 max-h-[66vh]">
        <div className="w-[210mm] min-h-[297mm] bg-[#FAF8F5] p-14 shadow-lg border border-slate-350 flex flex-col font-serif text-[11px] leading-[1.6] text-[#2c2c2c] tracking-wide">
          
          {/* Resume Header */}
          <header className="text-center border-b border-[#C8D9E6] pb-4">
            <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-wider uppercase mb-1">
              {candidateName}
            </h1>
            
            {/* Contact details row */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[#567C8D] font-semibold text-[10px]">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-[#567C8D]/60 shrink-0" />
                {profile.email ? (
                  <span className="text-[#2c2c2c]">{profile.email}</span>
                ) : (
                  <span className="text-rose-600 bg-rose-50 border border-rose-200 rounded px-1">[users_email]</span>
                )}
              </span>

              <span className="text-slate-300">•</span>

              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-[#567C8D]/60 shrink-0" />
                {profile.phone ? (
                  <span className="text-[#2c2c2c]">{profile.phone}</span>
                ) : (
                  <span className="text-rose-600 bg-rose-50 border border-rose-200 rounded px-1">[users_phone]</span>
                )}
              </span>

              <span className="text-slate-300">•</span>

              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#567C8D]/60 shrink-0" />
                {profile.location && profile.location !== "Location verified" ? (
                  <span className="text-[#2c2c2c]">{profile.location}</span>
                ) : (
                  <span className="text-rose-600 bg-rose-50 border border-rose-200 rounded px-1">[users_location]</span>
                )}
              </span>

              <span className="text-slate-300">•</span>

              <span className="flex items-center gap-1">
                <Linkedin className="h-3.5 w-3.5 text-[#567C8D]/60 shrink-0" />
                {profile.linkedin ? (
                  <span className="text-[#2c2c2c] truncate max-w-[220px]">{profile.linkedin}</span>
                ) : (
                  <span className="text-rose-600 bg-rose-50 border border-rose-200 rounded px-1">[users_linkedin]</span>
                )}
              </span>
            </div>
          </header>

          {/* Resume Body */}
          <div className="mt-5 space-y-5">
            
            {/* Professional Summary Section */}
            <section className="space-y-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] border-b border-[#7f7f7f] pb-0.5 mb-1.5">
                Professional Summary
              </h2>
              <p className={`text-[#3c3c3c] font-medium leading-relaxed ${!profile.summary ? "text-rose-600 bg-rose-50 border border-rose-100 rounded p-1.5 inline-block" : ""}`}>
                {summaryText}
              </p>
            </section>

            {/* Core Skills Section */}
            <section className="space-y-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] border-b border-[#7f7f7f] pb-0.5 mb-1.5">
                Core Skills
              </h2>
              <p className={`text-[#3c3c3c] font-medium ${formattedSkills === "[TECHNICAL_SKILLS_LIST]" ? "text-rose-600 bg-rose-50 border border-rose-100 rounded p-1.5 inline-block" : ""}`}>
                {formattedSkills}
              </p>
            </section>

            {/* Professional Experience Section */}
            <section className="space-y-3.5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] border-b border-[#7f7f7f] pb-0.5 mb-1.5">
                Professional Experience
              </h2>
              
              {workExperience.length > 0 ? (
                workExperience.map((job, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[#1a1a1a] font-bold">
                      <span className="text-[11.5px]">{job.title || "[Role Title]"}</span>
                      <span className="text-[9.5px] text-[#567C8D]">{job.start_date || "2021"} – {job.end_date || "Present"}</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#567C8D] italic">
                      {job.company || "[Company Name]"}
                    </div>
                    <ul className="list-disc pl-5 mt-0.5 space-y-0.5 text-[#3c3c3c]">
                      {(job.bullets || []).map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed font-medium">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="text-rose-600 bg-rose-50 border border-rose-100 rounded p-4 font-bold text-center">
                  [WORK_EXPERIENCE_PLACEHOLDER] - Provide job titles, companies, dates, and metric-focused accomplishments.
                </div>
              )}
            </section>

            {/* Education Section */}
            <section className="space-y-2.5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] border-b border-[#7f7f7f] pb-0.5 mb-1.5">
                Education
              </h2>
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <div className="text-[11.5px] font-bold text-[#1a1a1a]">
                        {edu.degree || "[Degree Details]"}
                      </div>
                      <div className="text-[9.5px] text-[#567C8D] font-bold italic">
                        {edu.institution || "[Institution Name]"}
                      </div>
                    </div>
                    <span className="text-[9.5px] text-[#567C8D] font-bold shrink-0">
                      {edu.end_year || "[Year]"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-rose-600 bg-rose-50 border border-rose-100 rounded p-3 font-bold text-center">
                  [EDUCATION_DETAILS_PLACEHOLDER] - Provide degree level, major, institution, and graduation year.
                </div>
              )}
            </section>

            {/* Projects Section */}
            {projects.length > 0 && (
              <section className="space-y-2.5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] border-b border-[#7f7f7f] pb-0.5 mb-1.5">
                  Key Projects
                </h2>
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="font-bold text-[#1a1a1a]">
                      {proj.name || "[Project Title]"}
                    </div>
                    <p className="text-[#3c3c3c] font-medium leading-relaxed">
                      {proj.description || "[Project Description]"}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Certifications Section */}
            {certifications.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] border-b border-[#7f7f7f] pb-0.5 mb-1.5">
                  Certifications
                </h2>
                <ul className="list-disc pl-5 space-y-0.5 text-[#3c3c3c]">
                  {certifications.map((cert, idx) => (
                    <li key={idx} className="font-medium leading-relaxed">
                      {cert.name || "[Certification Name]"}
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Ats;
