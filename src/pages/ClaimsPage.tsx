import { AnimateText } from "../components/ui/AnimateText";

const claimLines = [
  { carrier: "Aviva", phone: "1-866-692-8482", url: "https://www.aviva.ca/en/claims/" },
  { carrier: "CAA Insurance", phone: "1-800-222-4357", url: "https://www.caainsurance.com/claims" },
  { carrier: "Echelon Insurance", phone: "1-800-269-2923", url: "https://www.echeloninsurance.ca" },
  { carrier: "Economical Insurance", phone: "1-800-607-2424", url: "https://www.economical.com/en/claims" },
  { carrier: "Gore Mutual", phone: "1-800-265-8600", url: "https://www.goremutual.ca/claims" },
  { carrier: "Intact Insurance", phone: "1-866-464-2424", url: "https://www.intact.ca/en/claims.html" },
  { carrier: "Jevco Insurance", phone: "1-866-538-2648", url: "https://www.jevcoinsurance.com" },
  { carrier: "Pafco Insurance", phone: "1-800-265-8098", url: "https://www.pafco.ca" },
  { carrier: "Pembridge Insurance", phone: "1-800-387-0462", url: "https://www.pembridge.com" },
  { carrier: "RSA Canada", phone: "1-800-319-9993", url: "https://www.rsagroup.ca/claims" },
  { carrier: "SGI Canada", phone: "1-800-647-6448", url: "https://www.sgicanada.ca" },
  { carrier: "Wawanesa Insurance", phone: "1-800-997-0014", url: "https://www.wawanesa.com/canada/claims" },
];

export function ClaimsPage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <AnimateText
          text="After hours claims."
          className="text-display-hero font-semibold tracking-tighter text-primary"
        />
        <p className="mt-4 max-w-[520px] text-base text-primary/40">
          Need to file a claim outside of business hours? Contact your insurer directly.
        </p>
      </section>

      <section className="mx-auto max-w-[780px] px-6 pb-20">
        <ul className="divide-y divide-border-light">
          {claimLines.map((c) => (
            <li key={c.carrier} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium">{c.carrier}</span>
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                  className="text-sm text-accent-trust"
                >
                  {c.phone}
                </a>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary/30 hover:text-primary/60"
                >
                  Website &rarr;
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
