import { Button } from '@/components/ui/button';
import { Building2, CheckCircle2, TrendingUp, Users, Sparkles, Droplet, Heart, Target } from 'lucide-react';
import { useState } from 'react';
import AdvertisingPartnerForm from './AdvertisingPartnerForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdvertisingPartnerCTA() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const benefits = [
    {
      icon: Users,
      text: 'Reach urban, style-conscious demographics',
    },
    {
      icon: Sparkles,
      text: 'Eco-conscious brand alignment',
    },
    {
      icon: TrendingUp,
      text: 'High-visibility product placement',
    },
    {
      icon: CheckCircle2,
      text: 'Custom pack designs available',
    },
  ];

  const storySteps = [
    {
      icon: Droplet,
      title: 'The Movement',
      description: 'From street corners to festival stages, GRATIS has become the hydration choice for urban culture enthusiasts.',
    },
    {
      icon: Heart,
      title: 'The Connection',
      description: 'Every pack is a daily touchpoint—intimate, authentic, and carried with pride by our community.',
    },
    {
      icon: Target,
      title: 'The Impact',
      description: 'Your brand doesn\'t just get seen. It becomes part of the culture, the movement, the lifestyle.',
    },
  ];

  return (
    <>
      <section className="relative py-24 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
        <div className="absolute inset-0 bg-[url('/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png')] bg-cover bg-center opacity-10" />
        
        <div className="container relative z-10">
          {/* Story Introduction */}
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-sm">
              <Building2 className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">Partner With Purpose</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black leading-tight text-white">
              More Than Advertising.<br />
              <span className="text-white/80">A Cultural Statement.</span>
            </h2>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Every day, thousands of hands reach for GRATIS. Not just for hydration, but as a symbol of sustainable living 
              and street authenticity. Your brand can be part of this story.
            </p>
          </div>

          {/* Story Journey */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {storySteps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-white/80 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits & CTA */}
            <div className="space-y-8 text-white">
              <div>
                <h3 className="text-3xl font-black mb-6">Why Partner With GRATIS?</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm flex-shrink-0">
                        <benefit.icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm leading-relaxed">{benefit.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => setIsFormOpen(true)}
                  className="shadow-lg hover:scale-105 transition-transform"
                >
                  Become a Partner
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  asChild
                >
                  <a href="mailto:partners@gratis.com">Contact Us</a>
                </Button>
              </div>
            </div>

            {/* Right Side - Stats & Visual */}
            <div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-white/10 rounded-xl transform hover:scale-105 transition-transform">
                      <div className="text-5xl font-black mb-2 text-white">10,000+</div>
                      <div className="text-sm text-white/80">Packs Distributed Monthly</div>
                    </div>
                    <div className="text-center p-6 bg-white/10 rounded-xl transform hover:scale-105 transition-transform">
                      <div className="text-5xl font-black mb-2 text-white">100%</div>
                      <div className="text-sm text-white/80">Recyclable Packaging</div>
                    </div>
                    <div className="text-center p-6 bg-white/10 rounded-xl transform hover:scale-105 transition-transform">
                      <div className="text-5xl font-black mb-2 text-white">24/7</div>
                      <div className="text-sm text-white/80">Brand Visibility</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Become an Advertising Partner</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll contact you within 48 hours to discuss partnership opportunities.
            </DialogDescription>
          </DialogHeader>
          <AdvertisingPartnerForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
