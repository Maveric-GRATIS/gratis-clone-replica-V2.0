import { Users, Trophy, Target, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CollabStory {
  id: string;
  title: string;
  creator: string;
  creatorType: 'sponsor' | 'winner';
  flavorName: string;
  editionSize: number;
  message: string;
  impactAmount: string;
  impactProject: string;
  image: string;
}

const collabStories: CollabStory[] = [
  {
    id: '1',
    title: 'REBEL DROP',
    creator: 'Rebel Collective',
    creatorType: 'sponsor',
    flavorName: 'Mystery Blend',
    editionSize: 300,
    message: 'Street art meets hydration. Taste the rebellion.',
    impactAmount: '€4,500',
    impactProject: 'Youth Art Programs',
    image: '/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png',
  },
  {
    id: '2',
    title: 'NEON NIGHTS',
    creator: 'Amsterdam Collective',
    creatorType: 'sponsor',
    flavorName: 'Electric Berry',
    editionSize: 500,
    message: 'When the sun goes down, the flavor comes alive.',
    impactAmount: '€7,200',
    impactProject: 'Night Shelter Support',
    image: '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png',
  },
  {
    id: '3',
    title: 'GOLDEN DREAM',
    creator: 'Maria S.',
    creatorType: 'winner',
    flavorName: 'Tropical Thunder',
    editionSize: 100,
    message: 'I won the golden cap and created my dream flavor!',
    impactAmount: '€2,100',
    impactProject: 'Clean Water Wells',
    image: '/lovable-uploads/gratis-lifestyle-drink.jpg',
  },
];

export const FUCollabStories = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-purple-500 text-purple-400">
            <Users className="w-3 h-3 mr-1" />
            COLLABORATION STORIES
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            CREATED TOGETHER
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every F.U. has a story. See how sponsors and Golden Ticket winners 
            brought their unique visions to life.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {collabStories.map((story) => (
            <div
              key={story.id}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Creator Badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant="secondary" 
                    className={story.creatorType === 'winner' 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-purple-500 text-white'
                    }
                  >
                    {story.creatorType === 'winner' ? (
                      <>
                        <Trophy className="w-3 h-3 mr-1" />
                        Winner Creation
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3 mr-1" />
                        Sponsor Collab
                      </>
                    )}
                  </Badge>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black text-white">{story.title}</h3>
                  <p className="text-sm text-gray-300">{story.flavorName} • {story.editionSize} units</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">by</span>
                  <span className="text-sm font-bold text-foreground">{story.creator}</span>
                </div>

                <p className="text-gray-400 text-sm italic">"{story.message}"</p>

                {/* Impact */}
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <Target className="w-4 h-4 text-green-400" />
                  <div>
                    <span className="text-green-400 font-bold">{story.impactAmount}</span>
                    <span className="text-gray-400 text-sm"> → {story.impactProject}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group">
            View All Collaborations
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
