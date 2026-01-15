import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Lock, User, Github, Chrome, Eye, EyeOff, Palette, Wand2, Heart, Stars } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as random from "maath/random/dist/maath-random.esm";

// 3D Particle Background Component
function StarField() {
  const { theme } = useTheme();
  const [sphere] = useState(() => random.inSphere(new Float32Array(2000), { radius: 2.5 }));

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
    { icon: Palette, delay: 0, x: '10%', y: '20%' },
    { icon: Wand2, delay: 1, x: '85%', y: '15%' },
    { icon: Heart, delay: 2, x: '5%', y: '70%' },
    { icon: Stars, delay: 3, x: '90%', y: '80%' },
  ];

  return (
    <>
      {elements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
          className="absolute pointer-events-none"
          style={{ left: element.x, top: element.y }}
        >
          <element.icon className="w-6 h-6 text-primary/20" />
        </motion.div>
      ))}
    </>
  );
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      alert("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarField />
        </Canvas>
      </div>

      {/* Floating Art Elements */}
      <FloatingElements />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />

      <Navigation />

      <div className="relative z-10 pt-28 pb-20 px-6">
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
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-lg opacity-50" />
                <div className="relative p-6 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-sm border border-primary/20">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Join Artisian Studio
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Begin your creative journey with AI-powered art
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
                  {/* Username Field */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Label
                      htmlFor="username"
                      className={`text-sm font-medium transition-colors ${focused === 'username' ? 'text-primary' : ''}`}
                    >
                      Username
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <User className={`absolute left-4 top-4 w-5 h-5 transition-colors z-10 ${focused === 'username' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        onFocus={() => setFocused('username')}
                        onBlur={() => setFocused('')}
                        placeholder="Choose your creative username"
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
                        placeholder="Create a strong password"
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

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength >= level
                                ? level <= 2
                                  ? 'bg-red-500'
                                  : level === 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                : 'bg-muted'
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {passwordStrength <= 2 ? 'Weak' : passwordStrength === 3 ? 'Good' : 'Strong'} password
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <Label
                      htmlFor="confirmPassword"
                      className={`text-sm font-medium transition-colors ${focused === 'confirmPassword' ? 'text-primary' : ''}`}
                    >
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Lock className={`absolute left-4 top-4 w-5 h-5 transition-colors z-10 ${focused === 'confirmPassword' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        onFocus={() => setFocused('confirmPassword')}
                        onBlur={() => setFocused('')}
                        placeholder="Confirm your password"
                        className="pl-12 pr-12 h-14 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-4 text-muted-foreground hover:text-primary transition-colors z-10"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Terms Checkbox */}
                  <motion.div
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded mt-1 border-2 border-border focus:ring-primary focus:ring-2"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline font-medium">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </motion.div>

                  {/* Create Account Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
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
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            Creating Account...
                          </div>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Create Your Account
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
                  transition={{ delay: 1, duration: 0.6 }}
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
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all group w-full"
                      >
                        <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        GitHub
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all group w-full"
                      >
                        <Chrome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Google
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Sign In Link */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors"
                    >
                      Sign in here
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
