import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface SizeGuideProps {
  category?: string;
}

export default function SizeGuide({ category }: SizeGuideProps) {
  // Determine which size chart to show based on category
  const isTopsOrHoodies = category?.includes('TOPS') || category?.includes('HOODIES') || category?.includes('TRACKSUITS');
  const isBottoms = category?.includes('BOTTOMS');
  const isSwimwear = category?.includes('SWIMWEAR');
  const isHeadwear = category?.includes('CAPS') || category?.includes('BEANIES');

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All measurements are in centimeters. For the best fit, measure yourself and compare with the chart below.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="apparel" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apparel">Tops & Hoodies</TabsTrigger>
          <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
          <TabsTrigger value="swimwear">Swimwear</TabsTrigger>
        </TabsList>

        {/* Tops & Hoodies Size Chart */}
        <TabsContent value="apparel" className="space-y-4">
          <h3 className="font-semibold text-lg">Tops, Tanks & Hoodies</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Chest (cm)</TableHead>
                  <TableHead>Length (cm)</TableHead>
                  <TableHead>Shoulder (cm)</TableHead>
                  <TableHead>Sleeve (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">XS</TableCell>
                  <TableCell>86-91</TableCell>
                  <TableCell>66</TableCell>
                  <TableCell>41</TableCell>
                  <TableCell>60</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">S</TableCell>
                  <TableCell>91-97</TableCell>
                  <TableCell>69</TableCell>
                  <TableCell>44</TableCell>
                  <TableCell>61</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">M</TableCell>
                  <TableCell>97-102</TableCell>
                  <TableCell>72</TableCell>
                  <TableCell>47</TableCell>
                  <TableCell>62</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">L</TableCell>
                  <TableCell>102-107</TableCell>
                  <TableCell>75</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>63</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">XL</TableCell>
                  <TableCell>107-112</TableCell>
                  <TableCell>78</TableCell>
                  <TableCell>53</TableCell>
                  <TableCell>64</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">XXL</TableCell>
                  <TableCell>112-117</TableCell>
                  <TableCell>81</TableCell>
                  <TableCell>56</TableCell>
                  <TableCell>65</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>How to measure:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Chest: Measure around the fullest part of your chest</li>
              <li>Length: Measure from high point shoulder to hem</li>
              <li>Shoulder: Measure from shoulder seam to shoulder seam</li>
              <li>Sleeve: Measure from center back neck to cuff</li>
            </ul>
          </div>
        </TabsContent>

        {/* Bottoms Size Chart */}
        <TabsContent value="bottoms" className="space-y-4">
          <h3 className="font-semibold text-lg">Joggers & Track Pants</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Waist (cm)</TableHead>
                  <TableHead>Hip (cm)</TableHead>
                  <TableHead>Inseam (cm)</TableHead>
                  <TableHead>Rise (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">XS</TableCell>
                  <TableCell>66-71</TableCell>
                  <TableCell>86-91</TableCell>
                  <TableCell>76</TableCell>
                  <TableCell>25</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">S</TableCell>
                  <TableCell>71-76</TableCell>
                  <TableCell>91-97</TableCell>
                  <TableCell>78</TableCell>
                  <TableCell>26</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">M</TableCell>
                  <TableCell>76-81</TableCell>
                  <TableCell>97-102</TableCell>
                  <TableCell>80</TableCell>
                  <TableCell>27</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">L</TableCell>
                  <TableCell>81-86</TableCell>
                  <TableCell>102-107</TableCell>
                  <TableCell>82</TableCell>
                  <TableCell>28</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">XL</TableCell>
                  <TableCell>86-91</TableCell>
                  <TableCell>107-112</TableCell>
                  <TableCell>84</TableCell>
                  <TableCell>29</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">XXL</TableCell>
                  <TableCell>91-97</TableCell>
                  <TableCell>112-117</TableCell>
                  <TableCell>86</TableCell>
                  <TableCell>30</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>How to measure:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Waist: Measure around natural waistline</li>
              <li>Hip: Measure around fullest part of hips</li>
              <li>Inseam: Measure from crotch to ankle</li>
              <li>Rise: Measure from crotch to top of waistband</li>
            </ul>
          </div>
        </TabsContent>

        {/* Swimwear Size Chart */}
        <TabsContent value="swimwear" className="space-y-4">
          <h3 className="font-semibold text-lg">Bodysuits & Bike Shorts</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Bust (cm)</TableHead>
                  <TableHead>Waist (cm)</TableHead>
                  <TableHead>Hip (cm)</TableHead>
                  <TableHead>Torso (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">XS</TableCell>
                  <TableCell>81-84</TableCell>
                  <TableCell>61-64</TableCell>
                  <TableCell>86-89</TableCell>
                  <TableCell>58-61</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">S</TableCell>
                  <TableCell>84-89</TableCell>
                  <TableCell>64-69</TableCell>
                  <TableCell>89-94</TableCell>
                  <TableCell>61-64</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">M</TableCell>
                  <TableCell>89-94</TableCell>
                  <TableCell>69-74</TableCell>
                  <TableCell>94-99</TableCell>
                  <TableCell>64-66</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">L</TableCell>
                  <TableCell>94-99</TableCell>
                  <TableCell>74-79</TableCell>
                  <TableCell>99-104</TableCell>
                  <TableCell>66-69</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">XL</TableCell>
                  <TableCell>99-104</TableCell>
                  <TableCell>79-84</TableCell>
                  <TableCell>104-109</TableCell>
                  <TableCell>69-71</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>How to measure:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bust: Measure around fullest part of chest</li>
              <li>Waist: Measure around natural waistline</li>
              <li>Hip: Measure around fullest part of hips</li>
              <li>Torso: Measure from high point shoulder over crotch to back</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {/* General Fit Notes */}
      <div className="border-t pt-4 space-y-3">
        <h4 className="font-semibold">Fit Notes</h4>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li><strong>Unisex Fit:</strong> Most GRATIS items are designed with a unisex fit. Women may want to size down for a more fitted look.</li>
          <li><strong>Oversized Style:</strong> Some hoodies and tees are designed for an oversized streetwear fit. Check product description.</li>
          <li><strong>Collaboration Pieces:</strong> Nike and McDonald's collab items follow standard athletic sizing.</li>
          <li><strong>Between Sizes:</strong> If between sizes, we recommend sizing up for a relaxed fit, size down for fitted.</li>
          <li><strong>Headwear:</strong> Caps and bucket hats are one-size-fits-most with adjustable features. Beanies stretch to fit.</li>
        </ul>
      </div>

      {/* Return Policy */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Free exchanges within 30 days.</strong> Not the right size? We'll exchange it at no cost. Items must be unworn with tags attached.
        </AlertDescription>
      </Alert>
    </div>
  );
}
