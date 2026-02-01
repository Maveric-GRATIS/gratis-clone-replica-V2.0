/**
 * SocialShare Component
 *
 * Multi-platform social sharing with QR code generation, analytics tracking,
 * and native share API support for mobile devices.
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  QrCode,
  Download,
  Check,
} from "lucide-react";
import QRCodeLib from "qrcode";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  variant?: "default" | "outline" | "ghost" | "icon" | "dropdown" | "modal";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  trackAnalytics?: boolean;
  showQRCode?: boolean;
}

interface SharePlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  getUrl: (url: string, title: string, description?: string) => string;
}

const platforms: Record<string, SharePlatform> = {
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  twitter: {
    name: "Twitter",
    icon: Twitter,
    color: "#1DA1F2",
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    getUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    name: "WhatsApp",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
    color: "#25D366",
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(title + "\n\n" + url)}`,
  },
  telegram: {
    name: "Telegram",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: "#0088cc",
    getUrl: (url) => `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
  email: {
    name: "Email",
    icon: Mail,
    color: "#EA4335",
    getUrl: (url, title, description) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        (description || "") + "\n\n" + url,
      )}`,
  },
  reddit: {
    name: "Reddit",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    color: "#FF4500",
    getUrl: (url) => `https://reddit.com/submit?url=${encodeURIComponent(url)}`,
  },
  pinterest: {
    name: "Pinterest",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
      </svg>
    ),
    color: "#E60023",
    getUrl: (url) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`,
  },
};

export function SocialShare({
  url,
  title,
  description,
  variant = "dropdown",
  size = "default",
  className,
  trackAnalytics = true,
  showQRCode = true,
}: SocialShareProps) {
  const { toast } = useToast();
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);

  useEffect(() => {
    // Check if native share API is available (mobile devices)
    setSupportsNativeShare(
      typeof navigator !== "undefined" && !!navigator.share,
    );
  }, []);

  const trackShare = async (platform: string) => {
    if (!trackAnalytics) return;

    try {
      // Track share event via analytics
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "share",
          platform,
          url,
          title,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  };

  const handleShare = (platformKey: string) => {
    const platform = platforms[platformKey];
    if (!platform) return;

    const shareUrl = platform.getUrl(url, title, description);

    // Open in new window
    if (platformKey !== "email") {
      window.open(shareUrl, "_blank", "width=600,height=600");
    } else {
      window.location.href = shareUrl;
    }

    trackShare(platformKey);

    toast({
      title: "Opening share dialog",
      description: `Sharing to ${platform.name}`,
    });
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title,
        text: description,
        url,
      });

      trackShare("native");

      toast({
        title: "Shared successfully",
        description: "Content shared via native share dialog",
      });
    } catch (error) {
      // User cancelled share
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      trackShare("clipboard");

      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = async () => {
    try {
      const qrDataURL = await QRCodeLib.toDataURL(url, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeData(qrDataURL);
      setShowQRDialog(true);
      trackShare("qr_code");
    } catch (error) {
      console.error("QR generation failed:", error);
      toast({
        title: "QR Code generation failed",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeData;
    link.download = `qr-${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code downloaded",
      description: "QR code saved to your device",
    });
  };

  // Icon variant - single share button
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={supportsNativeShare ? handleNativeShare : copyToClipboard}
        className={className}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    );
  }

  // Modal variant - full featured modal
  if (variant === "modal") {
    return (
      <>
        <Button
          variant="outline"
          size={size}
          onClick={() => setShowQRDialog(true)}
          className={className}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share this content</DialogTitle>
              <DialogDescription>{title}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Social platforms grid */}
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(platforms).map(([key, platform]) => {
                  const Icon = platform.icon;
                  return (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(key)}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{platform.name}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Copy link */}
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={url}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* QR Code section */}
              {showQRCode && qrCodeData && (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <img
                      src={qrCodeData}
                      alt="QR Code"
                      className="border rounded-lg"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Dropdown variant (default)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant as any} size={size} className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {supportsNativeShare && (
            <>
              <DropdownMenuItem onClick={handleNativeShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share via...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {Object.entries(platforms).map(([key, platform]) => {
            const Icon = platform.icon;
            return (
              <DropdownMenuItem key={key} onClick={() => handleShare(key)}>
                <Icon className="mr-2 h-4 w-4" />
                {platform.name}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </DropdownMenuItem>

          {showQRCode && (
            <DropdownMenuItem onClick={generateQRCode}>
              <QrCode className="mr-2 h-4 w-4" />
              QR Code
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scan this code to share: {title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {qrCodeData && (
              <>
                <div className="flex justify-center">
                  <img
                    src={qrCodeData}
                    alt="QR Code"
                    className="border rounded-lg"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={downloadQRCode}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
