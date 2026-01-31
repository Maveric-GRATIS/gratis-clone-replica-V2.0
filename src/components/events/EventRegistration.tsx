import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  User,
  Mail,
  Phone,
  Building,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface EventTicketTier {
  id: string;
  name: string;
  price: number;
  available: number;
  description?: string;
  benefits?: string[];
}

interface Event {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  location?: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  ticketTiers: EventTicketTier[];
  registration: {
    maxAttendees: number;
    currentAttendees: number;
  };
}

interface EventRegistrationProps {
  event: Event;
  onComplete?: (registrationId: string) => void;
}

type RegistrationStep = "tickets" | "details" | "payment" | "confirmation";

export function EventRegistration({
  event,
  onComplete,
}: EventRegistrationProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("tickets");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { checkoutEventTicket, loading, error } = useStripeCheckout();

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    dietaryRequirements: "",
    specialRequests: "",
    agreeToTerms: false,
    marketingConsent: false,
  });

  const selectedTier = event.ticketTiers.find((t) => t.id === selectedTicket);
  const totalPrice = selectedTier ? selectedTier.price * quantity : 0;

  const handleNextStep = async () => {
    if (currentStep === "tickets") {
      if (!selectedTicket) return;
      setCurrentStep("details");
    } else if (currentStep === "details") {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.agreeToTerms
      ) {
        alert("Please fill in all required fields");
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      if (totalPrice === 0) {
        // Free event - skip payment
        const mockRegistrationId = `REG-${Date.now()}`;
        setRegistrationId(mockRegistrationId);
        setCurrentStep("confirmation");
        onComplete?.(mockRegistrationId);
      } else {
        // Paid event - process with Stripe
        await checkoutEventTicket({
          eventId: event.id,
          ticketTierId: selectedTicket!,
          quantity,
          attendeeInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/events/${event.slug}`,
        });
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "details") {
      setCurrentStep("tickets");
    } else if (currentStep === "payment") {
      setCurrentStep("details");
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {[
              { key: "tickets", label: "Tickets", icon: Users },
              { key: "details", label: "Details", icon: User },
              { key: "payment", label: "Payment", icon: CreditCard },
              { key: "confirmation", label: "Confirm", icon: CheckCircle2 },
            ].map((step, index, arr) => (
              <div key={step.key} className="flex items-center flex-1">
                <div
                  className={`flex flex-col items-center ${index < arr.length - 1 ? "flex-1" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      currentStep === step.key
                        ? "bg-primary text-primary-foreground"
                        : arr.findIndex((s) => s.key === currentStep) > index
                          ? "bg-success text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
                {index < arr.length - 1 && (
                  <Separator className="flex-1 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === "tickets" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Tickets</CardTitle>
            <CardDescription>
              Choose your ticket type and quantity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedTicket || ""}
              onValueChange={setSelectedTicket}
            >
              {event.ticketTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center space-x-2 border rounded-lg p-4"
                >
                  <RadioGroupItem value={tier.id} id={tier.id} />
                  <Label htmlFor={tier.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{tier.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {tier.description}
                        </p>
                      </div>
                      <div className="text-right">
                        {tier.price === 0 ? (
                          <Badge
                            variant="outline"
                            className="text-success border-success"
                          >
                            FREE
                          </Badge>
                        ) : (
                          <p className="text-lg font-bold">€{tier.price}</p>
                        )}
                      </div>
                    </div>
                    {tier.benefits && tier.benefits.length > 0 && (
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i}>✓ {benefit}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      {tier.available} tickets available
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedTicket && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedTier?.available || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/events/${event.slug}`}>Cancel</Link>
            </Button>
            <Button onClick={handleNextStep} disabled={!selectedTicket}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+31 6 12345678"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="ACME Corp"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
              <Textarea
                id="dietaryRequirements"
                value={formData.dietaryRequirements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dietaryRequirements: e.target.value,
                  })
                }
                placeholder="Any allergies or dietary restrictions?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData({ ...formData, specialRequests: e.target.value })
                }
                placeholder="Accessibility needs, questions, etc."
                rows={2}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      agreeToTerms: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link to="/tribe/terms" className="text-primary underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/tribe/privacy" className="text-primary underline">
                    Privacy Policy
                  </Link>{" "}
                  *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      marketingConsent: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="marketing"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Send me updates about GRATIS events and programs
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.agreeToTerms
              }
            >
              Continue to Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "payment" && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{event.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(event.startDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location.city}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {selectedTier?.name} × {quantity}
                  </span>
                  <span className="font-medium">
                    €{selectedTier?.price} × {quantity}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-muted p-3 rounded text-sm">
                <p className="font-medium mb-1">Registrant Information</p>
                <p>
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-muted-foreground">{formData.email}</p>
                {formData.phone && (
                  <p className="text-muted-foreground">{formData.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                {totalPrice === 0
                  ? "This is a free event. Click Complete Registration to finish."
                  : "Select your payment method"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalPrice > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 text-center text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-2" />
                    <p>Stripe payment integration</p>
                    <p className="text-sm">
                      This will be implemented with Stripe Checkout
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
                  <p>No payment required</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : totalPrice === 0 ? (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Pay Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentStep === "confirmation" && registrationId && (
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <CardTitle className="text-2xl">Registration Confirmed!</CardTitle>
            <CardDescription>
              Your registration for {event.title} is complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Registration ID
              </p>
              <p className="font-mono font-bold text-lg">{registrationId}</p>
            </div>

            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to{" "}
              <strong>{formData.email}</strong> with your ticket and event
              details.
            </p>

            <div className="space-y-2">
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard">View My Events</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" asChild>
              <Link to="/events">Browse More Events</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
