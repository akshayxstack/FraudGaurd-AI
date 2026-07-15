export default function TrustStrip() {
  return (
    <section className="border-t border-[#EEF1F5] bg-white pb-3 pt-5">
      <div className="mx-auto w-full max-w-[1432px] px-6 md:px-12 lg:px-[58px]">
        <div className="mb-2 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-red-200 sm:w-24" />
          <span className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#E50914]">
            Trusted by Investigators
          </span>
          <div className="h-px w-12 bg-red-200 sm:w-24" />
        </div>

        <div className="mx-auto max-w-[620px] text-center">
          <h2 className="mb-2 text-[29px] font-extrabold leading-tight tracking-normal text-[#050816] sm:text-[31px]">
            Everything you need to fight financial fraud
          </h2>
          <p className="text-[16px] font-medium leading-snug text-[#657084]">
            Our platform unifies advanced analytics, explainable AI, and investigation tools in one seamless experience.
          </p>
        </div>
      </div>
    </section>
  );
}
