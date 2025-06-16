<script lang="ts">
  import { signOut } from '$lib/authentication';
  import { Button } from '$lib/components/ui/button';
  import { store } from '$lib/stores/app.svelte';
  import { onToggleTheme } from '$lib/utils';
</script>

<header class="header flex justify-between items-center bg-secondary py-3 px-8">
  <h1 class="text-2xl">
    Fetch Mate
    <span class="material-icons relative top-[2px]">pets</span>
  </h1>

  <div class="flex gap-4">
    <Button size="icon" variant="ghost" onclick={onToggleTheme}>
      <span class="material-icons">
        {store.isDarkTheme ? 'light_mode' : 'dark_mode'}
      </span>
    </Button>

    <Button onclick={signOut}>Log Out</Button>
  </div>
</header>
