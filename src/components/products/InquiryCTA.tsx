import Link from "next/link";

export function InquiryCTA() {
  return (
    <section className="py-14 lg:py-20">
      <div className="shell text-center">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.03em] text-[#111827] mb-4">
          Need a specific torque, mounting structure, or motion feel?
        </h2>
        <p className="text-[#666666] text-[15px] sm:text-[17px] mb-8 max-w-xl mx-auto">
          TEAO can support customized damper solutions within standard torque ranges. Tell us your
          application and requirements.
        </p>
        <Link href="/contact" className="btn btn-primary text-base px-7">
          Send Inquiry
        </Link>
      </div>
    </section>
  );
}
