<script lang="ts">
  import { store } from '$lib/stores/app.svelte';
  import type { Dog, TableRow } from '$lib/types';
  import {
    AllCommunityModule,
    ModuleRegistry,
    createGrid,
    provideGlobalGridOptions
  } from 'ag-grid-community';
  import type { AgColumn, ColDef, GridApi, GridOptions, SortDirection } from 'ag-grid-community';
  import { onMount } from 'svelte';

  ModuleRegistry.registerModules([AllCommunityModule]);
  provideGlobalGridOptions({ theme: 'legacy' });

  interface Props {
    class?: string;
    columnDefs: ColDef[];
    gridOptions?: GridOptions;
    isLoading?: boolean;
    rowData: TableRow[];
    onSelect?: (dogs: Dog[]) => void;
    onSort?: (colId: string, direction: SortDirection) => void;
  }

  let {
    class: className = '',
    columnDefs,
    gridOptions = {
      domLayout: 'autoHeight',
      getRowId: (params) => params.data.id,
      rowSelection: 'multiple',
      suppressRowClickSelection: true,
      onSelectionChanged: ({ api }) => {
        if (onSelect) {
          const selectedNodes = api.getSelectedNodes();
          const selectedDogs = selectedNodes.map((node) => node.data);
          onSelect(selectedDogs);
        }
      },
      onSortChanged: (e) => {
        if (onSort) {
          const sortColumn = (e.columns as AgColumn[]).find(
            (c) => c.sort !== undefined
          ) as AgColumn;
          onSort(sortColumn.colId, sortColumn.sort as SortDirection);
        }
      }
    },
    isLoading = false,
    onSelect,
    onSort,
    rowData
  }: Props = $props();

  let gridApi = $state<GridApi | undefined>();
  let gridContainer = $state<HTMLDivElement | undefined>();

  $effect(() => {
    if (gridContainer && gridApi && rowData) {
      gridApi.setGridOption('rowData', rowData);
    }
  });

  $effect(() => {
    if (gridApi) gridApi.setGridOption('loading', isLoading);
  });

  onMount(() => {
    gridOptions.columnDefs = columnDefs;
    gridOptions.rowData = rowData;
    gridApi = createGrid(gridContainer!, gridOptions);
  });
</script>

<div
  class="table {store.isDarkTheme ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'} {className}"
  bind:this={gridContainer}
></div>
