import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Upload, Zap, Download, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Upload Your Images",
    description:
      "Choose your content image and style reference to begin the transformation process.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "AI Processing",
    description:
      "Our advanced AI analyzes both images and applies sophisticated style transfer algorithms.",
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: "Download Result",
    description:
      "Get your stunning artwork in high resolution, ready for print or digital use.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              How It Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your images into stunning artwork in just three simple
              steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-8 text-center h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-full bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">
                Ready to create amazing art?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of artists already using our platform
              </p>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Start Creating
              </motion.a>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
