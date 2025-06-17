<script lang="ts">
  import { getDogs, matchDog } from '$lib/api';
  import Loader from '$lib/components/Loader/Loader.svelte';
  import * as Card from '$lib/components/ui/card';
  import type { Dog } from '$lib/types';
  import { store } from '$lib/stores/app.svelte';
  import { onMount } from 'svelte';

  let isLoading = $state<boolean>(true);
  let matchedDog = $state<Dog | null>(null);

  onMount(() => {
    findMyMate();
  });

  async function findMyMate() {
    try {
      const dogIds = store.favoriteDogIds;
      const matchedDogId = await matchDog([...dogIds]);
      const matchedDogs = await getDogs([matchedDogId]);
      matchedDog = matchedDogs[0];
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  }
</script>

{#if matchedDog}
  <h1 class="text-center mb-4">
    You've been matched!
    <span class="material-icons relative top-[5px] orange">pets</span>
  </h1>
{/if}

<Card.Root class="w-fit m-auto min-w-[350px] min-h-[350px]">
  {#if isLoading}
    <Loader />
  {:else if matchedDog}
    <Card.Header>
      <Card.Title>{matchedDog.name}</Card.Title>
      <Card.Description>{matchedDog.breed}</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col gap-2">
      <img src={matchedDog.img} alt="dog profile" />
      <p class="text-sm">Age: {matchedDog.age}</p>
      <p class="text-sm">Zip Code: {matchedDog.zip_code}</p>
    </Card.Content>
  {/if}
</Card.Root>
