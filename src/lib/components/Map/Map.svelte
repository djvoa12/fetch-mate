<script lang="ts">
  import { store } from '$lib/stores/app.svelte';
  import type { Location } from '$lib/types';
  import circle from '@turf/circle';
  import type { Feature, Point } from 'geojson';
  import mapboxgl from 'mapbox-gl';
  import type {
    GeoJSONFeature,
    GeoJSONSource,
    LngLatBoundsLike,
    LngLatLike,
    Map,
    MapMouseEvent
  } from 'mapbox-gl';
  import { onDestroy, onMount } from 'svelte';

  const CENTER: [number, number] = [-98.5795, 39.8283];
  const MAP_BOUNDS: LngLatBoundsLike = [
    [-125, 24.5],
    [-66.5, 49.5]
  ];
  const SOURCE1 = 'selected-location-centroid';
  const SOURCE2 = 'search-radius-circle';
  const SOURCE3 = 'search-location-centroids';
  const LAYER1 = 'selected-location-layer';
  const LAYER2 = 'search-locations-layer';
  const LAYER_IDS = [LAYER1, LAYER2];

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

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

  let mapStyle: 'dark-v11' | 'light-v11' = store.isDarkTheme ? 'dark-v11' : 'light-v11';

  let isMapLoaded = $state<boolean>(false);
  let map = $state<Map>();
  let mapContainer = $state<HTMLDivElement>();

  $effect(() => {
    const newStyle = store.isDarkTheme ? 'dark-v11' : 'light-v11';

    if (isMapLoaded && mapStyle !== newStyle) {
      map!.once('style.load', onChangeTheme);
      map!.setStyle(`mapbox://styles/mapbox/${newStyle}`);
      mapStyle = newStyle;
    }
  });

  function onChangeTheme() {
    addSource1();
    addSource2();
    addSource3();

    if (selectedLocation) {
      setLocationPoint(selectedLocation);
      setSearchRadiusCircle(selectedLocation);
    }

    if (searchLocations) {
      setSearchRadiusLocationPoints(searchLocations);
    }
  }

  $effect(() => {
    if (isMapLoaded) {
      if (selectedLocation) {
        setLocationPoint(selectedLocation);
        setSearchRadiusCircle(selectedLocation);
        const zoom = searchRadius === 25 ? 8 : searchRadius === 10 ? 9 : 10;
        map!.flyTo({
          center: [selectedLocation.longitude, selectedLocation.latitude],
          zoom
        });
      } else {
        resetMap();
      }
    }
  });

  function resetMap() {
    const source1 = map!.getSource(SOURCE1) as GeoJSONSource;
    const source2 = map!.getSource(SOURCE2) as GeoJSONSource;
    const source3 = map!.getSource(SOURCE3) as GeoJSONSource;
    source1.setData({ type: 'FeatureCollection', features: [] });
    source2.setData({ type: 'FeatureCollection', features: [] });
    source3.setData({ type: 'FeatureCollection', features: [] });
  }

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
    map?.off('mouseenter', LAYER_IDS, onMouseEnterLocation);
    map?.off('mouseleave', LAYER_IDS, onMouseLeaveLocation);
  });

  function initialize() {
    map = new mapboxgl.Map({
      center: CENTER,
      container: mapContainer as HTMLDivElement,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      maxBounds: MAP_BOUNDS
    });
    map.on('load', onMapLoad);
    map.on('mouseenter', LAYER_IDS, onMouseEnterLocation);
    map.on('mouseleave', LAYER_IDS, onMouseLeaveLocation);
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
      id: LAYER1,
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
      id: LAYER2,
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
        id: 1,
        properties: { ...location },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        }
      }
    ];
    const source = map!.getSource(SOURCE1) as GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features });
  }

  function setSearchRadiusCircle({ latitude, longitude }: Location) {
    const circlePolygon = circle([longitude, latitude], searchRadius, { units: 'miles' });
    const source = map!.getSource(SOURCE2) as GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features: [circlePolygon] });
  }

  function setSearchRadiusLocationPoints(locations: Location[]) {
    const features: Feature<Point>[] = locations.map((l, i) => ({
      type: 'Feature',
      id: i + 1,
      properties: { ...l },
      geometry: {
        type: 'Point',
        coordinates: [l.longitude, l.latitude]
      }
    }));
    const source = map!.getSource(SOURCE3) as GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features });
  }

  function onMouseEnterLocation(e: MapMouseEvent) {
    map!.getCanvas().style.cursor = 'pointer';
    const features = e.features as GeoJSONFeature[];
    const geometry = features[0].geometry as Point;
    const coordinates = geometry.coordinates.slice();
    const props = features[0].properties;
    popup
      .setLngLat(coordinates as LngLatLike)
      .setHTML(
        `<div class="popup">
          <div>
            <span class="label text-xs">City:</span>
            <span class="value text-xs">${props?.city}</span>
          </div>
          <div>
            <span class="label text-xs">Zip Code:</span>
            <span class="value text-xs">${props?.zip_code}</span>
          </div>
          <div>
            <span class="label text-xs">County:</span>
            <span class="value text-xs">${props?.county}</span>
          </div>
          <div>
            <span class="label text-xs">State:</span>
            <span class="value text-xs">${props?.state}</span>
          </div>
        </div>`
      )
      .addTo(map!);
  }

  function onMouseLeaveLocation() {
    map!.getCanvas().style.cursor = '';
    popup.remove();
  }
</script>

<div class="map relative {className}">
  {#if typeof window !== 'undefined'}
    <div bind:this={mapContainer} class="mapbox-map w-full h-full"></div>
  {/if}
</div>

<style>
  :global(.mapboxgl-ctrl-attrib) {
    font-size: 10px;
  }

  :global(.mapboxgl-popup-content) {
    background: var(--muted);
  }

  :global(.mapboxgl-popup-tip) {
    border-top-color: var(--muted) !important;
  }
</style>
