<script lang="ts">
  import { signIn } from '$lib/authentication';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  let email = $state<string>('');
  let name = $state<string>('');

  let isAuthenticating = $state<boolean>(false);
  let showError = $state<boolean>(false);

  async function logIn() {
    isAuthenticating = true;

    try {
      await signIn({ email, name });
    } catch (e) {
      console.error(e);
      showError = true;
    } finally {
      isAuthenticating = false;
    }
  }
</script>

<div class="splash-page flex flex-col items-center gap-3 min-h-screen justify-center">
  <h1 class="text-4xl">
    Fetch Mate
    <span class="material-icons !text-3xl relative top-[2px]">pets</span>
  </h1>

  <form class="flex flex-col gap-3 w-[260px] items-center" onsubmit={logIn}>
    <Input placeholder="Email" type="email" bind:value={email} />
    <Input placeholder="Name" type="text" bind:value={name} />
    <Button class="w-fit" disabled={isAuthenticating} type="submit">Log In</Button>
  </form>

  {#if !isAuthenticating && showError}
    <span class="text-xs text-destructive">Error: Login Failed</span>
  {/if}
</div>
