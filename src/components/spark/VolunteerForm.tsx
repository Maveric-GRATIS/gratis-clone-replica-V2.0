import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";
import { db, functions } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useFormDraft } from "@/hooks/useFormDraft";
import { FormDraftBanner } from "@/components/forms/FormDraftBanner";
import { SaveDraftButton } from "@/components/forms/SaveDraftButton";

const volunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  availability: z.enum(["weekdays", "weekends", "flexible"]),
  experience: z.string().optional(),
  motivation: z
    .string()
    .min(10, "Please share why you want to volunteer (at least 10 characters)"),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

type VolunteerDraftData = Omit<VolunteerFormData, "interests"> & {
  interests: string[];
};

export const VolunteerForm = () => {
  const defaultValues: VolunteerDraftData = {
    name: "",
    email: "",
    phone: "",
    city: "",
    interests: [],
    availability: "flexible",
    experience: "",
    motivation: "",
  };

  const [formData, setFormData] = useState<VolunteerDraftData>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const {
    draft,
    saveDraft,
    clearDraft,
    lastSaved,
    saving,
    hasDraft,
    loadingDraft,
  } = useFormDraft<VolunteerDraftData>("volunteer-application");

  const handleRestoreDraft = () => {
    if (draft) {
      setFormData(draft);
      setDraftRestored(true);
      toast.success(
        "Concept hersteld — je kunt verder gaan waar je gebleven was",
      );
    }
  };

  const handleDiscardDraft = async () => {
    await clearDraft();
    setDraftRestored(false);
    setFormData(defaultValues);
    toast.info("Concept verwijderd");
  };

  const handleSaveDraft = async () => {
    await saveDraft(
      formData as unknown as Record<string, unknown> as VolunteerDraftData,
    );
    toast.success(
      "Concept opgeslagen — je kunt dit formulier later verder invullen.",
    );
  };

  const interestOptions = [
    { id: "events", label: "Event Support" },
    { id: "distribution", label: "Street Distribution" },
    { id: "fundraising", label: "Fundraising" },
    { id: "ambassador", label: "Mission Ambassador" },
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = volunteerSchema.parse(formData);

      // Save to Firestore
      toast.info("Submitting application...");
      await addDoc(collection(db, "volunteerApplications"), {
        ...validatedData,
        status: "pending",
        submittedAt: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });

      // Send email notification
      const sendVolunteerNotification = httpsCallable(
        functions,
        "sendVolunteerApplicationNotification",
      );
      await sendVolunteerNotification(validatedData);

      toast.success("Application received! 🙌", {
        description:
          "We'll review your application and get back to you within 48 hours. Welcome to the crew!",
      });

      await clearDraft();
      setDraftRestored(false);
      // Reset form
      setFormData(defaultValues);
    } catch (error) {
      console.error("Error submitting volunteer application:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {hasDraft && !loadingDraft && (
            <FormDraftBanner
              lastSaved={lastSaved}
              onRestore={handleRestoreDraft}
              onDiscard={handleDiscardDraft}
              restored={draftRestored}
            />
          )}
          {/* Personal Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your full name"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+31 6 12345678"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Amsterdam, Rotterdam, etc."
                required
              />
            </div>
          </div>

          {/* Volunteer Interests */}
          <div className="space-y-3">
            <Label>What interests you? (Select all that apply)</Label>
            <div className="space-y-2">
              {interestOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors"
                >
                  <Checkbox
                    id={option.id}
                    checked={formData.interests.includes(option.id)}
                    onCheckedChange={() => handleInterestToggle(option.id)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label>Availability</Label>
            <RadioGroup
              value={formData.availability}
              onValueChange={(value: "weekdays" | "weekends" | "flexible") =>
                setFormData({ ...formData, availability: value })
              }
            >
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
                <RadioGroupItem value="weekdays" id="weekdays" />
                <Label htmlFor="weekdays" className="cursor-pointer flex-1">
                  Weekdays
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-accent/40 transition-colors">
                <RadioGroupItem value="weekends" id="weekends" />
                <Label htmlFor="weekends" className="cursor-pointer flex-1">
                  Weekends
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible" className="cursor-pointer flex-1">
                  Flexible (both)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Experience */}
          <div>
            <Label htmlFor="experience">
              Previous Volunteer Experience (Optional)
            </Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              placeholder="Have you volunteered before? Tell us about it..."
              rows={3}
            />
          </div>

          {/* Motivation */}
          <div>
            <Label htmlFor="motivation">
              Why GRATIS? What draws you to this movement?
            </Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) =>
                setFormData({ ...formData, motivation: e.target.value })
              }
              placeholder="Share your motivation and what you hope to contribute..."
              rows={4}
              required
            />
          </div>

          {/* Impact Notice */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">NEXT STEPS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Once you submit, we'll review your application and reach out
              within 48 hours to discuss next steps and upcoming opportunities.
            </p>
          </div>

          {/* Footer: Save Draft + Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border">
            <SaveDraftButton
              onSave={handleSaveDraft}
              lastSaved={lastSaved}
              saving={saving}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "JOIN THE CREW"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
