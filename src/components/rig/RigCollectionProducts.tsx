import { Skeleton } from "@/components/ui/skeleton";
import { useRigProducts } from "@/hooks/useRigProducts";
import { RigProductCard } from "./RigProductCard";
import { ShoppingBag } from "lucide-react";

interface RigCollectionProductsProps {
  collectionId?: string;
  emptyMessage?: string;
}

export default function RigCollectionProducts({
  collectionId,
  emptyMessage = "Producten worden binnenkort toegevoegd.",
}: RigCollectionProductsProps) {
  const { products, loading, error } = useRigProducts(collectionId);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/5] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-muted-foreground">
        Kon producten niet laden: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <ShoppingBag className="h-10 w-10 opacity-30" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <RigProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
