<script lang="ts">
  import { goto } from '$app/navigation';
  import AgTable from '$lib/components/Table/AgTable.svelte';
  import { Button } from '$lib/components/ui/button';
  import { store } from '$lib/stores/app.svelte';
  import type { ICellRendererParams } from 'ag-grid-community';
  import { onMount } from 'svelte';

  const COL_DEFS = [
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
      minWidth: 120,
      sortable: false
    },
    {
      field: 'breed',
      flex: 1,
      headerName: 'Breed',
      minWidth: 235,
      sortable: false
    },
    {
      field: 'age',
      flex: 1,
      headerName: 'Age',
      minWidth: 70,
      sortable: false
    },
    {
      field: 'zip_code',
      flex: 1,
      headerName: 'Zip Code',
      minWidth: 100,
      sortable: false
    },
    {
      cellRenderer: ({ data }: ICellRendererParams) => {
        return `<button
          <span class="material-icons text-destructive mt-2 cursor-pointer" onclick="event.stopPropagation();removeFavDog('${data.id}')">
            close
          </span>
        </button>`;
      },
      maxWidth: 60,
      minWidth: 60,
      sortable: false
    }
  ];

  onMount(() => {
    if (store.favoriteDogs.length) {
      window.removeFavDog = (dogId: string) => {
        store.favoriteDogs = store.favoriteDogs.filter((d) => d.id !== dogId);
      };
    } else {
      goto('/');
    }
  });
</script>

<div class="favorites flex flex-col w-[750px] m-auto h-full">
  <div class="border-b mb-4">
    <h1 class="mb-2">
      <span class="orange">Step 2:</span>
      Review your pups and fetch!
    </h1>
  </div>

  <div class="toolbar flex mb-4 justify-between flex-wrap">
    <Button variant="link" onclick={() => goto('/')}>
      <span class="material-icons">arrow_back</span>
    </Button>

    <div class="flex gap-2">
      <Button
        variant="destructive"
        onclick={() => {
          store.favoriteDogs = [];
        }}
      >
        Clear All
      </Button>

      <Button disabled={!store.favoriteDogs.length} onclick={() => goto('/match')}
        >Fetch Mate</Button
      >
    </div>
  </div>

  <div class="flex flex-col flex-1 min-h-[500px]">
    <AgTable columnDefs={COL_DEFS} rowData={store.favoriteDogs} />
  </div>
</div>
