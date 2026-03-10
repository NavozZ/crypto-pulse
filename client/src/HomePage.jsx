import Hero        from "./components/ui/Hero";
import LivePrices   from "./components/ui/liveprices";
import StatsBar     from "./components/ui/StatsBar";
import Features     from "./components/ui/features";
import HowItWorks   from "./components/ui/HowItWorks";
import CallToAction from "./components/ui/CallToAction";

function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <StatsBar />
      <LivePrices />
      <HowItWorks />
      <Features />
      <CallToAction />
    </main>
  );
}

export default HomePage;
