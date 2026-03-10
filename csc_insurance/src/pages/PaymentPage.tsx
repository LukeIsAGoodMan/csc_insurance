import { Link } from "react-router-dom";
import { AnimateText } from "../components/ui/AnimateText";

const paymentOptions = [
  {
    title: "Send an e-transfer",
    desc: "Pay your CSC Insurance invoice via Interac e-Transfer.",
    to: "/e-transfer",
    internal: true,
  },
  {
    title: "Pay by credit card",
    desc: "Use our secure third-party payment portal to pay by card.",
    to: "https://policypayments.com",
    internal: false,
  },
  {
    title: "Pay direct",
    desc: "Pay your insurance company directly through their online portal.",
    to: "/pay-direct",
    internal: true,
  },
];

export function PaymentPage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <AnimateText
          text="Make a payment."
          className="text-display-hero font-semibold tracking-tighter text-primary"
        />
        <p className="mt-4 max-w-[480px] text-base text-primary/40">
          Choose the method that works best for you.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1120px] gap-px rounded-2xl border border-border-light bg-border-light px-0 md:grid-cols-3">
        {paymentOptions.map((opt) => {
          const inner = (
            <div className="flex h-full flex-col justify-between bg-white/5 p-8 backdrop-blur-sm transition-colors hover:bg-white/15">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{opt.title}</h2>
                <p className="mt-2 text-sm text-primary/40 leading-relaxed">{opt.desc}</p>
              </div>
              <span className="mt-6 text-xs font-medium text-accent-trust">
                {opt.internal ? "Continue" : "Leave site"} &rarr;
              </span>
            </div>
          );

          return opt.internal ? (
            <Link key={opt.title} to={opt.to}>{inner}</Link>
          ) : (
            <a
              key={opt.title}
              href={opt.to}
              target="_blank"
              rel="noopener noreferrer"
            >
              {inner}
            </a>
          );
        })}
      </section>

      <div className="py-20" />
    </article>
  );
}
