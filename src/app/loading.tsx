/**
 * Branded skeleton — hairline blocks pulsing at low opacity, matching the shape
 * of a page hero followed by a content section. Not a spinner on an empty page.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>

      <div className="h-[280px] w-full bg-ink-900 md:h-[380px]">
        <div className="container-site flex h-full flex-col justify-end pb-10 pt-24">
          <span className="block h-3 w-40 animate-pulse-hairline bg-white" />
          <span className="mt-6 block h-10 w-[min(560px,80%)] animate-pulse-hairline bg-white" />
          <span className="mt-4 block h-4 w-[min(420px,70%)] animate-pulse-hairline bg-white" />
        </div>
      </div>

      <div className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <span className="block h-3 w-32 animate-pulse-hairline bg-ink-900" />
            <span className="block h-8 w-4/5 animate-pulse-hairline bg-ink-900" />
          </div>
          <div className="flex flex-col gap-3 lg:col-span-6 lg:col-start-7">
            {[0, 1, 2, 3, 4].map((row) => (
              <span key={row} className="block h-4 w-full animate-pulse-hairline bg-ink-900" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
