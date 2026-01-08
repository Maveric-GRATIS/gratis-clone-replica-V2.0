import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Sparkles } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'card' | 'inline';
  title?: string;
  description?: string;
  className?: string;
}

export const NewsletterSignup = ({ 
  variant = 'card',
  title = "Stay Hydrated with Updates",
  description = "Get the latest from GRATIS — product drops, sustainability insights, and exclusive offers.",
  className = ""
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Track newsletter signup
      analytics.track({
        action: 'newsletter_signup',
        category: 'engagement',
        label: email,
      });

      // Insert into newsletter_subscribers table
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.toLowerCase().trim() });

      if (error) {
        // Handle duplicate email gracefully
        if (error.code === '23505') {
          toast({
            title: "You're already subscribed!",
            description: "Thanks for being part of the GRATIS tribe.",
          });
          setEmail('');
          return;
        }
        throw error;
      }

      toast({
        title: "Welcome to the GRATIS tribe!",
        description: "You'll receive our next update soon.",
      });

      setEmail('');

      analytics.track({
        action: 'newsletter_signup_success',
        category: 'engagement',
      });

    } catch (error) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Signup failed",
        description: "Please try again later.",
        variant: "destructive",
      });

      analytics.trackError(error as Error, 'newsletter_signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="bg-input border-border"
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting || !email}
          className="shrink-0"
        >
          {isSubmitting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Subscribe
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        No spam, just pure hydration updates. Unsubscribe anytime.
      </p>
    </div>
  );

  if (variant === 'inline') {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={`p-6 bg-card border-border ${className}`}>
      {content}
    </Card>
  );
};