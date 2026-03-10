import { AnimateText } from "../components/ui/AnimateText";

export function ContactPage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <AnimateText
          text="Get in touch."
          className="text-display-hero font-semibold tracking-tighter text-primary"
        />
        <p className="mt-4 max-w-[480px] text-base text-primary/40">
          Give us a call or fill out the form below and we will get back to you as soon as possible.
        </p>
      </section>

      <section className="mx-auto max-w-[780px] px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-4 text-sm text-primary/55">
            <div>
              <p className="font-medium text-primary/80">Address</p>
              <p>4168 Finch Ave E, Suite 218</p>
              <p>Scarborough, ON M1S 5H6</p>
            </div>
            <div>
              <p className="font-medium text-primary/80">Phone</p>
              <p>
                <a href="tel:+14163218000" className="text-accent-trust">
                  (416) 321-8000
                </a>
              </p>
            </div>
            <div>
              <p className="font-medium text-primary/80">Email</p>
              <p>
                <a href="mailto:info@cscinsurance.ca" className="text-accent-trust">
                  info@cscinsurance.ca
                </a>
              </p>
            </div>
            <div>
              <p className="font-medium text-primary/80">Hours</p>
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>

          {/* Contact form placeholder */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-primary/40 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-primary/40 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-primary/40 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30 resize-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full border border-accent-trust px-8 py-3 text-sm font-medium text-accent-trust transition-colors hover:bg-accent-trust hover:text-white"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
