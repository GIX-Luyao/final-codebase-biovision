import { motion } from "framer-motion";
import { Upload, Play, Edit3, Download, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Upload images or ZIP files",
  },
  {
    icon: Play,
    title: "Run Detection",
    description: "AI processes your batch",
  },
  {
    icon: Edit3,
    title: "Review & Correct",
    description: "Validate and fix labels",
  },
  {
    icon: Download,
    title: "Export CSV",
    description: "Download your results",
  },
  {
    icon: MessageCircle,
    title: "Ask Chatbot",
    description: "Get instant insights",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient-blue">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From upload to insights in five simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 -translate-y-1/2" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground relative z-10">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-mono">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
