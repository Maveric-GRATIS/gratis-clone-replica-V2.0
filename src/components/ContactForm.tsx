import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { analytics } from "@/lib/analytics";
import { Mail, User, MessageSquare } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useTranslation } from "react-i18next";
import { useFormDraft } from "@/hooks/useFormDraft";
import { FormDraftBanner } from "@/components/forms/FormDraftBanner";
import { SaveDraftButton } from "@/components/forms/SaveDraftButton";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const { toast } = useToast();

  const {
    draft,
    saveDraft,
    clearDraft,
    lastSaved,
    saving,
    hasDraft,
    loadingDraft,
  } = useFormDraft<ContactFormData>("contact");

  const handleRestoreDraft = () => {
    if (draft) {
      setFormData(draft);
      setDraftRestored(true);
      toast({
        title: "Concept hersteld",
        description: "Je kunt verder gaan waar je gebleven was.",
      });
    }
  };

  const handleDiscardDraft = async () => {
    await clearDraft();
    setDraftRestored(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
    toast({ title: "Concept verwijderd" });
  };

  const handleSaveDraft = async () => {
    await saveDraft(formData);
    toast({
      title: "Concept opgeslagen",
      description: "Je kunt dit formulier later verder invullen.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      analytics.track({
        action: "contact_form_submit",
        category: "engagement",
        label: formData.subject,
      });

      const functions = getFunctions();
      const sendContactEmail = httpsCallable(functions, "sendContactEmail");
      await sendContactEmail(formData);

      toast({
        title: t("contact.successMessage"),
        description: t("contact.successDescription"),
      });

      await clearDraft();
      setDraftRestored(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      analytics.track({
        action: "contact_form_success",
        category: "engagement",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: t("contact.errorTitle"),
        description: t("contact.errorDescription"),
        variant: "destructive",
      });

      analytics.trackError(error as Error, "contact_form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Get In Touch</h2>
          <p className="text-muted-foreground mt-2">
            Have questions about GRATIS? We'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {hasDraft && !loadingDraft && (
            <FormDraftBanner
              lastSaved={lastSaved}
              onRestore={handleRestoreDraft}
              onDiscard={handleDiscardDraft}
              restored={draftRestored}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your name"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="What's this about?"
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Tell us more..."
              rows={4}
              required
              className="bg-input border-border resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <SaveDraftButton
              onSave={handleSaveDraft}
              lastSaved={lastSaved}
              saving={saving}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Or reach us directly at</p>
          <a
            href="mailto:hello@gratis.com"
            className="text-primary hover:underline"
          >
            hello@gratis.com
          </a>
        </div>
      </div>
    </Card>
  );
};
