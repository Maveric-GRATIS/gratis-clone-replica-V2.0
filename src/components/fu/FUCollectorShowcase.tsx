import { Sparkles, Palette, Shield, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const showcaseItems = [
  {
    id: '1',
    seriesNumber: 1,
    name: 'INFERNO',
    artist: 'Street Art Collective',
    editionOf: 500,
    image: '/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png',
    designStyle: 'Graffiti Fire',
  },
  {
    id: '2',
    seriesNumber: 2,
    name: 'ICE STORM',
    artist: 'Nordic Design Studio',
    editionOf: 500,
    image: '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png',
    designStyle: 'Cryogenic Art',
  },
  {
    id: '3',
    seriesNumber: 3,
    name: 'REBEL DROP',
    artist: 'Underground Artists',
    editionOf: 300,
    image: '/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png',
    designStyle: 'Mystery Pattern',
  },
  {
    id: '4',
    seriesNumber: 4,
    name: 'WINNER\'S CHOICE',
    artist: 'Community Created',
    editionOf: 100,
    image: '/lovable-uploads/gratis-lifestyle-drink.jpg',
    designStyle: 'Ultimate Rarity',
  },
];

export const FUCollectorShowcase = () => {
  return (
    <section className="py-20 bg-black border-t border-gray-800">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary text-primary">
            <Sparkles className="w-3 h-3 mr-1" />
            COLLECTOR'S SHOWCASE
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            MUSEUM OF F.U.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every bottle is a work of art. Numbered editions with unique designs 
            by international artists. Fully authenticated and collectible.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              {/* Series Badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="secondary" className="bg-red-500 text-white font-black">
                  #{String(item.seriesNumber).padStart(2, '0')}
                </Badge>
              </div>

              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-black text-white">{item.name}</h3>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Palette className="w-3 h-3" />
                    <span>{item.artist}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span>Edition of {item.editionOf}</span>
                  </div>
                </div>

                <Badge variant="outline" className="mt-3 text-[10px]">
                  {item.designStyle}
                </Badge>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Authentication Info */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-white">QR Authenticated</h4>
              <p className="text-sm text-gray-400">
                Every bottle has a unique QR code linking to its certificate of authenticity
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-white">Numbered Edition</h4>
              <p className="text-sm text-gray-400">
                Each bottle is individually numbered and registered in our collector's database
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-white">Artist Signed</h4>
              <p className="text-sm text-gray-400">
                Designs created by verified artists with full attribution and provenance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
