import { Header } from "@/components/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ServicesSection } from "@/components/landing/services-section"
import { VisionSection } from "@/components/landing/vision-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <VisionSection />
      <CTASection />
      <Footer />
    </main>
  )
}
