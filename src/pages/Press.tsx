import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Mail,
  Phone,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  ExternalLink,
  Newspaper,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function Press() {
  const { t } = useTranslation();
  const [downloadingAsset, setDownloadingAsset] = useState<string | null>(null);

  const handleDownload = (assetName: string, url: string) => {
    setDownloadingAsset(assetName);
    // Simulate download
    setTimeout(() => {
      toast.success(`${assetName} downloaded successfully`);
      setDownloadingAsset(null);
    }, 1500);
  };

  const pressReleases = [
    {
      date: "2026-01-15",
      title:
        "GRATIS Foundation Launches: Free Water Bottles Funded by Advertising to Support NGOs",
      excerpt:
        "Amsterdam-based charity GRATIS announces revolutionary model combining free premium water distribution with 100% transparent NGO funding.",
      category: "Launch",
      url: "/press/releases/2026-01-15-launch",
    },
    {
      date: "2025-12-20",
      title:
        "GRATIS Pre-Launch: 10.000 Bottles Committed for February 2026 Amsterdam Distribution",
      excerpt:
        "Pre-registration opens for TRIBE membership program, with founding members receiving lifetime benefits.",
      category: "Announcement",
      url: "/press/releases/2025-12-20-prelaunch",
    },
    {
      date: "2025-11-30",
      title:
        "GRATIS Secures Partnerships with 25 Verified NGOs Across Water, Arts, and Education",
      excerpt:
        "Foundation announces verified partner network spanning three impact categories, ensuring 100% fund transparency.",
      category: "Partnership",
      url: "/press/releases/2025-11-30-partnerships",
    },
  ];

  const mediaAssets = {
    logos: [
      {
        name: "Primary Logo (PNG)",
        description: "Full color, transparent background",
        size: "2.4 MB",
        format: "PNG",
        url: "/media/logos/gratis-logo-primary.png",
      },
      {
        name: "Primary Logo (SVG)",
        description: "Full color, vector format",
        size: "156 KB",
        format: "SVG",
        url: "/media/logos/gratis-logo-primary.svg",
      },
      {
        name: "Logo Mark Only",
        description: "Icon/symbol only, transparent",
        size: "1.8 MB",
        format: "PNG",
        url: "/media/logos/gratis-logomark.png",
      },
      {
        name: "White Logo",
        description: "For dark backgrounds",
        size: "2.1 MB",
        format: "PNG",
        url: "/media/logos/gratis-logo-white.png",
      },
    ],
    photos: [
      {
        name: "Product Photography Pack",
        description: "High-res bottle shots, lifestyle images",
        size: "45.2 MB",
        format: "ZIP",
        url: "/media/photos/product-pack.zip",
      },
      {
        name: "Team & Office Photos",
        description: "Founder and team portraits",
        size: "32.8 MB",
        format: "ZIP",
        url: "/media/photos/team-pack.zip",
      },
      {
        name: "Impact Photography",
        description: "NGO partner projects and beneficiaries",
        size: "78.5 MB",
        format: "ZIP",
        url: "/media/photos/impact-pack.zip",
      },
    ],
    brandGuidelines: [
      {
        name: "Brand Guidelines PDF",
        description: "Complete visual identity guide",
        size: "8.7 MB",
        format: "PDF",
        url: "/media/brand/gratis-brand-guidelines.pdf",
      },
      {
        name: "Color Palette",
        description: "RGB, CMYK, HEX values",
        size: "124 KB",
        format: "PDF",
        url: "/media/brand/gratis-color-palette.pdf",
      },
      {
        name: "Typography Guide",
        description: "Font usage and specifications",
        size: "892 KB",
        format: "PDF",
        url: "/media/brand/gratis-typography.pdf",
      },
    ],
    videos: [
      {
        name: "Brand Story (2:30)",
        description: "Foundation mission and model",
        size: "156 MB",
        format: "MP4",
        url: "/media/videos/brand-story.mp4",
      },
      {
        name: "Product B-Roll",
        description: "Bottle shots, pouring, lifestyle",
        size: "298 MB",
        format: "MP4",
        url: "/media/videos/product-broll.mp4",
      },
    ],
  };

  const factSheet = {
    founded: "November 2025",
    headquarters: "Amsterdam, Netherlands",
    founders: "Sarah van der Berg (CEO), Mark Janssen (COO)",
    model:
      "Free premium water bottles funded by advertising, 100% of net profits to NGOs",
    launchDate: "February 14, 2026 (Amsterdam), March 15, 2026 (USA)",
    impactCategories:
      "Water Access (40%), Arts Programs (30%), Education (30%)",
    legalStatus: "Dutch Stichting (Foundation) with ANBI tax-exempt status",
    website: "https://gratis.ngo",
    contact: "press@gratis.ngo",
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Press & Media Kit — GRATIS</title>
        <meta
          name="description"
          content="GRATIS Foundation press releases, media kit, brand assets, and press contact information for journalists and media professionals."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="mb-4">Press & Media</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Press & Media Kit
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Resources for journalists, bloggers, and media professionals
            covering GRATIS Foundation. Download our media kit, read press
            releases, and get in touch with our press team.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() =>
                handleDownload(
                  "Complete Media Kit",
                  "/media/gratis-media-kit.zip",
                )
              }
            >
              <Download className="mr-2 h-5 w-5" />
              Download Media Kit
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:press@gratis.ngo">
                <Mail className="mr-2 h-5 w-5" />
                Press Contact
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="container py-12 max-w-6xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Quick Facts</CardTitle>
                <CardDescription>
                  Essential information about GRATIS Foundation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(factSheet).map(([key, value]) => (
                <div key={key} className="border-l-2 border-primary pl-4">
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="font-semibold mt-1">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Press Releases */}
      <section className="container py-12 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Press Releases</h2>
          </div>
          <p className="text-muted-foreground">
            Latest news and announcements from GRATIS Foundation
          </p>
        </div>

        <div className="space-y-6">
          {pressReleases.map((release, index) => (
            <Card
              key={index}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary">{release.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(release.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {release.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {release.excerpt}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={release.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <a href="/press/archive">
              View All Press Releases
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Media Assets */}
      <section className="container py-12 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Media Assets</h2>
          </div>
          <p className="text-muted-foreground">
            High-resolution logos, photos, videos, and brand guidelines
          </p>
        </div>

        <Tabs defaultValue="logos" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="logos">Logos</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="brand">Brand Guidelines</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="logos" className="space-y-4">
            {mediaAssets.logos.map((asset, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {asset.format} • {asset.size}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(asset.name, asset.url)}
                      disabled={downloadingAsset === asset.name}
                    >
                      {downloadingAsset === asset.name ? (
                        "Downloading..."
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            {mediaAssets.photos.map((asset, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {asset.format} • {asset.size}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(asset.name, asset.url)}
                      disabled={downloadingAsset === asset.name}
                    >
                      {downloadingAsset === asset.name ? (
                        "Downloading..."
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="brand" className="space-y-4">
            {mediaAssets.brandGuidelines.map((asset, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-[hsl(var(--brand-blue))]" />
                      </div>
                      <div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {asset.format} • {asset.size}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(asset.name, asset.url)}
                      disabled={downloadingAsset === asset.name}
                    >
                      {downloadingAsset === asset.name ? (
                        "Downloading..."
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {mediaAssets.videos.map((asset, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {asset.format} • {asset.size}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(asset.name, asset.url)}
                      disabled={downloadingAsset === asset.name}
                    >
                      {downloadingAsset === asset.name ? (
                        "Downloading..."
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </section>

      {/* Awards & Recognition */}
      <section className="container py-12 max-w-6xl">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Awards & Recognition</CardTitle>
                <CardDescription>
                  Achievements and notable mentions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">
                    Top 3% Financial Transparency (2026)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recognized by CharityWatch for exceptional financial
                    accountability
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-accent mt-1" />
                <div>
                  <div className="font-semibold">
                    ANBI Tax-Exempt Status (2025)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Dutch government-recognized public benefit organization
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-[hsl(var(--brand-blue))] mt-1" />
                <div>
                  <div className="font-semibold">B Corp Pending (2026)</div>
                  <div className="text-sm text-muted-foreground">
                    Application submitted for B Corporation certification
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Press Contact */}
      <section className="container py-12 max-w-6xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Press Contact</CardTitle>
                <CardDescription>
                  For media inquiries and interview requests
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Media Relations</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <a
                        href="mailto:press@gratis.ngo"
                        className="font-semibold text-primary hover:text-primary/80"
                      >
                        press@gratis.ngo
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <a
                        href="tel:+31201234567"
                        className="font-semibold text-primary hover:text-primary/80"
                      >
                        +31 20 123 4567
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Response Time</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• Media inquiries: Within 4 hours (business days)</div>
                  <div>• Interview requests: Within 24 hours</div>
                  <div>• Fact-checking: Within 2 hours</div>
                  <div>• Embargo respect: Guaranteed for accredited media</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">
                  For urgent press inquiries
                </strong>{" "}
                outside business hours, please email press@gratis.ngo with
                "URGENT" in the subject line. Our 24/7 monitoring team will
                respond within 1 hour.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Social Media */}
      <section className="container py-12 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Follow GRATIS</CardTitle>
            <CardDescription>
              Stay updated on our latest news and impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <a
                  href="https://instagram.com/gratis.ngo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://linkedin.com/company/gratis-foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://twitter.com/gratisngo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter/X
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://youtube.com/@gratisngo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
