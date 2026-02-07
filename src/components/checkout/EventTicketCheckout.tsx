import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Ticket, Calendar, MapPin, Users, Info } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  ticketTypes: {
    type: string;
    price: number;
    available: number;
    description?: string;
  }[];
  maxTicketsPerOrder: number;
}

export default function EventTicketCheckout() {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    if (!eventId) return;

    try {
      const eventDoc = await getDoc(doc(db, "events", eventId));
      if (eventDoc.exists()) {
        const data = eventDoc.data();
        setEvent({
          id: eventDoc.id,
          title: data.title,
          date: data.date.toDate(),
          location: data.location,
          ticketTypes: data.ticketTypes || [],
          maxTicketsPerOrder: data.maxTicketsPerOrder || 10,
        });
        if (data.ticketTypes?.length > 0) {
          setSelectedType(data.ticketTypes[0].type);
        }
      } else {
        toast({
          title: t("error.eventNotFound", "Event Not Found"),
          description: t(
            "error.eventNotFoundDescription",
            "The event you're looking for doesn't exist",
          ),
          variant: "destructive",
        });
        navigate("/events");
      }
    } catch (error) {
      console.error("Error loading event:", error);
      toast({
        title: t("error.loadFailed", "Load Failed"),
        description: t("error.tryAgain", "Please try again later"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: t("auth.required", "Authentication Required"),
        description: t("auth.loginToContinue", "Please log in to continue"),
        variant: "destructive",
      });
      navigate("/login", {
        state: { returnTo: `/events/${eventId}/checkout` },
      });
      return;
    }

    if (!selectedType || quantity < 1) {
      toast({
        title: t("error.invalidSelection", "Invalid Selection"),
        description: t(
          "error.selectTickets",
          "Please select ticket type and quantity",
        ),
        variant: "destructive",
      });
      return;
    }

    const ticketType = event?.ticketTypes.find((t) => t.type === selectedType);
    if (!ticketType) return;

    if (quantity > ticketType.available) {
      toast({
        title: t("error.notEnoughTickets", "Not Enough Tickets"),
        description: t("error.reduceQuantity", "Please reduce the quantity"),
        variant: "destructive",
      });
      return;
    }

    setCheckoutLoading(true);

    try {
      const functions = getFunctions();
      const createCheckout = httpsCallable(
        functions,
        "createEventTicketCheckout",
      );

      const result = await createCheckout({
        eventId,
        ticketType: selectedType,
        quantity,
        successUrl: `${window.location.origin}/events/${eventId}/confirmation`,
        cancelUrl: `${window.location.origin}/events/${eventId}/checkout`,
      });

      const { url } = result.data as { url: string };
      window.location.href = url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: t("error.checkoutFailed", "Checkout Failed"),
        description:
          error.message || t("error.tryAgain", "Please try again later"),
        variant: "destructive",
      });
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const selectedTicketType = event.ticketTypes.find(
    (t) => t.type === selectedType,
  );
  const totalPrice = selectedTicketType
    ? selectedTicketType.price * quantity
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/events/${eventId}`)}
            className="mb-4"
          >
            ← {t("common.back", "Back")}
          </Button>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{event.date.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ticket Selection */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              {t("tickets.selectTickets", "Select Tickets")}
            </h3>

            <div className="space-y-6">
              {/* Ticket Type */}
              <div className="space-y-2">
                <Label htmlFor="ticket-type">
                  {t("tickets.ticketType", "Ticket Type")}
                </Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="ticket-type">
                    <SelectValue
                      placeholder={t("tickets.selectType", "Select type")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {event.ticketTypes.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {type.type} - €{type.price.toFixed(2)}
                          </span>
                          <Badge
                            variant={
                              type.available > 0 ? "default" : "destructive"
                            }
                          >
                            {type.available}{" "}
                            {t("tickets.available", "available")}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTicketType?.description && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {selectedTicketType.description}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  {t("tickets.quantity", "Quantity")}
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={Math.min(
                      selectedTicketType?.available || 1,
                      event.maxTicketsPerOrder,
                    )}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            parseInt(e.target.value) || 1,
                            selectedTicketType?.available || 1,
                            event.maxTicketsPerOrder,
                          ),
                        ),
                      )
                    }
                    className="text-center w-20"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          quantity + 1,
                          selectedTicketType?.available || 1,
                          event.maxTicketsPerOrder,
                        ),
                      )
                    }
                    disabled={
                      quantity >= (selectedTicketType?.available || 1) ||
                      quantity >= event.maxTicketsPerOrder
                    }
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("tickets.maxPerOrder", "Maximum")}{" "}
                  {event.maxTicketsPerOrder}{" "}
                  {t("tickets.perOrder", "per order")}
                </p>
              </div>

              {selectedTicketType && selectedTicketType.available < 10 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {t("tickets.limitedAvailability", "Limited availability!")}{" "}
                    {t("tickets.only", "Only")} {selectedTicketType.available}{" "}
                    {t("tickets.ticketsLeft", "tickets left")}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {t("tickets.orderSummary", "Order Summary")}
            </h3>

            <div className="space-y-4">
              {selectedTicketType && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {quantity}x {selectedTicketType.type}
                    </span>
                    <span className="font-medium">
                      €{(selectedTicketType.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-baseline mb-6">
                      <span className="text-lg font-semibold">
                        {t("tickets.total", "Total")}
                      </span>
                      <span className="text-3xl font-bold">
                        €{totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={
                        checkoutLoading || !selectedType || quantity < 1
                      }
                      className="w-full"
                      size="lg"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("common.processing", "Processing...")}
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4 mr-2" />
                          {t(
                            "tickets.proceedToCheckout",
                            "Proceed to Checkout",
                          )}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      {t(
                        "tickets.secureCheckout",
                        "Secure checkout powered by Stripe. You'll receive your tickets via email.",
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t("tickets.whatToExpect", "What to Expect")}
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {t("tickets.expect1", "Instant email confirmation")}</li>
                <li>
                  • {t("tickets.expect2", "QR code tickets for easy check-in")}
                </li>
                <li>• {t("tickets.expect3", "Event updates and reminders")}</li>
                <li>
                  • {t("tickets.expect4", "Full refund if event is cancelled")}
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
