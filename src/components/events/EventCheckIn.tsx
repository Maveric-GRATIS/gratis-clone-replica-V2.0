/**
 * EventCheckIn Component
 *
 * QR code scanner for event check-in (organizer/admin view)
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  CheckCircle2,
  XCircle,
  Search,
  UserCheck,
  Users,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { verifyTicketQR, type TicketQRData } from "@/lib/qrcode";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import type { EventRegistration } from "@/types/event";

interface EventCheckInProps {
  eventId: string;
  onCheckIn?: (ticketId: string) => void;
}

interface CheckInResult {
  success: boolean;
  message: string;
  registration?: EventRegistration;
  timestamp: Date;
}

export function EventCheckIn({ eventId, onCheckIn }: EventCheckInProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualTicketId, setManualTicketId] = useState("");
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const [stats, setStats] = useState({
    totalAttendees: 0,
    checkedIn: 0,
    pending: 0,
  });
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInResult[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadStats();
    return () => {
      stopCamera();
    };
  }, [eventId]);

  const loadStats = async () => {
    try {
      // In production: Load from Firestore
      // For now, mock data
      setStats({
        totalAttendees: 234,
        checkedIn: 156,
        pending: 78,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        scanQRCode();
      }
    } catch (error) {
      console.error("Failed to start camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // In production: Use a QR code scanning library like jsQR
    // For now, we'll use manual input

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const handleCheckIn = async (qrData: string | TicketQRData) => {
    try {
      // Parse QR data
      const ticketData =
        typeof qrData === "string" ? verifyTicketQR(qrData) : qrData;

      if (!ticketData) {
        setLastResult({
          success: false,
          message: "Invalid QR code",
          timestamp: new Date(),
        });
        return;
      }

      // Verify event ID matches
      if (ticketData.eventId !== eventId) {
        setLastResult({
          success: false,
          message: "This ticket is for a different event",
          timestamp: new Date(),
        });
        return;
      }

      // Check in ticket
      const ticketRef = doc(db, "event_registrations", ticketData.ticketId);
      const ticketSnap = await getDoc(ticketRef);

      if (!ticketSnap.exists()) {
        setLastResult({
          success: false,
          message: "Ticket not found",
          timestamp: new Date(),
        });
        return;
      }

      const registration = ticketSnap.data() as EventRegistration;

      // Check if already checked in
      if (registration.status === "checked_in") {
        setLastResult({
          success: false,
          message: "Ticket already checked in",
          registration,
          timestamp: new Date(),
        });
        return;
      }

      // Check if cancelled
      if (registration.status === "cancelled") {
        setLastResult({
          success: false,
          message: "Ticket has been cancelled",
          registration,
          timestamp: new Date(),
        });
        return;
      }

      // Update ticket status
      await updateDoc(ticketRef, {
        status: "checked_in",
        checkedInAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Success
      const result: CheckInResult = {
        success: true,
        message: `Welcome, ${registration.attendee.firstName} ${registration.attendee.lastName}!`,
        registration,
        timestamp: new Date(),
      };

      setLastResult(result);
      setRecentCheckIns((prev) => [result, ...prev.slice(0, 9)]);
      setStats((prev) => ({
        ...prev,
        checkedIn: prev.checkedIn + 1,
        pending: prev.pending - 1,
      }));

      if (onCheckIn) {
        onCheckIn(ticketData.ticketId);
      }

      // Play success sound
      playSuccessSound();
    } catch (error) {
      console.error("Check-in failed:", error);
      setLastResult({
        success: false,
        message: "Check-in failed. Please try again.",
        timestamp: new Date(),
      });
    }
  };

  const handleManualCheckIn = async () => {
    if (!manualTicketId.trim()) return;
    await handleCheckIn({ ticketId: manualTicketId.trim() } as TicketQRData);
    setManualTicketId("");
  };

  const playSuccessSound = () => {
    // Play a success sound
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKzo66lXFApFn+DyvmwhBTGH0fPTgjMGHm7A7+OZURAOVKzo66lXFApFn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKzo66lXFApFn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKzo66lXFApFn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKzo66lXFApFn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKzo66lXFApFn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKzo66lXFApFn+DyvmwhBTGH0fPTgjMGHm7A7+OZ",
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
                <p className="text-3xl font-bold">{stats.totalAttendees}</p>
              </div>
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Checked In</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.checkedIn}
                </p>
              </div>
              <UserCheck className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check-in Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in Attendees</CardTitle>
          <CardDescription>
            Scan QR code or enter ticket ID manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 border-4 border-primary/50 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-primary rounded-lg" />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Camera inactive</p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <Button
                onClick={stopCamera}
                variant="destructive"
                className="flex-1"
              >
                Stop Camera
              </Button>
            )}
          </div>

          {/* Manual Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter Ticket ID manually..."
              value={manualTicketId}
              onChange={(e) => setManualTicketId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleManualCheckIn()}
            />
            <Button onClick={handleManualCheckIn}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Last Result */}
          <AnimatePresence mode="wait">
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert
                  variant={lastResult.success ? "default" : "destructive"}
                  className={
                    lastResult.success ? "border-green-500 bg-green-50" : ""
                  }
                >
                  {lastResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <div className="font-semibold">{lastResult.message}</div>
                    {lastResult.registration && (
                      <div className="text-sm mt-1">
                        {lastResult.registration.attendee.firstName}{" "}
                        {lastResult.registration.attendee.lastName} •{" "}
                        {lastResult.registration.ticketTierName}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      {recentCheckIns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentCheckIns.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">
                        {result.registration
                          ? `${result.registration.attendee.firstName} ${result.registration.attendee.lastName}`
                          : "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.registration?.ticketTierName}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
