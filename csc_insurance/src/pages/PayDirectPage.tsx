const carriers = [
  { name: "Aviva", url: "https://www.aviva.ca" },
  { name: "CAA Insurance", url: "https://www.caainsurance.com" },
  { name: "Coachman Insurance", url: "https://www.coachmaninsurance.com" },
  { name: "Echelon Insurance", url: "https://www.echeloninsurance.ca" },
  { name: "Economical Insurance", url: "https://www.economical.com" },
  { name: "Gore Mutual", url: "https://www.goremutual.ca" },
  { name: "Intact Insurance", url: "https://www.intact.ca" },
  { name: "Pafco Insurance", url: "https://www.pafco.ca" },
  { name: "Pembridge Insurance", url: "https://www.pembridge.com" },
  { name: "RSA Canada", url: "https://www.rsagroup.ca" },
  { name: "SGI Canada", url: "https://www.sgicanada.ca" },
  { name: "Unica Insurance", url: "https://www.unicainsurance.com" },
  { name: "Wawanesa Insurance", url: "https://www.wawanesa.com" },
];

export function PayDirectPage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-display-hero font-semibold tracking-tighter text-primary">
          Pay direct.
        </h1>
        <p className="mt-4 max-w-[520px] text-base text-primary/40">
          Pay your insurance company directly through their online portal.
        </p>
      </section>

      <section className="mx-auto max-w-[780px] px-6 pb-20">
        <ul className="divide-y divide-border-light">
          {carriers.map((c) => (
            <li key={c.name}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-4 text-sm transition-colors hover:text-accent-trust"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-primary/25">External &rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
