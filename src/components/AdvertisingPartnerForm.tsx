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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  contact_person: z.string().min(2, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  estimated_volume: z.string().optional(),
  campaign_goals: z.string().optional(),
  preferred_start_date: z.date().optional(),
  additional_notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AdvertisingPartnerFormProps {
  onSuccess?: () => void;
}

export default function AdvertisingPartnerForm({
  onSuccess,
}: AdvertisingPartnerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      website: "",
      industry: "",
      estimated_volume: "",
      campaign_goals: "",
      additional_notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "advertising_inquiries"), {
        ...values,
        createdAt: new Date(),
      });

      toast({
        title: "Application Submitted!",
        description:
          "Thank you for your interest. We'll contact you within 48 hours.",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="ACME Corp" {...field} />
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
                  <Input placeholder="John Doe" {...field} />
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
                  <Input type="email" placeholder="john@acme.com" {...field} />
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
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://acme.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry/Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="sports">Sports & Fitness</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimated_volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Monthly Volume</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1k-5k">1.000 - 5.000 units</SelectItem>
                    <SelectItem value="5k-10k">5.000 - 10.000 units</SelectItem>
                    <SelectItem value="10k-25k">
                      10.000 - 25.000 units
                    </SelectItem>
                    <SelectItem value="25k+">25.000+ units</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preferred_start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Preferred Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="campaign_goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your marketing objectives and what you hope to achieve..."
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
          name="additional_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any other information you'd like to share..."
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
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Application
        </Button>
      </form>
    </Form>
  );
}
