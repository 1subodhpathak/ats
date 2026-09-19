import ATSHero from "../components/layout/ATSHero";
import ATSReportCoverage from "../components/layout/ATSReportCoverage";
import FinalCTASection from "../components/landing/FinalCTASection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ReportBreakdownSection from "../components/landing/ReportBreakdownSection";
import SecurityTrustSection from "../components/landing/SecurityTrustSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import TrustedCompaniesSection from "../components/landing/TrustedCompaniesSection";
import WhyCareerSenseSection from "../components/landing/WhyCareerSenseSection";

function Home() {
  return (
    <div id="home" className="landing-page relative w-full overflow-x-hidden scroll-smooth">
      <ATSHero />
      <TrustedCompaniesSection />
      <main className="relative min-h-screen w-full overflow-hidden bg-swanwing font-sans text-slate-800">
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(to right, #3C507D 1px, transparent 1px), linear-gradient(to bottom, #3C507D 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div aria-hidden="true" className="absolute left-10 top-1/4 -z-10 h-96 w-96 rounded-full bg-royalblue/5 blur-3xl" />
        <div aria-hidden="true" className="absolute right-10 top-1/3 -z-10 h-96 w-96 rounded-full bg-quicksand/10 blur-3xl" />
        <div className="w-full">
          <WhyCareerSenseSection />
          <div>
            <div>
              <ATSReportCoverage />
              <ReportBreakdownSection />
            </div>
            <HowItWorksSection />
            <div>
              <TestimonialsSection />
              <SecurityTrustSection />
            </div>
            <FinalCTASection />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
