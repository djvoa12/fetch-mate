class Store {
  public isAuthenticated = $state(false);
  public isDarkTheme = $state(true);
}

export const store = new Store();
