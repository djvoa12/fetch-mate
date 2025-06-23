<script lang="ts">
  import { goto } from '$app/navigation';
  import { getDogs, matchDog } from '$lib/api';
  import Loader from '$lib/components/Loader/Loader.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { store } from '$lib/stores/app.svelte';
  import { onMount } from 'svelte';

  let isLoading = $state<boolean>(false);

  onMount(() => {
    if (!store.favoriteDogs.length) {
      goto('/');
    } else if (!store.matchedDog) {
      findMyMate();
    }
  });

  async function findMyMate() {
    isLoading = true;

    try {
      const dogIds = store.favoriteDogIds;
      const matchedDogId = await matchDog([...dogIds]);
      const matchedDogs = await getDogs([matchedDogId]);
      store.matchedDog = matchedDogs[0];
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex flex-col max-w-[450px] m-auto">
  {#if store.matchedDog}
    <h1 class="text-center mb-4">
      You've been matched!
      <span class="material-icons relative top-[5px] orange">pets</span>
    </h1>
  {/if}

  <Card.Root class="w-fit m-auto min-w-[300px] min-h-[300px]">
    {#if isLoading}
      <Loader />
    {:else if store.matchedDog}
      <Card.Header>
        <Card.Title>{store.matchedDog.name}</Card.Title>
        <Card.Description>{store.matchedDog.breed}</Card.Description>
      </Card.Header>
      <Card.Content class="flex flex-col gap-2">
        <img src={store.matchedDog.img} alt="dog profile" />
        <p class="text-sm">Age: {store.matchedDog.age}</p>
        <p class="text-sm">Zip Code: {store.matchedDog.zip_code}</p>
      </Card.Content>
    {/if}
  </Card.Root>

  <Button class="m-auto mt-4" disabled={isLoading} onclick={findMyMate}>Fetch Another!</Button>
</div>
