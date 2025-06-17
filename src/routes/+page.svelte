<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    getAllBreeds,
    getDogs,
    queryDogIds,
    queryLocations,
    queryLocationsByZipCodes
  } from '$lib/api';
  import AgTable from '$lib/components/Table/AgTable.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Pagination from '$lib/components/ui/pagination';
  import * as Select from '$lib/components/ui/select';
  import { Slider } from '$lib/components/ui/slider';
  import { store } from '$lib/stores/app.svelte';
  import type { Dog, Location } from '$lib/types';
  import type { ICellRendererParams, SortDirection } from 'ag-grid-community';
  import { onMount } from 'svelte';

  const AGE_MIN = 0;
  const AGE_MAX = 20;
  const PAGE_SIZE = 25;
  const COL_DEFS = [
    {
      field: 'checked',
      cellRenderer: (params: ICellRendererParams) => {
        if (params.value) params.node.setSelected(true);
        return params.value;
      },
      checkboxSelection: true,
      headerName: '',
      maxWidth: 50,
      minWidth: 50
    },
    {
      autoHeight: true,
      cellRenderer: ({ value }: ICellRendererParams) => {
        return `<img src="${value}" alt="dog profile" />`;
      },
      field: 'img',
      flex: 1,
      headerName: '',
      minWidth: 140,
      sortable: false
    },
    {
      field: 'name',
      flex: 1,
      headerName: 'Name',
      minWidth: 120
    },
    {
      field: 'breed',
      flex: 1,
      headerName: 'Breed',
      minWidth: 235
    },
    {
      field: 'age',
      flex: 1,
      headerName: 'Age',
      minWidth: 70
    },
    {
      field: 'zip_code',
      flex: 1,
      headerName: 'Zip Code',
      minWidth: 100,
      sortable: false
    }
  ];

  let sort: string = 'breed:asc';
  let zipCodes: string[] = [];

  let ageRange = $state<[number, number]>([AGE_MIN, AGE_MAX]);
  let breeds = $state<string[]>([]);
  let count = $state<number>(0);
  let dogs = $state<Dog[]>([]);
  let isLoading = $state<boolean>(false);
  let page = $state<number>(1);
  let selectedBreeds = $state<string[]>([]);
  let zipCode = $state<string>('');

  onMount(() => {
    fetchAllBreeds();
    queryDogs({ sort });
  });

  async function fetchAllBreeds() {
    try {
      breeds = await getAllBreeds();
    } catch (e) {
      console.error(e);
    }
  }

  async function queryDogs(queryParams: Record<string, string | number | string[]>) {
    isLoading = true;

    try {
      const { resultIds, total } = await queryDogIds(queryParams);
      count = total;
      const fetchedDogs = await getDogs(resultIds);
      dogs = fetchedDogs.map((dog) => ({
        ...dog,
        checked: store.favoriteDogIds.has(dog.id)
      }));
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  function generateQueryParams() {
    return {
      ageMax: ageRange[1],
      ageMin: ageRange[0],
      breeds: selectedBreeds,
      from: (page - 1) * PAGE_SIZE,
      sort,
      zipCodes
    };
  }

  function sortDogs(colId: string, direction: SortDirection) {
    sort = direction === null ? 'breed:asc' : `${colId}:${direction}`;
    const params = generateQueryParams();
    queryDogs(params);
  }

  function selectDogs(selectedDogs: Dog[]) {
    const currentPageDogIds = new Set(dogs.map((d) => d.id));
    // Remove dogs from store that are on the current page but not selected
    const keptDogs = store.favoriteDogs.filter((dog) => !currentPageDogIds.has(dog.id));
    const newFavorites = [...keptDogs, ...selectedDogs];
    store.favoriteDogs = newFavorites;
  }

  function generateLocationBody({ latitude, longitude }: Location) {
    const radiusInMiles = 25;
    const milesPerDegreeLat = 69;
    const milesPerDegreeLon = 69 * Math.cos(latitude * (Math.PI / 180));
    const deltaLat = radiusInMiles / milesPerDegreeLat;
    const deltaLon = radiusInMiles / milesPerDegreeLon;
    const geoBoundingBox = {
      top: latitude + deltaLat,
      bottom: latitude - deltaLat,
      left: longitude - deltaLon,
      right: longitude + deltaLon
    };
    return { geoBoundingBox, size: 10000 };
  }

  async function queryDogsByLocation() {
    isLoading = true;

    try {
      const [location] = await queryLocationsByZipCodes([zipCode]);

      if (location) {
        const body = generateLocationBody(location);
        const locations = await queryLocations(body);
        zipCodes = locations.map((r) => r.zip_code);
        const params = generateQueryParams();
        queryDogs(params);
      } else {
        dogs = [];
      }
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex justify-between mb-4 border-b pb-2 items-center">
  <h1 class="mb-2">
    <span class="orange">Step 1:</span>
    Select your favorites wagsters!
  </h1>

  <div class="flex gap-4 items-center">
    {#if store.favoriteDogs.length}
      <span>{store.favoriteDogs.length} selected</span>
    {/if}
    <Button disabled={!store.favoriteDogs.length} onclick={() => goto('/favorites')}>Next</Button>
  </div>
</div>

<div class="toolbar flex mb-4 items-start flex-wrap gap-3">
  <div class="flex flex-col gap-1">
    <label class="text-xs" for="breed-type-multi-select">Breed Type</label>

    <Select.Root
      type="multiple"
      bind:value={selectedBreeds}
      onValueChange={() => {
        const params = generateQueryParams();
        queryDogs(params);
      }}
    >
      <Select.Trigger class="w-[190px]" id="breeds-multi-select">
        <div class="flex items-center">
          <Select.SelectionPill
            count={selectedBreeds.length}
            onClear={() => {
              selectedBreeds = [];
              const params = generateQueryParams();
              queryDogs(params);
            }}
          />
          Select breeds
        </div>
      </Select.Trigger>

      <Select.Content>
        {#each breeds as breed (breed)}
          <Select.Item value={breed}>{breed}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  <div class="flex flex-col gap-1">
    <label class="text-xs" for="zip-code-input">Location</label>

    <div class="flex">
      <Input
        class="max-w-xs"
        id="zip-code-input"
        placeholder="Enter zip code"
        type="text"
        bind:value={zipCode}
        onchange={() => {
          if (zipCode.length === 5) queryDogsByLocation();
        }}
      />
    </div>
  </div>

  <div class="flex flex-col gap-1">
    <label class="text-xs" for="age-dual-slider">
      Age ({ageRange[0]} - {ageRange[1]})
    </label>

    <div class="flex gap-2 mt-2">
      <span class="text-sm">{AGE_MIN}</span>
      <Slider
        class="w-[160px]"
        id="age-dual-slider"
        max={AGE_MAX}
        step={1}
        type="multiple"
        bind:value={ageRange}
        onValueCommit={() => {
          const params = generateQueryParams();
          queryDogs(params);
        }}
      />
      <span class="text-sm">{AGE_MAX}</span>
    </div>
  </div>
</div>

<AgTable
  class="w-full mb-4"
  columnDefs={COL_DEFS}
  {isLoading}
  rowData={dogs}
  onSelect={selectDogs}
  onSort={sortDogs}
/>

<Pagination.Root
  {count}
  bind:page
  perPage={PAGE_SIZE}
  onPageChange={() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const params = generateQueryParams();
    queryDogs(params);
  }}
>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton />
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === 'ellipsis'}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
