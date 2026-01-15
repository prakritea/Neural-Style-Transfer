import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Zap,
  Star,
  Quote,
  Send,
  X,
  Download,
  Camera,
  Video,
  VideoOff,
  Wand2,
  Palette,
  Gauge,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useTheme } from "next-themes";
import * as THREE from "three";

// 3D Animated Sphere Component
function AnimatedSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Blue for dark mode, Cyan/Blue for light mode
  const sphereColor = theme === "dark" ? "#00d4ff" : "#0099ff";

  return (
    <Sphere ref={meshRef} position={position} args={[1, 32, 32]}>
      <MeshDistortMaterial
        color={sphereColor}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.4}
        metalness={0.8}
      />
    </Sphere>
  );
}

// Enhanced Sparkle Particles Component
function SparkleParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  // Blue for dark mode, Cyan for light mode
  const particleColor = theme === "dark" ? "#0099ff" : "#00d4ff";

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={particleColor}
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Glowing Sparkles Component
function GlowingSparkles() {
  const sparklesRef = useRef<THREE.Points>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (sparklesRef.current) {
      sparklesRef.current.rotation.z = state.clock.elapsedTime * 0.03;
      // Animate opacity for twinkling effect
      const material = sparklesRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const sparkleCount = 100;
  const positions = new Float32Array(sparkleCount * 3);

  for (let i = 0; i < sparkleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }

  // Cyan for dark mode, Bright Cyan for light mode
  const sparkleColor = theme === "dark" ? "#00e5ff" : "#1dd9ff";

  return (
    <points ref={sparklesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={sparkleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={sparkleColor}
        transparent
        opacity={0.7}
      />
    </points>
  );
}

// Shooting Star Component
function ShootingStar({
  startPosition,
  endPosition,
  delay = 0,
}: {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  delay?: number;
}) {
  const starRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Line>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (starRef.current && trailRef.current) {
      const time = (state.clock.elapsedTime + delay) % 8; // 8 second cycle
      const progress = Math.max(0, Math.min(1, time / 3)); // 3 seconds to cross

      if (progress > 0 && progress < 1) {
        // Move star along path
        starRef.current.position.x =
          startPosition[0] + (endPosition[0] - startPosition[0]) * progress;
        starRef.current.position.y =
          startPosition[1] + (endPosition[1] - startPosition[1]) * progress;
        starRef.current.position.z =
          startPosition[2] + (endPosition[2] - startPosition[2]) * progress;

        // Make star visible and scale based on progress
        const scale = Math.sin(progress * Math.PI) * 2;
        starRef.current.scale.setScalar(scale);
        starRef.current.visible = true;

        // Update trail
        const trailLength = 20;
        const trailPositions = new Float32Array(trailLength * 3);
        for (let i = 0; i < trailLength; i++) {
          const trailProgress = Math.max(0, progress - i * 0.05);
          trailPositions[i * 3] =
            startPosition[0] +
            (endPosition[0] - startPosition[0]) * trailProgress;
          trailPositions[i * 3 + 1] =
            startPosition[1] +
            (endPosition[1] - startPosition[1]) * trailProgress;
          trailPositions[i * 3 + 2] =
            startPosition[2] +
            (endPosition[2] - startPosition[2]) * trailProgress;
        }

        trailRef.current.geometry.attributes.position.array = trailPositions;
        trailRef.current.geometry.attributes.position.needsUpdate = true;
        trailRef.current.visible = true;
      } else {
        starRef.current.visible = false;
        trailRef.current.visible = false;
      }
    }
  });

  const trailLength = 20;
  const initialTrailPositions = new Float32Array(trailLength * 3);

  // Cyan trail for dark mode, Blue trail for light mode
  const trailColor = theme === "dark" ? "#00d4ff" : "#0099ff";

  return (
    <group>
      <mesh ref={starRef} visible={false}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <line ref={trailRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trailLength}
            array={initialTrailPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={trailColor} transparent opacity={0.6} />
      </line>
    </group>
  );
}

// Multiple Shooting Stars Component
function ShootingStars() {
  const shootingStars = [
    {
      start: [-15, 10, -5] as [number, number, number],
      end: [15, -10, 5] as [number, number, number],
      delay: 0,
    },
    {
      start: [15, 8, -8] as [number, number, number],
      end: [-15, -8, 8] as [number, number, number],
      delay: 2,
    },
    {
      start: [-10, -10, 10] as [number, number, number],
      end: [10, 10, -10] as [number, number, number],
      delay: 4,
    },
    {
      start: [12, -5, -12] as [number, number, number],
      end: [-12, 5, 12] as [number, number, number],
      delay: 6,
    },
  ];

  return (
    <>
      {shootingStars.map((star, index) => (
        <ShootingStar
          key={index}
          startPosition={star.start}
          endPosition={star.end}
          delay={star.delay}
        />
      ))}
    </>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0099ff" />
      <pointLight position={[0, 15, 0]} intensity={0.3} color="#00d4ff" />

      <AnimatedSphere position={[-3, 0, 0]} />
      <AnimatedSphere position={[3, 0, 0]} />

      {/* Enhanced particle systems */}
      <SparkleParticles />
      <GlowingSparkles />
      <ShootingStars />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// Image Upload Component
interface ImageUploadProps {
  title: string;
  icon: React.ReactNode;
  onImageUpload: (file: File) => void;
  uploadedImage: string | null;
  gradient: string;
}

function ImageUpload({
  title,
  icon,
  onImageUpload,
  uploadedImage,
  gradient,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const files = e.dataTransfer.files;
      if (files?.[0] && files[0].type.startsWith("image/")) {
        onImageUpload(files[0]);
      }
    },
    [onImageUpload],
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, x: -40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="relative group"
    >
      <Card
        className={`relative overflow-hidden border-2 transition-all duration-300 cursor-pointer ${isDragActive
            ? "border-primary/80 shadow-2xl shadow-primary/30 scale-105"
            : "border-dashed border-primary/30 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105"
          } ${gradient}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="p-8 text-center relative z-10 min-h-64 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4 w-full">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="p-4 rounded-full bg-primary/10 backdrop-blur-sm"
            >
              {icon}
            </motion.div>

            <h3 className="text-xl font-bold text-foreground">{title}</h3>

            <AnimatePresence mode="wait">
              {uploadedImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 w-40 h-40 rounded-xl bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-3"
                  >
                    <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      ✓ Uploaded
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 w-full"
                >
                  <p className="text-muted-foreground text-sm md:text-base">
                    Drop your image here or click to browse
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                  <p className="text-xs text-muted-foreground/70">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-20">
          <div className={`w-full h-full ${gradient} animate-pulse`}></div>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
}

// Impact Stats Section Component
function ImpactStatsSection() {
  const stats = [
    { number: "50K+", label: "Artworks Created", icon: "🎨" },
    { number: "10K+", label: "Active Artists", icon: "👨‍🎨" },
    { number: "95%", label: "Satisfaction Rate", icon: "⭐" },
    { number: "24/7", label: "Support Available", icon: "💬" },
  ];

  return (
    <section className="py-16 px-6 relative overflow-hidden bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-y border-border/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.5 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "backOut" }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              className="text-center"
            >
              <motion.div
                className="text-4xl mb-3"
                whileInView={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                viewport={{ once: true }}
              >
                {stat.icon}
              </motion.div>
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: index * 0.15 + 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.number}
                </p>
              </motion.div>
              <p className="text-muted-foreground text-sm md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Wand2,
      title: "AI-Powered Transform",
      description: "Advanced neural networks analyze and apply artistic styles with stunning precision",
      color: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      icon: Palette,
      title: "Unlimited Styles",
      description: "Access hundreds of artistic styles from classical to contemporary art movements",
      color: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
    },
    {
      icon: Gauge,
      title: "Lightning Fast",
      description: "Get stunning results in seconds with optimized processing pipelines",
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      icon: Layers,
      title: "High Quality Output",
      description: "Create professional-grade artwork suitable for galleries and publications",
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Artisan Studio?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            State-of-the-art AI technology meets artistic vision
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -30 : 30, scale: 0.85, rotate: -3 }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <Card className={`h-full p-6 bg-gradient-to-br ${feature.color} border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm`}>
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4`}>
                      <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-1">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Auto-Sliding Quotes Component
function QuotesCarousel() {
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    {
      id: 1,
      text: "Can AI replace the real art?",
      subtitle:
        "The eternal debate between human creativity and artificial intelligence",
    },
    {
      id: 2,
      text: "Is AI art truly creative or just sophisticated mimicry?",
      subtitle: "Exploring the boundaries of machine-generated creativity",
    },
    {
      id: 3,
      text: "Does the tool matter more than the vision?",
      subtitle: "From brushes to algorithms, art evolves with technology",
    },
    {
      id: 4,
      text: "Can machines understand beauty and emotion?",
      subtitle:
        "The intersection of artificial intelligence and human aesthetics",
    },
    {
      id: 5,
      text: "Is AI democratizing art or devaluing artists?",
      subtitle:
        "The impact of AI on the creative economy and artistic community",
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000); // Change quote every 4 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="relative h-32 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-center max-w-3xl px-6"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-relaxed">
            "{quotes[currentQuote].text}"
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            {quotes[currentQuote].subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Quote indicators */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuote(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentQuote
                ? "bg-primary w-8"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

// Auto-Sliding Image Carousel Component
function ImageCarousel() {
  const [currentImage, setCurrentImage] = useState(0);

  const artImages = [
    {
      id: 1,
      url: "https://cdn.builder.io/api/v1/image/assets%2Fd23423baf1f24c0a91a009b1b7cbc319%2F8a39fe1b6df6466e920205629b209316?format=webp&width=800",
      title: "Starry Night Reimagined",
      description: "AI interpretation of Van Gogh's masterpiece",
    },
    {
      id: 2,
      url: "https://cdn.builder.io/api/v1/image/assets%2Fd23423baf1f24c0a91a009b1b7cbc319%2F1114187e6b5d42e78d7972cc52411222?format=webp&width=800",
      title: "Abstract Digital Expression",
      description: "Modern AI-generated abstract composition",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop&auto=format",
      title: "Impressionist Style Transfer",
      description: "Modern photography transformed with Monet's impressionist style",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=800&h=600&fit=crop&auto=format",
      title: "Cubist Neural Network",
      description: "Portrait reimagined through Picasso's cubist techniques",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format",
      title: "Watercolor Style Synthesis",
      description: "Digital landscape with traditional watercolor aesthetics",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1569074187119-c87815b476da?w=800&h=600&fit=crop&auto=format",
      title: "Pop Art Neural Filter",
      description: "Contemporary art meets Warhol's pop art style",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&auto=format",
      title: "Oil Painting Transformation",
      description: "Digital photo rendered in classical oil painting style",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format",
      title: "Surrealist Style Transfer",
      description: "Reality distorted through Dalí's surrealist vision",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop&auto=format",
      title: "Japanese Ukiyo-e Style",
      description: "Modern scenes in traditional Japanese woodblock print style",
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1551913902-c92207136625?w=800&h=600&fit=crop&auto=format",
      title: "Graffiti Art Neural Style",
      description: "Street photography transformed with urban graffiti aesthetics",
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % artImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [artImages.length]);

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto mt-12"
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true, margin: "0px 0px -150px 0px" }}
    >
      <div className="relative h-80 md:h-96 overflow-hidden rounded-2xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={artImages[currentImage].url}
              alt={artImages[currentImage].title}
              className="w-full h-full object-cover"
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Image information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute bottom-6 left-6 right-6 text-white"
            >
              <h4 className="text-xl md:text-2xl font-bold mb-2">
                {artImages[currentImage].title}
              </h4>
              <p className="text-sm md:text-base opacity-90">
                {artImages[currentImage].description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="absolute bottom-4 right-6 flex space-x-2">
          {artImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImage
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/70"
                }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Reviews Component
const reviews = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "SC",
    rating: 5,
    text: "Absolutely incredible! The AI style transfer is mind-blowing. I've created amazing artwork for my gallery in minutes.",
    profession: "Digital Artist",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    avatar: "MR",
    rating: 5,
    text: "This tool has revolutionized my creative process. The quality is professional-grade and the 3D interface is so intuitive.",
    profession: "Photographer",
  },
  {
    id: 3,
    name: "Elena Volkov",
    avatar: "EV",
    rating: 5,
    text: "I've tried many style transfer tools, but this one delivers exceptional results. The artistic quality is unmatched.",
    profession: "Art Director",
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "DK",
    rating: 5,
    text: "Perfect for creating unique social media content. The generated images always get amazing engagement rates.",
    profession: "Content Creator",
  },
];

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, x: -30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      whileHover={{ y: -15, scale: 1.03 }}
      className="relative"
    >
      <Card className="p-6 h-full bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              {review.avatar}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <Quote className="w-6 h-6 text-primary/60 mb-2" />
            <p className="text-foreground mb-4 leading-relaxed">
              {review.text}
            </p>
            <div>
              <p className="font-semibold text-foreground">{review.name}</p>
              <p className="text-sm text-muted-foreground">
                {review.profession}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Index() {
  const [yourImage, setYourImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [yourFile, setYourFile] = useState<File | null>(null);
  const [styleFile, setStyleFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    name: "",
    profession: "",
    rating: 5,
    text: "",
  });

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (type: "your" | "style") => (file: File) => {
    const url = URL.createObjectURL(file);
    if (type === "your") {
      setYourImage(url);
      setYourFile(file);
    } else {
      setStyleImage(url);
      setStyleFile(file);
    }
  };

  // Call AI style transfer API
  const generateArtwork = async () => {
    if (!yourFile || !styleFile) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("content_image", yourFile);
      formData.append("style_image", styleFile);

      const response = await fetch("http://localhost:8000/api/style-transfer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const generatedDataUrl = URL.createObjectURL(blob);
      setGeneratedImage(generatedDataUrl);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate artwork. Make sure the backend is running on port 8000.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download generated image
  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.download = `artisan-studio-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setCameraStream(stream);
      setShowCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Camera access is required for this feature");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const canProcess = yourImage && styleImage;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Scene3D />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-tl from-background/80 via-background/40 to-background/80"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen pt-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-start pt-8 md:pt-12 pb-16 px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block mb-8 md:mb-12"
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </motion.div>
              <span className="text-sm font-semibold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                AI-Powered Creativity
              </span>
            </div>
          </motion.div>

          <div className="relative mb-12 inline-block w-full">
            {/* Glow effect background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-20 rounded-full"
              style={{ zIndex: -1, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "150%", height: "150%" }}
            />

            {/* Main heading with character animations */}
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight relative z-10 text-center tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {["A", "r", "t", "i", "s", "a", "n", " ", "S", "t", "u", "d", "i", "o"].map((char, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 50,
                    rotateZ: -10,
                    scale: 0.3,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateZ: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + index * 0.06,
                    ease: "backOut",
                  }}
                  whileHover={{
                    scale: 1.2,
                    y: -10,
                    color: "hsl(var(--accent))",
                    textShadow: "0 0 20px hsl(var(--primary))",
                    transition: { duration: 0.2 },
                  }}
                  className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent hover:drop-shadow-lg cursor-default"
                  style={{
                    backgroundSize: "200% 200%",
                    animation: "gradientShift 3s ease infinite",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Floating particles around heading */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/60"
                style={{
                  left: `${15 + i * 11}%`,
                  top: `${Math.random() * 80 - 40}px`,
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.6, 1, 0.6],
                    x: [0, Math.sin(i) * 15, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full rounded-full"
                />
              </motion.div>
            ))}
          </div>

          <style>{`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto mb-4 leading-relaxed"
          >
            Transform your images with AI-powered style transfer. Upload your
            content and style images to create stunning artistic compositions.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground/70"
          >
            Professional-grade results in seconds • Hundreds of artistic styles • No credit card required
          </motion.p>
        </motion.header>

        {/* Main Upload Section */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Create Your Masterpiece
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose your content image and select an artistic style to transform your vision
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <ImageUpload
                title="Your Image"
                icon={<ImageIcon className="w-8 h-8 text-primary" />}
                onImageUpload={handleImageUpload("your")}
                uploadedImage={yourImage}
                gradient="bg-gradient-to-br from-primary/10 to-primary/5"
              />

              <ImageUpload
                title="Style Image"
                icon={<Zap className="w-8 h-8 text-accent" />}
                onImageUpload={handleImageUpload("style")}
                uploadedImage={styleImage}
                gradient="bg-gradient-to-br from-accent/10 to-accent/5"
              />
            </div>

            {/* Enhanced Generate Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: canProcess ? 1 : 0.5,
                scale: canProcess ? 1 : 0.9,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={canProcess ? { scale: 1.05 } : {}}
                whileTap={canProcess ? { scale: 0.95 } : {}}
              >
                <Button
                  size="lg"
                  onClick={generateArtwork}
                  disabled={!canProcess || isProcessing}
                  className={`px-12 py-6 text-xl font-bold transition-all duration-500 shadow-2xl ${canProcess && !isProcessing
                      ? "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] text-white shadow-primary/25 hover:shadow-accent/25"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="mr-3"
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                      Creating Artwork...
                    </>
                  ) : canProcess ? (
                    <>
                      <Sparkles className="w-6 h-6 mr-2" />
                      Generate Artwork
                    </>
                  ) : (
                    "Upload both images to generate"
                  )}
                </Button>
              </motion.div>
              {canProcess && !isProcessing && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-muted-foreground"
                >
                  ⚡ AI processing typically takes 30-60 seconds
                </motion.p>
              )}
            </motion.div>

            {/* Generated Image Display */}
            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-16 text-center"
              >
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    ✨ Your Artwork is Ready!
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={generatedImage}
                      alt="Generated artwork"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button
                      onClick={downloadImage}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedImage(null);
                        setYourImage(null);
                        setStyleImage(null);
                      }}
                      variant="outline"
                    >
                      Create Another
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        {/* Features Section */}
        <FeaturesSection />

        {/* Impact Stats Section */}
        <ImpactStatsSection />

        {/* Auto-Sliding Quotes Section */}
        <section className="py-20 px-6 relative overflow-hidden border-t border-border/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                See the Magic in Action
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore stunning transformations and creative possibilities
              </p>
            </motion.div>
            <QuotesCarousel />
            <ImageCarousel />
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-20 px-6 relative border-t border-border/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 mb-4"
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-muted-foreground">
                  Highly Rated by Artists
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                What Artists Are Saying
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creators who are transforming their art with
                our AI-powered platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 80, x: index % 2 === 0 ? -40 : 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                >
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </div>

            {/* Interactive Review Section */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="text-center mt-16"
            >
              <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!showReviewForm ? (
                    <motion.div
                      key="cta"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-foreground mb-4">
                        Love our platform? Share your experience!
                      </h3>
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => setShowReviewForm(true)}
                      >
                        Leave a Review
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="text-left"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-foreground">
                          Share Your Review
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReviewForm(false)}
                          className="hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Handle form submission here
                          console.log("Review submitted:", reviewData);
                          // Reset form and show success message
                          setReviewData({
                            name: "",
                            profession: "",
                            rating: 5,
                            text: "",
                          });
                          setShowReviewForm(false);
                          // You could add a toast notification here
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                              id="name"
                              placeholder="Enter your name"
                              value={reviewData.name}
                              onChange={(e) =>
                                setReviewData({
                                  ...reviewData,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="profession">Profession</Label>
                            <Input
                              id="profession"
                              placeholder="e.g. Digital Artist"
                              value={reviewData.profession}
                              onChange={(e) =>
                                setReviewData({
                                  ...reviewData,
                                  profession: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Rating</Label>
                          <div className="flex items-center space-x-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setReviewData({
                                    ...reviewData,
                                    rating: star,
                                  })
                                }
                                className="p-1"
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${star <= reviewData.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                    }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="review">Your Review</Label>
                          <Textarea
                            id="review"
                            placeholder="Tell us about your experience with Artisan Studio..."
                            value={reviewData.text}
                            onChange={(e) =>
                              setReviewData({
                                ...reviewData,
                                text: e.target.value,
                              })
                            }
                            rows={4}
                            required
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 flex-1"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Submit Review
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowReviewForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative"
        >
          {/* Divider */}
          <div className="border-t border-border/50"></div>

          <div className="p-6 md:p-12 bg-gradient-to-b from-transparent to-primary/2">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-foreground mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>Artisan Studio</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered style transfer for creative artists
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Product</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                    <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                    <li><a href="#" className="hover:text-foreground transition">How It Works</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Company</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition">About</a></li>
                    <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                    <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Legal</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                    <li><a href="#" className="hover:text-foreground transition">License</a></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
                <p>
                  Powered by AI • Built with passion for digital art • © 2024 Artisan Studio
                </p>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
