import { ShieldCheck, Trash2, UserRound, UsersRound } from "lucide-react";

const assurances = [
  { label: "Encrypted & secure", icon: ShieldCheck },
  { label: "No public sharing", icon: UsersRound },
  { label: "Delete anytime", icon: Trash2 },
  { label: "Your data, your control", icon: UserRound }
];

function SecurityTrustSection() {
  return (
    <section aria-labelledby="security-trust-heading" className="relative w-full overflow-hidden border-y border-[#ddd8cf] bg-[#fbf8f2]">
      <div className="landing-container grid gap-6 py-6 lg:grid-cols-[minmax(310px,1.05fr)_minmax(0,2.2fr)] lg:items-center lg:py-7">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#a66f1e]">Your Data Stays Private</p>
          <h2 id="security-trust-heading" className="mt-1.5 font-serif text-3xl font-semibold leading-none tracking-[-0.04em] text-[#102d47] sm:text-[24px]">Security you can trust.</h2>
          <p className="mt-2 text-xs font-medium text-[#607b8d] sm:text-sm">Your resume is your personal information. We keep it safe.</p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">
          {assurances.map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e4f1ff] text-[#123fa4] sm:h-14 sm:w-14">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
              </span>
              <span className="text-[11px] font-semibold leading-snug text-[#536f83] sm:text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SecurityTrustSection;
