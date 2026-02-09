import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import {
  Shield,
  FileCheck,
  Award,
  Building2,
  Scale,
  Eye,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function Compliance() {
  return (
    <>
      <SEO
        title="Compliance & Licenses — GRATIS TRIBE"
        description="Operational excellence meets charitable purpose. GRATIS adheres to the highest standards in NGO operations, product quality, and financial transparency."
        canonical="https://gratis.com/tribe/compliance"
      />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="container relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              HELD TO THE HIGHEST STANDARDS
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              A charitable purpose deserves operational excellence. GRATIS
              operates with the same rigor as commercial distributors, but with
              a mission that serves everyone.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container max-w-6xl mx-auto px-4 py-12 space-y-16">
          {/* Opening Statement */}
          <section className="prose prose-lg max-w-none">
            <p className="text-lg text-foreground/80 leading-relaxed">
              GRATIS, while humanitarian in nature, adheres to the same
              standards as any commercial distributor of beverages and consumer
              goods. Our commitment to compliance ensures that every bottle of
              free water we distribute meets the highest quality and safety
              standards.
            </p>
          </section>

          {/* Dutch NGO Registration */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Dutch NGO Registration & Legal Status
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  KvK Registration
                </h3>
                <p className="text-foreground/70">
                  Registered with Kamer van Koophandel (Dutch Chamber of
                  Commerce) as a non-profit foundation (Stichting)
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  ANBI Status
                </h3>
                <p className="text-foreground/70">
                  Algemeen Nut Beogende Instelling (General Benefit
                  Organization) tax-exempt status granted by Dutch Tax Authority
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Fiscal Identification
                </h3>
                <p className="text-foreground/70">
                  EIN/RSIN Number: 95-1831116
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Articles of Association
                </h3>
                <p className="text-foreground/70">
                  Legally incorporated as a Stichting under Dutch charitable law
                  with clear governance structure
                </p>
              </div>
            </div>
          </section>

          {/* Operational Capabilities */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Operational Capabilities
              </h2>
            </div>

            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-8">
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                GRATIS operates with infrastructure that matches
                commercial-grade distribution standards. Our Amsterdam-based
                operations center serves as the hub for free water distribution
                across the Netherlands and major European cities.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    5.000+
                  </div>
                  <div className="text-sm text-foreground/70">
                    Distribution Points
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    1M+
                  </div>
                  <div className="text-sm text-foreground/70">
                    Bottles Annually
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    10+
                  </div>
                  <div className="text-sm text-foreground/70">
                    Countries Served
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Amsterdam Distribution Center
                    </h4>
                    <p className="text-foreground/70 text-sm">
                      Temperature-controlled warehouse with capacity for bulk
                      water storage and beverage distribution
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Big 5 Train Stations
                    </h4>
                    <p className="text-foreground/70 text-sm">
                      Strategic distribution at Amsterdam Centraal, Rotterdam
                      Centraal, Utrecht Centraal, Den Haag Centraal, and
                      Eindhoven Centraal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      European Expansion
                    </h4>
                    <p className="text-foreground/70 text-sm">
                      Distribution points in Berlin, Paris, Brussels, London,
                      and other major cities
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Cold Chain Capability
                    </h4>
                    <p className="text-foreground/70 text-sm">
                      Temperature-controlled storage for premium beverages
                      requiring refrigeration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product Quality Standards */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <FileCheck className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Product Quality & Safety Standards
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Water Quality Certifications
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>HACCP Certified:</strong> Hazard Analysis Critical
                      Control Points compliance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>ISO 22000:</strong> Food Safety Management System
                      certification
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>EU Compliance:</strong> Meets all European Union
                      food safety regulations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>NVWA Approved:</strong> Dutch Food & Consumer
                      Product Safety Authority oversight
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Production Standards
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>Natural Ingredients:</strong> All beverages use
                      verified natural ingredients
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>Quality Control:</strong> Rigorous batch testing
                      and documentation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>Supplier Vetting:</strong> Licensed suppliers only
                      with full traceability
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">
                      <strong>Secure Supply Chain:</strong> No counterfeits,
                      verified production facilities
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Compliance Framework */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Compliance Framework
              </h2>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                GRATIS sources products exclusively from licensed manufacturers
                and wholesale distributors, safeguarding against counterfeits
                and contraband, and ensuring the authenticity of beverages
                safely delivered through a secure supply chain.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    Regulatory Oversight
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Scale className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Dutch Ministry of Health supervision
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Scale className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70">
                        NVWA regular inspections and approvals
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Scale className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70">
                        EU food safety compliance verification
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Scale className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Municipal health department approvals
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    Standard Operating Procedures
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    GRATIS has implemented an extensive framework of standard
                    operating procedures to govern routine processes and
                    documentation:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70 text-sm">
                        Product sourcing and verification protocols
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70 text-sm">
                        Storage and handling procedures
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70 text-sm">
                        Distribution tracking and documentation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground/70 text-sm">
                        Quality assurance audits
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Transparency */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Eye className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Financial Transparency & Auditing
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Independent Audits
                </h3>
                <p className="text-foreground/70 text-sm">
                  Annual financial audits by certified Dutch accountants ensure
                  complete transparency and accountability
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Public Reporting
                </h3>
                <p className="text-foreground/70 text-sm">
                  Annual reports and financial statements publicly available for
                  full transparency
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  100% Ad Revenue
                </h3>
                <p className="text-foreground/70 text-sm">
                  Real-time dashboard tracking verifies 100% of advertising
                  revenue goes to NGO partners
                </p>
              </div>
            </div>
          </section>

          {/* NGO Partner Vetting */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                NGO Partner Vetting Process
              </h2>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-foreground/80 mb-6">
                By requiring recipients of donations to maintain proper
                registration and compliance, GRATIS supports the safe and
                responsible distribution of funds to partner organizations.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Verification Requirements
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Valid NGO registration and tax-exempt status
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Proven track record of charitable work
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Financial transparency and annual reporting
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Ongoing Compliance
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Annual compliance verification checks
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Impact reporting and fund usage documentation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">
                        Regular audits of partner operations
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Licenses & Certifications */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Licenses & Certifications
              </h2>
            </div>

            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Legal Registration
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Dutch NGO Registration (Stichting)</li>
                    <li>• ANBI Tax-Exempt Status</li>
                    <li>• KvK Business Registration</li>
                    <li>• EIN: 95-1831116</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Safety & Quality
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• NVWA Food Safety Approval</li>
                    <li>• HACCP Certification</li>
                    <li>• ISO 22000 Certification</li>
                    <li>• EU Food Distribution Compliance</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Operational Permits
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Warehouse Facility Licenses</li>
                    <li>• Distribution Permits</li>
                    <li>• Local Health Department Approvals</li>
                    <li>• Insurance Certifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Memberships */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Memberships & Partnerships
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-foreground/80 font-medium">Partos</p>
                <p className="text-xs text-foreground/60 mt-1">
                  Dutch Association for Development
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-foreground/80 font-medium">
                  CBF Certification
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  Central Bureau on Fundraising
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-foreground/80 font-medium">
                  Dutch Food Bank Network
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  Partnership Member
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-foreground/80 font-medium">
                  European NGO Confederation
                </p>
                <p className="text-xs text-foreground/60 mt-1">Active Member</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-foreground/80 font-medium">
                  Sustainable Packaging Alliance
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  Sustainability Partner
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-foreground/80 font-medium">
                  Fair Trade Certified
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  Ethical Sourcing
                </p>
              </div>
            </div>
          </section>

          {/* Culture of Compliance */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              A Culture of Compliance
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-8">
              GRATIS's culture of compliance drives the level of operational
              excellence needed to carry out our mission. It's the foundation of
              our work to improve lives through free access to clean water and
              beverages, while funding critical NGO work through advertising
              revenue.
            </p>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We welcome regular audits to ensure compliance with state,
              federal, and international regulatory standards. Our commitment to
              transparency and accountability sets the standard for modern
              charitable organizations.
            </p>
          </section>

          {/* CTA Section */}
          <section className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Learn More About GRATIS
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tribe/standards"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Our Standards
              </Link>
              <Link
                to="/tribe/responsibility"
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                Social Responsibility
              </Link>
              <Link
                to="/tribe"
                className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                About GRATIS TRIBE
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
