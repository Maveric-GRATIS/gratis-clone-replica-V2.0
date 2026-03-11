import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Currency = "EUR" | "USD";

// Fixed exchange rate: 1 EUR = 1.08 USD
const USD_RATE = 1.08;

interface CurrencyContextValue {
  currency: Currency;
  formatPrice: (amountInEur: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "EUR",
  formatPrice: (amount) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount),
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR");

  useEffect(() => {
    // Check cache first so we don't call the API on every page load
    const cached = sessionStorage.getItem("gratis_currency");
    if (cached === "USD" || cached === "EUR") {
      setCurrency(cached);
      return;
    }

    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) })
      .then((r) => r.json())
      .then((data) => {
        const detected: Currency = data?.country_code === "US" ? "USD" : "EUR";
        setCurrency(detected);
        sessionStorage.setItem("gratis_currency", detected);
      })
      .catch(() => {
        // Default to EUR on any error
      });
  }, []);

  const formatPrice = (amountInEur: number): string => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amountInEur * USD_RATE);
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountInEur);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
