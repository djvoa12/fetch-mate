<script lang="ts">
  import '../app.css';
  import { signIn } from '$lib/authentication';
  import Header from '$lib/components/Layout/Header.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { store } from '$lib/stores/app.svelte';
  import { setTheme } from '$lib/utils';
  import { onMount } from 'svelte';

  let { children } = $props();

  let isAuthenticating = $state<boolean>(false);

  let email = $state<string>('');
  let name = $state<string>('');

  onMount(() => {
    setTheme();
  });

  async function logIn() {
    isAuthenticating = true;
    await signIn({ email, name });
    isAuthenticating = false;
  }
</script>

<svelte:head>
  <title>Fetch Mate</title>
  <meta name="Fetch Mate" content="Fetch Mate" />
</svelte:head>

{#if store.isAuthenticated}
  <div class="app">
    <Header />

    <main class="py-4 px-8 max-w-[1000px] m-auto">
      {@render children()}
    </main>
  </div>
{:else}
  <div class="splash-page flex flex-col items-center gap-3 min-h-screen justify-center">
    <h1 class="text-4xl">
      Fetch Mate
      <span class="material-icons !text-3xl relative top-[2px]">pets</span>
    </h1>

    <Input class="max-w-xs" placeholder="Email" type="email" bind:value={email} />

    <Input class="max-w-xs" placeholder="Name" type="text" bind:value={name} />

    <Button disabled={isAuthenticating} onclick={logIn}>Log In</Button>
  </div>
{/if}
