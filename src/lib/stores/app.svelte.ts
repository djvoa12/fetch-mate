import type { Dog } from '$lib/types';

class Store {
  public favoriteDogs = $state<Dog[]>([]);
  public isAuthenticated = $state<boolean>(false);
  public isDarkTheme = $state<boolean>(true);

  public favoriteDogIds = $derived(new Set(this.favoriteDogs.map((d) => d.id)));
}

export const store = new Store();
