import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Lock, Github, Chrome, Eye, EyeOff, Palette, Wand2, Heart, Stars, LogIn, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as random from "maath/random/dist/maath-random.esm";

// 3D Particle Background Component
function StarField() {
  const { theme } = useTheme();
  const [sphere] = useState(() => random.inSphere(new Float32Array(1800), { radius: 2.5 }));

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={theme === 'dark' ? '#8B5CF6' : '#F59E0B'}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// Floating Art Elements
function FloatingElements() {
  const elements = [
    { icon: Palette, delay: 0, x: '15%', y: '25%' },
    { icon: Wand2, delay: 1.5, x: '80%', y: '20%' },
    { icon: Heart, delay: 3, x: '10%', y: '75%' },
    { icon: Stars, delay: 4.5, x: '85%', y: '70%' },
  ];

  return (
    <>
      {elements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.3, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
          className="absolute pointer-events-none z-10"
          style={{ left: element.x, top: element.y }}
        >
          <element.icon className="w-7 h-7 text-primary/25" />
        </motion.div>
      ))}
    </>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email, // Using email as username for now as per schema
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store token
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("username", data.username);

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-70">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarField />
        </Canvas>
      </div>

      {/* Floating Art Elements */}
      <FloatingElements />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-pink-500/5" />

      <Navigation />

      <div className="relative z-20 pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-md">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div
              className="flex justify-center mb-8"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-xl opacity-60" />
                <div className="relative p-6 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-sm border border-primary/30">
                  <LogIn className="w-10 h-10 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome Back
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Continue your artistic journey with AI
            </motion.p>
          </motion.div>

          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="relative overflow-hidden backdrop-blur-sm bg-background/80 border-primary/20 shadow-2xl">
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />

              <div className="relative p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                  {/* Email Field */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Label
                      htmlFor="email"
                      className={`text-sm font-medium transition-colors ${focused === 'email' ? 'text-primary' : ''}`}
                    >
                      Email Address
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Mail className={`absolute left-4 top-4 w-5 h-5 transition-colors z-10 ${focused === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused('')}
                        placeholder="Enter your email address"
                        className="pl-12 h-14 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all backdrop-blur-sm"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Label
                      htmlFor="password"
                      className={`text-sm font-medium transition-colors ${focused === 'password' ? 'text-primary' : ''}`}
                    >
                      Password
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Lock className={`absolute left-4 top-4 w-5 h-5 transition-colors z-10 ${focused === 'password' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused('')}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 h-14 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-muted-foreground hover:text-primary transition-colors z-10"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Remember Me & Forgot Password */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <label className="flex items-center space-x-3 text-sm cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="rounded border-2 border-border focus:ring-primary focus:ring-2 group-hover:border-primary/50 transition-colors"
                      />
                      <span className="group-hover:text-primary transition-colors">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  {/* Sign In Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform group"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            Signing In...
                          </div>
                        ) : (
                          <>
                            <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                            Sign In to Your Account
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>

                {/* Social Authentication */}
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-background text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                      <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform relative z-10" />
                      <span className="relative z-10">GitHub</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                      <Chrome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform relative z-10" />
                      <span className="relative z-10">Google</span>
                    </Button>
                  </div>
                </motion.div>

                {/* Sign Up Link */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors inline-flex items-center group"
                    >
                      Create one now
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
