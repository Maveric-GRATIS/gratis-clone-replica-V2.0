import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Truck,
  Heart,
  Leaf,
  Shield,
  Award,
  Package,
  Clock,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function ProductTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="details" className="text-base">
          <Droplets className="mr-2 h-4 w-4" />
          {t("waterPage.tabs.details")}
        </TabsTrigger>
        <TabsTrigger value="shipping" className="text-base">
          <Truck className="mr-2 h-4 w-4" />
          {t("waterPage.tabs.shipping")}
        </TabsTrigger>
        <TabsTrigger value="impact" className="text-base">
          <Heart className="mr-2 h-4 w-4" />
          {t("waterPage.tabs.impact")}
        </TabsTrigger>
      </TabsList>

      {/* Details Tab */}
      <TabsContent value="details" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">
            {t("waterPage.tabs.detailsContent.title")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("waterPage.tabs.detailsContent.description")}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Specifications */}
            <div>
              <h4 className="font-bold text-lg mb-3 flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                {t("waterPage.tabs.detailsContent.specifications")}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.spec1")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.spec2")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.spec3")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.spec4")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.spec5")}</span>
                </li>
              </ul>
            </div>

            {/* Sustainability */}
            <div>
              <h4 className="font-bold text-lg mb-3 flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-green-600" />
                {t("waterPage.tabs.detailsContent.sustainability")}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.sust1")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.sust2")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.sust3")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("waterPage.tabs.detailsContent.sust4")}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quality Badges */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                {t("waterPage.tabs.detailsContent.badge1")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Leaf className="mr-1 h-3 w-3" />
                {t("waterPage.tabs.detailsContent.badge2")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Award className="mr-1 h-3 w-3" />
                {t("waterPage.tabs.detailsContent.badge3")}
              </Badge>
            </div>
          </div>
        </Card>
      </TabsContent>

      {/* Shipping Tab */}
      <TabsContent value="shipping" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">
            {t("waterPage.tabs.shippingContent.title")}
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Delivery Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">
                    {t("waterPage.tabs.shippingContent.deliveryTime")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("waterPage.tabs.shippingContent.deliveryTimeDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">
                    {t("waterPage.tabs.shippingContent.packaging")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("waterPage.tabs.shippingContent.packagingDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">
                    {t("waterPage.tabs.shippingContent.tracking")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("waterPage.tabs.shippingContent.trackingDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Zones */}
            <div>
              <h4 className="font-bold text-lg mb-3">
                {t("waterPage.tabs.shippingContent.zones")}
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      {t("waterPage.tabs.shippingContent.zone1")}
                    </span>
                    <Badge variant="secondary">
                      {t("waterPage.tabs.shippingContent.free")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("waterPage.tabs.shippingContent.zone1Desc")}
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      {t("waterPage.tabs.shippingContent.zone2")}
                    </span>
                    <Badge variant="secondary">€4.99</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("waterPage.tabs.shippingContent.zone2Desc")}
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      {t("waterPage.tabs.shippingContent.zone3")}
                    </span>
                    <Badge variant="secondary">€9.99</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("waterPage.tabs.shippingContent.zone3Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Returns Policy */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-bold text-lg mb-2">
              {t("waterPage.tabs.shippingContent.returns")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("waterPage.tabs.shippingContent.returnsDesc")}
            </p>
          </div>
        </Card>
      </TabsContent>

      {/* Impact Tab */}
      <TabsContent value="impact" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">
            {t("waterPage.tabs.impactContent.title")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("waterPage.tabs.impactContent.description")}
          </p>

          {/* Impact Breakdown */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-3xl font-black text-blue-600 mb-2">40%</div>
              <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-bold mb-1">
                {t("waterPage.tabs.impactContent.water")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("waterPage.tabs.impactContent.waterDesc")}
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-3xl font-black text-purple-600 mb-2">
                30%
              </div>
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-bold mb-1">
                {t("waterPage.tabs.impactContent.arts")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("waterPage.tabs.impactContent.artsDesc")}
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-3xl font-black text-green-600 mb-2">30%</div>
              <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-bold mb-1">
                {t("waterPage.tabs.impactContent.education")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("waterPage.tabs.impactContent.educationDesc")}
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">
              {t("waterPage.tabs.impactContent.howItWorks")}
            </h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">
                    {t("waterPage.tabs.impactContent.step1")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("waterPage.tabs.impactContent.step1Desc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">
                    {t("waterPage.tabs.impactContent.step2")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("waterPage.tabs.impactContent.step2Desc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">
                    {t("waterPage.tabs.impactContent.step3")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("waterPage.tabs.impactContent.step3Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transparency Note */}
          <div className="mt-6 pt-6 border-t">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-bold">
                  {t("waterPage.tabs.impactContent.transparency")}
                </span>{" "}
                {t("waterPage.tabs.impactContent.transparencyDesc")}
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
