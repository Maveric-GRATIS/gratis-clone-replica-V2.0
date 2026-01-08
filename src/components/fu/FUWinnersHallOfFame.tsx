import { useEffect, useState } from 'react';
import { Trophy, MapPin, Sparkles, Quote, Calendar, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEuro } from '@/lib/currency';

interface Winner {
  id: string;
  winner_name: string;
  winner_location: string | null;
  winner_avatar_url: string | null;
  creation_name: string | null;
  creation_description: string | null;
  creation_flavor: string | null;
  creation_image_url: string | null;
  impact_project: string | null;
  impact_amount: number | null;
  series_number: number | null;
  edition_size: number | null;
  winner_quote: string | null;
  featured: boolean;
  won_at: string;
}

// Placeholder data for demo when no winners exist
const placeholderWinners: Winner[] = [
  {
    id: '1',
    winner_name: 'Alex R.',
    winner_location: 'Amsterdam, NL',
    winner_avatar_url: null,
    creation_name: 'REBEL DROP',
    creation_description: 'A mysterious blend that keeps you guessing with every sip.',
    creation_flavor: 'Mystery Citrus Fusion',
    creation_image_url: '/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png',
    impact_project: 'Street Art Programs',
    impact_amount: 4500,
    series_number: 3,
    edition_size: 300,
    winner_quote: "I wanted to create something that represents the unpredictable energy of street culture.",
    featured: true,
    won_at: '2024-11-15T10:00:00Z',
  },
  {
    id: '2',
    winner_name: 'Maria S.',
    winner_location: 'Berlin, DE',
    winner_avatar_url: null,
    creation_name: 'NEON NIGHTS',
    creation_description: 'Electric berry explosion with a hint of midnight mint.',
    creation_flavor: 'Berry Mint Electric',
    creation_image_url: '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png',
    impact_project: 'Youth Music Education',
    impact_amount: 3200,
    series_number: 5,
    edition_size: 250,
    winner_quote: "Music saved my life. Now every bottle helps another kid find their rhythm.",
    featured: true,
    won_at: '2024-10-22T14:30:00Z',
  },
  {
    id: '3',
    winner_name: 'Jake T.',
    winner_location: 'London, UK',
    winner_avatar_url: null,
    creation_name: 'URBAN HEAT',
    creation_description: 'Spicy mango with a smoky finish for the bold souls.',
    creation_flavor: 'Smoky Mango Fire',
    creation_image_url: '/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png',
    impact_project: 'Homeless Shelter Support',
    impact_amount: 5100,
    series_number: 7,
    edition_size: 400,
    winner_quote: "Heat from the streets, for the streets. Every sip is a statement.",
    featured: false,
    won_at: '2024-09-08T09:15:00Z',
  },
];

export default function FUWinnersHallOfFame() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      const { data, error } = await supabase
        .from('golden_ticket_winners')
        .select('*')
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('won_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching winners:', error);
        // Use placeholder data if no real data
        setWinners(placeholderWinners);
      } else {
        setWinners(data.length > 0 ? data : placeholderWinners);
      }
      setLoading(false);
    };

    fetchWinners();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 font-bold text-sm tracking-wider uppercase">
              Hall of Fame
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            GOLDEN TICKET <span className="text-yellow-500">LEGENDS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the bold ones who found the golden cap and created their own legendary F.U. flavor.
            Their vision, their impact, their legacy.
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.map((winner, index) => (
            <Card
              key={winner.id}
              className={`group relative overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02] ${
                winner.featured
                  ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              {/* Featured Badge */}
              {winner.featured && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              {/* Creation Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={winner.creation_image_url || '/placeholder.svg'}
                  alt={winner.creation_name || 'Winner creation'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                {/* Series Badge */}
                {winner.series_number && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-black/70 backdrop-blur-sm">
                      Series #{winner.series_number.toString().padStart(2, '0')}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Creation Name */}
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-foreground">
                    {winner.creation_name || 'Unnamed Creation'}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {winner.creation_flavor}
                  </p>
                </div>

                {/* Winner Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-black font-bold text-lg">
                    {winner.winner_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{winner.winner_name}</p>
                    {winner.winner_location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {winner.winner_location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quote */}
                {winner.winner_quote && (
                  <div className="bg-muted/50 rounded-lg p-4 relative">
                    <Quote className="absolute top-2 left-2 w-4 h-4 text-muted-foreground/30" />
                    <p className="text-sm italic text-muted-foreground pl-4">
                      "{winner.winner_quote}"
                    </p>
                  </div>
                )}

                {/* Impact & Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div className="text-sm">
                      <span className="font-bold text-foreground">
                        {winner.impact_amount ? formatEuro(winner.impact_amount) : '€0'}
                      </span>
                      <span className="text-muted-foreground"> raised</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(winner.won_at)}
                  </div>
                </div>

                {/* Impact Project */}
                {winner.impact_project && (
                  <div className="text-xs text-center">
                    <span className="text-muted-foreground">Supporting: </span>
                    <span className="font-semibold text-primary">{winner.impact_project}</span>
                  </div>
                )}

                {/* Edition Info */}
                {winner.edition_size && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      Limited Edition: {winner.edition_size} Units
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h3 className="text-2xl font-bold">Want to Join the Legends?</h3>
            <p className="text-muted-foreground max-w-md">
              Find a golden cap in any F.U. bottle and you could be next. 
              Create your own flavor, design your bottle, choose your cause.
            </p>
            <Badge className="bg-yellow-500 text-black text-lg py-2 px-6 hover:bg-yellow-400 transition-colors">
              1 in every series has the golden cap
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}