import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Flavor {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  color: string;
}

interface FlavorSelectorProps {
  flavors: Flavor[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export const FlavorSelector = ({
  flavors,
  selected,
  onSelect,
}: FlavorSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {t("waterPage.flavorSelector.label")}
      </label>
      <div className="grid grid-cols-3 gap-3">
        {flavors.map((flavor) => (
          <button
            key={flavor.id}
            onClick={() => onSelect(flavor.id)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all duration-200",
              selected === flavor.id
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-muted hover:border-muted-foreground/50 hover:bg-muted/30",
            )}
          >
            <div
              className="h-16 w-16 rounded-full bg-cover bg-center ring-2 ring-background"
              style={{
                backgroundImage: `url(${flavor.image})`,
                backgroundColor: flavor.color,
              }}
            />
            <div className="text-center">
              <p className="text-xs font-bold uppercase">{flavor.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {flavor.subtitle}
              </p>
            </div>
            {selected === flavor.id && (
              <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="h-2.5 w-2.5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
