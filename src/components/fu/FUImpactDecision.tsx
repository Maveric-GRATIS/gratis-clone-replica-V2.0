import { Trophy, Palette, Heart, Handshake, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: 1,
    icon: Trophy,
    title: "Win or Partner",
    description: "Find the Golden Cap or become an F.U. sponsor",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  {
    number: 2,
    icon: Palette,
    title: "Create Your F.U.",
    description: "Design your unique flavor and bottle artwork",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    number: 3,
    icon: Heart,
    title: "Choose Your Impact",
    description: "Decide where 100% of profits go",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  {
    number: 4,
    icon: Handshake,
    title: "Execute Together",
    description: "We bring your vision to life as a team",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
];

const impactOptions = [
  { name: "Clean Water", icon: "💧", description: "Fund wells and filtration systems" },
  { name: "Education", icon: "📚", description: "Support schools and programs" },
  { name: "Arts & Culture", icon: "🎨", description: "Fund creative initiatives" },
  { name: "Environment", icon: "🌍", description: "Support sustainability projects" },
  { name: "Custom Cause", icon: "✨", description: "Choose your own project" },
];

export const FUImpactDecision = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black border-t border-gray-800">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-green-500 text-green-400">
            <Heart className="w-3 h-3 mr-1" />
            DECIDE THE IMPACT
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            YOUR F.U., YOUR CAUSE
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            What makes F.U. truly unique? <span className="text-primary font-bold">You decide where the money goes.</span> 
            {" "}Every sponsor and Golden Ticket winner chooses their impact project. 
            100% of profits go to the cause you care about.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-800" />
              )}
              
              <div className={`relative ${step.bgColor} ${step.borderColor} border rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300`}>
                {/* Step Number */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-900 border-2 ${step.borderColor} flex items-center justify-center`}>
                  <span className={`text-sm font-black ${step.color}`}>{step.number}</span>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-full ${step.bgColor} border ${step.borderColor} flex items-center justify-center mx-auto mt-2 mb-4`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>

                <h3 className="text-lg font-black text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Options */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-xl font-bold text-white mb-8">
            Choose Your Cause
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {impactOptions.map((option) => (
              <div
                key={option.name}
                className="group bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center hover:border-primary/50 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <h4 className="text-sm font-bold text-white mb-1">{option.name}</h4>
                <p className="text-[10px] text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
          <div>
            <div className="text-4xl font-black text-primary">€25K+</div>
            <div className="text-sm text-gray-400">Total Impact Generated</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary">12</div>
            <div className="text-sm text-gray-400">Collaborations Completed</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary">5</div>
            <div className="text-sm text-gray-400">Active Impact Projects</div>
          </div>
        </div>
      </div>
    </section>
  );
};
