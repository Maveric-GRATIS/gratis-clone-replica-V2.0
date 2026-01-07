import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Database } from '@/integrations/supabase/types';

type DistributionLocation = Database['public']['Tables']['distribution_locations']['Row'];

interface DistributionMapProps {
  locations: DistributionLocation[];
  height?: string;
}

export default function DistributionMap({ locations, height = "600px" }: DistributionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (!token) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [5.1214, 52.0907], // Center on Utrecht, Netherlands
      zoom: 5,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add markers and heat map data when map loads
  useEffect(() => {
    if (!map.current || !mapLoaded || locations.length === 0) return;

    // Remove existing layers and sources
    if (map.current.getLayer('distribution-heat')) {
      map.current.removeLayer('distribution-heat');
    }
    if (map.current.getSource('distribution-locations')) {
      map.current.removeSource('distribution-locations');
    }

    // Create GeoJSON for heat map
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: locations
        .filter(loc => loc.latitude && loc.longitude)
        .map(location => ({
          type: 'Feature',
          properties: {
            total_distributed: location.total_distributed || 0,
          },
          geometry: {
            type: 'Point',
            coordinates: [Number(location.longitude), Number(location.latitude)],
          },
        })),
    };

    // Add source
    map.current.addSource('distribution-locations', {
      type: 'geojson',
      data: geojsonData,
    });

    // Add heat map layer
    map.current.addLayer({
      id: 'distribution-heat',
      type: 'heatmap',
      source: 'distribution-locations',
      paint: {
        // Increase weight as total_distributed increases
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'total_distributed'],
          0, 0,
          10000, 0.5,
          70000, 1
        ],
        // Increase intensity as zoom level increases
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3
        ],
        // Color ramp for heatmap
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        // Radius of each "point" of the heatmap
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 15,
          9, 40
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          9, 0.5
        ],
      },
    });

    // Add markers for each location
    locations.forEach(location => {
      if (!location.latitude || !location.longitude) return;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjgiIGZpbGw9IiMzYjgyZjYiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1f2937;">${location.name}</h3>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">${location.city}, ${location.country}</p>
          <p style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">📍 ${location.address || 'N/A'}</p>
          <p style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">🕒 ${location.distribution_hours || 'N/A'}</p>
          <p style="font-size: 14px; font-weight: bold; color: #3b82f6; margin-top: 8px;">
            ${(location.total_distributed || 0).toLocaleString()} bottles distributed
          </p>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([Number(location.longitude), Number(location.latitude)])
        .setPopup(popup)
        .addTo(map.current!);
    });

  }, [mapLoaded, locations]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-gray-800" style={{ height }}>
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading distribution map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
