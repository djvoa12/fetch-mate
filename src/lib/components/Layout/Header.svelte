<script lang="ts">
  import { page } from '$app/state';
  import { signOut } from '$lib/authentication';
  import { Button } from '$lib/components/ui/button';
  import { store } from '$lib/stores/app.svelte';
  import { onToggleTheme } from '$lib/utils';

  function getActiveClass(route: string) {
    return page.route.id === route ? 'text-[var(--fetch-orange)]' : '';
  }
</script>

<header class="header flex justify-between items-center bg-secondary py-3 px-8">
  <div class="flex gap-6 items-center">
    <h1 class="text-2xl">
      Fetch Mate
      <span class="material-icons relative top-[2px]">pets</span>
    </h1>
    <a class={getActiveClass('/')} href="/">Search</a>
    {#if store.favoriteDogs.length}
      <a class={getActiveClass('/favorites')} href="/favorites">Favorites</a>
      <a class={getActiveClass('/match')} href="/match">Match</a>
    {/if}
  </div>

  <div class="flex gap-4">
    <Button size="icon" variant="ghost" onclick={onToggleTheme}>
      <span class="material-icons">
        {store.isDarkTheme ? 'light_mode' : 'dark_mode'}
      </span>
    </Button>

    <Button onclick={signOut}>Log Out</Button>
  </div>
</header>
