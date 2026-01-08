import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Finally, water that doesn't cost the planet. The tetrapack is genius.",
    author: "Sarah M.",
    location: "Amsterdam",
    rating: 5,
  },
  {
    quote: "I switched from plastic bottles and never looked back. Tastes amazing too!",
    author: "Marcus K.",
    location: "Berlin",
    rating: 5,
  },
  {
    quote: "Love that every bottle helps provide clean water to those in need.",
    author: "Emma L.",
    location: "London",
    rating: 5,
  },
];

export const WaterTestimonials = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">What People Are Saying</h2>
          <p className="mt-2 text-muted-foreground">Join thousands who've made the switch</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <Quote className="absolute -right-2 -top-2 h-16 w-16 text-primary/10" />
                
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                <blockquote className="relative text-sm leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
