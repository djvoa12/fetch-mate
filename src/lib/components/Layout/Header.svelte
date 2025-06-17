<script lang="ts">
  import { page } from '$app/state';
  import { signOut } from '$lib/authentication';
  import { Button } from '$lib/components/ui/button';
  import { store } from '$lib/stores/app.svelte';
  import { onToggleTheme } from '$lib/utils';
  import { slide } from 'svelte/transition';

  let showDrawer = $state<boolean>(false);

  function getActiveClass(route: string) {
    return page.route.id === route ? 'orange' : '';
  }
</script>

<header class="header flex justify-between items-center bg-secondary py-3 px-8">
  <div class="flex gap-6 items-center">
    <h1 class="text-2xl">
      Fetch Mate
      <span class="material-icons relative top-[2px]">pets</span>
    </h1>
    <div class="hidden md:flex gap-4">
      <a class={getActiveClass('/')} href="/">Search</a>
      {#if store.favoriteDogs.length}
        <a class={getActiveClass('/favorites')} href="/favorites">Favorites</a>
        <a class={getActiveClass('/match')} href="/match">Match</a>
      {/if}
    </div>
  </div>

  <div class="hidden md:flex gap-4">
    <Button size="icon" variant="ghost" onclick={onToggleTheme}>
      <span class="material-icons">
        {store.isDarkTheme ? 'light_mode' : 'dark_mode'}
      </span>
    </Button>

    <Button onclick={signOut}>Log Out</Button>
  </div>

  <Button class="md:hidden" size="icon" variant="ghost" onclick={() => (showDrawer = !showDrawer)}>
    <span class="material-icons">
      {showDrawer ? 'menu_open' : 'menu'}
    </span>
  </Button>
</header>

{#if showDrawer}
  <div
    class="md:hidden nav-popup-mobile flex flex-col items-center px-sm bg-muted"
    transition:slide={{ delay: 100, duration: 250 }}
  >
    <div class="flex flex-col border-b w-full">
      <a class="{getActiveClass('/')} py-2" href="/">Search</a>
      {#if store.favoriteDogs.length}
        <a class="{getActiveClass('/favorites')} py-2" href="/favorites">Favorites</a>
        <a class="{getActiveClass('/match')} py-2" href="/match">Match</a>
      {/if}
    </div>

    <Button class="w-full my-1" variant="ghost" onclick={onToggleTheme}>
      <span class="material-icons">
        {store.isDarkTheme ? 'light_mode' : 'dark_mode'}
      </span>
      Switch to {store.isDarkTheme ? 'Light' : 'Dark'} Theme
    </Button>

    <Button class="w-full my-1" variant="ghost" onclick={signOut}>
      <span class="material-icons">logout</span>
      Log Out
    </Button>
  </div>
{/if}

<style>
  .nav-popup-mobile {
    left: 0;
    position: fixed;
    text-align: center;
    top: 60px;
    width: 100%;
    z-index: 1;
  }
</style>
