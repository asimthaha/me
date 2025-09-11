import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Loader2, 
  Send, 
  CheckCircle, 
  Sparkles,
  Mail,
  User,
  MessageSquare,
  ArrowRight
} from "lucide-react";

/**
 * Contact form validation schema
 */
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Floating Label Input Component with Premium Animations
 */
interface FloatingInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = isFocused || value.length > 0;

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </div>
        )}
        <Input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          onFocus={() => setIsFocused(true)}
          className={`
            field-magnetic pt-6 pb-2 transition-all duration-300 bg-transparent border-border/50
            ${icon ? 'pl-10' : 'pl-4'} pr-4
            focus:border-accent focus:ring-2 focus:ring-accent/20
            ${error ? 'border-destructive focus:border-destructive' : ''}
          `}
        />
        <motion.label
          className={`
            floating-label absolute left-${icon ? '10' : '4'} text-muted-foreground pointer-events-none
            ${isActive ? 'active' : 'top-1/2 -translate-y-1/2'}
          `}
          animate={{
            top: isActive ? '0.5rem' : '50%',
            scale: isActive ? 0.85 : 1,
            color: isFocused ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </motion.label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-destructive text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Floating Textarea Component
 */
interface FloatingTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  error?: string;
  maxLength?: number;
}

const FloatingTextarea: React.FC<FloatingTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  maxLength = 500,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          onFocus={() => setIsFocused(true)}
          maxLength={maxLength}
          className={`
            field-magnetic pt-6 pb-2 min-h-[120px] resize-none bg-transparent border-border/50
            focus:border-accent focus:ring-2 focus:ring-accent/20
            ${error ? 'border-destructive focus:border-destructive' : ''}
          `}
        />
        <motion.label
          className={`
            floating-label absolute left-4 text-muted-foreground pointer-events-none
            ${isActive ? 'active' : 'top-6 -translate-y-1/2'}
          `}
          animate={{
            top: isActive ? '0.5rem' : '1.5rem',
            scale: isActive ? 0.85 : 1,
            color: isFocused ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {label}
        </motion.label>
      </div>
      
      {/* Character Counter with Progress Ring */}
      <div className="flex justify-between items-center mt-2">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-destructive text-sm"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 10}`}
              strokeDashoffset={`${2 * Math.PI * 10 * (1 - value.length / maxLength)}`}
              className="progress-ring"
            />
          </svg>
          <span className="text-sm text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Premium Contact Section Component
 */
const PremiumContactSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const cardX = useSpring(0, springConfig);
  const cardY = useSpring(0, springConfig);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
    },
  });

  const { watch, formState: { errors, isValid } } = form;
  const watchedFields = watch();

  // Calculate form progress
  useEffect(() => {
    const fields = [watchedFields.name, watchedFields.email, watchedFields.description];
    const filledFields = fields.filter(field => field && field.length > 0).length;
    const captchaFilled = captchaValue ? 1 : 0;
    setFormProgress(((filledFields + captchaFilled) / 4) * 100);
  }, [watchedFields, captchaValue]);

  const isFormReady = isValid && captchaValue && watchedFields.name && watchedFields.email;

  /**
   * Handle mouse movement for 3D tilt effect
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    cardX.set(rotateY);
    cardY.set(rotateX);
    
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!captchaValue) {
      toast.error("reCAPTCHA Required", {
        description: "Please complete the reCAPTCHA verification.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.description || "No additional message provided.",
        to_name: "Website Admin",
        "g-recaptcha-response": captchaValue,
      };

      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setIsSubmitted(true);
        form.reset();
        setCaptchaValue(null);
        recaptchaRef.current?.reset();

        toast.success("Message Sent Successfully!", {
          description: "Thank you for your message. I'll get back to you soon.",
        });
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to Send Message", {
        description: "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    form.reset();
    setCaptchaValue(null);
    recaptchaRef.current?.reset();
    setFormProgress(0);
  };

  // Success State
  if (isSubmitted) {
    return (
      <section id="contact" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div 
          className="container mx-auto px-4 py-16 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto text-center space-y-6 contact-glass rounded-2xl p-8">
            <motion.div 
              className="flex justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <CheckCircle className="h-16 w-16 text-accent" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Message Sent!
            </motion.h2>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Thank you for reaching out. I'll get back to you as soon as possible.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={resetForm} 
                className="bg-gradient-to-r from-accent to-accent/80 hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Send Another Message
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="form-particles"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Let's Connect
            </span>
            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can work together to bring your vision to life.
          </p>
          
          {/* Form Progress Indicator */}
          <div className="max-w-md mx-auto mt-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Form Progress</span>
              <span className="text-sm font-medium text-accent">{Math.round(formProgress)}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: cardY,
            rotateY: cardX,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          <div className="contact-glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <FloatingInput
                    label="Full Name"
                    placeholder="Enter your name"
                    value={watchedFields.name || ""}
                    onChange={(e) => form.setValue("name", e.target.value)}
                    onBlur={() => form.trigger("name")}
                    error={errors.name?.message}
                    icon={<User className="h-4 w-4" />}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <FloatingInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={watchedFields.email || ""}
                    onChange={(e) => form.setValue("email", e.target.value)}
                    onBlur={() => form.trigger("email")}
                    error={errors.email?.message}
                    icon={<Mail className="h-4 w-4" />}
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <FloatingTextarea
                  label="Project Details"
                  placeholder="Tell me about your project, ideas, or just say hello..."
                  value={watchedFields.description || ""}
                  onChange={(e) => form.setValue("description", e.target.value)}
                  onBlur={() => form.trigger("description")}
                  error={errors.description?.message}
                />
              </motion.div>

              {/* reCAPTCHA */}
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="contact-glass rounded-lg p-4">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={
                      import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
                      "6LfiJaQrAAAAAJ1lAHrsE_BBGRj9eslmUXXMdcSG"
                    }
                    onChange={onCaptchaChange}
                    theme="light"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={!isFormReady || isSubmitting}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-accent via-accent to-accent/80 
                           hover:shadow-2xl hover:shadow-accent/25 transition-all duration-500
                           disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  size="lg"
                >
                  {isSubmitting ? (
                    <motion.div 
                      className="flex items-center gap-3"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending Message...
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      Send Message
                      <MessageSquare className="h-5 w-5" />
                    </motion.div>
                  )}
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-accent/50 via-transparent to-accent/50 
                                blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </motion.div>
            </form>

            {/* Privacy Notice */}
            <motion.div 
              className="mt-8 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p className="flex items-center justify-center gap-2 flex-wrap">
                <span>This form is protected by reCAPTCHA and the Google</span>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="story-link text-accent hover:text-accent/80 transition-colors"
                >
                  Privacy Policy
                </a>
                <span>and</span>
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="story-link text-accent hover:text-accent/80 transition-colors"
                >
                  Terms of Service
                </a>
                <span>apply.</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumContactSection;