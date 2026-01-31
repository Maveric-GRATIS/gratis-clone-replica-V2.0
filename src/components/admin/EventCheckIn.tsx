/**
 * Event Check-In System Component
 *
 * Admin interface for scanning and validating event tickets
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Search,
  Camera,
} from "lucide-react";
import { verifyTicketQR, type TicketQRData } from "@/lib/qrcode";
import type { Event, Ticket } from "@/types/event";

interface CheckInRecord {
  ticketId: string;
  checkInTime: Date;
  status: "checked-in" | "duplicate" | "invalid";
  attendeeName: string;
  ticketType: string;
}

interface EventCheckInProps {
  event: Event;
}

export function EventCheckIn({ event }: EventCheckInProps) {
  const [qrInput, setQrInput] = useState("");
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    message: string;
    data?: TicketQRData;
  } | null>(null);
  const [stats, setStats] = useState({
    totalCheckedIn: 0,
    totalCapacity: event.registration.maxAttendees || 0,
    recentCheckIns: 0,
  });

  useEffect(() => {
    // In production: Load check-in records from Firestore
    // For now: Use localStorage
    const saved = localStorage.getItem(`checkin-${event.id}`);
    if (saved) {
      setCheckInRecords(JSON.parse(saved));
    }
  }, [event.id]);

  useEffect(() => {
    // Update stats
    setStats({
      totalCheckedIn: checkInRecords.filter((r) => r.status === "checked-in")
        .length,
      totalCapacity: event.registration.maxAttendees || 0,
      recentCheckIns: checkInRecords.filter(
        (r) =>
          r.status === "checked-in" &&
          new Date().getTime() - r.checkInTime.getTime() < 5 * 60 * 1000, // Last 5 minutes
      ).length,
    });

    // Save to localStorage
    localStorage.setItem(`checkin-${event.id}`, JSON.stringify(checkInRecords));
  }, [checkInRecords, event.id, event.registration.maxAttendees]);

  const handleScanQR = () => {
    if (!qrInput.trim()) {
      setLastScanResult({
        success: false,
        message: "Please enter QR code data",
      });
      return;
    }

    const ticketData = verifyTicketQR(qrInput);

    if (!ticketData) {
      setLastScanResult({
        success: false,
        message: "Invalid QR code format",
      });
      return;
    }

    // Verify event ID matches
    if (ticketData.eventId !== event.id) {
      setLastScanResult({
        success: false,
        message: "This ticket is for a different event",
      });
      return;
    }

    // Check if already checked in
    const existingCheckIn = checkInRecords.find(
      (r) => r.ticketId === ticketData.ticketId,
    );

    if (existingCheckIn && existingCheckIn.status === "checked-in") {
      setLastScanResult({
        success: false,
        message: `Already checked in at ${new Date(
          existingCheckIn.checkInTime,
        ).toLocaleTimeString()}`,
        data: ticketData,
      });

      // Add duplicate record
      setCheckInRecords((prev) => [
        {
          ticketId: ticketData.ticketId,
          checkInTime: new Date(),
          status: "duplicate",
          attendeeName: "Unknown", // In production: fetch from Firestore
          ticketType: ticketData.ticketType,
        },
        ...prev,
      ]);

      return;
    }

    // Valid check-in
    setLastScanResult({
      success: true,
      message: "Check-in successful!",
      data: ticketData,
    });

    setCheckInRecords((prev) => [
      {
        ticketId: ticketData.ticketId,
        checkInTime: new Date(),
        status: "checked-in",
        attendeeName: "Unknown", // In production: fetch from Firestore
        ticketType: ticketData.ticketType,
      },
      ...prev,
    ]);

    // Clear input
    setQrInput("");

    // Clear result after 3 seconds
    setTimeout(() => setLastScanResult(null), 3000);
  };

  const handleManualSearch = (ticketId: string) => {
    // In production: Search Firestore for ticket
    console.log("Manual search for:", ticketId);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Checked In</p>
                <p className="text-3xl font-bold">
                  {stats.totalCheckedIn}
                  <span className="text-lg text-muted-foreground">
                    /{stats.totalCapacity}
                  </span>
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last 5 Minutes</p>
                <p className="text-3xl font-bold">{stats.recentCheckIns}</p>
              </div>
              <Clock className="h-8 w-8 text-electric-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    (stats.totalCheckedIn / stats.totalCapacity) * 100,
                  )}
                  %
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-hot-lime" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan Ticket QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste QR code data or scan with camera..."
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScanQR()}
              className="flex-1"
            />
            <Button onClick={handleScanQR}>
              <Search className="h-4 w-4 mr-2" />
              Verify
            </Button>
            <Button variant="outline">
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {lastScanResult && (
            <Alert
              variant={lastScanResult.success ? "default" : "destructive"}
              className={
                lastScanResult.success
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }
            >
              {lastScanResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className="font-medium">
                {lastScanResult.message}
                {lastScanResult.data && (
                  <div className="mt-2 text-sm opacity-80">
                    Ticket Type: {lastScanResult.data.ticketType}
                    <br />
                    Order: {lastScanResult.data.orderNumber}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Check-In History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-Ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checkInRecords.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No check-ins yet
              </p>
            ) : (
              checkInRecords.slice(0, 20).map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {record.status === "checked-in" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : record.status === "duplicate" ? (
                      <XCircle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{record.attendeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.ticketType} • {record.ticketId.substring(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        record.status === "checked-in"
                          ? "default"
                          : record.status === "duplicate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {record.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(record.checkInTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
