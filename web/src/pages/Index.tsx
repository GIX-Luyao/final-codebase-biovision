"use client";

import { useState } from "react";
import Hero from "@/components/landing/Hero";
import FeatureCards from "@/components/landing/FeatureCards";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import AuthFlow from "@/components/auth/AuthFlow";
import MainApp from "@/components/app/MainApp";

type AppState = "landing" | "auth" | "app";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  if (appState === "auth") {
    return (
      <AuthFlow
        onComplete={() => setAppState("app")}
        onBack={() => setAppState("landing")}
      />
    );
  }

  if (appState === "app") {
    return <MainApp onLogout={() => setAppState("landing")} />;
  }

  return (
    <div className="relative z-10">
      <Hero
        onGetStarted={() => setAppState("auth")}
        onLearnMore={scrollToHowItWorks}
      />
      <FeatureCards />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
