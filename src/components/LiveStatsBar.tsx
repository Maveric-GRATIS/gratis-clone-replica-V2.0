/**
 * LiveStatsBar Component
 *
 * Sticky bar showing live impact statistics
 */

import { useEffect, useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Droplet, Palette, GraduationCap, Users } from "lucide-react";

interface ImpactStats {
  bottlesDistributed: number;
  artsSupported: number;
  educationReached: number;
  tribeMembers: number;
}

export function LiveStatsBar() {
  const [stats, setStats] = useState<ImpactStats>({
    bottlesDistributed: 1250000,
    artsSupported: 8500,
    educationReached: 15000,
    tribeMembers: 12000,
  });

  // In production: Subscribe to real-time Firestore stats
  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        bottlesDistributed:
          prev.bottlesDistributed + Math.floor(Math.random() * 10),
        artsSupported: prev.artsSupported + Math.floor(Math.random() * 2),
        educationReached: prev.educationReached + Math.floor(Math.random() * 5),
        tribeMembers: prev.tribeMembers + Math.floor(Math.random() * 3),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-jet-black/95 backdrop-blur-md border-b border-hot-lime/20">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <StatItem
            icon={<Droplet className="h-5 w-5" />}
            value={stats.bottlesDistributed}
            label="Bottles Distributed"
            color="text-electric-blue"
          />
          <StatItem
            icon={<Palette className="h-5 w-5" />}
            value={stats.artsSupported}
            label="Arts Supported"
            color="text-hot-magenta"
          />
          <StatItem
            icon={<GraduationCap className="h-5 w-5" />}
            value={stats.educationReached}
            label="Students Reached"
            color="text-solar-orange"
          />
          <StatItem
            icon={<Users className="h-5 w-5" />}
            value={stats.tribeMembers}
            label="TRIBE Members"
            color="text-hot-lime"
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${color} flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <div className={`text-xl md:text-2xl font-bold ${color} tabular-nums`}>
          <AnimatedCounter end={value} duration={1500} separator="," />
        </div>
        <div className="text-xs text-white/70 truncate">{label}</div>
      </div>
    </div>
  );
}
