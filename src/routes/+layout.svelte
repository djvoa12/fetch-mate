<script lang="ts">
  import '../app.css';
  import { validateAuth } from '$lib/authentication';
  import Header from '$lib/components/Layout/Header.svelte';
  import Loader from '$lib/components/Loader/Loader.svelte';
  import LoginForm from '$lib/components/Login/LoginForm.svelte';
  import { store } from '$lib/stores/app.svelte';
  import { setTheme } from '$lib/utils';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    store.isAuthenticated = validateAuth();
    store.showSplashPage = !store.isAuthenticated;
    setTheme();
  });
</script>

<svelte:head>
  <title>Fetch Mate</title>
  <meta name="Fetch Mate" content="Fetch Mate" />
</svelte:head>

{#if store.isAuthenticated}
  <div class="app">
    <Header />

    <main class="py-4 px-8">
      {@render children()}
    </main>
  </div>
{:else if store.showSplashPage}
  <LoginForm />
{:else}
  <div class="h-screen flex items-center justify-center">
    <Loader />
  </div>
{/if}
