"use client"

export function FeaturesSection() {
  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="text-eyebrow mb-4">Editorial</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6 text-foreground font-display">
            A composed intelligence layer for creative teams.
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for directors, studios, and decision makers who need clarity without noise.
          </p>
        </div>

        <div className="space-y-12">
          <div className="pt-2">
            <h3 className="text-2xl lg:text-3xl font-semibold text-foreground font-display">
              Visual Intelligence
            </h3>
            <p className="mt-4 text-base lg:text-lg text-muted-foreground max-w-3xl">
              A quiet layer of understanding that reads light, tone, and structure with the patience of a creative director.
            </p>
          </div>

          <div className="pt-2">
            <h3 className="text-2xl lg:text-3xl font-semibold text-foreground font-display">
              Cinematic Reading
            </h3>
            <p className="mt-4 text-base lg:text-lg text-muted-foreground max-w-3xl">
              Each frame is interpreted with narrative intent, balancing emotion and craft in a single, coherent voice.
            </p>
          </div>

          <div className="pt-2">
            <h3 className="text-2xl lg:text-3xl font-semibold text-foreground font-display">
              Creative Decision Engine
            </h3>
            <p className="mt-4 text-base lg:text-lg text-muted-foreground max-w-3xl">
              Decisions arrive distilled and confident, structured for teams that move with precision.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
