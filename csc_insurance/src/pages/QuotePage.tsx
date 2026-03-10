export function QuotePage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-display-hero font-semibold tracking-tighter text-primary">
          Get a quote.
        </h1>
        <p className="mt-4 max-w-[480px] text-base text-primary/40">
          Tell us what you would like to insure and we will get back to you as soon as possible.
        </p>
      </section>

      <section className="mx-auto max-w-[560px] px-6 pb-20">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="q-name" className="block text-xs font-medium text-primary/40 mb-1">
              Full name
            </label>
            <input
              id="q-name"
              type="text"
              required
              className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30"
            />
          </div>
          <div>
            <label htmlFor="q-email" className="block text-xs font-medium text-primary/40 mb-1">
              Email
            </label>
            <input
              id="q-email"
              type="email"
              required
              className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30"
            />
          </div>
          <div>
            <label htmlFor="q-phone" className="block text-xs font-medium text-primary/40 mb-1">
              Phone
            </label>
            <input
              id="q-phone"
              type="tel"
              className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30"
            />
          </div>
          <div>
            <label htmlFor="q-type" className="block text-xs font-medium text-primary/40 mb-1">
              Insurance type
            </label>
            <select
              id="q-type"
              className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30"
            >
              <option value="">Select...</option>
              <option value="auto">Auto</option>
              <option value="home">Home / Property</option>
              <option value="business">Business</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="q-details" className="block text-xs font-medium text-primary/40 mb-1">
              Tell us more
            </label>
            <textarea
              id="q-details"
              rows={4}
              className="w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent-trust/30 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full border border-accent-trust px-8 py-3 text-sm font-medium text-accent-trust transition-colors hover:bg-accent-trust hover:text-white"
          >
            Submit quote request
          </button>
        </form>
      </section>
    </article>
  );
}
