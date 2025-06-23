<script lang="ts">
  import type { Location } from '$lib/types';
  import type { Feature, Point } from 'geojson';
  import mapboxgl, { type Map } from 'mapbox-gl';
  import { onDestroy, onMount } from 'svelte';
  import circle from '@turf/circle';

  const CENTER: [number, number] = [-98.5795, 39.8283];
  const MAP_BOUNDS: mapboxgl.LngLatBoundsLike = [
    [-125, 24.5],
    [-66.5, 49.5]
  ];
  const SOURCE1 = 'selected-location-centroid';
  const SOURCE2 = 'search-radius-circle';
  const SOURCE3 = 'search-location-centroids';

  interface Props {
    class: string;
    searchLocations: Location[];
    searchRadius: number;
    selectedLocation: Location | null;
  }

  const {
    class: className = '',
    searchLocations,
    searchRadius,
    selectedLocation
  }: Props = $props();

  let isMapLoaded = $state<boolean>(false);
  let map = $state<Map>();
  let mapContainer = $state<HTMLDivElement>();

  $effect(() => {
    if (isMapLoaded && selectedLocation) {
      setLocationPoint(selectedLocation);
      setSearchRadiusCircle(selectedLocation);
      const zoom = searchRadius === 25 ? 8 : searchRadius === 10 ? 9 : 10;
      map!.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom
      });
    }
  });

  $effect(() => {
    if (isMapLoaded && searchLocations) {
      setSearchRadiusLocationPoints(searchLocations);
    }
  });

  onMount(() => {
    initialize();
  });

  onDestroy(() => {
    map?.off('load', onMapLoad);
  });

  function initialize() {
    map = new mapboxgl.Map({
      center: CENTER,
      container: mapContainer as HTMLDivElement,
      style: 'mapbox://styles/mapbox/dark-v11',
      maxBounds: MAP_BOUNDS
    });
    map.on('load', onMapLoad);
  }

  function onMapLoad() {
    addSource1(); // For search zip code
    addSource2(); // For search radius
    addSource3(); // For search results
    isMapLoaded = true;
  }

  function addSource1() {
    map!.addSource(SOURCE1, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    map!.addLayer({
      id: 'selected-location-layer',
      type: 'circle',
      source: SOURCE1,
      paint: {
        'circle-radius': 8,
        'circle-color': '#fba919',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
      }
    });
  }

  function addSource2() {
    map!.addSource(SOURCE2, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    map!.addLayer({
      id: 'search-radius-layer',
      type: 'fill',
      source: SOURCE2,
      paint: {
        'fill-color': '#007aff',
        'fill-opacity': 0.2
      }
    });
  }

  function addSource3() {
    map!.addSource(SOURCE3, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    map!.addLayer({
      id: 'search-locations-layer',
      type: 'circle',
      source: SOURCE3,
      paint: {
        'circle-radius': 5,
        'circle-color': '#00cc88',
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1
      }
    });
  }

  function setLocationPoint(location: Location) {
    const features: Feature<Point>[] = [
      {
        type: 'Feature',
        properties: { ...location },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        }
      }
    ];
    const source = map!.getSource(SOURCE1) as mapboxgl.GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features });
  }

  function setSearchRadiusCircle({ latitude, longitude }: Location) {
    const circlePolygon = circle([longitude, latitude], searchRadius, { units: 'miles' });
    const source = map!.getSource(SOURCE2) as mapboxgl.GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features: [circlePolygon] });
  }

  function setSearchRadiusLocationPoints(locations: Location[]) {
    const features: Feature<Point>[] = locations.map((l) => ({
      type: 'Feature',
      properties: { ...l },
      geometry: {
        type: 'Point',
        coordinates: [l.longitude, l.latitude]
      }
    }));
    const source = map!.getSource(SOURCE3) as mapboxgl.GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features });
  }
</script>

<div class="map relative {className}">
  {#if typeof window !== 'undefined'}
    <div bind:this={mapContainer} class="mapbox-map w-full h-full absolute top-0 bottom-0"></div>
  {/if}
</div>

<style>
  :global(.mapboxgl-ctrl-attrib) {
    font-size: 10px;
  }
</style>
