import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { db, functions } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  company_name: z.string().min(2, "Company/Brand name is required").max(100),
  contact_person: z.string().min(2, "Contact person is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(50).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  edition_size: z.string().min(1, "Please select an edition size"),
  flavor_vision: z
    .string()
    .min(10, "Please describe your flavor vision")
    .max(500),
  impact_cause: z
    .string()
    .min(10, "Please describe your preferred cause")
    .max(500),
  brand_story: z.string().max(1000).optional(),
  budget_range: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FUSponsorFormProps {
  onSuccess?: () => void;
}

export default function FUSponsorForm({ onSuccess }: FUSponsorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      website: "",
      edition_size: "",
      flavor_vision: "",
      impact_cause: "",
      brand_story: "",
      budget_range: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Save to Firestore
      await addDoc(collection(db, "fu_sponsor_inquiries"), {
        ...values,
        createdAt: new Date(),
      });

      // Also send email notification via Firebase Functions
      const sendPartnerInquiry = httpsCallable(
        functions,
        "sendPartnerInquiryNotification",
      );
      await sendPartnerInquiry({
        ...values,
        inquiry_type: "fu_sponsor",
      });

      toast({
        title: "Application Submitted! 🎉",
        description:
          "We're excited to create something unique with you. We'll contact you within 48 hours.",
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company/Brand Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your Brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person *</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@brand.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://yourbrand.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* F.U. Specific Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="edition_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edition Size *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select edition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="100">100 Units - €1.499</SelectItem>
                    <SelectItem value="300">300 Units - €3.999</SelectItem>
                    <SelectItem value="500">500 Units - €5.999</SelectItem>
                    <SelectItem value="custom">Custom Run (500+)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1500-2500">€1.500 - €2.500</SelectItem>
                    <SelectItem value="2500-5000">€2.500 - €5.000</SelectItem>
                    <SelectItem value="5000-10000">€5.000 - €10.000</SelectItem>
                    <SelectItem value="10000+">€10.000+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="flavor_vision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Flavor Vision *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the unique taste combination you envision. What makes it 'you'? Think bold, crazy, unforgettable..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="impact_cause"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Impact Cause *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Where should 100% of profits go? Clean water, education, arts, environment, or your own cause..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand_story"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Brand Story (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your brand, event, or the story behind this collaboration..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Submit F.U. Collaboration Request
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By submitting, you agree to be contacted about your F.U.
          collaboration. We'll respond within 48 hours.
        </p>
      </form>
    </Form>
  );
}
