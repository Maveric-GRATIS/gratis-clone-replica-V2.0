import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Briefcase, Upload } from "lucide-react";
import { db, storage, functions } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { useFormDraft } from "@/hooks/useFormDraft";
import { FormDraftBanner } from "@/components/forms/FormDraftBanner";
import { SaveDraftButton } from "@/components/forms/SaveDraftButton";

const jobApplicationSchema = z.object({
  position: z.string().min(1, "Please select a position"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters"),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date preference is required"),
});

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

export const JobApplicationForm = () => {
  const defaultValues: JobApplicationFormData = {
    position: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    coverLetter: "",
    portfolio: "",
    startDate: "",
  };

  const [formData, setFormData] =
    useState<JobApplicationFormData>(defaultValues);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
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
  } = useFormDraft<JobApplicationFormData>("job-application");

  const handleRestoreDraft = () => {
    if (draft) {
      setFormData(draft);
      setDraftRestored(true);
      toast.success("Concept hersteld", {
        description:
          "Je kunt verder gaan waar je gebleven was. Upload je CV opnieuw.",
      });
    }
  };

  const handleDiscardDraft = async () => {
    await clearDraft();
    setDraftRestored(false);
    setFormData(defaultValues);
    toast.info("Concept verwijderd");
  };

  const handleSaveDraft = async () => {
    await saveDraft(formData);
    toast.success("Concept opgeslagen", {
      description:
        "Je kunt dit formulier later verder invullen. Vergeet je CV te herladen.",
    });
  };

  const positions = [
    { value: "event-coordinator", label: "Event Coordinator (Temporary)" },
    { value: "distribution-lead", label: "Distribution Lead (Temporary)" },
    { value: "marketing-intern", label: "Marketing & Social Media Intern" },
    { value: "impact-intern", label: "Impact Analysis Intern" },
    { value: "operations-manager", label: "Operations Manager (Full-Time)" },
    {
      value: "partnerships-manager",
      label: "Partnerships Manager (Full-Time)",
    },
    { value: "brand-ambassador", label: "GRATIS Brand Ambassador" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = jobApplicationSchema.parse(formData);

      if (!resumeFile) {
        toast.error("Please upload your resume");
        setIsSubmitting(false);
        return;
      }

      let resumeUrl = "";
      const resumeFileName = resumeFile.name;

      // Try to upload resume to Firebase Storage
      try {
        toast.info("Uploading resume...");
        const timestamp = Date.now();
        const fileExtension = resumeFile.name.split(".").pop();
        const storageRef = ref(
          storage,
          `applications/${timestamp}_${validatedData.name.replace(/\s+/g, "_")}.${fileExtension}`,
        );

        const uploadResult = await uploadBytes(storageRef, resumeFile);
        resumeUrl = await getDownloadURL(uploadResult.ref);
      } catch (storageError) {
        console.warn(
          "Storage upload failed, saving without file:",
          storageError,
        );
        // Continue without file upload - admin can request it later
        toast.warning(
          "Resume upload failed. We'll save your application and you can email your resume separately.",
        );
      }

      // Save application to Firestore
      toast.info("Saving application...");
      await addDoc(collection(db, "jobApplications"), {
        ...validatedData,
        resumeUrl: resumeUrl || "pending",
        resumeFileName,
        status: "pending",
        submittedAt: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });

      // Send email notification
      const sendJobNotification = httpsCallable(
        functions,
        "sendJobApplicationNotification",
      );
      await sendJobNotification({
        ...validatedData,
        resumeUrl,
      });

      toast.success("Application submitted! 🎉", {
        description:
          "We've received your application and will review it within 5 business days. Good luck!",
      });

      await clearDraft();
      setDraftRestored(false);

      // Reset form
      setFormData(defaultValues);
      setResumeFile(null);

      // Reset file input
      const fileInput = document.getElementById("resume") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(`Error: ${error.message}`, {
          description: "Check the console for more details.",
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          description:
            "Make sure you're connected to the internet and try again.",
        });
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

          {/* Position Selection */}
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={formData.position}
              onValueChange={(value) =>
                setFormData({ ...formData, position: value })
              }
            >
              <SelectTrigger id="position">
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {positions.map((position) => (
                  <SelectItem key={position.value} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
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
              <Label htmlFor="city">Location/City</Label>
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

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV</Label>
            <div className="flex items-center gap-4">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {resumeFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  {resumeFile.name}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, or DOCX (max 5MB)
            </p>
          </div>

          {/* Cover Letter */}
          <div>
            <Label htmlFor="coverLetter">
              Cover Letter: Why GRATIS? Why this role?
            </Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              placeholder="Tell us about yourself, why you're passionate about GRATIS, and why you're the right fit for this role..."
              rows={6}
              required
            />
          </div>

          {/* Portfolio */}
          <div>
            <Label htmlFor="portfolio">Portfolio/LinkedIn (Optional)</Label>
            <Input
              id="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={(e) =>
                setFormData({ ...formData, portfolio: e.target.value })
              }
              placeholder="https://linkedin.com/in/yourprofile or portfolio link"
            />
          </div>

          {/* Start Date */}
          <div>
            <Label htmlFor="startDate">When can you start?</Label>
            <Input
              id="startDate"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              placeholder="Immediately, 2 weeks notice, after graduation, etc."
              required
            />
          </div>

          {/* Notice */}
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">APPLICATION PROCESS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              We review applications on a rolling basis. Shortlisted candidates
              will be invited for an interview within 5 business days.
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
              className="w-full sm:w-auto bg-gradient-to-r from-accent to-primary hover:opacity-90 text-primary-foreground"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "APPLY NOW"
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By submitting this application, you consent to GRATIS storing and
            processing your personal data for recruitment purposes.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
