import { useTranslation } from "react-i18next";
import { CheckCircle, Recycle, Heart, Leaf } from "lucide-react";

export const useWaterFeatures = () => {
  const { t } = useTranslation();

  return [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: t("home.features.pureMountain.title"),
      description: t("home.features.pureMountain.description"),
      stat: "100%",
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: t("home.features.sustainable.title"),
      description: t("home.features.sustainable.description"),
      stat: "50%",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t("home.features.socialImpact.title"),
      description: t("home.features.socialImpact.description"),
      stat: "1 Day",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: t("home.features.zeroWaste.title"),
      description: t("home.features.zeroWaste.description"),
      stat: "0",
    },
  ];
};
