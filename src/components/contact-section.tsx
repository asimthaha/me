import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle } from 'lucide-react';

/**
 * Contact form validation schema
 * Enforces name format, email validity, and description length limits
 */
const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Contact Section Component
 * Features EmailJS integration with Google reCAPTCHA v2 protection
 * Includes real-time validation and accessibility features
 */
const ContactSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      description: '',
    },
  });

  const { watch, formState: { errors, isValid } } = form;
  const watchedFields = watch();

  // Check if form is ready for submission
  const isFormReady = isValid && captchaValue && watchedFields.name && watchedFields.email;

  /**
   * Handle reCAPTCHA verification
   */
  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  /**
   * Submit form via EmailJS
   * Validates reCAPTCHA and sends email with proper error handling
   */
  const onSubmit = async (data: ContactFormData) => {
    if (!captchaValue) {
      toast({
        title: 'reCAPTCHA Required',
        description: 'Please complete the reCAPTCHA verification.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare EmailJS template parameters
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.description || 'No additional message provided.',
        to_name: 'Website Admin',
        'g-recaptcha-response': captchaValue,
      };

      // Send email via EmailJS
      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      if (result.status === 200) {
        setIsSubmitted(true);
        form.reset();
        setCaptchaValue(null);
        recaptchaRef.current?.reset();
        
        toast({
          title: 'Message Sent Successfully!',
          description: 'Thank you for your message. I\'ll get back to you soon.',
        });
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        title: 'Failed to Send Message',
        description: 'There was an error sending your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setIsSubmitted(false);
    form.reset();
    setCaptchaValue(null);
    recaptchaRef.current?.reset();
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Message Sent!</h2>
            <p className="text-muted-foreground">
              Thank you for reaching out. I'll get back to you as soon as possible.
            </p>
            <Button onClick={resetForm} className="mt-4">
              Send Another Message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">Get In Touch</h2>
            <p className="text-lg text-muted-foreground">
              Have a project in mind? Let's discuss how we can work together.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                      </FormControl>
                      <FormMessage id="name-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </FormControl>
                      <FormMessage id="email-error" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your project, ideas, or just say hello..."
                        className="min-h-[120px] resize-none"
                        maxLength={500}
                        {...field}
                        aria-invalid={!!errors.description}
                        aria-describedby={errors.description ? 'description-error' : 'description-help'}
                      />
                    </FormControl>
                    <FormDescription id="description-help">
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage id="description-error" />
                  </FormItem>
                )}
              />

              {/* reCAPTCHA Widget */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="YOUR_RECAPTCHA_SITE_KEY" // Replace with your reCAPTCHA site key
                  onChange={onCaptchaChange}
                  theme="light"
                />
              </div>

              <Button
                type="submit"
                disabled={!isFormReady || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              This form is protected by reCAPTCHA and the Google{' '}
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a 
                href="https://policies.google.com/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;