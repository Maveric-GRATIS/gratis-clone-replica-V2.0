import { Star, Users, Verified, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  verified?: boolean;
}

interface SocialProofProps {
  variant?: 'testimonials' | 'stats' | 'combined';
  className?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Sustainability Advocate',
    content: 'GRATIS changed how I think about packaging. Pure water, zero waste mindset.',
    rating: 5,
    verified: true,
  },
  {
    id: '2',
    name: 'Jordan Rivera',
    role: 'Fitness Coach',
    content: 'My athletes love the convenience. Tetrapack is game-changing for training.',
    rating: 5,
    verified: true,
  },
  {
    id: '3',
    name: 'Sam Taylor',
    role: 'Environmental Scientist',
    content: 'Finally, a beverage company that understands the future of packaging.',
    rating: 5,
    verified: true,
  },
];

const stats = [
  { label: 'Happy Customers', value: '50K+', icon: Users },
  { label: 'Average Rating', value: '4.9', icon: Star },
  { label: 'Plastic Saved', value: '2M bottles', icon: TrendingUp },
  { label: 'Carbon Neutral', value: '100%', icon: Verified },
];

export const SocialProof = ({ variant = 'combined', className = '' }: SocialProofProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-primary text-primary' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const renderTestimonials = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-4 bg-card border-border">
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              {renderStars(testimonial.rating)}
            </div>
            
            <p className="text-sm text-foreground">"{testimonial.content}"</p>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  {testimonial.verified && (
                    <Verified className="h-3 w-3 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      {(variant === 'stats' || variant === 'combined') && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6 text-foreground">
            Trusted by Thousands
          </h3>
          {renderStats()}
        </div>
      )}

      {(variant === 'testimonials' || variant === 'combined') && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6 text-foreground">
            What People Say
          </h3>
          {renderTestimonials()}
        </div>
      )}
    </div>
  );
};