import { motion } from "framer-motion";
import { ScanEye, Squirrel, Users, MessageSquare } from "lucide-react";

const features = [
  {
    icon: ScanEye,
    title: "Beaver Detection",
    description: "Advanced ML model trained specifically for beaver identification in trail camera footage.",
    color: "primary",
  },
  {
    icon: Squirrel,
    title: "Other Animal Detection",
    description: "Automatically classify other wildlife species captured in your images.",
    color: "secondary",
  },
  {
    icon: Users,
    title: "Human Label Grouping",
    description: "Manual correction tools for biologists to refine and validate predictions.",
    color: "primary",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Ask questions about your results for fast counting and summaries.",
    color: "secondary",
  },
];

const FeatureCards = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Core <span className="text-gradient-green">Highlights</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to process and analyze trail camera data efficiently
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel-hover p-6 group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === "primary"
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary/20 text-secondary"
                }`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
