import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  type: z.enum(["brand", "ngo", "scholarship", "other"]),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = inquirySchema.parse(formData);
      setIsSubmitting(true);

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Inquiry submitted successfully! We'll get back to you soon.");
      
      setFormData({ name: "", type: "", message: "" });
    } catch (error) {
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name"
          required
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Inquiry Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          required
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select inquiry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brand">Brand Partnership</SelectItem>
            <SelectItem value="ngo">NGO Partnership</SelectItem>
            <SelectItem value="scholarship">Scholarship Application</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your inquiry..."
          required
          maxLength={1000}
          rows={6}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
