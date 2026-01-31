/**
 * EventTicket Component
 *
 * Display event ticket with QR code
 */

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Download, Mail } from "lucide-react";
import type { Event, Ticket, EventLocation } from "@/types/event";
import {
  generateTicketQR,
  generateCheckInKey,
  type TicketQRData,
} from "@/lib/qrcode";
import { format } from "date-fns";

interface EventTicketProps {
  ticket: Ticket;
  event: Event;
  userEmail: string;
  userName: string;
}

// Helper to format location
function formatLocation(location: EventLocation | null): string {
  if (!location) return "";
  return `${location.name}, ${location.city}, ${location.country}`;
}

export function EventTicket({
  ticket,
  event,
  userEmail,
  userName,
}: EventTicketProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [ticket, event]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);

      const qrData: TicketQRData = {
        ticketId: ticket.id,
        eventId: event.id,
        userId: ticket.userId,
        ticketType: ticket.ticketTierName,
        orderNumber: ticket.orderNumber,
        checkInKey: generateCheckInKey(ticket.id, event.id),
      };

      const qrDataURL = await generateTicketQR(qrData);
      setQrCode(qrDataURL);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    // Create a printable ticket
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket - ${event.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            .ticket {
              border: 2px solid #000;
              border-radius: 12px;
              padding: 30px;
              position: relative;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #C1FF00;
              margin-bottom: 10px;
            }
            .event-title {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
            }
            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            .detail-item {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              color: #666;
              font-size: 12px;
              text-transform: uppercase;
            }
            .value {
              font-size: 16px;
              margin-top: 5px;
            }
            .qr-section {
              text-align: center;
              margin-top: 30px;
              padding-top: 30px;
              border-top: 2px dashed #ccc;
            }
            .qr-code {
              margin: 20px auto;
            }
            .ticket-number {
              font-family: monospace;
              font-size: 14px;
              color: #666;
            }
            @media print {
              body {
                margin: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="logo">GRATIS</div>
              <div class="event-title">${event.title}</div>
              <div class="ticket-number">Order #${ticket.orderNumber}</div>
            </div>

            <div class="details">
              <div class="detail-item">
                <div class="label">Date & Time</div>
                <div class="value">${format(event.startDate.toDate(), "MMMM dd, yyyy")} at ${format(event.startDate.toDate(), "HH:mm")}</div>
              </div>

              <div class="detail-item">
                <div class="label">Location</div>
                <div class="value">${formatLocation(event.location)}</div>
              </div>

              <div class="detail-item">
                <div class="label">Ticket Type</div>
                <div class="value">${ticket.ticketTierName}</div>
              </div>

              <div class="detail-item">
                <div class="label">Attendee</div>
                <div class="value">${userName}<br/>${userEmail}</div>
              </div>
            </div>

            <div class="qr-section">
              <div class="label">Check-in QR Code</div>
              <img src="${qrCode}" alt="Ticket QR Code" class="qr-code" />
              <div class="ticket-number">Ticket ID: ${ticket.id}</div>
            </div>
          </div>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Print Ticket</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(ticketHTML);
    printWindow.document.close();
  };

  const handleEmailTicket = () => {
    const subject = encodeURIComponent(`Your Ticket for ${event.title}`);
    const body = encodeURIComponent(
      `Your ticket for ${event.title}\n\n` +
        `Date: ${format(event.startDate.toDate(), "MMMM dd, yyyy")}\n` +
        `Time: ${format(event.startDate.toDate(), "HH:mm")}\n` +
        `Location: ${formatLocation(event.location)}\n\n` +
        `Order Number: ${ticket.orderNumber}\n` +
        `Ticket ID: ${ticket.id}\n\n` +
        `View your ticket online at: ${window.location.origin}/events/${event.slug}`,
    );

    window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-accent text-jet-black">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{event.title}</h3>
            <p className="text-sm opacity-80">Order #{ticket.orderNumber}</p>
          </div>
          <Badge variant="secondary" className="bg-white text-jet-black">
            {ticket.ticketTierName}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">
                {format(event.startDate.toDate(), "MMMM dd, yyyy")}
              </p>
              <p className="text-sm">
                {format(event.startDate.toDate(), "HH:mm")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{formatLocation(event.location)}</p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="border-t border-dashed pt-6">
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Check-in QR Code
              </p>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Generating QR code...</p>
                </div>
              ) : (
                <div className="inline-block p-4 bg-white rounded-lg border">
                  <img
                    src={qrCode}
                    alt="Ticket QR Code"
                    className="w-[300px] h-[300px]"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Ticket ID: {ticket.id}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleDownloadTicket}
            className="flex-1"
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          <Button
            onClick={handleEmailTicket}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Ticket
          </Button>
        </div>

        {/* Important Info */}
        <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
          <p className="font-medium">Important Information:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Please arrive 15 minutes early for check-in</li>
            <li>Present this QR code at the entrance</li>
            <li>This ticket is non-transferable</li>
            <li>Keep this ticket safe - screenshots are accepted</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
