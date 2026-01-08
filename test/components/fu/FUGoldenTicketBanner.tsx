import { useState } from "react";
import { Trophy, Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoldenTicketClaim } from "@/components/water/GoldenTicketClaim";

export const FUGoldenTicketBanner = () => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  return (
    <>
      <section className="relative py-16 overflow-hidden">
        {/* Golden Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/30 via-amber-800/40 to-yellow-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent" />
        
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-yellow-400/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                width: `${8 + Math.random() * 12}px`,
                height: `${8 + Math.random() * 12}px`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-yellow-500 text-black font-black text-sm px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              GOLDEN CAP HUNT
            </Badge>

            {/* Main Content */}
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-yellow-400">WIN & CREATE</span>
              <br />
              <span className="text-white">YOUR OWN F.U.</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Every F.U. series has <span className="text-yellow-400 font-bold">ONE golden cap</span>. 
              Find it and you'll work with our team to create your very own 
              limited edition flavor, design, and choose where profits go!
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
                <div className="text-2xl mb-2">🎨</div>
                <h4 className="font-bold text-yellow-400">Design Your Bottle</h4>
                <p className="text-sm text-gray-400">Custom artwork & messaging</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
                <div className="text-2xl mb-2">👅</div>
                <h4 className="font-bold text-yellow-400">Create Your Flavor</h4>
                <p className="text-sm text-gray-400">Unique taste combination</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
                <div className="text-2xl mb-2">💚</div>
                <h4 className="font-bold text-yellow-400">Choose Your Cause</h4>
                <p className="text-sm text-gray-400">100% profits to your project</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setShowClaimModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black hover:from-yellow-400 hover:to-amber-400 group"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Found a Golden Cap? Claim Now!
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-center justify-center gap-8 text-sm">
              <div>
                <span className="text-yellow-400 font-bold">3</span>
                <span className="text-gray-400"> Golden Caps Found</span>
              </div>
              <div className="w-px h-4 bg-gray-700" />
              <div>
                <span className="text-yellow-400 font-bold">2</span>
                <span className="text-gray-400"> Winner Creations Live</span>
              </div>
              <div className="w-px h-4 bg-gray-700" />
              <div>
                <span className="text-yellow-400 font-bold">€8K+</span>
                <span className="text-gray-400"> Winner Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoldenTicketClaim 
        open={showClaimModal} 
        onOpenChange={setShowClaimModal} 
      />
    </>
  );
};
