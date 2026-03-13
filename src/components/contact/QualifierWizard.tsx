import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Handshake, Megaphone, HelpCircle, Heart, 
  ArrowRight, ArrowLeft, Sparkles 
} from 'lucide-react';

export interface QualificationData {
  category: string;
  subcategory: string;
  answers: Record<string, string>;
}

interface QualifierWizardProps {
  onComplete: (data: QualificationData) => void;
}

const categories = [
  { id: 'ngo_partnership', label: 'NGO Partnership', description: 'Apply for annual funding or explore partnership opportunities', icon: Handshake, color: 'hsl(var(--brand-green))' },
  { id: 'sponsorship', label: 'Sponsorship & Advertising', description: 'Brand collaborations, event sponsorship, or advertising', icon: Megaphone, color: 'hsl(var(--brand-pink))' },
  { id: 'general', label: 'General Inquiry', description: 'Product questions, orders, press, or general support', icon: HelpCircle, color: 'hsl(var(--brand-blue))' },
  { id: 'volunteer', label: 'Volunteer & Donate', description: 'Give your time, money, or skills to the mission', icon: Heart, color: 'hsl(var(--brand-yellow))' },
];

const subcategories: Record<string, { id: string; label: string }[]> = {
  ngo_partnership: [
    { id: 'new_application', label: 'Apply as a new NGO partner' },
    { id: 'existing_partner', label: 'I\'m an existing partner' },
    { id: 'learn_more', label: 'I want to learn more first' },
  ],
  sponsorship: [
    { id: 'brand_collab', label: 'Brand / Product collaboration' },
    { id: 'event_sponsor', label: 'Event or festival sponsorship' },
    { id: 'advertising', label: 'Advertising partnership' },
    { id: 'custom_edition', label: 'Custom F.U. Edition' },
  ],
  general: [
    { id: 'product_question', label: 'Question about products' },
    { id: 'order_issue', label: 'Order or shipping issue' },
    { id: 'press_media', label: 'Press & media inquiry' },
    { id: 'other', label: 'Something else' },
  ],
  volunteer: [
    { id: 'volunteer_time', label: 'Volunteer my time' },
    { id: 'donate_money', label: 'Make a donation' },
    { id: 'corporate_giving', label: 'Corporate / group giving' },
    { id: 'ambassador', label: 'Become an ambassador' },
  ],
};

const followUpQuestions: Record<string, { question: string; options: string[] }> = {
  ngo_partnership: { question: 'What is your organization\'s primary focus?', options: ['Clean Water', 'Education', 'Culture & Arts', 'Environment', 'Health', 'Other'] },
  sponsorship: { question: 'What\'s your approximate budget range?', options: ['< €5,000', '€5,000 – €25,000', '€25,000 – €100,000', '€100,000+', 'Not sure yet'] },
  general: { question: 'How urgent is your inquiry?', options: ['Just browsing', 'Need help soon', 'Urgent — need help today'] },
  volunteer: { question: 'Where are you located?', options: ['Netherlands', 'Europe (other)', 'North America', 'Other'] },
};

export const QualifierWizard = ({ onComplete }: QualifierWizardProps) => {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');

  const handleCategorySelect = (id: string) => {
    setCategory(id);
    setSubcategory('');
    setFollowUpAnswer('');
    setStep(1);
  };

  const handleSubcategorySelect = (id: string) => {
    setSubcategory(id);
    setStep(2);
  };

  const handleFollowUpSelect = (answer: string) => {
    setFollowUpAnswer(answer);
  };

  const handleComplete = () => {
    onComplete({
      category,
      subcategory,
      answers: {
        followUp: followUpAnswer,
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              s <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Category */}
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">How can we help you?</h2>
            <p className="text-muted-foreground mb-6">Select the option that best describes your inquiry.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Card
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="p-5 cursor-pointer border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{cat.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Subcategory */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="mb-4 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="text-2xl font-bold text-foreground mb-2">Tell us more</h2>
            <p className="text-muted-foreground mb-6">What specifically are you looking for?</p>
            <div className="space-y-3">
              {subcategories[category]?.map((sub) => (
                <Card
                  key={sub.id}
                  onClick={() => handleSubcategorySelect(sub.id)}
                  className="p-4 cursor-pointer border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{sub.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Follow-up question */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mb-4 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {followUpQuestions[category]?.question}
            </h2>
            <p className="text-muted-foreground mb-6">This helps us route you to the right place.</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {followUpQuestions[category]?.options.map((opt) => (
                <Button
                  key={opt}
                  variant={followUpAnswer === opt ? 'default' : 'outline'}
                  onClick={() => handleFollowUpSelect(opt)}
                  className="transition-all"
                >
                  {opt}
                </Button>
              ))}
            </div>
            {followUpAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button onClick={handleComplete} size="lg" className="w-full gap-2">
                  <Sparkles className="h-4 w-4" />
                  Continue to AI Assistant
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
