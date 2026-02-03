"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, User } from "lucide-react";

interface AuthFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

type AuthStep = "email" | "profile";

const AuthFlow = ({ onComplete, onBack }: AuthFlowProps) => {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep("profile");
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && department) onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 w-full max-w-md"
      >
        <button
          onClick={step === "email" ? onBack : () => setStep("email")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleEmailSubmit}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to DFW Beaver ID</h2>
              <p className="text-muted-foreground mb-6">Enter your work email to continue</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@wildlife.gov"
                    className="input-dark w-full"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleProfileSubmit}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
              <p className="text-muted-foreground mb-6">Tell us a bit about yourself</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="input-dark w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Department / Team</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Wildlife Research Division"
                    className="input-dark w-full"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className={`w-2 h-2 rounded-full transition-colors ${step === "email" ? "bg-primary" : "bg-muted"}`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${step === "profile" ? "bg-primary" : "bg-muted"}`} />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthFlow;
