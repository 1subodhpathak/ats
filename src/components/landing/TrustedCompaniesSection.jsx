import { ArrowRight } from "lucide-react";
import aaravImage from "../../assets/testimonials/aarav.png";
import adityaImage from "../../assets/testimonials/aditya.png";
import kavyaImage from "../../assets/testimonials/kavya.png";
import meeraImage from "../../assets/testimonials/meera.png";

const companies = [
  { name: "Google", src: "https://api.iconify.design/logos:google.svg" },
  { name: "Microsoft", src: "https://api.iconify.design/logos:microsoft.svg" },
  { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta", src: "https://api.iconify.design/logos:meta.svg" },
  { name: "JPMorgan Chase", src: "https://upload.wikimedia.org/wikipedia/commons/e/e0/JPMorgan_Chase.svg" },
  { name: "Deloitte", src: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_Deloitte.svg" },
  { name: "Adobe", src: "https://api.iconify.design/logos:adobe.svg" },
  { name: "LinkedIn", src: "https://api.iconify.design/logos:linkedin.svg" }
];

const avatars = [aaravImage, meeraImage, adityaImage, kavyaImage];

function TrustedCompaniesSection() {
  return (
    <section aria-labelledby="trusted-companies-heading" className="border-y border-shellstone/40 bg-[#fbfaf7]">
      <div className="landing-container flex flex-col gap-6 py-7 xl:flex-row xl:items-center xl:gap-10 xl:py-6">
        <div className="min-w-0 flex-1">
          <h2 id="trusted-companies-heading" className="mb-5 text-center text-[10px] font-extrabold uppercase tracking-[0.28em] text-sapphire sm:text-xs xl:mb-4">
            Trusted by professionals at top companies
          </h2>
          <div className="grid grid-cols-2 items-center gap-x-7 gap-y-6 sm:grid-cols-4 xl:grid-cols-8 xl:gap-8">
            {companies.map(({ name, src }) => (
              <div key={name} className="flex h-9 items-center justify-center px-1">
                <img
                  src={src}
                  alt={`${name} logo`}
                  loading="lazy"
                  className="max-h-7 w-auto max-w-full object-contain sm:max-h-8"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-4 border-shellstone/50 xl:border-l xl:pl-9">
          <div className="space-y-3">
            <p className="text-center text-sm font-bold leading-snug text-royalblue xl:text-left">
              Join 100,000+ job seekers<br />building stronger careers.
            </p>
            <div className="flex items-center justify-center xl:justify-start">
              <div className="flex -space-x-2.5">
                {avatars.map((avatar, index) => <img key={avatar} src={avatar} alt="" className="h-9 w-9 rounded-full border-2 border-[#fbfaf7] object-cover object-top" style={{ zIndex: avatars.length - index }} />)}
              </div>
              <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4 text-sapphire/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedCompaniesSection;
