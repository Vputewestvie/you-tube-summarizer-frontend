import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { Summarizer } from "@/components/summarizer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-16 pt-16 sm:pt-24">
        <Hero />
        <section className="mt-10 sm:mt-12">
          <Summarizer />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
