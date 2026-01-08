import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SizeGuide from './SizeGuide';

interface ProductTabsProps {
  description?: string;
  specifications?: Record<string, string>;
  materialSpecs?: string;
  careInstructions?: string;
  category?: string;
}

export default function ProductTabs({ description, specifications, materialSpecs, careInstructions, category }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-base leading-relaxed">{description || 'No description available.'}</p>
        </div>
      </TabsContent>

      <TabsContent value="materials" className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-3">Material Composition</h3>
            <p className="text-muted-foreground leading-relaxed">
              {materialSpecs || 'Material specifications not available.'}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Care Instructions</h3>
            <p className="text-muted-foreground leading-relaxed">
              {careInstructions || 'Care instructions not available.'}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Sustainability</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Eco-friendly water-based dyes</li>
              <li>✓ Recycled packaging materials</li>
              <li>✓ Ethical manufacturing practices</li>
              <li>✓ Carbon-neutral shipping options available</li>
            </ul>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="size-guide" className="space-y-4">
        <SizeGuide category={category} />
      </TabsContent>
      
      <TabsContent value="specs" className="space-y-4">
        {specifications && Object.keys(specifications).length > 0 ? (
          <dl className="space-y-2">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b">
                <dt className="font-medium">{key}</dt>
                <dd className="text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">Additional product specifications.</p>
            <dl className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium">Brand</dt>
                <dd className="text-muted-foreground">GRATIS</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium">Origin</dt>
                <dd className="text-muted-foreground">Designed in Amsterdam</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium">Fit</dt>
                <dd className="text-muted-foreground">True to size, unisex</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium">Style</dt>
                <dd className="text-muted-foreground">Contemporary Streetwear</dd>
              </div>
            </dl>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
