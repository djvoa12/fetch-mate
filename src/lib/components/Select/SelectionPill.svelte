<script lang="ts">
  import { Button } from '$lib/components/ui/button';

  interface Props {
    count: number;
    onClear: () => void;
  }

  let { count, onClear }: Props = $props();
</script>

<Button class="selection-pill {count === 0 ? 'hidden' : ''}" size="sm" onclick={onClear}>
  <span class="text-xs">{count}</span>
  <span class="material-icons !text-sm">close</span>
</Button>

<style>
  :global(.selection-pill) {
    gap: 6px !important;
    height: 26px !important;
    margin-right: 0.5rem;
    padding: 0.5rem !important;
  }
</style>
