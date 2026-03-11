import { useEffect, useState } from "react";
import { Trophy, MapPin, Sparkles, Quote, Calendar, Heart } from "lucide-react";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Winner {
  id: string;
  winnerName: string;
  winnerLocation: string | null;
  winnerAvatarUrl: string | null;
  creationName: string | null;
  creationDescription: string | null;
  creationFlavor: string | null;
  creationImageUrl: string | null;
  impactProject: string | null;
  impactAmount: number | null;
  seriesNumber: number | null;
  editionSize: number | null;
  winnerQuote: string | null;
  featured: boolean;
  wonAt: Timestamp;
}

// Placeholder data in case of fetch error
const placeholderWinners: Winner[] = [
  {
    id: "1",
    winnerName: "Alex R.",
    winnerLocation: "Amsterdam, NL",
    winnerAvatarUrl: null,
    creationName: "REBEL DROP",
    creationDescription:
      "A mysterious blend that keeps you guessing with every sip.",
    creationFlavor: "Mystery Citrus Fusion",
    creationImageUrl:
      "/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png",
    impactProject: "Street Art Programs",
    impactAmount: 4500,
    seriesNumber: 3,
    editionSize: 300,
    winnerQuote:
      "I wanted to create something that represents the unpredictable energy of street culture.",
    featured: true,
    wonAt: Timestamp.fromDate(new Date("2024-11-15T10:00:00Z")),
  },
  // ... other placeholders
];

export default function FUWinnersHallOfFame() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      try {
        const winnersRef = collection(db, "goldenTicketWinners");
        const q = query(
          winnersRef,
          where("published", "==", true),
          orderBy("featured", "desc"),
          orderBy("wonAt", "desc"),
          limit(6),
        );

        const querySnapshot = await getDocs(q);
        const fetchedWinners = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Winner,
        );

        setWinners(
          fetchedWinners.length > 0 ? fetchedWinners : placeholderWinners,
        );
      } catch (error) {
        console.error("Error fetching winners:", error);
        setWinners(placeholderWinners); // Fallback to placeholders on error
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
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
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
            Meet the bold ones who found the golden cap and created their own
            legendary F.U. flavor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.map((winner) => (
            <Card
              key={winner.id}
              className={`group relative overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02] ${
                winner.featured
                  ? "border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              {winner.featured && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <img
                  src={winner.creationImageUrl || "/placeholder.svg"}
                  alt={winner.creationName || "Winner creation"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                {winner.seriesNumber && (
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-black/70 backdrop-blur-sm"
                    >
                      Series #{winner.seriesNumber.toString().padStart(2, "0")}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-foreground">
                    {winner.creationName || "Unnamed Creation"}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {winner.creationFlavor}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-black font-bold text-lg">
                    {winner.winnerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {winner.winnerName}
                    </p>
                    {winner.winnerLocation && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {winner.winnerLocation}
                      </p>
                    )}
                  </div>
                </div>

                {winner.winnerQuote && (
                  <div className="bg-muted/50 rounded-lg p-4 relative">
                    <Quote className="absolute top-2 left-2 w-4 h-4 text-muted-foreground/30" />
                    <p className="text-sm italic text-muted-foreground pl-4">
                      "{winner.winnerQuote}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div className="text-sm">
                      <span className="font-bold text-foreground">
                        {winner.impactAmount
                          ? formatEuro(winner.impactAmount)
                          : "€0"}
                      </span>
                      <span className="text-muted-foreground"> raised</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(winner.wonAt)}
                  </div>
                </div>

                {winner.impactProject && (
                  <div className="text-xs text-center">
                    <span className="text-muted-foreground">Supporting: </span>
                    <span className="font-semibold text-primary">
                      {winner.impactProject}
                    </span>
                  </div>
                )}

                {winner.editionSize && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      Limited Edition: {winner.editionSize} Units
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h3 className="text-2xl font-bold">Want to Join the Legends?</h3>
            <p className="text-muted-foreground max-w-md">
              Find a golden cap in any F.U. bottle and you could be next.
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
